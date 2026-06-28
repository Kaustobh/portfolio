const express = require('express');
const cors    = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── CORS ──────────────────────────────────────────────────────────────────
app.use(cors({
    origin: '*',
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ─── SMTP TRANSPORTER ──────────────────────────────────────────────────────
// Uses the nodemailer "gmail" service shorthand which handles TLS correctly.
// Requires a 16-char Gmail App Password — NOT your normal account password.
// Generate one at: https://myaccount.google.com/apppasswords
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const RECEIVER  = process.env.RECEIVER_EMAIL || SMTP_USER;

let transporter = null;

if (SMTP_USER && SMTP_PASS) {
    transporter = nodemailer.createTransport({
        service: 'gmail',           // Handles host/port/TLS automatically
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS          // Must be a Gmail App Password
        }
    });

    // Verify connection at startup
    transporter.verify((err) => {
        if (err) {
            console.error('\n❌  SMTP verify failed:', err.message);
            console.error('   → Make sure SMTP_PASS in .env is a Gmail App Password,');
            console.error('     not your normal Gmail password.\n');
        } else {
            console.log('✅  SMTP transporter verified — email dispatch is LIVE.\n');
        }
    });
} else {
    console.warn('\n⚠️   SMTP credentials not set.');
    console.warn('    Booking emails will NOT be sent until you add your Gmail App Password.');
    console.warn('    Run:  node setup.js   for an interactive setup guide.\n');
}

// ─── PREMIUM EMAIL TEMPLATE ────────────────────────────────────────────────
function buildEmailHTML({ name, email, company, date, time, message }) {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Briefing Locked</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Courier New', Courier, monospace;
    background: #050507;
    color: #cbd5e1;
    padding: 24px;
  }
  .wrap {
    max-width: 580px;
    margin: auto;
    background: #121622;
    border: 1px solid rgba(74,222,128,.25);
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 0 40px rgba(74,222,128,.08);
  }
  /* ── Header ── */
  .hdr {
    background: #08090c;
    border-bottom: 1px solid rgba(74,222,128,.15);
    padding: 24px 28px;
    text-align: center;
  }
  .hdr-tag {
    display: inline-block;
    background: rgba(74,222,128,.12);
    border: 1px solid rgba(74,222,128,.3);
    color: #4ade80;
    font-size: 9px;
    letter-spacing: .18em;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 100px;
    margin-bottom: 10px;
  }
  .hdr h1 {
    color: #f8fafc;
    font-size: 20px;
    letter-spacing: .06em;
    font-weight: 700;
  }
  .hdr-sub { color: #64748b; font-size: 10px; margin-top: 4px; letter-spacing: .12em; }
  /* ── Body ── */
  .body { padding: 28px; }
  .section-label {
    font-size: 8px;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: #4ade80;
    margin-bottom: 10px;
  }
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 20px;
  }
  .card {
    background: #0d0f17;
    border: 1px solid rgba(255,255,255,.06);
    border-radius: 8px;
    padding: 12px 14px;
  }
  .card-label {
    font-size: 7px;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: .12em;
  }
  .card-value {
    color: #f8fafc;
    font-size: 13px;
    font-weight: 700;
    margin-top: 4px;
    word-break: break-word;
  }
  .card-value.green { color: #4ade80; }
  .card-value.amber { color: #fbbf24; }
  .card-value.blue  { color: #60a5fa; }
  .divider {
    height: 1px;
    background: rgba(255,255,255,.06);
    margin: 20px 0;
  }
  .msg-box {
    background: #0d0f17;
    border-left: 3px solid #60a5fa;
    padding: 14px 16px;
    border-radius: 4px;
    font-size: 12px;
    line-height: 1.7;
    color: #cbd5e1;
  }
  /* ── Footer ── */
  .ftr {
    background: #08090c;
    border-top: 1px solid rgba(255,255,255,.05);
    padding: 16px 28px;
    text-align: center;
    font-size: 9px;
    color: #475569;
    letter-spacing: .06em;
    line-height: 1.8;
  }
  .ftr a { color: #4ade80; text-decoration: none; }
  .dot { display: inline-block; width: 5px; height: 5px; border-radius: 50%;
         background: #4ade80; margin: 0 6px 1px; vertical-align: middle; }
  @media (max-width:500px) { .grid { grid-template-columns: 1fr; } }
</style>
</head>
<body>
<div class="wrap">
  <!-- Header -->
  <div class="hdr">
    <div class="hdr-tag">New Briefing Request</div>
    <h1>Holographic Briefing Locked</h1>
    <div class="hdr-sub">Kaustobh Bhattacharya · Portfolio Terminal</div>
  </div>

  <!-- Body -->
  <div class="body">
    <div class="section-label">Recruiter Node // Identity Matrix</div>
    <div class="grid">
      <div class="card">
        <div class="card-label">Full Name</div>
        <div class="card-value">${name}</div>
      </div>
      <div class="card">
        <div class="card-label">Email Address</div>
        <div class="card-value blue">${email}</div>
      </div>
      <div class="card" style="grid-column:1/-1">
        <div class="card-label">Company / Agency</div>
        <div class="card-value">${company}</div>
      </div>
    </div>

    <div class="section-label">Scheduled Briefing Window</div>
    <div class="grid">
      <div class="card">
        <div class="card-label">Date Node</div>
        <div class="card-value amber">${date}</div>
      </div>
      <div class="card">
        <div class="card-label">Time Slot</div>
        <div class="card-value green">${time}</div>
      </div>
    </div>

    <div class="divider"></div>

    <div class="section-label">Message / Project Brief</div>
    <div class="msg-box">
      ${message ? message.replace(/\n/g, '<br>') : '<em style="color:#475569">No additional brief provided.</em>'}
    </div>
  </div>

  <!-- Footer -->
  <div class="ftr">
    <span class="dot"></span>
    Matrix synchronization dispatched &mdash; Core node active.<br>
    <a href="https://kaustobh.github.io/portfolio">kaustobh.github.io/portfolio</a>
    &nbsp;·&nbsp; &copy; 2026 Kaustobh Bhattacharya. All rights reserved.
  </div>
</div>
</body>
</html>`;
}

// ─── ROUTES ────────────────────────────────────────────────────────────────

// Health check
app.get('/', (req, res) => {
    res.json({
        status: 'live',
        smtp:   transporter ? 'configured' : 'missing_credentials',
        note:   transporter ? 'Email dispatch is active.' : 'Add SMTP_PASS to .env to enable emails.'
    });
});

// Book a briefing
app.post('/api/book', async (req, res) => {
    const { name, email, company, message, date, time } = req.body;

    if (!name || !email || !company || !date || !time) {
        return res.status(400).json({
            success: false,
            error: 'Missing required fields: name, email, company, date, time.'
        });
    }

    if (!transporter) {
        // Respond OK to frontend (don't fail the UX) but warn in logs
        console.warn(`[BOOKING] Email skipped — SMTP not configured. Booking from: ${name} <${email}> @ ${company}`);
        return res.status(200).json({
            success: true,
            warning: 'Booking recorded but email not sent — SMTP credentials missing in .env.',
            booking: { name, email, company, date, time }
        });
    }

    const html = buildEmailHTML({ name, email, company, date, time, message });

    const mailOptions = {
        from:    `"Kaustobh Portfolio" <${SMTP_USER}>`,
        to:      RECEIVER,
        subject: `🔒 Briefing Locked // ${name} · ${company}`,
        text:    `New Booking!\n\nName: ${name}\nEmail: ${email}\nCompany: ${company}\nDate: ${date}\nTime: ${time}\nMessage: ${message || 'None'}`,
        html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[BOOKING] Email sent → ${info.messageId}`);
        res.status(200).json({
            success: true,
            message: 'Briefing confirmation dispatched.',
            id: info.messageId
        });
    } catch (err) {
        console.error('[BOOKING] Email error:', err.message);
        res.status(500).json({
            success: false,
            error: 'Email dispatch failed: ' + err.message
        });
    }
});

// Quick test-email route (GET for easy browser testing)
app.get('/api/test-email', async (req, res) => {
    if (!transporter) {
        return res.status(503).json({ success: false, error: 'SMTP not configured. Add SMTP_PASS to .env.' });
    }
    try {
        await transporter.sendMail({
            from:    `"Kaustobh Portfolio" <${SMTP_USER}>`,
            to:      RECEIVER,
            subject: '✅ Test — SMTP is working!',
            html:    '<p style="font-family:monospace;color:#4ade80">SMTP connection verified. Booking emails are live.</p>'
        });
        res.json({ success: true, message: 'Test email sent! Check your inbox.' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ─── START ─────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🚀  Elysium Booking Backend  →  http://localhost:${PORT}`);
    console.log(`    Health check  →  http://localhost:${PORT}/`);
    console.log(`    Test email    →  http://localhost:${PORT}/api/test-email\n`);
});
