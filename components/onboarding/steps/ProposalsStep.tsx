'use client';

import { StepProps } from '@/types/onboarding';
import FileUploadZone from '../FileUploadZone';

export default function ProposalsStep({ state, setState, onNext, onPrevious }: StepProps) {
  const handleFilesChange = (files: File[]) => {
    setState({ ...state, proposals: files });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Upload Past Proposals
      </h1>
      <p className="text-gray-600 mb-8">
        Upload examples of past proposals to help us understand your writing style, approach, and areas of expertise. These will be kept confidential and used only for matching purposes.
      </p>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          What to include:
        </h3>
        <ul className="space-y-2 text-gray-600">
          <li>• Successful government contract proposals</li>
          <li>• SBIR/STTR proposals (Phase I, II, or III)</li>
          <li>• Commercial or private sector proposals</li>
          <li>• White papers or technical documentation</li>
          <li>• Grant applications or research proposals</li>
        </ul>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <h4 className="font-medium text-yellow-800 mb-2">Privacy Notice</h4>
        <p className="text-sm text-yellow-700">
          All uploaded proposals will be processed securely and used only for content matching and analysis. 
          We recommend removing any sensitive information such as pricing, proprietary methods, or client-specific details before uploading.
        </p>
      </div>

      <FileUploadZone
        files={state.proposals}
        onFilesChange={handleFilesChange}
        documentType="proposal"
        maxFiles={10}
      />

      <div className="flex justify-between mt-8">
        <button
          onClick={onPrevious}
          className="text-gray-600 px-6 py-2 rounded-lg font-medium hover:text-gray-800 hover:bg-gray-100 transition-colors"
        >
          Previous
        </button>
        
        <button
          onClick={onNext}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}