import { redirect } from 'next/navigation';
import { Auth0Client } from '@auth0/nextjs-auth0/server';
import { getUserProfile } from '@/lib/dynamodb';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import { Toaster } from 'react-hot-toast';

const auth0 = new Auth0Client();

export default async function OnboardingPage() {
  const session = await auth0.getSession();
  
  if (!session?.user) {
    redirect('/auth/login');
  }

  // Check if user has already completed onboarding
  const profile = await getUserProfile(session.user.sub);
  
  if (profile?.onboardingCompleted) {
    redirect('/admin/dashboard');
  }

  return (
    <>
      <OnboardingWizard />
      <Toaster position="top-right" />
    </>
  );
}