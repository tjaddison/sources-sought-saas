import Link from 'next/link'

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pricing That Scales With Your Federal Contracting Goals
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Transparent pricing aligned with your contract pursuit strategy
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Pathfinder Plan */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Pathfinder</h3>
            <div className="flex items-baseline mb-6">
              <span className="text-4xl font-bold text-gray-900">$997</span>
              <span className="text-gray-600 ml-2">/month</span>
            </div>
            <p className="text-gray-700 italic mb-6">Perfect for small businesses with targeted agency focus</p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Up to 3 capability profiles</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>50 active opportunity tracks</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Weekly opportunity digest</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Basic response templates</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Email and chat support</span>
              </li>
            </ul>
            
            <p className="text-sm text-gray-600 mb-8">
              <strong>Best for:</strong> Small businesses pursuing up to $5M in annual federal contracts
            </p>
            
            <Link 
              href="#access" 
              className="block w-full py-3 px-4 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 transition-colors"
            >
              Request Access
            </Link>
          </div>
          
          {/* Accelerator Plan */}
          <div className="bg-white rounded-2xl p-8 border-2 border-blue-600 shadow-xl relative transform md:-translate-y-4">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-sm font-bold py-1 px-4 rounded-full">
              MOST POPULAR
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Accelerator</h3>
            <div className="flex items-baseline mb-6">
              <span className="text-4xl font-bold text-gray-900">$2,497</span>
              <span className="text-gray-600 ml-2">/month</span>
            </div>
            <p className="text-gray-700 italic mb-6">Ideal for established contractors expanding their federal footprint</p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Up to 10 capability profiles</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Unlimited opportunity tracking</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Daily opportunity alerts</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Advanced response generation</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Pipeline analytics and reporting</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Priority support and quarterly strategy sessions</span>
              </li>
            </ul>
            
            <p className="text-sm text-gray-600 mb-8">
              <strong>Best for:</strong> Mid-sized contractors pursuing $5M-$50M in annual federal contracts
            </p>
            
            <Link 
              href="#access" 
              className="block w-full py-3 px-4 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700 transition-colors"
            >
              Request Access
            </Link>
          </div>
          
          {/* Enterprise Plan */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
            <div className="flex items-baseline mb-6">
              <span className="text-2xl font-bold text-gray-900">Custom Pricing</span>
            </div>
            <p className="text-gray-700 italic mb-6">Comprehensive solution for large federal contractors</p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Unlimited capability profiles</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Multi-user collaboration</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Custom opportunity scoring models</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>CRM/BD system integration</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-blue-600 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Dedicated success manager</span>
              </li>
            </ul>
            
            <p className="text-sm text-gray-600 mb-8">
              <strong>Best for:</strong> Large contractors pursuing $50M+ in annual federal contracts
            </p>
            
            <Link 
              href="#demo" 
              className="block w-full py-3 px-4 border border-blue-600 text-blue-600 text-center rounded-md hover:bg-blue-50 transition-colors"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
        
        <p className="text-center text-gray-600 mt-8">Annual billing discounts available. Contact sales for details.</p>
      </div>
    </section>
  )
} 