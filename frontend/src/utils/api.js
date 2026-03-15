import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

export const checkAccess = () => API.get('/config/access');
export const saveResume = (data) => API.post('/resume', data);
export const updateResume = (id, data) => API.put(`/resume/${id}`, data);
export const getResume = (id) => API.get(`/resume/${id}`);
export const downloadResume = (id) => API.post(`/resume/${id}/download`, {}, { responseType: 'blob' });
export const emailResume = (id, email) => API.post(`/resume/${id}/email`, { email });
export const resetTimer = () => API.post('/config/reset-timer');

// Admin Endpoints
export const getAdminResumes = () => API.get('/admin/resumes');
export const updateAdminResume = (id, data) => API.put(`/admin/resumes/${id}`, data);
export const deleteAdminResume = (id) => API.delete(`/admin/resumes/${id}`);

export default API;
