'use client'

// import { useState } from 'react' // Removed unused import
// import Image from 'next/image' // Removed unused import
// import ImageFallback from './ImageFallback' // Removed unused import


// Commented out unused variable. Remove if definitely not needed.
/*
const tabContents: Record<string, TabContentProps> = {
  'opportunity-matching': {
    title: 'Intelligent Opportunity Matching',
    description: 'Our AI analyzes your past performance, capabilities statement, and set-aside status to identify Sources Sought notices with the highest win probability for your specific business.',
    featureList: [
      'Smart keyword expansion beyond standard NAICS codes',
      'Agency pattern recognition for targeted opportunities',
      'Set-aside optimization for your business status',
      'Historical performance matching for high probability wins'
    ],
    imageSrc: '/images/opportunity-matching.png'
  },
  'requirements-analysis': {
    title: 'Automated Requirements Analysis',
    description: 'Instantly extract and summarize key requirements from lengthy government documents. GovCon Agent breaks down complex attachments, identifies hidden requirements, and flags potential issues.',
    featureList: [
      'Automated document parsing and analysis',
      'Key requirement extraction and prioritization',
      'Capability alignment assessment',
      'Risk and complexity evaluation'
    ],
    imageSrc: '/images/requirements-analysis.png'
  },
  'pipeline-management': {
    title: 'Strategic Pipeline Management',
    description: 'Track every opportunity through a specialized government contracting pipeline designed by former contracting officers—from initial discovery through award notification.',
    featureList: [
      'Custom GovCon pipeline stages',
      'Automated stage progression tracking',
      'Timeline visualization and forecasting',
      'Resource allocation recommendations'
    ],
    imageSrc: '/images/pipeline-management.png'
  },
  'response-generation': {
    title: 'Response Generation Engine',
    description: 'Generate professionally written Sources Sought responses that position your capabilities, highlight past performance, and strategically influence future solicitation requirements.',
    featureList: [
      'AI-powered response drafting',
      'Past performance integration',
      'Strategic requirement influence suggestions',
      'Compliance verification'
    ],
    imageSrc: '/images/response-generation.png'
  },
  'followup-system': {
    title: 'Smart Follow-up System',
    description: 'Never miss another deadline or follow-up opportunity. GovCon Agent reminds you when to confirm receipt, request meetings, and check for solicitation releases.',
    featureList: [
      'Automated follow-up reminders',
      'Meeting request draft generation',
      'Solicitation monitoring alerts',
      'Relationship building cadence management'
    ],
    imageSrc: '/images/followup-system.png'
  }
};
*/

