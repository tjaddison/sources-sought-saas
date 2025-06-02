'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingState } from '@/types/onboarding';
import WelcomeStep from './steps/WelcomeStep';
import CompanyInfoStep from './steps/CompanyInfoStep';
import CapabilityStatementsStep from './steps/CapabilityStatementsStep';
import ResumesStep from './steps/ResumesStep';
import ProposalsStep from './steps/ProposalsStep';
import ReviewStep from './steps/ReviewStep';
import toast from 'react-hot-toast';

const TOTAL_STEPS = 6;

export default function OnboardingWizard() {
  const router = useRouter();
  const [state, setState] = useState<OnboardingState>({
    currentStep: 1,
    companyDescription: '',
    companyWebsite: '',
    capabilityStatements: [],
    resumes: [],
    proposals: [],
  });

  const handleNext = () => {
    if (state.currentStep < TOTAL_STEPS) {
      setState(prev => ({ ...prev, currentStep: prev.currentStep + 1 }));
    }
  };

  const handlePrevious = () => {
    if (state.currentStep > 1) {
      setState(prev => ({ ...prev, currentStep: prev.currentStep - 1 }));
    }
  };

  const handleSkip = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onboardingSkipped: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to skip onboarding');
      }

      toast.success('Onboarding skipped. You can complete it later from your profile.');
      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Error skipping onboarding:', error);
      toast.error('Failed to skip onboarding');
    }
  };

  const handleComplete = async () => {
    try {
      // Save company info
      if (state.companyDescription || state.companyWebsite) {
        const profileResponse = await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            companyDescription: state.companyDescription,
            companyWebsite: state.companyWebsite,
          }),
        });

        if (!profileResponse.ok) {
          throw new Error('Failed to save profile');
        }
      }

      // Mark onboarding as complete
      const completeResponse = await fetch('/api/profile/complete-onboarding', {
        method: 'POST',
      });

      if (!completeResponse.ok) {
        throw new Error('Failed to complete onboarding');
      }

      toast.success('Onboarding completed successfully!');
      router.push('/admin/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Failed to complete onboarding');
    }
  };

  const stepProps = {
    state,
    setState,
    onNext: handleNext,
    onPrevious: handlePrevious,
    onSkip: handleSkip,
  };

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return <WelcomeStep {...stepProps} />;
      case 2:
        return <CompanyInfoStep {...stepProps} />;
      case 3:
        return <CapabilityStatementsStep {...stepProps} />;
      case 4:
        return <ResumesStep {...stepProps} />;
      case 5:
        return <ProposalsStep {...stepProps} />;
      case 6:
        return <ReviewStep {...stepProps} onComplete={handleComplete} />;
      default:
        return <WelcomeStep {...stepProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {state.currentStep} of {TOTAL_STEPS}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((state.currentStep / TOTAL_STEPS) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(state.currentStep / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}