const getColor = (score) => {
  if (score >= 75) return 'bg-green-500';
  if (score >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
};

export default function ScoreBar({ label, score, reason }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-300 font-medium">{label}</span>
        <span className={`font-bold ${score >= 75 ? 'text-green-400' : score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
          {score}/100
        </span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${getColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
      {reason && <p className="text-xs text-gray-500 leading-relaxed">{reason}</p>}
    </div>
  );
}
