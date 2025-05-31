'use client'
import { useState } from 'react' // Need state for accordion
import { ChevronDownIcon, EnvelopeIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'; // Import Link

// Define FAQ items directly in the component or import from data source
const faqItems = [
  {
    question: "How is GovCon Agent different from other contract notification services?",
    answer: "Unlike traditional services that simply alert you to solicitations, GovCon Agent focuses on the earlier, more strategic Sources Sought notices where you can influence requirements. Our system doesn't just notify—it analyzes fit, generates responses, and manages your entire pipeline."
  },
  {
    question: "What sources does GovCon Agent monitor?",
    answer: "Our primary focus is SAM.gov for Sources Sought notices. We plan to expand to other relevant federal procurement portals and potentially state/local opportunities based on user feedback."
  },
  {
    question: "Is my company data secure?",
    answer: "Yes. Data security is paramount. We utilize industry-standard encryption, secure cloud infrastructure (AWS), and strict access controls. Your proprietary company information used for profile matching remains confidential."
  },
  {
    question: "What stage is the product in?",
    answer: "GovCon Agent is currently in the validation and early development phase. We are actively building our core AI models and user interface based on feedback from our waitlist and early access partners."
  },
   {
    question: "How is the AI trained?",
    answer: "We're building GovCon Agent using state-of-the-art large language models, fine-tuned on a vast dataset of federal contracting documents (Sources Sought, RFPs, capability statements), combined with secure cloud infrastructure and a user-friendly web interface."
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          {/* Use a gradient pill */}
          <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-medium text-sm mb-3">
            Questions & Answers
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <button
                onClick={() => toggleFaq(index)}
                className="flex justify-between items-center w-full p-5 text-left font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
              >
                <span>{item.question}</span>
                <ChevronDownIcon
                  className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-5 pb-5 pt-2 text-gray-600 animate-fade-in-down">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still have questions? CTA */}
        <div className="mt-16 max-w-3xl mx-auto">
           <div className="p-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg text-center md:text-left md:flex md:items-center md:justify-between">
             <div className="md:w-2/3 mb-6 md:mb-0">
               <h3 className="text-xl font-bold text-white mb-2">Still have questions?</h3>
               <p className="text-blue-100">
                 We&apos;d love to hear from you. Reach out and our team will get back to you promptly.
               </p>
             </div>
             <div className="md:w-auto"> {/* Adjusted width */}
               <Link href="/contact" className="inline-flex items-center px-6 py-3 bg-white hover:bg-gray-100 text-indigo-700 font-medium rounded-full transition-colors shadow-md">
                 Contact Us
                 <EnvelopeIcon className="ml-2 w-5 h-5" />
               </Link>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
} 