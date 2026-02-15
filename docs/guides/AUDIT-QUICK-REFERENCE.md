# Audit Trail Quick Reference

## 🚀 Quick Commands

### View Analytics
```javascript
viewAnalytics()
```

### View All Events
```javascript
auditTrail.getStoredEvents()
```

### Clear Data
```javascript
clearAnalytics()
```

---

## 📊 What Gets Tracked

✅ Page views  
✅ Button clicks  
✅ Link clicks  
✅ Form submissions  
✅ Scroll depth  
✅ Time on page  
✅ Device type  
✅ Browser info  
✅ Screen resolution  

❌ NO personal data  
❌ NO IP addresses  
❌ NO form values  

---

## 🔧 Configuration File

`js/audit-trail.js` - Line 10-20

```javascript
const auditConfig = {
    enabled: true,              // Turn on/off
    apiEndpoint: '/api/audit',  // Backend URL
    trackPageViews: true,       // Track visits
    trackClicks: true,          // Track clicks
    trackFormSubmissions: true, // Track forms
    trackScrollDepth: true,     // Track scrolling
    trackTimeOnPage: true,      // Track time
    respectDoNotTrack: true,    // Privacy
    anonymizeIP: true           // Hash IPs
};
```

---

## 🖥️ Backend Setup

### Node.js
```bash
cd backend
npm install express
node audit-api.js
```

### View Stats
```
http://localhost:3000/api/audit/stats
```

### Export Data
```
http://localhost:3000/api/audit/export
```

---

## 📈 Example Output

```javascript
{
  totalEvents: 45,
  pageViews: 12,
  clicks: 18,
  formSubmissions: 2,
  averageTimeOnPage: 127,
  maxScrollDepth: 85,
  deviceBreakdown: {
    desktop: 8,
    mobile: 3,
    tablet: 1
  }
}
```

---

## 🔒 Privacy Features

- Session IDs only (no personal data)
- IP addresses hashed
- Respects Do Not Track
- No cookies required
- GDPR compliant
- Data stored locally
- User can clear anytime

---

## 🎯 Common Tasks

### Disable Tracking
```javascript
// In js/audit-trail.js
const auditConfig = {
    enabled: false  // Change to false
};
```

### Track Custom Event
```javascript
auditTrail.logEvent({
    type: 'custom',
    data: { action: 'button_clicked' }
});
```

### Export to CSV
```javascript
const events = auditTrail.getStoredEvents();
console.table(events);
```

---

## 📞 Support

**Email**: felipeemmanueljoshua0@gmail.com  
**Documentation**: AUDIT-TRAIL-GUIDE.md

---

*Quick Reference v1.0*
