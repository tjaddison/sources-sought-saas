import { EyeIcon, LightBulbIcon, UsersIcon } from '@heroicons/react/24/outline' // Use outline icons

export default function VisionSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
             <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
               Our Core Vision
             </span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            We aim to level the playing field by making pre-solicitation intelligence accessible and actionable for all federal contractors.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {/* Pillar 1 */}
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-blue-100 text-blue-600 rounded-full">
              <EyeIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Demystify Pre-Solicitation</h3>
            <p className="text-gray-600">
              Cut through the noise of SAM.gov. We use AI to find the Sources Sought notices most relevant to *your* business.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
             <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-green-100 text-green-600 rounded-full">
               <LightBulbIcon className="w-8 h-8" />
             </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Provide Strategic Insight</h3>
            <p className="text-gray-600">
              Go beyond simple notifications. Understand requirements, analyze fit, and get AI assistance drafting compelling responses.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100">
             <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-purple-100 text-purple-600 rounded-full">
               <UsersIcon className="w-8 h-8" />
             </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Empower Small Businesses</h3>
            <p className="text-gray-600">
              Give smaller contractors the tools and intelligence typically reserved for larger firms, fostering fair competition.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
} 