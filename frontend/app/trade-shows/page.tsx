'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Calendar, MapPin, Globe, ArrowRight, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const shows = [
  { name: "Global Electronics Expo 2026", date: "June 15-20, 2026", location: "Shenzhen, China", hybrid: true, category: "Electronics" },
  { name: "AgriTrade Summit Indonesia", date: "August 10-12, 2026", location: "Jakarta, Indonesia", hybrid: false, category: "Agriculture" },
  { name: "Canton Fair Phase 1", date: "October 15-19, 2026", location: "Guangzhou, China", hybrid: true, category: "Multi-sector" },
  { name: "Dubai Logistics Forum", date: "November 5-7, 2026", location: "Dubai, UAE", hybrid: true, category: "Industrial" }
];

export default function TradeShowsPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-neutral-50 min-h-screen pt-24 pb-16">
      <div className="max-w-[1440px] mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mb-16 px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">{t('footer_trade_shows')}</h1>
          <p className="text-neutral-500">Discover and join the world's leading trade exhibitions. Connect with partners in person or through our hybrid Grawizah Digital Booths.</p>
        </div>

        {/* Featured Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {shows.map((show, idx) => (
            <div key={idx} className="bg-white rounded-[2.5rem] p-8 border border-neutral-200 hover:border-primary-500 transition-all duration-300 hover:shadow-2xl shadow-neutral-900/5 group flex flex-col md:flex-row gap-8">
              <div className="md:w-32 md:h-32 bg-primary-50 rounded-3xl flex flex-col items-center justify-center p-4 text-primary-600 flex-shrink-0">
                <Calendar className="w-8 h-8 mb-2" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{show.date.split(' ')[0]} {show.date.split(' ')[1]}</span>
              </div>
              
              <div className="flex-1">
                 <div className="inline-block px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-[10px] font-bold uppercase mb-3 tracking-widest">
                   {show.category}
                 </div>
                 <h3 className="text-xl font-bold text-neutral-900 mb-4 group-hover:text-primary-600 transition-colors">
                   {show.name}
                 </h3>
                 <div className="space-y-2 mb-8">
                   <div className="flex items-center gap-2 text-sm text-neutral-500">
                     <MapPin className="w-4 h-4" /> {show.location}
                   </div>
                   {show.hybrid && (
                     <div className="flex items-center gap-2 text-sm text-green-600 font-bold">
                       <Globe className="w-4 h-4" /> Hybrid / Digital Access Available
                     </div>
                   )}
                 </div>
                 
                 <div className="flex gap-3">
                   <Button className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl px-6 py-2 h-auto text-sm font-bold">
                     Get Passes
                   </Button>
                   <Button variant="outline" className="rounded-xl px-4 py-2 h-auto text-sm font-bold flex items-center gap-2 border-neutral-200">
                     Official Website <ExternalLink className="w-4 h-4" />
                   </Button>
                 </div>
              </div>
            </div>
          ))}
        </div>

        {/* Digital Booth CTA */}
        <div className="bg-neutral-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-600/10 -z-0"></div>
           <div className="relative z-10 max-w-2xl">
             <h2 className="text-3xl font-bold mb-6">Can't travel? Join via Grawizah V-Booth.</h2>
             <p className="text-neutral-400 mb-8 max-w-lg leading-relaxed text-lg">
               Our virtual booth technology allows you to explore product showcases, 3D manufacturing demos, and have real-time video meetings with exhibitors.
             </p>
             <Button className="bg-primary-600 hover:bg-primary-700 text-white rounded-2xl px-10 py-5 h-auto text-xl font-bold shadow-xl shadow-primary-600/20">
               Explore V-Booths <ArrowRight className="w-5 h-5 ml-2" />
             </Button>
           </div>
        </div>
      </div>
    </div>
  );
}
