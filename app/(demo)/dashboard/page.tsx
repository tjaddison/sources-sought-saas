import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Demo Dashboard</h1>
      <p className="text-lg text-gray-700 mb-8">
        Welcome to the GovBiz Agent simulation! Use the sidebar to explore the planned features.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Links */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Explore Features</h2>
          <ul className="space-y-3">
            <li><Link href="/matching" className="text-blue-600 hover:text-blue-800 hover:underline">View Opportunity Matching</Link></li>
            <li><Link href="/pipeline" className="text-blue-600 hover:text-blue-800 hover:underline">Manage Pipeline</Link></li>
            <li className="text-gray-500">Analysis & Response (Select an Opportunity first)</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">About This Demo</h2>
          <p className="text-gray-600">
            This interactive demo uses pre-defined data to illustrate how GovBiz Agent aims to function. Click through the different sections to get a feel for the intended workflow.
          </p>
        </div>
      </div>
    </div>
  );
} 