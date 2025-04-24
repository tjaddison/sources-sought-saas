import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function VisionPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20"> {/* Add padding-top to account for fixed navbar */}

        {/* Vision Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20 md:py-32">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Our Vision: <span className="text-blue-600">Smarter Federal Contracting</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We&apos;re building GovWin AI to empower federal contractors, especially small businesses, by leveraging artificial intelligence to navigate the complexities of the pre-solicitation landscape and win more opportunities.
            </p>
            <div className="mt-10">
              <Link href="/waitlist" className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-lg shadow-md">
                Join the Waitlist & Shape the Future
              </Link>
            </div>
          </div>
        </section>

        {/* The Problem Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">The Challenge in Federal Contracting</h2>
              <p className="text-lg text-gray-600">
                Winning federal contracts is increasingly competitive. Many contractors, particularly smaller firms, struggle with the time-consuming process of finding relevant opportunities early, analyzing complex documents, and crafting compelling responses, especially for crucial Sources Sought notices.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="p-6 border border-gray-200 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Information Overload</h3>
                <p className="text-gray-600">Manually sifting through numerous government portals for the right Sources Sought notices is inefficient and prone to missed opportunities.</p>
              </div>
              <div className="p-6 border border-gray-200 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Time-Intensive Analysis</h3>
                <p className="text-gray-600">Quickly understanding requirements, evaluation criteria, and agency needs from dense documents requires significant effort.</p>
              </div>
              <div className="p-6 border border-gray-200 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Strategic Disadvantage</h3>
                <p className="text-gray-600">Larger firms often have dedicated resources, putting smaller businesses at a disadvantage in the crucial early stages of procurement.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Solution Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our AI-Powered Solution</h2>
              <p className="text-lg text-gray-600">
                GovWin AI aims to address these challenges head-on by providing intelligent tools designed specifically for the pre-solicitation phase.
              </p>
            </div>
            <div className="space-y-12 max-w-4xl mx-auto">
              {/* Feature 1 */}
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/3 text-center">
                  <div className="inline-block bg-blue-100 rounded-full p-5 mb-4">
                    <svg className="w-12 h-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">Intelligent Opportunity Matching</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our system will learn your company&apos;s capabilities, past performance, and strategic goals to proactively identify and prioritize Sources Sought notices with the highest probability of success for *you*, cutting through the noise.
                  </p>
                </div>
              </div>
              {/* Feature 2 */}
              <div className="flex flex-col md:flex-row-reverse items-center gap-8">
                 <div className="md:w-1/3 text-center">
                   <div className="inline-block bg-blue-100 rounded-full p-5 mb-4">
                     <svg className="w-12 h-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                   </div>
                 </div>
                 <div className="md:w-2/3">
                   <h3 className="text-2xl font-semibold text-gray-800 mb-3">Automated Requirements Analysis</h3>
                   <p className="text-gray-600 leading-relaxed">
                     GovWin AI will be designed to rapidly parse Sources Sought documents, extracting key requirements, evaluation factors, deadlines, and points of contact, presenting them in a clear, actionable format.
                   </p>
                 </div>
               </div>
              {/* Feature 3 */}
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/3 text-center">
                  <div className="inline-block bg-blue-100 rounded-full p-5 mb-4">
                    <svg className="w-12 h-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-semibold text-gray-800 mb-3">Streamlined Response Generation</h3>
                  <p className="text-gray-600 leading-relaxed">
                    While not replacing human expertise, our platform aims to assist in drafting initial response outlines and capability statements tailored to the specific notice, ensuring compliance and saving valuable drafting time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 md:py-24 bg-blue-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Help Us Build the Future</h2>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10">
              We are currently in the validation and early development stage. By joining our waitlist or early access program, you can provide crucial feedback that directly shapes GovWin AI into the tool federal contractors need.
            </p>
            <Link href="/waitlist" className="inline-block px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 font-medium rounded-lg transition-colors text-lg shadow-md">
              Get Early Access & Provide Feedback
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
} 