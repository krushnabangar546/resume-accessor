You are a Senior Full Stack Engineer, AI Engineer, Solution Architect, and Product Designer.

Build a production-quality Resume Assessment System using the MERN stack.

# Business Problem

Hiring teams spend significant time manually screening resumes. Candidates are typically evaluated only for the role they applied to, even when they may be a stronger fit for other open roles.

The system must parse resumes, analyze job descriptions, and match candidates against multiple job roles simultaneously.

The solution must generate explainable, multi-dimensional scorecards and must go beyond simple keyword matching.

# Functional Requirements

## Resume Management

* Upload PDF resumes.
* Extract text from resumes.
* Store resumes in MongoDB.
* Extract structured candidate information:

  * Name
  * Email
  * Phone
  * Skills
  * Experience
  * Education
  * Certifications
  * Projects

## Job Management

* Create and manage multiple job descriptions.
* Store job descriptions in MongoDB.
* Extract structured job requirements:

  * Required Skills
  * Preferred Skills
  * Experience Required
  * Education Requirements
  * Responsibilities

## AI-Based Candidate Assessment

Evaluate candidates against every available job role.

Generate scores for:

* Technical Skills Match
* Experience Match
* Education Match
* Project Relevance
* Certification Relevance
* Overall Match Score

Generate a detailed explanation for every score.

Example:

Technical Skills Score: 85

Reason:
Candidate possesses Java, Spring Boot, REST API, and Microservices experience, satisfying most required technical skills.

## Multi-Role Recommendations

The system must recommend:

* Best Match Role
* Alternative Suitable Roles
* Ranking of all roles

Example:

1. Java Backend Developer – 92%
2. Full Stack Developer – 87%
3. Flutter Developer – 81%

## Explainable AI

For every assessment provide:

* Strengths
* Missing Skills
* Improvement Suggestions
* Reasoning Behind Scores

The system must never return only percentages.

# Technical Requirements

Frontend:

* React
* Vite
* Tailwind CSS
* Axios
* React Router

Backend:

* Node.js
* Express.js

Database:

* MongoDB

AI Layer:

* OpenAI-compatible architecture
* AI prompts stored separately
* Service layer abstraction for future model replacement

Resume Parsing:

* PDF parsing support

# Architecture Requirements

Use a clean folder structure.

Backend layers:

* Routes
* Controllers
* Services
* Repositories
* Models
* Utilities

Frontend layers:

* Pages
* Components
* Services
* Hooks
* Context

# UI Requirements

Pages:

1. Dashboard
2. Upload Resume
3. Job Management
4. Candidate Assessment Results
5. Candidate Details

Dashboard should show:

* Total Resumes
* Total Jobs
* Total Assessments
* Best Candidate Matches

Assessment page should display:

* Candidate Details
* Job Ranking
* Scorecards
* AI Explanations
* Missing Skills
* Improvement Suggestions

# Deliverables

Provide:

1. Complete architecture design.
2. Database schema.
3. API design.
4. Folder structure.
5. Step-by-step implementation plan.
6. Backend implementation.
7. Frontend implementation.
8. Sample resumes.
9. Sample job descriptions.
10. README documentation.
11. Environment setup instructions.
12. Interview explanation guide.

Start by designing the complete architecture before generating code.

====================================================================================

I'm getting this error when uploading and parsing a resume:

Could not resolve authentication method. Expected either apiKey or authToken to be set

Can you check where this error is coming from and trace the complete resume parsing flow? Please identify which service or SDK is throwing the error, verify whether the API key is being loaded correctly from the environment variables, and fix the issue. Also add proper error handling and logging so it's easier to debug similar problems in the future. Explain the root cause and show the changes made.

===>>> Problem 1 — ES Module timing bug (the actual error): With ES modules, ALL static     import statements are resolved and their module-level code runs before any top-level code in server.js executes. So dotenv.config() on line 9 of server.js runs after aiService.js is already loaded
  — meaning const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY }) fires with ANTHROPIC_API_KEY = undefined. The SDK throws the auth error.

  Problem 2 — Wrong API key: AIzaSy... is a Google/Gemini API key. Anthropic keys start with
  sk-ant-. They're completely different APIs. 
<<<===

[GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent: [429 Too Many Requests] You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage,

caught an limit exceed error, can you Please create a standalone Gemini test
  script using the exact API key currently loaded by the backend. Print the model response and
  any detailed error information. I want to confirm whether the problem is with Gemini project
  quota or with the application's configuration. because the gemini key i am using is fresh
  gemini api key in google ai studio

==================================================

  Right now our application is directly using Gemini APIs, and we're running into quota issues. Can you refactor the AI integration so it's not tied to a specific provider?

I want the app to support different LLM providers like Gemini, OpenAI, Anthropic, or OpenRouter. The provider should be selected through environment variables, so if I change the API key and provider in .env, the application should work without code changes.

Also, resume PDF extraction should not depend on any AI provider. We should always be able to upload and parse a resume even if the AI service is unavailable. The AI should only be used after the resume text is extracted.

Please review the current implementation, identify all Gemini-specific code, refactor it into a common AI service layer, and add proper handling for invalid keys, quota exceeded errors, rate limits, and provider failures.

If the AI analysis fails, the application should still save the extracted resume text and allow the user to retry the analysis later.

Please make the changes and explain the architecture so it's easy to add new providers in the future.

===========================