import { useState } from 'react';
import ScoreCard from './ScoreCard.jsx';

const rankBadge = (rank) => {
  if (rank === 1) return 'bg-yellow-500 text-yellow-900';
  if (rank === 2) return 'bg-gray-400 text-gray-900';
  if (rank === 3) return 'bg-orange-700 text-orange-100';
  return 'bg-gray-700 text-gray-300';
};

export default function JobRankingCard({ result }) {
  const [expanded, setExpanded] = useState(result.rank === 1);
  const { jobTitle, company, scores, strengths, missingSkills, improvementSuggestions, rank } = result;

  return (
    <div className={`card border ${rank === 1 ? 'border-yellow-700' : 'border-gray-800'}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${rankBadge(rank)}`}>
            #{rank}
          </span>
          <div>
            <p className="font-semibold text-gray-100">{jobTitle}</p>
            <p className="text-sm text-gray-400">{company}</p>
          </div>
          {rank === 1 && (
            <span className="badge-green">Best Match</span>
          )}
          {rank === 2 && (
            <span className="badge-yellow">Alternative</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className={`text-2xl font-black ${scores?.overall >= 75 ? 'text-green-400' : scores?.overall >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
            {scores?.overall ?? 0}
          </div>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="mt-6 border-t border-gray-800 pt-6">
          <ScoreCard
            scores={scores}
            strengths={strengths}
            missingSkills={missingSkills}
            improvementSuggestions={improvementSuggestions}
          />
        </div>
      )}
    </div>
  );
}
