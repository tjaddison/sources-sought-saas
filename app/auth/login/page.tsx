'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the Auth0 login API route
    router.push('/api/auth/login');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-8 text-center">
        <h1 className="text-2xl font-semibold mb-4">Redirecting to login...</h1>
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent mx-auto"></div>
      </div>
    </div>
  );
} 