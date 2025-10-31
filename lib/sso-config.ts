// Microsoft Entra ID SSO Configuration
// This will be configured by your Cloud Engineering team

export const msalConfig = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || 'your-client-id-here',
    authority: process.env.NEXT_PUBLIC_AZURE_AUTHORITY || 'https://login.microsoftonline.com/your-tenant-id',
    redirectUri: process.env.NEXT_PUBLIC_REDIRECT_URI || 'http://localhost:3000/auth/callback',
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ['User.Read'],
  prompt: 'select_account',
};

export const tokenRequest = {
  scopes: ['User.Read'],
};
