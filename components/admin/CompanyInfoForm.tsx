'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile } from '@/lib/dynamodb';
import RichTextEditor from '@/components/onboarding/RichTextEditor';
import toast from 'react-hot-toast';

interface CompanyInfoFormProps {
  profile: UserProfile;
}

export default function CompanyInfoForm({ profile }: CompanyInfoFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyDescription: profile.companyDescription || '',
    companyWebsite: profile.companyWebsite || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      toast.success('Profile updated successfully');
      router.refresh();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDescriptionChange = (value: string) => {
    setFormData(prev => ({ ...prev, companyDescription: value }));
  };

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, companyWebsite: e.target.value }));
  };

  const isFormValid = formData.companyDescription.trim().length > 0;

  return (
    <div className="bg-white shadow-sm rounded-lg">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Description *
          </label>
          <p className="text-sm text-gray-500 mb-3">
            Describe your company's capabilities, services, and expertise. This information helps match you with relevant opportunities.
          </p>
          <RichTextEditor
            value={formData.companyDescription}
            onChange={handleDescriptionChange}
            placeholder="Tell us about your company's capabilities, services, expertise, and what makes you unique..."
            maxLength={5000}
          />
          <div className="text-right text-sm text-gray-500 mt-2">
            {formData.companyDescription.length}/5000 characters
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
            value={formData.companyWebsite}
            onChange={handleWebsiteChange}
            placeholder="https://www.yourcompany.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Profile Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Email:</span> {profile.email}
            </div>
            <div>
              <span className="font-medium">User ID:</span> {profile.userId}
            </div>
            <div>
              <span className="font-medium">Created:</span> {new Date(profile.createdAt).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Last Updated:</span> {new Date(profile.updatedAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isFormValid && !isLoading
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}