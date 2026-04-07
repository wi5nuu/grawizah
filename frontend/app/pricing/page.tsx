'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, Crown, Star, Zap } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '/month',
    desc: 'Get started with basic features',
    features: ['Browse product catalog', 'Basic product listings (up to 10)', 'In-App chat & WhatsApp bridge', 'HS Code AI (3 checks/day)', 'Basic inquiry management'],
    cta: 'Get Started',
    current: false,
  },
  {
    id: 'basic',
    name: 'Basic',
    price: '$19',
    period: '/month',
    desc: 'For growing businesses',
    features: ['Everything in Free', 'Unlimited product listings', 'Advanced analytics', 'HS Code AI (20 checks/day)', 'Priority listing in search', 'Basic support'],
    cta: 'Start Basic',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$49',
    period: '/month',
    desc: 'Full intelligence access',
    features: ['Everything in Basic', 'Buyer Radar & Lead Scoring', 'Competitor Benchmarking', 'Market Intelligence', 'Unlimited AI checks', 'Document OCR & Sanction Screening', 'Premium badge on profile', 'Priority support'],
    cta: 'Go Premium',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For large organizations',
    features: ['Everything in Premium', 'Dedicated account manager', 'Custom API access', 'White-label options', 'SLA guarantee', 'On-premise deployment'],
    cta: 'Contact Sales',
  },
];

export default function PricingPage() {
  const { role } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
      {/* Header */}
      <div className="text-center mb-10">
        <Link href="/" className="inline-flex items-center gap-2 mb-6">
          <img src="/images/android-chrome-192x192.png" alt="Grawizah" className="w-12 h-12 rounded-xl" />
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Grawizah</h1>
            <p className="text-xs text-neutral-500">Intelligence Hub</p>
          </div>
        </Link>
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-3">Simple, Transparent Pricing</h1>
        <p className="text-neutral-500 text-lg max-w-2xl mx-auto">Choose the plan that fits your business needs. Upgrade or downgrade anytime.</p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <span className={`text-sm ${billingCycle === 'monthly' ? 'text-neutral-900 font-medium' : 'text-neutral-500'}`}>Monthly</span>
        <button
          onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
          className="relative w-12 h-6 bg-purple-600 rounded-full p-0.5 transition-colors"
        >
          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${billingCycle === 'yearly' ? 'translate-x-6' : ''}`}></div>
        </button>
        <span className={`text-sm ${billingCycle === 'yearly' ? 'text-neutral-900 font-medium' : 'text-neutral-500'}`}>
          Yearly <span className="text-green-500 text-xs ml-1">(Save 20%)</span>
        </span>
      </div>

      {/* Plans Grid */}
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {plans.map((plan) => {
          const yearlyPrice = plan.price === 'Custom' ? 'Custom' : `$${Math.round(parseInt(plan.price.replace('$', '')) * 0.8)}`;
          const displayPrice = billingCycle === 'yearly' ? yearlyPrice : plan.price;

          return (
            <Card key={plan.id} className={`relative p-6 transition-all ${plan.popular ? 'border-2 border-purple-500 shadow-lg' : 'border border-neutral-200'}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-purple-600 text-white text-[10px] px-3 py-1 rounded-full font-medium">Most Popular</span>
                </div>
              )}
              <div className="text-center mb-4">
                <h3 className="font-bold text-neutral-900">{plan.name}</h3>
                <p className="text-xs text-neutral-500 mt-0.5">{plan.desc}</p>
              </div>
              <div className="text-center mb-4">
                <span className="text-3xl font-bold text-neutral-900">{displayPrice}</span>
                <span className="text-sm text-neutral-500">{plan.period}</span>
              </div>
              <div className="space-y-2 mb-5">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-neutral-600">{feature}</span>
                  </div>
                ))}
              </div>
              <Link
                href={plan.id === 'enterprise' ? '/contact' : role ? '/dashboard/subscription' : '/register'}
                className={`block w-full py-2.5 rounded-lg text-sm font-medium text-center transition-colors ${
                  plan.popular ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {plan.cta}
              </Link>
            </Card>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-neutral-900 text-center mb-6">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {[
            { q: 'Can I switch plans anytime?', a: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.' },
            { q: 'Is there a free trial?', a: 'Yes, the Free plan lets you explore basic features with no credit card required.' },
            { q: 'What payment methods do you accept?', a: 'We accept credit/debit cards, bank transfers, and popular e-wallets.' },
          ].map((faq, i) => (
            <Card key={i} className="p-4">
              <p className="text-sm font-medium text-neutral-900 mb-1">{faq.q}</p>
              <p className="text-xs text-neutral-500">{faq.a}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
