import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { getUserProfile, createOrUpdateUserProfile } from '@/lib/dynamodb';

export const POST = requireAuth(async (req: NextRequest, user) => {
  try {
    const existingProfile = await getUserProfile(user.userId);
    
    const updatedProfile = await createOrUpdateUserProfile({
      ...existingProfile,
      userId: user.userId,
      email: user.email,
      onboardingCompleted: true,
      onboardingSkipped: false,
    });

    return Response.json({ 
      success: true, 
      profile: updatedProfile 
    });
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});