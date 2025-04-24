export interface Opportunity {
  id: string;
  title: string;
  agency: string;
  noticeType: 'Sources Sought' | 'Presolicitation' | 'Special Notice';
  postedDate: string;
  responseDate: string;
  setAside?: string; // e.g., "Small Business", "8(a)"
  description: string;
  matchScore?: number; // Simulated score (0-100)
  status: 'New' | 'Reviewing' | 'Responding' | 'Submitted' | 'Archived';
}

export interface AnalysisResult {
  opportunityId: string;
  summary: string;
  keyRequirements: string[];
  evaluationCriteria: string[];
  potentialCompetitors: string[];
  contacts: { name: string; email: string; phone?: string }[];
}

export interface ResponseDraft {
  opportunityId: string;
  outline: string[];
  capabilityStatement: string;
}

// --- Sample Data ---

export const demoOpportunities: Opportunity[] = [
  {
    id: 'opp-001',
    title: 'AI-Powered Data Analytics Platform for Cybersecurity',
    agency: 'Department of Defense (DoD)',
    noticeType: 'Sources Sought',
    postedDate: '2024-03-10',
    responseDate: '2024-04-01',
    setAside: 'Small Business',
    description: 'Seeking capabilities for a next-generation platform leveraging AI/ML to analyze network traffic and identify potential cyber threats in real-time. Interested parties should demonstrate experience in large-scale data processing, anomaly detection, and secure software development.',
    matchScore: 92,
    status: 'New',
  },
  {
    id: 'opp-002',
    title: 'Cloud Migration Services for Legacy Systems',
    agency: 'General Services Administration (GSA)',
    noticeType: 'Sources Sought',
    postedDate: '2024-03-12',
    responseDate: '2024-04-05',
    description: 'Requesting information from vendors capable of migrating complex legacy applications to a secure cloud environment (AWS GovCloud preferred). Focus areas include assessment, planning, execution, and post-migration support.',
    matchScore: 75,
    status: 'Reviewing',
  },
  {
    id: 'opp-003',
    title: 'Development of Training Simulation Software',
    agency: 'Department of Veterans Affairs (VA)',
    noticeType: 'Presolicitation',
    postedDate: '2024-03-15',
    responseDate: '2024-04-10',
    setAside: '8(a)',
    description: 'The VA intends to solicit proposals for the development of immersive virtual reality training simulations for medical personnel. Anticipated requirements include realistic scenarios, performance tracking, and integration with existing LMS.',
    matchScore: 88,
    status: 'Responding',
  },
   {
    id: 'opp-004',
    title: 'Logistics and Supply Chain Optimization Study',
    agency: 'Department of Transportation (DOT)',
    noticeType: 'Sources Sought',
    postedDate: '2024-03-08',
    responseDate: '2024-03-28',
    description: 'Seeking expert analysis and recommendations for optimizing national supply chain logistics using advanced modeling and data analytics. Interested vendors should provide white papers detailing their approach and relevant past performance.',
    matchScore: 65,
    status: 'Submitted',
  },
   {
    id: 'opp-005',
    title: 'Website Redesign and Content Management System Implementation',
    agency: 'Environmental Protection Agency (EPA)',
    noticeType: 'Special Notice',
    postedDate: '2024-02-20',
    responseDate: '2024-03-15',
    description: 'Informing industry of an upcoming requirement for a complete website overhaul, including migration to a modern CMS platform. This notice is for informational purposes only at this time.',
    matchScore: 50,
    status: 'Archived',
  },
];

