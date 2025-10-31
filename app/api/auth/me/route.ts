import { NextRequest, NextResponse } from 'next/server';
import { MockAuthService } from '@/lib/mock-auth';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'Not authenticated' 
      }, { status: 401 });
    }
    
    const account = await MockAuthService.getAccountByToken(token);
    
    if (!account) {
      return NextResponse.json({ 
        success: false, 
        error: 'Not authenticated' 
      }, { status: 401 });
    }
    
    return NextResponse.json({ 
      success: true, 
      account 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Authentication check failed' 
    }, { status: 500 });
  }
}

