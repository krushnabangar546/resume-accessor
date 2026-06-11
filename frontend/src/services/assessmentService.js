import axios from 'axios';

const BASE = '/api/assessments';

export const evaluate = (resumeId) =>
  axios.post(`${BASE}/evaluate/${resumeId}`).then(r => r.data.data);

export const getByResumeId = (resumeId) =>
  axios.get(`${BASE}/resume/${resumeId}`).then(r => r.data.data);

export const getAll = () =>
  axios.get(BASE).then(r => r.data.data);

export const getDashboardStats = () =>
  axios.get(`${BASE}/stats`).then(r => r.data.data);
