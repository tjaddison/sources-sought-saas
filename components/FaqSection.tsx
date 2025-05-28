'use client'

import { useState } from 'react'
import Link from 'next/link'

// Simple SVG chevron icon component
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clipRule="evenodd" />
  </svg>
)

// Simple SVG envelope icon component
const EnvelopeIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
  </svg>
)

interface FaqItem {
  question: string;
  answer: string;
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const faqItems: FaqItem[] = [
    {
      question: "How is GovBiz Agent different from other solutions?",
      answer: "Unlike traditional opportunity tracking tools that simply aggregate contract notices, GovBiz Agent focuses on the pre-solicitation phase where you can actually influence requirements. Our AI analyzes patterns across thousands of federal contracts to help you respond with highly targeted submissions that position your company as the ideal solution provider."
    },
    {
      question: "What sources does GovBiz Agent monitor?",
      answer: "Our primary focus is SAM.gov for Sources Sought notices. We plan to expand to other relevant federal procurement portals and potentially state/local opportunities based on user feedback."
    },
    {
      question: "How much does GovBiz Agent cost?",
      answer: "We offer a free 'Pathfinder' tier that lets you create your company profile and upload your capability statement. For more advanced features, we have two paid tiers: the Scout plan at $19/month and our popular Agent Pro plan at $99/month. You can view detailed pricing and features on our pricing page."
    },
    {
      question: "How much time can GovBiz Agent save my team?",
      answer: "GovBiz Agent is designed to reduce time spent on manual opportunity identification and initial response drafting by 70-80%. Our ROI calculator can help you estimate your specific time and cost savings based on your team's current processes."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, we'll offer a 14-day free trial for all paid plans when we launch. You can join our waitlist now to be notified when we launch and receive early access."
    },
    {
      question: "How do I get started with GovBiz Agent?",
      answer: "Currently, you can join our waitlist to be among the first to access GovBiz Agent when we launch. You can also explore our demo to get a feel for how the system will work."
    }
  ];

  return (
    <section className="py-20 bg-white" id="faq">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about GovBiz Agent
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {/* FAQ Accordion */}
          <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
            {faqItems.map((item, index) => (
              <div key={index} className="py-5">
                <button
                  className="flex w-full justify-between items-center text-left focus:outline-none"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <h3 className="text-lg font-medium text-gray-900">{item.question}</h3>
                  <ChevronDownIcon 
                    className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openIndex === index && (
                  <div className="mt-3 text-gray-600 animate-fade-in-down">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Still have questions? Contact section */}
          <div className="mt-12 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              We&apos;re here to help. Join our waitlist to stay updated.
            </p>
            <Link 
              href="/waitlist" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <EnvelopeIcon className="w-5 h-5 mr-2" />
              Join Waitlist
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
} 