import React from 'react';
import { proficiencyOptions } from '../../utils/defaultData';

export function Certifications({ data, onChange }) {
  const empty = { name: '', issuer: '', year: '' };
  const update = (i, field) => (e) => {
    onChange(data.map((item, idx) => idx === i ? { ...item, [field]: e.target.value } : item));
  };
  const add = () => onChange([...data, { ...empty }]);
  const remove = (i) => onChange(data.filter((_, idx) => idx !== i));

  return (
    <div className="form-section">
      <div className="section-header">
        <h3 className="section-title">📜 Certifications</h3>
        <button type="button" className="btn-add" onClick={add}>+ Add</button>
      </div>
      {data.map((cert, i) => (
        <div key={i} className="dynamic-entry">
          <div className="form-grid form-grid-3">
            <div className="form-group">
              <label>Certification Name</label>
              <input value={cert.name} onChange={update(i, 'name')} placeholder="AWS Solutions Architect" />
            </div>
            <div className="form-group">
              <label>Issuing Organization</label>
              <input value={cert.issuer} onChange={update(i, 'issuer')} placeholder="Amazon Web Services" />
            </div>
            <div className="form-group cert-year-row">
              <label>Year</label>
              <input value={cert.year} onChange={update(i, 'year')} placeholder="2023" style={{ maxWidth: '100px' }} />
              {data.length > 1 && <button type="button" className="btn-remove" onClick={() => remove(i)}>✕</button>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Languages({ data, onChange }) {
  const empty = { language: '', proficiency: 'Fluent' };
  const update = (i, field) => (e) => {
    onChange(data.map((item, idx) => idx === i ? { ...item, [field]: e.target.value } : item));
  };
  const add = () => onChange([...data, { ...empty }]);
  const remove = (i) => onChange(data.filter((_, idx) => idx !== i));

  return (
    <div className="form-section">
      <div className="section-header">
        <h3 className="section-title">🌐 Languages</h3>
        <button type="button" className="btn-add" onClick={add}>+ Add</button>
      </div>
      {data.map((lang, i) => (
        <div key={i} className="dynamic-entry">
          <div className="form-grid form-grid-skill">
            <div className="form-group">
              <label>Language</label>
              <input value={lang.language} onChange={update(i, 'language')} placeholder="English" />
            </div>
            <div className="form-group">
              <label>Proficiency</label>
              <select value={lang.proficiency} onChange={update(i, 'proficiency')}>
                {proficiencyOptions.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="form-group remove-col">
              {data.length > 1 && <button type="button" className="btn-remove" onClick={() => remove(i)}>✕</button>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ListSection({ title, icon, data, onChange, placeholder }) {
  const update = (i) => (e) => {
    onChange(data.map((item, idx) => idx === i ? e.target.value : item));
  };
  const add = () => onChange([...data, '']);
  const remove = (i) => onChange(data.filter((_, idx) => idx !== i));

  return (
    <div className="form-section">
      <div className="section-header">
        <h3 className="section-title">{icon} {title}</h3>
        <button type="button" className="btn-add" onClick={add}>+ Add</button>
      </div>
      {data.map((item, i) => (
        <div key={i} className="list-item-row">
          <input type="text" value={item} onChange={update(i)} placeholder={placeholder} />
          {data.length > 1 && <button type="button" className="btn-remove" onClick={() => remove(i)}>✕</button>}
        </div>
      ))}
    </div>
  );
}
