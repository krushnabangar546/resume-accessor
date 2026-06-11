import * as resumeRepo from '../repositories/resumeRepository.js';
import * as jobRepo from '../repositories/jobRepository.js';
import * as assessmentRepo from '../repositories/assessmentRepository.js';
import * as aiService from './aiService.js';

export const evaluateResume = async (resumeId) => {
  const resume = await resumeRepo.findById(resumeId);
  if (!resume) throw new Error('Resume not found');

  if (resume.status !== 'parsed') {
    throw new Error(
      'Resume has not been AI-parsed yet. Use the "Parse Resume" button on the candidate profile first.'
    );
  }

  const jobs = await jobRepo.findAll();
  if (jobs.length === 0) throw new Error('No jobs available to evaluate against');

  const assessments = await Promise.all(
    jobs.map(async (job) => {
      const result = await aiService.assessCandidateForJob(resume.candidate, job);
      return {
        jobId: job._id,
        jobTitle: job.title,
        company: job.company,
        scores: {
          technicalSkills: result.technicalSkills,
          experience: result.experience,
          education: result.education,
          projectRelevance: result.projectRelevance,
          certificationRelevance: result.certificationRelevance,
          overall: result.overallScore
        },
        strengths: result.strengths,
        missingSkills: result.missingSkills,
        improvementSuggestions: result.improvementSuggestions
      };
    })
  );

  const ranked = assessments
    .sort((a, b) => b.scores.overall - a.scores.overall)
    .map((a, idx) => ({ ...a, rank: idx + 1 }));

  const bestMatch = ranked[0]?.jobId;

  return assessmentRepo.upsertByResumeId(resumeId, {
    resumeId,
    results: ranked,
    bestMatch,
    createdAt: new Date()
  });
};

export const getAssessmentByResumeId = (resumeId) =>
  assessmentRepo.findByResumeId(resumeId);

export const getAllAssessments = () => assessmentRepo.findAll();

export const getDashboardStats = async () => {
  const [resumeCount, jobCount, assessmentCount, avgScore] = await Promise.all([
    resumeRepo.count(),
    jobRepo.count(),
    assessmentRepo.count(),
    assessmentRepo.getAverageScore()
  ]);

  const recentAssessments = await assessmentRepo.findAll();

  return {
    resumeCount,
    jobCount,
    assessmentCount,
    avgScore: Math.round(avgScore),
    recentAssessments: recentAssessments.slice(0, 5)
  };
};
