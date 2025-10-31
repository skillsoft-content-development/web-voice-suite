# SSO Integration Setup

This application has been prepared for Microsoft Entra ID SSO integration. The following components have been added:

## What's Been Added

### 1. Dependencies
- `@azure/msal-browser` - Microsoft Authentication Library for browser
- `@azure/msal-react` - React integration for MSAL

### 2. Configuration Files
- `lib/sso-config.ts` - MSAL configuration
- `lib/sso-auth.ts` - SSO authentication service
- `.env.example` - Environment variables template

### 3. API Routes
- `app/api/auth/sso/login/route.ts` - Initiates SSO login
- `app/api/auth/sso/callback/route.ts` - Handles SSO callback

### 4. UI Components
- Updated `LoginForm.tsx` with Microsoft SSO button
- Added `app/auth/callback/page.tsx` for SSO callback handling

### 5. Context Updates
- Updated `AccountContext.tsx` with `loginWithSSO` function

## Next Steps for Cloud Engineering Team

1. **Create Azure App Registration**
   - Register the application in Azure Entra ID
   - Configure redirect URIs:
     - Development: `http://localhost:3000/auth/callback`
     - Production: `https://your-domain.com/auth/callback`

2. **Configure Application Permissions**
   - Add Microsoft Graph permissions:
     - `User.Read` (for basic profile information)
     - Additional permissions as needed for your use case

3. **Provide Configuration Values**
   - Client ID from the app registration
   - Tenant ID (or use 'common' for multi-tenant)
   - Update the `.env` file with actual values

## Environment Variables Required

Copy `.env.example` to `.env` and update with your Azure configuration:

```bash
NEXT_PUBLIC_AZURE_CLIENT_ID=your-actual-client-id
NEXT_PUBLIC_AZURE_AUTHORITY=https://login.microsoftonline.com/your-tenant-id
NEXT_PUBLIC_REDIRECT_URI=http://localhost:3000/auth/callback
```

## Testing

Once the Azure configuration is complete:

1. Start the development server
2. Navigate to the login page
3. Click "Sign in with Microsoft"
4. Complete the Microsoft authentication flow
5. You should be redirected back to the application

## Current Status

- ✅ SSO infrastructure is ready
- ✅ UI components are prepared
- ✅ API routes are implemented
- ⏳ Waiting for Azure configuration from Cloud Engineering team

The application will continue to work with the existing demo authentication until the Azure configuration is provided.
