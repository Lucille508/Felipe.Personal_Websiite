// ===== SECURITY UTILITIES =====

// DOMPurify-like sanitization function (basic implementation)
// Prevents XSS by converting HTML to plain text
function sanitizeHTML(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// XSS Protection: Escape HTML special characters
// Converts <, >, &, ", ' to HTML entities
function escapeHTML(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

// ===== OPEN REDIRECT PROTECTION =====
// Prevents malicious redirects through link manipulation
function isValidURL(url) {
    try {
        const urlObj = new URL(url, window.location.origin);
        
        // Only allow http, https, and mailto protocols
        const allowedProtocols = ['http:', 'https:', 'mailto:'];
        if (!allowedProtocols.includes(urlObj.protocol)) {
            return false;
        }
        
        // Prevent javascript: protocol
        if (urlObj.protocol === 'javascript:') {
            return false;
        }
        
        // For external links, validate domain
        if (urlObj.origin !== window.location.origin) {
            // Add whitelist of trusted domains if needed
            const trustedDomains = [
                'github.com',
                'linkedin.com',
                'twitter.com',
                'facebook.com',
                'instagram.com'
            ];
            
            const hostname = urlObj.hostname.replace('www.', '');
            const isTrusted = trustedDomains.some(domain => 
                hostname === domain || hostname.endsWith(`.${domain}`)
            );
            
            if (!isTrusted && !confirm(`You are leaving this site. Continue to ${urlObj.hostname}?`)) {
                return false;
            }
        }
        
        return true;
    } catch (e) {
        return false;
    }
}

// Secure link click handler
function secureLinkHandler(event) {
    const link = event.target.closest('a');
    if (!link) return;
    
    const href = link.getAttribute('href');
    
    // Skip internal anchors
    if (href && href.startsWith('#')) return;
    
    // Validate URL
    if (href && !isValidURL(href)) {
        event.preventDefault();
        console.warn('Blocked potentially malicious link:', href);
        alert('This link has been blocked for security reasons.');
        return false;
    }
    
    // Add rel="noopener noreferrer" to external links
    if (link.target === '_blank' && !link.rel.includes('noopener')) {
        link.rel = 'noopener noreferrer';
    }
}

// Apply to all links on page
document.addEventListener('click', secureLinkHandler, true);

// ===== DYNAMIC CONTENT SECURITY =====
// Safely insert dynamic content (project descriptions, testimonials, etc.)
function safelyInsertHTML(element, content) {
    if (!element) return;
    
    // Sanitize content
    const sanitized = sanitizeHTML(content);
    
    // Use textContent for safety (no HTML parsing)
    element.textContent = sanitized;
}

// Safely update element attribute
function safelySetAttribute(element, attribute, value) {
    if (!element) return;
    
    // Whitelist of safe attributes
    const safeAttributes = ['class', 'id', 'data-*', 'aria-*', 'title', 'alt'];
    
    // Block dangerous attributes
    const dangerousAttributes = ['onclick', 'onload', 'onerror', 'onmouseover', 'href', 'src'];
    
    if (dangerousAttributes.includes(attribute.toLowerCase())) {
        console.warn(`Blocked attempt to set dangerous attribute: ${attribute}`);
        return;
    }
    
    // Sanitize value
    const sanitizedValue = escapeHTML(value);
    element.setAttribute(attribute, sanitizedValue);
}

// ===== PREVENT SCRIPT INJECTION IN USER CONTENT =====
// Monitor for attempts to inject scripts through DOM manipulation
const domObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
            // Check for script tags
            if (node.nodeName === 'SCRIPT') {
                console.error('Blocked script injection attempt');
                node.remove();
            }
            
            // Check for inline event handlers
            if (node.nodeType === 1) { // Element node
                const attributes = node.attributes;
                for (let i = attributes.length - 1; i >= 0; i--) {
                    const attr = attributes[i];
                    if (attr.name.startsWith('on')) {
                        console.warn(`Removed inline event handler: ${attr.name}`);
                        node.removeAttribute(attr.name);
                    }
                }
            }
        });
    });
});

