import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import FeatureSpotlightSection from '@/components/FeatureSpotlightSection'

// Define an interface for feature details (optional but good practice)
interface FeatureDetail {
  title: string;
  description: string;
  icon: JSX.Element; // Using JSX element for the icon
}

// Commented out unused variable. Remove if definitely not needed.
/*
const plannedFeatures: FeatureDetail[] = [
  {
    title: 'Intelligent Opportunity Matching',
    description: 'Leveraging AI trained on your company profile (capabilities, past performance, set-asides), GovBiz Agent will proactively identify and score Sources Sought notices from SAM.gov and other sources, prioritizing those with the highest win probability for your specific business.',
    icon: <svg className="w-8 h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>,
  },
  {
    title: 'Automated Requirements Analysis',
    description: 'Save hours of manual review. Our AI will automatically parse lengthy Sources Sought documents to extract and summarize key information: core requirements, evaluation criteria, response deadlines, agency contacts, potential competitors, and required submission formats.',
    icon: <svg className="w-8 h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
  },
  {
    title: 'AI-Assisted Response Generation',
    description: 'Get a head start on crafting compelling responses. Based on the analyzed requirements and your company profile, GovBiz Agent will help generate tailored response outlines, capability statement drafts, and compliance matrices, significantly reducing initial drafting time.',
    icon: <svg className="w-8 h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  },
  {
    title: 'Pipeline Management & Tracking',
    description: 'Visualize and manage your Sources Sought pipeline from discovery to submission. Track status, assign tasks, store documents, and monitor deadlines within a dedicated, user-friendly interface.',
    icon: <svg className="w-8 h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  },
   {
    title: 'Competitive Intelligence Insights',
    description: 'Gain insights into potential competitors who might respond to the same Sources Sought notices. Understand their past performance and capabilities related to the opportunity (based on publicly available data).',
    icon: <svg className="w-8 h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
  },
   {
    title: 'Collaboration Tools',
    description: 'Facilitate teamwork on Sources Sought responses. Allow multiple users to view opportunities, share notes, assign tasks, and track progress within the platform.',
    icon: <svg className="w-8 h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h2m6-4h2a2 2 0 012 2v6a2 2 0 01-2 2h-2" /></svg>,
  },
];
*/

// Simple SVG Icons for Workflow Steps (Replace with more specific icons if desired)
const ProfileIcon = () => <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const SearchIcon = () => <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const ListIcon = () => <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const EditIcon = () => <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const CheckIcon = () => <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

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
                GovBiz Agent combines AI-powered opportunity discovery with strategic insights to help you win contracts before they're even written.
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
              Our ROI Calculator will show you exactly how GovBiz Agent can transform your federal contracting approach.
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