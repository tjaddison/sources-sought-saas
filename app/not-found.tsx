import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
      <p className="mb-6 text-gray-600">
        We couldn't find the page you were looking for.
      </p>
      <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded-md">
        Return to Home
      </Link>
    </div>
  )
} 