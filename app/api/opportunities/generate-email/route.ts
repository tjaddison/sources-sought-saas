import { NextRequest, NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'
import { getUserProfile } from '@/lib/dynamodb'
import { generateSourcesSoughtEmail, refineEmailWithAI } from '@/lib/email-templates'

// Use Node.js runtime for AWS SDK compatibility
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const session = await auth0.getSession()
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { opportunity } = await request.json()
    
    if (!opportunity) {
      return NextResponse.json({ error: 'Opportunity data is required' }, { status: 400 })
    }

    // Get user profile with company information
    const userProfile = await getUserProfile(session.user.sub)
    
    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Generate the initial email content
    const draftEmail = await generateSourcesSoughtEmail({
      opportunity,
      userProfile,
      userEmail: session.user.email || userProfile.email
    })

    // Refine the email with AI to ensure relevance and professionalism
    const refinedEmail = await refineEmailWithAI({
      draftEmail,
      opportunity,
      userProfile,
      userEmail: session.user.email || userProfile.email
    })

    return NextResponse.json({ 
      success: true,
      emailContent: refinedEmail 
    })
  } catch (error) {
    console.error('Error generating email:', error)
    return NextResponse.json(
      { error: 'Failed to generate email' },
      { status: 500 }
    )
  }
}