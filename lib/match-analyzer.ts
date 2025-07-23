// Analyze why an opportunity matches a user's profile
export function analyzeMatch(
  opportunity: {
    title?: string;
    OppDescription?: string;
    naicsCode?: string;
    fullParentPathName?: string;
    type?: string;
  },
  userProfile: {
    companyDescription?: string;
  }
): string[] {
  const reasons: string[] = [];
  
  if (!userProfile.companyDescription) {
    return reasons;
  }
  
  const profileLower = userProfile.companyDescription.toLowerCase();
  const opportunityText = `${opportunity.title || ''} ${opportunity.OppDescription || ''}`.toLowerCase();
  
  // Key technology terms
  const techTerms = [
    'software', 'cloud', 'data', 'analytics', 'ai', 'machine learning',
    'cybersecurity', 'security', 'network', 'infrastructure', 'database',
    'web', 'mobile', 'api', 'integration', 'development', 'engineering'
  ];
  
  // Service terms
  const serviceTerms = [
    'consulting', 'management', 'support', 'training', 'implementation',
    'maintenance', 'operations', 'analysis', 'design', 'architecture',
    'testing', 'quality assurance', 'documentation', 'migration'
  ];
  
  // Domain terms
  const domainTerms = [
    'healthcare', 'defense', 'federal', 'government', 'financial',
    'education', 'transportation', 'energy', 'environmental', 'research'
  ];
  
  // Check for matching terms
  const matchingTech = techTerms.filter(term => 
    profileLower.includes(term) && opportunityText.includes(term)
  );
  
  const matchingServices = serviceTerms.filter(term => 
    profileLower.includes(term) && opportunityText.includes(term)
  );
  
  const matchingDomains = domainTerms.filter(term => 
    profileLower.includes(term) && opportunityText.includes(term)
  );
  
  if (matchingTech.length > 0) {
    reasons.push(`Technology alignment: ${matchingTech.slice(0, 3).join(', ')}`);
  }
  
  if (matchingServices.length > 0) {
    reasons.push(`Service capabilities: ${matchingServices.slice(0, 3).join(', ')}`);
  }
  
  if (matchingDomains.length > 0) {
    reasons.push(`Domain expertise: ${matchingDomains.slice(0, 3).join(', ')}`);
  }
  
  // Check NAICS code if available
  if (opportunity.naicsCode && profileLower.includes('naics')) {
    const naicsMatch = profileLower.match(/naics[:\s]*(\d+)/);
    if (naicsMatch && opportunity.naicsCode.startsWith(naicsMatch[1])) {
      reasons.push(`NAICS code match: ${opportunity.naicsCode}`);
    }
  }
  
  // Check for agency experience
  if (opportunity.fullParentPathName) {
    const agencyWords = opportunity.fullParentPathName.toLowerCase().split(/\s+/);
    const hasAgencyExperience = agencyWords.some(word => 
      word.length > 3 && profileLower.includes(word)
    );
    
    if (hasAgencyExperience) {
      reasons.push(`Agency experience: ${opportunity.fullParentPathName}`);
    }
  }
  
  return reasons.slice(0, 3); // Return top 3 reasons
}

// Extract key capabilities from user profile
export function extractKeyCapabilities(
  companyDescription: string,
  maxCapabilities: number = 5
): string[] {
  const capabilities: string[] = [];
  const descLower = companyDescription.toLowerCase();
  
  // Common capability patterns
  const patterns = [
    /specializ\w+ in ([^,.]+)/g,
    /expert\w+ in ([^,.]+)/g,
    /provid\w+ ([^,.]+) services/g,
    /certified in ([^,.]+)/g,
    /experienced with ([^,.]+)/g,
    /focus\w+ on ([^,.]+)/g,
    /capabilities include ([^,.]+)/g
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(descLower)) !== null) {
      if (match[1] && match[1].length > 5) {
        capabilities.push(match[1].trim());
      }
    }
  });
  
  // Also extract from bullet points or lists
  const listItems = companyDescription.match(/[•\-\*]\s*([^•\-\*\n]+)/g);
  if (listItems) {
    listItems.forEach(item => {
      const cleaned = item.replace(/[•\-\*]\s*/, '').trim();
      if (cleaned.length > 5 && cleaned.length < 50) {
        capabilities.push(cleaned.toLowerCase());
      }
    });
  }
  
  // Remove duplicates and return top capabilities
  const unique = Array.from(new Set(capabilities));
  return unique.slice(0, maxCapabilities);
}