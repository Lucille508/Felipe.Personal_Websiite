// ===== AUTHENTICATION & ACCESS CONTROL MODULE =====
// This module provides secure authentication for future admin panel implementation
// Use this when adding login functionality to your portfolio

// ===== PASSWORD POLICY ENFORCEMENT =====
const passwordPolicy = {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    preventCommonPasswords: true,
    
    // Validate password against policy
    validate: function(password) {
        const errors = [];
        
        if (password.length < this.minLength) {
            errors.push(`Password must be at least ${this.minLength} characters`);
        }
        
        if (this.requireUppercase && !/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        
        if (this.requireLowercase && !/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        
        if (this.requireNumbers && !/\d/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        
        if (this.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
            errors.push('Password must contain at least one special character');
        }
        
        // Check against common passwords
        if (this.preventCommonPasswords && this.isCommonPassword(password)) {
            errors.push('This password is too common. Please choose a stronger password');
        }
        
        return {
            valid: errors.length === 0,
            errors: errors
        };
    },
    
    // Check if password is in common passwords list
    isCommonPassword: function(password) {
        const commonPasswords = [
            'password', '123456', '12345678', 'qwerty', 'abc123',
            'monkey', '1234567', 'letmein', 'trustno1', 'dragon',
            'baseball', 'iloveyou', 'master', 'sunshine', 'ashley',
            'bailey', 'passw0rd', 'shadow', '123123', '654321'
        ];
        return commonPasswords.includes(password.toLowerCase());
    },
    
    // Calculate password strength (0-100)
    calculateStrength: function(password) {
        let strength = 0;
        
        // Length bonus
        strength += Math.min(password.length * 4, 40);
        
        // Character variety bonus
        if (/[a-z]/.test(password)) strength += 10;
        if (/[A-Z]/.test(password)) strength += 10;
        if (/\d/.test(password)) strength += 10;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 15;
        
        // Complexity bonus
        const uniqueChars = new Set(password).size;
        strength += Math.min(uniqueChars * 2, 15);
        
        return Math.min(strength, 100);
    }
};

// ===== SESSION MANAGEMENT =====
const sessionManager = {
    sessionTimeout: 30 * 60 * 1000, // 30 minutes
    sessionKey: 'portfolio_session',
    
    // Create new session
    createSession: function(userId, userData) {
        const session = {
            userId: userId,
            userData: userData,
            createdAt: Date.now(),
            lastActivity: Date.now(),
            sessionId: this.generateSessionId(),
            csrfToken: this.generateCSRFToken()
        };
        
        // Store in sessionStorage (more secure than localStorage)
        sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
        
        // Set secure cookie with HttpOnly flag (backend required)
        // document.cookie = `session=${session.sessionId}; Secure; HttpOnly; SameSite=Strict; Max-Age=1800`;
        
        return session;
    },
    
    // Validate existing session
    validateSession: function() {
        const sessionData = sessionStorage.getItem(this.sessionKey);
        
        if (!sessionData) {
            return { valid: false, reason: 'No session found' };
        }
        
        try {
            const session = JSON.parse(sessionData);
            const now = Date.now();
            
            // Check if session has expired
            if (now - session.lastActivity > this.sessionTimeout) {
                this.destroySession();
                return { valid: false, reason: 'Session expired' };
            }
            
            // Update last activity
            session.lastActivity = now;
            sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
            
            return { valid: true, session: session };
        } catch (error) {
            console.error('Session validation error:', error);
            return { valid: false, reason: 'Invalid session data' };
        }
    },
    
    // Destroy session (logout)
    destroySession: function() {
        sessionStorage.removeItem(this.sessionKey);
        // Clear cookie (backend required)
        // document.cookie = 'session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    },
    
    // Generate secure session ID
    generateSessionId: function() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    },
    
    // Generate CSRF token
    generateCSRFToken: function() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    },
    
    // Prevent session hijacking - validate session fingerprint
    createFingerprint: function() {
        const fingerprint = {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screenResolution: `${screen.width}x${screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        
        return btoa(JSON.stringify(fingerprint));
    },
    
    // Validate session fingerprint
    validateFingerprint: function(storedFingerprint) {
        const currentFingerprint = this.createFingerprint();
        return storedFingerprint === currentFingerprint;
    }
};

// ===== LOGIN ATTEMPT LIMITER (BRUTE FORCE PROTECTION) =====
const loginLimiter = {
    maxAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    attemptsKey: 'login_attempts',
    
    // Record failed login attempt
    recordFailedAttempt: function(username) {
        const attempts = this.getAttempts(username);
        attempts.count++;
        attempts.lastAttempt = Date.now();
        
        if (attempts.count >= this.maxAttempts) {
            attempts.lockedUntil = Date.now() + this.lockoutDuration;
        }
        
        localStorage.setItem(`${this.attemptsKey}_${username}`, JSON.stringify(attempts));
        
        return {
            remaining: Math.max(0, this.maxAttempts - attempts.count),
            lockedUntil: attempts.lockedUntil
        };
    },
    
    // Check if account is locked
    isLocked: function(username) {
        const attempts = this.getAttempts(username);
        
        if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
            const remainingTime = Math.ceil((attempts.lockedUntil - Date.now()) / 1000 / 60);
            return {
                locked: true,
                remainingMinutes: remainingTime
            };
        }
        
        // Reset if lockout period has passed
        if (attempts.lockedUntil && Date.now() >= attempts.lockedUntil) {
            this.resetAttempts(username);
        }
        
        return { locked: false };
    },
    
    // Get current attempts for username
    getAttempts: function(username) {
        const stored = localStorage.getItem(`${this.attemptsKey}_${username}`);
        return stored ? JSON.parse(stored) : { count: 0, lastAttempt: null, lockedUntil: null };
    },
    
    // Reset attempts after successful login
    resetAttempts: function(username) {
        localStorage.removeItem(`${this.attemptsKey}_${username}`);
    },
    
    // Get remaining attempts
    getRemainingAttempts: function(username) {
        const attempts = this.getAttempts(username);
        return Math.max(0, this.maxAttempts - attempts.count);
    }
};

// ===== SECURE LOGIN FUNCTION (EXAMPLE) =====
async function secureLogin(username, password) {
    try {
        // 1. Check if account is locked
        const lockStatus = loginLimiter.isLocked(username);
        if (lockStatus.locked) {
            return {
                success: false,
                error: `Account locked. Try again in ${lockStatus.remainingMinutes} minutes.`
            };
        }
        
        // 2. Sanitize inputs
        const sanitizedUsername = sanitizeHTML(username.trim());
        const sanitizedPassword = password; // Don't sanitize password, just validate
        
        // 3. Validate password format (not strength, just format)
        if (sanitizedPassword.length < 8) {
            return {
                success: false,
                error: 'Invalid credentials'
            };
        }
        
        // 4. Send to backend for authentication (HTTPS only)
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                username: sanitizedUsername,
                password: sanitizedPassword,
                fingerprint: sessionManager.createFingerprint()
            })
        });
        
        const data = await response.json();
        
        // 5. Handle response
        if (data.success) {
            // Reset login attempts
            loginLimiter.resetAttempts(sanitizedUsername);
            
            // Create session
            const session = sessionManager.createSession(data.userId, data.userData);
            
            return {
                success: true,
                session: session
            };
        } else {
            // Record failed attempt
            const attemptInfo = loginLimiter.recordFailedAttempt(sanitizedUsername);
            
            return {
                success: false,
                error: 'Invalid credentials',
                remainingAttempts: attemptInfo.remaining
            };
        }
        
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            error: 'Login failed. Please try again.'
        };
    }
}

// ===== SECURE LOGOUT FUNCTION =====
function secureLogout() {
    // Destroy session
    sessionManager.destroySession();
    
    // Clear any sensitive data from memory
    // Redirect to login page
    window.location.href = '/login.html';
}

// ===== AUTO-LOGOUT ON INACTIVITY =====
let inactivityTimer;
const inactivityTimeout = 30 * 60 * 1000; // 30 minutes

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    
    inactivityTimer = setTimeout(() => {
        alert('Session expired due to inactivity');
        secureLogout();
    }, inactivityTimeout);
}

// Monitor user activity
if (sessionStorage.getItem('portfolio_session')) {
    ['mousedown', 'keypress', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, resetInactivityTimer, true);
    });
    
    resetInactivityTimer();
}

// ===== EXPORT FOR USE IN OTHER MODULES =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        passwordPolicy,
        sessionManager,
        loginLimiter,
        secureLogin,
        secureLogout
    };
}
