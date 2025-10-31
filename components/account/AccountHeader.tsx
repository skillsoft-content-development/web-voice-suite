'use client';

import { useAccount } from '@/contexts/AccountContext';

export default function AccountHeader() {
  const { account, logout } = useAccount();

  if (!account) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {account.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{account.name}</h2>
            <p className="text-gray-600">{account.email}</p>
            {account.company && (
              <p className="text-sm text-gray-500">{account.company}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-medium text-gray-900 capitalize">{account.role}</p>
          </div>
          
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}




