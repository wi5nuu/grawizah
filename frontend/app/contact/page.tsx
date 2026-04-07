'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-neutral-50 min-h-screen pt-24 pb-16">
      <div className="max-w-[1440px] mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mb-16 px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">{t('footer_contact_us')}</h1>
          <p className="text-neutral-500">
            {t('foo_contact_hero_desc' as any) || "Contact our global trade experts for support, partnerships, or general inquiries. We're here to help you scale."}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
           {/* Contact Form */}
           <div className="flex-1 bg-white p-8 md:p-12 rounded-[3.5rem] border border-neutral-100 shadow-xl shadow-neutral-900/5">
              <h2 className="text-2xl font-bold text-neutral-900 mb-8">{t('foo_contact_form_title' as any) || "Send a Message"}</h2>
              <form className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-neutral-700 ml-2">{t('foo_contact_label_name' as any) || "Full Name"}</label>
                       <input type="text" placeholder="John Doe" className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-bold text-neutral-700 ml-2">{t('foo_contact_label_email' as any) || "Email Address"}</label>
                       <input type="email" placeholder="john@example.com" className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-neutral-700 ml-2">{t('foo_contact_label_subject' as any) || "Subject"}</label>
                    <select className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all appearance-none">
                       <option>{t('foo_contact_sub_general' as any) || "General Inquiry"}</option>
                       <option>{t('foo_contact_sub_support' as any) || "Technical Support"}</option>
                       <option>{t('foo_contact_sub_partner' as any) || "Partnership Proposal"}</option>
                       <option>{t('foo_contact_sub_press' as any) || "Press & Media"}</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-neutral-700 ml-2">{t('foo_contact_label_message' as any) || "Message"}</label>
                    <textarea rows={5} placeholder={t('foo_contact_message_placeholder' as any) || "How can we help your business today?"} className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"></textarea>
                 </div>
                 <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-2xl py-5 h-auto text-xl font-bold shadow-xl shadow-primary-600/20 transition-all active:scale-95">
                    {t('foo_contact_btn_send' as any) || "Send Message"} <Send className="w-5 h-5 ml-2" />
                 </Button>
              </form>
           </div>

           {/* Contact Info */}
           <div className="lg:w-96 space-y-8">
              <div className="bg-neutral-900 rounded-[3rem] p-8 text-white shadow-2xl">
                 <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                   <MessageSquare className="w-6 h-6 text-primary-500" /> Support Channels
                 </h3>
                 <div className="space-y-8">
                    <div className="flex gap-4">
                       <div className="w-12 h-12 bg-neutral-800 rounded-2xl flex items-center justify-center shrink-0">
                          <Mail className="w-6 h-6 text-primary-400" />
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Email us</p>
                          <p className="text-sm font-bold">hello@grawizah.com</p>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <div className="w-12 h-12 bg-neutral-800 rounded-2xl flex items-center justify-center shrink-0">
                          <Phone className="w-6 h-6 text-primary-400" />
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Call centre</p>
                          <p className="text-sm font-bold">+62 21 1234 5678</p>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <div className="w-12 h-12 bg-neutral-800 rounded-2xl flex items-center justify-center shrink-0">
                          <Clock className="w-6 h-6 text-primary-400" />
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-1">Working Hours</p>
                          <p className="text-sm font-bold">Mon - Fri, 9AM - 6PM (GMT+7)</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-white rounded-[3rem] p-8 border border-neutral-200">
                 <h3 className="text-xl font-bold text-neutral-900 mb-8 flex items-center gap-2">
                   <MapPin className="w-6 h-6 text-primary-600" /> Global Offices
                 </h3>
                 <div className="space-y-6">
                    <div>
                       <p className="text-xs font-bold text-primary-600 mb-1">Jakarta (HQ)</p>
                       <p className="text-sm text-neutral-500 leading-relaxed font-medium">Sastra Plaza Building, 4th Floor, Jl. Gatot Subroto, Jakarta, Indonesia.</p>
                    </div>
                    <div className="pt-6 border-t border-neutral-100">
                       <p className="text-xs font-bold text-neutral-900 mb-1">Singapore</p>
                       <p className="text-sm text-neutral-500 leading-relaxed font-medium">10 Anson Road, International Plaza, Singapore 079903.</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
