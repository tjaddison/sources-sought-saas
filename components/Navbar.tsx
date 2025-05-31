'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useUser } from '@auth0/nextjs-auth0'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isLoading } = useUser()

  const navLinks = [
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'ROI Calculator', href: '/roi-calculator' },
  ]

  return (
    <nav className="bg-white py-4 fixed w-full z-50 border-b border-gray-100 backdrop-blur-md bg-white/90">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              {/* Minimalist Logo SVG */}
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                <rect width="32" height="32" rx="8" fill="#2563EB"/>
                <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xl font-bold text-gray-900">GovCon Agent</span>
            </Link>
            
            <div className="hidden lg:flex items-center ml-10 space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-600 hover:text-blue-600"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/pricing" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
              Choose a Plan
            </Link>
            {!isLoading && (
              user ? (
                <div className="flex items-center space-x-3">
                  <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg transition-colors">
                    Dashboard
                  </Link>
                  <div className="flex items-center space-x-2">
                    {user.picture && (
                      <Image src={user.picture} alt="Profile" width={32} height={32} className="w-8 h-8 rounded-full" />
                    )}
                    <span className="text-gray-700">{user.name}</span>
                  </div>
                  <a href="/auth/logout" className="text-gray-700 hover:text-blue-600 border border-gray-300 px-4 py-2 rounded-lg transition-colors">
                    Logout
                  </a>
                </div>
              ) : (
                <a href="/auth/login" className="text-gray-700 hover:text-blue-600 border border-gray-300 px-4 py-2 rounded-lg transition-colors">
                  Login
                </a>
              )
            )}
          </div>
          
          <button 
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden mt-4 bg-white rounded-lg shadow-lg p-6 absolute left-6 right-6 animate-fade-in">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-600 hover:text-blue-600 py-2"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-gray-200" />
              <Link href="/pricing" onClick={() => setIsOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-center">Choose a Plan</Link>
              {!isLoading && (
                user ? (
                  <>
                    <Link href="/dashboard" onClick={() => setIsOpen(false)} className="border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg text-center">Dashboard</Link>
                    <a href="/auth/logout" onClick={() => setIsOpen(false)} className="border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg text-center">Logout</a>
                  </>
                ) : (
                  <a href="/auth/login" onClick={() => setIsOpen(false)} className="border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-lg text-center">Login</a>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 