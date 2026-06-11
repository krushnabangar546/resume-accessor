import Assessment from '../models/Assessment.js';

export const upsertByResumeId = (resumeId, data) =>
  Assessment.findOneAndUpdate(
    { resumeId },
    { ...data, updatedAt: new Date() },
    { upsert: true, new: true }
  );

export const findByResumeId = (resumeId) =>
  Assessment.findOne({ resumeId }).populate('results.jobId');

export const findAll = () =>
  Assessment.find().sort({ updatedAt: -1 }).populate('resumeId', 'candidate.name candidate.email');

export const findById = (id) => Assessment.findById(id);
export const count = () => Assessment.countDocuments();

export const getAverageScore = async () => {
  const result = await Assessment.aggregate([
    { $unwind: '$results' },
    { $group: { _id: null, avgScore: { $avg: '$results.scores.overall' } } }
  ]);
  return result[0]?.avgScore || 0;
};
