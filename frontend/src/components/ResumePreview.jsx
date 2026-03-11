import React, { forwardRef } from 'react';
import './ResumePreview.css';

const ResumePreview = forwardRef(({ data }, ref) => {
  const {
    fullName, email, phone, address, linkedin, github, website,
    profileSummary, education, experience, skills, projects,
    certifications, languages, achievements, hobbies
  } = data;

  const hasContent = (arr) => arr && arr.some(item => {
    if (typeof item === 'string') return item.trim();
    return Object.values(item).some(v => v && v !== false);
  });

  return (
    <div className="resume-preview" ref={ref}>
      {/* HEADER */}
      <header className="rv-header">
        <h1 className="rv-name">{fullName || 'Your Full Name'}</h1>
        <div className="rv-contacts">
          {email && <span>✉ {email}</span>}
          {phone && <span>📞 {phone}</span>}
          {address && <span>📍 {address}</span>}
        </div>
        {(linkedin || github || website) && (
          <div className="rv-links">
            {linkedin && <a href={linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
            {github && <a href={github} target="_blank" rel="noreferrer">GitHub</a>}
            {website && <a href={website} target="_blank" rel="noreferrer">Portfolio</a>}
          </div>
        )}
      </header>

      {/* SUMMARY */}
      {profileSummary && (
        <section className="rv-section">
          <h2 className="rv-section-title">Professional Summary</h2>
          <p className="rv-summary">{profileSummary}</p>
        </section>
      )}

      {/* EDUCATION */}
      {hasContent(education) && (
        <section className="rv-section">
          <h2 className="rv-section-title">Education</h2>
          {education.filter(e => e.institution || e.degree).map((edu, i) => (
            <div key={i} className="rv-entry">
              <div className="rv-entry-header">
                <div>
                  <span className="rv-title">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</span>
                  <span className="rv-subtitle">{edu.institution}</span>
                </div>
                <span className="rv-date">{edu.startYear}{edu.endYear ? ` – ${edu.endYear}` : ''}</span>
              </div>
              {edu.grade && <p className="rv-meta">Grade: {edu.grade}</p>}
            </div>
          ))}
        </section>
      )}

      {/* EXPERIENCE */}
      {hasContent(experience) && (
        <section className="rv-section">
          <h2 className="rv-section-title">Work Experience</h2>
          {experience.filter(e => e.company || e.position).map((exp, i) => (
            <div key={i} className="rv-entry">
              <div className="rv-entry-header">
                <div>
                  <span className="rv-title">{exp.position}</span>
                  <span className="rv-subtitle rv-company">{exp.company}</span>
                </div>
                <span className="rv-date">
                  {exp.startDate ? exp.startDate.replace('-', '/') : ''}
                  {' – '}
                  {exp.current ? 'Present' : (exp.endDate ? exp.endDate.replace('-', '/') : '')}
                </span>
              </div>
              {exp.description && (
                <ul className="rv-bullets">
                  {exp.description.split('\n').filter(Boolean).map((line, j) => (
                    <li key={j}>{line.replace(/^[-•]\s*/, '')}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* SKILLS */}
      {hasContent(skills) && (
        <section className="rv-section">
          <h2 className="rv-section-title">Skills</h2>
          <div className="rv-skills">
            {skills.filter(s => s.category || s.items).map((skill, i) => (
              <div key={i} className="rv-skill-row">
                <span className="rv-skill-cat">{skill.category}:</span>
                <span className="rv-skill-items">{skill.items}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {hasContent(projects) && (
        <section className="rv-section">
          <h2 className="rv-section-title">Projects</h2>
          {projects.filter(p => p.name).map((proj, i) => (
            <div key={i} className="rv-entry">
              <div className="rv-entry-header">
                <span className="rv-title">{proj.name}</span>
                {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="rv-link">View →</a>}
              </div>
              {proj.technologies && <p className="rv-tech">Technologies: {proj.technologies}</p>}
              {proj.description && <p className="rv-desc">{proj.description}</p>}
            </div>
          ))}
        </section>
      )}

      {/* CERTIFICATIONS */}
      {hasContent(certifications) && (
        <section className="rv-section">
          <h2 className="rv-section-title">Certifications</h2>
          {certifications.filter(c => c.name).map((cert, i) => (
            <div key={i} className="rv-cert">
              <span className="rv-cert-name">{cert.name}</span>
              <span className="rv-cert-meta"> – {cert.issuer} {cert.year && `(${cert.year})`}</span>
            </div>
          ))}
        </section>
      )}

      {/* LANGUAGES */}
      {hasContent(languages) && (
        <section className="rv-section">
          <h2 className="rv-section-title">Languages</h2>
          <div className="rv-lang-grid">
            {languages.filter(l => l.language).map((lang, i) => (
              <span key={i} className="rv-lang-tag">{lang.language} <em>({lang.proficiency})</em></span>
            ))}
          </div>
        </section>
      )}

      {/* ACHIEVEMENTS */}
      {achievements && achievements.filter(Boolean).length > 0 && (
        <section className="rv-section">
          <h2 className="rv-section-title">Achievements</h2>
          <ul className="rv-bullets">
            {achievements.filter(Boolean).map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </section>
      )}

      {/* HOBBIES */}
      {hobbies && hobbies.filter(Boolean).length > 0 && (
        <section className="rv-section">
          <h2 className="rv-section-title">Hobbies & Interests</h2>
          <p className="rv-hobbies">{hobbies.filter(Boolean).join(' • ')}</p>
        </section>
      )}
    </div>
  );
});

export default ResumePreview;
