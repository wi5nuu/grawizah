'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Laptop, Smartphone, Shirt, Car, Coffee, Cpu, TestTube, Stethoscope, 
  Package, Home, ShoppingBag, Utensils, Construction, Gem, Zap
} from 'lucide-react';
import Link from 'next/link';

const categories = [
  { name: "Electronics", icon: Laptop, count: "12,450+ Products", sub: ["Smartphone", "Laptop", "Smart Watch"] },
  { name: "Apparel", icon: Shirt, count: "8,900+ Products", sub: ["T-Shirts", "Uniforms", "Fabric"] },
  { name: "Automotive", icon: Car, count: "5,600+ Products", sub: ["Parts", "Accessories", "PPF"] },
  { name: "Food & Beverage", icon: Coffee, count: "15,200+ Products", sub: ["Coconut", "Palm Oil", "Tea"] },
  { name: "Machinery", icon: Package, count: "4,100+ Products", sub: ["Pumps", "CNC", "Tools"] },
  { name: "Medical", icon: Stethoscope, count: "2,300+ Products", sub: ["Gloves", "Safety", "Supplies"] },
  { name: "Home & Garden", icon: Home, count: "7,800+ Products", sub: ["Furniture", "Lights", "Tools"] },
  { name: "Energy", icon: Zap, count: "1,500+ Products", sub: ["Solar", "Battery", "Panel"] },
  { name: "Construction", icon: Construction, count: "6,200+ Products", sub: ["Steel", "Cement", "Wood"] }
];

export default function CategoriesPage() {
  const { t } = useLanguage();

  return (
    <div className="bg-neutral-50 min-h-screen pt-24 pb-16">
      <div className="max-w-[1440px] mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">{t('footer_categories')}</h1>
          <p className="text-neutral-500">Explore our vast ecosystem of global trade categories. Find exactly what your business needs across 200+ industry verticals.</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div key={idx} className="bg-white rounded-[2.5rem] p-8 border border-neutral-200 hover:border-primary-500 transition-all duration-300 hover:shadow-2xl shadow-neutral-900/5 group">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-16 h-16 bg-primary-50 rounded-[1.5rem] flex items-center justify-center p-4">
                    <Icon className="w-8 h-8 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">{cat.name}</h3>
                    <p className="text-sm font-medium text-neutral-400">{cat.count}</p>
                  </div>
                </div>
                
                <div className="space-y-3 mb-8">
                  {cat.sub.map((sub, sIdx) => (
                    <Link key={sIdx} href={`/products?search=${sub.toLowerCase()}`} className="block text-sm text-neutral-500 hover:text-primary-600 hover:underline transition-all font-medium">
                      {sub}
                    </Link>
                  ))}
                </div>

                <Link href={`/products?category=${cat.name.toLowerCase()}`} className="w-full py-4 bg-neutral-50 text-neutral-900 rounded-2xl font-bold hover:bg-primary-600 hover:text-white transition-all flex items-center justify-center gap-2">
                  View All {cat.name}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
