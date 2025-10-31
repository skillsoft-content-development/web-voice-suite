import { NextRequest, NextResponse } from 'next/server';
import { MockAuthService } from '@/lib/mock-auth';
import { RegisterData } from '@/types/account';

export async function POST(request: NextRequest) {
  try {
    const data: RegisterData = await request.json();
    
    const result = await MockAuthService.register(data);
    
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
      }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Invalid request' 
    }, { status: 400 });
  }
}

