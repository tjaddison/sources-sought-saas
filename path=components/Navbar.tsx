import React, { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  // Define the navigation links array
  const navLinks = [
    { name: 'Features', href: '/features' },
    { name: 'Vision', href: '/vision' },
    // { name: 'About', href: '/about' }, // Example: Uncomment if you have an About page
    { name: 'Feedback', href: '/feedback' },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-md py-4 fixed w-full z-50 border-b border-gray-100">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              {/* Minimalist Logo SVG */}
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                <rect width="32" height="32" rx="8" fill="#2563EB"/> {/* Blue-600 */}
                <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-xl font-bold text-gray-900">GovBiz Agent</span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
            <Link href="/waitlist" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-5 rounded-lg font-medium transition-colors shadow-sm">
              Join Waitlist
            </Link>
            <Link href="/login" className="border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-5 rounded-lg font-medium transition-colors">
              Demo Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-600 hover:text-blue-600 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {/* Hamburger/Close Icon */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="lg:hidden mt-4 bg-white rounded-lg shadow-xl p-6 absolute left-6 right-6 border border-gray-100 animate-fade-in">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-700 hover:text-blue-600 py-2 font-medium text-center"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-gray-200 my-2" />
              <Link href="/waitlist" onClick={() => setIsOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg text-center font-medium shadow-sm">Join Waitlist</Link>
              <Link href="/login" onClick={() => setIsOpen(false)} className="border border-gray-300 text-gray-700 hover:bg-gray-50 py-2.5 px-4 rounded-lg text-center font-medium">Demo Login</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 