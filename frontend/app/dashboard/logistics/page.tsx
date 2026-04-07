'use client';

import { useState } from 'react';
import { Truck, MapPin, Clock, Package, Search, Filter, Eye, Download } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Card';

export default function LogisticsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [trackingInput, setTrackingInput] = useState('');

  const shipments = [
    { id: 'SH-001', order: 'ORD-2026-001', from: 'Shenzhen, China', to: 'Jakarta, Indonesia', status: 'in_transit', eta: 'Apr 15, 2026', carrier: 'DHL Express', tracking: 'DHL123456789' },
    { id: 'SH-002', order: 'ORD-2026-002', from: 'Guangzhou, China', to: 'Surabaya, Indonesia', status: 'delivered', eta: 'Mar 28, 2026', carrier: 'FedEx', tracking: 'FX987654321' },
    { id: 'SH-003', order: 'ORD-2026-003', from: 'Shanghai, China', to: 'Jakarta, Indonesia', status: 'pending', eta: 'Apr 22, 2026', carrier: 'UPS', tracking: 'UPS456789123' },
  ];

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    in_transit: 'bg-blue-100 text-blue-700',
    delivered: 'bg-green-100 text-green-700',
  };

  const statusLabels: Record<string, string> = {
    pending: 'Pending',
    in_transit: 'In Transit',
    delivered: 'Delivered',
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-neutral-900">Logistics Services</h1>
        <p className="text-sm text-neutral-500 mt-1">Track shipments and manage your deliveries</p>
      </div>

      {/* Tracking Input */}
      <Card className="mb-6">
        <div className="p-4">
          <h2 className="font-semibold text-neutral-900 mb-3">Track Shipment</h2>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="Enter tracking number..."
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button className="px-6 py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
              Track
            </button>
          </div>
        </div>
      </Card>

      {/* Shipment List */}
      <Card>
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="font-semibold text-neutral-900">My Shipments</h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button className="p-1.5 hover:bg-neutral-100 rounded-lg">
              <Filter className="w-4 h-4 text-neutral-500" />
            </button>
          </div>
        </div>
        <div className="divide-y divide-neutral-100">
          {shipments.map((shipment) => (
            <div key={shipment.id} className="p-4 hover:bg-neutral-50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{shipment.order}</p>
                    <p className="text-xs text-neutral-500">{shipment.carrier} · {shipment.tracking}</p>
                  </div>
                </div>
                <Badge className={`${statusColors[shipment.status]} text-xs flex-shrink-0`}>
                  {statusLabels[shipment.status]}
                </Badge>
              </div>
              <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-neutral-600">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{shipment.from} → {shipment.to}</span>
                </div>
                <div className="hidden sm:block w-px h-3 bg-neutral-200"></div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>ETA: {shipment.eta}</span>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium">
                  <Eye className="w-3.5 h-3.5" />
                  View Details
                </button>
                <button className="flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-700">
                  <Download className="w-3.5 h-3.5" />
                  Download Docs
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
