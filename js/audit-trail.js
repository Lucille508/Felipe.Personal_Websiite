// ===================================
// WEBSITE AUDIT TRAIL SYSTEM
// Track visitor activity and analytics
// ===================================

// Configuration
const auditConfig = {
    enabled: true,
    apiEndpoint: '/api/audit', // Change to your backend endpoint
    localStorageKey: 'portfolio_audit',
    sessionStorageKey: 'portfolio_session',
    trackPageViews: true,
    trackClicks: true,
    trackFormSubmissions: true,
    trackScrollDepth: true,
    trackTimeOnPage: true,
    respectDoNotTrack: false, // COLLECT ALL DATA - ignore DNT
    anonymizeIP: false, // COLLECT REAL IP ADDRESSES
    collectFormData: true, // COLLECT FORM VALUES
    collectPersonalInfo: true // COLLECT ALL PERSONAL INFO
};

// Audit Trail Manager
class AuditTrail {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.pageLoadTime = Date.now();
        this.events = [];
        this.maxScrollDepth = 0;
        this.init();
    }

    // Initialize audit trail
    init() {
        // Check if tracking is allowed
        if (!this.isTrackingAllowed()) {
            console.log('Tracking disabled (Do Not Track enabled)');
            return;
        }

        if (auditConfig.enabled) {
            this.trackPageView();
            this.setupEventListeners();
            this.startSessionTimer();
            console.log('✅ Audit trail initialized');
        }
    }

    // Check if tracking is allowed
    isTrackingAllowed() {
        // ALWAYS TRACK - ignore Do Not Track
        return true;
    }

    // Generate unique session ID
    generateSessionId() {
        const existing = sessionStorage.getItem(auditConfig.sessionStorageKey);
        if (existing) {
            return existing;
        }
        
        const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem(auditConfig.sessionStorageKey, sessionId);
        return sessionId;
    }

    // Get visitor information (FULL DATA COLLECTION)
    getVisitorInfo() {
        return {
            sessionId: this.sessionId,
            timestamp: new Date().toISOString(),
            page: {
                url: window.location.href,
                path: window.location.pathname,
                title: document.title,
                referrer: document.referrer || 'direct',
                queryParams: window.location.search
            },
            browser: {
                userAgent: navigator.userAgent,
                language: navigator.language,
                languages: navigator.languages,
                platform: navigator.platform,
                screenResolution: `${screen.width}x${screen.height}`,
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                colorDepth: screen.colorDepth,
                pixelDepth: screen.pixelDepth,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                cookieEnabled: navigator.cookieEnabled,
                doNotTrack: navigator.doNotTrack,
                onLine: navigator.onLine,
                hardwareConcurrency: navigator.hardwareConcurrency,
                deviceMemory: navigator.deviceMemory,
                connection: this.getConnectionInfo()
            },
            device: {
                type: this.getDeviceType(),
                isMobile: /Mobile|Android|iPhone/i.test(navigator.userAgent),
                isTablet: /Tablet|iPad/i.test(navigator.userAgent),
                touchPoints: navigator.maxTouchPoints
            },
            location: this.getLocationInfo(), // Get geolocation if available
            fingerprint: this.generateFingerprint() // Browser fingerprint
        };
    }

    // Get connection information
    getConnectionInfo() {
        const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (conn) {
            return {
                effectiveType: conn.effectiveType,
                downlink: conn.downlink,
                rtt: conn.rtt,
                saveData: conn.saveData
            };
        }
        return null;
    }

    // Get geolocation (if user allows)
    getLocationInfo() {
        // This will be populated asynchronously
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const locationData = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: position.timestamp
                    };
                    
                    // Log location separately
                    this.logEvent({
                        type: 'geolocation',
                        sessionId: this.sessionId,
                        timestamp: new Date().toISOString(),
                        location: locationData
                    });
                },
                (error) => {
                    console.log('Geolocation not available:', error.message);
                }
            );
        }
        return 'requesting...';
    }

    // Generate browser fingerprint
    generateFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('fingerprint', 2, 2);
        
        return {
            canvas: canvas.toDataURL(),
            plugins: Array.from(navigator.plugins).map(p => p.name),
            fonts: this.detectFonts(),
            audio: this.getAudioFingerprint()
        };
    }

    // Detect installed fonts
    detectFonts() {
        const baseFonts = ['monospace', 'sans-serif', 'serif'];
        const testFonts = ['Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia'];
        const detected = [];
        
        testFonts.forEach(font => {
            if (this.isFontAvailable(font, baseFonts)) {
                detected.push(font);
            }
        });
        
        return detected;
    }

    // Check if font is available
    isFontAvailable(font, baseFonts) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const text = 'mmmmmmmmmmlli';
        
        ctx.font = '72px ' + baseFonts[0];
        const baseWidth = ctx.measureText(text).width;
        
        ctx.font = '72px ' + font + ', ' + baseFonts[0];
        const testWidth = ctx.measureText(text).width;
        
        return baseWidth !== testWidth;
    }

    // Get audio fingerprint
    getAudioFingerprint() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const analyser = audioContext.createAnalyser();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(analyser);
            analyser.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            return {
                sampleRate: audioContext.sampleRate,
                state: audioContext.state,
                maxChannelCount: audioContext.destination.maxChannelCount
            };
        } catch (e) {
            return null;
        }
    }

    // Determine device type
    getDeviceType() {
        const ua = navigator.userAgent;
        if (/Mobile|Android|iPhone/i.test(ua)) return 'mobile';
        if (/Tablet|iPad/i.test(ua)) return 'tablet';
        return 'desktop';
    }

    // Track page view
    trackPageView() {
        if (!auditConfig.trackPageViews) return;

        const event = {
            type: 'page_view',
            ...this.getVisitorInfo()
        };

        this.logEvent(event);
        this.sendToBackend(event);
    }

    // Track click events - FULL DETAILS
    trackClick(element, eventName) {
        if (!auditConfig.trackClicks) return;

        const event = {
            type: 'click',
            sessionId: this.sessionId,
            timestamp: new Date().toISOString(),
            element: {
                tag: element.tagName,
                id: element.id || null,
                class: element.className || null,
                text: element.textContent || null, // FULL TEXT
                href: element.href || null,
                innerHTML: element.innerHTML?.substring(0, 200) || null, // HTML content
                attributes: this.getElementAttributes(element)
            },
            eventName: eventName,
            page: window.location.pathname,
            mousePosition: this.lastMousePosition
        };

        this.logEvent(event);
        this.sendToBackend(event);
    }

    // Get all element attributes
    getElementAttributes(element) {
        const attrs = {};
        for (let attr of element.attributes) {
            attrs[attr.name] = attr.value;
        }
        return attrs;
    }

    // Track form submissions - COLLECT ALL FORM DATA
    trackFormSubmission(formId, formData) {
        if (!auditConfig.trackFormSubmissions) return;

        const event = {
            type: 'form_submission',
            sessionId: this.sessionId,
            timestamp: new Date().toISOString(),
            formId: formId,
            formData: formData, // FULL FORM DATA INCLUDING VALUES
            page: window.location.pathname
        };

        this.logEvent(event);
        this.sendToBackend(event);
    }

    // Track scroll depth
    trackScrollDepth() {
        if (!auditConfig.trackScrollDepth) return;

        const scrollPercentage = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );

        if (scrollPercentage > this.maxScrollDepth) {
            this.maxScrollDepth = scrollPercentage;

            // Track milestones (25%, 50%, 75%, 100%)
            if ([25, 50, 75, 100].includes(scrollPercentage)) {
                const event = {
                    type: 'scroll_depth',
                    sessionId: this.sessionId,
                    timestamp: new Date().toISOString(),
                    depth: scrollPercentage,
                    page: window.location.pathname
                };

                this.logEvent(event);
                this.sendToBackend(event);
            }
        }
    }

    // Track time on page
    startSessionTimer() {
        if (!auditConfig.trackTimeOnPage) return;

        // Track every 30 seconds
        setInterval(() => {
            const timeOnPage = Math.round((Date.now() - this.pageLoadTime) / 1000);
            
            const event = {
                type: 'time_on_page',
                sessionId: this.sessionId,
                timestamp: new Date().toISOString(),
                duration: timeOnPage,
                page: window.location.pathname
            };

            this.logEvent(event);
        }, 30000);

        // Track on page unload
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Math.round((Date.now() - this.pageLoadTime) / 1000);
            
            const event = {
                type: 'page_exit',
                sessionId: this.sessionId,
                timestamp: new Date().toISOString(),
                duration: timeOnPage,
                maxScrollDepth: this.maxScrollDepth,
                page: window.location.pathname
            };

            this.logEvent(event);
            this.sendToBackend(event, true); // Synchronous for page unload
        });
    }

    // Setup event listeners
    setupEventListeners() {
        // Track mouse movement
        this.lastMousePosition = { x: 0, y: 0 };
        document.addEventListener('mousemove', (e) => {
            this.lastMousePosition = { x: e.clientX, y: e.clientY };
        });

        // Track keyboard input (for analytics)
        document.addEventListener('keydown', (e) => {
            this.logEvent({
                type: 'keypress',
                sessionId: this.sessionId,
                timestamp: new Date().toISOString(),
                key: e.key,
                code: e.code,
                page: window.location.pathname
            });
        });

        // Track navigation clicks
        document.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                this.trackClick(e.target, 'navigation_click');
            });
        });

        // Track button clicks
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('click', (e) => {
                this.trackClick(e.target, 'button_click');
            });
        });

        // Track form submissions with FULL DATA
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                this.trackFormSubmission(form.id, data);
            });
        });

        // Track input changes
        document.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('change', (e) => {
                this.logEvent({
                    type: 'input_change',
                    sessionId: this.sessionId,
                    timestamp: new Date().toISOString(),
                    inputId: e.target.id,
                    inputName: e.target.name,
                    inputValue: e.target.value, // COLLECT INPUT VALUES
                    page: window.location.pathname
                });
            });
        });

        // Track scroll depth
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.trackScrollDepth();
            }, 500);
        });

        // Track project card views
        this.trackProjectViews();

        // Track section views
        this.trackSectionViews();
    }

    // Track when project cards come into view
    trackProjectViews() {
        const projectCards = document.querySelectorAll('.project-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const projectTitle = entry.target.querySelector('.project-title')?.textContent;
                    
                    const event = {
                        type: 'project_view',
                        sessionId: this.sessionId,
                        timestamp: new Date().toISOString(),
                        projectTitle: projectTitle,
                        page: window.location.pathname
                    };

                    this.logEvent(event);
                    this.sendToBackend(event);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        projectCards.forEach(card => observer.observe(card));
    }

    // Track when sections come into view
    trackSectionViews() {
        const sections = document.querySelectorAll('section[id]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const event = {
                        type: 'section_view',
                        sessionId: this.sessionId,
                        timestamp: new Date().toISOString(),
                        sectionId: entry.target.id,
                        page: window.location.pathname
                    };

                    this.logEvent(event);
                    this.sendToBackend(event);
                }
            });
        }, { threshold: 0.3 });

        sections.forEach(section => observer.observe(section));
    }

    // Log event to console and local storage
    logEvent(event) {
        this.events.push(event);
        
        // Store in localStorage for persistence
        try {
            const stored = JSON.parse(localStorage.getItem(auditConfig.localStorageKey) || '[]');
            stored.push(event);
            
            // Keep only last 100 events
            if (stored.length > 100) {
                stored.shift();
            }
            
            localStorage.setItem(auditConfig.localStorageKey, JSON.stringify(stored));
        } catch (e) {
            console.warn('Could not store audit event:', e);
        }

        // Log to console in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('📊 Audit Event:', event);
        }
    }

    // Send event to backend
    sendToBackend(event, synchronous = false) {
        // Skip if no endpoint configured
        if (!auditConfig.apiEndpoint) {
            return;
        }

        const data = JSON.stringify(event);

        if (synchronous) {
            // Use sendBeacon for page unload events
            if (navigator.sendBeacon) {
                navigator.sendBeacon(auditConfig.apiEndpoint, data);
            }
        } else {
            // Use fetch for regular events
            fetch(auditConfig.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: data
            }).catch(err => {
                console.warn('Failed to send audit event:', err);
            });
        }
    }

    // Get all stored events
    getStoredEvents() {
        try {
            return JSON.parse(localStorage.getItem(auditConfig.localStorageKey) || '[]');
        } catch (e) {
            return [];
        }
    }

    // Clear stored events
    clearStoredEvents() {
        localStorage.removeItem(auditConfig.localStorageKey);
        this.events = [];
    }

    // Get analytics summary
    getAnalyticsSummary() {
        const events = this.getStoredEvents();
        
        return {
            totalEvents: events.length,
            pageViews: events.filter(e => e.type === 'page_view').length,
            clicks: events.filter(e => e.type === 'click').length,
            formSubmissions: events.filter(e => e.type === 'form_submission').length,
            averageTimeOnPage: this.calculateAverageTime(events),
            maxScrollDepth: this.maxScrollDepth,
            deviceBreakdown: this.getDeviceBreakdown(events),
            topPages: this.getTopPages(events)
        };
    }

    // Calculate average time on page
    calculateAverageTime(events) {
        const timeEvents = events.filter(e => e.type === 'page_exit');
        if (timeEvents.length === 0) return 0;
        
        const total = timeEvents.reduce((sum, e) => sum + (e.duration || 0), 0);
        return Math.round(total / timeEvents.length);
    }

    // Get device breakdown
    getDeviceBreakdown(events) {
        const pageViews = events.filter(e => e.type === 'page_view');
        const breakdown = { desktop: 0, mobile: 0, tablet: 0 };
        
        pageViews.forEach(e => {
            const type = e.device?.type || 'desktop';
            breakdown[type]++;
        });
        
        return breakdown;
    }

    // Get top pages
    getTopPages(events) {
        const pageViews = events.filter(e => e.type === 'page_view');
        const pages = {};
        
        pageViews.forEach(e => {
            const path = e.page?.path || '/';
            pages[path] = (pages[path] || 0) + 1;
        });
        
        return Object.entries(pages)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
    }
}

// Initialize audit trail
let auditTrail;

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        auditTrail = new AuditTrail();
    });
} else {
    auditTrail = new AuditTrail();
}

// Export for use in other scripts
window.auditTrail = auditTrail;

// Console command to view analytics
window.viewAnalytics = function() {
    if (auditTrail) {
        const summary = auditTrail.getAnalyticsSummary();
        console.log('📊 Analytics Summary:', summary);
        console.log('📝 All Events:', auditTrail.getStoredEvents());
        return summary;
    }
    return null;
};

// Console command to clear analytics
window.clearAnalytics = function() {
    if (auditTrail) {
        auditTrail.clearStoredEvents();
        console.log('✅ Analytics cleared');
    }
};

console.log('📊 Audit Trail loaded. Type viewAnalytics() to see stats.');
