import React from 'react';

const empty = { category: '', items: '' };

export default function Skills({ data, onChange }) {
  const update = (i, field) => (e) => {
    const updated = data.map((item, idx) => idx === i ? { ...item, [field]: e.target.value } : item);
    onChange(updated);
  };
  const add = () => onChange([...data, { ...empty }]);
  const remove = (i) => onChange(data.filter((_, idx) => idx !== i));

  return (
    <div className="form-section">
      <div className="section-header">
        <h3 className="section-title">🛠 Skills</h3>
        <button type="button" className="btn-add" onClick={add}>+ Add Category</button>
      </div>
      {data.map((skill, i) => (
        <div key={i} className="dynamic-entry skill-entry">
          <div className="form-grid form-grid-skill">
            <div className="form-group">
              <label>Category</label>
              <input type="text" value={skill.category} onChange={update(i, 'category')} placeholder="Programming Languages" />
            </div>
            <div className="form-group">
              <label>Skills <span className="hint">(comma separated)</span></label>
              <input type="text" value={skill.items} onChange={update(i, 'items')} placeholder="JavaScript, Python, Java, C++" />
            </div>
            <div className="form-group remove-col">
              {data.length > 1 && (
                <button type="button" className="btn-remove" onClick={() => remove(i)}>✕</button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
