import { Auth0Client } from '@auth0/nextjs-auth0/server';
import { getUserProfile } from '@/lib/dynamodb';
import { redirect } from 'next/navigation';
import CompanyInfoForm from '@/components/admin/CompanyInfoForm';

const auth0 = new Auth0Client();

export default async function CompanyInfoPage() {
  const session = await auth0.getSession();
  
  if (!session?.user) {
    redirect('/auth/login');
  }

  const profile = await getUserProfile(session.user.sub);
  
  if (!profile) {
    redirect('/onboarding');
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Company Information</h1>
        <p className="mt-2 text-gray-600">
          Update your company profile and description. This information is used for opportunity matching.
        </p>
      </div>

      <CompanyInfoForm profile={profile} />
    </div>
  );
}