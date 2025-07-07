import { UserProfile, getDocumentsByUserId } from '@/lib/dynamodb'
import Anthropic from '@anthropic-ai/sdk'

interface EmailGenerationParams {
  opportunity: any
  userProfile: UserProfile
  userEmail: string
}

interface RefineEmailParams {
  draftEmail: string
  opportunity: any
  userProfile: UserProfile
  userEmail: string
}

export async function generateSourcesSoughtEmail({
  opportunity,
  userProfile,
  userEmail
}: EmailGenerationParams): Promise<string> {
  // Get user's documents to mention in the email
  const documents = await getDocumentsByUserId(userProfile.userId)
  
  // Extract and clean company info
  const companyInfo = extractCompanyInfo(userProfile.companyDescription || '')
  const companyWebsite = userProfile.companyWebsite || ''
  
  // Format the email
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  // Extract relevant capabilities from description that match the opportunity
  const relevantCapabilities = extractRelevantCapabilities(
    userProfile.companyDescription || '', 
    opportunity.title + ' ' + (opportunity.content || '')
  )

  const email = `[${companyInfo.name || 'Company'} Letterhead]
${companyWebsite ? `Website: ${companyWebsite}` : ''}
Email: ${userEmail}

${today}

Attention:
${opportunity.agency_name}
${opportunity.agency_city ? `${opportunity.agency_city}, ${opportunity.agency_state || ''}` : ''}
United States

Reference: Statement of Capability for ${opportunity.title}
          (Sol. #${opportunity.solicitationNumber || opportunity.notice_id})

To whom it may concern,

${companyInfo.name || 'Our company'} is pleased to submit this Statement of Capability to demonstrate its intention to provide professional services for the above project.

${companyInfo.overview || 'We are a dedicated team committed to delivering high-quality solutions that meet and exceed our clients\' expectations.'}

SUBMITTAL REQUIREMENTS:

1. Submittal Intention: ${companyInfo.name || 'Our'} Team has reviewed this opportunity and has assembled a highly skilled and qualified group of professionals interested in providing professional services for the above referenced project. ${relevantCapabilities.intention}

2. Company Profile:
   - Company Name: ${companyInfo.name || 'TBD'}
   - Website: ${companyWebsite || 'TBD'}
   - Email: ${userEmail}
   ${companyInfo.certifications ? `- Certifications: ${companyInfo.certifications}` : ''}
   ${companyInfo.size ? `- Company Size: ${companyInfo.size}` : ''}
   ${documents.length > 0 ? `- Supporting Documents: ${documents.length} documents on file (${documents.map(d => d.documentType).join(', ')})` : ''}

3. Relevant Experience:

${relevantCapabilities.experience || 'Our team brings extensive experience in delivering successful projects similar to the requirements outlined in this Sources Sought notice.'}

${relevantCapabilities.capabilities ? `Core Capabilities:
${relevantCapabilities.capabilities}` : ''}

We are confident in our ability to meet the requirements of this project and look forward to the opportunity to demonstrate our capabilities.

Thank you for considering our submission. We are available to provide any additional information that may be required.

Sincerely,

[Your Name]
[Your Title]
${companyInfo.name || '[Company Name]'}
${userEmail}
${companyWebsite || ''}

Note: This email was generated based on your company profile. Please review and customize before sending.`

  return email
}

interface CompanyInfo {
  name: string
  overview: string
  certifications?: string
  size?: string
}

interface RelevantCapabilities {
  intention: string
  experience: string
  capabilities?: string
}

