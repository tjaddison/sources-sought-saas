import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

// Simple SVG check icon component
const CheckIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
  </svg>
)

// Simple SVG X mark icon component
const XMarkIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
  </svg>
)

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 pb-20">
        {/* Pricing Header Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the plan that&apos;s right for your federal contracting needs.
              All plans include our core AI-powered opportunity matching.
            </p>
          </div>
        </section>
        
        {/* Pricing Tiers */}
        <section className="py-16" id="pricing">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Scout Tier */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Scout</h2>
                  <p className="text-gray-600 mb-4">Perfect for solopreneurs or those just getting started with federal contracting</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">$19</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <Link href="/waitlist" className="block w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg text-center transition-colors">
                    Join Waitlist
                  </Link>
                </div>
                
                <div className="border-t border-gray-200 px-6 py-4">
                  <h3 className="font-medium text-gray-900 mb-3">Features:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">3 saved search profiles</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">10 AI-matched notices weekly</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">Basic AI summaries</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">3 AI-assisted email drafts/month</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Agent Pro Tier - Most Popular */}
              <div className="bg-white rounded-xl shadow-md border-2 border-blue-500 overflow-hidden transform hover:shadow-xl transition-all">
                <div className="bg-blue-500 py-2 text-center">
                  <span className="text-white text-sm font-medium">MOST POPULAR</span>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Agent Pro</h2>
                  <p className="text-gray-600 mb-4">For businesses serious about federal contracting</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">$99</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <Link href="/waitlist" className="block w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-center transition-colors">
                    Join Waitlist
                  </Link>
                </div>
                
                <div className="border-t border-gray-200 px-6 py-4">
                  <h3 className="font-medium text-gray-900 mb-3">Everything in Scout, plus:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">Unlimited search profiles</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">Unlimited AI-matched notices</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">Detailed AI analysis & fit scoring</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">25 AI-assisted email drafts/month</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">Basic pipeline tracking</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">Company capability statement upload</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Strategist Suite Tier */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Strategist Suite</h2>
                  <p className="text-gray-600 mb-4">For teams and businesses with advanced needs</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">$299</span>
                    <span className="text-gray-600">/month</span>
                    <p className="text-sm text-gray-500 mt-1">Includes up to 5 team members</p>
                  </div>
                  <Link href="/waitlist" className="block w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg text-center transition-colors">
                    Join Waitlist
                  </Link>
                </div>
                
                <div className="border-t border-gray-200 px-6 py-4">
                  <h3 className="font-medium text-gray-900 mb-3">Everything in Agent Pro, plus:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">Team collaboration features</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">Advanced analytics on opportunities</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">Customizable email templates</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">Basic RFP Prep Agent access</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">Basic Compliance Check Agent</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Enterprise Copilot Tier */}
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Enterprise Copilot</h2>
                  <p className="text-gray-600 mb-4">For larger organizations with specialized needs</p>
                  <div className="mb-6">
                    <span className="text-2xl font-bold text-gray-900">Custom Pricing</span>
                    <p className="text-sm text-gray-500 mt-1">Tailored to your organization</p>
                  </div>
                  <Link href="/contact" className="block w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg text-center transition-colors">
                    Contact Us
                  </Link>
                </div>
                
                <div className="border-t border-gray-200 px-6 py-4">
                  <h3 className="font-medium text-gray-900 mb-3">Everything in Strategist, plus:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">Unlimited users</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">Full access to all agents</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">API access</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">Custom integrations</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">Dedicated account manager</span>
                    </li>
                    <li className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">Advanced security features</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Detailed Feature Comparison
            </h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden shadow">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feature</th>
                    <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Scout</th>
                    <th className="py-3 px-6 text-center text-xs font-medium text-blue-600 uppercase tracking-wider">Agent Pro</th>
                    <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Strategist Suite</th>
                    <th className="py-3 px-6 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Enterprise Copilot</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">Saved Search Profiles</td>
                    <td className="py-4 px-6 text-sm text-gray-500 text-center">3</td>
                    <td className="py-4 px-6 text-sm text-gray-500 text-center">Unlimited</td>
                    <td className="py-4 px-6 text-sm text-gray-500 text-center">Unlimited</td>
                    <td className="py-4 px-6 text-sm text-gray-500 text-center">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">AI-Matched Notices</td>
                    <td className="py-4 px-6 text-sm text-gray-500 text-center">10/week</td>
                    <td className="py-4 px-6 text-sm text-gray-500 text-center">Unlimited</td>
                    <td className="py-4 px-6 text-sm text-gray-500 text-center">Unlimited</td>
                    <td className="py-4 px-6 text-sm text-gray-500 text-center">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">AI-Assisted Email Drafts</td>
                    <td className="py-4 px-6 text-sm text-gray-500 text-center">3/month</td>
                    <td className="py-4 px-6 text-sm text-gray-500 text-center">25/month</td>
                    <td className="py-4 px-6 text-sm text-gray-500 text-center">50/month</td>
                    <td className="py-4 px-6 text-sm text-gray-500 text-center">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">Pipeline Tracking</td>
                    <td className="py-4 px-6 text-center">
                      <XMarkIcon className="h-5 w-5 text-gray-400 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <CheckIcon className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <CheckIcon className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <CheckIcon className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">Capability Statement Upload</td>
                    <td className="py-4 px-6 text-center">
                      <XMarkIcon className="h-5 w-5 text-gray-400 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <CheckIcon className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <CheckIcon className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <CheckIcon className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">Team Collaboration</td>
                    <td className="py-4 px-6 text-center">
                      <XMarkIcon className="h-5 w-5 text-gray-400 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <XMarkIcon className="h-5 w-5 text-gray-400 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <CheckIcon className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <CheckIcon className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">Additional AI Agents</td>
                    <td className="py-4 px-6 text-center">
                      <XMarkIcon className="h-5 w-5 text-gray-400 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <XMarkIcon className="h-5 w-5 text-gray-400 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 text-center">Basic</td>
                    <td className="py-4 px-6 text-sm text-gray-500 text-center">Full Access</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">API Access & Custom Integrations</td>
                    <td className="py-4 px-6 text-center">
                      <XMarkIcon className="h-5 w-5 text-gray-400 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <XMarkIcon className="h-5 w-5 text-gray-400 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <XMarkIcon className="h-5 w-5 text-gray-400 mx-auto" />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <CheckIcon className="h-5 w-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        
        {/* ROI Calculator CTA */}
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Calculate Your Potential Savings
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Use our ROI calculator to see how much time and money your organization could save by using GovBiz Agent.
            </p>
            <Link href="/roi-calculator" className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              Try Our ROI Calculator
            </Link>
          </div>
        </section>
        
        {/* Pricing FAQ */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Can I change plans later?</h3>
                <p className="text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Is there a free trial?</h3>
                <p className="text-gray-600">
                  We offer a 14-day free trial for all paid plans. You can test the features that matter most to you before committing.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What payment methods do you accept?</h3>
                <p className="text-gray-600">
                  We accept all major credit cards, ACH transfers, and purchase orders for government agencies and large enterprises.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Are there any long-term contracts?</h3>
                <p className="text-gray-600">
                  No. All plans are month-to-month with no long-term commitment. Annual options with discounts are available upon request.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Federal Contracting Process?</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Join our waitlist today to be among the first to experience GovBiz Agent when we launch.
            </p>
            <Link href="/waitlist" className="inline-block px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 font-medium rounded-lg transition-colors text-lg shadow-md">
              Join the Waitlist
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
} 