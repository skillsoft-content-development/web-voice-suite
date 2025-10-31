'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SSOCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          setError(`Authentication failed: ${error}`);
          setStatus('error');
          return;
        }

        if (!code) {
          setError('No authorization code received');
          setStatus('error');
          return;
        }

        // Call our SSO callback API
        const response = await fetch('/api/auth/sso/callback?' + window.location.search);
        
        if (response.ok) {
          setStatus('success');
          // Redirect to main page after successful authentication
          setTimeout(() => {
            router.push('/');
          }, 1000);
        } else {
          const data = await response.json();
          setError(data.error || 'Authentication failed');
          setStatus('error');
        }
      } catch (err) {
        setError('Network error during authentication');
        setStatus('error');
      }
    };

    handleCallback();
  }, [router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Completing sign in...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign In Failed</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign In Successful</h1>
        <p className="text-gray-600">Redirecting you to the application...</p>
      </div>
    </div>
  );
}
