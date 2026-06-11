import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getResumeById, deleteResume, parseResume } from '../services/resumeService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const Section = ({ title, children }) => (
  <div className="card space-y-3">
    <h3 className="font-semibold text-gray-300 uppercase tracking-wider text-xs">{title}</h3>
    {children}
  </div>
);

const StatusBadge = ({ status }) => {
  if (status === 'parsed') return <span className="badge-green">AI Analyzed</span>;
  if (status === 'ai_failed') return <span className="badge-red">AI Failed</span>;
  return <span className="badge-yellow">Not Analyzed</span>;
};

export default function CandidateDetails() {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getResumeById(resumeId)
      .then(setResume)
      .catch(() => setError('Resume not found'))
      .finally(() => setLoading(false));
  }, [resumeId]);

  const handleParse = async () => {
    setParsing(true);
    setParseError('');
    try {
      const updated = await parseResume(resumeId);
      setResume(updated);
    } catch (err) {
      setParseError(err.response?.data?.error || 'AI parsing failed. Check your API key / quota.');
    } finally {
      setParsing(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete resume for ${resume?.candidate?.name || resume?.filename}? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteResume(resumeId);
      navigate('/');
    } catch {
      alert('Failed to delete resume');
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading profile..." />;
  if (error) return <p className="text-red-400 text-center py-20">{error}</p>;

  const { candidate, filename, uploadedAt, status, aiError } = resume;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Link to="/" className="hover:text-gray-300">Dashboard</Link>
            <span>→</span>
            <span>Candidate Profile</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold text-gray-100">
              {candidate.name || filename}
            </h1>
            <StatusBadge status={status} />
          </div>
          <p className="text-gray-400 mt-1">
            {candidate.email}{candidate.phone && ` · ${candidate.phone}`}
            {` · Uploaded ${new Date(uploadedAt).toLocaleDateString()}`}
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          {status !== 'parsed' && (
            <button onClick={handleParse} disabled={parsing} className="btn-primary">
              {parsing ? 'Analyzing...' : status === 'ai_failed' ? 'Retry AI Analysis' : 'Run AI Analysis'}
            </button>
          )}
          {status === 'parsed' && (
            <Link to={`/assessments/${resumeId}`} className="btn-primary">View Assessment</Link>
          )}
          <button onClick={handleDelete} disabled={deleting} className="btn-danger">
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {/* AI status messages */}
      {status !== 'parsed' && (
        <div className={`rounded-lg px-4 py-3 text-sm border ${status === 'ai_failed' ? 'bg-red-950 border-red-800 text-red-300' : 'bg-yellow-950 border-yellow-800 text-yellow-300'}`}>
          {status === 'raw' && 'This resume has not been analyzed by AI yet. Click "Run AI Analysis" to extract candidate data.'}
          {status === 'ai_failed' && (
            <div>
              <p className="font-medium mb-1">AI analysis failed:</p>
              <p className="text-xs opacity-80">{aiError}</p>
            </div>
          )}
        </div>
      )}

      {parseError && (
        <div className="bg-red-950 border border-red-800 rounded-lg px-4 py-3 text-red-300 text-sm">{parseError}</div>
      )}

      <Section title="Skills">
        {candidate.skills?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {candidate.skills.map((s, i) => (
              <span key={i} className="bg-indigo-950 text-indigo-300 border border-indigo-800 text-sm px-3 py-1 rounded-full">{s}</span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No skills extracted yet</p>
        )}
      </Section>

      <Section title="Work Experience">
        {candidate.experience?.length > 0 ? (
          <div className="space-y-4">
            {candidate.experience.map((exp, i) => (
              <div key={i} className="border-l-2 border-indigo-800 pl-4">
                <p className="font-semibold text-gray-100">{exp.title}</p>
                <p className="text-indigo-400 text-sm">{exp.company} · {exp.duration}</p>
                <p className="text-gray-400 text-sm mt-1 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No experience entries</p>
        )}
      </Section>

      <Section title="Education">
        {candidate.education?.length > 0 ? (
          <div className="space-y-2">
            {candidate.education.map((edu, i) => (
              <div key={i} className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-100">{edu.degree}</p>
                  <p className="text-sm text-gray-400">{edu.institution}</p>
                </div>
                <span className="text-sm text-gray-500">{edu.year}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No education entries</p>
        )}
      </Section>

      {candidate.certifications?.length > 0 && (
        <Section title="Certifications">
          <div className="space-y-1">
            {candidate.certifications.map((cert, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="text-yellow-500">★</span>
                <span className="text-gray-300">{cert}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {candidate.projects?.length > 0 && (
        <Section title="Projects">
          <div className="space-y-4">
            {candidate.projects.map((proj, i) => (
              <div key={i}>
                <p className="font-medium text-gray-100">{proj.name}</p>
                <p className="text-sm text-gray-400 mt-1 leading-relaxed">{proj.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {(proj.technologies || []).map((t, j) => (
                    <span key={j} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      <Section title="Raw Resume Text">
        <pre className="text-xs text-gray-500 whitespace-pre-wrap font-mono leading-relaxed max-h-64 overflow-y-auto">
          {resume.rawText}
        </pre>
      </Section>
    </div>
  );
}
