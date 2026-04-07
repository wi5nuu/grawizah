'use client';

import Link from 'next/link';
import { Globe, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Youtube, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Language } from '@/lib/translations';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { language, setLanguage, t } = useLanguage();

  return (
    <footer className="bg-neutral-900 text-neutral-400 border-t border-neutral-800">
      {/* ===== MAIN FOOTER ===== */}
      <div className="max-w-[1440px] mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
          
          {/* Column 1: Discover */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
              {t('footer_discover')}
            </h4>
            <ul className="space-y-3.5 text-xs">
              <li><Link href="/products" className="hover:text-primary-400 transition-colors">{t('footer_products')}</Link></li>
              <li><Link href="/suppliers" className="hover:text-primary-400 transition-colors">{t('footer_suppliers')}</Link></li>
              <li><Link href="/buyers" className="hover:text-primary-400 transition-colors">{t('footer_buyers')}</Link></li>
              <li><Link href="/categories" className="hover:text-primary-400 transition-colors">{t('footer_categories')}</Link></li>
              <li><Link href="/trade-shows" className="hover:text-primary-400 transition-colors">{t('footer_trade_shows')}</Link></li>
              <li><Link href="/blog" className="hover:text-primary-400 transition-colors">{t('footer_blog')}</Link></li>
            </ul>
          </div>

          {/* Column 2: Intelligence Hub (Services) */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
              {t('footer_intelligence_hub')}
            </h4>
            <ul className="space-y-3.5 text-xs">
              <li><Link href="/ai-document" className="hover:text-primary-400 transition-colors">{t('hub_doc_title')}</Link></li>
              <li><Link href="/hs-code" className="hover:text-primary-400 transition-colors">{t('hub_hs_title')}</Link></li>
              <li><Link href="/sanction-screening" className="hover:text-primary-400 transition-colors">{t('hub_sanction_title')}</Link></li>
              <li><Link href="/buyer-radar" className="hover:text-primary-400 transition-colors">{t('hub_radar_title')}</Link></li>
              <li><Link href="/market-insights" className="hover:text-primary-400 transition-colors">{t('footer_market_insights')}</Link></li>
              <li><Link href="/compliance" className="hover:text-primary-400 transition-colors">{t('footer_compliance')}</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
              {t('footer_company')}
            </h4>
            <ul className="space-y-3.5 text-xs">
              <li><Link href="/about" className="hover:text-primary-400 transition-colors">{t('footer_about')}</Link></li>
              <li><Link href="/careers" className="hover:text-primary-400 transition-colors">{t('footer_careers')}</Link></li>
              <li><Link href="/press" className="hover:text-primary-400 transition-colors">{t('footer_press')}</Link></li>
              <li><Link href="/partners" className="hover:text-primary-400 transition-colors">{t('footer_partners')}</Link></li>
              <li><Link href="/contact" className="hover:text-primary-400 transition-colors">{t('footer_contact_us')}</Link></li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h4 className="text-white font-bold mb-6 text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
              {t('footer_support')}
            </h4>
            <ul className="space-y-3.5 text-xs">
              <li><Link href="/help" className="hover:text-primary-400 transition-colors">{t('footer_help')}</Link></li>
              <li><Link href="/faq" className="hover:text-primary-400 transition-colors">{t('footer_faq')}</Link></li>
              <li><Link href="/safety" className="hover:text-primary-400 transition-colors">{t('footer_safety')}</Link></li>
              <li><Link href="/terms" className="hover:text-primary-400 transition-colors">{t('footer_tos')}</Link></li>
              <li><Link href="/privacy" className="hover:text-primary-400 transition-colors">{t('footer_pp')}</Link></li>
              <li><Link href="/cookies" className="hover:text-primary-400 transition-colors">{t('footer_cookie')}</Link></li>
            </ul>
          </div>

          {/* Column 5: Contact */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-white font-bold mb-6 text-sm flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
              {t('footer_contact_title')}
            </h4>
            <ul className="space-y-4 text-xs">
              <li className="flex items-start gap-3 group">
                <div className="w-8 h-8 bg-neutral-800 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary-600 transition-colors">
                  <MapPin className="w-4 h-4 text-primary-400 group-hover:text-white" />
                </div>
                <span className="pt-1">Jakarta, Indonesia<br /><span className="text-neutral-500 italic">Global Operations</span></span>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 bg-neutral-800 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary-600 transition-colors">
                  <Mail className="w-4 h-4 text-primary-400 group-hover:text-white" />
                </div>
                <a href="mailto:hello@grawizah.com" className="hover:text-white transition-colors">hello@grawizah.com</a>
              </li>
              <li className="flex items-center gap-3 group">
                <div className="w-8 h-8 bg-neutral-800 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary-600 transition-colors">
                  <Phone className="w-4 h-4 text-primary-400 group-hover:text-white" />
                </div>
                <a href="tel:+62211234567" className="hover:text-white transition-colors">+62 21 1234 5678</a>
              </li>
            </ul>

            {/* Social Links */}
            <div className="mt-8 pt-8 border-t border-neutral-800/50">
              <h4 className="text-white font-bold mb-4 text-[10px] uppercase tracking-[0.2em]">{t('footer_follow_us')}</h4>
              <div className="flex gap-2.5">
                {[Facebook, Twitter, Linkedin, Instagram, Youtube].map((Icon, idx) => (
                  <a key={idx} href="#" className="w-9 h-9 bg-neutral-800 hover:bg-primary-600 rounded-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1">
                    <Icon className="w-4 h-4 text-neutral-300 group-hover:text-white" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ===== NEWSLETTER ===== */}
        <div className="bg-neutral-800/40 rounded-[2rem] p-8 md:p-12 mb-16 border border-neutral-700/30">
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{t('footer_stay_updated')}</h3>
              <p className="text-neutral-400 text-sm max-w-sm">{t('footer_newsletter_desc')}</p>
            </div>
            <div className="flex w-full md:w-auto gap-3">
              <div className="relative flex-1 md:w-80">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  placeholder={t('footer_email_placeholder')}
                  className="w-full pl-11 pr-4 py-3.5 bg-neutral-900 border border-neutral-700 rounded-2xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
              </div>
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3.5 rounded-2xl text-sm font-bold transition-all shadow-lg hover:shadow-primary-600/30">
                {t('footer_subscribe')}
              </button>
            </div>
          </div>
        </div>

        {/* ===== BOTTOM BAR ===== */}
        <div className="border-t border-neutral-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo & Copyright */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5">
                <img 
                  src="/images/android-chrome-192x192.png" 
                  alt="Grawizah"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <p className="text-white font-bold text-base tracking-tight">Grawizah</p>
                <p className="text-primary-500 font-medium text-[10px] uppercase tracking-widest">{t('footer_intelligence_hub')}</p>
              </div>
              <div className="h-8 w-px bg-neutral-800 mx-2 hidden sm:block"></div>
              <span className="text-neutral-500 text-xs sm:inline hidden">© {currentYear} {t('footer_rights')}</span>
            </div>

            {/* Language & Legal */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-500 font-medium">
              <div className="flex items-center gap-2 bg-neutral-800 px-4 py-2 rounded-full border border-neutral-700/50">
                <Globe className="w-3.5 h-3.5 text-primary-400" />
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="bg-transparent text-neutral-300 cursor-pointer focus:outline-none border-none outline-none appearance-none pr-4"
                >
                  <option value="en" className="text-neutral-900">English</option>
                  <option value="id" className="text-neutral-900">Indonesia</option>
                </select>
                <ChevronRight className="w-3 h-3 rotate-90 ml-[-8px]" />
              </div>
              
              <div className="flex items-center gap-6">
                <Link href="/terms" className="hover:text-primary-400 transition-colors">{t('footer_terms')}</Link>
                <Link href="/privacy" className="hover:text-primary-400 transition-colors">{t('footer_privacy')}</Link>
                <Link href="/sitemap" className="hover:text-primary-400 transition-colors">{t('footer_sitemap')}</Link>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center sm:hidden">
            <span className="text-neutral-600 text-[10px]">© {currentYear} {t('footer_rights')}</span>
          </div>

          {/* Watermark Watermark */}
          <div className="mt-12 text-center opacity-30">
            <p className="text-[10px] text-neutral-600 uppercase tracking-[0.25em] font-light">
              Grawizah Intelligence Hub - {currentYear} | Secure, Fast, & Intelligent Global Trade
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
