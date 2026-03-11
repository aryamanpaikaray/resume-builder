const PDFDocument = require('pdfkit');

/**
 * Generates a resume PDF buffer from resume data.
 * Returns: { buffer: Buffer, password: string }
 * NOTE: PDFKit does not support native PDF password encryption.
 * Password is displayed on screen and in email body as per spec.
 * For true PDF encryption, integrate qpdf CLI or use a paid service.
 */
function generatePassword(resume) {
  // Format: FirstName-DDMMYYYY
  const firstName = (resume.fullName || 'User').split(' ')[0];
  const dob = (resume.dob || '').replace(/-/g, ''); // YYYYMMDD → remove dashes
  // Reformat to DDMMYYYY if dob is YYYY-MM-DD
  let dobFormatted = dob;
  if (resume.dob && resume.dob.includes('-')) {
    const parts = resume.dob.split('-');
    if (parts.length === 3) {
      dobFormatted = parts[2] + parts[1] + parts[0]; // DD+MM+YYYY
    }
  }
  return `${firstName}-${dobFormatted || 'XXXXXXXX'}`;
}

function generateResumePDF(resume) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => {
      const buffer = Buffer.concat(chunks);
      resolve({ buffer, password: generatePassword(resume) });
    });
    doc.on('error', reject);

    const W = 595.28 - 100; // A4 width minus margins

    // ── HEADER ──────────────────────────────────────────────
    doc.fontSize(26).font('Helvetica-Bold').fillColor('#1a1a2e').text(resume.fullName || '', { align: 'center' });
    doc.moveDown(0.3);

    // Contact row
    const contacts = [];
    if (resume.email) contacts.push(`✉ ${resume.email}`);
    if (resume.phone) contacts.push(`📞 ${resume.phone}`);
    if (resume.address) contacts.push(`📍 ${resume.address}`);
    doc.fontSize(9).font('Helvetica').fillColor('#555').text(contacts.join('   |   '), { align: 'center' });

    const links = [];
    if (resume.linkedin) links.push(`LinkedIn: ${resume.linkedin}`);
    if (resume.github) links.push(`GitHub: ${resume.github}`);
    if (resume.website) links.push(`Website: ${resume.website}`);
    if (links.length) {
      doc.moveDown(0.2).fontSize(9).fillColor('#2563eb').text(links.join('   |   '), { align: 'center' });
    }

    // Divider
    doc.moveDown(0.5).moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#1a1a2e').lineWidth(2).stroke();
    doc.moveDown(0.5);

    // ── HELPER FUNCTIONS ──
    const sectionTitle = (title) => {
      doc.moveDown(0.5);
      doc.fontSize(12).font('Helvetica-Bold').fillColor('#1a1a2e').text(title.toUpperCase());
      doc.moveDown(0.1).moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#ccc').lineWidth(1).stroke();
      doc.moveDown(0.3);
    };

    const bodyText = (text, opts = {}) => {
      doc.fontSize(9.5).font('Helvetica').fillColor('#222').text(text || '', opts);
    };

    const labelText = (label, value) => {
      if (!value) return;
      doc.fontSize(9.5);
      doc.font('Helvetica-Bold').fillColor('#333').text(label + ': ', { continued: true });
      doc.font('Helvetica').fillColor('#222').text(value);
    };

    // ── PROFILE SUMMARY ──
    if (resume.profileSummary) {
      sectionTitle('Professional Summary');
      bodyText(resume.profileSummary, { align: 'justify' });
    }

    // ── EDUCATION ──
    if (resume.education && resume.education.length) {
      sectionTitle('Education');
      resume.education.forEach(edu => {
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#1a1a2e')
          .text(`${edu.degree || ''}${edu.field ? ' in ' + edu.field : ''}`, { continued: !!edu.endYear });
        if (edu.endYear) {
          doc.font('Helvetica').fillColor('#666').fontSize(9).text(`  ${edu.startYear || ''} – ${edu.endYear || 'Present'}`, { align: 'right' });
        } else {
          doc.text('');
        }
        doc.fontSize(9.5).font('Helvetica').fillColor('#444').text(edu.institution || '');
        if (edu.grade) doc.fontSize(9).fillColor('#666').text(`CGPA/Percentage: ${edu.grade}`);
        doc.moveDown(0.4);
      });
    }

    // ── EXPERIENCE ──
    if (resume.experience && resume.experience.length) {
      sectionTitle('Work Experience');
      resume.experience.forEach(exp => {
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#1a1a2e')
          .text(`${exp.position || ''}`, { continued: true });
        doc.font('Helvetica').fillColor('#666').fontSize(9)
          .text(`  ${exp.startDate || ''} – ${exp.current ? 'Present' : (exp.endDate || '')}`, { align: 'right' });
        doc.fontSize(9.5).font('Helvetica-Oblique').fillColor('#2563eb').text(exp.company || '');
        if (exp.description) {
          const bullets = exp.description.split('\n').filter(Boolean);
          bullets.forEach(b => bodyText(`• ${b.replace(/^[-•]\s*/, '')}`));
        }
        doc.moveDown(0.5);
      });
    }

    // ── SKILLS ──
    if (resume.skills && resume.skills.length) {
      sectionTitle('Skills');
      resume.skills.forEach(skill => {
        doc.fontSize(9.5);
        doc.font('Helvetica-Bold').fillColor('#333').text(`${skill.category}: `, { continued: true });
        doc.font('Helvetica').fillColor('#222').text(skill.items || '');
      });
      doc.moveDown(0.3);
    }

    // ── PROJECTS ──
    if (resume.projects && resume.projects.length) {
      sectionTitle('Projects');
      resume.projects.forEach(proj => {
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#1a1a2e').text(proj.name || '');
        if (proj.technologies) {
          doc.fontSize(9).font('Helvetica-Oblique').fillColor('#2563eb').text(`Technologies: ${proj.technologies}`);
        }
        if (proj.description) bodyText(proj.description, { align: 'justify' });
        if (proj.link) {
          doc.fontSize(9).fillColor('#2563eb').text(`Link: ${proj.link}`);
        }
        doc.moveDown(0.5);
      });
    }

    // ── CERTIFICATIONS ──
    if (resume.certifications && resume.certifications.length) {
      sectionTitle('Certifications');
      resume.certifications.forEach(cert => {
        doc.fontSize(9.5).font('Helvetica-Bold').fillColor('#222').text(cert.name || '', { continued: true });
        doc.font('Helvetica').fillColor('#666').text(`  – ${cert.issuer || ''} ${cert.year ? '(' + cert.year + ')' : ''}`);
      });
      doc.moveDown(0.3);
    }

    // ── LANGUAGES ──
    if (resume.languages && resume.languages.length) {
      sectionTitle('Languages');
      const langStr = resume.languages.map(l => `${l.language} (${l.proficiency})`).join('   •   ');
      bodyText(langStr);
      doc.moveDown(0.3);
    }

    // ── ACHIEVEMENTS ──
    if (resume.achievements && resume.achievements.filter(Boolean).length) {
      sectionTitle('Achievements');
      resume.achievements.filter(Boolean).forEach(a => bodyText(`• ${a}`));
      doc.moveDown(0.3);
    }

    // ── HOBBIES ──
    if (resume.hobbies && resume.hobbies.filter(Boolean).length) {
      sectionTitle('Hobbies & Interests');
      bodyText(resume.hobbies.filter(Boolean).join('   •   '));
    }

    doc.end();
  });
}

module.exports = { generateResumePDF, generatePassword };
