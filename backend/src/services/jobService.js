import * as jobRepo from '../repositories/jobRepository.js';
import * as aiService from './aiService.js';

export const createJob = async ({ title, company, description }) => {
  const requirements = await aiService.extractJobRequirements(description);
  return jobRepo.create({ title, company, description, requirements });
};

export const getAllJobs = () => jobRepo.findAll();
export const getJobById = (id) => jobRepo.findById(id);

export const updateJob = async (id, updates) => {
  const job = await jobRepo.findById(id);
  if (!job) throw new Error('Job not found');

  if (updates.description && updates.description !== job.description) {
    updates.requirements = await aiService.extractJobRequirements(updates.description);
  }
  return jobRepo.update(id, updates);
};

export const deleteJob = async (id) => {
  const job = await jobRepo.findById(id);
  if (!job) throw new Error('Job not found');
  await jobRepo.deleteById(id);
};
