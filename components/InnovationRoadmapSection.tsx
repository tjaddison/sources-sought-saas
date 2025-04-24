export default function InnovationRoadmapSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-600 font-medium text-sm mb-3">
            Development Pipeline
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Innovation Roadmap
          </h2>
          <p className="text-xl text-gray-600">
            Here&apos;s what we&apos;re working toward as we build the future of federal contracting
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200"></div>
          
          {/* Phase 1 */}
          <div className="relative mb-16">
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-5 h-5 rounded-full border-4 border-blue-600 bg-white"></div>
            <div className="ml-auto mr-auto md:ml-0 md:mr-[calc(50%+2rem)] md:pr-8 md:text-right w-full md:w-1/2 p-6 bg-white rounded-xl shadow-sm">
              <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-2">
                Phase 1: Q3 2023
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Research & Validation</h3>
              <p className="text-gray-600">
                Conducting market research, interviewing federal contractors, and validating our core hypothesis that AI can transform the Sources Sought process.
              </p>
            </div>
          </div>
          
          {/* Phase 2 */}
          <div className="relative mb-16">
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-5 h-5 rounded-full border-4 border-blue-400 bg-white"></div>
            <div className="ml-auto mr-auto md:mr-0 md:ml-[calc(50%+2rem)] md:pl-8 w-full md:w-1/2 p-6 bg-white rounded-xl shadow-sm">
              <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-2">
                Phase 2: Q4 2023
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Prototype Development</h3>
              <p className="text-gray-600">
                Building our initial AI models for opportunity matching and requirements analysis, with early access for feedback partners.
              </p>
            </div>
          </div>
          
          {/* Phase 3 */}
          <div className="relative mb-16">
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-5 h-5 rounded-full border-4 border-blue-300 bg-white"></div>
            <div className="ml-auto mr-auto md:ml-0 md:mr-[calc(50%+2rem)] md:pr-8 md:text-right w-full md:w-1/2 p-6 bg-white rounded-xl shadow-sm">
              <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-2">
                Phase 3: Q1 2024
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Beta Testing & Refinement</h3>
              <p className="text-gray-600">
                Launching beta version with expanded features including response generation to a limited audience for extensive testing and refinement.
              </p>
            </div>
          </div>
          
          {/* Phase 4 */}
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 -top-2 w-5 h-5 rounded-full border-4 border-blue-200 bg-white"></div>
            <div className="ml-auto mr-auto md:mr-0 md:ml-[calc(50%+2rem)] md:pl-8 w-full md:w-1/2 p-6 bg-white rounded-xl shadow-sm">
              <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-2">
                Phase 4: Q2 2024
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Public Launch</h3>
              <p className="text-gray-600">
                Full product launch with comprehensive features, dedicated support, and continued AI model improvements based on real-world usage.
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-16">
          <a href="/waitlist" className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            Join Our Journey
            <svg className="ml-2 w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
} 