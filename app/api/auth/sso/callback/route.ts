import { NextRequest, NextResponse } from 'next/server';
import { ssoAuthService } from '@/lib/sso-auth';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    
    if (!code) {
      return NextResponse.json({ 
        success: false, 
        error: 'Authorization code not found' 
      }, { status: 400 });
    }

    // Initialize SSO service
    await ssoAuthService.initialize();
    
    // Get current account from MSAL
    const account = ssoAuthService.getCurrentAccount();
    if (!account) {
      return NextResponse.json({ 
        success: false, 
        error: 'No authenticated account found' 
      }, { status: 401 });
    }

    // Get access token
    const token = await ssoAuthService.getAccessToken();
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to acquire access token' 
      }, { status: 401 });
    }

    // Convert to our account format
    const userAccount = ssoAuthService.convertToAccount(account, token);

    // Set HTTP-only cookie for token
    const response = NextResponse.redirect(new URL('/', request.url));
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error) {
    console.error('SSO callback error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'SSO authentication failed' 
    }, { status: 500 });
  }
}
