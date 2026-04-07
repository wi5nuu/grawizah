'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { BookOpen, User, Calendar, ArrowRight, Share2, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const posts = [
  { id: 1, title: "How AI is Revolutionizing Supply Chain Transparency", author: "Dr. Sarah Chen", date: "April 5, 2026", category: "Technology", image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop" },
  { id: 2, title: "Top 5 Emerging Commodities in Southeast Asia for 2026", author: "Budi Santoso", date: "April 2, 2026", category: "Market Insights", image: "https://images.unsplash.com/photo-1550258114-ad213b313ef0?w=600&h=400&fit=crop" },
  { id: 3, title: "Navigating New EU Trade Regulations: A Guide for Exporters", author: "Elena Rodriguez", date: "March 28, 2026", category: "Compliance", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=400&fit=crop" }
];

export default function BlogPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-neutral-50 min-h-screen pt-24 pb-16">
      <div className="max-w-[1440px] mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mb-16 px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">{t('footer_blog')}</h1>
          <p className="text-neutral-500">Expert analysis, trade intelligence, and the latest news from the global B2B marketplace.</p>
        </div>

        {/* Featured Post (Hero) */}
        <div className="bg-neutral-900 rounded-[3rem] p-8 md:p-16 text-white mb-16 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-1/2 h-full -z-0 opacity-20 group-hover:opacity-30 transition-opacity">
            <img src={posts[0].image} alt="Featured" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <div className="inline-block px-4 py-1.5 bg-primary-600 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              Featured Post
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 hover:text-primary-400 transition-colors cursor-pointer">
              {posts[0].title}
            </h2>
            <div className="flex items-center gap-6 text-neutral-400 text-sm mb-10">
              <span className="flex items-center gap-2"><User className="w-4 h-4" /> {posts[0].author}</span>
              <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {posts[0].date}</span>
            </div>
            <Button className="bg-white text-neutral-900 hover:bg-primary-600 hover:text-white px-10 py-5 rounded-2xl text-xl font-bold transition-all shadow-2xl">
              Read Article <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
             <div key={idx} className="bg-white rounded-[2.5rem] overflow-hidden border border-neutral-200 hover:border-primary-500 transition-all duration-300 hover:shadow-2xl group flex flex-col h-full">
               <div className="aspect-[16/10] overflow-hidden relative">
                 <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                 <div className="absolute top-4 left-4 inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-neutral-900 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                   {post.category}
                 </div>
               </div>
               
               <div className="p-8 flex flex-col flex-1">
                 <div className="flex items-center gap-4 text-xs text-neutral-400 mb-4 font-medium">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                    <span className="w-1 h-1 bg-neutral-300 rounded-full"></span>
                    <span className="flex items-center gap-1.5"><MessageCircle className="w-3.5 h-3.5" /> 12</span>
                 </div>
                 
                 <h3 className="text-xl font-bold text-neutral-900 mb-6 group-hover:text-primary-600 transition-colors line-clamp-2 cursor-pointer leading-tight">
                   {post.title}
                 </h3>
                 
                 <div className="mt-auto pt-6 border-t border-neutral-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center p-1">
                          <User className="w-4 h-4 text-neutral-400" />
                       </div>
                       <span className="text-xs font-bold text-neutral-700">{post.author}</span>
                    </div>
                    <button className="p-2 hover:bg-primary-50 rounded-lg text-neutral-400 hover:text-primary-600 transition-colors">
                       <Share2 className="w-4 h-4" />
                    </button>
                 </div>
               </div>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
