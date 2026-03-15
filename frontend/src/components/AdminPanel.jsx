import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAdminResumes, deleteAdminResume } from '../utils/api';
import { Trash2, Edit, LayoutDashboard, FileText } from 'lucide-react';
import './AdminPanel.css';

const AdminPanel = ({ onEdit }) => {
  const [resumes, setResumes] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setLoading(true);
    try {
      const res = await getAdminResumes();
      setResumes(res.data.resumes || []);
      setCount(res.data.count || 0);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load resumes: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return;
    try {
      await deleteAdminResume(id);
      toast.success('Resume deleted');
      fetchResumes();
    } catch (err) {
      toast.error('Failed to delete resume');
    }
  };

  if (loading) {
    return <div className="admin-loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <LayoutDashboard className="admin-icon" size={28} />
        <h2>Admin Dashboard</h2>
      </div>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-icon-wrapper">
            <FileText size={24} className="stat-icon" />
          </div>
          <div className="stat-details">
            <h3>Total Resumes Built</h3>
            <p className="stat-value">{count}</p>
          </div>
        </div>
      </div>

      <div className="admin-table-container">
        <h3>Resume Entries</h3>
        {resumes.length === 0 ? (
          <p className="no-data">No resumes found.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {resumes.map((r) => (
                <tr key={r._id}>
                  <td><strong>{r.fullName}</strong></td>
                  <td>{r.email}</td>
                  <td>{new Date(r.createdAt || Date.now()).toLocaleString()}</td>
                  <td className="actions-cell">
                    <button 
                      className="btn-action edit" 
                      onClick={() => onEdit(r._id, r)}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="btn-action delete" 
                      onClick={() => handleDelete(r._id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
