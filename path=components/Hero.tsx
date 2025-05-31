import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/solid'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-600 text-white py-32">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-blue-200">
            Win More Federal Contracts with AI
          </span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-blue-100">
          GovCon Agent helps you discover, analyze, and respond to Sources Sought notices with confidence and speed.
        </p>
        <Link
          href="/waitlist"
          className="inline-flex items-center bg-white text-indigo-700 px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition"
        >
          Join the Waitlist
          <ArrowRightIcon className="w-5 h-5 ml-2" />
        </Link>
      </div>
    </section>
  )
} 