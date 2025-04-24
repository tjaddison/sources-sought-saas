export default function SecretSection() {
  return (
    <section className="relative py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* decorative blob */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-gradient-to-br from-green-200 to-green-400 rounded-full opacity-20"></div>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            {/* Abstract SVG Illustration */}
            <div className="mx-auto max-w-md">
              {/* … */}
            </div>
          </div>
          
          <div className="lg:w-1/2 space-y-6">
            <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-medium text-sm">
              Our Vision
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Disrupting Federal Contracting
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              While most contractors will continue chasing RFPs with low win probabilities, our platform will help you discover and influence contract requirements before they&apos;re finalized.
            </p>
            {/* … */}
          </div>
        </div>
      </div>
    </section>
  )
} 