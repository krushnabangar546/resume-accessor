import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './src/config/database.js';
import resumeRoutes from './src/routes/resumeRoutes.js';
import jobRoutes from './src/routes/jobRoutes.js';
import assessmentRoutes from './src/routes/assessmentRoutes.js';

dotenv.config();

const aiProvider = process.env.AI_PROVIDER || 'gemini';
const aiModel = process.env.AI_MODEL || { gemini: 'gemini-2.0-flash', openai: 'gpt-4o-mini', openrouter: 'meta-llama/llama-3.1-8b-instruct:free', anthropic: 'claude-opus-4-8' }[aiProvider] || 'unknown';
console.log(`[startup] AI provider: ${aiProvider}, model: ${aiModel}`);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/resumes', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/assessments', assessmentRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
