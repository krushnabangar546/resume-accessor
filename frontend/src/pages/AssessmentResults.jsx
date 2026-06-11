import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { evaluate, getByResumeId } from '../services/assessmentService.js';
import { getResumeById } from '../services/resumeService.js';
import JobRankingCard from '../components/JobRankingCard.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function AssessmentResults() {
  const { resumeId } = useParams();
  const [resume, setResume] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getResumeById(resumeId), getByResumeId(resumeId).catch(() => null)])
      .then(([r, a]) => { setResume(r); setAssessment(a); })
      .catch(() => setError('Failed to load data'))
      .finally(() => setLoading(false));
  }, [resumeId]);

  const runAssessment = async () => {
    setRunning(true);
    setError('');
    try {
      const result = await evaluate(resumeId);
      setAssessment(result);
    } catch (err) {
      setError(err.response?.data?.error || 'Assessment failed. Ensure jobs exist and try again.');
    } finally {
      setRunning(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading assessment..." />;
  if (error && !resume) return <p className="text-red-400 text-center py-20">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link to="/" className="hover:text-gray-300">Dashboard</Link>
            <span>→</span>
            <span>Assessment</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-100">
            {resume?.candidate?.name || 'Candidate'}
          </h1>
          <p className="text-gray-400 mt-1">
            {resume?.candidate?.email} · {resume?.filename}
          </p>
        </div>
        <div className="flex gap-3">
          <Link to={`/candidates/${resumeId}`} className="btn-secondary">
            View Profile
          </Link>
          <button onClick={runAssessment} disabled={running} className="btn-primary">
            {running ? 'Assessing...' : assessment ? 'Re-assess' : 'Run Assessment'}
          </button>
        </div>
      </div>

      {running && (
        <div className="card border-indigo-700">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 border-4 border-gray-700 border-t-indigo-500 rounded-full animate-spin shrink-0" />
            <div>
              <p className="font-medium text-gray-100">AI Assessment in Progress</p>
              <p className="text-sm text-gray-400">
                Evaluating against all job roles simultaneously using Claude AI. This takes 30–90 seconds.
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-950 border border-red-800 rounded-lg px-4 py-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      {!assessment && !running && (
        <div className="card text-center py-16">
          <p className="text-gray-400 mb-2 text-lg font-medium">No assessment yet</p>
          <p className="text-gray-500 text-sm mb-6">
            Run an AI assessment to evaluate this candidate against all available job roles.
          </p>
          <button onClick={runAssessment} className="btn-primary">
            Run Assessment
          </button>
        </div>
      )}

      {assessment && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-100">
              Job Rankings — {assessment.results?.length} roles evaluated
            </h2>
            <p className="text-sm text-gray-500">
              Last assessed: {new Date(assessment.updatedAt || assessment.createdAt).toLocaleString()}
            </p>
          </div>

          {(assessment.results || []).map((result, i) => (
            <JobRankingCard key={i} result={result} />
          ))}
        </div>
      )}
    </div>
  );
}
