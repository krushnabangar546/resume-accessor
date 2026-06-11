import mongoose from 'mongoose';

const dimensionSchema = new mongoose.Schema({
  score: { type: Number, required: true },
  reason: { type: String, required: true }
}, { _id: false });

const jobResultSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  jobTitle: String,
  company: String,
  scores: {
    technicalSkills: dimensionSchema,
    experience: dimensionSchema,
    education: dimensionSchema,
    projectRelevance: dimensionSchema,
    certificationRelevance: dimensionSchema,
    overall: { type: Number, required: true }
  },
  strengths: [String],
  missingSkills: [String],
  improvementSuggestions: [String],
  rank: Number
}, { _id: false });

const assessmentSchema = new mongoose.Schema({
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true, unique: true },
  results: [jobResultSchema],
  bestMatch: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Assessment', assessmentSchema);
