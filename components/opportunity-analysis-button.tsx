'use client'

import React from 'react'
import { ChartBarIcon, ArrowPathIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'

interface OpportunityAnalysisButtonProps {
  isAnalyzing: boolean
  hasAnalysis: boolean
  onAnalyze: () => void
  className?: string
}

export function OpportunityAnalysisButton({ 
  isAnalyzing, 
  hasAnalysis, 
  onAnalyze,
  className = "w-full text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
}: OpportunityAnalysisButtonProps) {
  return (
    <button
      onClick={onAnalyze}
      disabled={isAnalyzing}
      className={clsx(
        className,
        isAnalyzing && "opacity-50 cursor-not-allowed"
      )}
    >
      {isAnalyzing ? (
        <>
          <ArrowPathIcon className="animate-spin inline-block h-4 w-4 mr-2" />
          Analyzing...
        </>
      ) : (
        <>
          <ChartBarIcon className="inline-block h-4 w-4 mr-2" />
          {hasAnalysis ? 'Re-analyze Opportunity' : 'Analyze Opportunity Fit'}
        </>
      )}
    </button>
  )
}