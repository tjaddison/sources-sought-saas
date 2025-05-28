import Link from 'next/link'

export default function CtaSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Transform Your Federal Contracting Approach?
        </h2>
        <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
          In just 2 minutes, our ROI Calculator will show you exactly how much time and money you'll save with GovBiz Agent—then find the perfect plan for your needs.
        </p>
        <div className="flex justify-center">
          <a href="/roi-calculator" className="px-8 py-4 bg-white text-blue-700 hover:bg-blue-50 font-semibold rounded-lg transition-colors text-center">
            Calculate Your ROI First
          </a>
        </div>
        <p className="mt-6 text-blue-200 text-sm">
          Be among the first federal contractors to transform your approach with GovBiz Agent
        </p>
      </div>
    </section>
  )
} 