# Deployment Guide - Secure Portfolio Website

## Quick Start Deployment

### Option 1: GitHub Pages (Recommended for Static Sites)

1. **Create GitHub Repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Secure portfolio"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to repository Settings
   - Navigate to "Pages" section
   - Source: Deploy from branch "main"
   - Folder: / (root)
   - Click Save
   - Enable "Enforce HTTPS"

3. **Your site will be live at:**
   `https://YOUR_USERNAME.github.io/YOUR_REPO/`

4. **Custom Domain (Optional):**
   - Add CNAME file with your domain
   - Configure DNS settings
   - GitHub provides free SSL

---

### Option 2: Netlify (Best for Easy Deployment)

1. **Deploy via Drag & Drop:**
   - Visit https://app.netlify.com/drop
   - Drag your project folder
   - Site is live instantly with HTTPS

2. **Deploy via Git:**
   - Connect your GitHub repository
   - Build settings: Leave empty (static site)
   - Deploy!

3. **Add Security Headers:**
   Create `_headers` file in root:

   ```
   /*
     X-Frame-Options: DENY
     X-Content-Type-Options: nosniff
     X-XSS-Protection: 1; mode=block
     Strict-Transport-Security: max-age=31536000; includeSubDomains
     Referrer-Policy: strict-origin-when-cross-origin
   ```

---

### Option 3: Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Add Security Headers:**
   Create `vercel.json`:
   ```json
   {
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           { "key": "X-Frame-Options", "value": "DENY" },
           { "key": "X-Content-Type-Options", "value": "nosniff" },
           { "key": "Strict-Transport-Security", "value": "max-age=31536000" }
         ]
       }
     ]
   }
   ```

---

## reCAPTCHA Setup

1. Get keys from: https://www.google.com/recaptcha/admin
2. Choose reCAPTCHA v3
3. Add site key to `index.html` (uncomment script tag)
4. Add site key to `script.js` (uncomment reCAPTCHA code)
5. Implement backend verification with secret key

---

## Backend Setup (Optional)

If you need form submission handling:

### Node.js/Express Backend:
```bash
npm init -y
npm install express cors helmet express-rate-limit validator
```

See SECURITY.md for complete backend implementation.

---

## Post-Deployment Checklist

- [ ] HTTPS is enabled
- [ ] Test all security headers: https://securityheaders.com/
- [ ] Test SSL: https://www.ssllabs.com/ssltest/
- [ ] Verify reCAPTCHA works
- [ ] Test form submission
- [ ] Check mobile responsiveness
- [ ] Test all navigation links
- [ ] Verify images load correctly

---

## Monitoring & Maintenance

- Monitor form submissions for spam
- Update dependencies regularly
- Review security headers quarterly
- Test site performance: https://pagespeed.web.dev/
