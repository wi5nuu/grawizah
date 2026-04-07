'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, MessageSquare, Brain, Settings, LogOut,
  BarChart3, Bell, Search, ChevronDown, Menu, X, Lock,
  Grid, ShoppingCart, CreditCard, Bookmark, Crown, Truck, Users, Sparkles, Shield, Globe
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import NotificationDropdown from '@/components/dashboard/NotificationDropdown';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, logout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-neutral-500 font-medium">Verifying Profile...</div>
        </div>
      </div>
    );
  }

  const isTrader = role === 'free_trader' || role === 'premium_trader';
  const isPremium = role === 'premium_trader';
  const isBuyer = role === 'buyer';
  
  const sidebarNav = [
    { label: 'Dashboard', icon: Grid, href: '/dashboard', active: pathname === '/dashboard' },
    { type: 'divider', label: 'Online trading' },
    { 
      label: isBuyer ? 'Inquiry Manager' : 'Messages', 
      icon: MessageSquare, 
      href: '/dashboard/inquiries', 
      active: pathname === '/dashboard/inquiries' 
    },
    { 
      label: 'Inventory', 
      icon: Package, 
      href: '/dashboard/products', 
      active: pathname === '/dashboard/products',
      hidden: isBuyer 
    },
    { label: 'Orders', icon: ShoppingCart, href: '/dashboard/orders', active: pathname === '/dashboard/orders' },
    { label: 'Payment', icon: CreditCard, href: '/dashboard/payment', active: pathname === '/dashboard/payment' },
    
    { type: 'divider', label: 'Trade Intelligence' },
    { 
      label: 'Buyer Radar', 
      icon: Users, 
      href: '/dashboard/intelligence', 
      active: pathname === '/dashboard/intelligence',
      badge: !isPremium ? 'Locked' : 'Pro',
      hidden: isBuyer
    },
    { 
      label: 'Market Insights', 
      icon: BarChart3, 
      href: '/dashboard/insights', 
      active: pathname === '/dashboard/insights',
      hidden: isBuyer
    },
    { 
      label: 'Supplier Comparison', 
      icon: BarChart3, 
      href: '/dashboard/compare', 
      active: pathname === '/dashboard/compare',
      hidden: !isBuyer
    },
    
    { type: 'divider', label: 'History & Support' },
    { label: 'Saved & history', icon: Bookmark, href: '/dashboard/saved', active: pathname === '/dashboard/saved' },
    { label: 'Logistics', icon: Truck, href: '/dashboard/logistics', active: pathname === '/dashboard/logistics' },
    { 
      label: 'Subscription', 
      icon: Crown, 
      href: '/dashboard/subscription', 
      badge: isPremium ? 'Premium' : 'Upgrade', 
      active: pathname === '/dashboard/subscription',
      hidden: isBuyer 
    },
    
    { type: 'divider', label: 'Settings' },
    { label: 'Account settings', icon: Settings, href: '/dashboard/settings', active: pathname === '/dashboard/settings' },
    { label: 'Document Vault', icon: Shield, href: '/dashboard/documents', active: pathname === '/dashboard/documents' },
  ];

  const filteredNav = sidebarNav.filter(item => !item.hidden);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* ===== TOP HEADER ===== */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Left: Mobile menu toggle + Logo */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                className="lg:hidden p-2 -ml-2 hover:bg-neutral-100 rounded-lg"
              >
                <Menu className="w-5 h-5 text-neutral-600" />
              </button>
              <Link href="/" className="flex items-center gap-2.5">
                <Image
                  src="/images/android-chrome-192x192.png"
                  alt="Grawizah"
                  width={36}
                  height={36}
                  className="rounded-lg"
                />
                <div className="hidden sm:block">
                  <span className="text-xl font-bold text-purple-600 tracking-tight">Grawizah</span>
                </div>
              </Link>
              <div className="hidden md:flex items-center gap-2 pl-3 ml-1 border-l border-neutral-200">
                <span className="text-sm text-neutral-500">My Grawizah</span>
              </div>
            </div>

            {/* Center: Search (desktop only) */}
            <div className="hidden lg:flex flex-1 max-w-xl">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const query = formData.get('search') as string;
                  if (query?.trim()) {
                    router.push(`/products?search=${encodeURIComponent(query.trim())}`);
                  }
                }}
                className="relative w-full"
              >
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  name="search"
                  type="text"
                  placeholder="Search products, suppliers, or categories..."
                  className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-neutral-400"
                />
              </form>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="hidden xl:flex items-center gap-1.5 text-sm">
                <Globe className="w-4 h-4 text-neutral-400" />
                <button className="text-neutral-600 hover:text-neutral-900 font-medium">🇮🇩 Indonesia</button>
                <span className="text-neutral-300">|</span>
                <button className="text-neutral-600 hover:text-neutral-900 font-medium">English-IDR</button>
              </div>
              <NotificationDropdown />
              <Link href="/dashboard/inquiries" className="relative p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <MessageSquare className="w-5 h-5 text-neutral-600" />
              </Link>
              <div className="flex items-center gap-2 pl-3 border-l border-neutral-200">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  {user.full_name?.charAt(0) || 'U'}
                </div>
                <button onClick={handleLogout} className="hidden lg:block p-1.5 hover:bg-red-50 rounded-lg text-red-500 transition-colors" title="Sign Out">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <div className="max-w-[1600px] mx-auto px-4 py-6 pb-24 lg:pb-6">
        <div className="flex gap-6">
          {/* ===== MOBILE SIDEBAR OVERLAY ===== */}
          {mobileSidebarOpen && (
            <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setMobileSidebarOpen(false)} />
          )}

          {/* ===== LEFT SIDEBAR ===== */}
          <aside className={`
            fixed lg:static inset-y-0 left-0 z-[60] w-64 bg-white border-r border-neutral-200 flex-shrink-0
            transform transition-transform duration-300 ease-in-out
            ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <div className="flex items-center justify-between p-4 border-b border-neutral-100 lg:hidden">
              <span className="font-semibold text-neutral-900">Menu</span>
              <button onClick={() => setMobileSidebarOpen(false)} className="p-1 hover:bg-neutral-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col h-full bg-white overflow-hidden">
              <div className="flex-1 py-1 overflow-y-auto scrollbar-hide pb-24 lg:pb-0">
                {filteredNav.map((item, index) => {
                  if (item.type === 'divider') {
                    return (
                      <div key={index} className="px-4 pt-4 pb-2">
                        <span className="text-[11px] text-neutral-400 uppercase font-black tracking-widest leading-none">
                          {item.label}
                        </span>
                      </div>
                    );
                  }
                  const Icon = item.icon!;
                  return (
                    <Link
                      key={index}
                      href={item.href || '#'}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-all relative group ${
                        item.active
                          ? 'text-purple-600 font-bold bg-purple-50/50'
                          : 'text-neutral-600 hover:bg-neutral-50 hover:text-purple-600'
                      }`}
                      onClick={() => setMobileSidebarOpen(false)}
                    >
                      {item.active && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-purple-600 rounded-r-full" />
                      )}
                      <Icon className={`w-4 h-4 flex-shrink-0 transition-colors ${item.active ? 'text-purple-600' : 'text-neutral-400 group-hover:text-purple-600'}`} />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <span className="text-[9px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-black tracking-tighter uppercase shadow-sm">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}

                <div className="px-3 mt-4">
                  <div className="p-4 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl text-white shadow-lg shadow-purple-500/20">
                    <Crown className="w-6 h-6 mb-2 text-purple-200" />
                    <p className="text-xs font-black mb-1">Premium Hub</p>
                    <p className="text-[10px] text-purple-100/80 mb-3 leading-tight font-medium">Unlock full market intelligence and verified supplier data.</p>
                    <Link href="/dashboard/subscription" className="block text-center py-2 bg-white text-purple-600 rounded-xl text-[11px] font-black hover:bg-purple-50 transition-all active:scale-95 shadow-sm">
                      UPGRADE NOW
                    </Link>
                  </div>
                </div>
              </div>

              {/* Bottom Actions (Visible on Desktop sidebar, hidden on mobile sidebar to avoid redundancy) */}
              <div className="hidden lg:block p-3 border-t border-neutral-100 flex-shrink-0 space-y-2 bg-white">
                <Link href="/seller" className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-neutral-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all group">
                   <Sparkles className="w-4 h-4 text-purple-500 group-hover:rotate-12 transition-transform" />
                   Explore seller site
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-all group"
                >
                  <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  Sign Out
                </button>
              </div>
            </nav>
          </aside>

          {/* ===== MAIN CONTENT AREA ===== */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>

      {/* ===== MOBILE BOTTOM NAVIGATION ===== */}
      {!mobileSidebarOpen && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 px-6 py-3 flex items-center justify-between z-[70] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] animate-in slide-in-from-bottom duration-300">
          <Link href="/dashboard" className={`flex flex-col items-center gap-1 ${pathname === '/dashboard' ? 'text-purple-600' : 'text-neutral-400'}`}>
            <Grid className="w-5 h-5" />
            <span className="text-[10px] font-medium">Home</span>
          </Link>
          <Link href="/dashboard/inquiries" className={`flex flex-col items-center gap-1 ${pathname === '/dashboard/inquiries' ? 'text-purple-600' : 'text-neutral-400'}`}>
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px] font-medium">Inbox</span>
          </Link>
          <Link href="/seller" className="flex flex-col items-center gap-1">
            <div className="bg-white p-1 rounded-2xl -mt-10 shadow-xl shadow-purple-500/20 border-4 border-[#f5f5f5] overflow-hidden w-14 h-14 flex items-center justify-center transition-transform active:scale-95">
              <Image
                src="/images/android-chrome-192x192.png"
                alt="Explore"
                width={48}
                height={48}
                className="rounded-xl"
              />
            </div>
            <span className="text-[10px] font-medium text-purple-600 mt-0.5 uppercase tracking-tight">Explore</span>
          </Link>
          <Link href="/dashboard/orders" className={`flex flex-col items-center gap-1 ${pathname === '/dashboard/orders' ? 'text-purple-600' : 'text-neutral-400'}`}>
            <ShoppingCart className="w-5 h-5" />
            <span className="text-[10px] font-medium">Orders</span>
          </Link>
          <button onClick={handleLogout} className="flex flex-col items-center gap-1 text-red-400">
            <LogOut className="w-5 h-5" />
            <span className="text-[10px] font-medium">Exit</span>
          </button>
        </nav>
      )}
    </div>
  );
}
