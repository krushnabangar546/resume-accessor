import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats } from '../services/assessmentService.js';
import { getAllResumes, parseResume } from '../services/resumeService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const StatCard = ({ label, value, color = 'indigo' }) => (
  <div className="card text-center">
    <p className={`text-4xl font-black text-${color}-400`}>{value ?? '-'}</p>
    <p className="text-gray-400 text-sm mt-1">{label}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  if (status === 'parsed') return <span className="badge-green">Analyzed</span>;
  if (status === 'ai_failed') return <span className="badge-red">AI Failed</span>;
  return <span className="badge-yellow">Not Analyzed</span>;
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [parsing, setParsing] = useState({});
  const [error, setError] = useState('');

  const load = () =>
    Promise.all([getDashboardStats(), getAllResumes()])
      .then(([s, r]) => { setStats(s); setResumes(r); })
      .catch(() => setError('Failed to load dashboard'))
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleParse = async (id) => {
    setParsing(p => ({ ...p, [id]: true }));
    try {
      const updated = await parseResume(id);
      setResumes(rs => rs.map(r => r._id === id ? updated : r));
    } catch (err) {
      alert(err.response?.data?.error || 'AI parsing failed. Check the server logs.');
    } finally {
      setParsing(p => ({ ...p, [id]: false }));
    }
  };

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;
  if (error) return <p className="text-red-400 text-center py-20">{error}</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Dashboard</h1>
        <p className="text-gray-400 mt-1">AI-powered resume assessment overview</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Resumes" value={stats?.resumeCount} color="indigo" />
        <StatCard label="Job Roles" value={stats?.jobCount} color="purple" />
        <StatCard label="Assessments" value={stats?.assessmentCount} color="cyan" />
        <StatCard label="Avg Score" value={stats?.avgScore ? `${stats.avgScore}` : '–'} color="green" />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-100">Candidates</h2>
          <Link to="/upload" className="btn-primary text-sm">+ Upload Resume</Link>
        </div>

        {resumes.length === 0 ? (
          <div className="card text-center py-16">
            <p className="text-gray-500 mb-4">No resumes uploaded yet.</p>
            <Link to="/upload" className="btn-primary inline-block">Upload First Resume</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {resumes.map((resume) => (
              <div key={resume._id} className="card flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-100">
                      {resume.candidate?.name || resume.filename}
                    </p>
                    <StatusBadge status={resume.status} />
                  </div>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {resume.candidate?.email || '—'} · {new Date(resume.uploadedAt).toLocaleDateString()}
                  </p>
                  {resume.status === 'ai_failed' && resume.aiError && (
                    <p className="text-xs text-red-400 mt-1 truncate max-w-lg" title={resume.aiError}>
                      {resume.aiError.slice(0, 100)}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(resume.candidate?.skills || []).slice(0, 6).map((s, i) => (
                      <span key={i} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{s}</span>
                    ))}
                    {(resume.candidate?.skills?.length || 0) > 6 && (
                      <span className="text-xs text-gray-500">+{resume.candidate.skills.length - 6} more</span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 shrink-0 flex-wrap justify-end">
                  {resume.status !== 'parsed' && (
                    <button
                      onClick={() => handleParse(resume._id)}
                      disabled={parsing[resume._id]}
                      className="btn-secondary text-sm"
                    >
                      {parsing[resume._id] ? 'Parsing...' : 'Parse with AI'}
                    </button>
                  )}
                  <Link to={`/candidates/${resume._id}`} className="btn-secondary text-sm">Profile</Link>
                  <Link to={`/assessments/${resume._id}`} className="btn-primary text-sm">Assess</Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
