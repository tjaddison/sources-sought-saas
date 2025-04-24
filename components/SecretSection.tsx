export default function SecretSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            {/* Abstract SVG Illustration */}
            <div className="mx-auto max-w-md">
              <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="200" cy="200" r="180" stroke="#E5E7EB" strokeWidth="2" />
                <circle cx="200" cy="200" r="120" stroke="#E5E7EB" strokeWidth="2" />
                <circle cx="200" cy="200" r="60" fill="#EFF6FF" />
                <path d="M200 20V380" stroke="#E5E7EB" strokeWidth="2" />
                <path d="M20 200H380" stroke="#E5E7EB" strokeWidth="2" />
                <path d="M108 108L292 292" stroke="#E5E7EB" strokeWidth="2" />
                <path d="M108 292L292 108" stroke="#E5E7EB" strokeWidth="2" />
                
                {/* Key Icon */}
                <circle cx="200" cy="180" r="20" fill="#3B82F6" />
                <rect x="190" y="200" width="20" height="40" fill="#3B82F6" />
                <rect x="180" y="220" width="40" height="10" fill="#3B82F6" />
                <rect x="170" y="230" width="15" height="10" fill="#3B82F6" />
                <rect x="215" y="230" width="15" height="10" fill="#3B82F6" />
              </svg>
            </div>
          </div>
          
          <div className="lg:w-1/2 space-y-6">
            <div className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-600 font-medium text-sm">
              Our Vision
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Disrupting Federal Contracting
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              While most contractors will continue chasing RFPs with low win probabilities, our platform will help you discover and influence contract requirements before they&apos;re finalized.
            </p>
            
            <div className="bg-gray-50 border-l-4 border-blue-500 rounded p-6 mt-6">
              <div className="flex items-start">
                <svg className="h-6 w-6 text-blue-500 mt-1 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div>
                  <span className="block text-gray-700 text-xl font-semibold">
                    Validate Our Hypothesis
                  </span>
                  <span className="block text-gray-600">
                    We&apos;re testing if AI can help smaller contractors compete more effectively in the federal marketplace. Sign up to help shape our product.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 