# Audit Trail System Guide

## 📊 Overview

Your website now includes a comprehensive audit trail system that tracks visitor activity while respecting privacy. This helps you understand who visits your site and how they interact with it.

---

## 🎯 What Gets Tracked

### Visitor Information (Privacy-Friendly)
- ✅ Session ID (unique per visit)
- ✅ Page views and navigation
- ✅ Device type (desktop/mobile/tablet)
- ✅ Browser information
- ✅ Screen resolution
- ✅ Language and timezone
- ✅ Referrer (where they came from)
- ❌ NO personal information
- ❌ NO IP addresses (hashed only)
- ❌ NO form data values

### User Interactions
- ✅ Button clicks
- ✅ Link clicks
- ✅ Form submissions (field names only)
- ✅ Scroll depth (25%, 50%, 75%, 100%)
- ✅ Time spent on page
- ✅ Project card views
- ✅ Section views

---

## 🚀 Quick Start

### 1. Add to Your Website

Add this line to your `index.html` before the closing `</body>` tag:

```html
<script src="js/audit-trail.js"></script>
```

### 2. View Analytics in Browser

Open your browser console and type:

```javascript
viewAnalytics()
```

This shows:
- Total events tracked
- Page views
- Clicks
- Form submissions
- Average time on page
- Device breakdown
- Top pages

### 3. View All Events

```javascript
auditTrail.getStoredEvents()
```

### 4. Clear Analytics

```javascript
clearAnalytics()
```

---

## 📱 What You Can See

### Example Analytics Output

```javascript
{
  totalEvents: 45,
  pageViews: 12,
  clicks: 18,
  formSubmissions: 2,
  averageTimeOnPage: 127, // seconds
  maxScrollDepth: 85, // percentage
  deviceBreakdown: {
    desktop: 8,
    mobile: 3,
    tablet: 1
  },
  topPages: [
    ["/", 8],
    ["/cv.html", 4]
  ]
}
```

### Example Event

```javascript
{
  type: "page_view",
  sessionId: "session_1708012345_abc123",
  timestamp: "2026-02-15T10:30:00.000Z",
  page: {
    url: "https://yoursite.com/",
    path: "/",
    title: "Emmanuel Joshua R. Felipe Portfolio",
    referrer: "https://google.com"
  },
  browser: {
    userAgent: "Mozilla/5.0...",
    language: "en-US",
    platform: "Win32",
    screenResolution: "1920x1080",
    viewport: "1366x768"
  },
  device: {
    type: "desktop",
    isMobile: false,
    isTablet: false
  }
}
```

---

## 🔧 Configuration

Edit `js/audit-trail.js` to customize:

```javascript
const auditConfig = {
    enabled: true,                    // Enable/disable tracking
    apiEndpoint: '/api/audit',        // Your backend endpoint
    trackPageViews: true,             // Track page visits
    trackClicks: true,                // Track clicks
    trackFormSubmissions: true,       // Track form submissions
    trackScrollDepth: true,           // Track scroll depth
    trackTimeOnPage: true,            // Track time spent
    respectDoNotTrack: true,          // Respect DNT header
    anonymizeIP: true                 // Hash IP addresses
};
```

---

## 🖥️ Backend Setup (Optional)

### Option 1: Node.js/Express

1. Install dependencies:
```bash
npm install express
```

2. Run the backend:
```bash
node backend/audit-api.js
```

3. Update `js/audit-trail.js`:
```javascript
apiEndpoint: 'http://localhost:3000/api/audit'
```

### Option 2: PHP Backend

Create `api/audit.php`:

```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$data = json_decode(file_get_contents('php://input'), true);

// Save to file
$logFile = 'audit-logs.json';
$logs = file_exists($logFile) ? json_decode(file_get_contents($logFile), true) : [];
$logs[] = $data;

// Keep only last 1000 events
if (count($logs) > 1000) {
    $logs = array_slice($logs, -1000);
}

file_put_contents($logFile, json_encode($logs, JSON_PRETTY_PRINT));

echo json_encode(['success' => true]);
?>
```

### Option 3: Google Analytics Integration

```javascript
// Add to js/audit-trail.js
sendToBackend(event) {
    // Send to Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', event.type, {
            event_category: 'audit',
            event_label: event.page?.path,
            value: event.duration || 0
        });
    }
}
```

### Option 4: Third-Party Services

- **Plausible Analytics** (privacy-friendly)
- **Fathom Analytics** (privacy-focused)
- **Matomo** (self-hosted)
- **Simple Analytics** (GDPR compliant)

---

## 📊 View Statistics

### Backend API Endpoints

Once backend is running:

**View Statistics:**
```
GET http://localhost:3000/api/audit/stats
```

**Export All Logs:**
```
GET http://localhost:3000/api/audit/export
```

### Example Statistics Response

```json
{
  "totalEvents": 156,
  "pageViews": 45,
  "uniqueSessions": 23,
  "clicks": 78,
  "formSubmissions": 5,
  "devices": {
    "desktop": 30,
    "mobile": 12,
    "tablet": 3
  },
  "topPages": [
    { "path": "/", "count": 30 },
    { "path": "/cv.html", "count": 15 }
  ],
  "recentEvents": [...]
}
```

