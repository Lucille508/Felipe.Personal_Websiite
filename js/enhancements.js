// ===================================
// WEBSITE ENHANCEMENTS
// Modern UI/UX Features & Interactions
// ===================================

// ===== SCROLL PROGRESS INDICATOR =====
const scrollProgress = document.getElementById('scrollProgress');

function updateScrollProgress() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / documentHeight) * 100;
    
    if (scrollProgress) {
        scrollProgress.style.width = progress + '%';
    }
}

window.addEventListener('scroll', updateScrollProgress);

// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme preference or default to dark
const currentTheme = localStorage.getItem('theme') || 'dark';
if (currentTheme === 'light') {
    body.classList.add('light-theme');
    if (themeToggle) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// Theme toggle functionality
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        
        // Update icon
        const icon = themeToggle.querySelector('i');
        if (body.classList.contains('light-theme')) {
            icon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'light');
        } else {
            icon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'dark');
        }
        
        // Add animation
        themeToggle.style.transform = 'rotate(360deg) scale(1.2)';
        setTimeout(() => {
            themeToggle.style.transform = '';
        }, 300);
    });
}


// ===== CUSTOM CURSOR DISABLED =====
// Custom cursor feature has been disabled for better usability
// Normal mouse pointer is now visible everywhere
// To re-enable, uncomment the code below and update CSS

/*
const cursorDot = document.getElementById('cursorDot');
const cursorOutline = document.getElementById('cursorOutline');

// Detect touch device
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
if (isTouchDevice) {
    document.body.classList.add('touch-device');
}

// Custom cursor code disabled
*/

// ===== SUBTLE SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for animation (removed stagger effect - too much)
document.querySelectorAll('.about-card, .service-card, .project-card, .skill-item, .testimonial-card').forEach(el => {
    el.classList.add('fade-in-up');
    animateOnScroll.observe(el);
});

// ===== SUBTLE SKILL BAR ANIMATIONS =====
const skillBars = document.querySelectorAll('.progress-fill');
let skillsAnimated = false;

function animateSkillBars() {
    const skillsSection = document.getElementById('skills');
    if (!skillsSection || skillsAnimated) return;
    
    const rect = skillsSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
    
    if (isVisible) {
        skillBars.forEach((bar, index) => {
            const targetWidth = bar.style.width;
            bar.style.width = '0%';
            
            // Reduced delay for smoother animation
            setTimeout(() => {
                bar.style.transition = 'width 1s ease-out';
                bar.style.width = targetWidth;
            }, index * 100);
        });
        skillsAnimated = true;
    }
}

window.addEventListener('scroll', animateSkillBars);
window.addEventListener('load', animateSkillBars);

// ===== SUBTLE PARALLAX EFFECT =====
function parallaxEffect() {
    const scrolled = window.scrollY;
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent && scrolled < window.innerHeight) {
        // Reduced parallax intensity for subtlety
        heroContent.style.transform = `translateY(${scrolled * 0.2}px)`;
        heroContent.style.opacity = 1 - (scrolled / 1000);
    }
}

window.addEventListener('scroll', parallaxEffect);

// ===== SMOOTH SCROLL WITH OFFSET =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== ENHANCED FORM VALIDATION =====
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

formInputs.forEach(input => {
    // Real-time validation feedback
    input.addEventListener('blur', function() {
        if (this.value.trim() !== '') {
            if (this.checkValidity()) {
                this.classList.add('valid');
                this.classList.remove('invalid');
            } else {
                this.classList.add('invalid');
                this.classList.remove('valid');
            }
        }
    });
    
    // Clear validation on focus
    input.addEventListener('focus', function() {
        this.classList.remove('valid', 'invalid');
    });
});

// ===== LAZY LOADING IMAGES =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== IMPROVED TESTIMONIAL SLIDER =====
let testimonialInterval;

