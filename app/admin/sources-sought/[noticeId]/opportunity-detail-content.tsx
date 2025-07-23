'use client'

import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { DocumentTextIcon, BuildingOfficeIcon, CalendarIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { BackToSearchButton } from '@/components/back-to-search-button'
import { OpportunityAnalysisButton } from '@/components/opportunity-analysis-button'
import { OpportunityAnalysisSummary } from '@/components/opportunity-analysis-summary'
import { OpportunityAnalysis } from '@/components/opportunity-analysis'
import { EmailGenerationModal } from '@/components/email-generation-modal'

interface AnalysisResult {
  success: boolean
  analysis: string
  winProbability: number
  recommendation: 'GO' | 'NO-GO' | 'REVIEW'
  analyzedAt: string
  modelUsed: string
  cached?: boolean
}

interface OpportunityDetailContentProps {
  data: any
}

export default function OpportunityDetailContent({ data }: OpportunityDetailContentProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoadingCached, setIsLoadingCached] = useState(true)
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false)

  // Helper function to create a clean copy of opportunity data
  const getCleanOpportunity = () => {
    try {
      const { _additional, ...restOpportunity } = data || {}
      
      return {
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
    } catch (err) {
      console.error('Error creating clean opportunity:', err)
      return {
        title: 'Unknown',
        notice_id: data?.notice_id || 'unknown',
        agency_name: 'Unknown',
        type: 'Unknown'
      }
    }
  }

  const analyzeOpportunity = async (skipCache = false) => {
    setIsAnalyzing(true)
    setError(null)

    try {
      const cleanOpp = getCleanOpportunity()
      
      const payload = {
        noticeId: String(data.notice_id || ''),
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Check for existing analysis on component mount
  useEffect(() => {
    const checkForCachedAnalysis = async () => {
      setIsLoadingCached(true)
      try {
        const response = await fetch('/api/opportunities/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            noticeId: data.notice_id,
            opportunity: getCleanOpportunity(),
            checkCacheOnly: true
          })
        })

        if (response.ok) {
          const result = await response.json()
          if (result.success && result.cached) {
            setAnalysisResult(result)
          }
        }
      } catch (err) {
        console.log('No cached analysis found')
      } finally {
        setIsLoadingCached(false)
      }
    }

    checkForCachedAnalysis()
  }, [data.notice_id])

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy')
    } catch {
      return dateString
    }
  }

  const formatDateTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy \'at\' hh:mm a \'EDT\'')
    } catch {
      return dateString
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <BackToSearchButton />
      </div>

      {/* Show analysis summary at the top if available */}
      {analysisResult && !isLoadingCached && (
        <OpportunityAnalysisSummary analysisResult={analysisResult} />
      )}

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{data.title}</h1>
              <p className="mt-1 text-sm text-gray-600">Notice ID: {data.notice_id}</p>
            </div>
            
            {(data.archived || data.cancelled) && (
              <div className="flex gap-2">
                {data.archived && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Archived
                  </span>
                )}
                {data.cancelled && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Cancelled
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Key Dates</h3>
                <dl className="mt-2 space-y-2">
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <dt className="text-gray-600">Response Deadline:</dt>
                    <dd className="ml-2 font-medium text-gray-900">{formatDateTime(data.responseDeadLine || data.response_deadline)}</dd>
                  </div>
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <dt className="text-gray-600">Posted Date:</dt>
                    <dd className="ml-2 font-medium text-gray-900">{formatDate(data.postedDate || data.posted_date)}</dd>
                  </div>
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                    <dt className="text-gray-600">Last Updated:</dt>
                    <dd className="ml-2 font-medium text-gray-900">{formatDate(data.updated_at || data.postedDate)}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Agency Information</h3>
                <dl className="mt-2 space-y-2">
                  <div className="flex items-start text-sm">
                    <BuildingOfficeIcon className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                    <div>
                      <dt className="text-gray-600">Agency:</dt>
                      <dd className="font-medium text-gray-900">{data.fullParentPathName || data.agency_name}</dd>
                    </div>
                  </div>
                  {(data.officeAddress || data.agency_city || data.agency_state || data.agency_country) && (
                    <div className="text-sm ml-6">
                      <dt className="text-gray-600">Location:</dt>
                      <dd className="font-medium text-gray-900">
                        {data.officeAddress ? 
                          [data.officeAddress.city, data.officeAddress.state, data.officeAddress.countryCode]
                            .filter(Boolean)
                            .join(', ') :
                          [data.agency_city, data.agency_state, data.agency_country]
                            .filter(Boolean)
                            .join(', ')
                        }
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Classification</h3>
                <dl className="mt-2 space-y-2">
                  <div className="text-sm">
                    <dt className="text-gray-600">Type:</dt>
                    <dd className="font-medium text-gray-900">{data.type}</dd>
                  </div>
                  {data.solicitationNumber && (
                    <div className="text-sm">
                      <dt className="text-gray-600">Solicitation Number:</dt>
                      <dd className="font-medium text-gray-900">{data.solicitationNumber}</dd>
                    </div>
                  )}
                  {(data.naicsCode || data.naics_code) && (
                    <div className="text-sm">
                      <dt className="text-gray-600">NAICS Code:</dt>
                      <dd className="font-medium text-gray-900">{data.naicsCode || data.naics_code}</dd>
                    </div>
                  )}
                  {(data.classificationCode || data.classification_code) && (
                    <div className="text-sm">
                      <dt className="text-gray-600">Classification Code:</dt>
                      <dd className="font-medium text-gray-900">{data.classificationCode || data.classification_code}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</h3>
                <div className="mt-2 space-y-2">
                  <OpportunityAnalysisButton
                    isAnalyzing={isAnalyzing}
                    hasAnalysis={!!analysisResult}
                    onAnalyze={() => analyzeOpportunity(!!analysisResult)}
                  />
                  {data.type === 'Sources Sought' && (
                    <button 
                      onClick={() => setShowEmailModal(true)}
                      disabled={isGeneratingEmail}
                      className="w-full text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md transition-colors"
                    >
                      {isGeneratingEmail ? 'Generating...' : 'Generate Response Email'}
                    </button>
                  )}
                  <button className="w-full text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                    Contact Opportunities
                  </button>
                  <a
                    href={`https://sam.gov/opp/${data.notice_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors"
                  >
                    View on SAM.gov
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <button
              onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
              className="w-full text-left"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Description</h3>
                <ChevronRightIcon 
                  className={`h-5 w-5 text-gray-400 transition-transform ${isDescriptionOpen ? 'rotate-90' : ''}`}
                />
              </div>
            </button>
            {isDescriptionOpen && (
              <div className="mt-4 prose prose-sm max-w-none text-gray-700 max-h-96 overflow-y-auto">
                <p className="whitespace-pre-wrap">{data.OppDescription || data.content}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full AI Analysis Section */}
      {!isLoadingCached && (
        <OpportunityAnalysis 
          opportunity={data}
          onAnalysisComplete={() => {}}
          externalAnalysisResult={analysisResult}
          externalIsAnalyzing={isAnalyzing}
          externalError={error}
          onAnalyze={analyzeOpportunity}
        />
      )}

      {/* Email Generation Modal */}
      {showEmailModal && (
        <EmailGenerationModal
          opportunity={data}
          onClose={() => setShowEmailModal(false)}
          isGenerating={isGeneratingEmail}
          setIsGenerating={setIsGeneratingEmail}
        />
      )}
    </div>
  )
}