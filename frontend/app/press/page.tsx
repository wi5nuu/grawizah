'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Newspaper, Bell, Download, ArrowRight, Share2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const pressReleases = [
  { title: "Grawizah Announces 2026 Series B Funding for AI Expansion", date: "April 1, 2026", category: "Corporate" },
  { title: "Grawizah Partners with Global Trade Alliance for SME Digitalization", date: "March 15, 2026", category: "Partnerships" },
  { title: "Grawizah Launches Revolutionary Real-Time HS Code Classifier", date: "February 28, 2026", category: "Product" },
  { title: "Grawizah Awarded Best AI Trade Platform at Davos 2026", date: "January 20, 2026", category: "Awards" }
];

export default function PressPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-neutral-50 min-h-screen pt-24 pb-16">
      <div className="max-w-[1440px] mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">{t('footer_press')}</h1>
          <p className="text-neutral-500">The latest news, media assets, and official announcements from Grawizah Intelligence Hub.</p>
        </div>

        {/* Media Kit CTA */}
        <div className="bg-primary-600 rounded-[3rem] p-8 md:p-16 text-white mb-16 flex flex-col md:flex-row items-center justify-between gap-8">
           <div>
              <h2 className="text-3xl font-bold mb-4">Official Media Kit</h2>
              <p className="text-primary-100 max-w-lg mb-8">Download high-resolution logos, executive headshots, and company backgrounders for your coverage.</p>
              <Button className="bg-white text-primary-600 hover:bg-neutral-100 px-8 py-4 rounded-xl font-bold flex items-center gap-2">
                Download Kit (45MB) <Download className="w-5 h-5" />
              </Button>
           </div>
           <div className="w-48 h-48 bg-primary-700/50 rounded-3xl flex items-center justify-center border border-primary-500/30">
              <Newspaper className="w-24 h-24 text-white opacity-50" />
           </div>
        </div>

        {/* Press Releases */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8">Press Releases</h2>
          {pressReleases.map((press, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-neutral-200 hover:border-primary-500 transition-all duration-300 hover:shadow-xl group flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                 <div className="inline-block px-3 py-1 bg-neutral-100 text-neutral-500 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">
                   {press.category}
                 </div>
                 <h3 className="text-xl font-bold text-neutral-900 mb-4 group-hover:text-primary-600 transition-colors">
                   {press.title}
                 </h3>
                 <div className="flex items-center gap-4 text-xs text-neutral-400 font-medium">
                    <span className="flex items-center gap-1.5 font-bold text-neutral-500"><Bell className="w-3.5 h-3.5" /> News Release</span>
                    <span className="w-1 h-1 bg-neutral-300 rounded-full mx-2"></span>
                    <span>March 15, 2026</span>
                 </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline" className="rounded-xl px-10 border-neutral-200 hover:bg-neutral-50 font-bold group-hover:scale-105 transition-all">
                  Full Story <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Press Contact */}
        <div className="mt-20 flex flex-col md:flex-row gap-12 max-w-4xl mx-auto items-center p-12 bg-neutral-900 rounded-[3rem] text-white">
           <div className="flex-1">
              <h3 className="text-2xl font-bold mb-4">Media Inquiries</h3>
              <p className="text-neutral-400 mb-6">Are you a journalist or analyst? Our media relations team is here to help with your stories.</p>
              <p className="text-primary-400 font-bold text-lg">press@grawizah.com</p>
           </div>
           <div className="flex gap-4">
              <div className="w-14 h-14 bg-neutral-800 rounded-2xl flex items-center justify-center hover:bg-primary-600 transition-colors cursor-pointer">
                 <Share2 className="w-6 h-6" />
              </div>
              <div className="w-14 h-14 bg-neutral-800 rounded-2xl flex items-center justify-center hover:bg-primary-600 transition-colors cursor-pointer">
                 <MessageCircle className="w-6 h-6" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
