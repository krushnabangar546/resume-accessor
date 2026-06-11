import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  description: { type: String, required: true },
  requirements: {
    requiredSkills: [String],
    preferredSkills: [String],
    experienceRequired: { type: String, default: '' },
    educationRequirements: { type: String, default: '' },
    responsibilities: [String]
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Job', jobSchema);
