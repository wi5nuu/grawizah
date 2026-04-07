'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, ShieldCheck, Factory, Filter, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/Button';

const suppliers = [
  { name: "Shenzhen Starmax Technology", country: "China", category: "Electronics", rating: 4.9, verified: true, products: 120 },
  { name: "IndoFresh Agriculture", country: "Indonesia", category: "Food & Beverage", rating: 4.8, verified: true, products: 45 },
  { name: "Vietnam Textile Experts", country: "Vietnam", category: "Apparel", rating: 4.7, verified: true, products: 89 },
  { name: "Bavarian Machine Tools", country: "Germany", category: "Machinery", rating: 4.9, verified: true, products: 32 },
  { name: "Tokyo Precision Components", country: "Japan", category: "Manufacturing", rating: 5.0, verified: true, products: 156 },
  { name: "Istanbul Leather Goods", country: "Turkey", category: "Textiles", rating: 4.6, verified: true, products: 72 }
];

export default function SuppliersPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-neutral-50 min-h-screen pt-24 pb-16">
      <div className="max-w-[1440px] mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">{t('footer_suppliers')}</h1>
          <p className="text-neutral-500 max-w-2xl">Connect with millions of verified global manufacturers and strategic trade partners.</p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search for suppliers, manufacturers, or trading companies..."
              className="w-full pl-12 pr-4 py-4 bg-white border border-neutral-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2 bg-white rounded-2xl px-6 border-neutral-200">
              <Filter className="w-4 h-4" /> Filter
            </Button>
            <Button className="bg-primary-600 hover:bg-primary-700 text-white px-8 rounded-2xl font-bold">
              Search
            </Button>
          </div>
        </div>

        {/* Supplier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((supplier, idx) => (
            <div key={idx} className="bg-white p-6 rounded-[2rem] border border-neutral-200 hover:border-primary-500 transition-all duration-300 hover:shadow-xl shadow-neutral-900/5 group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center p-3">
                  <Factory className="w-8 h-8 text-neutral-400" />
                </div>
                {supplier.verified && (
                  <div className="flex items-center gap-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase px-2 py-1 rounded-full border border-green-200">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </div>
                )}
              </div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2 truncate group-hover:text-primary-600 transition-colors">
                {supplier.name}
              </h3>
              <div className="flex items-center gap-3 text-xs text-neutral-500 mb-6 font-medium">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {supplier.country}</span>
                <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
                <span className="text-primary-600">{supplier.category}</span>
              </div>
              
              <div className="flex items-center justify-between pt-6 border-t border-neutral-100">
                <div className="flex items-center gap-1 text-sm font-bold text-neutral-900">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {supplier.rating}
                  <span className="text-neutral-400 font-medium ml-1">({supplier.products}+ items)</span>
                </div>
                <button className="text-primary-600 hover:text-primary-700 font-bold text-sm flex items-center gap-1 group/btn">
                  Profile <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
