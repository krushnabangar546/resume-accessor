import axios from 'axios';

const BASE = '/api/jobs';

export const createJob = (data) =>
  axios.post(BASE, data).then(r => r.data.data);

export const getAllJobs = () =>
  axios.get(BASE).then(r => r.data.data);

export const getJobById = (id) =>
  axios.get(`${BASE}/${id}`).then(r => r.data.data);

export const updateJob = (id, data) =>
  axios.put(`${BASE}/${id}`, data).then(r => r.data.data);

export const deleteJob = (id) =>
  axios.delete(`${BASE}/${id}`).then(r => r.data.data);
