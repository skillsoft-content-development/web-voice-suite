'use client';

import { useState } from 'react';
import { useAccount } from '@/contexts/AccountContext';
import LoginForm from '../auth/LoginForm';
import RegisterForm from '../auth/RegisterForm';
import AccountHeader from './AccountHeader';
import ApiKeyManager from './ApiKeyManager';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccountModal({ isOpen, onClose }: AccountModalProps) {
  const { account, loading } = useAccount();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex">
          {/* Left side - Auth forms */}
          <div className="w-1/2 p-8 flex items-center justify-center bg-gray-50">
            {loading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading...</p>
              </div>
            ) : account ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">
                    {account.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Welcome back!</h3>
                <p className="text-gray-600">You're already signed in as {account.name}</p>
              </div>
            ) : authMode === 'login' ? (
              <LoginForm 
                onSuccess={onClose}
                onSwitchToRegister={() => setAuthMode('register')}
              />
            ) : (
              <RegisterForm 
                onSuccess={onClose}
                onSwitchToLogin={() => setAuthMode('login')}
              />
            )}
          </div>

          {/* Right side - Account management */}
          <div className="w-1/2 p-8 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Account Management</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {account ? (
              <div className="space-y-6">
                <AccountHeader />
                <ApiKeyManager />
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Sign in to manage your account</h3>
                <p className="text-gray-600">Access your API keys and preferences</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
