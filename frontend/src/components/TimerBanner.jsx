import React from 'react';

export default function TimerBanner({ accessAllowed, formattedTime, remainingSeconds, onReset }) {
  if (accessAllowed === null) return null; // loading

  if (!accessAllowed) {
    return (
      <div className="timer-banner timer-expired">
        <span className="timer-icon">⏰</span>
        <span><strong>Resume submission time has expired.</strong> You can still view and download your resume if already saved.</span>
        {onReset && (
          <button className="btn btn-secondary" onClick={onReset} style={{ marginLeft: '10px', padding: '4px 10px', fontSize: '12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Reset Timer
          </button>
        )}
      </div>
    );
  }

  const isUrgent = remainingSeconds < 120;

  return (
    <div className={`timer-banner ${isUrgent ? 'timer-urgent' : 'timer-active'}`}>
      <span className="timer-icon">⏱</span>
      <span>
        {isUrgent ? '⚠️ Hurry! ' : ''}
        Time remaining to submit your resume:
        <strong className="timer-countdown"> {formattedTime}</strong>
      </span>
    </div>
  );
}
