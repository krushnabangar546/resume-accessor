import * as assessmentService from '../services/assessmentService.js';
import { success, failure } from '../utils/responseHelper.js';

export const evaluate = async (req, res) => {
  try {
    const assessment = await assessmentService.evaluateResume(req.params.resumeId);
    success(res, assessment, 201);
  } catch (err) {
    const status = err.message.includes('not found') ? 404 : 500;
    failure(res, err, status);
  }
};

export const getByResumeId = async (req, res) => {
  try {
    const assessment = await assessmentService.getAssessmentByResumeId(req.params.resumeId);
    if (!assessment) return failure(res, 'Assessment not found', 404);
    success(res, assessment);
  } catch (err) {
    failure(res, err);
  }
};

export const getAll = async (req, res) => {
  try {
    const assessments = await assessmentService.getAllAssessments();
    success(res, assessments);
  } catch (err) {
    failure(res, err);
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const stats = await assessmentService.getDashboardStats();
    success(res, stats);
  } catch (err) {
    failure(res, err);
  }
};
