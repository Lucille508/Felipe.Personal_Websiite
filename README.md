# Emmanuel Joshua R. Felipe - Portfolio Website

A professional, modern portfolio website showcasing my skills, projects, and experience as a Full-Stack Developer.

## 🚀 Features

### Core Features
- **Responsive Design** - Works perfectly on all devices
- **Modern UI/UX** - Clean, professional interface with smooth animations
- **Interactive Elements** - Smooth scrolling, typing effects, and transitions
- **Contact Form** - Secure form with validation and anti-spam measures
- **CV/Resume** - Downloadable professional resume
- **Security Features** - XSS protection, input sanitization, rate limiting

### ✨ New Enhanced Features (v2.0)
- **🎨 Theme Toggle** - Switch between dark and light modes with persistence
- **📊 Scroll Progress Indicator** - Visual feedback of page scroll position
- **🖱️ Custom Cursor** - Premium cursor effects on desktop (auto-disabled on mobile)
- **🎭 Enhanced Animations** - Smooth scroll animations, card hover effects, parallax
- **⚡ Performance Optimized** - Lazy loading, debounced events, GPU acceleration
- **♿ Accessibility Enhanced** - WCAG 2.1 compliant, keyboard navigation, screen reader support
- **🔍 SEO Optimized** - Complete meta tags, Open Graph, Twitter Cards
- **📱 Mobile Enhanced** - Touch-optimized, responsive enhancements

## 📁 Project Structure

```
Personal_Website/
├── index.html              # Main portfolio page
├── cv.html                 # Resume/CV page
├── package.json            # Project dependencies
├── vercel.json            # Vercel deployment config
├── .htaccess              # Apache server config
├── _headers               # Netlify headers config
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
├── ENHANCEMENTS.md        # 🆕 Detailed enhancement documentation
├── QUICK-START-ENHANCED.md # 🆕 Quick start guide for new features
│
├── css/                   # Stylesheets
│   ├── styles.css         # Original floral theme styles
│   ├── styles-new.css     # Main dark theme styles
│   ├── cv-styles.css      # CV page styles
│   └── enhancements.css   # 🆕 Enhancement styles
│
├── js/                    # JavaScript files
│   ├── script.js          # Main functionality & security
│   └── enhancements.js    # 🆕 Enhanced features & interactions
│
├── assets/                # Static assets
│   ├── images/            # Images and photos
│   │   └── profilepic.jpg
│   └── files/             # Downloadable files (CV, etc.)
│
├── security/              # Security modules
│   ├── auth-security.js   # Authentication utilities
│   ├── file-security.js   # File upload security
│   └── security-monitoring.js  # Security monitoring
│
└── docs/                  # Documentation
    ├── README.md          # Project documentation
    ├── DEPLOYMENT.md      # Deployment guide
    ├── SECURITY.md        # Security documentation
    ├── QUICK-START.md     # Quick start guide
    └── backend-example.js # Backend integration examples
```

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations, Grid, Flexbox
- **JavaScript (ES6+)** - Interactive functionality, modern APIs
- **Font Awesome 6.5.1** - Icon library
- **Google Fonts** - Inter & Outfit typography
- **Web APIs** - IntersectionObserver, PerformanceObserver, Page Visibility
- **Responsive Design** - Mobile-first approach
- **Security Best Practices** - XSS protection, input validation, CSP

## 🎨 Design Features

- **Professional Dark Theme** - Modern navy blue aesthetic with light mode option
- **Clean Typography** - Outfit for headings, Inter for body text
- **Smooth Animations** - Fade-ins, slide-ups, parallax, and micro-interactions
- **Grid Layouts** - Modern, flexible, responsive layouts
- **Card-Based Design** - Clean, organized content sections
- **Glassmorphism** - Subtle backdrop blur effects
- **Custom Cursor** - Premium desktop experience
- **Scroll Progress** - Visual page navigation feedback

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

2. Open `index.html` in your browser or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve

# Using PHP
php -S localhost:8000
```

3. Visit `http://localhost:8000`

## 🚀 Quick Start

See [QUICK-START-ENHANCED.md](QUICK-START-ENHANCED.md) for detailed setup instructions and customization guide.

## 📖 Documentation

