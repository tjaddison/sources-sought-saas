import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { getUserProfile, createOrUpdateUserProfile } from '@/lib/dynamodb';
import { z } from 'zod';

const updateProfileSchema = z.object({
  companyDescription: z.string().max(5000).optional(),
  companyWebsite: z.string().url().optional().or(z.literal('')),
  onboardingCompleted: z.boolean().optional(),
  onboardingSkipped: z.boolean().optional(),
});

export const GET = requireAuth(async (req: NextRequest, user) => {
  try {
    const profile = await getUserProfile(user.userId);
    
    if (!profile) {
      // Create a new profile if it doesn't exist
      const newProfile = await createOrUpdateUserProfile({
        userId: user.userId,
        email: user.email,
        onboardingCompleted: false,
        onboardingSkipped: false,
      });
      
      return Response.json(newProfile);
    }

    return Response.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

export const PUT = requireAuth(async (req: NextRequest, user) => {
  try {
    const body = await req.json();
    const validatedData = updateProfileSchema.parse(body);

    // Get existing profile to preserve other fields
    const existingProfile = await getUserProfile(user.userId);
    
    const updatedProfile = await createOrUpdateUserProfile({
      ...existingProfile,
      userId: user.userId,
      email: user.email,
      ...validatedData,
    });

    return Response.json(updatedProfile);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Error updating profile:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});