'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className={`pt-32 pb-20 bg-gradient-to-b from-blue-50 to-white transition-all duration-1000 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="bg-blue-100 text-blue-700 font-medium rounded-full px-4 py-1 inline-block text-sm mb-6">
              Stop Chasing. Start Winning.
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-gray-900 mb-6">
              Win Federal Contracts <span className="text-blue-600">Before</span> They're Even Written
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              While your competitors react to finalized RFPs, GovCon Agent helps you shape requirements in the pre-solicitation phase—doubling your win rate and slashing response time by 80%.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/roi-calculator" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-center">
                Calculate Your Savings
              </Link>
            </div>
            <div className="mt-6 text-gray-500 italic text-sm">
              Experience the future of federal contracting with GovCon Agent's innovative AI-powered approach.
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-100 text-green-700 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-lg font-semibold">80% Less Time</div>
                  <div className="text-gray-500">From opportunity discovery to response</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green-100 text-green-700 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-lg font-semibold">2x Higher Win Rate</div>
                  <div className="text-gray-500">By influencing requirements early</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="bg-green-100 text-green-700 p-3 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <div className="text-lg font-semibold">10x+ ROI</div>
                  <div className="text-gray-500">Based on time savings and win rate</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -z-10 top-8 left-8 right-8 bottom-8 bg-blue-600 rounded-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  )
} 