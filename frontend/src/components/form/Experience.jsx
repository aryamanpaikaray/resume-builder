import React from 'react';

const empty = { company: '', position: '', startDate: '', endDate: '', current: false, description: '' };

export default function Experience({ data, onChange }) {
  const update = (i, field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    const updated = data.map((item, idx) => idx === i ? { ...item, [field]: val } : item);
    onChange(updated);
  };
  const add = () => onChange([...data, { ...empty }]);
  const remove = (i) => onChange(data.filter((_, idx) => idx !== i));

  return (
    <div className="form-section">
      <div className="section-header">
        <h3 className="section-title">💼 Work Experience</h3>
        <button type="button" className="btn-add" onClick={add}>+ Add</button>
      </div>
      {data.map((exp, i) => (
        <div key={i} className="dynamic-entry">
          <div className="entry-header">
            <span className="entry-num">#{i + 1}</span>
            {data.length > 1 && <button type="button" className="btn-remove" onClick={() => remove(i)}>✕</button>}
          </div>
          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label>Company / Organization</label>
              <input type="text" value={exp.company} onChange={update(i, 'company')} placeholder="Google Inc." />
            </div>
            <div className="form-group">
              <label>Position / Role</label>
              <input type="text" value={exp.position} onChange={update(i, 'position')} placeholder="Software Engineer" />
            </div>
            <div className="form-group">
              <label>Start Date</label>
              <input type="month" value={exp.startDate} onChange={update(i, 'startDate')} />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input type="month" value={exp.endDate} onChange={update(i, 'endDate')} disabled={exp.current} />
              <label className="checkbox-label">
                <input type="checkbox" checked={exp.current} onChange={update(i, 'current')} />
                Currently working here
              </label>
            </div>
            <div className="form-group form-col-2">
              <label>Description / Key Responsibilities</label>
              <textarea value={exp.description} onChange={update(i, 'description')} rows={4}
                placeholder="• Led development of...&#10;• Improved performance by...&#10;• Collaborated with..." />
              <span className="hint">Use each line as a bullet point</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
