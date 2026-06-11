import api from './api.js';

const BASE = '/api/resumes';

export const uploadResume = (file, onProgress) => {
  const form = new FormData();
  form.append('resume', file);
  return api.post(`${BASE}/upload`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress
  }).then(r => r.data.data);
};

export const parseResume = (id) =>
  api.post(`${BASE}/${id}/parse`).then(r => r.data.data);

export const getAllResumes = () =>
  api.get(BASE).then(r => r.data.data);

export const getResumeById = (id) =>
  api.get(`${BASE}/${id}`).then(r => r.data.data);

export const deleteResume = (id) =>
  api.delete(`${BASE}/${id}`).then(r => r.data.data);
