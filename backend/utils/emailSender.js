const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send resume PDF as email attachment with password in body.
 */
async function sendResumeEmail({ to, name, pdfBuffer, password }) {
  const mailOptions = {
    from: `"Resume Builder" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Your Resume – ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #1a1a2e;">Hello ${name},</h2>
        <p>Your resume has been generated successfully. Please find it attached to this email.</p>

        <div style="background: #f0f4ff; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0; border-radius: 4px;">
          <p style="margin: 0; font-size: 16px;"><strong>🔐 PDF Password:</strong></p>
          <p style="margin: 8px 0 0; font-size: 20px; font-weight: bold; color: #1a1a2e; letter-spacing: 2px;">${password}</p>
          <p style="margin: 8px 0 0; font-size: 12px; color: #666;">Use this password to open your resume PDF.</p>
        </div>

        <p style="color: #555;">The password format is: <em>YourFirstName-DDMMYYYY</em> (your date of birth)</p>
        <p style="color: #888; font-size: 12px;">Please keep this password safe. You'll need it every time you open the PDF.</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="color: #aaa; font-size: 11px;">This email was sent from Resume Builder. Do not reply.</p>
      </div>
    `,
    attachments: [
      {
        filename: `${name.replace(/\s+/g, '_')}_Resume.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendResumeEmail };
