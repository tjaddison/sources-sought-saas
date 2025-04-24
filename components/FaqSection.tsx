'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon, EnvelopeIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "How is GovWin AI different from other contract notification services?",
      answer: "Unlike traditional services that simply alert you to solicitations, GovWin AI focuses on the earlier, more strategic Sources Sought notices where you can influence requirements. Our system doesn't just notify—it analyzes fit, generates responses, and manages your entire pipeline."
    },
    {
      question: "What sources does GovWin AI monitor?",
      answer: "Our primary focus is SAM.gov for Sources Sought notices. We plan to expand to other relevant federal procurement portals and potentially state/local opportunities based on user feedback."
    },
    {
      question: "Is my company data secure?",
      answer: "Yes. Data security is paramount. We utilize industry-standard encryption, secure cloud infrastructure (AWS), and strict access controls. Your proprietary company information used for profile matching remains confidential."
    },
    {
      question: "What stage is the product in?",
      answer: "GovWin AI is currently in the validation and early development phase. We are actively building our core AI models and user interface based on feedback from our waitlist and early access partners."
    },
    {
      question: "How is the AI trained?",
      answer: "We're building GovWin AI using state-of-the-art large language models, fine-tuned on a vast dataset of federal contracting documents (Sources Sought, RFPs, capability statements), combined with secure cloud infrastructure and a user-friendly web interface."
    },
  ];

  return (
    <section className="relative py-20 bg-gray-50 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full opacity-20 -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-200 to-purple-300 rounded-full opacity-20 translate-y-1/2 -translate-x-1/3"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Use a gradient pill */}
          <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-medium text-sm mb-3">
            Questions & Answers
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
        </motion.div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqItems.map((item, index) => (
            <motion.div 
              key={index} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <motion.button
                onClick={() => toggleFaq(index)}
                className="flex justify-between items-center w-full p-5 text-left font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                whileHover={{ backgroundColor: "rgba(249, 250, 251, 1)" }}
                whileTap={{ scale: 0.99 }}
              >
                <span>{item.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                </motion.div>
              </motion.button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-2 text-gray-600">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Still have questions? CTA */}
        <motion.div 
          className="mt-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="p-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg text-center md:text-left md:flex md:items-center md:justify-between">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h3 className="text-xl font-bold text-white mb-2">Still have questions?</h3>
              <p className="text-blue-100">
                We&apos;d love to hear from you. Reach out and our team will get back to you promptly.
              </p>
            </div>
            <motion.div 
              className="md:w-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/contact" className="inline-flex items-center px-6 py-3 bg-white hover:bg-gray-100 text-indigo-700 font-medium rounded-full transition-colors shadow-md">
                Contact Us
                <EnvelopeIcon className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 