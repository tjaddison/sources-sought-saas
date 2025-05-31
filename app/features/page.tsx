import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'


export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 md:pt-20"> {/* Adjust padding for fixed navbar */}
        
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Features That Transform Federal Contracting
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                GovCon Agent combines AI-powered opportunity discovery with strategic insights to help you win contracts before they're even written.
              </p>
            </div>
          </div>
        </section>
        
        {/* Core Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-16 text-center">
              Core Capabilities
            </h2>
            
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-16">
              {/* Feature 1 */}
              <div className="flex">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Opportunity Discovery</h3>
                  <p className="text-gray-600">
                    Automatically scan and analyze Sources Sought notices from SAM.gov and other portals to identify high-potential opportunities that match your capabilities.
                  </p>
                </div>
              </div>
              
              {/* Feature 2 */}
              <div className="flex">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Fit Analysis & Scoring</h3>
                  <p className="text-gray-600">
                    Our AI evaluates each opportunity against your capabilities, past performance, and ideal customer profile to provide a fit score that helps you focus on winnable contracts.
                  </p>
                </div>
              </div>
              
              {/* Feature 3 */}
              <div className="flex">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Response Generation</h3>
                  <p className="text-gray-600">
                    Generate customized, compelling responses to Sources Sought notices in minutes instead of hours. Our AI pulls from your past performance and capabilities to craft tailored submissions.
                  </p>
                </div>
              </div>
              
              {/* Feature 4 */}
              <div className="flex">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Pre-RFP Influence Strategy</h3>
                  <p className="text-gray-600">
                    Receive strategic guidance on how to influence requirements in your favor, increasing your chances of winning when the formal RFP is released.
                  </p>
                </div>
              </div>
              
              {/* Feature 5 */}
              <div className="flex">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Pipeline Analytics</h3>
                  <p className="text-gray-600">
                    Track your opportunity pipeline from initial discovery through submission and award, with data-driven insights to improve your win rate over time.
                  </p>
                </div>
              </div>
              
              {/* Feature 6 */}
              <div className="flex">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Time-Saving Automation</h3>
                  <p className="text-gray-600">
                    Cut response time by 80% with intelligent workflows that automate repetitive tasks and let you focus on strategic differentiation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Vision Integration Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Disrupting Federal Contracting
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  While most contractors chase RFPs with low win rates, our platform helps you discover and influence requirements before they're finalized.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  We're transforming how contractors engage with government opportunities by focusing on the most impactful part of the procurement process—the pre-solicitation phase.
                </p>
                <p className="text-lg text-gray-600">
                  By democratizing access to advanced AI tools, we help businesses of all sizes compete effectively in the federal marketplace, creating a more competitive and innovative contracting ecosystem.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Our Approach</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold mr-4 mt-1 flex-shrink-0">1</div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Identify Early Opportunities</h4>
                      <p className="text-gray-600">We focus on Sources Sought notices where you can shape requirements rather than chasing finalized RFPs.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold mr-4 mt-1 flex-shrink-0">2</div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Automate Response Creation</h4>
                      <p className="text-gray-600">Our AI generates tailored responses in minutes, saving you dozens of hours per opportunity.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold mr-4 mt-1 flex-shrink-0">3</div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Shape Requirements</h4>
                      <p className="text-gray-600">Strategic guidance helps you influence contracts to align with your unique capabilities.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold mr-4 mt-1 flex-shrink-0">4</div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Win More Contracts</h4>
                      <p className="text-gray-600">By engaging early, you'll double your win rate and establish stronger relationships with contracting officers.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-6">
              See How Much Time & Money You'll Save
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Our ROI Calculator will show you exactly how GovCon Agent can transform your federal contracting approach.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/roi-calculator" className="px-8 py-4 bg-white text-blue-600 hover:bg-blue-50 font-semibold rounded-lg transition-colors">
                Calculate Your ROI
              </Link>
            </div>
          </div>
        </section>
        
      </main>
      <Footer />
    </>
  )
} 