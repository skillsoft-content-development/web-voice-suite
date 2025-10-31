// Mock authentication system
// This will be replaced with Microsoft Entra ID SSO integration

import { Account, LoginCredentials, RegisterData, AuthResponse, ApiKey, ApiKeyFormData } from '@/types/account';

// Mock database - in production this would be a real database
const mockAccounts: Account[] = [
  {
    id: '1',
    email: 'demo@skillsoft.com',
    name: 'Demo User',
    company: 'Skillsoft',
    role: 'admin',
    apiKeys: [
      {
        id: 'key-1',
        name: 'Skillsoft Web TTS',
        key: '9nu4cLiiufdsbmILegTf2tPktZTBixeJyRi5antrz8qWU4SMUiENJQQJ99BHACYeBjFXJ3w3AAAYACOGhLYc',
        service: 'tts',
        createdAt: new Date('2024-01-15'),
        lastUsed: new Date('2024-01-20'),
        isActive: true
      },
      {
        id: 'key-2',
        name: 'Skillsoft Lexicon Editor',
        key: 'Gz21v4tVk+UTX+JJXdYLGZE9h7ChWfScJvRzPBdmzIalw3pbkOIaiFK/l8pXipnIj8dpNY+VMI32+ASt8KsC9Q==',
        service: 'lexicon',
        createdAt: new Date('2024-01-16'),
        lastUsed: new Date('2024-01-21'),
        isActive: true
      }
    ],
    preferences: {
      theme: 'auto',
      notifications: true,
      defaultTtsVoice: 'en-US-AriaNeural'
    },
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date(),
    isActive: true
  }
];

// Simple token generation (in production, use JWT)
let tokenCounter = 1;
const activeTokens = new Map<string, string>(); // token -> accountId

export class MockAuthService {
  // Login with email/password
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log('Login attempt:', { email: credentials.email, password: credentials.password });
    
    const account = mockAccounts.find(acc => 
      acc.email === credentials.email && 
      acc.isActive
    );

    console.log('Found account:', account);

    if (!account) {
      return { success: false, error: 'Invalid credentials' };
    }

    // Mock password check (in production, use proper hashing)
    if (credentials.password !== 'demo123') {
      console.log('Password mismatch:', { expected: 'demo123', received: credentials.password });
      return { success: false, error: 'Invalid credentials' };
    }

    // Generate token
    const token = `mock-token-${tokenCounter++}`;
    activeTokens.set(token, account.id);

    // Update last login
    account.lastLogin = new Date();

    return {
      success: true,
      account,
      token
    };
  }

  // Register new account
  static async register(data: RegisterData): Promise<AuthResponse> {
    // Check if email already exists
    if (mockAccounts.some(acc => acc.email === data.email)) {
      return { success: false, error: 'Email already registered' };
    }

    // Create new account
    const newAccount: Account = {
      id: `account-${Date.now()}`,
      email: data.email,
      name: data.name,
      company: data.company,
      role: 'user',
      apiKeys: [],
      preferences: {
        theme: 'auto',
        notifications: true
      },
      createdAt: new Date(),
      isActive: true
    };

    mockAccounts.push(newAccount);

    // Auto-login after registration
    const token = `mock-token-${tokenCounter++}`;
    activeTokens.set(token, newAccount.id);

    return {
      success: true,
      account: newAccount,
      token
    };
  }

  // Get account by token
  static async getAccountByToken(token: string): Promise<Account | null> {
    const accountId = activeTokens.get(token);
    if (!accountId) return null;

    return mockAccounts.find(acc => acc.id === accountId) || null;
  }

  // Logout
  static async logout(token: string): Promise<boolean> {
    return activeTokens.delete(token);
  }

  // Add API key to account
  static async addApiKey(token: string, keyData: ApiKeyFormData): Promise<{ success: boolean; error?: string }> {
    const account = await this.getAccountByToken(token);
    if (!account) {
      return { success: false, error: 'Invalid token' };
    }

    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      name: keyData.name,
      key: keyData.key,
      service: keyData.service,
      createdAt: new Date(),
      isActive: true
    };

    account.apiKeys.push(newKey);
    return { success: true };
  }

  // Remove API key from account
  static async removeApiKey(token: string, keyId: string): Promise<{ success: boolean; error?: string }> {
    const account = await this.getAccountByToken(token);
    if (!account) {
      return { success: false, error: 'Invalid token' };
    }

    const keyIndex = account.apiKeys.findIndex(key => key.id === keyId);
    if (keyIndex === -1) {
      return { success: false, error: 'API key not found' };
    }

    account.apiKeys.splice(keyIndex, 1);
    return { success: true };
  }

  // Update account preferences
  static async updatePreferences(token: string, preferences: Partial<Account['preferences']>): Promise<{ success: boolean; error?: string }> {
    const account = await this.getAccountByToken(token);
    if (!account) {
      return { success: false, error: 'Invalid token' };
    }

    account.preferences = { ...account.preferences, ...preferences };
    return { success: true };
  }

  // Get all accounts (admin only)
  static async getAllAccounts(token: string): Promise<Account[] | null> {
    const account = await this.getAccountByToken(token);
    if (!account || account.role !== 'admin') {
      return null;
    }

    return mockAccounts;
  }
}

