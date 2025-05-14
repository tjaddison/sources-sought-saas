'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function ValueProposition() {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 600)
    
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className={`py-20 transition-all duration-1000 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      <div className="container mx-auto px-6 max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
          The Key to Federal Contract Success: <span className="text-blue-600">Pre-Solicitation Influence</span>
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 border border-gray-200 rounded-xl bg-white hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold">The Problem</h3>
            </div>
            <p className="text-gray-700">
              Federal contractors waste <span className="font-medium">hundreds of hours</span> manually searching for opportunities and responding with repetitive information—typically with only a 10-15% win rate.
            </p>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-xl bg-white hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold">The Insight</h3>
            </div>
            <p className="text-gray-700">
              Contractors who influence requirements during Sources Sought notices are <span className="font-medium">3x more likely to win</span> the subsequent contract, yet few have the resources to engage at this stage.
            </p>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-xl bg-white hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold">Our Solution</h3>
            </div>
            <p className="text-gray-700">
              GovBiz Agent uses AI to discover opportunities, analyze fit, generate tailored responses, and shape requirements to your advantage—<span className="font-medium">all with 80% less time investment</span>.
            </p>
          </div>
        </div>

        <div className="text-center mt-10">
          <Link href="/pricing" className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            Choose a Plan
          </Link>
        </div>
      </div>
    </section>
  )
} 