# 🚀 Quick Start Guide

Get your secure portfolio website live in 15 minutes!

---

## Step 1: Customize Your Content (5 minutes)

### Edit Personal Information
Open `index.html` and update:

1. **Hero Section** (Line ~50):
   - Your name
   - Update typing text in `script.js` (Line ~70)

2. **About Section** (Line ~100):
   - Replace `profile-placeholder.jpg` with your photo
   - Update education, goals, and hobbies

3. **Skills Section** (Line ~150):
   - Adjust skill percentages
   - Update progress bar widths to match

4. **Projects Section** (Line ~200):
   - Add your project images
   - Update project titles and descriptions
   - Add live demo and GitHub links

5. **Testimonials** (Line ~300):
   - Replace with real testimonials
   - Add client photos

6. **Contact Section** (Line ~400):
   - Update email and phone
   - Add social media links
   - Update CV download link

---

## Step 2: Setup reCAPTCHA (3 minutes)

### Get reCAPTCHA Keys:
1. Visit: https://www.google.com/recaptcha/admin
2. Click "+" to create new site
3. Choose **reCAPTCHA v3**
4. Add your domain
5. Copy Site Key and Secret Key

### Add to Your Site:
1. In `index.html` (Line ~550), uncomment:
   ```html
   <script src="https://www.google.com/recaptcha/api.js?render=YOUR_SITE_KEY"></script>
   ```
   Replace `YOUR_SITE_KEY` with your actual site key

2. In `script.js` (Line ~180), uncomment reCAPTCHA code:
   ```javascript
   const token = await grecaptcha.execute('YOUR_SITE_KEY', {action: 'submit'});
   ```
   Replace `YOUR_SITE_KEY` with your actual site key

---

## Step 3: Deploy to GitHub Pages (5 minutes)

### Create Repository:
```bash
git init
git add .
git commit -m "Initial commit - Secure portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Enable GitHub Pages:
1. Go to repository Settings
2. Click "Pages" in sidebar
3. Source: "Deploy from branch"
4. Branch: "main" / Folder: "/ (root)"
5. Click "Save"
6. ✅ Enable "Enforce HTTPS"

### Your site is live at:
`https://YOUR_USERNAME.github.io/YOUR_REPO/`

---

## Step 4: Verify Security (2 minutes)

### Test Your Site:
1. **Security Headers**: https://securityheaders.com/
   - Enter your URL
   - Target: Grade A

2. **SSL Certificate**: https://www.ssllabs.com/ssltest/
   - Enter your domain
   - Target: Grade A

3. **Test Form**:
   - Submit with valid data ✓
   - Submit with invalid email ✗
   - Submit 4 times quickly (rate limit) ✗
   - Try XSS: `<script>alert('test')</script>` ✗

---

## Alternative Deployment Options

### Netlify (Easiest):
1. Visit: https://app.netlify.com/drop
2. Drag your project folder
3. Done! HTTPS automatic

### Vercel:
```bash
npm install -g vercel
vercel
```

---

## Optional: Setup Backend

### If you need form email notifications:

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. **Run Backend**:
   ```bash
   npm start
   ```

4. **Update Frontend**:
   In `script.js`, uncomment fetch API code (Line ~200)

---

## Troubleshooting

### Site not loading?
- Check if HTTPS is enabled
- Clear browser cache
- Wait 5-10 minutes for DNS propagation

### Form not working?
- Check console for errors (F12)
- Verify reCAPTCHA keys are correct
- Test without reCAPTCHA first

### Security headers not showing?
- GitHub Pages: May take time to propagate
- Use `_headers` file for Netlify
- Use `vercel.json` for Vercel

### reCAPTCHA not appearing?
- Check site key is correct
- Verify domain is registered
- Check browser console for errors

---

## Next Steps

1. ✅ Customize content
2. ✅ Setup reCAPTCHA
3. ✅ Deploy site
4. ✅ Verify security
5. 📝 Add custom domain (optional)
6. 📧 Setup email notifications (optional)
7. 📊 Add analytics (optional)
8. 🎨 Customize colors/design

---

## Support

Need help? Check these files:
- `README.md` - Overview
- `SECURITY.md` - Security details
- `DEPLOYMENT.md` - Deployment guide
- `SECURITY-CHECKLIST.md` - Complete checklist

---

## Congratulations! 🎉

Your secure portfolio is now live and protected against:
- ✅ XSS attacks
- ✅ SQL injection
- ✅ Clickjacking
- ✅ CSRF attacks
- ✅ Spam bots
- ✅ MIME attacks

**Share your portfolio and start getting opportunities!**
