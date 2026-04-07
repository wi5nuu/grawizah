'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { BookOpen, ShieldCheck, HelpCircle, FileText, Globe, ArrowRight } from 'lucide-react';

interface InfoPageTemplateProps {
  titleKey: string;
  icon: 'legal' | 'help' | 'info';
  sections: { title: string; content: string[] }[];
  updatedAt?: string;
}

export default function InfoPageTemplate({
  titleKey,
  icon,
  sections,
  updatedAt = 'April 7, 2026'
}: InfoPageTemplateProps) {
  const { t } = useLanguage();

  const getIcon = () => {
    switch (icon) {
      case 'legal': return <ShieldCheck className="w-12 h-12 text-primary-600" />;
      case 'help': return <HelpCircle className="w-12 h-12 text-primary-600" />;
      default: return <BookOpen className="w-12 h-12 text-primary-600" />;
    }
  };

  return (
    <div className="bg-neutral-50 min-h-screen pt-32 pb-24">
      <div className="max-w-[1440px] mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center justify-center p-4 bg-white rounded-3xl shadow-xl shadow-primary-600/5 mb-8 border border-neutral-100">
            {getIcon()}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6">
            {t(titleKey as any) || titleKey}
          </h1>
          <p className="text-neutral-500 font-medium">Last updated: {updatedAt}</p>
        </div>

        {/* Content & Sidebar */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1 bg-white rounded-[2.5rem] p-8 md:p-16 shadow-xl shadow-neutral-900/5 border border-neutral-100">
            <div className="prose prose-neutral max-w-none">
              {sections.map((section, idx) => (
                <div key={idx} className="mb-12 last:mb-0">
                  <h2 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </span>
                    {section.title}
                  </h2>
                  <div className="space-y-4">
                    {section.content.map((para, pIdx) => (
                      <p key={pIdx} className="text-neutral-600 leading-relaxed">
                        {para}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-neutral-100 shadow-lg shadow-neutral-900/5">
              <h3 className="font-bold text-neutral-900 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-600" />
                Quick Navigation
              </h3>
              <ul className="space-y-4">
                {sections.map((section, idx) => (
                  <li key={idx}>
                    <button className="text-sm text-neutral-500 hover:text-primary-600 flex items-center gap-2 transition-colors text-left font-medium group">
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      {section.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-primary-600 rounded-3xl p-8 text-white shadow-xl shadow-primary-600/30">
               <Globe className="w-10 h-10 mb-6 opacity-50" />
               <h3 className="text-xl font-bold mb-4">Grawizah Global Compliance</h3>
               <p className="text-primary-100 text-sm leading-relaxed mb-6">
                 Our terms are designed to protect both buyers and suppliers in international trade.
               </p>
               <button className="w-full py-4 bg-white text-primary-600 rounded-xl font-bold hover:bg-neutral-100 transition-all shadow-lg">
                 Download PDF
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
