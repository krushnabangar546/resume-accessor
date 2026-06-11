import api from './api.js';

const BASE = '/api/jobs';

export const createJob = (data) =>
  api.post(BASE, data).then(r => r.data.data);

export const getAllJobs = () =>
  api.get(BASE).then(r => r.data.data);

export const getJobById = (id) =>
  api.get(`${BASE}/${id}`).then(r => r.data.data);

export const updateJob = (id, data) =>
  api.put(`${BASE}/${id}`, data).then(r => r.data.data);

export const deleteJob = (id) =>
  api.delete(`${BASE}/${id}`).then(r => r.data.data);
