import axios from 'axios';

const BASE = '/api/resumes';

export const uploadResume = (file, onProgress) => {
  const form = new FormData();
  form.append('resume', file);
  return axios.post(`${BASE}/upload`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress
  }).then(r => r.data.data);
};

export const parseResume = (id) =>
  axios.post(`${BASE}/${id}/parse`).then(r => r.data.data);

export const getAllResumes = () =>
  axios.get(BASE).then(r => r.data.data);

export const getResumeById = (id) =>
  axios.get(`${BASE}/${id}`).then(r => r.data.data);

export const deleteResume = (id) =>
  axios.delete(`${BASE}/${id}`).then(r => r.data.data);
