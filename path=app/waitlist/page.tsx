import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WaitlistForm from '@/components/WaitlistForm' // Assuming WaitlistForm is separate
import EarlyAccessSection from '@/components/EarlyAccessSection' // Import the spiced-up section

export default function WaitlistPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 md:pt-20">

        {/* Waitlist Hero Section */}
        <section className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-20 md:py-28">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Join the GovCon Agent Waitlist
            </h1>
            <p className="text-lg md:text-xl text-purple-100 max-w-2xl mx-auto">
              Be the first to know when we launch and get early access opportunities. Sign up below to stay informed and help shape the future of federal contracting AI.
            </p>
          </div>
        </section>

        {/* Waitlist Form Section */}
        <section className="py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-6 max-w-xl">
             <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-gray-200">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center">
                  Sign Up Now
                </h2>
               <WaitlistForm /> {/* Render the form component */}
             </div>
          </div>
        </section>

        {/* Render the updated Early Access Section */}
        <EarlyAccessSection />

      </main>
      <Footer />
    </>
  )
} 