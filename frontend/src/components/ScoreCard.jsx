import ScoreBar from './ScoreBar.jsx';

const scoreLabels = {
  technicalSkills: 'Technical Skills',
  experience: 'Experience',
  education: 'Education',
  projectRelevance: 'Project Relevance',
  certificationRelevance: 'Certifications'
};

const getOverallColor = (score) => {
  if (score >= 75) return 'text-green-400 border-green-600';
  if (score >= 50) return 'text-yellow-400 border-yellow-600';
  return 'text-red-400 border-red-600';
};

export default function ScoreCard({ scores, strengths = [], missingSkills = [], improvementSuggestions = [] }) {
  const overall = scores?.overall ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <div className={`text-5xl font-black border-4 rounded-2xl w-24 h-24 flex items-center justify-center ${getOverallColor(overall)}`}>
          {overall}
        </div>
        <div>
          <p className="text-gray-400 text-sm uppercase tracking-wider font-medium">Overall Score</p>
          <p className="text-lg font-semibold text-gray-100 mt-1">
            {overall >= 75 ? 'Strong Match' : overall >= 50 ? 'Moderate Match' : 'Weak Match'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(scoreLabels).map(([key, label]) => (
          <ScoreBar
            key={key}
            label={label}
            score={scores?.[key]?.score ?? 0}
            reason={scores?.[key]?.reason}
          />
        ))}
      </div>

      {strengths.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-green-400 uppercase tracking-wider mb-2">Strengths</h4>
          <ul className="space-y-1">
            {strengths.map((s, i) => (
              <li key={i} className="text-sm text-gray-300 flex gap-2">
                <span className="text-green-500 mt-0.5">+</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {missingSkills.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-2">Missing Skills</h4>
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill, i) => (
              <span key={i} className="badge-red">{skill}</span>
            ))}
          </div>
        </div>
      )}

      {improvementSuggestions.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-2">Improvement Suggestions</h4>
          <ul className="space-y-1">
            {improvementSuggestions.map((s, i) => (
              <li key={i} className="text-sm text-gray-300 flex gap-2">
                <span className="text-indigo-500 mt-0.5">→</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
