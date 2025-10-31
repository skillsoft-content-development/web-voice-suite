// Account system types for mock authentication
// Designed to be easily converted to Microsoft Entra ID SSO later

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  service: 'tts' | 'lexicon' | 'azure' | 'other';
  createdAt: Date;
  lastUsed?: Date;
  isActive: boolean;
}

export interface Account {
  id: string;
  email: string;
  name: string;
  company?: string;
  role: 'admin' | 'user' | 'viewer';
  apiKeys: ApiKey[];
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    defaultTtsVoice?: string;
  };
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  company?: string;
}

export interface AuthResponse {
  success: boolean;
  account?: Account;
  token?: string;
  error?: string;
}

export interface ApiKeyFormData {
  name: string;
  key: string;
  service: ApiKey['service'];
}

// Future SSO compatibility types
export interface SSOProvider {
  id: string;
  name: string;
  type: 'microsoft' | 'google' | 'okta' | 'saml';
  enabled: boolean;
  config?: Record<string, any>;
}

export interface SSOAccount extends Omit<Account, 'password'> {
  ssoProvider: SSOProvider;
  ssoId: string;
  password?: never; // SSO accounts don't have passwords
}

