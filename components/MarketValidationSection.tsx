export default function MarketValidationSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-600 font-medium text-sm mb-3">
            Market Opportunity
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why We&apos;re Building GovBiz Agent
          </h2>
          <p className="text-xl text-gray-600">
            Federal contracting is a $650B market with significant inefficiencies we believe AI can solve.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-xl p-8">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                <svg className="w-8 h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Opportunity Gap</h3>
            </div>
            <p className="text-gray-600">
              Sources Sought notices receive <span className="font-medium">60% fewer responses</span> than RFPs, creating a significant competitive advantage for proactive contractors.
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-8">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                <svg className="w-8 h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Market Research</h3>
            </div>
            <p className="text-gray-600">
              Our interviews with <span className="font-medium">50+ small business contractors</span> revealed consistent challenges in discovering and responding to pre-solicitation notices.
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-8">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-full p-3 mr-4">
                <svg className="w-8 h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">AI Advantage</h3>
            </div>
            <p className="text-gray-600">
              Recent AI advancements make it possible to analyze complex government requirements and generate compliant responses with <span className="font-medium">85% less time investment</span>.
            </p>
          </div>
        </div>
        
        <div className="mt-16 bg-blue-50 rounded-xl p-8 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Help Us Shape the Product
              </h3>
              <p className="text-gray-700 mb-4">
                We&apos;re looking for federal contractors to join our early access program and provide feedback on our prototype. Your input will directly influence our development roadmap.
              </p>
              <a href="/waitlist" className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                Apply for Early Access
                <svg className="ml-2 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
            <div className="md:w-1/3">
              <svg className="w-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 0C155.228 0 200 44.7715 200 100C200 155.228 155.228 200 100 200C44.7715 200 0 155.228 0 100C0 44.7715 44.7715 0 100 0Z" fill="#DBEAFE" fillOpacity="0.5"/>
                <circle cx="100" cy="100" r="80" stroke="#3B82F6" strokeWidth="2" strokeDasharray="10 10"/>
                <circle cx="100" cy="100" r="40" fill="#DBEAFE"/>
                <path d="M90 90L110 110M110 90L90 110" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="100" cy="60" r="10" fill="#3B82F6"/>
                <circle cx="60" cy="100" r="10" fill="#3B82F6"/>
                <circle cx="100" cy="140" r="10" fill="#3B82F6"/>
                <circle cx="140" cy="100" r="10" fill="#3B82F6"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 