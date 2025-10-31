import { NextRequest, NextResponse } from 'next/server';
import { MockAuthService } from '@/lib/mock-auth';
import { LoginCredentials } from '@/types/account';

export async function POST(request: NextRequest) {
  try {
    const credentials: LoginCredentials = await request.json();
    
    const result = await MockAuthService.login(credentials);
    
    if (result.success) {
      // Set HTTP-only cookie for token
      const response = NextResponse.json({ 
        success: true, 
        account: result.account 
      });
      
      response.cookies.set('auth-token', result.token!, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });
      
      return response;
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Invalid request' 
    }, { status: 400 });
  }
}

