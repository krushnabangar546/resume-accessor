import * as resumeRepo from '../repositories/resumeRepository.js';
import * as aiService from './aiService.js';
import { extractTextFromPDF } from '../utils/pdfParser.js';

const EMPTY_CANDIDATE = {
  name: '', email: '', phone: '',
  skills: [], experience: [], education: [],
  certifications: [], projects: []
};

export const uploadAndParse = async (file) => {
  // Step 1: Extract text — pure PDF parsing, no AI, always works
  const rawText = await extractTextFromPDF(file.buffer);
  if (!rawText || rawText.length < 50) {
    throw new Error('Could not extract meaningful text from the PDF');
  }

  // Step 2: Persist immediately so the resume is never lost
  const resume = await resumeRepo.create({
    filename: file.originalname,
    rawText,
    candidate: EMPTY_CANDIDATE,
    status: 'raw'
  });

  // Step 3: AI extraction — failure is non-fatal, resume is already saved
  try {
    const candidate = await aiService.extractResumeData(rawText);
    return resumeRepo.updateById(resume._id, { candidate, status: 'parsed', aiError: '' });
  } catch (err) {
    const aiError = err.message || 'AI extraction failed';
    console.error(`[resumeService] AI extraction failed: ${aiError}`);
    await resumeRepo.updateById(resume._id, { status: 'ai_failed', aiError });
    // Return the saved resume so the caller knows the ID and can retry
    return resumeRepo.findById(resume._id);
  }
};

export const parseExistingResume = async (id) => {
  const resume = await resumeRepo.findById(id);
  if (!resume) throw new Error('Resume not found');
  if (resume.status === 'parsed') throw new Error('Resume is already parsed');

  try {
    const candidate = await aiService.extractResumeData(resume.rawText);
    return resumeRepo.updateById(id, { candidate, status: 'parsed', aiError: '' });
  } catch (err) {
    const aiError = err.message || 'AI extraction failed';
    await resumeRepo.updateById(id, { status: 'ai_failed', aiError });
    throw err;
  }
};

export const getAllResumes = () => resumeRepo.findAll();
export const getResumeById = (id) => resumeRepo.findById(id);

export const deleteResume = async (id) => {
  const resume = await resumeRepo.findById(id);
  if (!resume) throw new Error('Resume not found');
  await resumeRepo.deleteById(id);
};
