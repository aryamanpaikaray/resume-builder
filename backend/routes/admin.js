const express = require('express');
const router = express.Router();
const Resume = require('../models/Resume');
const { generatePassword } = require('../utils/pdfGenerator');

// ── GET /api/admin/resumes ── Get all resumes and count
router.get('/resumes', async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 });
    res.json({ count: resumes.length, resumes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── PUT /api/admin/resumes/:id ── Admin edit resume (no time restriction)
router.put('/resumes/:id', async (req, res) => {
  try {
    const resume = await Resume.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!resume) return res.status(404).json({ error: 'Resume not found.' });
    const password = generatePassword(resume);
    res.json({ success: true, resumeId: resume._id, password, resume });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── DELETE /api/admin/resumes/:id ── Delete a resume
router.delete('/resumes/:id', async (req, res) => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);
    if (!resume) return res.status(404).json({ error: 'Resume not found.' });
    res.json({ success: true, message: 'Resume deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
