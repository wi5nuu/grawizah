'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { profileAPI } from '@/lib/api';
import { Shield, ShieldCheck, ShieldOff, Eye, EyeOff, Copy, Check, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SettingsPage() {
  const { user, role } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [twoFAEnabled, setTwoFAEnabled] = useState(user?.two_factor_enabled || false);
  const [twoFASecret, setTwoFASecret] = useState('');
  const [twoFACode, setTwoFACode] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleEnable2FA = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await profileAPI.setup2FA(true);
      if (res.data?.data) {
        setTwoFASecret(res.data.data.secret || res.data.data);
        setTwoFAEnabled(true);
        setSuccess('2FA enabled successfully. Scan the QR code or copy the secret into your authenticator app.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to enable 2FA');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!twoFACode || twoFACode.length < 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await profileAPI.verify2FA(twoFACode);
      setSuccess('2FA code verified! Your account is now protected.');
      setTwoFASecret('');
      setTwoFACode('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid 2FA code');
    } finally {
      setLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    setLoading(true);
    setError('');
    try {
      await profileAPI.setup2FA(false);
      setTwoFAEnabled(false);
      setTwoFASecret('');
      setSuccess('2FA has been disabled.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to disable 2FA');
    } finally {
      setLoading(false);
    }
  };

  const copySecret = () => {
    navigator.clipboard.writeText(twoFASecret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (role === 'guest') {
    router.push('/login');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Account Settings</h1>
        <p className="text-neutral-600 mt-1">Manage your security preferences</p>
      </div>

      {/* Error / Success Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Two-Factor Authentication Card */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary-100 rounded-lg">
            <Shield className="w-6 h-6 text-primary-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Two-Factor Authentication (2FA)</h2>
            <p className="text-sm text-neutral-600">
              {twoFAEnabled ? '2FA is enabled — your account is protected' : 'Add an extra layer of security to your account'}
            </p>
          </div>
          {twoFAEnabled && (
            <ShieldCheck className="w-6 h-6 text-green-500 ml-auto" />
          )}
        </div>

        {!twoFAEnabled && !twoFASecret && (
          <div>
            <p className="text-neutral-700 mb-4">
              Enable 2FA using Google Authenticator, Authy, or any TOTP-compatible app.
              After enabling, you will need to enter a 6-digit code each time you log in.
            </p>
            <button
              onClick={handleEnable2FA}
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              {loading ? 'Enabling...' : 'Enable 2FA'}
            </button>
          </div>
        )}

        {twoFASecret && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-semibold text-amber-800 mb-2">Setup Instructions</h3>
              <ol className="list-decimal list-inside text-sm text-amber-700 space-y-1">
                <li>Open your authenticator app (Google Authenticator, Authy, etc.)</li>
                <li>Add a new account manually using this secret key</li>
                <li>Enter the 6-digit code generated by the app below</li>
                <li>Click &quot;Verify&quot; to complete setup</li>
              </ol>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Secret Key</label>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-neutral-100 px-3 py-2 rounded-lg font-mono text-sm">
                  {showSecret ? twoFASecret : '•••• •••• •••• ••••'}
                </code>
                <button
                  onClick={() => setShowSecret(!showSecret)}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                  title={showSecret ? 'Hide' : 'Show'}
                >
                  {showSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={copySecret}
                  className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                  title="Copy"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Verification Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={twoFACode}
                  onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="input-field w-32 text-center text-lg font-mono"
                />
                <button
                  onClick={handleVerify2FA}
                  disabled={loading || twoFACode.length !== 6}
                  className="btn-primary"
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
              </div>
            </div>
          </div>
        )}

        {twoFAEnabled && !twoFASecret && (
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-neutral-700">
                Your account is protected with 2FA. You will need to enter a code from your authenticator app each time you log in.
              </p>
            </div>
            <button
              onClick={handleDisable2FA}
              disabled={loading}
              className="btn-outline flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
            >
              <ShieldOff className="w-4 h-4" />
              {loading ? 'Disabling...' : 'Disable 2FA'}
            </button>
          </div>
        )}
      </Card>

      {/* Profile Info Card */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Profile Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-500 mb-1">Full Name</label>
            <p className="text-neutral-900">{user?.full_name || '—'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-500 mb-1">Email</label>
            <p className="text-neutral-900">{user?.email || '—'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-500 mb-1">Role</label>
            <p className="text-neutral-900 capitalize">{role?.replace('_', ' ')}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-500 mb-1">Email Verified</label>
            <p className="text-neutral-900">{user?.is_email_verified ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
