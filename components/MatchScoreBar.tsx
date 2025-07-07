import React from 'react';

interface MatchScoreBarProps {
  percentage: number;
  compact?: boolean;
}

export default function MatchScoreBar({ percentage, compact = false }: MatchScoreBarProps) {
  const getColor = () => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-gray-400';
  };

  const getTextColor = () => {
    if (percentage >= 80) return 'text-green-700';
    if (percentage >= 60) return 'text-yellow-700';
    if (percentage >= 40) return 'text-orange-700';
    return 'text-gray-700';
  };

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-16 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${getColor()}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className={`text-xs font-medium ${getTextColor()}`}>
          {percentage}%
        </span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">Match Score</span>
        <span className={`text-sm font-medium ${getTextColor()}`}>
          {percentage}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-300 ${getColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-1 text-xs text-gray-500">
        {percentage >= 80 && 'Excellent match - High probability of success'}
        {percentage >= 60 && percentage < 80 && 'Good match - Worth pursuing'}
        {percentage >= 40 && percentage < 60 && 'Fair match - Review requirements carefully'}
        {percentage < 40 && 'Weak match - May not align with capabilities'}
      </div>
    </div>
  );
}