// Start observing (only in development/testing)
// Uncomment for production if needed
// domObserver.observe(document.body, { childList: true, subtree: true });

// ===== CONTENT SECURITY POLICY VIOLATION REPORTING =====
// Log CSP violations for monitoring
document.addEventListener('securitypolicyviolation', function(e) {
    console.error('CSP Violation:', {
        blockedURI: e.blockedURI,
        violatedDirective: e.violatedDirective,
        originalPolicy: e.originalPolicy,
        sourceFile: e.sourceFile,
        lineNumber: e.lineNumber
    });
    
    // Optionally send to backend for logging
    // fetch('/api/csp-report', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //         blockedURI: e.blockedURI,
    //         violatedDirective: e.violatedDirective,
    //         timestamp: new Date().toISOString()
    //     })
    // });
});

// Input validation functions
const validators = {
    name: (value) => {
        const nameRegex = /^[A-Za-z\s\-\.]{2,100}$/;
        return nameRegex.test(value.trim());
    },
    email: (value) => {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return emailRegex.test(value.trim()) && value.length <= 254;
    },
    message: (value) => {
        const trimmed = value.trim();
        return trimmed.length >= 10 && trimmed.length <= 5000;
    }
};

// Rate limiting for form submissions
const rateLimiter = {
    attempts: 0,
    lastAttempt: 0,
    maxAttempts: 3,
    timeWindow: 60000, // 1 minute
    
    canSubmit: function() {
        const now = Date.now();
        if (now - this.lastAttempt > this.timeWindow) {
            this.attempts = 0;
        }
        return this.attempts < this.maxAttempts;
    },
    
    recordAttempt: function() {
        this.attempts++;
        this.lastAttempt = Date.now();
    },
    
    getRemainingTime: function() {
        const elapsed = Date.now() - this.lastAttempt;
        return Math.ceil((this.timeWindow - elapsed) / 1000);
    }
};

// ===== TYPING ANIMATION FOR HERO SECTION =====
const typingText = document.querySelector('.typing-text');
const textToType = "Hi! I'm Emmanuel, a 3rd-year college student passionate about designing and web development.";
let charIndex = 0;

// Function to type text character by character
function typeText() {
    if (charIndex < textToType.length) {
        typingText.textContent += textToType.charAt(charIndex);
        charIndex++;
        setTimeout(typeText, 50); // Typing speed (50ms per character)
    }
}

// Start typing animation after page loads
window.addEventListener('load', () => {
    setTimeout(typeText, 1000); // 1 second delay before typing starts
});

// ===== MOBILE MENU TOGGLE =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===== SMOOTH SCROLL FOR NAVIGATION LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== ACTIVE SECTION HIGHLIGHTING ON SCROLL =====
const sections = document.querySelectorAll('section');
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    // Add scrolled class to header
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Highlight active section in navbar
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== PROJECT FILTERING FUNCTIONALITY =====
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filterValue = button.getAttribute('data-filter');
        
        // Filter projects with animation
        projectCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.animation = 'fadeInUp 0.5s ease-out';
                }, 10);
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ===== TESTIMONIALS SLIDER =====
const testimonialCards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');
let currentSlide = 0;

// Function to show specific slide
function showSlide(index) {
    // Remove active class from all cards and dots
    testimonialCards.forEach(card => card.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Add active class to current slide
    testimonialCards[index].classList.add('active');
    dots[index].classList.add('active');
}

// Dot click handlers
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        currentSlide = index;
        showSlide(currentSlide);
    });
});

// Auto-advance testimonials every 5 seconds
setInterval(() => {
    currentSlide = (currentSlide + 1) % testimonialCards.length;
    showSlide(currentSlide);
}, 5000);

// ===== CONTACT FORM VALIDATION WITH SECURITY =====
const contactForm = document.getElementById('contactForm');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const formMessage = document.getElementById('formMessage');
const honeypot = document.getElementById('website');

