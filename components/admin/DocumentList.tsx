'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Document } from '@/lib/dynamodb';
import { 
  DocumentIcon, 
  TrashIcon, 
  ArrowDownTrayIcon,
  PlusIcon,
  ListBulletIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import clsx from 'clsx';

interface DocumentListProps {
  documents: Document[];
  documentType: 'capability' | 'resume' | 'proposal';
}

type ViewMode = 'grid' | 'list';

export default function DocumentList({ documents, documentType }: DocumentListProps) {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
  const [deletingDocs, setDeletingDocs] = useState<Set<string>>(new Set());

  // const formatFileSize = (bytes: number) => {
  //   if (bytes === 0) return '0 Bytes';
  //   const k = 1024;
  //   const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  //   const i = Math.floor(Math.log(bytes) / Math.log(k));
  //   return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  // };

  // const formatDate = (dateString: string) => {
  //   return new Date(dateString).toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'short',
  //     day: 'numeric',
  //   });
  // };

  const handleSelectDoc = (docId: string) => {
    const newSelected = new Set(selectedDocs);
    if (newSelected.has(docId)) {
      newSelected.delete(docId);
    } else {
      newSelected.add(docId);
    }
    setSelectedDocs(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedDocs.size === documents.length) {
      setSelectedDocs(new Set());
    } else {
      setSelectedDocs(new Set(documents.map(doc => doc.documentId)));
    }
  };

  const handleDownload = async (document: Document) => {
    try {
      const response = await fetch(`/api/documents/${documentType}/${document.documentId}/download`);
      if (!response.ok) throw new Error('Failed to get download URL');
      
      const { downloadUrl } = await response.json();
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download document');
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      return;
    }

    setDeletingDocs(prev => new Set(prev).add(docId));

    try {
      const response = await fetch(`/api/documents/${documentType}/${docId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete document');

      toast.success('Document deleted successfully');
      router.refresh();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete document');
    } finally {
      setDeletingDocs(prev => {
        const newSet = new Set(prev);
        newSet.delete(docId);
        return newSet;
      });
    }
  };

  const handleBatchDelete = async () => {
    if (selectedDocs.size === 0) return;
    
    if (!confirm(`Are you sure you want to delete ${selectedDocs.size} document(s)? This action cannot be undone.`)) {
      return;
    }

    const promises = Array.from(selectedDocs).map(async (docId) => {
      setDeletingDocs(prev => new Set(prev).add(docId));
      
      try {
        const response = await fetch(`/api/documents/${documentType}/${docId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error(`Failed to delete ${docId}`);
      } finally {
        setDeletingDocs(prev => {
          const newSet = new Set(prev);
          newSet.delete(docId);
          return newSet;
        });
      }
    });

    try {
      await Promise.all(promises);
      toast.success(`${selectedDocs.size} document(s) deleted successfully`);
      setSelectedDocs(new Set());
      router.refresh();
    } catch (error) {
      console.error('Batch delete error:', error);
      toast.error('Some documents failed to delete');
    }
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-12">
        <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by uploading your first document.
        </p>
        <div className="mt-6">
          <Link
            href={`/admin/documents/${documentType}/upload`}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Upload Document</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link
            href={`/admin/documents/${documentType}/upload`}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Upload New</span>
          </Link>

          {selectedDocs.size > 0 && (
            <button
              onClick={handleBatchDelete}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <TrashIcon className="h-4 w-4" />
              <span>Delete Selected ({selectedDocs.size})</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={clsx(
              'p-2 rounded-lg transition-colors',
              viewMode === 'grid' 
                ? 'bg-blue-100 text-blue-600' 
                : 'text-gray-400 hover:text-gray-600'
            )}
          >
            <Squares2X2Icon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={clsx(
              'p-2 rounded-lg transition-colors',
              viewMode === 'list' 
                ? 'bg-blue-100 text-blue-600' 
                : 'text-gray-400 hover:text-gray-600'
            )}
          >
            <ListBulletIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Select All */}
      {documents.length > 0 && (
        <div className="mb-4">
          <label className="flex items-center space-x-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={selectedDocs.size === documents.length}
              onChange={handleSelectAll}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span>Select all documents</span>
          </label>
        </div>
      )}

      {/* Document Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((document) => (
            <DocumentCard
              key={document.documentId}
              document={document}
              isSelected={selectedDocs.has(document.documentId)}
              isDeleting={deletingDocs.has(document.documentId)}
              onSelect={() => handleSelectDoc(document.documentId)}
              onDownload={() => handleDownload(document)}
              onDelete={() => handleDelete(document.documentId)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-200">
            {documents.map((document) => (
              <DocumentRow
                key={document.documentId}
                document={document}
                isSelected={selectedDocs.has(document.documentId)}
                isDeleting={deletingDocs.has(document.documentId)}
                onSelect={() => handleSelectDoc(document.documentId)}
                onDownload={() => handleDownload(document)}
                onDelete={() => handleDelete(document.documentId)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DocumentCard({ 
  document, 
  isSelected, 
  isDeleting,
  onSelect, 
  onDownload, 
  onDelete 
}: {
  document: Document;
  isSelected: boolean;
  isDeleting: boolean;
  onSelect: () => void;
  onDownload: () => void;
  onDelete: () => void;
}) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={clsx(
      'bg-white rounded-lg border-2 p-4 transition-all',
      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
    )}>
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <DocumentIcon className="h-8 w-8 text-gray-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {document.fileName}
              </h3>
              <p className="text-xs text-gray-500">
                {formatFileSize(document.fileSize)} • {formatDate(document.uploadedAt)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={onDownload}
              className="flex items-center space-x-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-100 rounded transition-colors"
              title="Download"
            >
              <ArrowDownTrayIcon className="h-3 w-3" />
              <span>Download</span>
            </button>
            
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="flex items-center space-x-1 px-2 py-1 text-xs text-red-600 hover:bg-red-100 rounded transition-colors disabled:opacity-50"
              title="Delete"
            >
              <TrashIcon className="h-3 w-3" />
              <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentRow({ 
  document, 
  isSelected, 
  isDeleting,
  onSelect, 
  onDownload, 
  onDelete 
}: {
  document: Document;
  isSelected: boolean;
  isDeleting: boolean;
  onSelect: () => void;
  onDownload: () => void;
  onDelete: () => void;
}) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className={clsx(
      'flex items-center space-x-4 p-4 hover:bg-gray-50 transition-colors',
      isSelected && 'bg-blue-50'
    )}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onSelect}
        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      
      <DocumentIcon className="h-8 w-8 text-gray-400 flex-shrink-0" />
      
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 truncate">
          {document.fileName}
        </h3>
        <p className="text-xs text-gray-500">
          {formatFileSize(document.fileSize)}
        </p>
      </div>
      
      <div className="text-sm text-gray-500">
        {formatDate(document.uploadedAt)}
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={onDownload}
          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
          title="Download"
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
        </button>
        
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
          title="Delete"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}