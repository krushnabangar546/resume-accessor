import { useState, useEffect } from 'react';
import { getAllJobs, createJob, deleteJob } from '../services/jobService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

const emptyForm = { title: '', company: '', description: '' };

export default function JobManagement() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const load = () =>
    getAllJobs()
      .then(setJobs)
      .finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.company || !form.description) {
      setError('All fields are required.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await createJob(form);
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create job');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job role?')) return;
    try {
      await deleteJob(id);
      setJobs(jobs.filter(j => j._id !== id));
    } catch {
      alert('Failed to delete job');
    }
  };

  if (loading) return <LoadingSpinner message="Loading jobs..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Job Management</h1>
          <p className="text-gray-400 mt-1">{jobs.length} job role{jobs.length !== 1 ? 's' : ''} configured</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ Add Job Role'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card space-y-4">
          <h2 className="text-lg font-semibold text-gray-100">New Job Role</h2>
          {error && (
            <div className="bg-red-950 border border-red-800 rounded-lg px-4 py-3 text-red-300 text-sm">
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Job Title</label>
              <input
                className="input"
                placeholder="e.g. Senior Backend Developer"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div>
              <label className="label">Company</label>
              <input
                className="input"
                placeholder="e.g. TechCorp Solutions"
                value={form.company}
                onChange={e => setForm({ ...form, company: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="label">Job Description</label>
            <textarea
              className="input h-48 resize-none"
              placeholder="Paste the full job description including requirements, responsibilities, and qualifications..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">AI will automatically extract structured requirements from this description.</p>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Processing with AI...' : 'Create Job Role'}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setError(''); }} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {jobs.length === 0 ? (
          <div className="card text-center py-16">
            <p className="text-gray-500 mb-4">No job roles yet. Add one to start assessing candidates.</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job._id} className="card">
              <button
                onClick={() => setExpandedId(expandedId === job._id ? null : job._id)}
                className="w-full flex items-start justify-between gap-4 text-left"
              >
                <div>
                  <p className="font-semibold text-gray-100">{job.title}</p>
                  <p className="text-sm text-gray-400">{job.company}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(job.requirements?.requiredSkills || []).slice(0, 5).map((s, i) => (
                      <span key={i} className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded">{s}</span>
                    ))}
                    {(job.requirements?.requiredSkills?.length || 0) > 5 && (
                      <span className="text-xs text-gray-500">+{job.requirements.requiredSkills.length - 5} more</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(job._id); }}
                    className="btn-danger text-sm"
                  >
                    Delete
                  </button>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${expandedId === job._id ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {expandedId === job._id && (
                <div className="mt-4 pt-4 border-t border-gray-800 space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 font-medium mb-2">Required Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {(job.requirements?.requiredSkills || []).map((s, i) => (
                          <span key={i} className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium mb-2">Preferred Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {(job.requirements?.preferredSkills || []).map((s, i) => (
                          <span key={i} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 font-medium">Experience Required</p>
                      <p className="text-gray-300 mt-1">{job.requirements?.experienceRequired || '—'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-medium">Education</p>
                      <p className="text-gray-300 mt-1">{job.requirements?.educationRequirements || '—'}</p>
                    </div>
                  </div>
                  {(job.requirements?.responsibilities || []).length > 0 && (
                    <div>
                      <p className="text-gray-400 font-medium mb-2">Responsibilities</p>
                      <ul className="space-y-1">
                        {job.requirements.responsibilities.map((r, i) => (
                          <li key={i} className="text-gray-300 flex gap-2">
                            <span className="text-gray-500">•</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
