import React from 'react';

const empty = { name: '', description: '', technologies: '', link: '' };

export default function Projects({ data, onChange }) {
  const update = (i, field) => (e) => {
    const updated = data.map((item, idx) => idx === i ? { ...item, [field]: e.target.value } : item);
    onChange(updated);
  };
  const add = () => onChange([...data, { ...empty }]);
  const remove = (i) => onChange(data.filter((_, idx) => idx !== i));

  return (
    <div className="form-section">
      <div className="section-header">
        <h3 className="section-title">🚀 Projects</h3>
        <button type="button" className="btn-add" onClick={add}>+ Add</button>
      </div>
      {data.map((proj, i) => (
        <div key={i} className="dynamic-entry">
          <div className="entry-header">
            <span className="entry-num">#{i + 1}</span>
            {data.length > 1 && <button type="button" className="btn-remove" onClick={() => remove(i)}>✕</button>}
          </div>
          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label>Project Name</label>
              <input type="text" value={proj.name} onChange={update(i, 'name')} placeholder="E-Commerce Platform" />
            </div>
            <div className="form-group">
              <label>Technologies Used</label>
              <input type="text" value={proj.technologies} onChange={update(i, 'technologies')} placeholder="React, Node.js, MongoDB" />
            </div>
            <div className="form-group form-col-2">
              <label>Description</label>
              <textarea value={proj.description} onChange={update(i, 'description')} rows={3}
                placeholder="Built a full-stack e-commerce platform with real-time inventory management..." />
            </div>
            <div className="form-group form-col-2">
              <label>Project Link (GitHub / Live URL)</label>
              <input type="url" value={proj.link} onChange={update(i, 'link')} placeholder="https://github.com/username/project" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
