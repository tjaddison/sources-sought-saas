'use client';

import { StepProps } from '@/types/onboarding';
import RichTextEditor from '../RichTextEditor';

export default function CompanyInfoStep({ state, setState, onNext, onPrevious }: StepProps) {
  const handleDescriptionChange = (value: string) => {
    setState({ ...state, companyDescription: value });
  };

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({ ...state, companyWebsite: e.target.value });
  };

  const isValid = state.companyDescription.trim().length > 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Tell us about your company
      </h1>
      <p className="text-gray-600 mb-8">
        This information helps match you with relevant opportunities and creates your profile.
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Description *
          </label>
          <p className="text-sm text-gray-500 mb-3">
            Describe your company's capabilities, services, and expertise. This will be used to match you with relevant opportunities.
          </p>
          <RichTextEditor
            value={state.companyDescription}
            onChange={handleDescriptionChange}
            placeholder="Tell us about your company's capabilities, services, expertise, and what makes you unique..."
            maxLength={5000}
          />
          <div className="text-right text-sm text-gray-500 mt-2">
            {state.companyDescription.length}/5000 characters
          </div>
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
            Company Website
          </label>
          <p className="text-sm text-gray-500 mb-3">
            Optional: Link to your company website for additional information.
          </p>
          <input
            type="url"
            id="website"
            value={state.companyWebsite}
            onChange={handleWebsiteChange}
            placeholder="https://www.yourcompany.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onPrevious}
          className="text-gray-600 px-6 py-2 rounded-lg font-medium hover:text-gray-800 hover:bg-gray-100 transition-colors"
        >
          Previous
        </button>
        
        <button
          onClick={onNext}
          disabled={!isValid}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            isValid
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}