function startTestimonialAutoplay() {
    // Increased interval for less distraction
    testimonialInterval = setInterval(() => {
        const currentSlide = document.querySelector('.testimonial-card.active');
        const nextSlide = currentSlide.nextElementSibling || document.querySelector('.testimonial-card');
        
        if (nextSlide) {
            currentSlide.classList.remove('active');
            nextSlide.classList.add('active');
            
            // Update dots
            const currentDot = document.querySelector('.dot.active');
            const nextDot = currentDot.nextElementSibling || document.querySelector('.dot');
            currentDot.classList.remove('active');
            nextDot.classList.add('active');
        }
    }, 8000); // Increased from 6000 to 8000ms
}
}

function stopTestimonialAutoplay() {
    clearInterval(testimonialInterval);
}

// Start autoplay
startTestimonialAutoplay();

// Pause on hover
const testimonialSlider = document.querySelector('.testimonials-slider');
if (testimonialSlider) {
    testimonialSlider.addEventListener('mouseenter', stopTestimonialAutoplay);
    testimonialSlider.addEventListener('mouseleave', startTestimonialAutoplay);
}

// ===== PERFORMANCE OPTIMIZATIONS =====
// Debounce function for scroll events
function debounce(func, wait = 10) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll handlers
window.addEventListener('scroll', debounce(() => {
    updateScrollProgress();
    parallaxEffect();
}, 10));

// ===== KEYBOARD NAVIGATION ENHANCEMENT =====
document.addEventListener('keydown', (e) => {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.querySelector('.hamburger');
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    }
    
    // Arrow keys for testimonial navigation
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const activeCard = document.querySelector('.testimonial-card.active');
        if (activeCard) {
            stopTestimonialAutoplay();
            
            let nextCard;
            if (e.key === 'ArrowRight') {
                nextCard = activeCard.nextElementSibling || document.querySelector('.testimonial-card');
            } else {
                nextCard = activeCard.previousElementSibling || document.querySelectorAll('.testimonial-card')[document.querySelectorAll('.testimonial-card').length - 1];
            }
            
            activeCard.classList.remove('active');
            nextCard.classList.add('active');
            
            // Update dots
            const cards = Array.from(document.querySelectorAll('.testimonial-card'));
            const index = cards.indexOf(nextCard);
            document.querySelectorAll('.dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            
            startTestimonialAutoplay();
        }
    }
});

// ===== ACCESSIBILITY ENHANCEMENTS =====
// Add skip to content link
const skipLink = document.createElement('a');
skipLink.href = '#home';
skipLink.className = 'skip-to-content';
skipLink.textContent = 'Skip to main content';
document.body.insertBefore(skipLink, document.body.firstChild);

// Announce page changes to screen readers
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// ===== CONSOLE EASTER EGG =====
console.log('%c🚀 Welcome to My Portfolio!', 'color: #3b82f6; font-size: 24px; font-weight: bold;');
console.log('%c💼 Interested in working together?', 'color: #60a5fa; font-size: 16px;');
console.log('%c📧 Contact: felipeemmanueljoshua0@gmail.com', 'color: #93c5fd; font-size: 14px;');
console.log('%c⚡ Built with modern web technologies', 'color: #3b82f6; font-size: 12px;');

// ===== PERFORMANCE MONITORING =====
if ('PerformanceObserver' in window) {
    // Monitor long tasks
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.duration > 50) {
                console.warn('Long task detected:', entry);
            }
        }
    });
    
    observer.observe({ entryTypes: ['longtask'] });
}

// ===== PAGE VISIBILITY API =====
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopTestimonialAutoplay();
    } else {
        startTestimonialAutoplay();
    }
});

// ===== INITIALIZE ON LOAD =====
window.addEventListener('load', () => {
    // Fade in page
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
    
    // Initialize animations
    animateSkillBars();
    updateScrollProgress();
    
    // Announce page load to screen readers
    announceToScreenReader('Portfolio page loaded');
});