---

## 🔒 Privacy & Compliance

### GDPR Compliant
- ✅ No personal data collected
- ✅ IP addresses hashed
- ✅ Respects Do Not Track
- ✅ No cookies required
- ✅ Data stored locally first
- ✅ User can clear data anytime

### Privacy Features
- Session IDs are temporary
- No cross-site tracking
- No third-party cookies
- No fingerprinting
- Anonymized by default

### Add Privacy Notice

Add to your website:

```html
<div class="privacy-notice">
    This website uses analytics to improve user experience. 
    No personal data is collected. 
    <a href="/privacy">Learn more</a>
</div>
```

---

## 📈 Understanding the Data

### Event Types

| Type | Description | When Triggered |
|------|-------------|----------------|
| `page_view` | Page loaded | On page load |
| `click` | Element clicked | On click |
| `form_submission` | Form submitted | On submit |
| `scroll_depth` | Scroll milestone | At 25%, 50%, 75%, 100% |
| `time_on_page` | Time tracking | Every 30 seconds |
| `page_exit` | User leaving | On page unload |
| `project_view` | Project viewed | When scrolled into view |
| `section_view` | Section viewed | When scrolled into view |

### Useful Insights

**High Bounce Rate?**
- Check if content is engaging
- Improve page load speed
- Make CTA more visible

**Low Scroll Depth?**
- Content might be too long
- Add more engaging elements
- Improve visual hierarchy

**High Time on Page?**
- Content is engaging
- Users are interested
- Good sign!

**Mobile vs Desktop?**
- Optimize for primary device
- Test on actual devices
- Adjust layout accordingly

---

## 🛠️ Advanced Features

### Custom Event Tracking

```javascript
// Track custom events
auditTrail.logEvent({
    type: 'custom_event',
    sessionId: auditTrail.sessionId,
    timestamp: new Date().toISOString(),
    customData: {
        action: 'video_played',
        videoId: 'intro-video'
    }
});
```

### Track Specific Elements

```javascript
// Track specific button
document.getElementById('hire-me-btn').addEventListener('click', () => {
    auditTrail.trackClick(this, 'hire_me_clicked');
});
```

### Export Data

```javascript
// Export to CSV
function exportToCSV() {
    const events = auditTrail.getStoredEvents();
    const csv = events.map(e => 
        `${e.timestamp},${e.type},${e.page?.path || ''}`
    ).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics.csv';
    a.click();
}
```

---

## 🔍 Troubleshooting

### Events Not Tracking?

1. Check console for errors
2. Verify `audit-trail.js` is loaded
3. Check if Do Not Track is enabled
4. Verify `auditConfig.enabled = true`

### Backend Not Receiving Events?

1. Check CORS settings
2. Verify endpoint URL
3. Check network tab in DevTools
4. Ensure backend is running

### Too Much Data?

1. Reduce tracking frequency
2. Disable unnecessary events
3. Implement data rotation
4. Use backend storage

---

## 📊 Dashboard Ideas

### Create a Simple Dashboard

```html
<!DOCTYPE html>
<html>
<head>
    <title>Analytics Dashboard</title>
</head>
<body>
    <h1>Website Analytics</h1>
    <div id="stats"></div>
    
    <script>
        fetch('http://localhost:3000/api/audit/stats')
            .then(r => r.json())
            .then(data => {
                document.getElementById('stats').innerHTML = `
                    <p>Total Page Views: ${data.pageViews}</p>
                    <p>Unique Sessions: ${data.uniqueSessions}</p>
                    <p>Total Clicks: ${data.clicks}</p>
                    <p>Form Submissions: ${data.formSubmissions}</p>
                `;
            });
    </script>
</body>
</html>
```

---

## 🎯 Best Practices

### Do's
- ✅ Review analytics weekly
- ✅ Respect user privacy
- ✅ Use insights to improve
- ✅ Keep data secure
- ✅ Be transparent

### Don'ts
- ❌ Track personal information
- ❌ Share data with third parties
- ❌ Ignore Do Not Track
- ❌ Store sensitive data
- ❌ Track without disclosure

---

## 📞 Support

### Need Help?
- Check browser console for errors
- Review configuration settings
- Test with `viewAnalytics()`
- Contact: felipeemmanueljoshua0@gmail.com

### Resources
- [Google Analytics Alternative](https://plausible.io)
- [Privacy-Friendly Analytics](https://usefathom.com)
- [GDPR Compliance Guide](https://gdpr.eu)

---

## 🎉 You're All Set!

Your website now tracks visitor activity in a privacy-friendly way. Use the insights to:

- Understand your audience
- Improve user experience
- Track engagement
- Measure success
- Make data-driven decisions

**Type `viewAnalytics()` in the console to see your stats!**

---

*Last Updated: February 15, 2026*  
*Version: 1.0*
