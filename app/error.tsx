'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="mb-6 text-gray-600">
        We apologize for the inconvenience. Please try again or return to the home page.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Try again
        </button>
        <Link href="/" className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md">
          Return Home
        </Link>
      </div>
    </div>
  )
} 