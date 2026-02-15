// Vercel Serverless Function for Audit Trail
// In-memory storage (resets on cold starts - use database for production)
let auditData = [];

function hashIP(ip) {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(ip).digest('hex').substring(0, 16);
}

function getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0] || 
           req.headers['x-real-ip'] || 
           req.socket?.remoteAddress ||
           'unknown';
}

export default function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    const { method, query } = req;
    const action = query.action || '';
    
    try {
        // POST /api/audit - Log event
        if (method === 'POST' && !action) {
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
            
            // Keep only last 1000 events
            if (auditData.length > 1000) {
                auditData = auditData.slice(-1000);
            }
            
            return res.status(200).json({ 
                success: true, 
                message: 'Event logged',
                total: auditData.length 
            });
        }
        
        // GET /api/audit?action=events - Get all events
        if (method === 'GET' && action === 'events') {
            return res.status(200).json([...auditData].reverse());
        }
        
        // GET /api/audit?action=summary - Get summary
        if (method === 'GET' && action === 'summary') {
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
        
        // DELETE /api/audit?action=clear - Clear data
        if (method === 'DELETE' && action === 'clear') {
            auditData = [];
            return res.status(200).json({ 
                success: true, 
                message: 'All data cleared' 
            });
        }
        
        // GET /api/audit - Default info
        if (method === 'GET' && !action) {
            return res.status(200).json({ 
                message: 'Audit API Running',
                currentEvents: auditData.length,
                endpoints: {
                    'POST /api/audit': 'Log event',
                    'GET /api/audit?action=events': 'Get all events',
                    'GET /api/audit?action=summary': 'Get summary',
                    'DELETE /api/audit?action=clear': 'Clear data'
                }
            });
        }
        
        return res.status(405).json({ error: 'Method not allowed' });
        
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ 
            error: 'Server error', 
            message: error.message 
        });
    }
}
