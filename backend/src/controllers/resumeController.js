import * as resumeService from '../services/resumeService.js';
import { AIServiceError } from '../services/providers/base.js';
import { success, failure } from '../utils/responseHelper.js';

export const upload = async (req, res) => {
  try {
    if (!req.file) return failure(res, 'No file uploaded', 400);
    const resume = await resumeService.uploadAndParse(req.file);
    // Always 201 — resume was saved even if AI failed
    success(res, resume, 201);
  } catch (err) {
    failure(res, err);
  }
};

export const parseResume = async (req, res) => {
  try {
    const resume = await resumeService.parseExistingResume(req.params.id);
    success(res, resume);
  } catch (err) {
    if (err instanceof AIServiceError) {
      const status = err.code === 'NOT_CONFIGURED' || err.code === 'INVALID_KEY' ? 503 : 500;
      return failure(res, `AI error (${err.code}): ${err.message}`, status);
    }
    const status = err.message === 'Resume not found' ? 404 :
                   err.message === 'Resume is already parsed' ? 400 : 500;
    failure(res, err, status);
  }
};

export const getAll = async (req, res) => {
  try {
    success(res, await resumeService.getAllResumes());
  } catch (err) {
    failure(res, err);
  }
};

export const getOne = async (req, res) => {
  try {
    const resume = await resumeService.getResumeById(req.params.id);
    if (!resume) return failure(res, 'Resume not found', 404);
    success(res, resume);
  } catch (err) {
    failure(res, err);
  }
};

export const remove = async (req, res) => {
  try {
    await resumeService.deleteResume(req.params.id);
    success(res, { message: 'Resume deleted' });
  } catch (err) {
    failure(res, err, err.message === 'Resume not found' ? 404 : 500);
  }
};
