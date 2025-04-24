import Link from 'next/link'

export default function CtaSection() {
  return (
    <section className="py-20 bg-blue-600">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Stop Competing on RFPs. Start Shaping Requirements.
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
            While your competitors rush to bid on solicitations, you&apos;ll be building relationships with contracting officers, shaping requirements, and positioning your company as the solution before RFPs are even written.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link 
              href="#access" 
              className="px-8 py-4 bg-white text-blue-600 rounded-md text-center font-semibold hover:bg-blue-50 transition-colors shadow-lg"
            >
              Request Access
            </Link>
            <Link 
              href="#demo" 
              className="px-8 py-4 border-2 border-white text-white rounded-md text-center font-semibold hover:bg-blue-500 transition-colors"
            >
              Schedule a Demo
            </Link>
          </div>
          
          <p className="mt-6 text-blue-200">
            Limited new accounts available this quarter
          </p>
        </div>
      </div>
    </section>
  )
} 