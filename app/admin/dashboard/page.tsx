import { Auth0Client } from '@auth0/nextjs-auth0/server';
import { getUserProfile, getDocumentsByType } from '@/lib/dynamodb';
import { redirect } from 'next/navigation';
import DashboardStats from '@/components/admin/DashboardStats';
import QuickActions from '@/components/admin/QuickActions';

const auth0 = new Auth0Client();

export default async function AdminDashboard() {
  const session = await auth0.getSession();
  
  if (!session?.user) {
    redirect('/auth/login');
  }

  const profile = await getUserProfile(session.user.sub);
  
  if (!profile) {
    redirect('/onboarding');
  }

  // Get document counts
  const [capabilities, resumes, proposals] = await Promise.all([
    getDocumentsByType(session.user.sub, 'capability'),
    getDocumentsByType(session.user.sub, 'resume'),
    getDocumentsByType(session.user.sub, 'proposal'),
  ]);

  const stats = {
    capabilities: capabilities.length,
    resumes: resumes.length,
    proposals: proposals.length,
    lastUpdated: profile.updatedAt,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {session.user.name || session.user.email}
        </h1>
        <p className="mt-2 text-gray-600">
          Manage your profile and content to improve opportunity matching.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DashboardStats stats={stats} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}