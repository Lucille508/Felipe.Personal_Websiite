# Project Structure

```
Personal_Website/
│
├── 📄 index.html                    # Main portfolio homepage
├── 📄 cv.html                       # Professional CV/Resume page
├── 📄 package.json                  # NPM dependencies and scripts
├── 📄 vercel.json                   # Vercel deployment configuration
├── 📄 .htaccess                     # Apache server configuration
├── 📄 _headers                      # Netlify headers configuration
├── 📄 .env.example                  # Environment variables template
├── 📄 .gitignore                    # Git ignore rules
├── 📄 README.md                     # Project documentation
├── 📄 PROJECT-STRUCTURE.md          # This file
│
├── 📁 css/                          # Stylesheets
│   ├── styles.css                   # Main website styles (Navy Blue Theme)
│   └── cv-styles.css                # CV page styles (Professional Theme)
│
├── 📁 js/                           # JavaScript files
│   └── script.js                    # Main functionality, animations, security
│
├── 📁 assets/                       # Static assets
│   ├── 📁 images/                   # Images and photos
│   │   └── profilepic.jpg           # Profile picture
│   └── 📁 files/                    # Downloadable files
│       └── (CV PDFs, documents)
│
├── 📁 security/                     # Security modules
│   ├── auth-security.js             # Authentication utilities
│   ├── file-security.js             # File upload security
│   └── security-monitoring.js       # Security monitoring & logging
│
├── 📁 docs/                         # Documentation
│   ├── COMPLETE-SECURITY-GUIDE.md   # Comprehensive security guide
│   ├── DEPLOYMENT.md                # Deployment instructions
│   ├── FINAL-DELIVERABLES.md        # Project deliverables
│   ├── IMPLEMENTATION-SUMMARY.md    # Implementation details
│   ├── QUICK-START.md               # Quick start guide
│   ├── SECURITY-ARCHITECTURE.md     # Security architecture
│   ├── SECURITY-CHECKLIST.md        # Security checklist
│   ├── SECURITY-QUICK-REFERENCE.md  # Quick security reference
│   ├── SECURITY.md                  # Security documentation
│   └── backend-example.js           # Backend integration examples
│
└── 📁 .git/                         # Git repository (hidden)
```

## 📋 File Descriptions

### Root Files

- **index.html** - Main portfolio page with sections: Hero, About, Skills, Projects, Testimonials, Contact
- **cv.html** - Professional CV/Resume with two-column layout
- **package.json** - Project metadata and dependencies
- **vercel.json** - Configuration for Vercel deployment
- **.htaccess** - Apache server rules for security and routing
- **_headers** - Netlify custom headers for security
- **.env.example** - Template for environment variables
- **.gitignore** - Files and folders to exclude from Git

### CSS Folder

- **styles.css** - Main website styling with:
  - Navy blue professional theme
  - Responsive design
  - Dark/Light mode support
  - Animations and transitions
  - Grid and flexbox layouts

- **cv-styles.css** - CV page styling with:
  - Two-column layout
  - Print-ready styles
  - Professional typography
  - Clean, minimal design

### JS Folder

- **script.js** - Main JavaScript file containing:
  - Typing animation
  - Mobile menu toggle
  - Smooth scrolling
  - Active section highlighting
  - Project filtering
  - Testimonials slider
  - Form validation with security
  - XSS protection
  - Rate limiting
  - Dark/Light mode toggle
  - Scroll animations

### Assets Folder

- **images/** - Store all images:
  - Profile pictures
  - Project screenshots
  - Background images
  - Icons and logos

- **files/** - Store downloadable files:
  - CV/Resume PDFs
  - Certificates
  - Portfolio documents

### Security Folder

- **auth-security.js** - Authentication utilities:
  - Login/logout functionality
  - Session management
  - Token validation
  - Password hashing

- **file-security.js** - File upload security:
  - File type validation
  - Size limits
  - Malware scanning
  - Secure file storage

- **security-monitoring.js** - Security monitoring:
  - Activity logging
  - Threat detection
  - Error tracking
  - Performance monitoring

### Docs Folder

Contains all project documentation:
- Security guides and checklists
- Deployment instructions
- Implementation details
- Quick start guides
- Backend integration examples

## 🎯 Key Features by File

### index.html
- ✅ Responsive navigation
- ✅ Hero section with typing effect
- ✅ About section with cards
- ✅ Skills with progress bars
- ✅ Projects with filtering
- ✅ Testimonials slider
- ✅ Contact form with validation
- ✅ Footer with social links

### cv.html
- ✅ Professional two-column layout
- ✅ Profile section with initials
- ✅ Contact information
- ✅ Skills with progress bars
- ✅ Timeline for education/experience
- ✅ Services offered
- ✅ Print-ready design
- ✅ Download PDF button

### styles.css
- ✅ Navy blue professional theme
- ✅ Montserrat & Roboto fonts
- ✅ Responsive breakpoints
- ✅ Dark/Light mode
- ✅ Smooth animations
- ✅ Grid layouts
- ✅ Custom scrollbar

### script.js
- ✅ Security utilities (XSS, sanitization)
- ✅ Form validation
- ✅ Rate limiting
- ✅ Interactive animations
- ✅ Mobile menu
- ✅ Smooth scrolling
- ✅ Project filtering
- ✅ Testimonials slider

## 🔄 Update Workflow

1. **Update Content** → Edit `index.html` and `cv.html`
2. **Change Styles** → Modify `css/styles.css` or `css/cv-styles.css`
3. **Add Features** → Update `js/script.js`
4. **Add Images** → Place in `assets/images/`
5. **Update Docs** → Modify files in `docs/`
6. **Test Locally** → Open in browser
7. **Deploy** → Push to Git → Auto-deploy

## 📱 Responsive Breakpoints

- **Desktop**: > 968px
- **Tablet**: 768px - 968px
- **Mobile**: < 768px
- **Small Mobile**: < 480px

## 🎨 Color Scheme

**Dark Mode (Default)**
- Primary: #1e3a8a (Navy Blue)
- Accent: #3b82f6 (Royal Blue)
- Background: #0f172a (Dark)
- Text: #e5e7eb (Light Gray)

**Light Mode**
- Primary: #1e3a8a (Navy Blue)
- Accent: #3b82f6 (Royal Blue)
- Background: #f8fafc (Light)
- Text: #1e293b (Dark Gray)

---

Last Updated: January 2025
