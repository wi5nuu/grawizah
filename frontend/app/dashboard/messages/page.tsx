'use client';

import { useState, useEffect } from 'react';
import { Send, Paperclip, Smile, Check, CheckCheck, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { inquiryAPI } from '@/lib/api';

interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  message: string;
  created_at: string;
}

interface Conversation {
  id: string;
  contact_name: string;
  last_message: string;
  last_time: string;
  unread: number;
  avatar: string;
  online: boolean;
}

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load conversations from inquiries
    async function loadConversations() {
      try {
        const res = await inquiryAPI.list({ page: 1, limit: 50 });
        const inquiries = res.data.data?.inquiries || [];
        const convs: Conversation[] = inquiries.map((inq: any) => ({
          id: inq.id,
          contact_name: inq.sender_name || inq.receiver_name || 'Unknown',
          last_message: inq.last_message || 'No messages yet',
          last_time: inq.last_message_time ? new Date(inq.last_message_time).toLocaleTimeString() : '',
          unread: inq.unread_count || 0,
          avatar: (inq.sender_name || 'U')[0],
          online: Math.random() > 0.5,
        }));
        setConversations(convs);
      } catch (err) {
        console.error('Failed to load conversations:', err);
      } finally {
        setLoading(false);
      }
    }
    loadConversations();
  }, []);

  async function loadMessages(inquiryId: string) {
    try {
      const res = await inquiryAPI.getMessages(inquiryId);
      const msgs = res.data.data || [];
      setMessages(msgs);
      setActiveChat(inquiryId);
    } catch (err) {
      console.error('Failed to load messages:', err);
    }
  }

  async function sendMessage() {
    if (!newMessage.trim() || !activeChat) return;
    try {
      await inquiryAPI.sendMessage(activeChat, newMessage);
      setNewMessage('');
      const res = await inquiryAPI.getMessages(activeChat);
      setMessages(res.data.data || []);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-neutral-500 mt-3 text-sm">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-120px)] bg-white rounded-xl border border-neutral-200 overflow-hidden">
      {/* Conversations List */}
      <div className="w-80 border-r border-neutral-200 flex flex-col">
        <div className="p-4 border-b border-neutral-100">
          <h2 className="text-lg font-semibold text-neutral-900">Messages</h2>
          <p className="text-xs text-neutral-500 mt-0.5">{conversations.length} conversations</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-neutral-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
                <Mail className="w-6 h-6 text-neutral-400" />
              </div>
              <p className="text-sm text-neutral-500">No conversations yet</p>
              <Link href="/products" className="text-xs text-purple-500 hover:text-purple-600 mt-1 inline-block">
                Start connecting
              </Link>
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => loadMessages(conv.id)}
                className={`w-full flex items-center gap-3 p-4 hover:bg-neutral-50 transition-colors text-left border-b border-neutral-50 ${
                  activeChat === conv.id ? 'bg-purple-50 border-l-2 border-l-purple-500' : ''
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {conv.avatar}
                  </div>
                  {conv.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-neutral-900 truncate">{conv.contact_name}</p>
                    {conv.unread > 0 && (
                      <span className="text-[10px] bg-purple-500 text-white w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 truncate">{conv.last_message}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {conversations.find(c => c.id === activeChat)?.avatar || '?'}
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">
                    {conversations.find(c => c.id === activeChat)?.contact_name || 'Chat'}
                  </p>
                  <p className="text-[10px] text-green-500">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-neutral-100 rounded-lg">
                  <Phone className="w-4 h-4 text-neutral-600" />
                </button>
                <button className="p-2 hover:bg-neutral-100 rounded-lg">
                  <Mail className="w-4 h-4 text-neutral-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm text-neutral-500">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.sender_id === user?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] ${isMine ? 'order-2' : 'order-1'}`}>
                        <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                          isMine
                            ? 'bg-purple-600 text-white rounded-br-md'
                            : 'bg-white text-neutral-900 border border-neutral-200 rounded-bl-md'
                        }`}>
                          {msg.message}
                        </div>
                        <div className={`flex items-center gap-1 mt-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <span className="text-[10px] text-neutral-400">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isMine && <CheckCheck className="w-3 h-3 text-purple-400" />}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-neutral-100 bg-white">
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-neutral-100 rounded-lg">
                  <Paperclip className="w-5 h-5 text-neutral-400" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button className="p-2 hover:bg-neutral-100 rounded-lg">
                  <Smile className="w-5 h-5 text-neutral-400" />
                </button>
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-neutral-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <Mail className="w-8 h-8 text-neutral-300" />
              </div>
              <p className="text-neutral-900 font-medium">Select a conversation</p>
              <p className="text-sm text-neutral-500 mt-1">Choose from your existing conversations</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
