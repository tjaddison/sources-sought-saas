'use client'

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// --- WARNING: INSECURE DEMO AUTH ---
const DEMO_USER = 'demo@govwin.ai';
const DEMO_PASS = 'password';
// --- DO NOT USE IN PRODUCTION ---

// Simple Lock Icon
// const LockIcon = () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
// Simple User Icon
// const UserIcon = () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;


export default function LoginPage() {
  const [email, setEmail] = useState(DEMO_USER);
  const [password, setPassword] = useState(DEMO_PASS);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      if (email === DEMO_USER && password === DEMO_PASS) {
        Cookies.set('demo_authenticated', 'true', { expires: 1 });
        router.push('/dashboard');
      } else {
        setError('Invalid credentials. Use demo@govwin.ai / password');
        setLoading(false);
      }
    }, 500);
  };

  return (
    // Add a subtle gradient background
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Increase shadow, add slight border */}
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-xl shadow-lg border border-gray-200">
        <div>
           <div className="flex items-center justify-center mb-5">
             {/* Slightly larger logo */}
             <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
               <rect width="32" height="32" rx="8" fill="#2563EB"/>
               <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>
             <span className="text-3xl font-bold text-gray-900">GovBiz Agent</span>
           </div>
          <h2 className="mt-6 text-center text-2xl font-semibold text-gray-800">
            Sign in to Demo
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            (Use <code className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">demo@govwin.ai</code> / <code className="bg-gray-200 px-1.5 py-0.5 rounded text-xs">password</code>)
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          {/* Add relative positioning for potential icons */}
          <div className="space-y-4">
            <div className="relative">
               {/* Optional: Add icon inside input */}
               {/* <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                 <UserIcon />
               </span> */}
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                // Add more padding, rounded corners, improved focus
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-150 ease-in-out"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="relative">
               {/* Optional: Add icon inside input */}
               {/* <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                 <LockIcon />
               </span> */}
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                // Add more padding, rounded corners, improved focus
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-150 ease-in-out"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {error && (
            // Style error message more clearly
            <div className="bg-red-50 border-l-4 border-red-400 p-3 mt-4 rounded-md">
                <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              // Add transition, slightly larger text, more padding
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : 'Sign in'}
            </button>
          </div>
        </form>
         <div className="text-sm text-center text-gray-600">
            <Link href="/" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
              ← Back to main site
            </Link>
          </div>
      </div>
    </div>
  );
} 