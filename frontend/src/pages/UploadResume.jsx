import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadResume, parseResume } from '../services/resumeService.js';

export default function UploadResume() {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [retrying, setRetrying] = useState(false);
  const inputRef = useRef();
  const navigate = useNavigate();

  const handleFile = (f) => {
    if (!f) return;
    if (f.type !== 'application/pdf') { setError('Only PDF files are accepted.'); return; }
    if (f.size > 10 * 1024 * 1024) { setError('File size must be under 10MB.'); return; }
    setError('');
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);
    setError('');
    try {
      const resume = await uploadResume(file, (evt) => {
        setProgress(Math.round((evt.loaded / evt.total) * 100));
      });
      setResult(resume);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Check the server logs.');
    } finally {
      setUploading(false);
    }
  };

  const handleRetryAI = async () => {
    setRetrying(true);
    setError('');
    try {
      const updated = await parseResume(result._id);
      setResult(updated);
    } catch (err) {
      setError(err.response?.data?.error || 'AI parsing failed. Check your API key / quota.');
    } finally {
      setRetrying(false);
    }
  };

  if (result) {
    const aiOk = result.status === 'parsed';

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className={`card border ${aiOk ? 'border-green-700' : 'border-yellow-700'}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${aiOk ? 'bg-green-900 text-green-400' : 'bg-yellow-900 text-yellow-400'}`}>
              {aiOk ? '✓' : '⚠'}
            </div>
            <div>
              <p className="font-semibold text-gray-100">
                {aiOk ? 'Resume uploaded and analyzed' : 'Resume uploaded — AI analysis pending'}
              </p>
              <p className="text-sm text-gray-400">{result.filename}</p>
            </div>
          </div>

          {aiOk ? (
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-400">Name:</span> <span className="text-gray-100 ml-2">{result.candidate?.name || '—'}</span></p>
              <p><span className="text-gray-400">Email:</span> <span className="text-gray-100 ml-2">{result.candidate?.email || '—'}</span></p>
              <p><span className="text-gray-400">Skills extracted:</span> <span className="text-gray-100 ml-2">{result.candidate?.skills?.length || 0}</span></p>
              <p><span className="text-gray-400">Experience entries:</span> <span className="text-gray-100 ml-2">{result.candidate?.experience?.length || 0}</span></p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-yellow-300">
                The PDF text was saved successfully. AI analysis failed — you can retry below or from the Dashboard.
              </p>
              {result.aiError && (
                <p className="text-xs text-red-400 bg-red-950 rounded px-3 py-2">{result.aiError}</p>
              )}
            </div>
          )}

          {error && (
            <div className="mt-3 bg-red-950 border border-red-800 rounded-lg px-4 py-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 mt-6 flex-wrap">
            {!aiOk && (
              <button onClick={handleRetryAI} disabled={retrying} className="btn-primary">
                {retrying ? 'Retrying AI...' : 'Retry AI Analysis'}
              </button>
            )}
            {aiOk && (
              <button onClick={() => navigate(`/assessments/${result._id}`)} className="btn-primary">
                Run Assessment
              </button>
            )}
            <button onClick={() => navigate(`/candidates/${result._id}`)} className="btn-secondary">
              View Profile
            </button>
            <button onClick={() => { setFile(null); setResult(null); setError(''); }} className="btn-secondary">
              Upload Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Upload Resume</h1>
        <p className="text-gray-400 mt-1">
          Upload a PDF resume. Text extraction is instant; AI analysis runs after.
        </p>
      </div>

      <div
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
          dragging ? 'border-indigo-400 bg-indigo-950' : 'border-gray-700 hover:border-gray-600'
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <input ref={inputRef} type="file" accept="application/pdf" className="hidden"
          onChange={(e) => handleFile(e.target.files[0])} />
        <div className="text-4xl mb-4">📄</div>
        {file ? (
          <div>
            <p className="font-semibold text-indigo-400">{file.name}</p>
            <p className="text-sm text-gray-500 mt-1">{(file.size / 1024).toFixed(1)} KB · Click to change</p>
          </div>
        ) : (
          <div>
            <p className="text-gray-300 font-medium">Drop a PDF here or click to browse</p>
            <p className="text-sm text-gray-500 mt-1">Max 10MB · PDF only</p>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-950 border border-red-800 rounded-lg px-4 py-3 text-red-300 text-sm">{error}</div>
      )}

      {uploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>{progress < 100 ? 'Uploading...' : 'Running AI analysis...'}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-gray-500">
            PDF text is saved instantly. AI analysis may take 15–60 seconds depending on the provider.
          </p>
        </div>
      )}

      <button onClick={handleUpload} disabled={!file || uploading} className="btn-primary w-full py-3 text-base">
        {uploading ? 'Processing...' : 'Upload Resume'}
      </button>
    </div>
  );
}
