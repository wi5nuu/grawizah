'use client';

import { Users, TrendingUp, Package, DollarSign, ChevronRight, Star, Globe } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';

export default function ResellerPage() {
  const { user, role } = useAuth();

  const isPremium = role === 'premium_trader' || role === 'admin';

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-neutral-900">Reseller Hub</h1>
        <p className="text-sm text-neutral-500 mt-1">Become a reseller and grow your business globally</p>
      </div>

      {!isPremium ? (
        /* Upgrade Prompt */
        <Card className="p-8 text-center bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-2">Premium Feature</h2>
          <p className="text-sm text-neutral-600 mb-4 max-w-md mx-auto">
            The Reseller Hub is available for Premium Trader subscribers. Upgrade to access reseller tools,
            wholesale pricing, and global distribution networks.
          </p>
          <Link
            href="/dashboard/subscription"
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            Upgrade to Premium
          </Link>
        </Card>
      ) : (
        /* Reseller Dashboard */
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Total Resellers', value: '12', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Active Deals', value: '5', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Products Listed', value: '34', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Revenue (Est.)', value: '$12.4K', icon: DollarSign, color: 'text-yellow-600', bg: 'bg-yellow-50' },
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

          {/* Reseller Network */}
          <Card className="mb-6">
            <div className="p-4 border-b border-neutral-100">
              <h2 className="font-semibold text-neutral-900">Reseller Network</h2>
            </div>
            <div className="p-8 text-center">
              <Globe className="w-12 h-12 mx-auto mb-4 text-purple-300" />
              <p className="text-sm text-neutral-500">Your reseller network is being built. Connect with global partners to expand your reach.</p>
            </div>
          </Card>

          {/* Top Resellers */}
          <Card>
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="font-semibold text-neutral-900">Top Performing Resellers</h2>
              <Link href="#" className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-neutral-100">
              {[
                { name: 'PT Global Trading', country: '🇮 Indonesia', deals: 8, revenue: '$4,200', rating: 4.9 },
                { name: 'Euro Import GmbH', country: '🇩🇪 Germany', deals: 5, revenue: '$3,100', rating: 4.7 },
                { name: 'Asia Distributors', country: '🇯🇵 Japan', deals: 3, revenue: '$1,800', rating: 4.5 },
              ].map((reseller, i) => (
                <div key={i} className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {reseller.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900">{reseller.name}</p>
                    <p className="text-xs text-neutral-500">{reseller.country} · {reseller.deals} deals</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-neutral-900">{reseller.revenue}</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs text-neutral-600">{reseller.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
