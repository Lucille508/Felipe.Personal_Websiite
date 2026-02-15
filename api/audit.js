// Vercel Serverless Function for Audit Trail
const crypto = require('crypto');

// In-memory storage (for demo - use a database in production)
let auditData = [];

// Helper functions
function hashIP(ip) {
    return crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);
}

function getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0] || 
           req.headers['x-real-ip'] || 
           'unknown';
}

// Main handler
module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    const { method, url } = req;
    
    try {
        // POST /api/audit - Log event
        if (method === 'POST' && url === '/api/audit') {
            const event = req.body;
            
            // Add server data
            event.server = {
                receivedAt: new Date().toISOString(),
                ip: getClientIP(req),
                ipHash: hashIP(getClientIP(req)),
                userAgent: req.headers['user-agent'],
                referer: req.headers['referer'] || req.headers['referrer']
            };
            
            auditData.push(event);
            
            // Keep only last 1000 events (memory limit)
            if (auditData.length > 1000) {
                auditData = auditData.slice(-1000);
            }
            
            return res.status(200).json({ success: true, message: 'Event logged' });
        }
        
        // GET /api/audit/events - Get all events
        if (method === 'GET' && url.includes('/events')) {
            return res.status(200).json(auditData.reverse());
        }
        
        // GET /api/audit/summary - Get summary
        if (method === 'GET' && url.includes('/summary')) {
            const uniqueVisitors = new Set(auditData.map(e => e.visitorId)).size;
            const eventsByType = {};
            
            auditData.forEach(e => {
                eventsByType[e.eventType] = (eventsByType[e.eventType] || 0) + 1;
            });
            
            return res.status(200).json({
                totalEvents: auditData.length,
                uniqueVisitors,
                eventsByType
            });
        }
        
        // DELETE /api/audit/clear - Clear data
        if (method === 'DELETE' && url.includes('/clear')) {
            auditData = [];
            return res.status(200).json({ success: true, message: 'Data cleared' });
        }
        
        // Default response
        return res.status(200).json({ 
            message: 'Audit API',
            endpoints: [
                'POST /api/audit',
                'GET /api/audit/events',
                'GET /api/audit/summary',
                'DELETE /api/audit/clear'
            ]
        });
        
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Server error', message: error.message });
    }
};
