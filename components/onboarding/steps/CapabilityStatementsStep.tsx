'use client';

import { StepProps } from '@/types/onboarding';
import FileUploadZone from '../FileUploadZone';

export default function CapabilityStatementsStep({ state, setState, onNext, onPrevious }: StepProps) {
  const handleFilesChange = (files: File[]) => {
    setState({ ...state, capabilityStatements: files });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Upload Capability Statements
      </h1>
      <p className="text-gray-600 mb-8">
        Upload your capability statements, past performance documents, or any materials that showcase your company's expertise and qualifications.
      </p>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          What to include:
        </h3>
        <ul className="space-y-2 text-gray-600">
          <li>• Corporate capability statements</li>
          <li>• Past performance summaries</li>
          <li>• Technical competency documents</li>
          <li>• Certification and qualification documents</li>
          <li>• Company brochures or marketing materials</li>
        </ul>
      </div>

      <FileUploadZone
        files={state.capabilityStatements}
        onFilesChange={handleFilesChange}
        documentType="capability"
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