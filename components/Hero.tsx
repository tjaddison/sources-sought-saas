'use client'
import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'
// Keep ImageFallback import if you plan to use it later, otherwise remove it.
// import ImageFallback from './ImageFallback'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-600 text-white py-32">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white opacity-5 rounded-full"></div>
        <div className="absolute top-1/2 -left-24 w-64 h-64 bg-white opacity-5 rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-white opacity-5 rounded-full"></div>
        
        {/* Animated dots grid */}
        <div className="absolute inset-0 grid grid-cols-12 gap-4 p-8 opacity-10">
          {Array.from({ length: 60 }).map((_, i) => (
            <motion.div 
              key={i}
              className="w-2 h-2 bg-white rounded-full"
              initial={{ opacity: 0.1 }}
              animate={{ 
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                delay: i * 0.05 % 2
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-blue-200">
              Win More Federal Contracts with AI
            </span>
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            GovWin AI helps you discover, analyze, and respond to Sources Sought notices with confidence and speed.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            href="/waitlist"
            className="inline-flex items-center bg-white text-indigo-700 px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition shadow-lg"
          >
            Join the Waitlist
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
        
        {/* Floating badge */}
        <motion.div 
          className="absolute top-10 right-10 md:right-20 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        >
          Early Access Available!
        </motion.div>
      </div>
    </section>
  )
} 