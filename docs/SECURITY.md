# Security Implementation Guide

## Overview
This portfolio website has been secured against common web vulnerabilities including XSS, CSRF, clickjacking, and spam attacks.

---

## 🔒 Security Features Implemented

### 1. HTTPS & Secure Hosting

#### SSL/TLS Certificate Setup

**For GitHub Pages:**
1. Go to your repository Settings
2. Navigate to Pages section
3. Enable "Enforce HTTPS"
4. GitHub automatically provides SSL certificate

**For Netlify:**
1. Deploy your site to Netlify
2. Go to Domain Settings
3. HTTPS is automatically enabled
4. Optional: Enable HSTS (HTTP Strict Transport Security)

**For Vercel:**
1. Deploy to Vercel
2. SSL is automatically provisioned
3. All HTTP traffic is redirected to HTTPS

**For Custom Domain:**
- Use Let's Encrypt (free SSL certificates)
- Install Certbot: https://certbot.eff.org/
- Run: `certbot --nginx` or `certbot --apache`

---

### 2. Security Headers

#### Implemented in HTML (Meta Tags)
```html
<!-- Prevents MIME type sniffing -->
<meta http-equiv="X-Content-Type-Options" content="nosniff">

<!-- Prevents clickjacking attacks -->
<meta http-equiv="X-Frame-Options" content="DENY">

<!-- XSS Protection -->
<meta http-equiv="X-XSS-Protection" content="1; mode=block">

<!-- Referrer Policy -->
<meta name="referrer" content="strict-origin-when-cross-origin">
```

#### Content Security Policy (CSP)
Prevents XSS and data injection attacks:
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self'; 
  script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com; 
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
  font-src 'self' https://fonts.gstatic.com; 
  img-src 'self' data: https:; 
  connect-src 'self'; 
  frame-src https://www.google.com; 
  object-src 'none'; 
  base-uri 'self'; 
  form-action 'self';
">
```

#### Server-Side Headers (Recommended)
For production, add these headers in your server configuration:

**Nginx Configuration:**
```nginx
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-src https://www.google.com; object-src 'none'; base-uri 'self'; form-action 'self';" always;
```

**Apache Configuration (.htaccess):**
```apache
<IfModule mod_headers.c>
    Header set X-Frame-Options "DENY"
    Header set X-Content-Type-Options "nosniff"
    Header set X-XSS-Protection "1; mode=block"
    Header set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
    Header set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-src https://www.google.com; object-src 'none'; base-uri 'self'; form-action 'self';"
</IfModule>
```

**Netlify (_headers file):**
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-src https://www.google.com; object-src 'none'; base-uri 'self'; form-action 'self';
```

**Vercel (vercel.json):**
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; frame-src https://www.google.com; object-src 'none'; base-uri 'self'; form-action 'self';" }
      ]
    }
  ]
}
```

---

### 3. Input Validation & Sanitization

#### Client-Side Validation (JavaScript)
- **Name Field**: 2-100 characters, letters, spaces, hyphens, and periods only
- **Email Field**: RFC 5322 compliant email validation, max 254 characters
- **Message Field**: 10-5000 characters

#### HTML5 Validation Attributes
```html
<input type="text" pattern="[A-Za-z\s\-\.]{2,100}" maxlength="100">
<input type="email" maxlength="254">
<textarea minlength="10" maxlength="5000"></textarea>
```

#### XSS Prevention
All user inputs are sanitized using:
- `sanitizeHTML()` - Converts HTML to text
- `escapeHTML()` - Escapes special characters

---

### 4. CAPTCHA Implementation

#### Google reCAPTCHA v3 Setup

1. **Get API Keys:**
   - Visit: https://www.google.com/recaptcha/admin
   - Register your site
   - Choose reCAPTCHA v3
   - Get Site Key and Secret Key

2. **Add to HTML:**
```html
<!-- In <head> section -->
<script src="https://www.google.com/recaptcha/api.js?render=YOUR_SITE_KEY"></script>
```

3. **Update JavaScript:**
Uncomment the reCAPTCHA code in `script.js`:
```javascript
const token = await grecaptcha.execute('YOUR_SITE_KEY', {action: 'submit'});
document.getElementById('recaptchaToken').value = token;
```

4. **Backend Verification:**
```javascript
// Node.js example
const fetch = require('node-fetch');

