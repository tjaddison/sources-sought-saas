export default function ComparisonSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            The GovCon Agent Advantage
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            See how we compare to traditional approaches to government contracting
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full max-w-5xl mx-auto border-collapse">
            <thead>
              <tr>
                <th className="p-4 border-b-2 border-gray-200 bg-gray-50 text-left"></th>
                <th className="p-4 border-b-2 border-gray-200 bg-gray-50 text-left">Traditional Bid Services</th>
                <th className="p-4 border-b-2 border-gray-200 bg-gray-50 text-left">General-Purpose CRMs</th>
                <th className="p-4 border-b-2 border-gray-200 bg-blue-50 text-left font-bold text-blue-700">GovCon Agent</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 border-b border-gray-200 font-medium">Focus</td>
                <td className="p-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>RFP/RFQ notifications</span>
                  </div>
                </td>
                <td className="p-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Contact management</span>
                  </div>
                </td>
                <td className="p-4 border-b border-gray-200 bg-blue-50">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">Full contract lifecycle</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="p-4 border-b border-gray-200 font-medium">Opportunity Source</td>
                <td className="p-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Solicitations only</span>
                  </div>
                </td>
                <td className="p-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Manual entry</span>
                  </div>
                </td>
                <td className="p-4 border-b border-gray-200 bg-blue-50">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">Sources Sought focus + solicitations</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="p-4 border-b border-gray-200 font-medium">Content Analysis</td>
                <td className="p-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Basic keyword matching</span>
                  </div>
                </td>
                <td className="p-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>None</span>
                  </div>
                </td>
                <td className="p-4 border-b border-gray-200 bg-blue-50">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">Deep AI-powered analysis</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="p-4 border-b border-gray-200 font-medium">Response Generation</td>
                <td className="p-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>None</span>
                  </div>
                </td>
                <td className="p-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>None</span>
                  </div>
                </td>
                <td className="p-4 border-b border-gray-200 bg-blue-50">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">Strategic response drafting</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="p-4 border-b border-gray-200 font-medium">Relationship Focus</td>
                <td className="p-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Transactional</span>
                  </div>
                </td>
                <td className="p-4 border-b border-gray-200">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span>Generic CRM</span>
                  </div>
                </td>
                <td className="p-4 border-b border-gray-200 bg-blue-50">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">Agency-specific engagement</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
} 