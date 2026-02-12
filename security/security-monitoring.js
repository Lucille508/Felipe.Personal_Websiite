// ===== SECURITY MONITORING & LOGGING MODULE =====
// This module provides security event logging and monitoring
// Helps detect and respond to security threats in real-time

// ===== SECURITY EVENT LOGGER =====
const securityLogger = {
    // Log storage (in production, send to backend)
    logs: [],
    maxLogs: 1000,
    
    // Event types
    eventTypes: {
        XSS_ATTEMPT: 'xss_attempt',
        SQL_INJECTION: 'sql_injection_attempt',
        RATE_LIMIT: 'rate_limit_exceeded',
        HONEYPOT: 'honeypot_triggered',
        INVALID_INPUT: 'invalid_input',
        FAILED_LOGIN: 'failed_login',
        SESSION_EXPIRED: 'session_expired',
        CSP_VIOLATION: 'csp_violation',
        SUSPICIOUS_ACTIVITY: 'suspicious_activity',
        FILE_UPLOAD_BLOCKED: 'file_upload_blocked',
        OPEN_REDIRECT_BLOCKED: 'open_redirect_blocked'
    },
    
    // Log security event
    log: function(eventType, details) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            eventType: eventType,
            details: details,
            userAgent: navigator.userAgent,
            url: window.location.href,
            ip: 'client-side', // Backend should log actual IP
            sessionId: this.getSessionId()
        };
        
        // Add to local storage
        this.logs.push(logEntry);
        
        // Limit log size
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
        
        // Console log in development
        if (this.isDevelopment()) {
            console.warn('Security Event:', logEntry);
        }
        
        // Send to backend for persistent logging
        this.sendToBackend(logEntry);
        
        // Check if immediate action needed
        this.checkForThreats(logEntry);
    },
    
    // Get session ID
    getSessionId: function() {
        const session = sessionStorage.getItem('portfolio_session');
        if (session) {
            try {
                return JSON.parse(session).sessionId;
            } catch (e) {
                return 'unknown';
            }
        }
        return 'no_session';
    },
    
    // Check if in development mode
    isDevelopment: function() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1';
    },
    
    // Send log to backend
    sendToBackend: function(logEntry) {
        // Only send in production
        if (this.isDevelopment()) return;
        
        // Send asynchronously, don't wait for response
        fetch('/api/security/log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify(logEntry),
            keepalive: true // Ensure log is sent even if page unloads
        }).catch(error => {
            console.error('Failed to send security log:', error);
        });
    },
    
    // Check for immediate threats
    checkForThreats: function(logEntry) {
        // Count recent events of same type
        const recentEvents = this.logs.filter(log => 
            log.eventType === logEntry.eventType &&
            Date.now() - new Date(log.timestamp).getTime() < 60000 // Last minute
        );
        
        // If too many similar events, take action
        if (recentEvents.length >= 5) {
            this.handleThreat(logEntry.eventType, recentEvents.length);
        }
    },
    
    // Handle detected threat
    handleThreat: function(eventType, count) {
        console.error(`SECURITY ALERT: ${count} ${eventType} events in last minute`);
        
        // In production, you might:
        // 1. Lock the user's session
        // 2. Require additional verification
        // 3. Notify administrators
        // 4. Temporarily block the IP (backend)
        
        // For now, just alert
        if (this.isDevelopment()) {
            alert(`Security Alert: Multiple ${eventType} attempts detected`);
        }
    },
    
    // Get logs for analysis
    getLogs: function(eventType = null, limit = 100) {
        let filtered = this.logs;
        
        if (eventType) {
            filtered = filtered.filter(log => log.eventType === eventType);
        }
        
        return filtered.slice(-limit);
    },
    
    // Export logs (for debugging)
    exportLogs: function() {
        const dataStr = JSON.stringify(this.logs, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `security-logs-${Date.now()}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }
};

// ===== SUSPICIOUS ACTIVITY DETECTOR =====
const activityMonitor = {
    // Track user behavior patterns
    patterns: {
        rapidClicks: [],
        formSubmissions: [],
        navigationAttempts: [],
        consoleAccess: 0
    },
    
    // Initialize monitoring
    init: function() {
        this.monitorRapidClicks();
        this.monitorConsoleAccess();
        this.monitorDevTools();
        this.monitorCopyPaste();
    },
    
    // Monitor rapid clicking (potential bot)
    monitorRapidClicks: function() {
        let clickCount = 0;
        let clickTimer;
        
        document.addEventListener('click', () => {
            clickCount++;
            
            clearTimeout(clickTimer);
            clickTimer = setTimeout(() => {
                if (clickCount > 20) {
                    securityLogger.log(
                        securityLogger.eventTypes.SUSPICIOUS_ACTIVITY,
                        { type: 'rapid_clicks', count: clickCount }
                    );
                }
                clickCount = 0;
            }, 1000);
        });
    },
    
    // Monitor console access (potential tampering)
    monitorConsoleAccess: function() {
        // Detect console.log override attempts
        const originalLog = console.log;
        console.log = function(...args) {
            activityMonitor.patterns.consoleAccess++;
            originalLog.apply(console, args);
        };
    },
    
    // Detect DevTools opening (informational only)
    monitorDevTools: function() {
        const threshold = 160;
        let devtoolsOpen = false;
        
        setInterval(() => {
            const widthThreshold = window.outerWidth - window.innerWidth > threshold;
            const heightThreshold = window.outerHeight - window.innerHeight > threshold;
            
            if (widthThreshold || heightThreshold) {
                if (!devtoolsOpen) {
                    devtoolsOpen = true;
                    securityLogger.log(
                        securityLogger.eventTypes.SUSPICIOUS_ACTIVITY,
                        { type: 'devtools_opened' }
                    );
                }
            } else {
                devtoolsOpen = false;
            }
        }, 1000);
    },
    
    // Monitor copy/paste in sensitive fields
    monitorCopyPaste: function() {
        const sensitiveFields = document.querySelectorAll('input[type="password"], input[type="email"]');
        
        sensitiveFields.forEach(field => {
            field.addEventListener('paste', (e) => {
                securityLogger.log(
                    securityLogger.eventTypes.SUSPICIOUS_ACTIVITY,
                    { 
                        type: 'paste_in_sensitive_field',
                        field: field.name || field.id
                    }
                );
            });
        });
    }
};

// ===== DEFACEMENT DETECTION =====
const defacementDetector = {
    // Store checksums of critical elements
    checksums: {},
    
    // Initialize
    init: function() {
        this.createChecksums();
        this.startMonitoring();
    },
    
    // Create checksums for critical elements
    createChecksums: function() {
        const criticalElements = [
            { selector: 'title', name: 'page_title' },
            { selector: '.hero-name', name: 'hero_name' },
            { selector: '.nav-brand', name: 'brand' }
        ];
        
        criticalElements.forEach(item => {
            const element = document.querySelector(item.selector);
            if (element) {
                this.checksums[item.name] = this.hashContent(element.textContent);
            }
        });
    },
    
    // Simple hash function
    hashContent: function(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash;
    },
    
    // Monitor for changes
    startMonitoring: function() {
        setInterval(() => {
            this.checkForChanges();
        }, 5000); // Check every 5 seconds
    },
    
    // Check if content has been modified
    checkForChanges: function() {
        for (const [name, originalHash] of Object.entries(this.checksums)) {
            const selector = this.getSelector(name);
            const element = document.querySelector(selector);
            
            if (element) {
                const currentHash = this.hashContent(element.textContent);
                
                if (currentHash !== originalHash) {
                    securityLogger.log(
                        securityLogger.eventTypes.SUSPICIOUS_ACTIVITY,
                        {
                            type: 'content_modification',
                            element: name,
                            originalHash: originalHash,
                            currentHash: currentHash
                        }
                    );
                    
                    // Alert in development
                    if (securityLogger.isDevelopment()) {
                        console.warn(`Content modification detected: ${name}`);
                    }
                }
            }
        });
    },
    
    // Get selector from name
    getSelector: function(name) {
        const map = {
            'page_title': 'title',
            'hero_name': '.hero-name',
            'brand': '.nav-brand'
        };
        return map[name];
    }
};

// ===== PERFORMANCE MONITORING (SECURITY RELATED) =====
const performanceMonitor = {
    // Monitor for performance anomalies that might indicate attack
    init: function() {
        this.monitorMemoryUsage();
        this.monitorNetworkRequests();
    },
    
    // Monitor memory usage (potential memory leak attack)
    monitorMemoryUsage: function() {
        if (performance.memory) {
            setInterval(() => {
                const used = performance.memory.usedJSHeapSize;
                const limit = performance.memory.jsHeapSizeLimit;
                const percentage = (used / limit) * 100;
                
                if (percentage > 90) {
                    securityLogger.log(
                        securityLogger.eventTypes.SUSPICIOUS_ACTIVITY,
                        {
                            type: 'high_memory_usage',
                            percentage: percentage.toFixed(2)
                        }
                    );
                }
            }, 30000); // Check every 30 seconds
        }
    },
    
    // Monitor network requests (potential data exfiltration)
    monitorNetworkRequests: function() {
        const originalFetch = window.fetch;
        
        window.fetch = function(...args) {
            const url = args[0];
            
            // Check if request is to external domain
            try {
                const urlObj = new URL(url, window.location.origin);
                if (urlObj.origin !== window.location.origin) {
                    securityLogger.log(
                        securityLogger.eventTypes.SUSPICIOUS_ACTIVITY,
                        {
                            type: 'external_request',
                            url: urlObj.origin
                        }
                    );
                }
            } catch (e) {
                // Invalid URL
            }
            
            return originalFetch.apply(this, args);
        };
    }
};

// ===== INITIALIZE MONITORING =====
// Start monitoring when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        activityMonitor.init();
        defacementDetector.init();
        performanceMonitor.init();
    });
} else {
    activityMonitor.init();
    defacementDetector.init();
    performanceMonitor.init();
}

// ===== EXPORT FOR USE IN OTHER MODULES =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        securityLogger,
        activityMonitor,
        defacementDetector,
        performanceMonitor
    };
}

// ===== GLOBAL ERROR HANDLER =====
// Catch and log unhandled errors
window.addEventListener('error', function(event) {
    securityLogger.log(
        securityLogger.eventTypes.SUSPICIOUS_ACTIVITY,
        {
            type: 'javascript_error',
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        }
    );
});

// ===== UNHANDLED PROMISE REJECTION HANDLER =====
window.addEventListener('unhandledrejection', function(event) {
    securityLogger.log(
        securityLogger.eventTypes.SUSPICIOUS_ACTIVITY,
        {
            type: 'unhandled_promise_rejection',
            reason: event.reason
        }
    );
});
