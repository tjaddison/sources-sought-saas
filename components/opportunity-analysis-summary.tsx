'use client'

import React from 'react'
import { 
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline'
import clsx from 'clsx'

interface AnalysisResult {
  success: boolean
  analysis: string
  winProbability: number
  recommendation: 'GO' | 'NO-GO' | 'REVIEW'
  analyzedAt: string
  modelUsed: string
  cached?: boolean
}

interface OpportunityAnalysisSummaryProps {
  analysisResult: AnalysisResult
}

export function OpportunityAnalysisSummary({ analysisResult }: OpportunityAnalysisSummaryProps) {
  const getRecommendationColor = (recommendation: string) => {
    if (recommendation === 'GO') return 'text-green-600'
    if (recommendation === 'NO-GO') return 'text-red-600'
    return 'text-yellow-600'
  }

  const getWinProbabilityColor = (probability: number) => {
    if (probability >= 70) return 'bg-green-500'
    if (probability >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getWinProbabilityLabel = (probability: number) => {
    if (probability >= 70) return 'High'
    if (probability >= 40) return 'Medium'
    return 'Low'
  }

  return (
    <div className="bg-white shadow rounded-lg mb-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">AI Analysis Summary</h2>
        <p className="mt-1 text-sm text-gray-600">
          Analyzed {new Date(analysisResult.analyzedAt).toLocaleDateString()} 
          {analysisResult.cached && (
            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              Cached
            </span>
          )}
        </p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Recommendation */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Recommendation</h3>
            <div className={clsx("mt-2 text-2xl font-bold flex items-center gap-2", getRecommendationColor(analysisResult.recommendation))}>
              {analysisResult.recommendation === 'GO' ? (
                <CheckCircleIcon className="h-8 w-8" />
              ) : analysisResult.recommendation === 'NO-GO' ? (
                <XCircleIcon className="h-8 w-8" />
              ) : (
                <ExclamationCircleIcon className="h-8 w-8" />
              )}
              {analysisResult.recommendation}
            </div>
          </div>

          {/* Win Probability */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Win Probability</h3>
            <div className="mt-2 space-y-2">
              <div className="text-2xl font-bold">{analysisResult.winProbability}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={clsx("h-2 rounded-full", getWinProbabilityColor(analysisResult.winProbability))}
                  style={{ width: `${analysisResult.winProbability}%` }}
                />
              </div>
              <span className={clsx(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                analysisResult.winProbability >= 70 ? "bg-green-100 text-green-800" :
                analysisResult.winProbability >= 40 ? "bg-yellow-100 text-yellow-800" :
                "bg-red-100 text-red-800"
              )}>
                {getWinProbabilityLabel(analysisResult.winProbability)}
              </span>
            </div>
          </div>

          {/* Trend Indicator */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Opportunity Trend</h3>
            <div className="mt-2 flex items-center gap-2">
              {analysisResult.winProbability >= 50 ? (
                <>
                  <ArrowTrendingUpIcon className="h-8 w-8 text-green-600" />
                  <span className="text-lg font-medium">Favorable</span>
                </>
              ) : (
                <>
                  <ArrowTrendingDownIcon className="h-8 w-8 text-red-600" />
                  <span className="text-lg font-medium">Challenging</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}