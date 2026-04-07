'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      
      // Ambil provider dari localStorage (fallback ke google jika hilang)
      const provider = localStorage.getItem('oauth_provider') || 'google';
      localStorage.removeItem('oauth_provider'); // Bersihkan agar tidak nyangkut

      if (!code) {
        setError('No authorization code found');
        setTimeout(() => router.push('/login'), 3000);
        return;
      }

      try {
        const response = await authAPI.oauthLogin(provider, code);
        
        if (response.data.success) {
          localStorage.setItem('token', response.data.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.data.user));
          router.push('/dashboard');
        } else {
          setError(response.data.error || 'Login failed');
          setTimeout(() => router.push('/login'), 3000);
        }
      } catch (err: any) {
        console.error('OAuth callback error:', err);
        setError(err.response?.data?.error || 'Authentication failed. Redirecting...');
        setTimeout(() => router.push('/login'), 3000);
      }
    };

    handleCallback();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-card max-w-sm w-full text-center">
        {!error ? (
          <>
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Authenticating...</h2>
            <p className="text-neutral-500">Please wait while we complete your secure login.</p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Login Failed</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-xs text-neutral-400 font-medium italic">Redirecting you back to login...</p>
          </>
        )}
      </div>
    </div>
  );
}