async function verifyRecaptcha(token) {
    const secretKey = 'YOUR_SECRET_KEY';
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${secretKey}&response=${token}`
    });
    const data = await response.json();
    return data.success && data.score >= 0.5;
}
```

---

### 5. Anti-Spam Measures

#### Honeypot Field
Hidden field that bots fill but humans don't see:
```html
<input type="text" name="website" id="website" style="display:none" tabindex="-1" autocomplete="off">
```

#### Rate Limiting
Client-side rate limiting (3 submissions per minute):
```javascript
const rateLimiter = {
    maxAttempts: 3,
    timeWindow: 60000 // 1 minute
};
```

#### Server-Side Rate Limiting (Recommended)
Implement on your backend:
```javascript
// Express.js example with express-rate-limit
const rateLimit = require('express-rate-limit');

const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: 'Too many requests, please try again later.'
});

app.post('/api/contact', contactLimiter, (req, res) => {
    // Handle form submission
});
```

---

### 6. Secure External Resources

#### Subresource Integrity (SRI)
When using CDNs, add integrity hashes:

```html
<!-- Example with Font Awesome -->
<link rel="stylesheet" 
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      integrity="sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg=="
      crossorigin="anonymous"
      referrerpolicy="no-referrer">
```

Generate SRI hashes: https://www.srihash.org/

#### Current External Resources
- Google Fonts (trusted source, loaded via HTTPS)
- All resources loaded from trusted CDNs only

---

## 🛡️ Backend Security Recommendations

### Server-Side Validation
Always validate on the server, never trust client-side validation:

```javascript
// Node.js/Express example
const validator = require('validator');

app.post('/api/contact', async (req, res) => {
    const { name, email, message, recaptchaToken } = req.body;
    
    // Verify reCAPTCHA
    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
        return res.status(400).json({ error: 'reCAPTCHA verification failed' });
    }
    
    // Validate inputs
    if (!validator.isLength(name, { min: 2, max: 100 }) || 
        !validator.matches(name, /^[A-Za-z\s\-\.]+$/)) {
        return res.status(400).json({ error: 'Invalid name' });
    }
    
    if (!validator.isEmail(email) || !validator.isLength(email, { max: 254 })) {
        return res.status(400).json({ error: 'Invalid email' });
    }
    
    if (!validator.isLength(message, { min: 10, max: 5000 })) {
        return res.status(400).json({ error: 'Invalid message' });
    }
    
    // Sanitize inputs
    const sanitizedData = {
        name: validator.escape(name),
        email: validator.normalizeEmail(email),
        message: validator.escape(message)
    };
    
    // Process form (send email, save to database, etc.)
    // ...
    
    res.json({ success: true });
});
```

### CSRF Protection
Implement CSRF tokens for form submissions:

```javascript
// Express.js with csurf
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

app.get('/contact', csrfProtection, (req, res) => {
    res.render('contact', { csrfToken: req.csrfToken() });
});

app.post('/api/contact', csrfProtection, (req, res) => {
    // Handle form submission
});
```

---

## 📋 Security Checklist

- [x] HTTPS enabled
- [x] Security headers implemented (CSP, X-Frame-Options, etc.)
- [x] Input validation (client-side)
- [ ] Input validation (server-side) - **Required for production**
- [x] XSS protection (sanitization)
- [x] Honeypot anti-spam
- [x] Rate limiting (client-side)
- [ ] Rate limiting (server-side) - **Required for production**
- [ ] reCAPTCHA implemented - **Recommended**
- [ ] CSRF protection - **Required if using backend**
- [x] Secure external resources
- [ ] Regular security audits
- [ ] Dependency updates

---

## 🔍 Testing Security

### Tools for Security Testing:
1. **Mozilla Observatory**: https://observatory.mozilla.org/
2. **Security Headers**: https://securityheaders.com/
3. **SSL Labs**: https://www.ssllabs.com/ssltest/
4. **OWASP ZAP**: https://www.zaproxy.org/

### Manual Testing:
- Try XSS payloads in form fields: `<script>alert('XSS')</script>`
- Test rate limiting by submitting multiple times
- Check if honeypot catches bots
- Verify HTTPS redirect
- Test CSP by trying to inject external scripts

---

## 🚀 Deployment Recommendations

### Recommended Hosting Platforms:
1. **GitHub Pages** (Free, HTTPS included)
2. **Netlify** (Free tier, automatic HTTPS, easy headers config)
3. **Vercel** (Free tier, automatic HTTPS, serverless functions)
4. **Cloudflare Pages** (Free, DDoS protection, CDN)

### Pre-Deployment Steps:
1. Replace reCAPTCHA placeholder with actual site key
2. Set up backend API for form submissions
3. Configure server-side validation
4. Add rate limiting on server
5. Test all security features
6. Run security audit tools

---

## 📞 Support & Updates

For security issues or questions:
- Review OWASP Top 10: https://owasp.org/www-project-top-ten/
- Check MDN Web Security: https://developer.mozilla.org/en-US/docs/Web/Security
- Stay updated on security best practices

---

## 📝 License & Attribution

This security implementation follows industry best practices and OWASP guidelines.
