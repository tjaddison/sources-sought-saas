import Link from 'next/link';

export default function EarlyAccessSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
      <div className="container mx-auto px-6 max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Be Among the First to Use GovCon Agent
        </h2>
        <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
          Join our early users and start winning more federal contracts with our innovative AI-powered platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/roi-calculator" className="px-8 py-4 bg-white text-blue-700 hover:bg-blue-50 font-semibold rounded-lg transition-colors text-center">
            Calculate Your ROI
          </Link>
          <Link href="/pricing" className="px-8 py-4 bg-transparent border-2 border-white hover:bg-white/10 text-white font-semibold rounded-lg transition-colors text-center">
            Choose a Plan
          </Link>
        </div>
        <p className="mt-6 text-blue-200 text-sm">
          All plans include a 14-day money-back guarantee
        </p>
      </div>
    </section>
  );
} 