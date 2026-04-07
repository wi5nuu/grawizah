'use client';

import { useState } from 'react';
import { Check, Crown, Star, Zap, Shield, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: '/month',
    desc: 'Get started with basic features',
    features: [
      'Browse product catalog',
      'Basic product listings (up to 10)',
      'In-App chat & WhatsApp bridge',
      'HS Code AI (3 checks/day)',
      'Basic inquiry management',
    ],
    notIncluded: ['Buyer Radar', 'Market Intelligence', 'Unlimited AI', 'Priority Support'],
    cta: 'Current Plan',
    current: true,
  },
  {
    id: 'basic',
    name: 'Basic',
    price: '$19',
    period: '/month',
    desc: 'For growing businesses',
    features: [
      'Everything in Free',
      'Unlimited product listings',
      'Advanced analytics',
      'HS Code AI (20 checks/day)',
      'Priority listing in search',
      'Basic support',
    ],
    notIncluded: ['Buyer Radar', 'Competitor Benchmarking', 'Market Intelligence'],
    cta: 'Upgrade to Basic',
    popular: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$49',
    period: '/month',
    desc: 'Full intelligence access',
    features: [
      'Everything in Basic',
      'Buyer Radar & Lead Scoring',
      'Competitor Benchmarking',
      'Market Intelligence',
      'Unlimited AI checks',
      'Document OCR & Sanction Screening',
      'Premium badge on profile',
      'Priority support',
    ],
    notIncluded: [],
    cta: 'Upgrade to Premium',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    desc: 'For large organizations',
    features: [
      'Everything in Premium',
      'Dedicated account manager',
      'Custom API access',
      'White-label options',
      'SLA guarantee',
      'On-premise deployment',
    ],
    notIncluded: [],
    cta: 'Contact Sales',
  },
];

export default function SubscriptionPage() {
  const { user, role } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState('');

  const isPremium = role === 'premium_trader' || role === 'admin';

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-neutral-900">Subscription</h1>
        <p className="text-sm text-neutral-500 mt-1">Choose the plan that fits your business needs</p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <span className={`text-sm ${billingCycle === 'monthly' ? 'text-neutral-900 font-medium' : 'text-neutral-500'}`}>Monthly</span>
        <button
          onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
          className="relative w-12 h-6 bg-purple-600 rounded-full p-0.5 transition-colors"
        >
          <div className={`w-5 h-5 bg-white rounded-full transition-transform ${billingCycle === 'yearly' ? 'translate-x-6' : ''}`}></div>
        </button>
        <span className={`text-sm ${billingCycle === 'yearly' ? 'text-neutral-900 font-medium' : 'text-neutral-500'}`}>
          Yearly
          <span className="text-green-500 text-xs ml-1">(Save 20%)</span>
        </span>
      </div>

      {/* Plan Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {plans.map((plan) => {
          const yearlyPrice = plan.price === 'Custom' ? 'Custom' : `$${Math.round(parseInt(plan.price.replace('$', '')) * 0.8)}`;
          const displayPrice = billingCycle === 'yearly' ? yearlyPrice : plan.price;

          return (
            <Card
              key={plan.id}
              className={`relative p-5 transition-all cursor-pointer ${
                plan.popular
                  ? 'border-2 border-purple-500 shadow-lg'
                  : plan.current
                  ? 'border-2 border-green-500'
                  : 'border border-neutral-200 hover:border-neutral-300'
              } ${selectedPlan === plan.id ? 'ring-2 ring-purple-500' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-purple-600 text-white text-[10px] px-3 py-1 rounded-full font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              {plan.current && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-green-500 text-white text-[10px] px-3 py-1 rounded-full font-medium">
                    Current Plan
                  </span>
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
                {plan.notIncluded.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2 opacity-40">
                    <span className="w-4 h-4 flex-shrink-0 mt-0.5 text-neutral-400">✕</span>
                    <span className="text-xs text-neutral-400">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  plan.current
                    ? 'bg-green-100 text-green-700 cursor-default'
                    : plan.popular
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {plan.cta}
              </button>
            </Card>
          );
        })}
      </div>

      {/* Current Subscription Status */}
      {isPremium && (
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Crown className="w-6 h-6 text-yellow-500" />
              <div>
                <p className="font-semibold text-neutral-900">Premium Plan Active</p>
                <p className="text-sm text-neutral-500">Your subscription renews on May 7, 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="text-sm text-purple-600 font-medium hover:text-purple-700">
                Manage Subscription
              </button>
              <ChevronRight className="w-4 h-4 text-purple-600" />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
