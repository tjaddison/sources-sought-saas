'use client';

import { StepProps } from '@/types/onboarding';
import { CheckIcon } from '@heroicons/react/24/outline';

export default function WelcomeStep({ onNext, onSkip }: StepProps) {
  const features = [
    'Company profile and description',
    'Capability statements upload',
    'Resume and team member profiles',
    'Past proposal examples',
    'Content indexing for searchability',
  ];

  return (
    <div className="text-center">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
        <CheckIcon className="h-8 w-8 text-blue-600" />
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Welcome to Your Profile Setup
      </h1>
      
      <p className="text-lg text-gray-600 mb-8">
        Let's get your profile set up so you can start finding relevant opportunities. 
        This should take about 5-10 minutes.
      </p>

      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          We'll help you set up:
        </h2>
        <ul className="space-y-3 text-left">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <CheckIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onNext}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Start Setup
        </button>
        <button
          onClick={onSkip}
          className="text-gray-600 px-8 py-3 rounded-lg font-medium hover:text-gray-800 hover:bg-gray-100 transition-colors"
        >
          Skip to Dashboard
        </button>
      </div>
    </div>
  );
}