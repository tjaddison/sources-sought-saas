import Link from 'next/link'; // Make sure Link is imported
import { ArrowRightIcon } from '@heroicons/react/24/solid';

export default function MarketValidationSection() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Gradient background container */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 md:p-12 shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Text Content */}
            <div className="md:w-2/3 text-center md:text-left mb-6 md:mb-0">
              <h3 className="text-3xl font-bold text-white mb-4">
                Help Us Build the Right Tool
              </h3>
              <p className="text-lg text-blue-100 mb-6">
                We're actively seeking feedback from federal contractors like you. Join our early access program to test prototypes and directly influence our development roadmap.
              </p>
              <Link href="/waitlist#early-access" className="inline-flex items-center px-6 py-3 bg-white hover:bg-gray-100 text-indigo-700 font-medium rounded-full transition-colors shadow-md">
                Apply for Early Access
                <ArrowRightIcon className="ml-2 w-5 h-5" />
              </Link>
            </div>

            {/* Illustration/Icon */}
            <div className="md:w-1/3 flex justify-center">
              {/* Replace with a more relevant/engaging SVG or illustration */}
              <svg className="w-40 h-40 text-blue-300 opacity-80" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M100 0C155.228 0 200 44.7715 200 100C200 155.228 155.228 200 100 200C44.7715 200 0 155.228 0 100C0 44.7715 44.7715 0 100 0Z" fill="currentColor" fillOpacity="0.1"/>
                 <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10" strokeOpacity="0.3"/>
                 <circle cx="100" cy="100" r="40" fill="currentColor" fillOpacity="0.2"/>
                 <path d="M90 90L110 110M110 90L90 110" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5"/>
                 <circle cx="100" cy="60" r="10" fill="currentColor" fillOpacity="0.4"/>
                 <circle cx="60" cy="100" r="10" fill="currentColor" fillOpacity="0.4"/>
                 <circle cx="100" cy="140" r="10" fill="currentColor" fillOpacity="0.4"/>
                 <circle cx="140" cy="100" r="10" fill="currentColor" fillOpacity="0.4"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 