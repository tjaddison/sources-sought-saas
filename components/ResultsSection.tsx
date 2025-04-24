import ImageFallback from './ImageFallback'

export default function ResultsSection() {
  return (
    <section id="results" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Real Results from Real Contractors
          </h2>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-10 mb-16">
          <div className="flex-1">
            <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
              <ImageFallback 
                src="/images/results-dashboard.png" 
                alt="Client Success Metrics Dashboard" 
                width={600} 
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <h3 className="text-4xl font-bold text-blue-600 mb-2">312%</h3>
                <p className="text-gray-700">increase in qualified opportunity pipeline</p>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <h3 className="text-4xl font-bold text-blue-600 mb-2">73%</h3>
                <p className="text-gray-700">reduction in time spent searching for contracts</p>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <h3 className="text-4xl font-bold text-blue-600 mb-2">41%</h3>
                <p className="text-gray-700">higher win rate compared to industry average</p>
              </div>
              
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <h3 className="text-4xl font-bold text-blue-600 mb-2">8.4x</h3>
                <p className="text-gray-700">ROI on average client investment</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Testimonial */}
        <div className="max-w-4xl mx-auto bg-gray-50 rounded-2xl p-8 md:p-10">
          <blockquote className="text-xl italic text-gray-800 leading-relaxed mb-6">
            &quot;GovBiz Agent expanded our pipeline by 278% while cutting our administrative workload in half. We closed a $1.2M contract we would have completely missed without it.&quot;
          </blockquote>
          
          <div className="flex items-center">
            <div className="h-14 w-14 relative rounded-full overflow-hidden mr-4">
              <ImageFallback 
                src="/images/sarah-johnson.jpg" 
                alt="Sarah Johnson" 
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Sarah Johnson</p>
              <p className="text-gray-600">CEO, TechFed Solutions</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 