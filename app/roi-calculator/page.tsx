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
              Calculate Your Savings with GovCon Agent
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how much time and money your team could save by streamlining your Sources Sought process.
            </p>
          </div>
        </section>
        
        <section className="py-12">
          <div className="container mx-auto px-6">
            <ROICalculator />
            
           
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
} 