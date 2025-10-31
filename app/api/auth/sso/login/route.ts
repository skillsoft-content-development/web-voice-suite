import { NextRequest, NextResponse } from 'next/server';
import { ssoAuthService } from '@/lib/sso-auth';

export async function GET(request: NextRequest) {
  try {
    // Initialize SSO service
    await ssoAuthService.initialize();
    
    // Redirect to Microsoft login
    const authUrl = await ssoAuthService.loginWithMicrosoft();
    
    if (authUrl) {
      return NextResponse.redirect(authUrl);
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to initiate SSO login' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('SSO login initiation error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'SSO login failed' 
    }, { status: 500 });
  }
}
