'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FileUploadZone from '@/components/onboarding/FileUploadZone';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface DocumentUploadFormProps {
  documentType: 'capability' | 'resume' | 'proposal';
}

const TYPE_DESCRIPTIONS = {
  capability: {
    title: 'Capability Statements',
    description: 'Upload company capabilities, past performance documents, and qualifications that showcase your expertise.',
    tips: [
      'Corporate capability statements',
      'Past performance summaries', 
      'Technical competency documents',
      'Certification and qualification documents',
      'Company brochures or marketing materials'
    ]
  },
  resume: {
    title: 'Team Resumes',
    description: 'Upload resumes for key team members who would be involved in government contracts.',
    tips: [
      'Project managers and executives',
      'Technical leads and subject matter experts',
      'Principal investigators or senior staff',
      'Key personnel with relevant certifications',
      'Team members with government contract experience'
    ]
  },
  proposal: {
    title: 'Past Proposals',
    description: 'Upload examples of past proposals to help demonstrate your approach and expertise.',
    tips: [
      'Successful government contract proposals',
      'SBIR/STTR proposals (Phase I, II, or III)',
      'Commercial or private sector proposals',
      'White papers or technical documentation',
      'Grant applications or research proposals'
    ]
  }
};

export default function DocumentUploadForm({ documentType }: DocumentUploadFormProps) {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  // const [isUploading, setIsUploading] = useState(false);

  const typeInfo = TYPE_DESCRIPTIONS[documentType];

  const handleUploadComplete = () => {
    toast.success('Documents uploaded successfully!');
    router.push(`/admin/documents/${documentType}`);
  };

  const handleCancel = () => {
    if (files.length > 0 && !confirm('Are you sure you want to cancel? Any uploaded files will be kept.')) {
      return;
    }
    router.back();
  };

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            {typeInfo.title}
          </h2>
          <p className="text-gray-600 mb-4">
            {typeInfo.description}
          </p>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              What to include:
            </h3>
            <ul className="space-y-1 text-sm text-gray-600">
              {typeInfo.tips.map((tip, index) => (
                <li key={index}>• {tip}</li>
              ))}
            </ul>
          </div>
        </div>

        {documentType === 'proposal' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-yellow-800 mb-2">Privacy Notice</h4>
            <p className="text-sm text-yellow-700">
              All uploaded proposals will be processed securely and used only for content matching and analysis. 
              We recommend removing any sensitive information such as pricing, proprietary methods, or client-specific details before uploading.
            </p>
          </div>
        )}

        <FileUploadZone
          files={files}
          onFilesChange={setFiles}
          documentType={documentType}
          maxFiles={10}
        />

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="flex items-center space-x-2 text-gray-600 px-4 py-2 rounded-lg hover:text-gray-800 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Back to Documents</span>
          </button>

          {files.length > 0 && (
            <button
              onClick={handleUploadComplete}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Done Uploading
            </button>
          )}
        </div>
      </div>
    </div>
  );
}