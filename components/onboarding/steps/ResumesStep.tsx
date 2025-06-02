'use client';

import { StepProps } from '@/types/onboarding';
import FileUploadZone from '../FileUploadZone';

export default function ResumesStep({ state, setState, onNext, onPrevious }: StepProps) {
  const handleFilesChange = (files: File[]) => {
    setState({ ...state, resumes: files });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Upload Team Resumes
      </h1>
      <p className="text-gray-600 mb-8">
        Upload resumes for key team members who would be involved in government contracts. This helps demonstrate your team's qualifications and expertise.
      </p>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Recommended team members:
        </h3>
        <ul className="space-y-2 text-gray-600">
          <li>• Project managers and executives</li>
          <li>• Technical leads and subject matter experts</li>
          <li>• Principal investigators or senior staff</li>
          <li>• Key personnel with relevant certifications</li>
          <li>• Team members with government contract experience</li>
        </ul>
      </div>

      <FileUploadZone
        files={state.resumes}
        onFilesChange={handleFilesChange}
        documentType="resume"
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