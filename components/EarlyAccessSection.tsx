'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRightIcon, BeakerIcon, UserGroupIcon, LightBulbIcon } from '@heroicons/react/24/outline'

export default function EarlyAccessSection() {
  const benefits = [
    {
      icon: <BeakerIcon className="h-6 w-6" />,
      title: "Test Prototypes",
      description: "Get early access to our AI-powered tools and provide feedback that shapes the product."
    },
    {
      icon: <UserGroupIcon className="h-6 w-6" />,
      title: "Join Our Community",
      description: "Connect with other forward-thinking federal contractors in our early access community."
    },
    {
      icon: <LightBulbIcon className="h-6 w-6" />,
      title: "Influence Development",
      description: "Your feedback directly influences our product roadmap and feature prioritization."
    }
  ];

  return (
    <section id="early-access" className="relative py-20 bg-gradient-to-b from-white to-blue-50 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-gray-50 to-white"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-30"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full opacity-30"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium text-sm mb-3">
              Limited Spots Available
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Join Our Early Access Program
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're looking for federal contractors who want to help shape the future of AI-powered opportunity discovery and response.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-full mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl overflow-hidden shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="p-8 md:p-12 relative">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/3"></div>
              
              <div className="md:flex items-center justify-between relative z-10">
                <div className="md:w-2/3 mb-8 md:mb-0">
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Apply for the Early Access Program
                  </h3>
                  <p className="text-indigo-100">
                    We're selecting a limited number of federal contractors to join our early access program. Apply now to be considered for this exclusive opportunity.
                  </p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    href="/waitlist?ref=early-access" 
                    className="inline-flex items-center px-6 py-3 bg-white text-indigo-700 font-medium rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  >
                    Apply Now
                    <ArrowRightIcon className="ml-2 w-5 h-5" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 