import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ROICalculator from '@/components/ROICalculator'

export default function ROICalculatorPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 pb-20">
        <section className="bg-gradient-to-b from-blue-50 to-white py-12">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Calculate Your Savings with GovBiz Agent
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how much time and money your team could save by streamlining your Sources Sought process.
            </p>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container mx-auto px-6">
            <ROICalculator />
            
            <div className="mt-16 max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Transform Your Federal Contracting Process?</h2>
              <p className="text-gray-600 mb-8">
                GovBiz Agent helps federal contractors discover, analyze, and respond to Sources Sought notices with speed and precision. Join our waitlist to be among the first to experience the power of AI-assisted contract opportunity management.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a href="/waitlist" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-center">
                  Join the Waitlist
                </a>
                <a href="/demo" className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors text-center">
                  Request a Demo
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
} 