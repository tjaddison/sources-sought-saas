import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WaitlistForm from '@/components/WaitlistForm' // We will create this next

export default function WaitlistPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20"> {/* Adjust padding for fixed navbar */}

        {/* Waitlist Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-20 md:py-28">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Join the GovBiz Agent Waitlist
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Be among the first to experience GovBiz Agent. Sign up now to get early access, influence development, and secure exclusive founding member benefits.
            </p>
          </div>
        </section>

        {/* Benefits & Form Section */}
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-start">

              {/* Benefits List */}
              <div className="prose prose-lg lg:prose-xl text-gray-700">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Join?</h2>
                <ul className="list-none p-0 space-y-4">
                  <li className="flex items-start">
                    <svg className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span><strong>Early Access:</strong> Get preview access to GovBiz Agent features as they are developed and provide direct feedback.</span>
                  </li>
                  <li className="flex items-start">
                     <svg className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span><strong>Shape the Product:</strong> Your input will directly influence our feature roadmap and user experience design.</span>
                  </li>
                  <li className="flex items-start">
                     <svg className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span><strong>Founding Member Perks:</strong> Secure significant discounts on future subscription plans and potential exclusive features.</span>
                  </li>
                   <li className="flex items-start">
                     <svg className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span><strong>Stay Informed:</strong> Receive exclusive updates on our progress, beta launch timelines, and feature releases.</span>
                  </li>
                </ul>
                 <p className="mt-8 text-sm text-gray-600">
                   We respect your privacy. Your information will only be used for GovBiz Agent updates and early access communication.
                 </p>
              </div>

              {/* Waitlist Form Component */}
              <div className="bg-gray-50 p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign Up Below</h2>
                <WaitlistForm />
              </div>

            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
} 