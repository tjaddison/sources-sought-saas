'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckIcon } from '@heroicons/react/24/solid'
import { DocumentTextIcon, ChartBarIcon, BoltIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

interface TabContentProps {
  title: string;
  description: string;
  featureList: string[];
  image: string;
}

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
    image: '/images/opportunity-matching.png'
  },
  'requirements-analysis': {
    title: 'Automated Requirements Analysis',
    description: 'Instantly extract and summarize key requirements from lengthy government documents. GovWin AI breaks down complex attachments, identifies hidden requirements, and flags potential issues.',
    featureList: [
      'Automated document parsing and analysis',
      'Key requirement extraction and prioritization',
      'Capability alignment assessment',
      'Risk and complexity evaluation'
    ],
    image: '/images/requirements-analysis.png'
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
    image: '/images/pipeline-management.png'
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
    image: '/images/response-generation.png'
  },
  'followup-system': {
    title: 'Smart Follow-up System',
    description: 'Never miss another deadline or follow-up opportunity. GovWin AI reminds you when to confirm receipt, request meetings, and check for solicitation releases.',
    featureList: [
      'Automated follow-up reminders',
      'Meeting request draft generation',
      'Solicitation monitoring alerts',
      'Relationship building cadence management'
    ],
    image: '/images/followup-system.png'
  }
};
*/

export default function FeatureSpotlightSection() {
  const [activeTab, setActiveTab] = useState(0);
  
  const tabs = [
    {
      icon: <MagnifyingGlassIcon className="w-6 h-6" />,
      name: "Discover",
      content: {
        title: "AI-Powered Opportunity Discovery",
        description: "Our AI scans SAM.gov for Sources Sought notices that match your capabilities, ensuring you never miss a relevant opportunity.",
        featureList: [
          "Personalized opportunity matching",
          "Real-time notifications",
          "Automated relevance scoring",
          "Keyword and NAICS code filtering"
        ],
        image: "/images/feature-discover.png" // Replace with actual image path
      }
    },
    {
      icon: <DocumentTextIcon className="w-6 h-6" />,
      name: "Analyze",
      content: {
        title: "Deep Document Analysis",
        description: "Our AI analyzes each Sources Sought notice to extract key requirements, deadlines, and evaluation criteria.",
        featureList: [
          "Requirement extraction and summarization",
          "Competitive landscape analysis",
          "Win probability assessment",
          "Historical contract data integration"
        ],
        image: "/images/feature-analyze.png" // Replace with actual image path
      }
    },
    {
      icon: <BoltIcon className="w-6 h-6" />,
      name: "Respond",
      content: {
        title: "AI-Assisted Response Generation",
        description: "Generate compelling responses to Sources Sought notices with our AI assistant, saving hours of writing time.",
        featureList: [
          "Response template generation",
          "Capability statement customization",
          "Past performance highlighting",
          "Compliance checking"
        ],
        image: "/images/feature-respond.png" // Replace with actual image path
      }
    },
    {
      icon: <ChartBarIcon className="w-6 h-6" />,
      name: "Track",
      content: {
        title: "Pipeline Management",
        description: "Track your entire pre-solicitation pipeline from discovery to submission with our intuitive dashboard.",
        featureList: [
          "Opportunity status tracking",
          "Deadline reminders",
          "Team collaboration tools",
          "Analytics and insights"
        ],
        image: "/images/feature-track.png" // Replace with actual image path
      }
    }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-blue-50 to-white"></div>
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-100 rounded-full opacity-20"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-100 rounded-full opacity-20"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium text-sm mb-3">
            Powerful Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Win More Contracts
          </h2>
          <p className="text-xl text-gray-600">
            Our platform streamlines the entire pre-solicitation process, from opportunity discovery to response submission.
          </p>
        </motion.div>
        
        {/* Tabs */}
        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center mb-12 border-b border-gray-200">
            {tabs.map((tab, index) => (
              <motion.button
                key={index}
                className={`flex items-center px-6 py-4 text-lg font-medium border-b-2 transition-colors ${
                  activeTab === index 
                    ? 'text-blue-600 border-blue-600' 
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(index)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </motion.button>
            ))}
          </div>
          
          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              {/* Content */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {tabs[activeTab].content.title}
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  {tabs[activeTab].content.description}
                </p>
                <ul className="space-y-3">
                  {tabs[activeTab].content.featureList.map((feature, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              {/* Image/Illustration */}
              <motion.div
                className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-sm"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Placeholder for feature image */}
                <div className="aspect-video bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full text-blue-600 mb-4 shadow-sm">
                      {tabs[activeTab].icon}
                    </div>
                    <p className="text-blue-800 font-medium">
                      {tabs[activeTab].name} Feature Visualization
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
} 