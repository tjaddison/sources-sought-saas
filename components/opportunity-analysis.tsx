'use client'

import React, { useState, useEffect } from 'react'
import { 
  ExclamationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  SparklesIcon,
  ArrowPathIcon,
  LightBulbIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import { ChartBarIcon } from '@heroicons/react/24/solid'
import clsx from 'clsx'

interface OpportunityAnalysisProps {
  opportunity: any
  onAnalysisComplete?: () => void
  externalAnalysisResult?: AnalysisResult | null
  externalIsAnalyzing?: boolean
  externalError?: string | null
  onAnalyze?: (skipCache?: boolean) => Promise<void>
}

interface AnalysisResult {
  success: boolean
  analysis: string
  winProbability: number
  recommendation: 'GO' | 'NO-GO' | 'REVIEW'
  analyzedAt: string
  modelUsed: string
  cached?: boolean
}

export function OpportunityAnalysis({ 
  opportunity, 
  onAnalysisComplete,
  externalAnalysisResult,
  externalIsAnalyzing,
  externalError,
  onAnalyze
}: OpportunityAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('summary')
  const [isLoadingCached, setIsLoadingCached] = useState(true)

  // Use external state if provided
  const actualIsAnalyzing = externalIsAnalyzing !== undefined ? externalIsAnalyzing : isAnalyzing
  const actualAnalysisResult = externalAnalysisResult !== undefined ? externalAnalysisResult : analysisResult
  const actualError = externalError !== undefined ? externalError : error

  // Helper function to create a clean copy of opportunity data
  const getCleanOpportunity = () => {
    try {
      // Extract only the fields we need, explicitly excluding _additional and any other non-serializable fields
      const { 
        _additional, 
        ...restOpportunity 
      } = opportunity || {}
      
      // Create a plain object with only the fields we need
      const cleanObj = {
        title: restOpportunity.title || '',
        notice_id: restOpportunity.notice_id || '',
        agency_name: restOpportunity.agency_name || '',
        agency_city: restOpportunity.agency_city || '',
        agency_state: restOpportunity.agency_state || '',
        agency_country: restOpportunity.agency_country || '',
        type: restOpportunity.type || '',
        naics_code: restOpportunity.naics_code || '',
        classification_code: restOpportunity.classification_code || '',
        response_deadline: restOpportunity.response_deadline || '',
        posted_date: restOpportunity.posted_date || '',
        content: restOpportunity.content || '',
        solicitationNumber: restOpportunity.solicitationNumber || '',
        fullParentPathName: restOpportunity.fullParentPathName || '',
        archived: restOpportunity.archived || false,
        cancelled: restOpportunity.cancelled || false
      }
      
      return cleanObj
    } catch (err) {
      console.error('Error creating clean opportunity:', err)
      // Return minimal data if serialization fails
      return {
        title: 'Unknown',
        notice_id: opportunity?.notice_id || 'unknown',
        agency_name: 'Unknown',
        type: 'Unknown'
      }
    }
  }

  const analyzeOpportunity = async (skipCache = false) => {
    // Use external analyze function if provided
    if (onAnalyze) {
      await onAnalyze(skipCache)
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      const cleanOpp = getCleanOpportunity()
      
      // Ensure all values are serializable
      const payload = {
        noticeId: String(opportunity.notice_id || ''),
        opportunity: cleanOpp,
        skipCache: Boolean(skipCache)
      }
      
      const response = await fetch('/api/opportunities/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to analyze opportunity')
      }

      const result = await response.json()
      setAnalysisResult(result)
      onAnalysisComplete?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Check for existing analysis on component mount
  useEffect(() => {
    // Skip if using external state
    if (externalAnalysisResult !== undefined) {
      setIsLoadingCached(false)
      return
    }

    const checkForCachedAnalysis = async () => {
      setIsLoadingCached(true)
      try {
        // Call the analyze endpoint which will return cached results if available
        const response = await fetch('/api/opportunities/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            noticeId: opportunity.notice_id,
            opportunity: getCleanOpportunity(),
            checkCacheOnly: true // Signal we just want to check cache
          })
        })

        if (response.ok) {
          const result = await response.json()
          if (result.success && result.cached) {
            setAnalysisResult(result)
          }
        }
      } catch (err) {
        // Silently fail - user can still click analyze button
        console.log('No cached analysis found')
      } finally {
        setIsLoadingCached(false)
      }
    }

    checkForCachedAnalysis()
  }, [opportunity.notice_id, externalAnalysisResult])

  const getRecommendationColor = (recommendation: string) => {
    if (recommendation === 'GO') return 'text-green-600'
    if (recommendation === 'NO-GO') return 'text-red-600'
    return 'text-yellow-600' // REVIEW
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

  const parseAnalysisSection = (text: string, sectionTitle: string) => {
    const regex = new RegExp(`${sectionTitle}.*?(?=\\n\\n|\\d+\\.|$)`, 'is')
    const match = text.match(regex)
    return match ? match[0] : ''
  }

  if (!actualAnalysisResult) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900">AI-Powered Opportunity Analysis</h2>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Get expert business development insights on whether to pursue this opportunity
          </p>
        </div>
        
        <div className="p-6 space-y-4">
          {isLoadingCached && (
            <div className="flex items-center justify-center py-4">
              <ArrowPathIcon className="animate-spin h-6 w-6 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">Checking for existing analysis...</span>
            </div>
          )}
          
          {!isLoadingCached && (
            <>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
              <ExclamationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-900">Deep Analysis Available</h3>
                <p className="mt-1 text-sm text-blue-700">
                  Our AI consultant will analyze this opportunity against your company profile, 
                  capabilities, and past performance to provide a comprehensive go/no-go recommendation.
                </p>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => analyzeOpportunity()}
            disabled={actualIsAnalyzing}
            className={clsx(
              "w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white",
              actualIsAnalyzing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            )}
          >
            {actualIsAnalyzing ? (
              <>
                <ArrowPathIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                Analyzing Opportunity...
              </>
            ) : (
              <>
                <ChartBarIcon className="-ml-1 mr-3 h-5 w-5" />
                Analyze Opportunity Fit
              </>
            )}
          </button>
            </>
          )}

          {actualError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <XCircleIcon className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-900">Error</h3>
                  <p className="mt-1 text-sm text-red-700">{actualError}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <SparklesIcon className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">Opportunity Analysis Results</h2>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Analyzed {new Date(actualAnalysisResult.analyzedAt).toLocaleDateString()} 
              {actualAnalysisResult.cached && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  Cached
                </span>
              )}
            </p>
          </div>
          <button
            onClick={() => analyzeOpportunity(true)} // Force fresh analysis
            disabled={actualIsAnalyzing}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowPathIcon className="h-4 w-4 mr-1" />
            Re-analyze
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Recommendation */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Recommendation</h3>
            <div className={clsx("mt-2 text-2xl font-bold flex items-center gap-2", getRecommendationColor(actualAnalysisResult.recommendation))}>
              {actualAnalysisResult.recommendation === 'GO' ? (
                <CheckCircleIcon className="h-8 w-8" />
              ) : actualAnalysisResult.recommendation === 'NO-GO' ? (
                <XCircleIcon className="h-8 w-8" />
              ) : (
                <ExclamationCircleIcon className="h-8 w-8" />
              )}
              {actualAnalysisResult.recommendation}
            </div>
          </div>

          {/* Win Probability */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Win Probability</h3>
            <div className="mt-2 space-y-2">
              <div className="text-2xl font-bold">{actualAnalysisResult.winProbability}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={clsx("h-2 rounded-full", getWinProbabilityColor(actualAnalysisResult.winProbability))}
                  style={{ width: `${actualAnalysisResult.winProbability}%` }}
                />
              </div>
              <span className={clsx(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                actualAnalysisResult.winProbability >= 70 ? "bg-green-100 text-green-800" :
                actualAnalysisResult.winProbability >= 40 ? "bg-yellow-100 text-yellow-800" :
                "bg-red-100 text-red-800"
              )}>
                {getWinProbabilityLabel(actualAnalysisResult.winProbability)}
              </span>
            </div>
          </div>

          {/* Trend Indicator */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Opportunity Trend</h3>
            <div className="mt-2 flex items-center gap-2">
              {actualAnalysisResult.winProbability >= 50 ? (
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

        {/* Detailed Analysis Tabs */}
        <div className="border border-gray-200 rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              {[
                { id: 'summary', label: 'Summary' },
                { id: 'assessment', label: 'Assessment' },
                { id: 'recommendations', label: 'Strategy' },
                { id: 'full', label: 'Full Report' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    "py-2 px-6 border-b-2 font-medium text-sm",
                    activeTab === tab.id
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'summary' && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <DocumentTextIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Executive Summary</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {actualAnalysisResult.analysis.split('\n\n')[0]}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'assessment' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Opportunity Assessment</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {parseAnalysisSection(actualAnalysisResult.analysis, 'Opportunity Assessment')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheckIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Company Fit Analysis</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">
                        {parseAnalysisSection(actualAnalysisResult.analysis, 'Company Fit Analysis')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <LightBulbIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Strategic Recommendations</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {parseAnalysisSection(actualAnalysisResult.analysis, 'Recommendations')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'full' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Complete Analysis Report</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{actualAnalysisResult.analysis}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}