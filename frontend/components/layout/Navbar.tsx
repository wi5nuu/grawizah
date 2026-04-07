'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search, Menu, X, ChevronDown, Globe, User, Bell,
  LayoutDashboard, MessageSquare, Brain, Shield, BarChart3, LogOut
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Language } from '@/lib/translations';

export function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { user, role, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');
  const isLoggedIn = !!user;

  const categories = [
    { name: 'Machinery', icon: '🏗️', href: '/products?category=machinery' },
    { name: 'Electronics', icon: '📱', href: '/products?category=electronics' },
    { name: 'Textiles & Apparel', icon: '👕', href: '/products?category=textiles' },
    { name: 'Automotive', icon: '🚗', href: '/products?category=automotive' },
    { name: 'Food & Beverage', icon: '🍕', href: '/products?category=food' },
    { name: 'Electrical Equipment', icon: '⚡', href: '/products?category=electrical' },
    { name: 'Chemicals', icon: '🧪', href: '/products?category=chemicals' },
    { name: 'Medical Supplies', icon: '🏥', href: '/products?category=medical' },
    { name: 'Construction', icon: '🏗️', href: '/products?category=construction' },
    { name: 'Agriculture', icon: '🌾', href: '/products?category=agriculture' },
  ];

  const popularSearches = ['Coffee Beans', 'Palm Oil', 'Rubber', 'Machinery', 'Electronics'];

  if (isDashboard) return null;

  return (
    <>
      {/* ===== TOP UTILITY BAR ===== */}
      <div className="bg-neutral-900 text-neutral-400 text-xs border-b border-neutral-800">
        <div className="max-w-[1440px] mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3 h-3" />
              <span className="hidden sm:inline">{t('nav_global_trade')}</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="bg-transparent text-neutral-400 text-xs cursor-pointer focus:outline-none border-none outline-none"
            >
              <option value="en" className="text-neutral-900">English</option>
              <option value="id" className="text-neutral-900">Indonesia</option>
            </select>
            <span className="text-neutral-700 hidden sm:inline">|</span>
            {isLoggedIn && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <span className="w-5 h-5 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center font-medium">
                    {user.full_name.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden sm:inline">{user.full_name}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-50">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      {t('nav_dashboard')}
                    </Link>
                    <div className="border-t border-neutral-100 my-1"></div>
                    <button
                      onClick={() => { logout(); setUserDropdownOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="hover:text-white transition-colors">{t('nav_signin').split(' / ')[0]}</Link>
                <Link href="/register" className="hover:text-white transition-colors">{t('nav_joinfree')}</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ===== MAIN HEADER ===== */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Left: Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <img
                src="/images/android-chrome-192x192.png"
                alt="Grawizah"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg"
              />
            </Link>

            {/* Center: Grawizah Text (Purple) */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <h1 className="text-xl sm:text-2xl font-bold text-primary-600 leading-tight">Grawizah</h1>
            </Link>

            {/* Right: Hamburger Menu */}
            <button
              className="lg:hidden p-2 hover:bg-neutral-100 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-neutral-700" /> : <Menu className="w-6 h-6 text-neutral-700" />}
            </button>

            {/* Right Actions (Desktop only) */}
            <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
              {isLoggedIn && user ? (
                <>
                  <div className="relative">
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="flex items-center gap-2 hover:bg-neutral-50 rounded-full pl-1 pr-3 py-1 transition-colors"
                    >
                      <span className="w-8 h-8 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-medium">
                        {user.full_name.charAt(0).toUpperCase()}
                      </span>
                      <span className="text-sm text-neutral-700 font-medium">{user.full_name}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
                    </button>
                    {userDropdownOpen && (
                      <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-50">
                        <div className="px-3 py-2 border-b border-neutral-100">
                          <p className="text-sm font-medium text-neutral-900 truncate">{user.full_name}</p>
                          <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                        </div>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          {t('nav_dashboard')}
                        </Link>
                        <Link
                          href="/dashboard/inquiries"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          <MessageSquare className="w-4 h-4" />
                          My Inquiries
                        </Link>
                        <div className="border-t border-neutral-100 my-1"></div>
                        <button
                          onClick={() => { logout(); setUserDropdownOpen(false); }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-neutral-600 hover:text-primary-600 transition-colors">
                    <LayoutDashboard className="w-4 h-4" />
                    {t('nav_dashboard')}
                  </Link>
                  <Link href="/dashboard/inquiries" className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                    <Bell className="w-5 h-5 text-neutral-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </Link>
                  <Link href="/register">
                    <button className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors">
                      {t('nav_signin')}
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-neutral-200 pb-4">
              {/* Categories */}
              <div className="pt-3 mb-3">
                <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 px-3">Categories</h3>
                {categories.map((cat) => (
                  <Link 
                    key={cat.name} 
                    href={cat.href} 
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-primary-50 text-neutral-700 text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </div>

              {/* Actions */}
              <div className="border-t border-neutral-200 pt-3 px-3 space-y-2">
                {isLoggedIn && user ? (
                  <>
                    <div className="flex items-center gap-2 py-2">
                      <span className="w-8 h-8 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-medium flex-shrink-0">
                        {user.full_name.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-neutral-900">{user.full_name}</p>
                        <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <Link href="/dashboard" className="flex items-center gap-2 py-2 text-neutral-700 text-sm" onClick={() => setMobileMenuOpen(false)}>
                      <LayoutDashboard className="w-4 h-4" />
                      {t('nav_dashboard')}
                    </Link>
                    <button
                      onClick={() => { logout(); setMobileMenuOpen(false); }}
                      className="flex items-center gap-2 w-full py-2 text-red-600 text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/dashboard" className="flex items-center gap-2 py-2 text-neutral-700 text-sm" onClick={() => setMobileMenuOpen(false)}>
                      <LayoutDashboard className="w-4 h-4" />
                      {t('nav_dashboard')}
                    </Link>
                    <Link href="/login" className="block w-full text-center bg-neutral-100 text-neutral-700 py-2.5 rounded-lg text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                      {t('nav_signin').split(' / ')[0]}
                    </Link>
                    <Link href="/register" className="block w-full text-center bg-primary-600 text-white py-2.5 rounded-lg text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                      {t('nav_joinfree')}
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
