import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function FeedbackPage() {
  // const contactEmail = 'terrance@xenvya.com'; // Removed unused variable

  return (
    <>
      <Navbar />
      <main className="pt-16 md:pt-20"> {/* Adjust padding for fixed navbar */}

        {/* Header Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              Share Your Feedback
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Your insights are crucial as we build GovWin AI. Help us create the best tool for federal contractors.
            </p>
          </div>
        </section>

        {/* Main Content Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="bg-white p-8 md:p-10 rounded-lg shadow-md border border-gray-200">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">Why Your Input Matters</h2>
              <div className="prose prose-lg lg:prose-xl text-gray-700 mx-auto space-y-6">
                <p>
                  GovWin AI is currently in the crucial validation and early development stage. We&apos;re actively defining features, refining the user experience, and ensuring we solve the most pressing challenges faced by federal contractors in the pre-solicitation process.
                </p>
                <p>
                  Hearing directly from potential users like you allows us to:
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li><strong>Validate assumptions:</strong> Ensure we&apos;re building features that truly address your needs.</li>
                  <li><strong>Prioritize features:</strong> What capabilities would provide the most value to you?</li>
                  <li><strong>Identify usability issues:</strong> How can we make the platform intuitive and efficient?</li>
                  <li><strong>Uncover unmet needs:</strong> Are there challenges we haven&apos;t considered?</li>
                </ul>
                <p>
                  Your input, whether it&apos;s a suggestion, a critique, or a question, directly influences the direction of GovWin AI and helps us build a tool that truly meets your needs.
                </p>
                <h3 className="text-xl font-semibold text-gray-800 pt-4 !mb-3">How to Provide Feedback</h3>
                <p>
                  The best way to provide detailed feedback and influence development is by joining our early access program. Alternatively, you can use the general waitlist form to share initial thoughts.
                </p>
                 {/* Link to waitlist/early access */}
                 <div className="not-prose pt-4">
                    <Link href="/waitlist" className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm">
                      Share Feedback via Waitlist Form
                    </Link>
                 </div>
              </div>
            </div>

            {/* --- NEW CALL TO ACTION SECTION --- */}
            <section className="mt-16 md:mt-24 text-center bg-gray-800 text-white py-16 px-6 rounded-lg shadow-lg">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Become a Founding Member</h2>
                <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
                  Ready to take a more active role? Join our exclusive Founding Member community! Get early access, influence the roadmap directly through dedicated feedback sessions, and secure significant lifetime discounts. Help us shape the future of federal contracting intelligence.
                </p>
                <Link
                  href="/waitlist#early-access"
                  className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-lg shadow-md transform hover:scale-105 duration-300 ease-in-out"
                >
                  Learn More & Apply for Early Access
                </Link>
            </section>
            {/* --- END CALL TO ACTION SECTION --- */}

          </div>
        </section>

      </main>
      <Footer />
    </>
  )
} 