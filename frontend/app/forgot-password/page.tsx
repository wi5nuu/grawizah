'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { api } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/password/reset', { email });
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <img src="/images/android-chrome-192x192.png" alt="Grawizah" className="w-12 h-12 rounded-xl" />
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Grawizah</h1>
              <p className="text-xs text-neutral-500">Intelligence Hub</p>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-card p-6 sm:p-8">
          {!sent ? (
            <>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>

              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-1">Forgot Password?</h2>
              <p className="text-neutral-500 mb-6 text-sm">
                No worries, enter your email and we'll send you a reset link.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="username@gmail.com"
                  icon={<Mail className="w-5 h-5" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Button type="submit" className="w-full" loading={loading}>
                  Send Reset Link
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-neutral-900 mb-2">Check Your Email</h2>
              <p className="text-neutral-500 text-sm mb-2">
                We've sent a password reset link to:
              </p>
              <p className="text-purple-600 font-medium text-sm mb-6">{email}</p>
              <p className="text-xs text-neutral-400 mb-6">
                Didn't receive it? Check your spam folder or{' '}
                <button onClick={() => setSent(false)} className="text-purple-600 hover:underline">
                  try again
                </button>
              </p>
              <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-purple-600 font-medium hover:text-purple-700">
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
