'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MessageSquare, Send, Clock, CheckCircle, XCircle, Search, Filter, Loader2, ChevronLeft } from 'lucide-react';
import { Card, Badge } from '@/components/ui/Card';
import { useRealtimeChat } from '@/hooks/useRealtimeChat';
import { useAuth } from '@/contexts/AuthContext';
import { inquiryAPI } from '@/lib/api';

const statusIcons: Record<string, any> = {
  open: Clock,
  responded: CheckCircle,
  closed: XCircle,
};

const statusColors: Record<string, string> = {
  open: 'bg-blue-100 text-blue-700',
  responded: 'bg-indigo-100 text-indigo-700',
  closed: 'bg-neutral-100 text-neutral-700',
};

export default function DashboardInquiriesPage() {
  const { user, role } = useAuth();
  const isBuyer = role === 'buyer';
  
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, sendMessage, loading: chatLoading } = useRealtimeChat(selectedInquiry?.id || null);

  useEffect(() => {
    async function fetchInquiries() {
      try {
        const res = await inquiryAPI.list();
        setInquiries(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch inquiries:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchInquiries();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!replyMessage.trim() || !user) return;
    await sendMessage(replyMessage, user.full_name, user.id);
    setReplyMessage('');
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
            {isBuyer ? 'Inquiry Manager' : 'Inquiries'}
          </h1>
          <p className="text-xs text-neutral-500 font-medium">
            Manage your global trade communications and quotations
          </p>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Left: Inquiry List */}
        <div className={`w-full lg:w-96 flex flex-col gap-4 ${selectedInquiry ? 'hidden lg:flex' : 'flex'}`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 transition-all outline-none"
            />
          </div>

          <Card className="flex-1 overflow-hidden flex flex-col border-neutral-200/60 shadow-sm">
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/30">
              <span className="text-xs font-black text-neutral-400 uppercase tracking-widest">Conversations</span>
              <Filter className="w-3.5 h-3.5 text-neutral-400 cursor-pointer" />
            </div>
            
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
              </div>
            ) : inquiries.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8 text-neutral-300" />
                </div>
                <p className="text-sm font-bold text-neutral-900">No messages yet</p>
                <p className="text-xs text-neutral-500 mt-1">When you contact suppliers, your conversations will appear here.</p>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                {inquiries.map((inquiry) => {
                  const StatusIcon = statusIcons[inquiry.status] || Clock;
                  const isSelected = selectedInquiry?.id === inquiry.id;
                  return (
                    <button
                      key={inquiry.id}
                      className={`w-full p-4 text-left border-b border-neutral-50 transition-all group relative ${
                        isSelected ? 'bg-purple-50/50' : 'hover:bg-neutral-50'
                      }`}
                      onClick={() => setSelectedInquiry(inquiry)}
                    >
                      {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-600" />}
                      <div className="flex items-start justify-between mb-1">
                        <p className={`font-bold text-sm truncate flex-1 ${isSelected ? 'text-purple-700' : 'text-neutral-900'}`}>
                          {isBuyer ? inquiry.company_name : inquiry.sender_name}
                        </p>
                        <span className="text-[10px] font-bold text-neutral-400 ml-2">
                          {new Date(inquiry.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 font-medium truncate mb-2">Ref: {inquiry.product_title || 'General Inquiry'}</p>
                      <div className="flex items-center justify-between">
                        <Badge className={`${statusColors[inquiry.status]} text-[9px] font-black uppercase tracking-tighter py-0.5 px-2 rounded-full border-none`}>
                          {inquiry.status}
                        </Badge>
                        {inquiry.unread && <div className="w-2 h-2 bg-purple-600 rounded-full shadow-[0_0_8px_rgba(147,51,234,0.5)]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Right: Message Window */}
        <div className={`flex-1 flex flex-col ${!selectedInquiry ? 'hidden lg:flex' : 'flex'}`}>
          {selectedInquiry ? (
            <Card className="flex-1 flex flex-col overflow-hidden border-neutral-200/60 shadow-md">
              {/* Header */}
              <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedInquiry(null)} className="lg:hidden p-2 -ml-2 text-neutral-400">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-black text-sm shadow-inner">
                    {(isBuyer ? selectedInquiry.company_name : selectedInquiry.sender_name)?.[0]}
                  </div>
                  <div>
                    <h2 className="font-black text-neutral-900 text-sm leading-tight">
                      {isBuyer ? selectedInquiry.company_name : selectedInquiry.sender_name}
                    </h2>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">
                      {selectedInquiry.product_title || 'General Inquiry'}
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <button className="p-2 text-neutral-400 hover:text-purple-600 transition-colors">
                    <Clock className="w-4 h-4" />
                  </button>
                  <button className="px-4 py-1.5 bg-neutral-900 text-white text-[11px] font-black rounded-lg hover:bg-neutral-800 transition-all uppercase tracking-wider">
                    Actions
                  </button>
                </div>
              </div>

              {/* Chat Thread (WhatsApp Style) */}
              <div className="flex-1 bg-[#f0f2f5] p-6 overflow-y-auto space-y-4 scroll-smooth">
                {/* System Message */}
                <div className="flex justify-center">
                  <span className="bg-white/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-neutral-400 uppercase tracking-widest shadow-sm">
                    Inquiry Created • {new Date(selectedInquiry.created_at).toLocaleDateString()}
                  </span>
                </div>

                {messages.map((msg, index) => {
                  const isMe = msg.sender_id === user?.id;
                  return (
                    <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] group relative ${isMe ? 'items-end' : 'items-start'}`}>
                        {!isMe && (
                          <p className="text-[10px] font-bold text-neutral-400 mb-1 ml-1 uppercase tracking-tighter">
                            {msg.sender_name}
                          </p>
                        )}
                        <div className={`
                          px-4 py-2.5 rounded-2xl shadow-sm relative text-sm
                          ${isMe 
                            ? 'bg-purple-600 text-white rounded-tr-none' 
                            : 'bg-white text-neutral-800 rounded-tl-none'}
                        `}>
                          <p className="leading-relaxed font-medium">{msg.content}</p>
                          <div className={`flex items-center justify-end gap-1 mt-1 ${isMe ? 'text-purple-200' : 'text-neutral-400'}`}>
                            <span className="text-[9px] font-bold">
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isMe && <CheckCircle className="w-3 h-3" />}
                          </div>
                          
                          {/* Triangle tail */}
                          <div className={`absolute top-0 w-3 h-3 ${isMe ? '-right-2' : '-left-2'}`}>
                            <div className={`w-full h-full ${isMe ? 'bg-purple-600' : 'bg-white'} transform rotate-45 border-none`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-neutral-100">
                <div className="flex gap-3 items-end max-w-4xl mx-auto bg-neutral-50 p-2 rounded-2xl border border-neutral-200 focus-within:border-purple-300 focus-within:ring-4 focus-within:ring-purple-500/5 transition-all">
                  <textarea
                    placeholder="Type your message..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-3 resize-none max-h-32 scrollbar-hide outline-none"
                    rows={1}
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  <button 
                    disabled={!replyMessage.trim()}
                    className={`p-2.5 rounded-xl transition-all shadow-lg ${
                      replyMessage.trim() 
                        ? 'bg-purple-600 text-white hover:bg-purple-700 active:scale-95 shadow-purple-200' 
                        : 'bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none'
                    }`}
                    onClick={handleSend}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="flex-1 flex flex-col items-center justify-center p-12 bg-neutral-50/30 border-dashed border-2 border-neutral-200">
              <div className="w-24 h-24 bg-white shadow-xl rounded-[2.5rem] flex items-center justify-center mb-6 relative">
                <MessageSquare className="w-10 h-10 text-purple-200" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-purple-600 rounded-full border-4 border-neutral-50 flex items-center justify-center">
                  <div className="w-1 h-1 bg-white rounded-full animate-ping" />
                </div>
              </div>
              <h2 className="text-xl font-black text-neutral-900 tracking-tight mb-2">Select a Conversation</h2>
              <p className="text-sm text-neutral-500 font-medium text-center max-w-xs leading-relaxed">
                Connect with suppliers, negotiate deals, and manage your trade inquiries in one secure place.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
