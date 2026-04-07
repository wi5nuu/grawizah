'use client';

import { useState } from 'react';
import { CreditCard, Wallet, Landmark, Plus, Shield, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';

export default function PaymentPage() {
  const { user } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState('');

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, JCB', fee: '2.9%' },
    { id: 'bank', name: 'Bank Transfer', icon: Landmark, desc: 'Wire transfer, SEPA', fee: 'Free' },
    { id: 'wallet', name: 'E-Wallet', icon: Wallet, desc: 'PayPal, GoPay, OVO', fee: '1.5%' },
  ];

  const paymentHistory = [
    { id: 1, type: 'Subscription', amount: '$49.00', status: 'completed', date: 'Mar 15, 2026', method: 'Card' },
    { id: 2, type: 'Subscription', amount: '$49.00', status: 'completed', date: 'Feb 15, 2026', method: 'Bank Transfer' },
    { id: 3, type: 'Verification Fee', amount: '$25.00', status: 'pending', date: 'Mar 20, 2026', method: 'Card' },
  ];

  const statusColors: Record<string, string> = {
    completed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    failed: 'bg-red-100 text-red-700',
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-neutral-900">Payment</h1>
        <p className="text-sm text-neutral-500 mt-1">Manage your payment methods and billing history</p>
      </div>

      {/* Payment Methods */}
      <Card className="mb-6">
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="font-semibold text-neutral-900">Payment Methods</h2>
          <button className="flex items-center gap-1.5 text-sm text-purple-600 font-medium hover:text-purple-700">
            <Plus className="w-4 h-4" />
            Add Method
          </button>
        </div>
        <div className="p-4 space-y-3">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <div
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all ${
                  selectedMethod === method.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  selectedMethod === method.id ? 'bg-purple-100' : 'bg-neutral-100'
                }`}>
                  <Icon className={`w-5 h-5 ${selectedMethod === method.id ? 'text-purple-600' : 'text-neutral-600'}`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-neutral-900 text-sm">{method.name}</p>
                  <p className="text-xs text-neutral-500">{method.desc}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-neutral-500">Fee</p>
                  <p className="text-sm font-medium text-neutral-900">{method.fee}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Security */}
      <Card className="mb-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 mb-1">Secure Payments</h3>
            <p className="text-sm text-neutral-600">
              All transactions are encrypted with 256-bit SSL. Your payment information is never stored on our servers.
            </p>
          </div>
        </div>
      </Card>

      {/* Payment History */}
      <Card>
        <div className="p-4 border-b border-neutral-100">
          <h2 className="font-semibold text-neutral-900">Payment History</h2>
        </div>
        <div className="divide-y divide-neutral-100">
          {paymentHistory.map((payment) => (
            <div key={payment.id} className="flex items-center gap-4 p-4 hover:bg-neutral-50">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                payment.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                {payment.status === 'completed' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Clock className="w-4 h-4 text-yellow-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900">{payment.type}</p>
                <p className="text-xs text-neutral-500">{payment.date} · {payment.method}</p>
              </div>
              <Badge className={`${statusColors[payment.status]} text-xs flex-shrink-0`}>
                {payment.status}
              </Badge>
              <p className="text-sm font-semibold text-neutral-900 flex-shrink-0">{payment.amount}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