- **[ENHANCEMENTS.md](ENHANCEMENTS.md)** - Complete enhancement documentation
- **[QUICK-START-ENHANCED.md](QUICK-START-ENHANCED.md)** - Quick start guide
- **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Deployment instructions
- **[docs/SECURITY.md](docs/SECURITY.md)** - Security documentation
- **[CHANGELOG.md](CHANGELOG.md)** - Version history

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Deploy automatically

### Netlify
1. Drag and drop folder to Netlify
2. Or connect GitHub repository
3. Deploy automatically

### Traditional Hosting
1. Upload all files via FTP
2. Ensure `.htaccess` is uploaded for Apache servers
3. Configure SSL certificate

## 🔒 Security Features

- **XSS Protection** - Input sanitization and validation
- **CSRF Protection** - Token-based form security
- **Rate Limiting** - Prevents spam and abuse (3 submissions per minute)
- **Content Security Policy** - Restricts resource loading
- **Secure Headers** - X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- **Honeypot Fields** - Bot detection
- **Input Validation** - Regex patterns, length limits
- **Safe URL Handling** - Open redirect protection

## ♿ Accessibility Features

- **WCAG 2.1 Compliant** - Level AA standards
- **Keyboard Navigation** - Full keyboard support
- **Screen Reader Support** - ARIA labels and live regions
- **Skip to Content** - Quick navigation link
- **High Contrast Mode** - Support for visual impairments
- **Reduced Motion** - Respects user preferences
- **Focus Indicators** - Clear visual focus states
- **Semantic HTML** - Proper heading hierarchy

## 📝 Customization

### Update Personal Information
1. Edit `index.html` - Update name, bio, skills, projects
2. Edit `cv.html` - Update resume details
3. Replace `assets/images/profilepic.jpg` with your photo

### Change Colors
1. Open `css/styles.css`
2. Find color variables (search for `#1e3a8a`, `#3b82f6`)
3. Replace with your preferred colors

### Add Projects
1. Find the projects section in `index.html`
2. Duplicate a project card
3. Update title, description, links, and category

## 📧 Contact Form Setup

The contact form uses Web3Forms for email delivery:

1. Get your free access key from [web3forms.com](https://web3forms.com)
2. Update the access key in `index.html`:
```html
<input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE">
```
3. Form includes built-in validation, rate limiting, and spam protection

## 🎯 Performance

### Optimization Features
- Lazy loading images
- Debounced scroll events
- GPU-accelerated animations
- Minified assets (production)
- Efficient DOM manipulation
- Performance monitoring

### Metrics (Expected)
- Lighthouse Score: 95+/100
- First Contentful Paint: <1s
- Time to Interactive: <2s
- Cumulative Layout Shift: <0.1

## 🌐 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+
- ⚠️ IE 11 (Limited support, no enhancements)

## 📱 Device Support

- ✅ Desktop (1920px+)
- ✅ Laptop (1366px - 1920px)
- ✅ Tablet (768px - 1366px)
- ✅ Mobile (320px - 768px)
- ✅ Touch devices
- ✅ High DPI displays

## 🔄 Version History

### Version 2.0.0 (Current)
- ✨ Added theme toggle (dark/light mode)
- ✨ Added scroll progress indicator
- ✨ Added custom cursor (desktop)
- ✨ Enhanced animations and transitions
- ⚡ Performance optimizations
- ♿ Accessibility improvements
- 🔍 SEO enhancements
- 📱 Mobile experience improvements

### Version 1.0.0
- 🎉 Initial release
- 📄 Portfolio page
- 📋 CV page
- 📧 Contact form
- 🔒 Security features

See [CHANGELOG.md](CHANGELOG.md) for complete version history.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Emmanuel Joshua R. Felipe**
- Email: felipeemmanueljoshua0@gmail.com
- Phone: 09564359134
- LinkedIn: [Emmanuel Joshua Felipe](https://www.linkedin.com/in/emmanuel-joshua-felipe-4a93a73aa/)
- GitHub: [Your GitHub](https://github.com/yourprofile)
- Portfolio: [Your Website URL]

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- Web3Forms for contact form backend
- Inspiration from modern portfolio designs
- Open source community

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 💬 Feedback

If you have any feedback or suggestions, please reach out:
- Open an issue on GitHub
- Email: felipeemmanueljoshua0@gmail.com
- Connect on LinkedIn

---

**Made with ❤️ by Emmanuel Joshua R. Felipe**

*Last Updated: February 15, 2026 | Version 2.0.0*
