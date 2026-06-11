import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  duration: String,
  description: String
}, { _id: false });

const educationSchema = new mongoose.Schema({
  degree: String,
  institution: String,
  year: String
}, { _id: false });

const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  technologies: [String]
}, { _id: false });

const resumeSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  rawText: { type: String, required: true },
  candidate: {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    skills: [String],
    experience: [experienceSchema],
    education: [educationSchema],
    certifications: [String],
    projects: [projectSchema]
  },
  // raw       = PDF uploaded, AI not yet run
  // parsed    = AI successfully extracted candidate data
  // ai_failed = AI was attempted but failed; rawText is still available
  status: { type: String, enum: ['raw', 'parsed', 'ai_failed'], default: 'raw' },
  aiError: { type: String, default: '' },
  uploadedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Resume', resumeSchema);
