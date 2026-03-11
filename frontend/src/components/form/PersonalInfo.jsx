import React from 'react';

export default function PersonalInfo({ data, onChange }) {
  const handle = (field) => (e) => onChange({ ...data, [field]: e.target.value });

  return (
    <div className="form-section">
      <h3 className="section-title">👤 Personal Information</h3>
      <div className="form-grid form-grid-2">
        <div className="form-group">
          <label>Full Name *</label>
          <input type="text" value={data.fullName} onChange={handle('fullName')} placeholder="John Doe" required />
        </div>
        <div className="form-group">
          <label>Email Address *</label>
          <input type="email" value={data.email} onChange={handle('email')} placeholder="john@example.com" required />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input type="tel" value={data.phone} onChange={handle('phone')} placeholder="+91 9876543210" />
        </div>
        <div className="form-group">
          <label>Date of Birth <span className="hint">(used for PDF password)</span></label>
          <input type="date" value={data.dob} onChange={handle('dob')} />
        </div>
        <div className="form-group form-col-2">
          <label>Address</label>
          <input type="text" value={data.address} onChange={handle('address')} placeholder="City, State, Country" />
        </div>
        <div className="form-group">
          <label>LinkedIn URL</label>
          <input type="url" value={data.linkedin} onChange={handle('linkedin')} placeholder="https://linkedin.com/in/username" />
        </div>
        <div className="form-group">
          <label>GitHub URL</label>
          <input type="url" value={data.github} onChange={handle('github')} placeholder="https://github.com/username" />
        </div>
        <div className="form-group form-col-2">
          <label>Portfolio / Website</label>
          <input type="url" value={data.website} onChange={handle('website')} placeholder="https://yourportfolio.com" />
        </div>
        <div className="form-group form-col-2">
          <label>Professional Summary</label>
          <textarea value={data.profileSummary} onChange={handle('profileSummary')} rows={4}
            placeholder="A brief 3-4 sentence summary of your professional background, skills, and career goals..." />
        </div>
      </div>
    </div>
  );
}
