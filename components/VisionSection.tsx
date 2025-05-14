'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function VisionSection() {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <section 
      className={`py-24 bg-gradient-to-b from-white via-white to-blue-50 transition-all duration-1000 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
            Disrupting Federal Contracting
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            While most contractors chase RFPs with low win rates, our platform helps you discover and influence requirements before they're finalized.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Left column - Vision and Mission */}
          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white mr-3">1</span>
                The Problem
              </h3>
              <p className="text-gray-700 leading-relaxed pl-11">
                Federal contractors waste countless hours manually searching for opportunities and creating repetitive responses. Pre-solicitation engagement is critical, yet many lack the resources to effectively participate in this crucial phase.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white mr-3">2</span>
                Our Mission
              </h3>
              <p className="text-gray-700 leading-relaxed pl-11">
                We&apos;re transforming how contractors discover and respond to federal opportunities by automating repetitive processes, saving time and resources while improving win rates on contracts that align with their capabilities.
              </p>
            </div>
          </div>
          
          {/* Right column - Future and How */}
          <div className="space-y-12">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white mr-3">3</span>
                The Future We See
              </h3>
              <p className="text-gray-700 leading-relaxed pl-11">
                A contracting ecosystem where AI helps businesses of all sizes engage effectively with government agencies, democratizing access to advanced tools and creating a more competitive and innovative marketplace.
              </p>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white mr-3">4</span>
                How We&apos;ll Get There
              </h3>
              <p className="text-gray-700 leading-relaxed pl-11">
                We&apos;re building an AI-powered platform that automates opportunity discovery, analyzes fit, generates tailored responses, and provides strategic insights—focusing on the most impactful pre-solicitation phase.
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-16">
          <Link 
            href="/features"
            className="inline-flex items-center px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors group"
          >
            <span>Learn More About Our Features</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
} 