// Form submit handler with comprehensive security
contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Check honeypot (bot detection)
    if (honeypot && honeypot.value !== '') {
        console.warn('Bot detected via honeypot');
        return false;
    }
    
    // Rate limiting check
    if (!rateLimiter.canSubmit()) {
        showFormMessage(
            `Too many attempts. Please wait ${rateLimiter.getRemainingTime()} seconds.`,
            'error'
        );
        return false;
    }
    
    // Reset error messages and form message
    document.querySelectorAll('.error-message').forEach(error => {
        error.style.display = 'none';
    });
    formMessage.style.display = 'none';
    formMessage.className = 'form-message';
    
    let isValid = true;
    
    // Sanitize and validate inputs
    const nameValue = sanitizeHTML(nameInput.value.trim());
    const emailValue = sanitizeHTML(emailInput.value.trim());
    const messageValue = sanitizeHTML(messageInput.value.trim());
    
    // Validate name field
    if (!validators.name(nameValue)) {
        document.getElementById('nameError').style.display = 'block';
        isValid = false;
    }
    
    // Validate email field
    if (!validators.email(emailValue)) {
        document.getElementById('emailError').style.display = 'block';
        isValid = false;
    }
    
    // Validate message field
    if (!validators.message(messageValue)) {
        document.getElementById('messageError').style.display = 'block';
        isValid = false;
    }
    
    // If form is valid, proceed with submission
    if (isValid) {
        rateLimiter.recordAttempt();
        
        // Get reCAPTCHA token (if implemented)
        // Uncomment when you add your reCAPTCHA site key
        /*
        try {
            const token = await grecaptcha.execute('YOUR_SITE_KEY', {action: 'submit'});
            document.getElementById('recaptchaToken').value = token;
        } catch (error) {
            console.error('reCAPTCHA error:', error);
            showFormMessage('Security verification failed. Please try again.', 'error');
            return false;
        }
        */
        
        // Show success message
        showFormMessage('✓ Message sent successfully! I will get back to you soon.', 'success');
        
        // Animate submit button
        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate sending (replace with actual AJAX call)
        setTimeout(() => {
            submitBtn.textContent = 'Message Sent! ✓';
            submitBtn.style.background = 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)';
            
            // Here you would send data to your backend
            // Example with Fetch API:
            /*
            fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    name: escapeHTML(nameValue),
                    email: escapeHTML(emailValue),
                    message: escapeHTML(messageValue),
                    recaptchaToken: document.getElementById('recaptchaToken').value
                })
            })
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                showFormMessage('✓ Message sent successfully!', 'success');
                contactForm.reset();
            })
            .catch(error => {
                console.error('Error:', error);
                showFormMessage('✗ Failed to send message. Please try again.', 'error');
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = 'linear-gradient(135deg, #8b7355 0%, #6b5644 100%)';
                submitBtn.disabled = false;
            });
            */
            
            // Reset form after 3 seconds
            setTimeout(() => {
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.style.background = 'linear-gradient(135deg, #8b7355 0%, #6b5644 100%)';
                submitBtn.disabled = false;
                formMessage.style.display = 'none';
            }, 3000);
        }, 1000);
    } else {
        // Show error message
        showFormMessage('✗ Please fill in all fields correctly.', 'error');
    }
});

// Helper function to show form messages
function showFormMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
}

// Real-time validation feedback with security
nameInput.addEventListener('input', function() {
    const sanitized = sanitizeHTML(this.value);
    if (validators.name(sanitized)) {
        document.getElementById('nameError').style.display = 'none';
    }
});

emailInput.addEventListener('input', function() {
    const sanitized = sanitizeHTML(this.value);
    if (validators.email(sanitized)) {
        document.getElementById('emailError').style.display = 'none';
    }
});

