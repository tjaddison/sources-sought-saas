'use client'
import { motion } from 'framer-motion'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

export default function SecretSection() {
  const benefits = [
    "Discover relevant Sources Sought notices before your competitors",
    "Influence contract requirements in your favor",
    "Increase win probability by 3-5x compared to RFPs",
    "Save hours of manual searching and analysis"
  ];

  return (
    <section className="relative py-20 bg-white overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -top-16 -right-16 w-64 h-64 bg-gradient-to-br from-green-200 to-green-400 rounded-full opacity-20"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr from-blue-200 to-indigo-300 rounded-full opacity-10"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Abstract SVG Illustration */}
            <div className="mx-auto max-w-md">
              <svg viewBox="0 0 200 200" className="w-full h-auto">
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
                
                {/* Base circle */}
                <motion.circle 
                  cx="100" cy="100" r="70" 
                  fill="url(#gradient1)" 
                  opacity="0.2"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                
                {/* Decorative elements */}
                <motion.path 
                  d="M60,80 Q100,20 140,80" 
                  stroke="#4F46E5" 
                  strokeWidth="3" 
                  fill="none"
                  animate={{ d: ["M60,80 Q100,20 140,80", "M60,90 Q100,30 140,90", "M60,80 Q100,20 140,80"] }}
                  transition={{ duration: 5, repeat: Infinity }}
                />
                
                <motion.path 
                  d="M60,120 Q100,180 140,120" 
                  stroke="#7C3AED" 
                  strokeWidth="3" 
                  fill="none"
                  animate={{ d: ["M60,120 Q100,180 140,120", "M60,110 Q100,170 140,110", "M60,120 Q100,180 140,120"] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                />
                
                {/* Central icon */}
                <motion.g
                  animate={{ rotate: [0, 5, 0, -5, 0] }}
                  transition={{ duration: 6, repeat: Infinity }}
                >
                  <rect x="85" y="85" width="30" height="30" rx="5" fill="#4F46E5" />
                  <path d="M95 100L100 105L110 95" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </motion.g>
                
                {/* Orbiting dots */}
                <motion.circle 
                  cx="100" cy="40" r="5" 
                  fill="#7C3AED"
                  animate={{ 
                    cx: [100, 140, 100, 60, 100],
                    cy: [40, 100, 160, 100, 40]
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                
                <motion.circle 
                  cx="160" cy="100" r="5" 
                  fill="#4F46E5"
                  animate={{ 
                    cx: [160, 100, 40, 100, 160],
                    cy: [100, 160, 100, 40, 100]
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
              </svg>
            </div>
          </motion.div>
          
          <motion.div 
            className="lg:w-1/2 space-y-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-medium text-sm">
              Our Vision
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Disrupting Federal Contracting
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              While most contractors will continue chasing RFPs with low win probabilities, our platform will help you discover and influence contract requirements before they&apos;re finalized.
            </p>
            
            <div className="mt-8 space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
} 