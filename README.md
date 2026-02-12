# Emmanuel Joshua R. Felipe - Portfolio Website

A professional, modern portfolio website showcasing my skills, projects, and experience as a Full-Stack Developer.

## 🚀 Features

- **Responsive Design** - Works perfectly on all devices
- **Modern UI/UX** - Clean, professional interface with smooth animations
- **Dark/Light Mode** - Toggle between themes
- **Interactive Elements** - Smooth scrolling, typing effects, and transitions
- **Contact Form** - Secure form with validation and anti-spam measures
- **CV/Resume** - Downloadable professional resume
- **Security Features** - XSS protection, input sanitization, rate limiting

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
│
├── css/                   # Stylesheets
│   ├── styles.css         # Main website styles
│   └── cv-styles.css      # CV page styles
│
├── js/                    # JavaScript files
│   └── script.js          # Main functionality & security
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
- **CSS3** - Modern styling with animations
- **JavaScript** - Interactive functionality
- **Responsive Design** - Mobile-first approach
- **Security Best Practices** - XSS protection, input validation

## 🎨 Design Features

- **Professional Navy Blue Theme** - Masculine, corporate aesthetic
- **Montserrat & Roboto Fonts** - Clean, modern typography
- **Smooth Animations** - Fade-ins, slide-ups, and transitions
- **Grid Layouts** - Modern, flexible layouts
- **Card-Based Design** - Clean, organized content sections

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
```

3. Visit `http://localhost:8000`

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
- **Rate Limiting** - Prevents spam and abuse
- **Content Security Policy** - Restricts resource loading
- **Secure Headers** - X-Frame-Options, X-Content-Type-Options
- **Honeypot Fields** - Bot detection

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

To enable the contact form:
1. Set up a backend service (FormSpree, EmailJS, or custom)
2. Update form action in `js/script.js`
3. Add reCAPTCHA keys if needed

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Emmanuel Joshua R. Felipe**
- Email: felipeemmanueljoshua0@gmail.com
- Phone: 09564359134
- Portfolio: [Your Website URL]

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- Inspiration from modern portfolio designs

---

Made with ❤️ by Emmanuel Joshua R. Felipe
