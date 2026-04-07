'use client';

import { useState, useEffect, useCallback } from 'react';
import { inquiryAPI } from '@/lib/api';

export interface Message {
  id: string | number;
  sender_id: string;
  sender_name: string;
  message?: string; // Backend uses 'message'
  content?: string; // Frontend uses 'content'
  created_at: string;
}

export function useRealtimeChat(inquiryId: string | number | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch initial messages from backend
  const fetchMessages = useCallback(async () => {
    if (!inquiryId) return;
    setLoading(true);
    try {
      const res = await inquiryAPI.getMessages(inquiryId.toString());
      const backendMessages = res.data.data || [];
      // Normalize 'message' to 'content' for frontend consistency
      const normalizedMessages = backendMessages.map((msg: any) => ({
        ...msg,
        content: msg.message || msg.content
      }));
      setMessages(normalizedMessages);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  }, [inquiryId]);

  useEffect(() => {
    fetchMessages();
    
    // In a real production app, we would set up a WebSocket or SSE here.
    // For now, we'll poll every 5 seconds to simulate real-time without WS overhead.
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const sendMessage = useCallback(async (content: string, senderName: string, senderId: string) => {
    if (!inquiryId || !content.trim()) return;

    // 1. Optimistic Update
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      sender_id: senderId,
      sender_name: senderName,
      content: content,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMessage]);

    // 2. Persist to Backend
    try {
      await inquiryAPI.sendMessage(inquiryId.toString(), content);
      // Re-fetch to get the official ID and timestamp from server
      fetchMessages();
    } catch (err) {
      console.error('Failed to send message:', err);
      // Remove optimistic message on failure
      setMessages((prev) => prev.filter(m => m.id !== optimisticMessage.id));
    }
  }, [inquiryId, fetchMessages]);

  return { messages, setMessages, sendMessage, loading, refresh: fetchMessages };
}
