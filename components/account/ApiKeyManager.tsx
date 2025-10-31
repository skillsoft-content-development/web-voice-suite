'use client';

import { useState } from 'react';
import { useAccount } from '@/contexts/AccountContext';
import { ApiKey, ApiKeyFormData } from '@/types/account';

export default function ApiKeyManager() {
  const { account, addApiKey, removeApiKey } = useAccount();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newKey, setNewKey] = useState<ApiKeyFormData>({
    name: '',
    key: '',
    service: 'other'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleAddKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const success = await addApiKey(newKey);
    
    if (success) {
      setNewKey({ name: '', key: '', service: 'other' });
      setShowAddForm(false);
    }
    
    setIsLoading(false);
  };

  const handleRemoveKey = async (keyId: string) => {
    if (confirm('Are you sure you want to remove this API key?')) {
      await removeApiKey(keyId);
    }
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return '••••••••';
    return key.substring(0, 4) + '••••••••' + key.substring(key.length - 4);
  };

  const getServiceIcon = (service: ApiKey['service']) => {
    switch (service) {
      case 'azure':
        return '🔵';
      case 'tts':
        return '🔊';
      case 'lexicon':
        return '📝';
      default:
        return '🔑';
    }
  };

  const getServiceName = (service: ApiKey['service']) => {
    switch (service) {
      case 'azure':
        return 'Azure';
      case 'tts':
        return 'TTS Service';
      case 'lexicon':
        return 'Lexicon Service';
      default:
        return 'Other';
    }
  };

  if (!account) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">API Keys</h3>
          <p className="text-gray-600 text-sm">Manage your API keys for unlocked applications</p>
        </div>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 font-medium"
        >
          Add API Key
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-4">Add New API Key</h4>
          <form onSubmit={handleAddKey} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Key Name
              </label>
              <input
                type="text"
                value={newKey.name}
                onChange={(e) => setNewKey(prev => ({ ...prev, name: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="e.g., Azure TTS Key"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service
              </label>
              <select
                value={newKey.service}
                onChange={(e) => setNewKey(prev => ({ ...prev, service: e.target.value as ApiKey['service'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <option value="azure">Azure</option>
                <option value="tts">TTS Service</option>
                <option value="lexicon">Lexicon Service</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <input
                type="text"
                value={newKey.key}
                onChange={(e) => setNewKey(prev => ({ ...prev, key: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Enter your API key"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 font-medium"
              >
                {isLoading ? 'Adding...' : 'Add Key'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {account.apiKeys.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No API keys configured yet.</p>
            <p className="text-sm">Add your first API key to get started.</p>
          </div>
        ) : (
          account.apiKeys.map((key) => (
            <div key={key.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getServiceIcon(key.service)}</span>
                <div>
                  <p className="font-medium text-gray-900">{key.name}</p>
                  <p className="text-sm text-gray-600">
                    {getServiceName(key.service)} • {maskKey(key.key)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Added {key.createdAt.toLocaleDateString()}
                    {key.lastUsed && ` • Last used ${key.lastUsed.toLocaleDateString()}`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  key.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {key.isActive ? 'Active' : 'Inactive'}
                </span>
                
                <button
                  onClick={() => handleRemoveKey(key.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Remove API key"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}




