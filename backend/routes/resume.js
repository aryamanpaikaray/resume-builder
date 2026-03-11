const express = require('express');
const router = express.Router();
const Resume = require('../models/Resume');
const Config = require('../models/Config');
const { generateResumePDF, generatePassword } = require('../utils/pdfGenerator');
const { sendResumeEmail } = require('../utils/emailSender');

// ── Middleware: check time access ──────────────────────────────
const checkTimeAccess = async (req, res, next) => {
  try {
    const config = await Config.findOne({ key: 'deploymentTime' });
    if (!config) return res.status(403).json({ error: 'Deployment time not set.' });

    const deploymentTime = new Date(config.value);
    const diffMinutes = (new Date() - deploymentTime) / (1000 * 60);

    if (diffMinutes > 20) {
      return res.status(403).json({ error: 'Resume submission time has expired.' });
    }
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ── POST /api/resume ── Save resume (time-gated)
router.post('/', checkTimeAccess, async (req, res) => {
  try {
    const resume = new Resume(req.body);
    await resume.save();
    const password = generatePassword(resume);
    res.status(201).json({ success: true, resumeId: resume._id, password });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PUT /api/resume/:id ── Update resume (time-gated)
router.put('/:id', checkTimeAccess, async (req, res) => {
  try {
    const resume = await Resume.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!resume) return res.status(404).json({ error: 'Resume not found.' });
    const password = generatePassword(resume);
    res.json({ success: true, resumeId: resume._id, password });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/resume/:id ── Get resume by ID
router.get('/:id', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ error: 'Resume not found.' });
    res.json(resume);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/resume/:id/download ── Generate & return PDF
router.post('/:id/download', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ error: 'Resume not found.' });

    const { buffer, password } = await generateResumePDF(resume);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${resume.fullName.replace(/\s+/g, '_')}_Resume.pdf"`,
      'X-Resume-Password': password,
    });
    res.send(buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/resume/:id/email ── Send resume via email
router.post('/:id/email', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ error: 'Resume not found.' });

    const { email } = req.body;
    const recipientEmail = email || resume.email;

    if (!recipientEmail) return res.status(400).json({ error: 'No email address provided.' });

    const { buffer, password } = await generateResumePDF(resume);

    await sendResumeEmail({
      to: recipientEmail,
      name: resume.fullName,
      pdfBuffer: buffer,
      password,
    });

    await Resume.findByIdAndUpdate(req.params.id, { emailSent: true });

    res.json({ success: true, message: `Resume sent to ${recipientEmail}`, password });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