export const demoAnalysisResults: AnalysisResult[] = [
  {
    opportunityId: 'opp-001',
    summary: 'DoD seeks small businesses with AI/ML expertise for a real-time cybersecurity threat detection platform. Key focus on data processing, anomaly detection, and secure development.',
    keyRequirements: [
      'Demonstrated AI/ML experience in cybersecurity.',
      'Ability to process large-scale network data.',
      'Real-time anomaly detection algorithms.',
      'Secure software development practices (e.g., DevSecOps).',
      'Potential for integration with existing DoD systems.',
    ],
    evaluationCriteria: [
      'Technical Approach (AI/ML relevance, scalability)',
      'Past Performance (similar size/scope projects)',
      'Personnel Qualifications (key personnel expertise)',
      'Security Compliance',
    ],
    potentialCompetitors: ['CyberAnalytics Inc.', 'SecureAI Solutions', 'DataDefend LLC'],
    contacts: [{ name: 'Maj. Sarah Connor', email: 's.connor@dod.mil' }],
  },
  {
    opportunityId: 'opp-002',
    summary: 'GSA requires cloud migration services for legacy apps, preferably to AWS GovCloud. Full lifecycle support needed (assess, plan, execute, support).',
    keyRequirements: [
      'Experience migrating complex legacy applications.',
      'Proficiency with AWS GovCloud (preferred) or similar FedRAMP High environments.',
      'Methodology for assessment and planning.',
      'Capability for secure data migration.',
      'Post-migration operational support plan.',
    ],
    evaluationCriteria: [
      'Migration Methodology',
      'Cloud Environment Expertise (AWS GovCloud)',
      'Past Performance (legacy system migration)',
      'Project Management Approach',
    ],
    potentialCompetitors: ['CloudForward Gov', 'LegacyLift Solutions', 'InfraMigrate Federal'],
    contacts: [{ name: 'John Smith', email: 'j.smith@gsa.gov', phone: '202-555-1212' }],
  },
   {
    opportunityId: 'opp-003',
    summary: 'VA plans to solicit 8(a) firms for VR medical training simulation development. Requires realistic scenarios and LMS integration.',
    keyRequirements: [
      'VR development expertise (Unity, Unreal Engine, etc.).',
      'Experience creating realistic training simulations.',
      'Ability to track user performance within the simulation.',
      'LMS integration capabilities (SCORM, xAPI).',
      'Understanding of medical training requirements (preferred).',
    ],
    evaluationCriteria: [ // Note: These are anticipated for the future RFP
      'Technical Solution (realism, interactivity, tracking)',
      'Development Team Experience (VR, medical simulation)',
      'Past Performance (relevant projects)',
      'Management Plan',
    ],
    potentialCompetitors: ['SimuHealth Tech', 'VR Training Pros', 'MedSim Innovations (8a)'],
    contacts: [{ name: 'Dr. Emily Carter', email: 'e.carter@va.gov' }],
  },
  // Add analysis for opp-004 and opp-005 if needed for demo depth
];

export const demoResponseDrafts: ResponseDraft[] = [
 {
    opportunityId: 'opp-001',
    outline: [
        'Introduction: Briefly introduce company and state understanding of the requirement.',
        'Technical Approach: Detail AI/ML methodology for threat detection, data processing plan, anomaly detection techniques.',
        'Past Performance: Summarize 2-3 relevant projects demonstrating cybersecurity and AI/ML capabilities.',
        'Personnel: Highlight key personnel and their specific expertise.',
        'Security: Describe approach to secure development and compliance.',
        'Conclusion: Reiterate interest and qualifications.',
    ],
    capabilityStatement: `[Your Company Name] is a Small Business specializing in advanced AI/ML solutions for cybersecurity. We possess deep expertise in large-scale data analytics and real-time anomaly detection, directly relevant to the DoD's requirement for a next-generation threat detection platform. Our team has successfully delivered [mention specific relevant project type] for [mention similar client type]. We utilize rigorous DevSecOps practices to ensure secure and robust software development. We are confident in our ability to meet and exceed the requirements outlined in this Sources Sought notice.`
 },
  {
    opportunityId: 'opp-003',
    outline: [
        'Company Overview: Introduce company as an 8(a) certified firm with VR expertise.',
        'Understanding of Requirement: Demonstrate understanding of VA\'s need for immersive medical training.',
        'Proposed Solution: Outline VR platform choice (e.g., Unity), approach to scenario design, performance tracking features.',
        'LMS Integration Plan: Describe how the simulation will integrate with standard LMS systems.',
        'Relevant Experience: Detail past VR development projects, emphasizing any training or simulation work.',
        'Team Qualifications: Introduce key development team members.',
    ],
    capabilityStatement: `As an 8(a) certified technology firm, [Your Company Name] specializes in developing immersive virtual reality training solutions. We understand the VA's need for realistic and effective medical training simulations. Our proposed solution utilizes [Platform, e.g., Unity] to create engaging scenarios with robust performance tracking, fully integrable with standard Learning Management Systems via [Standard, e.g., SCORM/xAPI]. Our portfolio includes [mention relevant VR project]. We have the expertise and qualifications to successfully deliver this project.`
 },
 // Add drafts for other opportunities as needed
]; 