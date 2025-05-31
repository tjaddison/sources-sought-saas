import Link from 'next/link'
import {
  CheckIcon,
  PencilSquareIcon,
  SparklesIcon,
} from '@heroicons/react/24/solid'

export default function EarlyAccessSection() {
  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
      {/* decorative blobs */}
      <svg
        className="absolute top-0 left-1/2 -translate-x-1/3 -translate-y-1/2 opacity-20"
        width="600"
        height="600"
        viewBox="0 0 600 600"
        fill="none"
      >
        <circle cx="300" cy="300" r="300" fill="white" />
      </svg>

      <div className="relative container mx-auto px-6 text-center">
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-blue-200">
              Shape the Future of GovCon Agent
            </span>
          </h2>
          <p className="text-lg text-blue-200">
            Join our early access program to influence the roadmap, test prototypes, and secure exclusive benefits at launch.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* 1) Feedback Partner */}
          <div className="bg-white rounded-2xl p-8 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-green-100 text-green-600 rounded-full">
              <CheckIcon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Feedback Partner</h3>
            <p className="text-gray-600 mb-4">
              Free during beta — help us validate features and share real-world insights.
            </p>
            <Link href="/contact" className="inline-block text-green-600 font-medium hover:underline">
              Contact Us&nbsp;&rarr;
            </Link>
          </div>

          {/* 2) Founding Member */}
          <div className="bg-white rounded-2xl p-8 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-blue-100 text-blue-600 rounded-full">
              <SparklesIcon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Founding Member</h3>
            <p className="text-gray-600 mb-4">
              One-time $199 — lock in lifetime discounts, priority support & direct roadmap influence.
            </p>
            <Link
              href="/waitlist#early-access"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition-colors"
            >
              Apply Now
            </Link>
          </div>

          {/* 3) Enterprise Partner */}
          <div className="bg-white rounded-2xl p-8 shadow-lg transform hover:scale-105 transition-transform duration-300">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-purple-100 text-purple-600 rounded-full">
              <PencilSquareIcon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Enterprise Partner</h3>
            <p className="text-gray-600 mb-4">
              Custom pricing — advanced integrations, dedicated support & co-development opportunities.
            </p>
            <Link href="/contact" className="inline-block text-purple-600 font-medium hover:underline">
              Let's Talk&nbsp;&rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
} 