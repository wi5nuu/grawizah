'use client';

import { useState } from 'react';
import { Gift, Users, Copy, Share2, TrendingUp, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';

export default function ReferralPage() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const referralCode = 'GRAW-' + (user?.id || '').slice(0, 8).toUpperCase();
  const referralLink = `https://grawizah.com/register?ref=${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const referralStats = {
    totalInvited: 3,
    joined: 1,
    pending: 2,
    earned: '$15.00',
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-neutral-900">Refer a Friend</h1>
        <p className="text-sm text-neutral-500 mt-1">Invite others and earn rewards together</p>
      </div>

      {/* Hero Card */}
      <Card className="mb-6 p-6 sm:p-8 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <Gift className="w-8 h-8 text-yellow-400" />
            <h2 className="text-xl font-bold">Invite & Earn</h2>
          </div>
          <p className="text-purple-100 text-sm mb-6 max-w-lg">
            Share your referral link and earn $5 for each friend who joins and verifies their account.
            Your friend also gets a 10% discount on their first premium subscription.
          </p>

          {/* Referral Code & Link */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 bg-white/10 backdrop-blur rounded-lg px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-purple-200 uppercase font-medium">Your Referral Link</p>
                <p className="text-sm font-mono truncate">{referralLink}</p>
              </div>
              <button
                onClick={copyToClipboard}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0 ml-3"
              >
                {copied ? (
                  <span className="text-green-400 text-xs font-medium">✓ Copied</span>
                ) : (
                  <Copy className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white/10 backdrop-blur rounded-lg px-4 py-3 text-center">
                <p className="text-[10px] text-purple-200 uppercase font-medium">Referral Code</p>
                <p className="text-sm font-mono font-bold">{referralCode}</p>
              </div>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex gap-2 mt-4">
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg px-3 py-2 text-sm transition-colors">
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 rounded-lg px-3 py-2 text-sm transition-colors">
              <Users className="w-4 h-4" />
              WhatsApp
            </button>
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 rounded-lg px-3 py-2 text-sm transition-colors">
              <Share2 className="w-4 h-4" />
              Email
            </button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Invited', value: referralStats.totalInvited, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Joined', value: referralStats.joined, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Pending', value: referralStats.pending, icon: Gift, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Earned', value: referralStats.earned, icon: DollarSign, color: 'text-blue-600', bg: 'bg-blue-50' },
        ].map((stat, i) => (
          <Card key={i} className="p-4">
            <div className={`w-8 h-8 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center mb-2`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <p className="text-xl font-bold text-neutral-900">{stat.value}</p>
            <p className="text-xs text-neutral-500">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* How It Works */}
      <Card>
        <div className="p-4 border-b border-neutral-100">
          <h2 className="font-semibold text-neutral-900">How It Works</h2>
        </div>
        <div className="p-4 space-y-4">
          {[
            { step: '1', title: 'Share Your Link', desc: 'Send your unique referral link to friends or colleagues.' },
            { step: '2', title: 'Friend Signs Up', desc: 'They register using your link and get 10% off premium.' },
            { step: '3', title: 'Both Get Rewarded', desc: 'You earn $5 and they get a discount on their subscription.' },
          ].map((item) => (
            <div key={item.step} className="flex items-start gap-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-purple-600">{item.step}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-900">{item.title}</p>
                <p className="text-xs text-neutral-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
