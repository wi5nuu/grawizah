'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Clock, Truck, CheckCircle, XCircle, RefreshCw, Eye, Download, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Card';

const orderTabs = [
  { label: 'All', icon: ShoppingCart },
  { label: 'Pending', icon: Clock },
  { label: 'Confirmed', icon: CheckCircle },
  { label: 'Preparing', icon: RefreshCw },
  { label: 'Shipped', icon: Truck },
  { label: 'Delivered', icon: CheckCircle },
  { label: 'Cancelled', icon: XCircle },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  preparing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders] = useState<any[]>([]);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">My Orders</h1>
          <p className="text-sm text-neutral-500 mt-1">Track and manage your purchase orders</p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          Start Ordering
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total Orders', value: '0', icon: ShoppingCart, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'In Progress', value: '0', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Delivered', value: '0', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Cancelled', value: '0', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat, i) => (
          <Card key={i} className="p-4">
            <div className={`w-8 h-8 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center mb-2`}>
              <stat.icon className="w-4 h-4" />
            </div>
            <p className="text-xl font-bold text-neutral-900">{stat.value}</p>
            <p className="text-xs text-neutral-500">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Order Tabs */}
      <Card className="mb-6">
        <div className="p-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button className="p-2 hover:bg-neutral-100 rounded-lg">
              <Filter className="w-5 h-5 text-neutral-500" />
            </button>
          </div>
        </div>
        <div className="p-4 border-b border-neutral-100 overflow-x-auto">
          <div className="flex gap-2">
            {orderTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.label}
                  onClick={() => setActiveTab(tab.label)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.label
                      ? 'bg-purple-600 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        <div className="p-12 text-center">
          <div className="w-20 h-20 bg-neutral-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <ShoppingCart className="w-10 h-10 text-neutral-300" />
          </div>
          <h3 className="text-neutral-900 font-semibold mb-1">No orders yet</h3>
          <p className="text-sm text-neutral-500 mb-4 max-w-md mx-auto">
            You haven't placed any orders yet. Browse our product catalog and start sourcing today.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100">
          <h3 className="font-semibold text-neutral-900 mb-2">Order Tracking</h3>
          <p className="text-sm text-neutral-600 mb-3">
            Track your shipment in real-time with our integrated logistics partners.
          </p>
          <Link href="/dashboard/logistics" className="text-sm text-purple-600 font-medium hover:text-purple-700">
            View Logistics →
          </Link>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
          <h3 className="font-semibold text-neutral-900 mb-2">Request Invoice</h3>
          <p className="text-sm text-neutral-600 mb-3">
            Download invoices and shipping documents for your completed orders.
          </p>
          <button className="text-sm text-green-600 font-medium hover:text-green-700">
            Coming Soon →
          </button>
        </Card>
      </div>
    </div>
  );
}
