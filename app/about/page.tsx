import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 md:pt-20"> {/* Adjust padding for fixed navbar */}

        {/* Header Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16 md:py-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
              About GovCon Agent
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Leveling the playing field for federal contractors through intelligent automation.
            </p>
          </div>
        </section>

        {/* --- UPDATED MOTIVATION SECTION --- */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center md:text-left flex flex-col md:flex-row items-center gap-10">
              {/* Optional: Add an illustrative image or icon here */}
              {/* <div className="md:w-1/3 flex justify-center">
                 <svg className="w-32 h-32 text-blue-500" ... />
              </div> */}
              <div className="md:flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center md:text-left">
                  Our Motivation: Empowering the Underdog
                </h2>
                <div className="prose prose-lg lg:prose-xl text-gray-700 mx-auto space-y-6">
                  <p>
                    The federal marketplace is a land of immense opportunity, but navigating its complex landscape can feel like an uphill battle, especially for small and medium-sized businesses. We&apos;ve seen firsthand how valuable time and resources are drained deciphering dense Sources Sought notices and crafting compelling responses, often just to keep up.
                  </p>
                  <p>
                    <strong className="font-semibold">We believe it shouldn&apos;t be this hard.</strong> Talent, innovation, and the drive to serve shouldn&apos;t be overshadowed by bureaucratic hurdles or a lack of bandwidth.
                  </p>
                  <p>
                    Our motivation stems from a deep desire to <strong className="font-semibold">level the playing field</strong>. We&apos;re harnessing the power of Artificial Intelligence not just to automate tasks, but to provide genuine strategic leverage. GovCon Agent is being built to cut through the noise, illuminate the best-fit opportunities hidden in plain sight, and empower contractors like you to focus on what you do best: delivering exceptional value to government agencies. We&apos;re driven by the vision of a more accessible and equitable federal contracting ecosystem.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* --- END UPDATED MOTIVATION SECTION --- */}

        {/* About Xenvya Section */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
               <svg width="48" height="48" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-4 text-blue-600">
                 <rect width="32" height="32" rx="8" fill="currentColor"/>
                 <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">A Project by Xenvya</h2>
              <p className="text-lg text-gray-600 mb-4">
                GovCon Agent is an innovation project spearheaded by Xenvya.
              </p>
              <p className="text-xl text-gray-700 italic border-l-4 border-blue-500 pl-4 inline-block">
                &quot;Innovative software and AI solutions that drive business growth and create remarkable customer experiences.&quot;
              </p>
              <p className="text-gray-600 mt-6">
                Xenvya brings expertise in software development, artificial intelligence, and user-centric design to the development of GovCon Agent. We are committed to building high-quality, impactful solutions.
              </p>
            </div>
          </div>
        </section>

        {/* Our Approach Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Approach</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">User-Centric Development</h3>
                  <p className="text-gray-700">
                    We are currently in the validation and early development phase. Feedback from real federal contractors through our waitlist and early access program is crucial to ensuring GovCon Agent solves the right problems effectively.
                  </p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Focused on Pre-Solicitation</h3>
                  <p className="text-gray-700">
                    Our primary focus is on leveraging AI to streamline the Sources Sought phase – helping you find opportunities earlier and understand requirements faster to gain a strategic edge.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
} 