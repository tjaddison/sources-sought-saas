import { redirect } from 'next/navigation';
import { Auth0Client } from '@auth0/nextjs-auth0/server';
import { getUserProfile } from '@/lib/dynamodb';
import AdminNavigation from '@/components/admin/AdminNavigation';
import { Toaster } from 'react-hot-toast';

const auth0 = new Auth0Client();

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth0.getSession();
  
  if (!session?.user) {
    redirect('/auth/login');
  }

  // Check if user needs to complete onboarding
  const profile = await getUserProfile(session.user.sub);
  
  if (!profile?.onboardingCompleted && !profile?.onboardingSkipped) {
    redirect('/onboarding');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavigation user={session.user} />
      <main className="lg:pl-64 py-6">
        <div className="px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <Toaster position="top-right" />
    </div>
  );
}