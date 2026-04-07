'use client';

import { useState } from 'react';
import { Bookmark, Heart, Star, Grid, List, Eye, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';

export default function SavedPage() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const savedProducts = [
    { id: 1, title: '2025 GTR6 AI Smart Watch AMOLED', price: '$10 - $25', image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=200&h=200&fit=crop', supplier: 'Starmax Technology', rating: 4.8 },
    { id: 2, title: 'Industrial Centrifugal Pump 15KW', price: '$900 - $1,800', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200&h=200&fit=crop', supplier: 'Dongguan Industrial', rating: 4.5 },
    { id: 3, title: 'Organic Green Tea Premium Grade', price: '$45 - $120', image: 'https://images.unsplash.com/photo-1563822249366-3efb23b8e0c9?w=200&h=200&fit=crop', supplier: 'Huasifei Technology', rating: 4.9 },
  ];

  const savedSuppliers = [
    { id: 1, name: 'Shenzhen Starmax Technology', products: 12, rating: 4.8, country: 'China', verified: true },
    { id: 2, name: 'Dongguan Industrial Pump', products: 8, rating: 4.5, country: 'China', verified: true },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Saved & History</h1>
          <p className="text-sm text-neutral-500 mt-1">Products and suppliers you've bookmarked</p>
        </div>
        <div className="flex items-center gap-2 bg-neutral-100 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-purple-600' : 'text-neutral-400'}`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-purple-600' : 'text-neutral-400'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Saved Products */}
      <Card className="mb-6">
        <div className="p-4 border-b border-neutral-100">
          <h2 className="font-semibold text-neutral-900">Saved Products</h2>
        </div>
        {savedProducts.length === 0 ? (
          <div className="p-8 text-center">
            <Bookmark className="w-10 h-10 mx-auto mb-3 text-neutral-300" />
            <p className="text-sm text-neutral-500">No saved products yet</p>
            <Link href="/products" className="text-xs text-purple-500 hover:text-purple-600 mt-1 inline-block">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="p-4">
            <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
              {savedProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="aspect-square bg-neutral-100 relative">
                      <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <button className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-neutral-500 line-clamp-2 mb-1">{product.title}</p>
                      <p className="text-sm font-semibold text-neutral-900">{product.price}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-neutral-600">{product.rating}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Saved Suppliers */}
      <Card>
        <div className="p-4 border-b border-neutral-100">
          <h2 className="font-semibold text-neutral-900">Saved Suppliers</h2>
        </div>
        {savedSuppliers.length === 0 ? (
          <div className="p-8 text-center">
            <Bookmark className="w-10 h-10 mx-auto mb-3 text-neutral-300" />
            <p className="text-sm text-neutral-500">No saved suppliers yet</p>
            <Link href="/suppliers" className="text-xs text-purple-500 hover:text-purple-600 mt-1 inline-block">
              Browse Suppliers
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {savedSuppliers.map((supplier) => (
              <div key={supplier.id} className="flex items-center gap-4 p-4 hover:bg-neutral-50 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {supplier.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-neutral-900">{supplier.name}</p>
                    {supplier.verified && (
                      <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">Verified</span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500">{supplier.products} products · {supplier.country}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-neutral-900">{supplier.rating}</span>
                  </div>
                  <button className="p-2 hover:bg-neutral-100 rounded-lg">
                    <ExternalLink className="w-4 h-4 text-neutral-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
