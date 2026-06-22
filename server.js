const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests
app.use(cors({
    origin: '*', // Adjust to specific domain in production if needed
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Setup transporter using SMTP details in env
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: process.env.SMTP_SECURE === 'true' || process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Verify SMTP connection on startup
transporter.verify((error, success) => {
    if (error) {
        console.warn('Warning: SMTP Transporter verification failed:', error.message);
    } else {
        console.log('Success: SMTP Transporter ready to dispatch briefing notifications.');
    }
});

// Endpoint to book briefings
app.post('/api/book', async (req, res) => {
    const { name, email, company, message, date, time } = req.body;

    // Simple validation checks
    if (!name || !email || !company || !date || !time) {
        return res.status(400).json({ 
            success: false, 
            error: 'Missing required credential inputs (name, email, company, date, time).' 
        });
    }

    // Polished HTML Email Template (Bio Grid themed)
    const htmlTemplate = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <style>
            body {
                font-family: 'Space Mono', 'Courier New', Courier, monospace;
                background-color: #050507;
                color: #cbd5e1;
                margin: 0;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #121622;
                border: 1px solid rgba(255, 255, 255, 0.12);
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            }
            .header {
                background-color: #08090c;
                border-bottom: 1px solid rgba(255, 255, 255, 0.12);
                padding: 20px;
                text-align: center;
            }
            .header h2 {
                color: #4ade80;
                margin: 0;
                font-size: 18px;
                letter-spacing: 0.15em;
                text-transform: uppercase;
            }
            .content {
                padding: 24px;
            }
            .grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: 12px;
                margin-bottom: 20px;
            }
            .metric-card {
                background-color: #0d0f17;
                border: 1px solid rgba(255, 255, 255, 0.05);
                padding: 14px;
                border-radius: 8px;
            }
            .metric-label {
                font-size: 8px;
                color: #94a3b8;
                text-transform: uppercase;
                letter-spacing: 0.1em;
            }
            .metric-value {
                font-size: 13px;
                color: #f8fafc;
                font-weight: bold;
                margin-top: 4px;
            }
            .msg-box {
                background-color: #0d0f17;
                border-left: 3px solid #60a5fa;
                padding: 14px;
                border-radius: 4px;
                font-size: 11px;
                line-height: 1.6;
                color: #cbd5e1;
                margin-top: 15px;
            }
            .footer {
                background-color: #08090c;
                border-top: 1px solid rgba(255, 255, 255, 0.05);
                padding: 16px;
                text-align: center;
                font-size: 9px;
                color: #94a3b8;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Holographic Briefing locked</h2>
            </div>
            <div class="content">
                <div class="grid">
                    <div class="metric-card">
                        <div class="metric-label">Recruiter Name</div>
                        <div class="metric-value">${name}</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Email Address</div>
                        <div class="metric-value">${email}</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Company / Agency</div>
                        <div class="metric-value">${company}</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Scheduled Date Node</div>
                        <div class="metric-value" style="color: #fbbf24;">${date}</div>
                    </div>
                    <div class="metric-card">
                        <div class="metric-label">Selected Time Slot</div>
                        <div class="metric-value" style="color: #4ade80;">${time}</div>
                    </div>
                </div>

                <div class="metric-label" style="margin-top: 20px;">Project Details / Message</div>
                <div class="msg-box">
                    ${message ? message.replace(/\n/g, '<br/>') : 'No custom message specified.'}
                </div>
            </div>
            <div class="footer">
                Matrix synchronization dispatched. Core representative node active.<br/>
                &copy; 2026 Kaustobh Bhattacharya. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    `;

    const mailOptions = {
        from: `"Kaustobh Portfolio" <${process.env.SMTP_USER}>`,
        to: process.env.RECEIVER_EMAIL || 'kaustobh1920@gmail.com',
        subject: `Briefing Locked // ${name} - ${company}`,
        text: `New Booking Confirmed!\n\nName: ${name}\nEmail: ${email}\nCompany: ${company}\nDate: ${date}\nTime: ${time}\nMessage: ${message || 'None'}`,
        html: htmlTemplate
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ 
            success: true, 
            message: 'Briefing confirmation email dispatched successfully.' 
        });
    } catch (error) {
        console.error('Email dispatch error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to send booking email notification: ' + error.message 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Elysium Booking Backend active on http://localhost:${PORT}`);
});
