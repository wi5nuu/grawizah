'use client';

import React from 'react';
import Link from 'next/link';
import { LucideIcon, ArrowRight, CheckCircle2, Shield, Zap, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/Button';

interface AIFeatureTemplateProps {
  titleKey: string;
  descKey: string;
  icon: LucideIcon;
  benefitsKey: string;
  howItWorks: { stepKey: string; descKey: string }[];
  accentColor?: string;
}

export default function AIFeatureTemplate({
  titleKey,
  descKey,
  icon: Icon,
  benefitsKey,
  howItWorks,
  accentColor = 'primary'
}: AIFeatureTemplateProps) {
  const { t } = useLanguage();
  const benefits = (t(benefitsKey as any) || '').split(',');

  return (
    <div className="bg-white min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-neutral-50/50 -z-10"></div>
        <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] bg-primary-100/30 rounded-full blur-[120px] -z-10"></div>
        
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-${accentColor}-100 text-${accentColor}-600 text-xs font-bold uppercase tracking-widest mb-6`}>
                <Sparkles className="w-4 h-4" />
                {t('footer_intelligence_hub')}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight mb-6" dangerouslySetInnerHTML={{ __html: t(titleKey as any) }}></h1>
              <p className="text-lg md:text-xl text-neutral-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                {t(descKey as any)}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Button className={`bg-${accentColor}-600 hover:bg-${accentColor}-700 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg shadow-${accentColor}-600/20`}>
                  {t('hub_start_now')}
                </Button>
                <Button variant="outline" className="px-8 py-4 rounded-xl text-lg font-bold border-neutral-200">
                  Documentation
                </Button>
              </div>
            </div>
            <div className="flex-1 relative w-full max-w-xl mx-auto">
              <div className={`aspect-square bg-gradient-to-br from-neutral-100 to-white border border-neutral-200 rounded-[3rem] shadow-2xl flex items-center justify-center p-12 relative overflow-hidden group`}>
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-${accentColor}-500`}></div>
                <Icon className={`w-32 h-32 text-${accentColor}-600 group-hover:scale-110 transition-transform duration-500`} />
                
                {/* Floating Elements */}
                <div className="absolute top-10 right-10 p-4 bg-white rounded-2xl shadow-xl animate-bounce border border-neutral-100">
                  <Shield className="w-6 h-6 text-green-500" />
                </div>
                <div className="absolute bottom-10 left-10 p-4 bg-white rounded-2xl shadow-xl animate-pulse border border-neutral-100">
                  <Zap className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-24 bg-neutral-900 text-white">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Businesses Choose Grawizah</h2>
            <p className="text-neutral-400">Strategic advantages powered by Groq-inference AI.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="bg-neutral-800 p-8 rounded-3xl border border-neutral-700 hover:border-primary-500 transition-colors">
                <div className="w-12 h-12 bg-primary-600/20 rounded-xl flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit}</h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Experience seamless optimization of your global trade workflow with our 2026 intelligence suite.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
               <h2 className="text-3xl font-bold mb-8">{t('hub_how_it_works')}</h2>
               <div className="space-y-8">
                 {howItWorks.map((step, idx) => (
                   <div key={idx} className="flex gap-6">
                     <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                       {idx + 1}
                     </div>
                     <div>
                       <h4 className="text-lg font-bold text-neutral-900 mb-2">{t(step.stepKey as any) || step.stepKey}</h4>
                       <p className="text-neutral-600 text-sm leading-relaxed">{t(step.descKey as any) || step.descKey}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
            <div className="lg:w-1/2 bg-neutral-50 rounded-[3rem] p-12 border border-neutral-200">
              <div className="space-y-4">
                <div className="h-4 bg-neutral-200 rounded-full w-3/4"></div>
                <div className="h-4 bg-neutral-200 rounded-full w-5/6"></div>
                <div className="h-4 bg-neutral-200 rounded-full w-2/3"></div>
                <div className="pt-8 flex justify-end">
                   <div className="w-32 h-10 bg-primary-600 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t('hub_trial_title')}</h2>
          <p className="text-primary-100 mb-10 text-lg">{t('hub_trial_desc')}</p>
          <div className="flex justify-center">
            <Button className="bg-white text-primary-600 hover:bg-neutral-100 flex items-center gap-2 px-10 py-5 rounded-2xl text-xl font-bold shadow-2xl">
              {t('nav_joinfree')} <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
