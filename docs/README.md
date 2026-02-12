# 🔒 Secure Portfolio Website

A modern, professional, and **security-hardened** personal portfolio website for Emmanuel Joshua R. Felipe.

## ✨ Features

- Modern, responsive design with dark/light mode
- Animated hero section with typing effect
- Interactive project filtering
- Testimonials slider
- Contact form with comprehensive security
- Mobile-friendly navigation
- Smooth scrolling and animations

## 🛡️ Security Features

### Implemented Security Measures:
- ✅ **HTTPS Ready** - SSL/TLS configuration guides included
- ✅ **Security Headers** - CSP, X-Frame-Options, HSTS, etc.
- ✅ **XSS Protection** - Input sanitization and HTML escaping
- ✅ **Input Validation** - Client-side validation with regex patterns
- ✅ **Anti-Spam** - Honeypot field and rate limiting
- ✅ **CAPTCHA Ready** - Google reCAPTCHA v3 integration prepared
- ✅ **Secure Forms** - novalidate, maxlength, pattern attributes
- ✅ **Safe External Resources** - Trusted CDNs only

### Protection Against:
- Cross-Site Scripting (XSS)
- SQL Injection
- Clickjacking
- MIME type attacks
- CSRF attacks
- Spam submissions
- Bot attacks

## 📁 Project Structure

```
portfolio/
├── index.html              # Main HTML file with security headers
├── styles.css              # Styling with brown/black theme
├── script.js               # JavaScript with security utilities
├── SECURITY.md             # Comprehensive security documentation
├── DEPLOYMENT.md           # Deployment guide
├── backend-example.js      # Secure backend implementation example
├── _headers                # Netlify security headers
├── .htaccess              # Apache security headers
└── vercel.json            # Vercel security headers
```

## 🚀 Quick Start

### 1. Clone or Download
```bash
git clone https://github.com/YOUR_USERNAME/portfolio.git
cd portfolio
```

### 2. Customize Content
Edit `index.html` to update:
- Personal information
- Skills and percentages
- Projects
- Testimonials
- Contact details
- Social media links

### 3. Setup reCAPTCHA (Recommended)
1. Get keys from https://www.google.com/recaptcha/admin
2. Uncomment reCAPTCHA script in `index.html`
3. Add your site key in `script.js`
4. Implement backend verification

### 4. Deploy
Choose your platform:
- **GitHub Pages**: Push to GitHub, enable Pages in settings
- **Netlify**: Drag & drop or connect Git repository
- **Vercel**: Run `vercel` command or connect Git

See `DEPLOYMENT.md` for detailed instructions.

## 🔧 Configuration

### Security Headers
Configuration files included for:
- **Netlify**: `_headers`
- **Apache**: `.htaccess`
- **Vercel**: `vercel.json`

### Backend Setup (Optional)
If you need form submission handling:
```bash
npm install express cors helmet express-rate-limit validator
```
See `backend-example.js` for implementation.

## 📝 Customization Guide

### Colors
The site uses a brown/black theme. To change colors, edit CSS variables in `styles.css`:
```css
/* Primary brown: #8b7355 */
/* Dark brown: #6b5644 */
/* Light brown: #a68968 */
/* Background: #1a1410 */
```

### Sections
- **Hero**: Update name and tagline in `script.js`
- **About**: Edit cards in HTML
- **Skills**: Modify progress bars and percentages
- **Projects**: Add/remove project cards
- **Testimonials**: Update testimonial content
- **Contact**: Change email and phone

## 🧪 Testing

### Security Testing Tools:
- [Mozilla Observatory](https://observatory.mozilla.org/)
- [Security Headers](https://securityheaders.com/)
- [SSL Labs](https://www.ssllabs.com/ssltest/)

### Manual Testing:
```javascript
// Test XSS protection in form fields
<script>alert('XSS')</script>

// Test rate limiting
// Submit form 4+ times quickly

// Test honeypot
// Fill hidden "website" field
```

## 📚 Documentation

- **SECURITY.md** - Complete security implementation guide
- **DEPLOYMENT.md** - Step-by-step deployment instructions
- **backend-example.js** - Secure backend code example

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## 📄 License

Free to use for personal portfolios. Attribution appreciated.

## 🤝 Contributing

Feel free to submit issues or pull requests for improvements.

## 📞 Contact

Emmanuel Joshua R. Felipe
- Email: felipeemmanueljoshua0@gmail.com
- Phone: 09564359134

---

**Built with security in mind** 🔒
