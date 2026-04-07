'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, MapPin, BarChart2, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const buyers = [
  { name: "Global Retail Alliance", country: "USA", active_buying: "$12M+", frequency: "Weekly", focus: "Consumer Electronics" },
  { name: "Asian Mart Distribution", country: "Singapore", active_buying: "$5M+", frequency: "Monthly", focus: "Fresh Produce" },
  { name: "EuroBuild Group", country: "Germany", active_buying: "$20M+", frequency: "Quarterly", focus: "Construction Materials" },
  { name: "MENA Trade Corp", country: "UAE", active_buying: "$8M+", frequency: "Bi-weekly", focus: "Machinery" },
  { name: "Oceania Logistics", country: "Australia", active_buying: "$3M+", frequency: "Monthly", focus: "Automotive Parts" },
  { name: "LatAm Ventures", country: "Brazil", active_buying: "$15M+", frequency: "Monthly", focus: "Infrastructure" }
];

export default function BuyersPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-neutral-50 min-h-screen pt-24 pb-16">
      <div className="max-w-[1440px] mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">{t('footer_buyers')}</h1>
          <p className="text-neutral-500 max-w-2xl">Connect with millions of certified buyers and strategic purchase partners from 190+ countries.</p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search for buying groups, retail alliances, or corporate buyers..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-neutral-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-2">
            <Button className="bg-primary-600 hover:bg-primary-700 text-white px-8 rounded-2xl font-bold">
              Find Buyers
            </Button>
          </div>
        </div>

        {/* Buyer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buyers.map((buyer, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-neutral-200 hover:border-primary-500 transition-all duration-300 hover:shadow-2xl shadow-neutral-900/5 group">
              <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center p-3">
                  <Users className="w-8 h-8 text-primary-600" />
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Buy Volume</span>
                   <span className="text-lg font-bold text-green-600">{buyer.active_buying}</span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-neutral-900 mb-2 truncate group-hover:text-primary-600 transition-colors">
                {buyer.name}
              </h3>
              
              <div className="flex items-center gap-2 text-sm text-neutral-500 mb-8 font-medium">
                <MapPin className="w-3.5 h-3.5" /> {buyer.country}
                <span className="w-1 h-1 bg-neutral-300 rounded-full mx-2"></span>
                <span className="text-primary-600 font-bold">{buyer.focus}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-neutral-100">
                <div>
                   <p className="text-[10px] font-bold text-neutral-400 uppercase mb-1">Frequency</p>
                   <p className="text-sm font-bold text-neutral-700 flex items-center gap-1.5">
                     <TrendingUp className="w-3.5 h-3.5 text-primary-500" /> {buyer.frequency}
                   </p>
                </div>
                <div className="flex justify-end items-end">
                  <button className="text-primary-600 hover:text-primary-700 font-bold text-sm flex items-center gap-1 group/btn mb-1">
                    Details <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
