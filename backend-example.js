// Backend Example - Secure Contact Form Handler
// This is a Node.js/Express example for handling form submissions securely

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'https://yourdomain.com',
    credentials: true
}));
app.use(express.json({ limit: '10kb' })); // Limit payload size

// Rate limiting
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per window
    message: 'Too many contact form submissions. Please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// reCAPTCHA verification function
async function verifyRecaptcha(token) {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    
    try {
        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${secretKey}&response=${token}`
        });
        
        const data = await response.json();
        
        // Check if verification was successful and score is acceptable
        return data.success && data.score >= 0.5;
    } catch (error) {
        console.error('reCAPTCHA verification error:', error);
        return false;
    }
}

// Input validation functions
const validateInput = {
    name: (value) => {
        if (!validator.isLength(value, { min: 2, max: 100 })) return false;
        if (!validator.matches(value, /^[A-Za-z\s\-\.]+$/)) return false;
        return true;
    },
    
    email: (value) => {
        if (!validator.isEmail(value)) return false;
        if (!validator.isLength(value, { max: 254 })) return false;
        return true;
    },
    
    message: (value) => {
        return validator.isLength(value, { min: 10, max: 5000 });
    }
};

// Contact form endpoint
app.post('/api/contact', contactLimiter, async (req, res) => {
    try {
        const { name, email, message, recaptchaToken, website } = req.body;
        
        // Honeypot check
        if (website && website.trim() !== '') {
            console.warn('Bot detected via honeypot');
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid submission' 
            });
        }
        
        // Verify reCAPTCHA
        const isHuman = await verifyRecaptcha(recaptchaToken);
        if (!isHuman) {
            return res.status(400).json({ 
                success: false, 
                error: 'reCAPTCHA verification failed' 
            });
        }
        
        // Validate inputs
        if (!validateInput.name(name)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid name format' 
            });
        }
        
        if (!validateInput.email(email)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid email format' 
            });
        }
        
        if (!validateInput.message(message)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid message length' 
            });
        }
        
        // Sanitize inputs
        const sanitizedData = {
            name: validator.escape(validator.trim(name)),
            email: validator.normalizeEmail(email),
            message: validator.escape(validator.trim(message)),
            timestamp: new Date().toISOString(),
            ip: req.ip
        };
        
        // Here you would:
        // 1. Send email notification
        // 2. Save to database
        // 3. Send confirmation email to user
        
        console.log('Contact form submission:', sanitizedData);
        
        // Example: Send email using nodemailer
        /*
        const nodemailer = require('nodemailer');
        
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
        
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: process.env.CONTACT_EMAIL,
            subject: `Portfolio Contact: ${sanitizedData.name}`,
            text: `
                Name: ${sanitizedData.name}
                Email: ${sanitizedData.email}
                Message: ${sanitizedData.message}
                Time: ${sanitizedData.timestamp}
            `,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${sanitizedData.name}</p>
                <p><strong>Email:</strong> ${sanitizedData.email}</p>
                <p><strong>Message:</strong> ${sanitizedData.message}</p>
                <p><strong>Time:</strong> ${sanitizedData.timestamp}</p>
            `
        });
        */
        
        res.json({ 
            success: true, 
            message: 'Message sent successfully' 
        });
        
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Server error. Please try again later.' 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
    console.log(`Secure backend running on port ${PORT}`);
});

// Environment variables needed (.env file):
/*
PORT=3000
FRONTEND_URL=https://yourdomain.com
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@yourdomain.com
CONTACT_EMAIL=your_email@gmail.com
*/

// Installation commands:
/*
npm init -y
npm install express cors helmet express-rate-limit validator node-fetch nodemailer dotenv
*/
