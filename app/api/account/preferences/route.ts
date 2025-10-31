import { NextRequest, NextResponse } from 'next/server';
import { MockAuthService } from '@/lib/mock-auth';

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'Not authenticated' 
      }, { status: 401 });
    }
    
    const preferences = await request.json();
    const result = await MockAuthService.updatePreferences(token, preferences);
    
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update preferences' 
    }, { status: 500 });
  }
}




