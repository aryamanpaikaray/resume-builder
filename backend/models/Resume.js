const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  // Personal Info
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  dob: { type: String }, // used for password generation
  address: { type: String },
  linkedin: { type: String },
  github: { type: String },
  website: { type: String },
  profileSummary: { type: String },

  // Education
  education: [{
    institution: String,
    degree: String,
    field: String,
    startYear: String,
    endYear: String,
    grade: String,
  }],

  // Experience
  experience: [{
    company: String,
    position: String,
    startDate: String,
    endDate: String,
    current: Boolean,
    description: String,
  }],

  // Skills
  skills: [{
    category: String,
    items: String, // comma-separated
  }],

  // Projects
  projects: [{
    name: String,
    description: String,
    technologies: String,
    link: String,
  }],

  // Certifications
  certifications: [{
    name: String,
    issuer: String,
    year: String,
  }],

  // Languages
  languages: [{
    language: String,
    proficiency: String,
  }],

  // Achievements / Hobbies
  achievements: [String],
  hobbies: [String],

  emailSent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Resume', ResumeSchema);
