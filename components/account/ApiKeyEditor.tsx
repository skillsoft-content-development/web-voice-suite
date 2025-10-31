'use client';

import { useState } from 'react';
import { useAccount } from '@/contexts/AccountContext';
import { ApiKeyFormData } from '@/types/account';

interface ApiKeyEditorProps {
  isOpen: boolean;
  onClose: () => void;
  appName: string;
  service: 'tts' | 'lexicon';
  existingKey?: {
    id: string;
    name: string;
    key: string;
  };
}

export default function ApiKeyEditor({ isOpen, onClose, appName, service, existingKey }: ApiKeyEditorProps) {
  const { addApiKey, removeApiKey } = useAccount();
  const [formData, setFormData] = useState<ApiKeyFormData>({
    name: existingKey?.name || `${appName} API Key`,
    key: existingKey?.key || '',
    service: service
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (existingKey) {
        // Remove old key first
        await removeApiKey(existingKey.id);
      }
      
      // Add new key
      const success = await addApiKey(formData);
      
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Error updating API key:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    if (existingKey && confirm('Are you sure you want to remove this API key?')) {
      setIsLoading(true);
      try {
        await removeApiKey(existingKey.id);
        onClose();
      } catch (error) {
        console.error('Error removing API key:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">
              {existingKey ? 'Edit' : 'Add'} API Key
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Key Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 bg-white placeholder-gray-500"
                placeholder={`${appName} API Key`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <input
                type="text"
                value={formData.key}
                onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-gray-900 bg-white placeholder-gray-500 font-mono text-sm"
                placeholder="Enter your API key"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-800 disabled:opacity-50 font-medium"
              >
                {isLoading ? 'Saving...' : (existingKey ? 'Update Key' : 'Add Key')}
              </button>
              
              {existingKey && (
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={isLoading}
                  className="px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50 font-medium"
                >
                  Remove
                </button>
              )}
              
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
