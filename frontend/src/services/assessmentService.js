import api from './api.js';

const BASE = '/api/assessments';

export const evaluate = (resumeId) =>
  api.post(`${BASE}/evaluate/${resumeId}`).then(r => r.data.data);

export const getByResumeId = (resumeId) =>
  api.get(`${BASE}/resume/${resumeId}`).then(r => r.data.data);

export const getAll = () =>
  api.get(BASE).then(r => r.data.data);

export const getDashboardStats = () =>
  api.get(`${BASE}/stats`).then(r => r.data.data);
