# Quick Reference Guide

## 📂 Where to Find Things

### Want to edit...

| What | File Location | Line/Section |
|------|--------------|--------------|
| **Your Name** | `index.html` | Line 42, 88 |
| **Profile Picture** | `assets/images/` | Replace `profilepic.jpg` |
| **About Me Text** | `index.html` | Lines 110-130 |
| **Skills & Percentages** | `index.html` | Lines 150-200 |
| **Projects** | `index.html` | Lines 250-350 |
| **Contact Info** | `index.html` | Lines 420-450 |
| **CV/Resume** | `cv.html` | Entire file |
| **Colors** | `css/styles.css` | Search for `#1e3a8a`, `#3b82f6` |
| **Fonts** | `css/styles.css` | Line 8 (import) |

## 🎨 Quick Customization

### Change Primary Color
```css
/* In css/styles.css */
/* Find and replace: */
#1e3a8a → Your color (Navy Blue)
#3b82f6 → Your color (Royal Blue)
```

### Change Fonts
```css
/* In css/styles.css, line 8 */
@import url('https://fonts.googleapis.com/css2?family=YourFont');

/* Then replace: */
'Montserrat' → 'YourFont'
'Roboto' → 'YourFont'
```

### Add a New Project
```html
<!-- In index.html, duplicate this block: -->
<div class="project-card" data-category="web">
    <div class="project-image">
        <span>🌐</span>
    </div>
    <div class="project-content">
        <h3 class="project-title">Your Project</h3>
        <span class="project-category">Category</span>
        <p class="project-description">Description</p>
        <div class="project-links">
            <a href="#" class="project-link">Live Demo</a>
            <a href="#" class="project-link">GitHub</a>
        </div>
    </div>
</div>
```

## 🚀 Quick Commands

### Local Development
```bash
# Open in browser
start index.html

# Or use a local server
python -m http.server 8000
# Then visit: http://localhost:8000
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy to Netlify
```bash
# Drag and drop the entire folder to:
# https://app.netlify.com/drop
```

## 📝 Common Tasks

### Update Profile Picture
1. Save your photo as `profilepic.jpg`
2. Place in `assets/images/`
3. Refresh browser

### Add Social Media Link
```html
<!-- In index.html, find social-links section -->
<a href="https://yourlink.com" class="social-link" title="Platform">
    <span>🔗</span>
</a>
```

### Change Section Order
1. Open `index.html`
2. Cut entire `<section>` block
3. Paste in desired position
4. Update navigation links if needed

### Enable Contact Form
1. Sign up for FormSpree or EmailJS
2. Get your endpoint URL
3. Update `js/script.js` line 450
4. Add your API key

## 🔧 Troubleshooting

### Styles not loading?
- Check file path: `<link rel="stylesheet" href="css/styles.css">`
- Clear browser cache: Ctrl+Shift+R

### JavaScript not working?
- Check file path: `<script src="js/script.js"></script>`
- Open browser console: F12 → Console tab
- Look for errors

### Images not showing?
- Check file path: `assets/images/yourimage.jpg`
- Verify file exists in correct folder
- Check file extension (.jpg, .png, etc.)

### Mobile menu not working?
- Ensure `js/script.js` is loaded
- Check browser console for errors
- Verify hamburger class in HTML

## 📱 Testing Checklist

- [ ] Desktop view (> 968px)
- [ ] Tablet view (768px - 968px)
- [ ] Mobile view (< 768px)
- [ ] Dark mode toggle
- [ ] Light mode toggle
- [ ] All navigation links work
- [ ] Contact form validation
- [ ] Project filtering
- [ ] Testimonials slider
- [ ] Smooth scrolling
- [ ] CV page loads correctly
- [ ] All images load
- [ ] No console errors

## 🎯 Performance Tips

### Optimize Images
```bash
# Compress images before uploading
# Recommended: TinyPNG.com or Squoosh.app
# Target: < 200KB per image
```

### Minify CSS/JS (Production)
```bash
# Use online tools:
# CSS: cssminifier.com
# JS: javascript-minifier.com
```

### Enable Caching
```apache
# Already configured in .htaccess
# Caches CSS, JS, images for 1 year
```

## 📊 Analytics Setup

### Google Analytics
```html
<!-- Add before </head> in index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🔒 Security Checklist

- [x] XSS protection enabled
- [x] Input sanitization
- [x] Rate limiting on forms
- [x] HTTPS enforced
- [x] Security headers configured
- [x] No sensitive data in code
- [ ] reCAPTCHA configured (optional)
- [ ] Backend API secured (if used)

## 📞 Support

### Need Help?
- Check `docs/` folder for detailed guides
- Review `PROJECT-STRUCTURE.md` for file locations
- Check browser console for errors (F12)

### Common File Paths
```
Root files:           ./index.html, ./cv.html
Stylesheets:          ./css/styles.css
Scripts:              ./js/script.js
Images:               ./assets/images/
Documentation:        ./docs/
Security modules:     ./security/
```

---

**Quick Tip**: Use Ctrl+F (Find) to search for specific text in files!

Last Updated: January 2025