messageInput.addEventListener('input', function() {
    const sanitized = sanitizeHTML(this.value);
    if (validators.message(sanitized)) {
        document.getElementById('messageError').style.display = 'none';
    }
});

// ===== DARK/LIGHT MODE TOGGLE =====
const darkModeToggle = document.getElementById('darkModeToggle');
const darkModeIcon = document.getElementById('darkModeIcon');
const body = document.body;

// Check for saved theme preference (default is dark mode)
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    body.classList.add('light-mode');
    darkModeIcon.textContent = '🌙';
} else {
    // Default to dark mode
    darkModeIcon.textContent = '☀️';
}

// Toggle between dark and light mode
darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    
    // Update icon and save preference
    if (body.classList.contains('light-mode')) {
        darkModeIcon.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        darkModeIcon.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    }
    
    // Add rotation animation to toggle button
    darkModeToggle.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        darkModeToggle.style.transform = 'rotate(0deg)';
    }, 300);
});

// ===== SCROLL ANIMATIONS FOR SECTIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for scroll animations
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// ===== PARALLAX EFFECT FOR HERO SECTION =====
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - (scrolled / 600);
    }
});

// ===== ANIMATE PROGRESS BARS ON SCROLL =====
const progressBars = document.querySelectorAll('.progress-fill');
let progressAnimated = false;

window.addEventListener('scroll', () => {
    const skillsSection = document.getElementById('skills');
    if (skillsSection && !progressAnimated) {
        const skillsPosition = skillsSection.getBoundingClientRect().top;
        const screenPosition = window.innerHeight;
        
        if (skillsPosition < screenPosition) {
            progressBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.width = width;
                }, 100);
            });
            progressAnimated = true;
        }
    }
});

// ===== CURSOR TRAIL EFFECT (OPTIONAL ENHANCEMENT) =====
const coords = { x: 0, y: 0 };
const circles = document.querySelectorAll('.circle');

// Create cursor trail circles (optional - add to HTML if desired)
// This creates a subtle cursor trail effect for desktop users
if (window.innerWidth > 768) {
    document.addEventListener('mousemove', (e) => {
        coords.x = e.clientX;
        coords.y = e.clientY;
    });
}

// ===== CONSOLE MESSAGE =====
console.log('%c👋 Welcome to Emmanuel\'s Portfolio!', 'color: #8b7355; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with ❤️ using HTML, CSS, and JavaScript', 'color: #c9c9c9; font-size: 14px;');


// ===== BACK TO TOP BUTTON =====
const backToTopBtn = document.getElementById('backToTop');

// Show/hide back to top button based on scroll position
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

// Scroll to top when button is clicked
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== SCROLL-TRIGGERED ANIMATIONS =====
// Enhanced scroll animations for all sections
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.about-card, .skill-item, .service-card, .project-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const windowHeight = window.innerHeight;
        
        // Check if element is in viewport
        if (elementTop < windowHeight - 100 && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Run animation check on scroll
window.addEventListener('scroll', animateOnScroll);

// Run once on page load
window.addEventListener('load', animateOnScroll);

// ===== SMOOTH SCROLLING ENHANCEMENT =====
// Add smooth scrolling behavior to all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 80; // Account for fixed header
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== PERFORMANCE OPTIMIZATION =====
// Debounce function for scroll events
function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Apply debounce to scroll events
window.addEventListener('scroll', debounce(() => {
    // Scroll event handlers here
}));

// ===== LOADING ANIMATION =====
// Add page load animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ===== CONSOLE WELCOME MESSAGE =====
console.log('%c👋 Welcome to Emmanuel\'s Portfolio!', 'color: #8b7355; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);');
console.log('%c🚀 Built with HTML, CSS, and JavaScript', 'color: #c9c9c9; font-size: 14px;');
console.log('%c💼 Looking for opportunities in web development!', 'color: #8b7355; font-size: 14px;');
console.log('%c📧 Contact: felipeemmanueljoshua0@gmail.com', 'color: #c9c9c9; font-size: 12px;');
