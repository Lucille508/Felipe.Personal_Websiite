# Admin Dashboard Deployment Guide

## How to Access Your Admin Dashboard After Deployment

### 🌐 Deployed URL

Once you deploy to Vercel, access your admin dashboard at:

```
https://your-domain.vercel.app/admin.html
```

**Default Password:** `admin123`

⚠️ **IMPORTANT:** Change the password before deploying!

---

## 🔐 Change the Admin Password

Before deploying, edit `admin.html` and change this line:

```javascript
const ADMIN_PASSWORD = 'admin123'; // ← Change this!
```

To something secure:

```javascript
const ADMIN_PASSWORD = 'YourSecurePassword123!';
```

---

## 🚀 Deploy to Vercel

### Option 1: Using Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Deploy
vercel

# Follow the prompts
```

### Option 2: Using Git (Automatic)

1. Push your changes to GitHub:
   ```bash
   git add -A
   git commit -m "Add admin dashboard"
   git push
   ```

2. Vercel will automatically deploy (if connected to your repo)

3. Check your deployment at: https://vercel.com/dashboard

---

## 📊 Access Your Dashboard

After deployment:

1. Go to: `https://your-domain.vercel.app/admin.html`
2. Enter your password
3. View all visitor data in real-time!

---

## 🔧 Configuration

### Backend API

The backend is automatically deployed as a serverless function at:
```
https://your-domain.vercel.app/api/audit
```

### Data Storage

Vercel serverless functions are stateless, so you have two options:

#### Option A: Use Vercel KV (Recommended for Production)

1. Install Vercel KV:
   ```bash
   npm install @vercel/kv
   ```

2. Set up KV storage in Vercel dashboard:
   - Go to your project → Storage → Create Database
   - Choose KV (Redis)

3. Update `backend/audit-api.js` to use KV instead of JSON file

#### Option B: Use External Database

Connect to:
- MongoDB Atlas (free tier)
- PostgreSQL (Supabase, Neon)
- Firebase Firestore

---

## 🛡️ Security Best Practices

### 1. Hide Admin Page from Search Engines

Add to your `robots.txt`:
```
User-agent: *
Disallow: /admin.html
Disallow: /admin-dashboard.html
```

### 2. Add IP Whitelist (Optional)

In `vercel.json`, add:
```json
{
  "routes": [
    {
      "src": "/admin.html",
      "headers": {
        "x-vercel-ip-country": "US"
      }
    }
  ]
}
```

### 3. Use Environment Variables

Instead of hardcoding the password, use environment variables:

In `admin.html`:
```javascript
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
```

In Vercel dashboard:
- Go to Settings → Environment Variables
- Add: `ADMIN_PASSWORD` = `YourSecurePassword`

### 4. Enable Two-Factor Authentication

For better security, consider using:
- Auth0
- Clerk
- NextAuth.js

---

## 📱 Mobile Access

The admin dashboard is fully responsive and works on:
- Desktop browsers
- Tablets
- Mobile phones

Access it from anywhere with the URL and password!

---

## 🔍 What You'll See

The dashboard shows:

✅ **Statistics Cards**
- Total Visitors
- Total Events
- Form Submissions
- Total Clicks

✅ **Recent Events Table**
- Timestamp
- Event Type
- Visitor ID
- IP Address
- Page
- Details

✅ **Unique Visitors Table**
- Visitor ID
- IP Address
- First Visit
- Last Visit
- Event Count
- Browser
- Device

✅ **Controls**
- Search/Filter
- Refresh Data
- Clear All Data

---

## 🐛 Troubleshooting

### "Failed to load data" Error

**Cause:** Backend API not responding

**Solutions:**
1. Check Vercel function logs
2. Verify API endpoint is correct
3. Check CORS settings
4. Ensure backend is deployed

### No Data Showing

**Cause:** No visitors yet or data not persisting

**Solutions:**
1. Visit your main website to generate events
2. Check if backend is storing data
3. Verify API endpoint in `js/audit-trail.js`

### Password Not Working

**Cause:** Browser cache or wrong password

**Solutions:**
1. Clear browser cache
2. Check password in `admin.html`
3. Try incognito/private mode

---

## 📊 Data Persistence

### Current Setup (Development)
- Data stored in `backend/audit-logs.json`
- ⚠️ Resets on each deployment

### Production Setup (Recommended)

Use a database for persistent storage:

**MongoDB Example:**
```javascript
const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGODB_URI);

app.post('/api/audit', async (req, res) => {
    const db = client.db('audit');
    await db.collection('events').insertOne(req.body);
    res.json({ success: true });
});
```

---

## 🔗 URLs Summary

After deployment:

| Resource | URL |
|----------|-----|
| Main Website | `https://your-domain.vercel.app` |
| Admin Login | `https://your-domain.vercel.app/admin.html` |
| Admin Dashboard | `https://your-domain.vercel.app/admin-dashboard.html` |
| API Endpoint | `https://your-domain.vercel.app/api/audit` |

---

## ⚠️ Important Notes

1. **Don't share the admin URL publicly**
2. **Change the default password immediately**
3. **Use HTTPS only (Vercel provides this automatically)**
4. **Set up a database for production use**
5. **Monitor your Vercel function usage (free tier limits)**
6. **Comply with privacy laws (GDPR, CCPA)**

---

## 🎯 Quick Start Checklist

- [ ] Change admin password in `admin.html`
- [ ] Add `robots.txt` to hide admin pages
- [ ] Deploy to Vercel
- [ ] Test admin login
- [ ] Visit main website to generate test data
- [ ] Verify data appears in dashboard
- [ ] Set up database for production (optional)
- [ ] Add environment variables for password
- [ ] Enable monitoring/alerts

---

## 📞 Need Help?

Check the logs:
```bash
vercel logs
```

Or visit Vercel dashboard for detailed function logs and errors.
