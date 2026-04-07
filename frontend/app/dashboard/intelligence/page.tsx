'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Target, Search, BarChart3, Users, Crown, MapPin, TrendingUp, Filter, Download, Lock } from 'lucide-react';
import Link from 'next/link';

export default function IntelligencePage() {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState<'buyer_radar' | 'market_insights'>('buyer_radar');

  const isLocked = role !== 'premium_trader' && role !== 'admin';

  const [buyerRadarLeads, setBuyerRadarLeads] = useState<any[]>([
    { id: 1, name: 'PT Maju Bersama', country: 'Indonesia', score: 89.5, imports: 250, value: '$150M', freq: 'Monthly', products: ['Smart Watches', 'Electronics'] },
    { id: 2, name: 'Syn Trading Sdn Bhd', country: 'Malaysia', score: 92.1, imports: 380, value: '$220M', freq: 'Weekly', products: ['Textiles', 'Machinery'] },
    { id: 3, name: 'Bangkok Import Export', country: 'Thailand', score: 81.3, imports: 200, value: '$120M', freq: 'Monthly', products: ['Automotive', 'Food'] },
    { id: 4, name: 'Cong Ty TNHH ABC', country: 'Vietnam', score: 68.7, imports: 90, value: '$55M', freq: 'Quarterly', products: ['Chemicals'] },
    { id: 5, name: 'Global Sourcing LLC', country: 'USA', score: 95.0, imports: 1200, value: '$850M', freq: 'Daily', products: ['Electronics', 'Industrial'] },
  ]);

  // Optionally fetch real data if backend is available
  useEffect(() => {
    if (!isLocked) {
      import('@/lib/api').then(({ intelligenceAPI }) => {
        intelligenceAPI.getBuyerRadar('Indonesia').then(res => {
          if (res.data?.data && res.data.data.length > 0) {
            // Transform backend data to match UI
            const leads = res.data.data.map((lead: any) => ({
              id: lead.id,
              name: lead.company_name,
              country: lead.target_country,
              score: lead.buy_score,
              imports: lead.import_frequency,
              value: '$' + Math.floor(Math.random() * 500 + 50) + 'M', // Mock value for visual
              freq: 'Monthly',
              products: lead.trade_history_data?.preferred_products || ['Various']
            }));
            setBuyerRadarLeads(leads);
          }
        }).catch(err => console.log('Using seeded local mock data for buyer radar.'));
      });
    }
  }, [isLocked]);

  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 flex items-center gap-2">
            Global Trade Intelligence
            <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
          </h1>
          <p className="text-sm sm:text-base text-neutral-500 mt-1">AI-powered buyer radar and market analytics</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-200 mb-6 relative">
        <button
          className={`px-4 sm:px-6 py-3 font-medium text-sm sm:text-base border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'buyer_radar' ? 'border-primary-600 text-primary-700' : 'border-transparent text-neutral-500 hover:text-neutral-700'
          }`}
          onClick={() => setActiveTab('buyer_radar')}
        >
          <Target className="w-4 h-4" /> Buyer Radar
        </button>
        <button
          className={`px-4 sm:px-6 py-3 font-medium text-sm sm:text-base border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'market_insights' ? 'border-primary-600 text-primary-700' : 'border-transparent text-neutral-500 hover:text-neutral-700'
          }`}
          onClick={() => setActiveTab('market_insights')}
        >
          <BarChart3 className="w-4 h-4" /> Market Insights
        </button>
      </div>

      {/* MAIN CONTENT WRAPPER - BLUR IF LOCKED */}
      <div className={`relative ${isLocked ? 'h-[60vh] overflow-hidden' : ''}`}>
        {/* Filters */}
        <div className={`flex flex-wrap gap-3 mb-6 ${isLocked ? 'blur-[8px] opacity-60 pointer-events-none' : ''} transition-all duration-500`}>
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input type="text" placeholder="Search by HS Code, Country, or Product..." className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <Button variant="outline" className="text-sm shadow-sm bg-white">
            <Filter className="w-4 h-4 mr-2" /> Filters
          </Button>
          <Button variant="outline" className="text-sm shadow-sm bg-white">
            <Download className="w-4 h-4 mr-2" /> Export Data
          </Button>
        </div>

        {/* Content area */}
        <div className={`${isLocked ? 'blur-[8px] opacity-60 pointer-events-none select-none' : ''} transition-all duration-500`}>
          {activeTab === 'buyer_radar' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center"><Users className="w-4 h-4" /></div>
                    <span className="font-semibold text-neutral-900">Total Active Buyers</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-700">12,450</p>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center"><TrendingUp className="w-4 h-4" /></div>
                    <span className="font-semibold text-neutral-900">High Match Score</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700">894</p>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-purple-50 to-fuchsia-50 border-purple-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center"><Target className="w-4 h-4" /></div>
                    <span className="font-semibold text-neutral-900">New Leads Today</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-700">+45</p>
                </Card>
              </div>

              <Card className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Company</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Score</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Imports</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Value</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">Interests</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-neutral-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {buyerRadarLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-4 py-4">
                          <p className="font-semibold text-neutral-900 text-sm">{lead.name}</p>
                          <div className="flex items-center gap-1 mt-1 text-neutral-500 text-xs">
                            <MapPin className="w-3 h-3" /> {lead.country}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-neutral-200 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${lead.score > 90 ? 'bg-green-500' : lead.score > 80 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                                style={{ width: `${lead.score}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-neutral-700">{lead.score}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-neutral-700">
                          {lead.imports} <span className="text-xs text-neutral-500">({lead.freq})</span>
                        </td>
                        <td className="px-4 py-4 font-semibold text-neutral-900 text-sm">{lead.value}</td>
                        <td className="px-4 py-4">
                          <div className="flex flex-wrap gap-1">
                            {lead.products.map((p: string) => (
                              <Badge key={p} className="text-[10px] bg-neutral-100 text-neutral-600 border-neutral-200">{p}</Badge>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <Button size="sm" className="bg-primary-600 hover:bg-primary-700">Pitch Now</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {activeTab === 'market_insights' && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 h-64 flex flex-col items-center justify-center border-dashed bg-neutral-50">
                <BarChart3 className="w-12 h-12 text-neutral-300 mb-3" />
                <p className="text-neutral-500 font-medium text-sm text-center">Export Trends Chart<br/>(AI Predictive Analytics)</p>
              </Card>
              <Card className="p-6 h-64 flex flex-col items-center justify-center border-dashed bg-neutral-50">
                <Target className="w-12 h-12 text-neutral-300 mb-3" />
                <p className="text-neutral-500 font-medium text-sm text-center">Competitor Price Benchmarking<br/>(Real-time API Sync)</p>
              </Card>
            </div>
          )}
        </div>

        {/* LOCKED OVERLAY */}
        {isLocked && (
          <div className="absolute inset-x-0 bottom-0 top-[20%] flex flex-col items-center justify-center z-10 bg-gradient-to-t from-white via-white/80 to-transparent pt-20 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border border-neutral-100 translate-y-12">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-300 shadow-inner">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-2">Premium Intelligence Locked</h3>
              <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
                Unlock <span className="font-semibold text-primary-700">Buyer Radar</span> and <span className="font-semibold text-primary-700">Market Insights</span> to discover high-value importers, check real-time trade history, and pitch directly ahead of your competitors.
              </p>
              <Button className="w-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 shadow-lg mb-3">
                <Crown className="w-4 h-4 mr-2" /> Upgrade to Premium
              </Button>
              <Link href="/pricing" className="text-xs text-neutral-500 hover:text-neutral-900 underline">
                View Pricing Plans
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
