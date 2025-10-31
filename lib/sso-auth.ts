// SSO Authentication Service
// Handles Microsoft Entra ID authentication flow

import { PublicClientApplication, AccountInfo, AuthenticationResult } from '@azure/msal-browser';
import { msalConfig, loginRequest, tokenRequest } from './sso-config';
import { Account } from '@/types/account';

export class SSOAuthService {
  private msalInstance: PublicClientApplication;

  constructor() {
    this.msalInstance = new PublicClientApplication(msalConfig);
  }

  // Initialize MSAL
  async initialize(): Promise<void> {
    await this.msalInstance.initialize();
  }

  // Get current account
  getCurrentAccount(): AccountInfo | null {
    const accounts = this.msalInstance.getAllAccounts();
    return accounts.length > 0 ? accounts[0] : null;
  }

  // Login with Microsoft
  async loginWithMicrosoft(): Promise<AuthenticationResult | null> {
    try {
      const response = await this.msalInstance.loginPopup(loginRequest);
      return response;
    } catch (error) {
      console.error('SSO login failed:', error);
      return null;
    }
  }

  // Get access token
  async getAccessToken(): Promise<string | null> {
    try {
      const account = this.getCurrentAccount();
      if (!account) return null;

      const response = await this.msalInstance.acquireTokenSilent({
        ...tokenRequest,
        account: account,
      });
      return response.accessToken;
    } catch (error) {
      console.error('Token acquisition failed:', error);
      return null;
    }
  }

  // Logout
  async logout(): Promise<void> {
    const account = this.getCurrentAccount();
    if (account) {
      await this.msalInstance.logoutPopup({
        account: account,
      });
    }
  }

  // Convert Microsoft account to our Account type
  convertToAccount(msalAccount: AccountInfo, token: string): Account {
    return {
      id: msalAccount.homeAccountId,
      email: msalAccount.username,
      name: msalAccount.name || msalAccount.username,
      company: undefined, // Will be populated from Microsoft Graph if needed
      role: 'user', // Default role, can be determined from groups/claims
      apiKeys: [],
      preferences: {
        theme: 'auto',
        notifications: true,
      },
      createdAt: new Date(),
      lastLogin: new Date(),
      isActive: true,
    };
  }
}

// Singleton instance
export const ssoAuthService = new SSOAuthService();
