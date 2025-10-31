import { NextRequest, NextResponse } from 'next/server';
import { MockAuthService } from '@/lib/mock-auth';
import { ApiKeyFormData } from '@/types/account';

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
        error: 'Invalid token' 
      }, { status: 401 });
    }
    
    return NextResponse.json({ 
      success: true, 
      apiKeys: account.apiKeys 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch API keys' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ 
        success: false, 
        error: 'Not authenticated' 
      }, { status: 401 });
    }
    
    const keyData: ApiKeyFormData = await request.json();
    const result = await MockAuthService.addApiKey(token, keyData);
    
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
      error: 'Failed to add API key' 
    }, { status: 500 });
  }
}




