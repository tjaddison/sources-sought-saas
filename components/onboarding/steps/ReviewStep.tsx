'use client';

import { StepProps } from '@/types/onboarding';
import { DocumentIcon, BuildingOfficeIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

interface ReviewStepProps extends StepProps {
  onComplete: () => void;
}

export default function ReviewStep({ state, onPrevious, onComplete, onSkip }: ReviewStepProps) {
  const totalFiles = 
    state.capabilityStatements.length + 
    state.resumes.length + 
    state.proposals.length;

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const FileSection = ({ 
    title, 
    files, 
    icon: Icon 
  }: { 
    title: string; 
    files: File[]; 
    icon: React.ComponentType<{ className?: string }>;
  }) => (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Icon className="h-5 w-5 text-gray-600" />
        <h4 className="font-medium text-gray-900">{title}</h4>
        <span className="text-sm text-gray-500">({files.length} files)</span>
      </div>
      
      {files.length > 0 ? (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span className="text-gray-700 truncate">{file.name}</span>
              <span className="text-gray-500 ml-2">{formatFileSize(file.size)}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No files uploaded</p>
      )}
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Review & Complete Setup
      </h1>
      <p className="text-gray-600 mb-8">
        Please review your information before completing the setup. You can always modify this later from your profile.
      </p>

      <div className="space-y-6">
        {/* Company Information */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <BuildingOfficeIcon className="h-5 w-5 text-gray-600" />
            <h4 className="font-medium text-gray-900">Company Information</h4>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Description:</label>
              <div className="text-sm text-gray-600 mt-1 line-clamp-3">
                {state.companyDescription || 'No description provided'}
              </div>
            </div>
            
            {state.companyWebsite && (
              <div>
                <label className="text-sm font-medium text-gray-700">Website:</label>
                <div className="flex items-center space-x-2 mt-1">
                  <GlobeAltIcon className="h-4 w-4 text-gray-500" />
                  <a 
                    href={state.companyWebsite} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {state.companyWebsite}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Uploaded Documents */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Uploaded Documents ({totalFiles} total)
          </h3>
          
          <FileSection
            title="Capability Statements"
            files={state.capabilityStatements}
            icon={DocumentIcon}
          />
          
          <FileSection
            title="Team Resumes"
            files={state.resumes}
            icon={DocumentIcon}
          />
          
          <FileSection
            title="Past Proposals"
            files={state.proposals}
            icon={DocumentIcon}
          />
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Your documents will be processed and indexed for searchability</li>
            <li>• You'll be matched with relevant opportunities based on your profile</li>
            <li>• You can manage and update your content from the admin dashboard</li>
            <li>• Start receiving notifications about matching opportunities</li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <div className="flex space-x-3">
          <button
            onClick={onPrevious}
            className="text-gray-600 px-6 py-2 rounded-lg font-medium hover:text-gray-800 hover:bg-gray-100 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={onSkip}
            className="text-gray-600 px-6 py-2 rounded-lg font-medium hover:text-gray-800 hover:bg-gray-100 transition-colors"
          >
            Skip to Dashboard
          </button>
        </div>
        
        <button
          onClick={onComplete}
          className="bg-green-600 text-white px-8 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          Complete Setup
        </button>
      </div>
    </div>
  );
}