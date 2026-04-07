'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { productsAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import {
  Search, Grid, List, ChevronDown, Shield, Crown, Star,
  MessageSquare, Truck, Eye, MapPin, Clock, Info, Check, Camera, Lock
} from 'lucide-react';



const featuredProducts = [
  { title: '1.96inch Amoled Screen Men Smart Watch KM...', price: 'Rp 370.858-38...', image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=200&h=200&fit=crop' },
  { title: 'KM95 Smart Watch Premium for Men with...', price: 'Rp 374.324-393...', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200&h=200&fit=crop' },
  { title: 'KM96 Smart Watch for Women 1.32" AMOLED...', price: 'Rp 362.193-381...', image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=200&h=200&fit=crop' },
  { title: 'Karen M 79mm Ultra-thin KM85 Lady...', price: 'Rp 289.408-30...', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop' },
];

const categories = [
  'Other Mobile Phone Accessories',
  'Smart Watches',
  'Fashion Smart Watches',
  'Smart Bracelets',
  'Watch Bands',
  'Wired Music Earphone & Headphone',
];


// Internal component that uses useSearchParams
function ProductsContent() {
  const { role } = useAuth();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await productsAPI.list({ limit: 50, search: searchQuery !== '' ? searchQuery : undefined });
        setProducts(res.data?.data?.data || []);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchQuery]);
  
  // ✅ Pindahkan ke DALAM komponen
  const [selectedShapes, setSelectedShapes] = useState<string[]>([]);

  const toggleShape = (shape: string) => {
    setSelectedShapes(prev =>
      prev.includes(shape) ? prev.filter(s => s !== shape) : [...prev, shape]
    );
  };


  return (
    <div className="min-h-screen bg-white">
      {/* ========== TOP TABS ========== */}
      <div className="border-b border-neutral-200 bg-white">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex items-center gap-8">
            <button className="py-3 px-1 border-b-2 border-neutral-900 text-neutral-900 font-semibold text-sm">
              Products
            </button>
            <Link href="/suppliers" className="py-3 px-1 text-neutral-500 hover:text-neutral-900 text-sm font-medium transition-colors">
              Suppliers
            </Link>
            <button className="py-3 px-1 text-neutral-500 hover:text-neutral-900 text-sm font-medium transition-colors">
              Worldwide
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 py-4">
        <div className="flex gap-6">
{/* ========== SIDEBAR FILTERS ========== */}
<aside className="w-56 flex-shrink-0 hidden lg:block">
  <div className="sticky top-24">
    <h3 className="font-semibold text-neutral-900 mb-4">Filters</h3>

    {/* Grawizah Guaranteed */}
    <div className="mb-4 pb-4 border-b border-neutral-200">
      <label className="flex items-start gap-2 cursor-pointer mb-2">
        <input type="checkbox" className="mt-0.5 w-4 h-4 text-primary-600 rounded" />
        <div>
          <span className="text-sm text-neutral-700">
            <span className="text-purple-600 font-medium">Grawizah Guaranteed</span>
            <Info className="w-3 h-3 inline ml-0.5 text-neutral-400" />
          </span>
          <p className="text-[10px] text-neutral-400 mt-0.5">Protects your orders on Grawizah.com</p>
        </div>
      </label>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" className="w-4 h-4 text-primary-600 rounded" />
        <span className="text-sm text-neutral-700 flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-yellow-500" />
          Trade Assurance
        </span>
      </label>
    </div>

    {/* Supplier features */}
    <div className="mb-4 pb-4 border-b border-neutral-200">
      <h4 className="text-sm font-medium text-neutral-700 mb-2">Supplier features</h4>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" className="w-4 h-4 text-primary-600 rounded" />
        <span className="text-sm text-neutral-700 flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-blue-500" />
          Verified Supplier
          <Info className="w-3 h-3 text-neutral-400" />
        </span>
      </label>
    </div>

    {/* Delivery by */}
    <div className="mb-4 pb-4 border-b border-neutral-200">
      <h4 className="text-sm font-medium text-neutral-700 mb-1 flex items-center gap-1">
        Delivery by <Info className="w-3 h-3 text-neutral-400" />
      </h4>
      <p className="text-[10px] text-neutral-400 mb-2">Unit price is subject to expected delivery date</p>
      <div className="space-y-1.5">
        {['24 Apr', '30 Apr', '06 May'].map((date) => (
          <label key={date} className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="delivery" className="w-4 h-4 text-primary-600" />
            <span className="text-sm text-neutral-600">Delivery by {date}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Store reviews */}
    <div className="mb-4 pb-4 border-b border-neutral-200">
      <h4 className="text-sm font-medium text-neutral-700 mb-2">Store reviews</h4>
      <p className="text-[10px] text-neutral-400 mb-2">Based on a 5-star rating system</p>
      <div className="space-y-1.5">
        {['4.0 & up', '4.5 & up', '5.0'].map((rating) => (
          <label key={rating} className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="review" className="w-4 h-4 text-primary-600" />
            <span className="text-sm text-neutral-600">{rating}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Product features */}
    <div className="mb-4 pb-4 border-b border-neutral-200">
      <h4 className="text-sm font-medium text-neutral-700 mb-2">Product features</h4>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" className="w-4 h-4 text-primary-600 rounded" />
        <span className="text-sm text-neutral-600">Paid samples</span>
      </label>
    </div>

    {/* Categories */}
    <div className="mb-4 pb-4 border-b border-neutral-200">
      <h4 className="text-sm font-medium text-neutral-700 mb-2">Categories</h4>
      <div className="max-h-40 overflow-y-auto space-y-1">
        {categories.map((cat) => (
          <label key={cat} className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="category" defaultChecked={cat === 'Smart Watches'} className="w-4 h-4 text-primary-600" />
            <span className="text-sm text-neutral-600">{cat}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Price */}
    <div className="mb-4 pb-4 border-b border-neutral-200">
      <h4 className="text-sm font-medium text-neutral-700 mb-2">Price</h4>
      <div className="flex items-center gap-2">
        <input type="text" placeholder="Min." className="w-full px-2 py-1.5 border border-neutral-300 rounded text-xs" />
        <span className="text-neutral-400">-</span>
        <input type="text" placeholder="Max." className="w-full px-2 py-1.5 border border-neutral-300 rounded text-xs" />
        <button className="px-3 py-1.5 border border-neutral-300 rounded text-xs hover:bg-neutral-50">OK</button>
      </div>
    </div>

    {/* Min. order */}
    <div className="mb-4 pb-4 border-b border-neutral-200">
      <h4 className="text-sm font-medium text-neutral-700 mb-2">Min. order</h4>
      <div className="flex items-center gap-2">
        <input type="text" placeholder="e.g. 10" className="w-full px-2 py-1.5 border border-neutral-300 rounded text-xs" />
        <button className="px-3 py-1.5 border border-neutral-300 rounded text-xs hover:bg-neutral-50">OK</button>
      </div>
    </div>

    {/* ===== NEW SECTIONS BELOW ===== */}

    {/* Supplier country/region */}
    <div className="mb-4 pb-4 border-b border-neutral-200">
      <h4 className="text-sm font-medium text-neutral-700 mb-2">Supplier country/region</h4>
      <div className="relative mb-2">
        <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input type="text" placeholder="Search" className="w-full pl-6 pr-2 py-1.5 border border-neutral-300 rounded text-xs" />
      </div>
      <div className="max-h-36 overflow-y-auto space-y-1.5">
        {[
          { code: 'CN', name: 'China' },
          { code: 'HK', name: 'Hong Kong SAR' },
          { code: 'IN', name: 'India' },
          { code: 'IT', name: 'Italy' },
          { code: 'KE', name: 'Kenya' },
          { code: 'US', name: 'United States' },
          { code: 'DE', name: 'Germany' },
          { code: 'JP', name: 'Japan' },
        ].map(({ code, name }) => (
          <label key={name} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 text-primary-600 rounded" />
            <span className="text-[10px] font-bold text-neutral-400 w-5">{code}</span>
            <span className="text-sm text-neutral-600">{name}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Management certifications */}
    <div className="mb-4 pb-4 border-b border-neutral-200">
      <h4 className="text-sm font-medium text-neutral-700 mb-2">Management certifications</h4>
      <div className="relative mb-2">
        <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input type="text" placeholder="Search" className="w-full pl-6 pr-2 py-1.5 border border-neutral-300 rounded text-xs" />
      </div>
      <div className="max-h-32 overflow-y-auto space-y-1.5">
        {[
          { badge: 'ISO', color: 'bg-blue-900 text-white' },
          { badge: 'BSCI', color: 'bg-yellow-600 text-white' },
          { badge: 'SA8000', color: 'bg-neutral-200 text-neutral-700' },
          { badge: 'WRAP', color: 'bg-neutral-200 text-neutral-700' },
        ].map(({ badge, color }) => (
          <label key={badge} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 text-primary-600 rounded" />
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${color}`}>{badge}</span>
            <span className="text-sm text-neutral-600">{badge}</span>
          </label>
        ))}
      </div>
      <p className="text-[9px] text-neutral-400 mt-2 leading-relaxed">
        *Certification Disclaimer: Any assessment, certification, inspection and/or related examination related to any authenticity of certificates are provided or conducted by independent third parties with no involvement from Grawizah.com.
      </p>
    </div>

    {/* Product certifications */}
    <div className="mb-4 pb-4 border-b border-neutral-200">
      <h4 className="text-sm font-medium text-neutral-700 mb-2">Product certifications</h4>
      <div className="relative mb-2">
        <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input type="text" placeholder="Search" className="w-full pl-6 pr-2 py-1.5 border border-neutral-300 rounded text-xs" />
      </div>
      <div className="max-h-40 overflow-y-auto space-y-1.5">
        {['CE', 'ROHS', 'FCC', 'EMC', 'TELEC', 'LVD', 'UKCA', 'IP68', 'CPC', 'C-TICK'].map((cert) => (
          <label key={cert} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 text-primary-600 rounded" />
            <span className="text-sm text-neutral-600">{cert}</span>
          </label>
        ))}
      </div>
      <p className="text-[9px] text-neutral-400 mt-2 leading-relaxed">
        *Certification Disclaimer: Any assessment related to authenticity is conducted by independent third parties.
      </p>
    </div>

    {/* Feature */}
    <div className="mb-4 pb-4 border-b border-neutral-200">
      <h4 className="text-sm font-medium text-neutral-700 mb-2">Feature</h4>
      <div className="max-h-40 overflow-y-auto space-y-1.5">
        {['GPS', 'Touch Screen', 'App Control', 'Bluetooth', '4G', 'Sim Card', 'NFC', 'SDK Available', 'USB', '5G', 'Cellular', 'E-SIM', 'Dustproof', 'Microphone', 'Anti-impact', 'LED Flashlight'].map((f) => (
          <label key={f} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 text-primary-600 rounded" />
            <span className="text-sm text-neutral-600">{f}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Function */}
    <div className="mb-4 pb-4 border-b border-neutral-200">
      <h4 className="text-sm font-medium text-neutral-700 mb-2">Function</h4>
      <div className="max-h-40 overflow-y-auto space-y-1.5">
        {['Fitness Tracker', 'Alarm Clock', 'Sleep Tracker', 'Heart Rate Tracker', 'Answer Call', 'Call Reminder', 'Remote Control', 'Calendar', 'Activity Tracker', 'GPS Navigation', 'Music Player', 'Pedometer', 'AI Voice Assistant', 'Message Reminder', 'Dial Call', 'Compass'].map((fn) => (
          <label key={fn} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 text-primary-600 rounded" />
            <span className="text-sm text-neutral-600">{fn}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Operating System */}
    <div className="mb-4 pb-4 border-b border-neutral-200">
      <h4 className="text-sm font-medium text-neutral-700 mb-2">Operating System</h4>
      <div className="space-y-1.5">
        {['Android', 'iOS', 'Wear OS', 'Harmony OS', 'Fitbit OS'].map((os) => (
          <label key={os} className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="os" className="w-4 h-4 text-primary-600" />
            <span className="text-sm text-neutral-600">{os}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Display Type */}
    <div className="mb-4 pb-4 border-b border-neutral-200">
      <h4 className="text-sm font-medium text-neutral-700 mb-2">Display Type</h4>
      <div className="space-y-1.5">
        {['AMOLED', 'OLED', 'IPS', 'Thin Film Transistor', 'LCD', 'LED'].map((dt) => (
          <label key={dt} className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 text-primary-600 rounded" />
            <span className="text-sm text-neutral-600">{dt}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Item Shape */}
    <div className="mb-4">
      <h4 className="text-sm font-medium text-neutral-700 mb-2">Item Shape</h4>
      <div className="flex flex-wrap gap-1.5">
        {['Round', 'Heart', 'Square', 'Rectangular', 'Oval', 'Star'].map((shape) => (
          <button
            key={shape}
            onClick={() => toggleShape(shape)}
            className={`px-2.5 py-1 border rounded-full text-xs transition-colors ${
              selectedShapes.includes(shape)
                ? 'border-purple-500 text-purple-600 bg-purple-50'
                : 'border-neutral-300 text-neutral-600 hover:border-purple-400'
            }`}
          >
            {shape}
          </button>
        ))}
      </div>
      <button className="text-xs text-purple-500 mt-2 hover:underline">View all filters ›</button>
    </div>

  </div>
</aside>

          {/* ========== MAIN CONTENT ========== */}
          <main className="flex-1">
            {/* Featured Supplier Card - Only show if no specific search or if searching for watch */}
            {(!searchQuery || searchQuery.toLowerCase().includes('watch')) && (
              <div className="bg-white border border-neutral-200 rounded-lg p-4 mb-4">
                <div className="flex gap-4">
                  {/* Main Image */}
                  <div className="w-72 flex-shrink-0">
                    <div className="relative aspect-square bg-neutral-100 rounded-lg overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop" alt="Featured" className="w-full h-full object-cover" />
                      <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded font-medium">
                        FAST DELIVERY
                      </div>
                      <div className="absolute bottom-2 right-2 flex gap-1">
                        <span className="bg-black/50 text-white p-1 rounded text-xs"><Eye className="w-3.5 h-3.5" /></span>
                        <span className="bg-black/50 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">VR</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs text-neutral-400 mb-0.5">
                          <span className="text-blue-500 font-medium">Verified</span> Smart Watches (KM Series)
                        </p>
                        <h3 className="text-sm font-medium text-neutral-900 hover:text-primary-600 cursor-pointer underline">
                          Shenzhen Karen M Electronics Co., Ltd.
                        </h3>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => role === 'guest' ? window.location.href = '/login' : null} className="px-3 py-1.5 border border-neutral-300 rounded-full text-xs hover:bg-neutral-50">Chat now</button>
                        <button onClick={() => role === 'guest' ? window.location.href = '/login' : null} className="px-3 py-1.5 border border-neutral-300 rounded-full text-xs hover:bg-neutral-50">Contact Supplier</button>
                      </div>
                    </div>

                    {/* Product Thumbnails */}
                    <div className="flex gap-3 mt-4">
                      {featuredProducts.map((product, index) => (
                        <div key={index} className="w-24 flex-shrink-0">
                          <div className="aspect-square bg-neutral-100 rounded-lg overflow-hidden mb-1">
                            <img src={product.image} alt={product.title} className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer" />
                          </div>
                          <p className="text-[10px] text-neutral-600 line-clamp-2 leading-tight">{product.title}</p>
                          <p className="text-[10px] font-bold text-red-600 mt-0.5">{product.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-neutral-600">
                Showing <span className="font-semibold text-neutral-900">{products.length}+</span> products from global suppliers {searchQuery ? `for "${searchQuery}"` : ''}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-neutral-500">Sort by</span>
                  <select className="text-sm border-none bg-transparent focus:outline-none cursor-pointer font-medium" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="relevance">relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-neutral-400" />
                </div>
                <div className="flex items-center gap-1 bg-neutral-100 rounded p-0.5">
                  <button className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-neutral-400'}`} onClick={() => setViewMode('grid')}>
                    <Grid className="w-4 h-4" />
                  </button>
                  <button className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-neutral-400'}`} onClick={() => setViewMode('list')}>
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Free Shipping Banner */}
            <div className="bg-purple-50 border border-purple-100 rounded-lg px-4 py-2.5 mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-purple-500" />
                <span className="text-sm"><span className="font-semibold text-purple-600">FREE shipping</span> on your first order</span>
              </div>
              <Link href="/register" className="text-sm text-primary-600 hover:underline font-medium">Sign in</Link>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20 text-neutral-500">
                <p>Loading products...</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-lg transition-all group">
                    {/* Image */}
                    <div className="relative aspect-square bg-neutral-100 overflow-hidden">
                      <img src={Array.isArray(product.images_url) ? product.images_url[0] : (product.images_url && typeof product.images_url === 'string' ? JSON.parse(product.images_url)[0] : 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop')} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <button className="absolute bottom-2 left-2 p-1.5 bg-white/80 rounded-full hover:bg-white">
                        <Camera className="w-3.5 h-3.5 text-neutral-600" />
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-3">


                      {/* Title */}
                      <h3 className="text-xs text-neutral-900 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors leading-relaxed">
                        {product.title}
                      </h3>

                      {/* Price */}
                      {role === 'guest' ? (
                        <div className="mb-1 leading-none">
                          <p className="text-sm font-bold text-neutral-400">
                            {product.currency} {Math.floor(product.price_min || 0)}.xx
                            {product.price_max && product.price_max > product.price_min ? ` - ${Math.floor(product.price_max)}.xx` : ''}
                          </p>
                          <Link href="/login" className="text-[10px] text-primary-600 hover:underline flex items-center gap-0.5 mt-0.5 font-medium">
                            <Lock className="w-2.5 h-2.5" /> Sign in for exact price
                          </Link>
                        </div>
                      ) : (
                        <p className="text-base font-bold text-red-600 mb-1">{product.currency} {product.price_min?.toLocaleString()}{product.price_max && product.price_max > product.price_min ? ` - ${product.price_max?.toLocaleString()}` : ''}</p>
                      )}

                      {/* Min order & sold */}
                      <p className="text-[11px] text-neutral-500 mb-1">Stock available</p>

                      {/* Guaranteed badge */}
                      {product.is_premium && (
                        <div className="inline-block bg-yellow-50 text-yellow-700 text-[10px] px-2 py-0.5 rounded mb-1.5">
                          <Shield className="w-2.5 h-2.5 inline mr-0.5" />
                          Guaranteed
                        </div>
                      )}

                      {/* Free shipping */}
                      <p className="text-[10px] text-green-600 font-medium mb-1.5">Free shipping options available</p>

                      {/* Supplier info */}
                      <div className="pt-2 border-t border-neutral-100">
                        <p className="text-[11px] text-neutral-600 truncate">{product.company_name}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-neutral-400">
                          {product.is_verified && (
                            <span className="text-blue-600 font-medium flex items-center gap-0.5">
                              <Shield className="w-2.5 h-2.5" />
                              Verified
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-neutral-300" />
                            {product.category}
                          </span>
                          <span>China</span>
                          <span className="flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 text-yellow-500 fill-current" />
                            4.8
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => role === 'guest' ? window.location.href = '/login' : null} className="flex-1 py-1.5 border border-neutral-300 rounded-full text-xs hover:bg-neutral-50 transition-colors">
                          {product.guaranteed ? 'Add to cart' : 'Chat now'}
                        </button>
                        {!product.guaranteed && (
                          <button onClick={() => role === 'guest' ? window.location.href = '/login' : null} className="flex-1 py-1.5 border border-neutral-300 rounded-full text-xs hover:bg-neutral-50 transition-colors">
                            Chat now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-lg transition-all flex group">
                    <div className="w-48 flex-shrink-0 relative aspect-square bg-neutral-100 overflow-hidden">
                      <img src={Array.isArray(product.images_url) ? product.images_url[0] : (product.images_url && typeof product.images_url === 'string' ? JSON.parse(product.images_url)[0] : 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop')} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="flex-1 p-4 flex flex-col justify-between">
                      <div>
                        {/* Certifications - Removed mock data to simplify */}
                        <h3 className="text-sm text-neutral-900 group-hover:text-primary-600 transition-colors mb-2">{product.title}</h3>
                        {role === 'guest' ? (
                          <div className="mb-2 mt-1">
                            <p className="text-sm font-bold text-neutral-400">
                              {product.currency} {Math.floor(product.price_min || 0)}.xx
                              {product.price_max && product.price_max > product.price_min ? ` - ${Math.floor(product.price_max)}.xx` : ''}
                            </p>
                            <Link href="/login" className="text-[10px] text-primary-600 hover:underline flex items-center gap-0.5 mt-0.5 font-medium">
                              <Lock className="w-2.5 h-2.5" /> Sign in for exact price
                            </Link>
                          </div>
                        ) : (
                          <p className="text-lg font-bold text-red-600 mb-1">{product.currency} {product.price_min?.toLocaleString()}{product.price_max && product.price_max > product.price_min ? ` - ${product.price_max?.toLocaleString()}` : ''}</p>
                        )}
                        <p className="text-xs text-neutral-500">Stock Available</p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div>
                          <p className="text-sm text-neutral-600">{product.company_name}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-neutral-400">
                            <span className="flex items-center gap-1">
                               <div className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                               {product.category}
                            </span>
                            <span>China</span>
                            <span className="flex items-center gap-0.5">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              4.8
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => role === 'guest' ? window.location.href = '/login' : null} className="px-4 py-1.5 border border-neutral-300 rounded-full text-xs hover:bg-neutral-50">Chat now</button>
                          <button onClick={() => role === 'guest' ? window.location.href = '/login' : null} className="px-4 py-1.5 border border-neutral-300 rounded-full text-xs hover:bg-neutral-50">Contact Supplier</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

// Default export wrapped in Suspense boundary
export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading products...</p>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
