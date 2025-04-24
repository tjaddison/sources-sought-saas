'use client' // This component needs interactivity, so mark it as a Client Component

import { useState, FormEvent } from 'react';

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState(''); // Optional field
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    if (!email || !name) {
        setStatus('error');
        setMessage('Please fill in your name and email address.');
        return;
    }

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          company,
          role,
          submittedAt: new Date().toISOString(), // Add a timestamp
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle errors from the API (e.g., validation errors, server errors)
        throw new Error(data.message || 'Something went wrong.');
      }

      // Success!
      setStatus('success');
      setMessage('Thank you for joining the waitlist! We\'ll be in touch.');
      setEmail(''); // Clear form on success
      setName('');
      setCompany('');
      setRole('');

    } catch (error: unknown) {
      setStatus('error');
      // Type assertion or check needed before accessing properties
      let message = 'Failed to submit the form. Please try again.';
      if (error instanceof Error) {
          message = error.message;
      } else if (typeof error === 'string') {
          message = error;
      }
      setMessage(message);
      console.error("Waitlist form error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Jane Doe"
          disabled={status === 'loading'}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address <span className="text-red-600">*</span>
        </label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="you@company.com"
          disabled={status === 'loading'}
        />
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
          Company Name (Optional)
        </label>
        <input
          type="text"
          name="company"
          id="company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Acme Corporation"
          disabled={status === 'loading'}
        />
      </div>

       <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
          Your Role (Optional)
        </label>
        <input
          type="text"
          name="role"
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="e.g., Business Development, CEO, Capture Manager"
          disabled={status === 'loading'}
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={status === 'loading' || status === 'success'}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
            ${status === 'loading' ? 'bg-gray-400 cursor-not-allowed' : ''} 
            ${status === 'success' ? 'bg-green-500 cursor-not-allowed' : ''}
            ${status !== 'loading' && status !== 'success' ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' : ''}
            transition duration-150 ease-in-out`}
        >
          {status === 'loading' ? 'Submitting...' : (status === 'success' ? 'Submitted!' : 'Join Waitlist Now')}
        </button>
      </div>

      {/* Status Messages */}
      {message && (
        <div className={`text-sm text-center p-3 rounded-md ${
          status === 'success' ? 'bg-green-100 text-green-800' : ''
        } ${
          status === 'error' ? 'bg-red-100 text-red-800' : ''
        }`}>
          {message}
        </div>
      )}
    </form>
  );
} 