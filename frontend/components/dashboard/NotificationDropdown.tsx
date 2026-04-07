'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, MessageSquare, ShoppingCart, Shield, CreditCard, Star, Check, Trash2, Loader2, X } from 'lucide-react';
import { intelligenceAPI } from '@/lib/api';
import Link from 'next/link';

interface Alert {
  id: string;
  alert_type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const response = await intelligenceAPI.getAlerts();
      setAlerts(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    // Poll for new notifications every 60 seconds
    const interval = setInterval(fetchAlerts, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await intelligenceAPI.markAlertRead(id);
      setAlerts(alerts.map(a => a.id === id ? { ...a, is_read: true } : a));
    } catch (error) {
      console.error('Failed to mark alert as read:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'inquiry': return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'order': return <ShoppingCart className="w-4 h-4 text-green-500" />;
      case 'compliance': return <Shield className="w-4 h-4 text-purple-500" />;
      case 'payment': return <CreditCard className="w-4 h-4 text-amber-500" />;
      case 'subscription': return <Star className="w-4 h-4 text-yellow-500" />;
      default: return <Bell className="w-4 h-4 text-neutral-400" />;
    }
  };

  const unreadCount = alerts.filter(a => !a.is_read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-neutral-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all relative group"
      >
        <Bell className={`w-5 h-5 transition-transform ${isOpen ? 'scale-110' : 'group-hover:rotate-12'}`} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[8px] font-black text-white flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-neutral-100 z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
          {/* Header */}
          <div className="px-5 py-4 border-b border-neutral-50 bg-neutral-50/50 flex items-center justify-between">
            <h3 className="font-bold text-neutral-900 flex items-center gap-2 text-sm text-[11px] uppercase tracking-wider">
              Notifications
              {unreadCount > 0 && (
                <span className="bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full text-[10px]">
                  {unreadCount} New
                </span>
              )}
            </h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-neutral-200 rounded-lg text-neutral-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* List Area */}
          <div className="max-h-[400px] overflow-y-auto scrollbar-hide py-1">
            {loading && alerts.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-neutral-400">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                <p className="text-xs font-medium">Syncing notifications...</p>
              </div>
            ) : alerts.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center px-8">
                <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-neutral-200" />
                </div>
                <h4 className="text-sm font-bold text-neutral-900 mb-1">No alerts yet</h4>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  We'll notify you here when there's an update on your inquiries, orders, or compliance status.
                </p>
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`px-5 py-4 flex gap-4 transition-colors relative group hover:bg-neutral-50 cursor-pointer ${!alert.is_read ? 'bg-purple-50/30' : ''}`}
                  onClick={(e) => markAsRead(alert.id, e as any)}
                >
                  <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center border shadow-sm ${!alert.is_read ? 'bg-white border-purple-100' : 'bg-neutral-50 border-neutral-100'}`}>
                    {getIcon(alert.alert_type)}
                  </div>
                  <div className="flex-1 min-w-0 pr-8">
                    <p className={`text-[13px] leading-tight mb-1.5 ${!alert.is_read ? 'text-neutral-900 font-semibold' : 'text-neutral-600'}`}>
                      {alert.message}
                    </p>
                    <p className="text-[10px] text-neutral-400 font-medium">
                      {new Date(alert.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {!alert.is_read && (
                    <button
                      onClick={(e) => markAsRead(alert.id, e)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 bg-purple-600 text-white rounded-lg shadow-lg shadow-purple-200 transition-all active:scale-90"
                      title="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                  )}
                  {!alert.is_read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-600" />}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-neutral-50 bg-neutral-50/30">
            <Link 
              href="/dashboard/intelligence" 
              className="block w-full text-center py-2.5 text-[11px] font-black text-purple-600 hover:bg-white border border-transparent hover:border-purple-100 rounded-xl transition-all shadow-sm shadow-purple-100/20"
              onClick={() => setIsOpen(false)}
            >
              VIEW ALL INSIGHTS & ALERTS
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
