import React, { useState } from "react";
import { useReactToPrint } from "react-to-print";
import { downloadResume, emailResume } from "../utils/api";
import toast from "react-hot-toast";

export default function ActionBar({
  resumeId,
  previewRef,
  password,
  resumeEmail,
}) {
  const [emailInput, setEmailInput] = useState(resumeEmail || "");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [shownPassword, setShownPassword] = useState(password || null);

  const handlePrint = useReactToPrint({
    contentRef: previewRef,
    documentTitle: "Resume",
  });

  const handleDownload = async () => {
    if (!resumeId) return toast.error("Please save your resume first.");
    setDownloading(true);
    try {
      const res = await downloadResume(resumeId);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Resume.pdf";
      a.click();
      URL.revokeObjectURL(url);

      const pw = res.headers["x-resume-password"] || password;
      setShownPassword(pw);
      toast.success("PDF downloaded!");
    } catch (err) {
      toast.error("Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleEmail = async () => {
    if (!resumeId) return toast.error("Please save your resume first.");
    if (!emailInput) return toast.error("Please enter an email address.");
    setEmailLoading(true);
    try {
      const { data } = await emailResume(resumeId, emailInput);
      setShownPassword(data.password);
      setShowEmailModal(false);
      toast.success(`Resume sent to ${emailInput}`);
    } catch (err) {
      toast.error("Failed to send email. Check your backend email config.");
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <div className="action-bar">
      <div className="action-buttons">
        <button
          className="btn btn-primary"
          onClick={handleDownload}
          disabled={downloading || !resumeId}
        >
          {downloading ? "⏳ Generating..." : "⬇ Download PDF"}
        </button>
        <button
          className="btn btn-secondary"
          onClick={handlePrint}
          disabled={!resumeId}
        >
          🖨 Print
        </button>
        <button
          className="btn btn-outline"
          onClick={() => setShowEmailModal(true)}
          disabled={!resumeId}
        >
          ✉ Email Resume
        </button>
      </div>

      {shownPassword && (
        <div className="password-display">
          <span className="password-label">🔐 PDF Password:</span>
          <code className="password-value">{shownPassword}</code>
          <span className="password-hint">
            Use this to open your downloaded PDF
          </span>
        </div>
      )}

      {showEmailModal && (
        <div className="modal-overlay" onClick={() => setShowEmailModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>📧 Send Resume via Email</h3>
            <p>The PDF and its password will be sent to this email.</p>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="recipient@email.com"
              autoFocus
            />
            <div className="modal-actions">
              <button
                className="btn btn-primary"
                onClick={handleEmail}
                disabled={emailLoading}
              >
                {emailLoading ? "Sending..." : "Send Email"}
              </button>
              <button
                className="btn btn-outline"
                onClick={() => setShowEmailModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