export default function FeatureSpotlightSection() {
  const features = [
    {
      title: "Opportunity Matching",
      description: "Our AI will connect you with Sources Sought notices perfectly aligned to your capabilities and experience.",
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="8" fill="#EFF6FF"/>
          <path d="M14 20H26M20 14V26" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="20" cy="20" r="10" stroke="#2563EB" strokeWidth="2"/>
        </svg>
      )
    },
    {
      title: "Requirements Analysis",
      description: "We're building systems to analyze RFIs and Sources Sought notices to extract critical requirements automatically.",
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="8" fill="#EFF6FF"/>
          <path d="M15 20L18 23L25 16" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="12" y="12" width="16" height="16" rx="2" stroke="#2563EB" strokeWidth="2"/>
        </svg>
      )
    },
    {
      title: "Response Generation",
      description: "Planned feature to generate professional, tailored responses to Sources Sought notices in minutes, not days.",
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="8" fill="#EFF6FF"/>
          <path d="M13 15H27M13 20H23M13 25H19" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <rect x="10" y="10" width="20" height="20" rx="2" stroke="#2563EB" strokeWidth="2"/>
        </svg>
      )
    },
    {
      title: "Pipeline Management",
      description: "We plan to help you track and manage your opportunity pipeline with win probability analysis and recommendations.",
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="8" fill="#EFF6FF"/>
          <path d="M12 28V18M20 28V12M28 28V22" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="14" r="2" stroke="#2563EB" strokeWidth="2"/>
          <circle cx="20" cy="10" r="2" stroke="#2563EB" strokeWidth="2"/>
          <circle cx="28" cy="20" r="2" stroke="#2563EB" strokeWidth="2"/>
        </svg>
      )
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Planned Features
          </h2>
          <p className="text-xl text-gray-600">
            Here&apos;s what we&apos;re building to streamline the federal contracting process.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="mb-5">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        {/* Large SVG Dashboard Illustration */}
        <div className="mt-20 mx-auto max-w-5xl bg-white rounded-xl shadow-lg p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16">
            <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 0C155.228 0 200 44.7715 200 100C200 155.228 155.228 200 100 200C44.7715 200 0 155.228 0 100C0 44.7715 44.7715 0 100 0Z" fill="#EFF6FF" fillOpacity="0.5"/>
            </svg>
          </div>
          
          <svg className="w-full" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="800" height="400" rx="8" fill="#F9FAFB"/>
            
            {/* Dashboard Header */}
            <rect x="40" y="30" width="720" height="60" rx="4" fill="#F3F4F6"/>
            <rect x="60" y="55" width="140" height="10" rx="2" fill="#E5E7EB"/>
            <circle cx="740" cy="60" r="15" fill="#3B82F6"/>
            <circle cx="700" cy="60" r="15" fill="#E5E7EB"/>
            
            {/* Sidebar */}
            <rect x="40" y="110" width="200" height="260" rx="4" fill="#F3F4F6"/>
            <rect x="60" y="135" width="160" height="10" rx="2" fill="#E5E7EB"/>
            <rect x="60" y="165" width="160" height="10" rx="2" fill="#E5E7EB"/>
            <rect x="60" y="195" width="160" height="10" rx="2" fill="#E5E7EB"/>
            <rect x="60" y="225" width="160" height="10" rx="2" fill="#E5E7EB"/>
            <rect x="60" y="255" width="160" height="10" rx="2" fill="#E5E7EB"/>
            <rect x="60" y="285" width="160" height="10" rx="2" fill="#E5E7EB"/>
            <rect x="60" y="315" width="160" height="10" rx="2" fill="#E5E7EB"/>
            <rect x="60" y="345" width="160" height="10" rx="2" fill="#E5E7EB"/>
            
            {/* Main Content */}
            <rect x="260" y="110" width="500" height="120" rx="4" fill="#DBEAFE"/>
            <rect x="280" y="130" width="200" height="15" rx="2" fill="#3B82F6"/>
            <rect x="280" y="155" width="300" height="10" rx="2" fill="#93C5FD"/>
            <rect x="280" y="175" width="250" height="10" rx="2" fill="#93C5FD"/>
            <rect x="280" y="195" width="150" height="10" rx="2" fill="#93C5FD"/>
            
            {/* Stats */}
            <rect x="260" y="250" width="160" height="120" rx="4" fill="#F3F4F6"/>
            <rect x="280" y="270" width="80" height="10" rx="2" fill="#E5E7EB"/>
            <rect x="280" y="290" width="120" height="30" rx="2" fill="#3B82F6"/>
            <rect x="280" y="330" width="120" height="10" rx="2" fill="#E5E7EB"/>
            <rect x="280" y="350" width="80" height="10" rx="2" fill="#E5E7EB"/>
            
            <rect x="430" y="250" width="160" height="120" rx="4" fill="#F3F4F6"/>
            <rect x="450" y="270" width="80" height="10" rx="2" fill="#E5E7EB"/>
            <rect x="450" y="290" width="120" height="30" rx="2" fill="#10B981"/>
            <rect x="450" y="330" width="120" height="10" rx="2" fill="#E5E7EB"/>
            <rect x="450" y="350" width="80" height="10" rx="2" fill="#E5E7EB"/>
            
            <rect x="600" y="250" width="160" height="120" rx="4" fill="#F3F4F6"/>
            <rect x="620" y="270" width="80" height="10" rx="2" fill="#E5E7EB"/>
            <rect x="620" y="290" width="120" height="30" rx="2" fill="#F59E0B"/>
            <rect x="620" y="330" width="120" height="10" rx="2" fill="#E5E7EB"/>
            <rect x="620" y="350" width="80" height="10" rx="2" fill="#E5E7EB"/>
            
            {/* Chart Line */}
            <path d="M280 320L320 305L360 310L400 290" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/>
            <path d="M450 320L490 290L530 300L570 280" stroke="#10B981" strokeWidth="2" strokeLinecap="round"/>
            <path d="M620 320L660 300L700 310L740 290" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    </section>
  )
} 