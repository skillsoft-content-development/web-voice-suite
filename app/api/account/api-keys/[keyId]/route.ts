import { NextRequest, NextResponse } from 'next/server';
import { MockAuthService } from '@/lib/mock-auth';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { keyId: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'Not authenticated' 
      }, { status: 401 });
    }
    
    const result = await MockAuthService.removeApiKey(token, params.keyId);
    
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
      error: 'Failed to remove API key' 
    }, { status: 500 });
  }
}




