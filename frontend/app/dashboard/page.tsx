'use client';

import { useState, useEffect } from 'react';
import {
  Package, MessageSquare, Users, Heart, ShoppingCart, Clock,
  ChevronRight, ChevronDown, Award, Truck,
  CreditCard, Bookmark, Settings, Bell, Search, Grid,
  Crown, Star, Eye, Sparkles, Globe, Menu, X, Shield
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { dashboardAPI, productsAPI, inquiryAPI } from '@/lib/api';

interface DashboardStats {
  total_products: number;
  active_inquiries: number;
  total_ai_usage: number;
  profile_views: number;
  verified_buyers: number;
}

interface Inquiry {
  id: string;
  name: string;
  product: string;
  status: string;
  created_at: string;
  avatar: string;
}

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price_est_min: number;
  price_est_max: number;
  currency: string;
  images_url: string;
  is_active: boolean;
}

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return '1d ago';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

const orderTabs = ['All', 'Confirming', 'Unpaid', 'Preparing to ship', 'Delivering', 'Refunds & after-sales', 'Completed & more'];

export default function DashboardPage() {
  const { user, role } = useAuth();
  const isTrader = role !== 'buyer';
  
  const sidebarNav = [
    { label: 'Dashboard', icon: Grid, href: '/dashboard', active: true },
    { type: 'divider', label: 'Online trading' },
    { label: isTrader ? 'Messages' : 'Inquiry Manager', icon: MessageSquare, href: '/dashboard/inquiries', badge: 0 },
    { label: 'Orders', icon: ShoppingCart, href: '/dashboard/orders', badge: 0 },
    { label: 'Payment', icon: CreditCard, href: '/dashboard/payment' },
    { type: 'divider', label: 'Saved & history' },
    { label: 'Saved & history', icon: Bookmark, href: '/dashboard/saved' },
    { type: 'divider', label: 'Add-on services' },
    { label: 'Subscription', icon: Crown, href: '/dashboard/subscription', badge: 'New' },
    { label: 'Logistics services', icon: Truck, href: '/dashboard/logistics' },
    { label: 'Reseller Hub', icon: Users, href: '/dashboard/reseller' },
    { label: 'More services', icon: Sparkles, href: '/dashboard/services' },
    { type: 'divider', label: 'Settings' },
    { label: 'Account settings', icon: Settings, href: '/dashboard/settings' },
    { label: 'Document Vault', icon: Shield, href: '/dashboard/documents' },
  ];

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeOrderTab, setActiveOrderTab] = useState('All');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, inquiriesRes, productsRes] = await Promise.all([
          dashboardAPI.getStats(),
          dashboardAPI.getRecentInquiries(),
          productsAPI.list({ page: 1, limit: 10 }),
        ]);

        setStats(statsRes.data.data);
        setInquiries(inquiriesRes.data.data || []);
        const productList = productsRes.data.data?.products || [];
        setProducts(productList.slice(0, 10));
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-neutral-500 mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const unreadMessages = 0;
  const newQuotes = 0;
  const coupons = 0;

  return (
    <div className="space-y-6">
      {/* Top Stats Row */}
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
              {user?.full_name?.[0] || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="font-bold text-neutral-900 text-lg">{user?.full_name || 'User'}</p>
                {user?.is_verified && <Shield className="w-4 h-4 text-green-500" />}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant={role === 'premium_trader' ? 'premium' : 'default'} className="text-[10px]">
                  {role?.replace('_', ' ').toUpperCase() || 'FREE TRADER'}
                </Badge>
                <Link href="/dashboard/settings" className="text-xs text-purple-500 hover:text-purple-600 font-medium">
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 sm:gap-10">
            <Link href="/dashboard/inquiries" className="text-center group">
              <p className="text-2xl font-bold text-neutral-900">{unreadMessages}</p>
              <p className="text-xs text-neutral-500 group-hover:text-purple-500 transition-colors">Unread messages</p>
            </Link>
            <div className="w-px h-10 bg-neutral-200 hidden sm:block"></div>
            <Link href="/dashboard/inquiries" className="text-center group">
              <p className="text-2xl font-bold text-neutral-900">{newQuotes}</p>
              <p className="text-xs text-neutral-500 group-hover:text-purple-500 transition-colors">New quotes</p>
            </Link>
            <div className="w-px h-10 bg-neutral-200 hidden sm:block"></div>
            <button className="text-center group">
              <p className="text-2xl font-bold text-neutral-900">{coupons}</p>
              <p className="text-xs text-neutral-500 group-hover:text-purple-500 transition-colors">Coupons</p>
            </button>
          </div>

          <Link
            href="/dashboard/settings"
            className="hidden xl:flex items-center gap-1 text-xs text-neutral-400 hover:text-purple-500 transition-colors flex-shrink-0"
          >
            Personalize your Grawizah experience
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </Card>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: Main Features */}
        <div className="flex-1 space-y-6">
          {/* Orders Section */}
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
              <h2 className="font-bold text-neutral-900">Orders</h2>
              <Link href="/dashboard/orders" className="text-sm text-purple-500 hover:text-purple-600 flex items-center gap-1">
                View all <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="p-4 border-b border-neutral-100 overflow-x-auto scrollbar-hide">
              <div className="flex gap-2">
                {orderTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveOrderTab(tab)}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                      activeOrderTab === tab
                        ? 'bg-neutral-900 text-white shadow-md'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-neutral-50 rounded-3xl mx-auto mb-4 flex items-center justify-center border border-neutral-100">
                <ShoppingCart className="w-10 h-10 text-neutral-300" />
              </div>
              <p className="text-neutral-900 font-bold text-lg mb-1">No orders yet</p>
              <p className="text-neutral-500 text-sm mb-6">Start your global sourcing journey today.</p>
              <Link
                href="/dashboard/products"
                className="inline-flex items-center gap-2 bg-neutral-900 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-neutral-800 transition-all hover:shadow-lg"
              >
                <Search className="w-4 h-4" />
                Start sourcing
              </Link>
            </div>
          </Card>

          {/* Product Inspiration */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-neutral-900">Get product inspiration</h2>
              <Link href="/products" className="text-sm text-neutral-500 hover:text-purple-600 font-medium">See more</Link>
            </div>
            {products.length === 0 ? (
              <Card className="p-12 text-center">
                <Package className="w-10 h-10 mx-auto mb-3 text-neutral-200" />
                <p className="text-neutral-400 font-medium">No products available yet.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                {products.map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`} className="group">
                    <Card className="overflow-hidden border-neutral-100 hover:border-purple-200 hover:shadow-xl transition-all duration-300 bg-white group">
                      <div className="aspect-square bg-neutral-50 relative overflow-hidden">
                        {product.images_url ? (
                          <img
                            src={product.images_url}
                            alt={product.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100">
                            <Package className="w-10 h-10 text-neutral-200" />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 bg-white/90 backdrop-blur rounded-full shadow-sm text-neutral-600 hover:text-red-500"><Heart className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-neutral-500 mb-1 line-clamp-2 min-h-[32px]">{product.title}</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs font-bold text-neutral-900">{product.currency}</span>
                          <span className="text-sm font-black text-neutral-900">{product.price_est_min}</span>
                          <span className="text-[10px] text-neutral-400">/ set</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Widgets */}
        <aside className="w-full lg:w-72 space-y-6">
          {/* Favorites */}
          <Card className="p-6 border-neutral-100">
            <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              Favorites
            </h3>
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-red-50 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-300" />
              </div>
              <p className="text-xs text-neutral-500 mb-4">You haven't saved any products yet.</p>
              <Link href="/products" className="text-xs font-bold text-purple-600 hover:text-purple-700 bg-purple-50 px-4 py-2 rounded-lg transition-colors inline-block w-full text-center">
                Explore Items
              </Link>
            </div>
          </Card>

          {/* Browsing History */}
          <Card className="p-6 border-neutral-100">
            <h3 className="font-bold text-neutral-900 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-500" />
              Recent History
            </h3>
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-purple-50 rounded-2xl mx-auto mb-3 flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-300" />
              </div>
              <p className="text-xs text-neutral-500 mb-4">No recent history available.</p>
              <Link href="/products" className="text-xs font-bold text-purple-600 hover:text-purple-700 bg-purple-50 px-4 py-2 rounded-lg transition-colors inline-block w-full text-center">
                Browse More
              </Link>
            </div>
          </Card>

          {/* Promotions */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-purple-600 to-accent-600 rounded-2xl p-5 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <Crown className="w-8 h-8 mb-3 text-purple-200" />
                <h4 className="font-bold text-lg mb-1 leading-tight">Refer a Friend</h4>
                <p className="text-xs text-purple-100 opacity-80 mb-4">Earn up to $50 in trade coupons for every referral.</p>
                <Link href="/dashboard/referral" className="inline-flex items-center gap-2 text-xs font-bold bg-white text-purple-600 px-4 py-2 rounded-lg hover:shadow-lg transition-all group-hover:translate-x-1">
                  Invite Now <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <Sparkles className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10 group-hover:rotate-12 transition-transform duration-700" />
            </div>
            
            <div className="bg-white border border-yellow-100 rounded-2xl p-5 relative overflow-hidden group">
              <div className="relative z-10">
                <Award className="w-8 h-8 mb-3 text-yellow-500" />
                <h4 className="font-bold text-neutral-900">Expert Trading</h4>
                <p className="text-xs text-neutral-500 mb-4">Learn how to maximize your trade margins with AI.</p>
                <Link href="/dashboard/settings" className="text-xs font-bold text-purple-600 hover:underline inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read guide <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
