import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-utils'

export const POST = requireAuth(async (request: NextRequest, user) => {
  try {

    // Parse request body
    const body = await request.json()
    const { noticeId, opportunity, skipCache, checkCacheOnly } = body

    if (!noticeId || !opportunity) {
      return NextResponse.json(
        { error: 'Missing required parameters: noticeId and opportunity' },
        { status: 400 }
      )
    }

    // Call Lambda function
    const lambdaUrl = process.env.OPPORTUNITY_ANALYZER_URL
    
    if (!lambdaUrl) {
      console.error('OPPORTUNITY_ANALYZER_URL not configured')
      return NextResponse.json(
        { error: 'Analysis service not configured' },
        { status: 500 }
      )
    }

    const lambdaResponse = await fetch(lambdaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.userId,
        noticeId,
        opportunity,
        skipCache,
        checkCacheOnly
      }),
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(30000) // 30 second timeout
    })

    if (!lambdaResponse.ok) {
      const errorText = await lambdaResponse.text()
      console.error('Lambda function error:', lambdaResponse.status, errorText)
      return NextResponse.json(
        { error: 'Analysis service error. Please ensure the Lambda function is properly deployed.' },
        { status: lambdaResponse.status }
      )
    }

    const analysisResult = await lambdaResponse.json()
    return NextResponse.json(analysisResult)

  } catch (error) {
    console.error('Error analyzing opportunity:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})