import React, { useState, useRef } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

import PersonalInfo from './components/form/PersonalInfo';
import Education from './components/form/Education';
import Experience from './components/form/Experience';
import Skills from './components/form/Skills';
import Projects from './components/form/Projects';
import { Certifications, Languages, ListSection } from './components/form/AdditionalSections';
import ResumePreview from './components/ResumePreview';
import ActionBar from './components/ActionBar';
import TimerBanner from './components/TimerBanner';
import AdminPanel from './components/AdminPanel';

import { useAccessTimer } from './hooks/useAccessTimer';
import { defaultResumeData } from './utils/defaultData';
import { saveResume, updateResume, updateAdminResume, resetTimer } from './utils/api';

import './App.css';

function App() {
  const [resumeData, setResumeData] = useState(defaultResumeData);
  const [resumeId, setResumeId] = useState(null);
  const [password, setPassword] = useState(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('form');
  const [isAdminEdit, setIsAdminEdit] = useState(false);
  const previewRef = useRef();

  const { accessAllowed, formattedTime, remainingSeconds, loading, fetchAccess } = useAccessTimer();

  const update = (field) => (value) => setResumeData(prev => ({ ...prev, [field]: value }));

  const handleResetTimer = async () => {
    try {
      await resetTimer();
      toast.success('Timer reset successfully!');
      fetchAccess();
    } catch (err) {
      toast.error('Failed to reset timer.');
    }
  };

  const handleSave = async () => {
    if (!resumeData.fullName || !resumeData.email) {
      return toast.error('Full name and email are required.');
    }
    setSaving(true);
    try {
      let res;
      if (isAdminEdit) {
        res = await updateAdminResume(resumeId, resumeData);
      } else if (resumeId) {
        res = await updateResume(resumeId, resumeData);
      } else {
        res = await saveResume(resumeData);
      }
      setResumeId(res.data.resumeId);
      setPassword(res.data.password);
      toast.success('Resume saved successfully!');
      setActiveTab('preview');
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to save. Please try again.';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const formDisabled = !isAdminEdit && !accessAllowed && accessAllowed !== null;

  return (
    <div className="app">
      <Toaster position="top-right" />

      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-logo">
            <span className="logo-icon">📄</span>
            <span className="logo-text">Resume Builder</span>
          </div>
          <div className="header-right">
            {!loading && <TimerBanner accessAllowed={accessAllowed} formattedTime={formattedTime} remainingSeconds={remainingSeconds} onReset={handleResetTimer} />}
          </div>
        </div>
      </header>

      <div className="tabs-bar">
        <button className={`tab ${activeTab === 'form' ? 'tab-active' : ''}`} onClick={() => setActiveTab('form')}>
          ✏️ Edit Resume
        </button>
        <button className={`tab ${activeTab === 'preview' ? 'tab-active' : ''}`} onClick={() => setActiveTab('preview')}>
          👁 Preview & Download
        </button>
        <button className={`tab ${activeTab === 'admin' ? 'tab-active' : ''}`} onClick={() => {
          setActiveTab('admin');
          setIsAdminEdit(false);
        }}>
          🛡️ Admin Panel
        </button>
      </div>

      <main className="app-main">
        {activeTab === 'form' && (
          <div className="form-container">
            {formDisabled && (
              <div className="expired-overlay">
                <div className="expired-box">
                  <span className="expired-icon">⏰</span>
                  <h2>Submission Time Expired</h2>
                  <p>The 20-minute resume entry window has closed.</p>
                  {resumeId && <p>You can still preview and download your saved resume.</p>}
                  {resumeId && (
                    <button className="btn btn-primary" onClick={() => setActiveTab('preview')}>
                      Go to Preview & Download
                    </button>
                  )}
                  <button className="btn btn-secondary" onClick={handleResetTimer} style={{ marginTop: '10px' }}>
                    Reset Timer
                  </button>
                </div>
              </div>
            )}

            <fieldset disabled={formDisabled} className="form-fieldset">
              <PersonalInfo data={resumeData} onChange={(d) => setResumeData(d)} />
              <Education data={resumeData.education} onChange={update('education')} />
              <Experience data={resumeData.experience} onChange={update('experience')} />
              <Skills data={resumeData.skills} onChange={update('skills')} />
              <Projects data={resumeData.projects} onChange={update('projects')} />
              <Certifications data={resumeData.certifications} onChange={update('certifications')} />
              <Languages data={resumeData.languages} onChange={update('languages')} />
              <ListSection
                title="Achievements" icon="🏆"
                data={resumeData.achievements} onChange={update('achievements')}
                placeholder="Won Hackathon 2023 – Best Project Award"
              />
              <ListSection
                title="Hobbies & Interests" icon="🎯"
                data={resumeData.hobbies} onChange={update('hobbies')}
                placeholder="Photography, Chess, Open Source Contributions"
              />
            </fieldset>

            {!formDisabled && (
              <div className="save-bar">
                <button className="btn btn-save" onClick={handleSave} disabled={saving}>
                  {saving ? '⏳ Saving...' : resumeId ? '💾 Update & Preview' : '💾 Save & Preview'}
                </button>
                {password && (
                  <div className="save-password-hint">
                    🔐 Your PDF password: <code>{password}</code>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="preview-container">
            <ActionBar
              resumeId={resumeId}
              previewRef={previewRef}
              password={password}
              resumeEmail={resumeData.email}
            />
            <div className="preview-wrapper">
              <ResumePreview data={resumeData} ref={previewRef} />
            </div>
          </div>
        )}

        {activeTab === 'admin' && (
          <AdminPanel 
            onEdit={(id, data) => {
              setResumeId(id);
              setResumeData(data);
              setIsAdminEdit(true);
              setActiveTab('form');
            }} 
          />
        )}
      </main>
    </div>
  );
}

export default App;
