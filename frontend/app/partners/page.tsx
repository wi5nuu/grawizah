'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe, ShieldCheck, Handshake, Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const partners = [
  { name: "Indonesia Trade Ministry", type: "Government", region: "Southeast Asia", logo: "ITM" },
  { name: "Global Logistics Alliance", type: "Logistics", region: "Worldwide", logo: "GLA" },
  { name: "Stripe Connect", type: "Financial", region: "Global", logo: "STR" },
  { name: "Vietnam Chamber of Commerce", type: "Strategic", region: "Asia", logo: "VCC" }
];

export default function PartnersPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-neutral-50 min-h-screen pt-24 pb-16">
      <div className="max-w-[1440px] mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">{t('footer_partners')}</h1>
          <p className="text-neutral-500">Collaborating with global leaders, government bodies, and logistics powerhouses to build a more transparent trade ecosystem.</p>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
           {["Strategic Partners", "Financial Partners", "Logistics Partners", "Government Partners"].map((cat, idx) => (
             <div key={idx} className="bg-white p-6 rounded-2xl border border-neutral-200 hover:border-primary-500 transition-colors shadow-sm">
                <p className="text-sm font-bold text-neutral-900 flex items-center justify-between">
                  {cat} <ArrowRight className="w-4 h-4 text-primary-600" />
                </p>
             </div>
           ))}
        </div>

        {/* Partner Ecosystem */}
        <div className="bg-neutral-900 rounded-[3rem] p-8 md:p-20 text-white mb-20 overflow-hidden relative">
           <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-600/10 -z-0"></div>
           <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-6 italic text-primary-400">Join the Ecosystem.</h2>
              <p className="text-neutral-400 text-lg leading-relaxed">Grawizah is building the world's most trusted trade ledger. Integrate your services into our platform to access 120M+ active products.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {partners.map((partner, idx) => (
                <div key={idx} className="bg-neutral-800 p-8 rounded-[2rem] border border-neutral-700/50 hover:bg-neutral-700 transition-colors flex flex-col items-center text-center">
                   <div className="w-20 h-20 bg-neutral-900 rounded-3xl flex items-center justify-center mb-6 font-black text-2xl text-primary-500 border border-neutral-700 shadow-xl shadow-neutral-900/50">
                      {partner.logo}
                   </div>
                   <h3 className="text-lg font-bold mb-2">{partner.name}</h3>
                   <span className="text-[10px] uppercase font-bold text-primary-400 py-1 px-3 bg-primary-900/30 rounded-full border border-primary-800/50 mb-4">{partner.type}</span>
                   <p className="text-xs text-neutral-500 uppercase tracking-widest">{partner.region}</p>
                </div>
              ))}
           </div>
        </div>

        {/* Why Partner? */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
           <div className="bg-white p-12 rounded-[3rem] border border-neutral-200">
              <div className="w-16 h-16 bg-primary-100 rounded-3xl flex items-center justify-center mb-8">
                 <Handshake className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-6 italic">Partner Benefits</h3>
              <ul className="space-y-6">
                 {[
                   "Access to Large SME Customer Base",
                   "Verified Counterparty Data (KYC/KYB)",
                   "Deep APIs & Technical Support",
                   "Global Brand Co-Marketing"
                 ].map((benefit, idx) => (
                   <li key={idx} className="flex gap-4 items-start font-bold text-neutral-700 leading-tight">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" /> {benefit}
                   </li>
                 ))}
              </ul>
           </div>
           <div>
              <div className="w-16 h-16 bg-primary-100 rounded-3xl flex items-center justify-center mb-8">
                 <Briefcase className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-6 italic lowercase underline decoration-primary-500/20 underline-offset-8">Become a Grawizah Partner.</h3>
              <p className="text-neutral-500 mb-10 text-lg leading-relaxed">Whether you are a financial institution, a logistics provider, or a technology company, we have a partnership program for you.</p>
              <Button className="bg-primary-600 hover:bg-primary-700 text-white px-10 py-5 rounded-2xl text-xl font-bold shadow-2xl transition-all">
                Send Partnership Request
              </Button>
           </div>
        </div>
      </div>
    </div>
  );
}
