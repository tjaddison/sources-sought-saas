export default function VisionSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-600 font-medium text-sm mb-3">
            Our Vision
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Reimagining the Pre-Solicitation Process
          </h2>
          <p className="text-xl text-gray-600">
            We believe AI can level the playing field for federal contractors by transforming how Sources Sought opportunities are discovered and pursued.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1: Discover Early */}
          <div className="bg-gray-50 rounded-xl p-8 text-center hover:shadow-md transition-shadow">
            <div className="inline-block bg-blue-100 rounded-full p-4 mb-6">
              <svg className="w-10 h-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Discover Opportunities Earlier</h3>
            <p className="text-gray-600">
              Our goal is to use AI to proactively find relevant Sources Sought notices you might otherwise miss, giving you a head start.
            </p>
          </div>

          {/* Card 2: Analyze Faster */}
          <div className="bg-gray-50 rounded-xl p-8 text-center hover:shadow-md transition-shadow">
            <div className="inline-block bg-blue-100 rounded-full p-4 mb-6">
              <svg className="w-10 h-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Analyze Requirements Faster</h3>
            <p className="text-gray-600">
              We aim to automate the extraction of key requirements and evaluation criteria, saving your team valuable analysis time.
            </p>
          </div>

          {/* Card 3: Respond Smarter */}
          <div className="bg-gray-50 rounded-xl p-8 text-center hover:shadow-md transition-shadow">
            <div className="inline-block bg-blue-100 rounded-full p-4 mb-6">
              <svg className="w-10 h-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Respond More Effectively</h3>
            <p className="text-gray-600">
              Our future platform intends to help generate tailored, compliant response outlines, allowing you to focus on strategy and content.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 