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
    description: 'Leveraging AI trained on your company profile (capabilities, past performance, set-asides), GovWin AI will proactively identify and score Sources Sought notices from SAM.gov and other sources, prioritizing those with the highest win probability for your specific business.',
    icon: <svg className="w-8 h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>,
  },
  {
    title: 'Automated Requirements Analysis',
    description: 'Save hours of manual review. Our AI will automatically parse lengthy Sources Sought documents to extract and summarize key information: core requirements, evaluation criteria, response deadlines, agency contacts, potential competitors, and required submission formats.',
    icon: <svg className="w-8 h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
  },
  {
    title: 'AI-Assisted Response Generation',
    description: 'Get a head start on crafting compelling responses. Based on the analyzed requirements and your company profile, GovWin AI will help generate tailored response outlines, capability statement drafts, and compliance matrices, significantly reducing initial drafting time.',
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
      <main className="pt-16"> {/* Add padding if Navbar is fixed */}
        <div className="py-12 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tighter tracking-tighter mb-4 text-gray-900">
              Core Features
            </h1>
            <p className="text-xl text-gray-600">
              Explore the key capabilities GovWin AI is designed to offer federal contractors.
            </p>
          </div>

          {/* Add the FeatureSpotlightSection here */}
          <FeatureSpotlightSection />

          {/* --- NEW WORKFLOW SECTION --- */}
          <section className="py-16 md:py-24 bg-gray-50 mt-16 md:mt-24">
            <div className="container mx-auto px-6">
              <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  How GovWin AI Works For You
                </h2>
                <p className="text-lg text-gray-600">
                  Our AI-powered workflow simplifies finding and responding to relevant Sources Sought notices.
                </p>
              </div>

              {/* Workflow Steps */}
              <div className="max-w-4xl mx-auto space-y-12">
                {/* Step 1: Profile Setup */}
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="flex-shrink-0 w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center border-4 border-white shadow">
                    <ProfileIcon />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">1. Define Your Company Profile</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Build a comprehensive profile by uploading key documents like <strong className="font-medium text-gray-700">resumes</strong> for key personnel, detailed <strong className="font-medium text-gray-700">capabilities statements</strong>, <strong className="font-medium text-gray-700">past performance descriptions</strong> (including CPARS if available), examples of <strong className="font-medium text-gray-700">past winning proposals</strong>, and relevant <strong className="font-medium text-gray-700">Statements of Work (SOWs)</strong> from previous contracts. Also include relevant NAICS codes, set-aside statuses (like 8(a), WOSB, SDVOSB), and specific areas of expertise. The more comprehensive your profile, the better GovWin AI can identify perfectly matched opportunities.
                    </p>
                  </div>
                </div>

                {/* Step 2: AI-Powered Matching */}
                <div className="flex flex-col md:flex-row-reverse items-center gap-8">
                   <div className="flex-shrink-0 w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center border-4 border-white shadow">
                    <SearchIcon />
                  </div>
                  <div className="flex-1 text-center md:text-right">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">2. Intelligent Opportunity Discovery</h3>
                    <p className="text-gray-600 leading-relaxed">
                      GovWin AI continuously scans SAM.gov and other relevant sources for new Sources Sought notices. Our AI analyzes each notice against your profile, calculating a match score based on requirements, keywords, agency history, and your company&apos;s strengths.
                    </p>
                  </div>
                </div>

                {/* Step 3: Review Prioritized Matches */}
                <div className="flex flex-col md:flex-row items-center gap-8">
                   <div className="flex-shrink-0 w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center border-4 border-white shadow">
                    <ListIcon />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">3. Review & Select Opportunities</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Receive a prioritized list of potential opportunities directly in your dashboard, ranked by match score. Quickly review AI-generated summaries, key dates, and requirements analysis to decide which notices warrant a response.
                    </p>
                  </div>
                </div>

                {/* Step 4: AI-Assisted Response Generation */}
                <div className="flex flex-col md:flex-row-reverse items-center gap-8">
                   <div className="flex-shrink-0 w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center border-4 border-white shadow">
                    <EditIcon />
                  </div>
                  <div className="flex-1 text-center md:text-right">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">4. Draft Your Response with AI</h3>
                    <p className="text-gray-600 leading-relaxed">
                      For selected opportunities, instruct the AI to generate a draft response. It leverages the notice requirements, your profile information, and best practices to create a tailored capability statement or RFI answer outline, saving you significant writing time.
                    </p>
                  </div>
                </div>

                 {/* Step 5: User Review & Submission */}
                <div className="flex flex-col md:flex-row items-center gap-8">
                   <div className="flex-shrink-0 w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center border-4 border-white shadow">
                    <CheckIcon />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-2">5. Finalize and Approve</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Review the AI-generated draft. Edit, refine, and add specific details or nuances as needed using our integrated editor. Once satisfied, approve the final response, ready for submission to the contracting officer.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </section>
          {/* --- END NEW WORKFLOW SECTION --- */}

          {/* --- MOVED "GET INVOLVED" SECTION --- */}
          <section className="py-16 md:py-24 bg-blue-600 text-white">
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Get Involved & Shape the Future</h2>
              <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-10 leading-relaxed">
                We&apos;re building GovWin AI collaboratively with the federal contracting community. Join our early access program or waitlist to provide feedback, influence features, and be among the first to leverage AI for pre-solicitation success.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                 {/* Removed "Join Waitlist" Button */}
                 {/* <Link href="/waitlist" className="inline-block px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 font-medium rounded-lg transition-colors text-lg shadow-md w-full sm:w-auto">
                   Join the Waitlist
                 </Link> */}

                 {/* Keep "Give Feedback" Button */}
                 <Link href="/feedback" className="inline-block px-8 py-4 border border-blue-300 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-lg w-full sm:w-auto">
                   Give Feedback
                 </Link>

                 {/* Add "Become a Founding Member" Button */}
                 <Link href="/waitlist#early-access" // Link to the early access section on the waitlist page
                   className="inline-block px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 font-medium rounded-lg transition-colors text-lg shadow-md w-full sm:w-auto"
                 >
                   Become a Founding Member
                 </Link>
              </div>
            </div>
          </section>
          {/* --- END MOVED SECTION --- */}

          {/* You can add more content specific to the features page below */}
          {/* Example:
          <div className="max-w-6xl mx-auto mt-16">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Detailed Breakdown</h2>
            </div>
          */}
        </div>
      </main>
      <Footer />
    </>
  )
} 