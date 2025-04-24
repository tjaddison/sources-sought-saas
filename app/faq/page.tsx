import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import FaqSection from '@/components/FaqSection'

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16 md:pt-20">
        <section className="bg-gray-50 py-12 md:py-16">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about GovBiz Agent, our features, and the early access program.
            </p>
          </div>
        </section>

        <FaqSection />

      </main>
      <Footer />
    </>
  )
} 