'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe, Users, Target, ShieldCheck, ArrowRight, Factory } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-white min-h-screen pt-24">
      {/* Hero */}
      <section className="py-20 bg-neutral-900 text-white overflow-hidden relative">
         <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 -z-0">
            <Globe className="w-full h-full text-white" />
         </div>
         <div className="max-w-[1440px] mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
               <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" dangerouslySetInnerHTML={{ __html: t('foo_about_hero_title' as any) || "Empowering Global Trade Through Intelligence." }}></h1>
               <p className="text-lg md:text-xl text-neutral-400 mb-10 leading-relaxed font-medium">
                 {t('foo_about_hero_desc' as any) || "Grawizah is the world's first AI-driven B2B marketplace designed to bridge the trust gap between emerging markets and global trade compliance."}
               </p>
               <Button className="bg-primary-600 hover:bg-primary-700 text-white px-10 py-5 rounded-2xl text-xl font-bold shadow-2xl transition-all">
                  {t('foo_about_join_mission' as any) || "Join Our Mission"}
               </Button>
            </div>
         </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-neutral-50 border-b border-neutral-100">
         <div className="max-w-[1440px] mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               {[
                 { label: t('foo_about_stat_founded' as any) || "Founded", value: "2024" },
                 { label: t('foo_about_stat_hq' as any) || "Headquarters", value: "Jakarta" },
                 { label: t('foo_about_stat_suppliers' as any) || "Active Suppliers", value: "120K+" },
                 { label: t('foo_about_stat_volume' as any) || "Trade Volume", value: "$2.5B+" }
               ].map((stat, idx) => (
                 <div key={idx} className="text-center">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">{stat.label}</p>
                    <p className="text-3xl md:text-4xl font-bold text-neutral-900">{stat.value}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
         <div className="max-w-[1440px] mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
               <div className="lg:w-1/2">
                  <div className="w-16 h-16 bg-primary-50 rounded-3xl flex items-center justify-center mb-8">
                     <Target className="w-8 h-8 text-primary-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-neutral-900 mb-6">{t('foo_about_mission_title' as any) || "Our Mission"}</h2>
                  <p className="text-neutral-600 text-lg leading-relaxed mb-8 font-medium">
                    {t('foo_about_mission_desc' as any) || "To democratize global trade by providing small and medium enterprises (SMEs) with the same compliance, intelligence, and logistical tools traditionally reserved for Fortune 500 companies."}
                  </p>
                  <ul className="space-y-4">
                     {[
                       t('foo_about_mission_point_1' as any) || "Zero-Barrier Market Entry",
                       t('foo_about_mission_point_2' as any) || "AI-Powered Trust Verification",
                       t('foo_about_mission_point_3' as any) || "Inclusive Global Supply Chains"
                     ].map((item, idx) => (
                       <li key={idx} className="flex items-center gap-3 text-neutral-700 font-bold">
                          <ShieldCheck className="w-5 h-5 text-green-500" /> {item}
                       </li>
                     ))}
                  </ul>
               </div>
               <div className="lg:w-1/2 flex gap-4">
                  <div className="flex-1 bg-neutral-100 h-96 rounded-[3rem] p-12 relative overflow-hidden">
                     <Users className="w-full h-full text-neutral-200 absolute -bottom-10 -right-10" />
                  </div>
                  <div className="flex-1 bg-primary-600 h-96 rounded-[3rem] p-12 mt-12 overflow-hidden">
                     <Factory className="w-full h-full text-primary-400 opacity-20 absolute -bottom-10 -right-10" />
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
