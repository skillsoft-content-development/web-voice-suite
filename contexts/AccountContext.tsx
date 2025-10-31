'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Account, ApiKey, ApiKeyFormData } from '@/types/account';

interface AccountContextType {
  account: Account | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithSSO: () => Promise<boolean>;
  register: (email: string, password: string, name: string, company?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  addApiKey: (keyData: ApiKeyFormData) => Promise<boolean>;
  removeApiKey: (keyId: string) => Promise<boolean>;
  updatePreferences: (preferences: Partial<Account['preferences']>) => Promise<boolean>;
  refreshAccount: () => Promise<void>;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      
      if (data.success) {
        setAccount(data.account);
        setError(null);
      } else {
        setAccount(null);
        // Don't set error for "Not authenticated" - this is normal for unauthenticated users
        if (data.error !== 'Not authenticated') {
          setError(data.error || 'Authentication failed');
        }
      }
    } catch (err) {
      setAccount(null);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Attempting login with:', { email, password });
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      console.log('Login response status:', response.status);
      const data = await response.json();
      console.log('Login response data:', data);
      
      if (data.success) {
        setAccount(data.account);
        return true;
      } else {
        setError(data.error || 'Login failed');
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loginWithSSO = async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      // Redirect to Microsoft login
      const ssoUrl = new URL('/api/auth/sso/login', window.location.origin);
      window.location.href = ssoUrl.toString();
      
      return true; // Will be handled by callback
    } catch (err) {
      setError('SSO login failed');
      setLoading(false);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string, company?: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, company })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setAccount(data.account);
        return true;
      } else {
        setError(data.error || 'Registration failed');
        return false;
      }
    } catch (err) {
      setError('Network error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      // Continue with logout even if API call fails
    } finally {
      setAccount(null);
      setError(null);
    }
  };

  const addApiKey = async (keyData: ApiKeyFormData): Promise<boolean> => {
    try {
      const response = await fetch('/api/account/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(keyData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        await refreshAccount(); // Refresh account data
        return true;
      } else {
        setError(data.error || 'Failed to add API key');
        return false;
      }
    } catch (err) {
      setError('Network error');
      return false;
    }
  };

  const removeApiKey = async (keyId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/account/api-keys/${keyId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (data.success) {
        await refreshAccount(); // Refresh account data
        return true;
      } else {
        setError(data.error || 'Failed to remove API key');
        return false;
      }
    } catch (err) {
      setError('Network error');
      return false;
    }
  };

  const updatePreferences = async (preferences: Partial<Account['preferences']>): Promise<boolean> => {
    try {
      const response = await fetch('/api/account/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      });
      
      const data = await response.json();
      
      if (data.success) {
        await refreshAccount(); // Refresh account data
        return true;
      } else {
        setError(data.error || 'Failed to update preferences');
        return false;
      }
    } catch (err) {
      setError('Network error');
      return false;
    }
  };

  const refreshAccount = async (): Promise<void> => {
    await checkAuth();
  };

  const value: AccountContextType = {
    account,
    loading,
    error,
    login,
    loginWithSSO,
    register,
    logout,
    addApiKey,
    removeApiKey,
    updatePreferences,
    refreshAccount
  };

  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
}

