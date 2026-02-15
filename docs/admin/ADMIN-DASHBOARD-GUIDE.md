# Admin Dashboard Guide

## Quick Start

### Step 1: Start the Backend Server

Open a terminal and run:

```bash
cd backend
node audit-api.js
```

You should see:
```
🚀 Audit Trail API running on port 3000
📊 POST /api/audit - Receive events
📈 GET /api/audit/stats - View statistics
💾 GET /api/audit/export - Export logs
```

**Keep this terminal open!** The server needs to run continuously.

### Step 2: Open the Admin Dashboard

Simply open `admin-dashboard.html` in your web browser:
- Double-click the file, or
- Right-click → Open with → Your browser

### Step 3: View Your Data

The dashboard will automatically load and display:
- **Total Visitors** - Unique visitors to your site
- **Total Events** - All tracked actions
- **Form Submissions** - Contact form submissions
- **Total Clicks** - Click events tracked
- **Recent Events** - Latest 50 events with details
- **Unique Visitors** - Visitor information and activity

## Dashboard Features

### 🔍 Search
Use the search box to filter by:
- Visitor ID
- IP Address
- Event Type

### 🔄 Refresh
Click the "Refresh" button to reload the latest data from the server.

### 🗑️ Clear Data
Click "Clear All Data" to delete all audit logs (requires confirmation).

## What Data is Tracked?

The audit trail collects:
- ✅ Real IP addresses (not hashed)
- ✅ Visitor IDs (unique per visitor)
- ✅ Page views and navigation
- ✅ Click events (what they clicked)
- ✅ Form submissions (including form data)
- ✅ Scroll depth (how far they scrolled)
- ✅ Time on page
- ✅ Browser and device information
- ✅ Geolocation data
- ✅ Mouse movements
- ✅ Form field changes

## API Endpoints

If you want to access data programmatically:

- `GET http://localhost:3000/api/audit/events` - All events
- `GET http://localhost:3000/api/audit/summary` - Summary statistics
- `GET http://localhost:3000/api/audit/stats` - Detailed analytics
- `GET http://localhost:3000/api/audit/export` - Export all data
- `DELETE http://localhost:3000/api/audit/clear` - Clear all data

## Data Storage

All audit data is stored in:
```
backend/audit-logs.json
```

You can:
- View this file directly
- Back it up regularly
- Import it into other tools
- Analyze it with scripts

## Troubleshooting

### "Failed to load data" Error
- Make sure the backend server is running (`node audit-api.js`)
- Check that it's running on port 3000
- Look for error messages in the terminal

### No Data Showing
- Visit your website (`index.html`) to generate events
- Click around, scroll, submit forms
- Refresh the dashboard

### Port Already in Use
If port 3000 is taken, edit `backend/audit-api.js`:
```javascript
const PORT = process.env.PORT || 3001; // Change to 3001
```

Then update the dashboard URL in `admin-dashboard.html`:
```javascript
const API_URL = 'http://localhost:3001/api/audit';
```

## Privacy & Legal

⚠️ **IMPORTANT**: This system collects personal data including:
- IP addresses
- Form submissions (names, emails, messages)
- Browsing behavior

You MUST:
1. Add a privacy policy to your website
2. Inform visitors about data collection
3. Comply with GDPR, CCPA, and local laws
4. Provide opt-out mechanisms
5. Secure the data properly

See `FULL-TRACKING-GUIDE.md` for complete legal requirements.

## Security

🔒 **Secure Your Dashboard**:
- Don't deploy `admin-dashboard.html` to your public website
- Keep it local or behind authentication
- Use HTTPS in production
- Restrict API access with authentication
- Regularly backup your data

## Next Steps

1. Test the system by visiting your website
2. Monitor the dashboard for incoming events
3. Set up regular data backups
4. Add authentication to the dashboard (recommended)
5. Review privacy compliance requirements
