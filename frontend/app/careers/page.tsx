'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MapPin, Briefcase, Zap, Globe, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const jobs = [
  { title: "Senior AI Engineer", location: "Remote / Jakarta", type: "Full-time", dept: "Engineering" },
  { title: "Global Trade Compliance Analyst", location: "Singapore", type: "Full-time", dept: "Operations" },
  { title: "B2B Partnership Manager", location: "Remote", type: "Full-time", dept: "Sales" },
  { title: "Product Designer (UX/UI)", location: "Jakarta", type: "Full-time", dept: "Product" }
];

export default function CareersPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-neutral-50 min-h-screen pt-24 pb-16">
      <div className="max-w-[1440px] mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">{t('footer_careers')}</h1>
          <p className="text-neutral-500">Join a global team of visionaries, engineers, and trade experts building the future of international commerce.</p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            { title: "Global Impact", icon: Globe, desc: "Scale solutions for millions of businesses across 190+ countries." },
            { title: "Remote-First", icon: Zap, desc: "Work from anywhere with our flexible, distributed team culture." },
            { title: "Innovative Tech", icon: Users, desc: "Leverage state-of-the-art AI (Groq, LLMs) to solve real-world problems." }
          ].map((benefit, idx) => (
            <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-neutral-200">
               <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center mb-6">
                 <benefit.icon className="w-6 h-6 text-primary-600" />
               </div>
               <h3 className="text-xl font-bold text-neutral-900 mb-4">{benefit.title}</h3>
               <p className="text-neutral-500 text-sm leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>

        {/* Open Roles */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-neutral-900 mb-8">Latest Open Positions</h2>
          {jobs.map((job, idx) => (
            <div key={idx} className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-neutral-200 hover:border-primary-500 transition-all duration-300 hover:shadow-xl group flex flex-col md:flex-row md:items-center justify-between gap-6">
               <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-neutral-50 rounded-2xl flex items-center justify-center p-3">
                    <Briefcase className="w-6 h-6 text-neutral-400 group-hover:text-primary-600 transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">{job.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-neutral-500 mt-2 font-medium">
                       <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                       <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
                       <span>{job.dept}</span>
                    </div>
                  </div>
               </div>
               <div className="flex items-center justify-between md:justify-end gap-6">
                 <span className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-[10px] font-bold uppercase tracking-widest">{job.type}</span>
                 <Button className="bg-primary-600 hover:bg-primary-700 text-white rounded-xl px-8 py-3 h-auto font-bold group-hover:scale-105 transition-all">
                   Apply Now <ArrowRight className="w-4 h-4 ml-2" />
                 </Button>
               </div>
            </div>
          ))}
        </div>

        {/* Contact HR CTA */}
        <div className="mt-20 text-center bg-white p-12 rounded-[3rem] border border-neutral-200 shadow-xl shadow-neutral-900/5">
           <h3 className="text-xl font-bold text-neutral-900 mb-4">Don't see a matching role?</h3>
           <p className="text-neutral-500 mb-8">We are always looking for exceptional talent. Send your resume to our talent scout team.</p>
           <Button variant="outline" className="px-10 py-4 rounded-xl font-bold border-neutral-200 hover:bg-neutral-50">
             talent@grawizah.com
           </Button>
        </div>
      </div>
    </div>
  );
}
