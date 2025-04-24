'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/solid'

export default function MarketValidationSection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div 
          className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/3"></div>
          
          {/* Animated dots */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full opacity-20"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.1, 0.3, 0.1],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            {/* Text Content */}
            <div className="md:w-2/3 text-center md:text-left mb-6 md:mb-0">
              <motion.h3 
                className="text-3xl font-bold text-white mb-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
              >
                Help Us Build the Right Tool
              </motion.h3>
              <motion.p 
                className="text-lg text-blue-100 mb-6"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                viewport={{ once: true }}
              >
                We're actively seeking feedback from federal contractors like you. Join our early access program to test prototypes and directly influence our development roadmap.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/waitlist#early-access" className="inline-flex items-center px-6 py-3 bg-white hover:bg-gray-100 text-indigo-700 font-medium rounded-full transition-colors shadow-md">
                  Apply for Early Access
                  <ArrowRightIcon className="ml-2 w-5 h-5" />
                </Link>
              </motion.div>
            </div>

            {/* Illustration/Icon */}
            <motion.div 
              className="md:w-1/3 flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            >
              <svg className="w-48 h-48 text-blue-300" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10" strokeOpacity="0.6"/>
                <circle cx="100" cy="100" r="60" fill="currentColor" fillOpacity="0.1"/>
                <circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4"/>
                <circle cx="100" cy="100" r="20" fill="currentColor" fillOpacity="0.2"/>
                
                {/* Animated elements */}
                <motion.circle 
                  cx="100" cy="60" r="8" 
                  fill="white" 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.circle 
                  cx="140" cy="100" r="8" 
                  fill="white" 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <motion.circle 
                  cx="100" cy="140" r="8" 
                  fill="white" 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
                <motion.circle 
                  cx="60" cy="100" r="8" 
                  fill="white" 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                />
                
                <motion.path 
                  d="M100 40 L100 60" 
                  stroke="white" 
                  strokeWidth="2"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.path 
                  d="M160 100 L140 100" 
                  stroke="white" 
                  strokeWidth="2"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <motion.path 
                  d="M100 160 L100 140" 
                  stroke="white" 
                  strokeWidth="2"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
                <motion.path 
                  d="M40 100 L60 100" 
                  stroke="white" 
                  strokeWidth="2"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 