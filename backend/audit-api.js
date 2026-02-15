// ===================================
// AUDIT TRAIL BACKEND API
// Node.js/Express example
// ===================================

const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// Configuration
const config = {
    logFile: path.join(__dirname, 'audit-logs.json'),
    maxLogSize: 10000, // Maximum number of events to store
    enableIPLogging: true, // COLLECT REAL IP ADDRESSES
    enableGeoLocation: true, // ENABLE GEO-LOCATION
    collectAllData: true // COLLECT EVERYTHING
};

// Middleware to handle CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'POST, GET');
    next();
});

// Hash IP address for privacy
function hashIP(ip) {
    return crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);
}

// Get client IP (respecting proxies)
function getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0] || 
           req.headers['x-real-ip'] || 
           req.connection.remoteAddress;
}

// Load existing logs
function loadLogs() {
    try {
        if (fs.existsSync(config.logFile)) {
            const data = fs.readFileSync(config.logFile, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error loading logs:', error);
    }
    return [];
}

// Save logs
function saveLogs(logs) {
    try {
        // Keep only the most recent events
        if (logs.length > config.maxLogSize) {
            logs = logs.slice(-config.maxLogSize);
        }
        
        fs.writeFileSync(config.logFile, JSON.stringify(logs, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving logs:', error);
        return false;
    }
}

// POST /api/audit - Receive audit events
app.post('/api/audit', (req, res) => {
    try {
        const event = req.body;
        
        // Add server-side data - COLLECT EVERYTHING
        event.server = {
            receivedAt: new Date().toISOString(),
            ip: getClientIP(req), // REAL IP ADDRESS
            ipHash: hashIP(getClientIP(req)), // Also keep hash
            headers: req.headers, // ALL HEADERS
            userAgent: req.headers['user-agent'],
            referer: req.headers['referer'] || req.headers['referrer'],
            acceptLanguage: req.headers['accept-language'],
            host: req.headers['host'],
            origin: req.headers['origin']
        };
        
        // Load existing logs
        const logs = loadLogs();
        
        // Add new event
        logs.push(event);
        
        // Save logs
        if (saveLogs(logs)) {
            res.status(200).json({ success: true, message: 'Event logged' });
        } else {
            res.status(500).json({ success: false, message: 'Failed to save event' });
        }
        
    } catch (error) {
        console.error('Error processing audit event:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/audit/stats - Get analytics statistics
app.get('/api/audit/stats', (req, res) => {
    try {
        const logs = loadLogs();
        
        // Calculate statistics
        const stats = {
            totalEvents: logs.length,
            pageViews: logs.filter(e => e.type === 'page_view').length,
            uniqueSessions: new Set(logs.map(e => e.sessionId)).size,
            clicks: logs.filter(e => e.type === 'click').length,
            formSubmissions: logs.filter(e => e.type === 'form_submission').length,
            
            // Device breakdown
            devices: {
                desktop: logs.filter(e => e.device?.type === 'desktop').length,
                mobile: logs.filter(e => e.device?.type === 'mobile').length,
                tablet: logs.filter(e => e.device?.type === 'tablet').length
            },
            
            // Top pages
            topPages: getTopPages(logs),
            
            // Recent events
            recentEvents: logs.slice(-10).reverse(),
            
            // Time range
            timeRange: {
                first: logs[0]?.timestamp,
                last: logs[logs.length - 1]?.timestamp
            }
        };
        
        res.json(stats);
        
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET /api/audit/export - Export all logs
app.get('/api/audit/export', (req, res) => {
    try {
        const logs = loadLogs();
        
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=audit-logs.json');
        res.send(JSON.stringify(logs, null, 2));
        
    } catch (error) {
        console.error('Error exporting logs:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Helper function to get top pages
function getTopPages(logs) {
    const pageViews = logs.filter(e => e.type === 'page_view');
    const pages = {};
    
    pageViews.forEach(e => {
        const path = e.page?.path || '/';
        pages[path] = (pages[path] || 0) + 1;
    });
    
    return Object.entries(pages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([path, count]) => ({ path, count }));
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Audit Trail API running on port ${PORT}`);
    console.log(`📊 POST /api/audit - Receive events`);
    console.log(`📈 GET /api/audit/stats - View statistics`);
    console.log(`💾 GET /api/audit/export - Export logs`);
});

module.exports = app;
