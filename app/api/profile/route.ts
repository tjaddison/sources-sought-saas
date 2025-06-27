import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { getUserProfile, createOrUpdateUserProfile } from '@/lib/dynamodb';
import { z } from 'zod';

// Use Node.js runtime for AWS SDK compatibility
export const runtime = 'nodejs';

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
  console.log('=== PUT /profile endpoint started ===');
  console.log('Authenticated user:', {
    userId: user.userId,
    email: user.email,
    name: user.name
  });

  try {
    // Debug request body parsing
    console.log('Parsing request body...');
    const body = await req.json();
    console.log('Raw request body:', body);

    // Debug validation
    console.log('Validating data against schema...');
    const validatedData = updateProfileSchema.parse(body);
    console.log('Validated data:', validatedData);

    // Debug existing profile retrieval
    console.log(`Fetching existing profile for userId: ${user.userId}`);
    const existingProfile = await getUserProfile(user.userId);
    console.log('Existing profile:', existingProfile);

    // Debug profile merge
    const profileToUpdate = {
      ...existingProfile,
      userId: user.userId,
      email: user.email,
      ...validatedData,
    };
    console.log('Profile data to update:', profileToUpdate);

    // Debug database update
    console.log('Updating profile in database...');
    const updatedProfile = await createOrUpdateUserProfile(profileToUpdate);
    console.log('Updated profile result:', updatedProfile);

    console.log('=== PUT /profile endpoint completed successfully ===');
    return Response.json(updatedProfile);

  } catch (error) {
    console.error('=== PUT /profile endpoint error ===');
    
    if (error instanceof z.ZodError) {
      console.error('Validation error details:', {
        errorType: 'ZodError',
        errors: error.errors
      });
      
      return Response.json(
        { 
          error: 'Validation error', 
          details: error.errors 
        },
        { status: 400 }
      );
    }


    // Log the full error object
    console.error('Full error object:', error);

    return Response.json(
      { 
        error: 'Internal server error',
        timestamp: new Date().toISOString(),
        // In development, you might want to include more details
        ...(process.env.NODE_ENV === 'development' && {
          details: {
            message: error instanceof Error ? error.message : 'Unknown error',
            type: error instanceof Error ? error.constructor.name : 'Unknown'
          }
        })
      },
      { status: 500 }
    );
  }
});