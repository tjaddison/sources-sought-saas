'use client'

// import { useState } from 'react' // Removed unused import

interface FaqItem {
  question: string;
  answer: string;
}

// Commented out unused variable. Remove if definitely not needed.
/*
const faqItems: FaqItem[] = [
  {
    question: "How is GovWin AI different from other contract notification services?",
    answer: "Unlike traditional services that simply alert you to solicitations, GovWin AI focuses on the earlier, more strategic Sources Sought notices where you can influence requirements. Our system doesn't just notify—it analyzes fit, generates responses, and manages your entire pipeline."
  },
  // ... (rest of faqItems array)
];
*/

export default function FAQSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-600 font-medium text-sm mb-3">
            Questions & Answers
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Common questions about our early access program and upcoming product
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">When will GovWin AI be available?</h3>
              <p className="text-gray-600">
                We&apos;re currently in the research and development phase. Our plan is to launch a beta version to early access partners in Q1 2024, with a public launch targeted for Q2 2024, depending on feedback and testing results.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">How does the early access program work?</h3>
              <p className="text-gray-600">
                Early access participants get preview access to our prototype as it&apos;s being developed. You&apos;ll provide feedback that directly shapes the product, while securing benefits like discounted pricing when we launch.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">What features will be available in the beta?</h3>
              <p className="text-gray-600">
                The beta will focus on our core functionality: opportunity matching and requirements analysis for Sources Sought notices. Additional features like response generation will be added as development progresses.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Is the $99 founding member fee refundable?</h3>
              <p className="text-gray-600">
                Yes, if we don&apos;t launch the product or if you&apos;re unsatisfied with the beta, we&apos;ll refund your founding member fee. Our goal is to build something truly valuable for federal contractors.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">How much time commitment is expected from early users?</h3>
              <p className="text-gray-600">
                We value your time. We&apos;ll ask for occasional feedback (15-30 minutes per month) through surveys and optional group feedback sessions. You can choose your level of involvement.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">How do you handle my data during the beta?</h3>
              <p className="text-gray-600">
                Security is a priority even in beta. Your data will be encrypted, stored securely, and never shared with third parties. We&apos;ll provide a data processing agreement for early users with specific privacy requirements.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">What if I have custom integration needs?</h3>
              <p className="text-gray-600">
                Enterprise partners can discuss custom integration requirements with our team. While our initial release will have standard features, we&apos;re planning an API and integration capabilities for future releases.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">What technology will GovWin AI use?</h3>
              <p className="text-gray-600">
                We&apos;re building GovWin AI using state-of-the-art large language models, custom trained on federal contracting data, combined with secure cloud infrastructure and a user-friendly web interface.
              </p>
            </div>
          </div>
          
          <div className="mt-12 p-8 bg-blue-50 rounded-xl">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-6 md:mb-0">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
                <p className="text-gray-600">
                  We&apos;d love to hear from you. Reach out and our team will get back to you promptly.
                </p>
              </div>
              <div className="md:w-1/3 md:text-right">
                <a href="/contact" className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                  Contact Us
                  <svg className="ml-2 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 