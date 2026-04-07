'use client';

import { useState, useEffect } from 'react';
import { Card, Badge } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  ArrowLeftRight, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Crown,
  Star,
  Loader2,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { productsAPI } from '@/lib/api';

export default function ComparePage() {
  const { role } = useAuth();
  const [comparedProducts, setComparedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedProducts();
  }, []);

  const fetchSavedProducts = async () => {
    try {
      const response = await productsAPI.saved();
      setComparedProducts(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch saved products:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id: string) => {
    try {
      await productsAPI.unsave(id);
      setComparedProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Failed to unsave product:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-20">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (comparedProducts.length === 0) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <div className="w-20 h-20 bg-neutral-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
          <ArrowLeftRight className="w-10 h-10 text-neutral-300" />
        </div>
        <h2 className="text-2xl font-black text-neutral-900 tracking-tight mb-2">Comparison List Empty</h2>
        <p className="text-neutral-500 mb-8 max-w-sm mx-auto">
          You haven't added any products to your comparison list. Start exploring our verified suppliers.
        </p>
        <Link href="/products">
          <Button className="bg-primary-600 hover:bg-primary-700 text-white">
            Explore Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight flex items-center gap-2">
            Supplier Benchmarking
          </h1>
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">
            Analyze and compare trade terms side-by-side
          </p>
        </div>
        
        <Link href="/products">
          <Button variant="outline" size="sm" className="border-neutral-300 text-neutral-700 font-bold">
            <Plus className="w-4 h-4 mr-2" /> Add More
          </Button>
        </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl border border-neutral-200 shadow-xl shadow-neutral-100 divide-x divide-neutral-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50/50">
              <th className="p-6 w-56 border-r border-neutral-100 align-top">
                <div className="flex items-center gap-2 text-neutral-400 mb-2">
                  <Info className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Comparison Criteria</span>
                </div>
              </th>
              {comparedProducts.map(product => (
                <th key={product.id} className="p-6 min-w-[280px] border-r border-neutral-100 last:border-0 relative group align-top">
                  <button 
                    onClick={() => removeProduct(product.id)}
                    className="absolute top-4 right-4 p-2 bg-white shadow-sm border border-neutral-100 rounded-lg text-neutral-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex flex-col gap-4">
                    <div className="w-20 h-20 bg-neutral-100 rounded-2xl overflow-hidden flex items-center justify-center text-[10px] font-black text-neutral-400 uppercase tracking-tighter">
                      {product.images_url?.[0] ? (
                         <img src={product.images_url[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        "Preview"
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {product.is_premium && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                        <Badge variant={product.is_verified ? "verified" : "default"} className="text-[9px] uppercase tracking-widest">
                          {product.is_verified ? 'Verified' : 'Unverified'}
                        </Badge>
                      </div>
                      <h3 className="font-black text-neutral-900 text-sm leading-tight line-clamp-2">
                        {product.title}
                      </h3>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 text-xs sm:text-sm">
            {/* Price */}
            <tr className="hover:bg-neutral-50/30 transition-colors">
              <td className="p-6 bg-neutral-50/30 border-r border-neutral-100 font-bold text-neutral-500 uppercase tracking-tighter text-[11px]">Est. Price Range</td>
              {comparedProducts.map(p => (
                <td key={p.id} className="p-6 border-r border-neutral-100 last:border-0">
                  <span className="font-black text-neutral-900 text-base">
                    {p.currency || '$'}{p.price_min?.toLocaleString()} - {p.price_max?.toLocaleString()}
                  </span>
                </td>
              ))}
            </tr>
            {/* Category */}
            <tr className="hover:bg-neutral-50/30 transition-colors">
              <td className="p-6 bg-neutral-50/30 border-r border-neutral-100 font-bold text-neutral-500 uppercase tracking-tighter text-[11px]">Industrial Category</td>
              {comparedProducts.map(p => (
                <td key={p.id} className="p-6 border-r border-neutral-100 last:border-0 font-medium text-neutral-600">
                  {p.category}
                </td>
              ))}
            </tr>
            {/* Supplier */}
            <tr className="hover:bg-neutral-50/30 transition-colors">
              <td className="p-6 bg-neutral-50/30 border-r border-neutral-100 font-bold text-neutral-500 uppercase tracking-tighter text-[11px]">Manufacturer</td>
              {comparedProducts.map(p => (
                <td key={p.id} className="p-6 border-r border-neutral-100 last:border-0">
                  <div className="flex flex-col gap-1.5">
                    <span className="font-black text-primary-700">{p.company_name}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} className={`w-3 h-3 ${i <= 5 ? 'text-amber-400 fill-current' : 'text-neutral-200'}`} />
                      ))}
                      <span className="text-[10px] font-black text-neutral-400 ml-1">5.0</span>
                    </div>
                  </div>
                </td>
              ))}
            </tr>
            {/* HS Code */}
            <tr className="hover:bg-neutral-50/30 transition-colors">
              <td className="p-6 bg-neutral-50/30 border-r border-neutral-100 font-bold text-neutral-500 uppercase tracking-tighter text-[11px]">HS Code Compliance</td>
              {comparedProducts.map(p => (
                <td key={p.id} className="p-6 border-r border-neutral-100 last:border-0 font-mono font-bold text-neutral-600 tracking-wider">
                  {p.hs_code_manual || 'In Review'}
                </td>
              ))}
            </tr>
            {/* Certification Badge Logic */}
            <tr className="hover:bg-neutral-50/30 transition-colors">
              <td className="p-6 bg-neutral-50/30 border-r border-neutral-100 font-bold text-neutral-500 uppercase tracking-tighter text-[11px]">Trade Assurance</td>
              {comparedProducts.map(p => (
                <td key={p.id} className="p-6 border-r border-neutral-100 last:border-0">
                  <div className="flex items-center gap-2 text-emerald-600 font-black text-[11px] uppercase tracking-widest">
                    <ShieldCheck className="w-4 h-4" /> Active Protection
                  </div>
                </td>
              ))}
            </tr>
            {/* Actions */}
            <tr>
              <td className="p-6 bg-neutral-50/30 border-r border-neutral-100"></td>
              {comparedProducts.map(p => (
                <td key={p.id} className="p-6 border-r border-neutral-100 last:border-0">
                  <Link href={`/dashboard/inquiries?product=${p.id}`}>
                    <Button className="w-full bg-neutral-900 border-0 hover:bg-neutral-800 text-white font-black text-[11px] uppercase tracking-widest shadow-lg shadow-neutral-200">
                      Request Quotation
                    </Button>
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex items-start gap-3 p-4 bg-neutral-50 rounded-xl border border-neutral-200 max-w-3xl">
        <Info className="w-5 h-5 text-neutral-400 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-neutral-500 font-medium leading-relaxed">
          Grawizah Benchmarking uses verified supplier data. Market terms, including pricing and lead times, are subject to final negotiation during the inquiry phase. AI-suggested HS Codes should be verified with local customs authorities.
        </p>
      </div>
    </div>
  );
}
