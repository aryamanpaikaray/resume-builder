import React from 'react';

const empty = { institution: '', degree: '', field: '', startYear: '', endYear: '', grade: '' };

export default function Education({ data, onChange }) {
  const update = (i, field) => (e) => {
    const updated = data.map((item, idx) => idx === i ? { ...item, [field]: e.target.value } : item);
    onChange(updated);
  };
  const add = () => onChange([...data, { ...empty }]);
  const remove = (i) => onChange(data.filter((_, idx) => idx !== i));

  return (
    <div className="form-section">
      <div className="section-header">
        <h3 className="section-title">🎓 Education</h3>
        <button type="button" className="btn-add" onClick={add}>+ Add</button>
      </div>
      {data.map((edu, i) => (
        <div key={i} className="dynamic-entry">
          <div className="entry-header">
            <span className="entry-num">#{i + 1}</span>
            {data.length > 1 && <button type="button" className="btn-remove" onClick={() => remove(i)}>✕</button>}
          </div>
          <div className="form-grid form-grid-2">
            <div className="form-group form-col-2">
              <label>Institution Name</label>
              <input type="text" value={edu.institution} onChange={update(i, 'institution')} placeholder="University / College / School" />
            </div>
            <div className="form-group">
              <label>Degree / Qualification</label>
              <input type="text" value={edu.degree} onChange={update(i, 'degree')} placeholder="B.Tech / B.Sc / MBA" />
            </div>
            <div className="form-group">
              <label>Field of Study</label>
              <input type="text" value={edu.field} onChange={update(i, 'field')} placeholder="Computer Science" />
            </div>
            <div className="form-group">
              <label>Start Year</label>
              <input type="text" value={edu.startYear} onChange={update(i, 'startYear')} placeholder="2020" />
            </div>
            <div className="form-group">
              <label>End Year</label>
              <input type="text" value={edu.endYear} onChange={update(i, 'endYear')} placeholder="2024 or Present" />
            </div>
            <div className="form-group form-col-2">
              <label>Grade / CGPA / Percentage</label>
              <input type="text" value={edu.grade} onChange={update(i, 'grade')} placeholder="8.5 CGPA / 85%" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
