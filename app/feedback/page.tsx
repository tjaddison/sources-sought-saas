import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function FeedbackPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Share Your Feedback
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We value your insights and suggestions to improve GovBiz Agent
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 mb-12">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@company.com"
                />
              </div>
              
              <div>
                <label htmlFor="feedbackType" className="block text-sm font-medium text-gray-700 mb-1">
                  Feedback Type
                </label>
                <select 
                  id="feedbackType" 
                  name="feedbackType"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a category</option>
                  <option value="feature">Feature Request</option>
                  <option value="bug">Bug Report</option>
                  <option value="improvement">Improvement Suggestion</option>
                  <option value="experience">User Experience</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Feedback
                </label>
                <textarea
                  id="feedback"
                  name="feedback"
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Please describe your feedback in detail..."
                ></textarea>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="remember" className="text-gray-600">
                    I&apos;m open to being contacted about my feedback
                  </label>
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                Submit Feedback
              </button>
            </form>
            
            <p className="mt-6 text-sm text-gray-500 text-center">
              By submitting this form, you agree to our <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
            </p>
          </div>
          
          <div className="text-center bg-blue-50 p-8 rounded-xl border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Ready to try GovBiz Agent?
            </h2>
            <p className="text-gray-700 mb-6">
              Experience the full power of GovBiz Agent with one of our carefully designed plans
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/roi-calculator" className="px-6 py-3 bg-white border border-blue-600 text-blue-700 hover:bg-blue-50 font-semibold rounded-lg transition-colors">
                Calculate Your ROI First
              </Link>
              <Link href="/pricing" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                View Pricing Plans
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
} 