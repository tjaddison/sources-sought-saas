'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  CloudArrowUpIcon, 
  DocumentIcon, 
  XMarkIcon 
} from '@heroicons/react/24/outline';
// import { UploadedFile } from '@/types/onboarding';
import toast from 'react-hot-toast';

interface FileUploadZoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  documentType: 'capability' | 'resume' | 'proposal';
  maxFiles?: number;
  accept?: Record<string, string[]>;
}

export default function FileUploadZone({ 
  files, 
  onFilesChange, 
  documentType,
  maxFiles = 10,
  accept = {
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
  }
}: FileUploadZoneProps) {
  const [uploading, setUploading] = useState<Set<string>>(new Set());

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (files.length + acceptedFiles.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Add files to local state immediately for UI responsiveness
    const newFiles = [...files, ...acceptedFiles];
    onFilesChange(newFiles);

    // Upload each file
    for (const file of acceptedFiles) {
      setUploading(prev => new Set(prev).add(file.name));
      
      try {
        await uploadFile(file, documentType);
        toast.success(`${file.name} uploaded successfully`);
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`Failed to upload ${file.name}`);
        // Remove failed file from list
        onFilesChange(newFiles.filter(f => f.name !== file.name));
      } finally {
        setUploading(prev => {
          const newSet = new Set(prev);
          newSet.delete(file.name);
          return newSet;
        });
      }
    }
  }, [files, maxFiles, documentType, onFilesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize: 25 * 1024 * 1024, // 25MB
    multiple: true,
  });

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const uploadFile = async (file: File, type: string) => {
    // Create FormData and upload directly through our API
    const formData = new FormData();
    formData.append('file', file);

    console.log('Uploading file:', { fileName: file.name, fileSize: file.size, fileType: file.type });

    const response = await fetch(`/api/documents/${type}/upload-direct`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to upload file');
    }

    const result = await response.json();
    console.log('Upload successful:', result);
    return result;
  };

  return (
    <div>
      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        
        {isDragActive ? (
          <p className="text-blue-600 font-medium">Drop files here...</p>
        ) : (
          <div>
            <p className="text-gray-600 font-medium mb-2">
              Drag & drop files here, or click to select
            </p>
            <p className="text-sm text-gray-500">
              PDF, DOC, DOCX files up to 25MB each
            </p>
          </div>
        )}
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            Uploaded Files ({files.length}/{maxFiles})
          </h3>
          <div className="space-y-2">
            {files.map((file, index) => {
              const isUploading = uploading.has(file.name);
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <DocumentIcon className="h-8 w-8 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {isUploading && (
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    )}
                    <button
                      onClick={() => removeFile(index)}
                      disabled={isUploading}
                      className="text-gray-400 hover:text-red-500 disabled:opacity-50"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}