function extractCompanyInfo(description: string): CompanyInfo {
  // Clean HTML tags and extra whitespace
  const cleanDesc = description
    .replace(/<[^>]*>/g, '')
    .replace(/&[^;]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const info: CompanyInfo = {
    name: '',
    overview: ''
  }

  // Extract company name
  const namePatterns = [
    /^([A-Z][A-Za-z0-9\s&,.-]+(?:Corp|Inc|LLC|Ltd|Group|Company|Co\.|Corporation|Incorporated))/,
    /^([A-Z][A-Za-z0-9\s&,.-]+)\s+is\s+/,
    /^([A-Z][A-Za-z0-9\s&,.-]+),\s+a\s+/
  ]

  for (const pattern of namePatterns) {
    const match = cleanDesc.match(pattern)
    if (match) {
      info.name = match[1].trim()
      break
    }
  }

  // Extract overview (first meaningful paragraph)
  const sentences = cleanDesc.split(/[.!?]+/).filter(s => s.trim())
  if (sentences.length > 0) {
    info.overview = sentences[0].trim() + '.'
  }

  // Extract certifications
  const certMatch = cleanDesc.match(/(?:certified|certification|certifications?)[\s:]+([^.]+)/i)
  if (certMatch) {
    info.certifications = certMatch[1].trim()
  }

  // Extract company size
  const sizeMatch = cleanDesc.match(/(\d+\+?\s*(?:employees?|staff|team members?))/i)
  if (sizeMatch) {
    info.size = sizeMatch[1]
  }

  return info
}

function extractRelevantCapabilities(description: string, opportunityText: string): RelevantCapabilities {
  // Clean descriptions
  const cleanDesc = description
    .replace(/<[^>]*>/g, '')
    .replace(/&[^;]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const oppKeywords = extractKeywords(opportunityText)
  
  const result: RelevantCapabilities = {
    intention: 'Our team has extensive experience in similar projects.',
    experience: ''
  }

  // Find sentences that contain opportunity keywords
  const sentences = cleanDesc.split(/[.!?]+/).filter(s => s.trim())
  const relevantSentences = sentences.filter(sentence => {
    const sentLower = sentence.toLowerCase()
    return oppKeywords.some(keyword => sentLower.includes(keyword))
  })

  if (relevantSentences.length > 0) {
    result.intention = 'Our expertise directly aligns with the requirements of this opportunity.'
    result.experience = relevantSentences.slice(0, 3).join('. ') + '.'
  } else {
    // Fall back to general experience extraction
    const experienceKeywords = ['experience', 'completed', 'delivered', 'specialized', 'expertise']
    const expSentences = sentences.filter(sentence => 
      experienceKeywords.some(keyword => 
        sentence.toLowerCase().includes(keyword)
      )
    )
    
    if (expSentences.length > 0) {
      result.experience = expSentences.slice(0, 3).join('. ') + '.'
    }
  }

  // Extract capabilities list
  const capabilitiesMatch = cleanDesc.match(/(?:capabilities|services|expertise)[\s:]+([^.]+)/i)
  if (capabilitiesMatch) {
    const capabilities = capabilitiesMatch[1]
      .split(/[,;]/)
      .map(cap => `- ${cap.trim()}`)
      .join('\n')
    result.capabilities = capabilities
  }

  return result
}

function extractKeywords(text: string): string[] {
  // Extract key technical and service keywords from opportunity
  const cleanText = text.toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')

  // Common stop words to exclude
  const stopWords = new Set(['the', 'and', 'or', 'for', 'to', 'at', 'in', 'on', 'of', 'a', 'an', 'is', 'are', 'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'this', 'that', 'these', 'those'])

  // Extract meaningful words (3+ characters, not stop words)
  const words = cleanText.split(/\s+/)
    .filter(word => word.length >= 3 && !stopWords.has(word))
    .slice(0, 20) // Top 20 keywords

  return [...new Set(words)]
}

export async function refineEmailWithAI({
  draftEmail,
  opportunity,
  userProfile,
  userEmail
}: RefineEmailParams): Promise<string> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  })

  const prompt = `You are a professional business writer specializing in government contracting responses. Your task is to review and refine a Sources Sought response email to ensure it is:

1. Professionally written and formatted
2. Highly relevant to the specific Sources Sought opportunity
3. Free of HTML tags or formatting issues
4. Compelling and persuasive
5. Concise but comprehensive
6. Follows proper government contracting communication standards

SOURCES SOUGHT OPPORTUNITY:
Title: ${opportunity.title}
Agency: ${opportunity.agency_name}
Solicitation Number: ${opportunity.solicitationNumber || opportunity.notice_id}
Description: ${opportunity.content || 'N/A'}

COMPANY PROFILE:
${userProfile.companyDescription || 'No company description provided'}

DRAFT EMAIL TO REFINE:
${draftEmail}

Please rewrite this email to be a polished, professional Sources Sought response that:
- Directly addresses the opportunity requirements
- Highlights the most relevant company capabilities
- Uses professional government contracting language
- Is properly formatted for email
- Maintains the structure: letterhead, date, attention line, reference, body with submittal requirements
- Removes any placeholder text or HTML formatting
- Ensures all information is accurate and relevant

Return ONLY the complete, refined email - no explanations or additional text.`

  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [{
        role: 'user',
        content: prompt
      }]
    })

    const refinedEmail = response.content[0].type === 'text' 
      ? response.content[0].text 
      : draftEmail

    return refinedEmail
  } catch (error) {
    console.error('Error refining email with AI:', error)
    // Return the draft email if AI refinement fails
    return draftEmail
  }
}