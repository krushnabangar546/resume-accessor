# Resume Assessor — AI-Powered MERN Stack Application

A production-quality Resume Assessment System that uses Claude AI to evaluate candidates against multiple job roles simultaneously, generating multi-dimensional scorecards with explainable AI output.

## Architecture

```
Resume-Accessor/
├── backend/                    # Node.js + Express API
│   ├── server.js               # Entry point, Express setup
│   └── src/
│       ├── config/database.js  # MongoDB connection
│       ├── models/             # Mongoose schemas (Resume, Job, Assessment)
│       ├── repositories/       # Data access layer
│       ├── services/           # Business logic
│       │   └── aiService.js    # Claude API integration
│       ├── controllers/        # Request handlers
│       ├── routes/             # Express routes
│       ├── prompts/            # AI prompt templates + JSON schemas
│       └── utils/              # PDF parser, response helpers, seed data
└── frontend/                   # React + Vite + Tailwind CSS
    └── src/
        ├── pages/              # 5 pages (Dashboard, Upload, Jobs, Assessment, Candidate)
        ├── components/         # Reusable UI components
        └── services/           # Axios API clients
```

## Tech Stack

| Layer     | Technology                     |
|-----------|-------------------------------|
| Frontend  | React 18, Vite, Tailwind CSS, React Router, Axios |
| Backend   | Node.js, Express.js           |
| Database  | MongoDB + Mongoose            |
| AI        | Claude API (`claude-opus-4-8`) via `@anthropic-ai/sdk` |
| PDF Parse | pdf-parse + multer            |

## AI Assessment Dimensions

Each candidate is evaluated against every job role on:

| Dimension | Weight | Description |
|-----------|--------|-------------|
| Technical Skills | 35% | Skill set match (semantic, not just keyword) |
| Experience | 30% | Relevance and seniority of work history |
| Education | 15% | Degree and field alignment |
| Project Relevance | 15% | Domain depth shown through projects |
| Certification Relevance | 5% | Value of certs for the specific role |

Plus: strengths, missing skills, and improvement suggestions per role.

## Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Anthropic API key

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env — add your ANTHROPIC_API_KEY and MONGODB_URI
node server.js
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Seed Sample Data (optional)

```bash
cd backend
npm run seed
```

Seeds 3 job roles (Senior Backend Developer, Full Stack Developer, Python Data Engineer) and 3 candidate resumes.

### Environment Variables

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resume-accessor
ANTHROPIC_API_KEY=sk-ant-...
```

## API Reference

### Resumes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resumes/upload` | Upload PDF, extract + store candidate data |
| GET | `/api/resumes` | List all resumes |
| GET | `/api/resumes/:id` | Get single resume |
| DELETE | `/api/resumes/:id` | Delete resume |

### Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/jobs` | Create job (AI extracts requirements) |
| GET | `/api/jobs` | List all jobs |
| PUT | `/api/jobs/:id` | Update job |
| DELETE | `/api/jobs/:id` | Delete job |

### Assessments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/assessments/evaluate/:resumeId` | Run AI evaluation against all jobs |
| GET | `/api/assessments/resume/:resumeId` | Get assessment for a resume |
| GET | `/api/assessments/stats` | Dashboard statistics |

## AI Integration Details

The system uses `claude-opus-4-8` with adaptive thinking for all AI operations:

1. **Resume Parsing** — Extracts name, email, phone, skills, experience, education, certifications, projects from raw PDF text
2. **Job Extraction** — Parses job descriptions into structured requirements (required/preferred skills, experience level, education)
3. **Multi-role Assessment** — Evaluates candidate against ALL jobs in parallel, returning ranked results with detailed scoring rationale

All AI responses use structured JSON output via `output_config.format` with strict JSON schemas for reliable parsing.

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/` | Stats overview + candidate list |
| Upload Resume | `/upload` | Drag & drop PDF upload with AI parsing |
| Job Management | `/jobs` | Create/view/delete job roles |
| Assessment Results | `/assessments/:id` | Job rankings + score breakdown |
| Candidate Details | `/candidates/:id` | Full candidate profile |
