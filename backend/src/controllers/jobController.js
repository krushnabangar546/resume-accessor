import * as jobService from '../services/jobService.js';
import { success, failure } from '../utils/responseHelper.js';

export const create = async (req, res) => {
  try {
    const { title, company, description } = req.body;
    if (!title || !company || !description) {
      return failure(res, 'title, company, and description are required', 400);
    }
    const job = await jobService.createJob({ title, company, description });
    success(res, job, 201);
  } catch (err) {
    failure(res, err);
  }
};

export const getAll = async (req, res) => {
  try {
    const jobs = await jobService.getAllJobs();
    success(res, jobs);
  } catch (err) {
    failure(res, err);
  }
};

export const getOne = async (req, res) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    if (!job) return failure(res, 'Job not found', 404);
    success(res, job);
  } catch (err) {
    failure(res, err);
  }
};

export const update = async (req, res) => {
  try {
    const job = await jobService.updateJob(req.params.id, req.body);
    if (!job) return failure(res, 'Job not found', 404);
    success(res, job);
  } catch (err) {
    failure(res, err);
  }
};

export const remove = async (req, res) => {
  try {
    await jobService.deleteJob(req.params.id);
    success(res, { message: 'Job deleted' });
  } catch (err) {
    const notFound = err.message === 'Job not found';
    failure(res, err, notFound ? 404 : 500);
  }
};
