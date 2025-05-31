import Link from 'next/link'
// Keep ImageFallback import if you plan to use it later, otherwise remove it.
// import ImageFallback from './ImageFallback'

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-white via-blue-50 to-white pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-3xl mx-auto">
          {/* More Captivating Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 leading-tight">
            Stop Chasing RFPs. <span className="text-blue-600">Start Shaping Opportunities.</span>
          </h1>
          {/* Updated Sub-headline */}
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-10">
            We&apos;re building GovCon Agent: Your intelligent co-pilot designed to find, analyze, and respond to crucial Sources Sought notices — giving you the strategic advantage before the competition even starts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* Updated CTA Button Text */}
            <Link href="/waitlist" className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-lg shadow-md">
              Join the Waitlist & Influence the Future
            </Link>
            <Link href="/vision" className="inline-block px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 border border-gray-300 font-medium rounded-lg transition-colors text-lg">
              Learn About Our Vision
            </Link>
          </div>
        </div>

        {/* Optional: Placeholder for a future visual element */}
        {/* 
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="aspect-video bg-gray-200 rounded-lg shadow-lg flex items-center justify-center">
             <span className="text-gray-500">Future Product Visual/Demo Here</span> 
             // Or use ImageFallback:
             // <ImageFallback src="/images/hero-visual.png" alt="GovCon Agent Interface Preview" width={1000} height={563} className="rounded-lg" /> 
          </div>
        </div> 
        */}
      </div>
    </section>
  )
} 