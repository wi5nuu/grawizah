'use client';

import { Sparkles, Bot, Globe, Shield, BarChart3, FileText, Zap, Lock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';

export default function ServicesPage() {
  const { role } = useAuth();

  const isPremium = role === 'premium_trader' || role === 'admin';

  const services = [
    { icon: Bot, title: 'AI Translation', desc: 'Auto-translate messages with 50+ languages', premium: false },
    { icon: Globe, title: 'Market Analysis', desc: 'AI-powered market trend analysis', premium: true },
    { icon: Shield, title: 'Trade Insurance', desc: 'Protect your transactions with insurance', premium: false },
    { icon: BarChart3, title: 'Analytics Pro', desc: 'Advanced business analytics dashboard', premium: true },
    { icon: FileText, title: 'Document Builder', desc: 'Generate invoices, POs, and contracts', premium: false },
    { icon: Zap, title: 'Bulk Operations', desc: 'Batch upload products and manage inventory', premium: false },
    { icon: Sparkles, title: 'AI Product Writer', desc: 'Generate product descriptions automatically', premium: true },
    { icon: Lock, title: 'Custom Branding', desc: 'White-label your storefront', premium: true },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-neutral-900">More Services</h1>
        <p className="text-sm text-neutral-500 mt-1">Additional tools and services to grow your business</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((service, i) => {
          const Icon = service.icon;
          return (
            <Card
              key={i}
              className={`p-5 group cursor-pointer transition-all hover:shadow-lg ${
                service.premium && !isPremium ? 'opacity-60' : ''
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                service.premium && !isPremium
                  ? 'bg-neutral-100 text-neutral-400'
                  : 'bg-purple-50 text-purple-600 group-hover:bg-purple-100'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-neutral-900 text-sm mb-1">{service.title}</h3>
              <p className="text-xs text-neutral-500 mb-3">{service.desc}</p>
              {service.premium && !isPremium ? (
                <span className="text-[10px] bg-neutral-100 text-neutral-500 px-2 py-1 rounded-full font-medium flex items-center gap-1 w-fit">
                  <Lock className="w-3 h-3" />
                  Premium
                </span>
              ) : service.premium ? (
                <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-1 rounded-full font-medium flex items-center gap-1 w-fit">
                  Available
                </span>
              ) : (
                <span className="text-[10px] bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium w-fit">
                  Free
                </span>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
