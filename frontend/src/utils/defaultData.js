export const defaultResumeData = {
  fullName: '',
  email: '',
  phone: '',
  dob: '',
  address: '',
  linkedin: '',
  github: '',
  website: '',
  profileSummary: '',
  education: [
    { institution: '', degree: '', field: '', startYear: '', endYear: '', grade: '' }
  ],
  experience: [
    { company: '', position: '', startDate: '', endDate: '', current: false, description: '' }
  ],
  skills: [
    { category: 'Programming Languages', items: '' },
    { category: 'Frameworks & Libraries', items: '' },
    { category: 'Tools & Technologies', items: '' },
  ],
  projects: [
    { name: '', description: '', technologies: '', link: '' }
  ],
  certifications: [
    { name: '', issuer: '', year: '' }
  ],
  languages: [
    { language: '', proficiency: 'Fluent' }
  ],
  achievements: [''],
  hobbies: [''],
};

export const proficiencyOptions = ['Native', 'Fluent', 'Professional', 'Intermediate', 'Basic'];
