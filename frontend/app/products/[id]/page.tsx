'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Star, Shield, Crown, Send, MessageSquare, ArrowLeft, ChevronRight,
  MapPin, Globe, Phone, Mail, Package, Award, Truck, FileText, Clock,
  Check, CheckCircle, Zap, BarChart3, Users, Eye, Lock, LockIcon, Globe2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Card';
import { productsAPI, inquiryAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface Specification {
  key: string;
  value: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const { role } = useAuth();
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [mainImage, setMainImage] = useState(0);
  const [inquiryForm, setInquiryForm] = useState({ email: '', message: '' });

  useEffect(() => {
    fetchProductDetail();
  }, [productId]);

  const fetchProductDetail = async () => {
    try {
      const response = await productsAPI.getDetail(productId);
      if (response.data.success) {
        setProduct(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInquiry = async () => {
    if (role === 'guest') {
      router.push('/login');
      return;
    }
    if (!inquiryForm.message.trim()) return;
    try {
      await inquiryAPI.create({
        receiver_id: product?.company_id,
        product_id: productId,
        initial_message: inquiryForm.message,
      });
      alert('Inquiry sent successfully!');
      setInquiryForm({ email: '', message: '' });
    } catch (error) {
      console.error('Failed to send inquiry:', error);
    }
  };

  const images = (product?.images_url as string[]) || ['📦', '🔧', '📐', '️', '📦'];
  const specifications: Specification[] = (product?.specifications as Specification[]) || [
    { key: 'Model NO.', value: 'LNP-3001' },
    { key: 'Performance', value: 'No Leak' },
    { key: 'Certification', value: 'CE, ISO' },
    { key: 'Specification', value: '500-20000L/H' },
    { key: 'Origin', value: 'China' },
    { key: 'Production Capacity', value: '100 Set/Month' },
    { key: 'Weight', value: '200kg' },
    { key: 'Material', value: 'Stainless Steel 304' },
  ];
  const faq: FAQItem[] = (product?.faq as FAQItem[]) || [
    { question: 'What is the payment terms?', answer: 'We accept T/T, L/C, and Trade Assurance Order.' },
    { question: 'How to choose the shipment way?', answer: 'It is according to the order quantity, delivery time, costs and customs policy.' },
  ];

  // Related products
  const relatedProducts = Array(6).fill(null).map((_, i) => ({
    id: i,
    name: ['Industrial Pump', 'Water Pump', 'Chemical Pump', 'Food Grade Pump', 'High Pressure Pump', 'Oil Pump'][i],
    image: images[i % images.length],
    price: `$${(500 + i * 200).toLocaleString()}-${(2000 + i * 500).toLocaleString()}`,
  }));

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-6 bg-neutral-200 rounded w-1/3 mb-4"></div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-64 sm:h-80 md:h-96 bg-neutral-200 rounded-xl"></div>
            <div className="space-y-3">
              <div className="h-6 bg-neutral-200 rounded w-3/4"></div>
              <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
              <div className="h-4 bg-neutral-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-4">Product not found</h2>
        <Link href="/products">
          <Button>Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-neutral-100 min-h-screen">
      {product && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.title,
              image: typeof product.images_url === 'string' ? JSON.parse(product.images_url) : product.images_url || [],
              description: product.description,
              sku: product.id,
              brand: {
                "@type": "Brand",
                name: product.company_name,
              },
              offers: {
                "@type": "AggregateOffer",
                url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/products/${product.id}`,
                priceCurrency: product.currency || "USD",
                lowPrice: product.price_min || 0,
                highPrice: product.price_max || product.price_min || 0,
                availability: "https://schema.org/InStock",
              },
            }),
          }}
        />
      )}
      {/* BREADCRUMB */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3">
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-neutral-500 overflow-x-auto whitespace-nowrap scrollbar-hide">
            <Link href="/" className="hover:text-primary-600 flex-shrink-0">Home</Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <Link href="/products" className="hover:text-primary-600 flex-shrink-0">Products</Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <span className="text-neutral-400 flex-shrink-0">{product.category}</span>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <span className="text-neutral-900 truncate">{product.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        <div className="grid lg:grid-cols-4 gap-4 sm:gap-6">
          {/* MAIN CONTENT */}
          <div className="lg:col-span-3">
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {/* Image Gallery */}
              <div>
                <div className="bg-white rounded-xl overflow-hidden border border-neutral-200 mb-3">
                  <div className="aspect-square flex items-center justify-center text-6xl sm:text-7xl md:text-8xl bg-neutral-50 p-4">
                    {images[mainImage]}
                  </div>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {images.map((img: string, index: number) => (
                    <button
                      key={index}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-lg border-2 flex items-center justify-center text-xl sm:text-2xl flex-shrink-0 transition-colors ${
                        mainImage === index ? 'border-primary-600 bg-primary-50' : 'border-neutral-200'
                      }`}
                      onClick={() => setMainImage(index)}
                    >
                      {img}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-6">
                <h1 className="text-lg sm:text-xl font-bold text-neutral-900 mb-3 leading-tight">{product.title}</h1>
                
                <div className="mb-4">
                  {role === 'guest' ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl sm:text-2xl font-bold text-neutral-400">
                          {product.currency || 'US$'}{Math.floor(product.price_min || 0)}.xx
                          {product.price_max > product.price_min ? `-${Math.floor(product.price_max)}.xx` : ''}
                        </span>
                        <span className="text-xs sm:text-sm text-neutral-400">/ Set</span>
                      </div>
                      <button onClick={() => router.push('/login')} className="text-xs text-primary-600 hover:underline flex items-center gap-1 font-medium">
                        <Lock className="w-3 h-3" /> Sign in for exact price & trade terms
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-xl sm:text-2xl font-bold text-red-500">
                        {product.currency || 'US$'}{product.price_min?.toLocaleString()}{product.price_max > product.price_min ? `-${product.price_max?.toLocaleString()}` : ''}
                      </span>
                      <span className="text-xs sm:text-sm text-neutral-500 ml-2">/ Set (MOQ: 1 Set)</span>
                    </>
                  )}
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  {product.is_verified && (
                    <Badge variant="verified" className="text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified Supplier
                    </Badge>
                  )}
                  {product.is_premium && (
                    <Badge variant="premium" className="text-xs">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
                </div>

                {/* Quick Info */}
                <div className="space-y-2 text-xs sm:text-sm mb-6">
                  <div className="flex">
                    <span className="text-neutral-500 w-24 sm:w-28 flex-shrink-0">Model NO.</span>
                    <span className="text-neutral-900">LNP-3001</span>
                  </div>
                  <div className="flex">
                    <span className="text-neutral-500 w-24 sm:w-28 flex-shrink-0">HS Code</span>
                    <span className="text-neutral-900">{product.hs_code_manual || product.hs_code_ai_suggested || 'N/A'}</span>
                  </div>
                  <div className="flex">
                    <span className="text-neutral-500 w-24 sm:w-28 flex-shrink-0">Origin</span>
                    <span className="text-neutral-900">China</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-2 sm:space-y-3">
                  <Button className="w-full bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base py-2.5 sm:py-3" onClick={() => role === 'guest' ? router.push('/login') : document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' })}>
                    <Send className="w-4 h-4 mr-2" />
                    {role === 'guest' ? 'Join to Connect' : 'Start Order Request'}
                  </Button>
                  <Button variant="outline" className="w-full text-sm sm:text-base py-2.5 sm:py-3" onClick={() => role === 'guest' ? router.push('/login') : null}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Inquiry
                  </Button>
                  <Button variant="ghost" className="w-full border border-neutral-300 text-sm sm:text-base py-2.5 sm:py-3" onClick={() => role === 'guest' ? router.push('/login') : null}>
                    💬 Chat Now
                  </Button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-neutral-200 mb-6 sm:mb-8 overflow-hidden">
              <div className="flex border-b border-neutral-200 overflow-x-auto scrollbar-hide">
                {['overview', 'specifications', 'faq', 'company', 'logistics'].map((tab) => (
                  <button
                    key={tab}
                    className={`px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-neutral-500 hover:text-neutral-700'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="p-4 sm:p-6">
                {activeTab === 'overview' && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-3 sm:mb-4">Product Description</h3>
                    <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-6">{product.description}</p>
                    
                    <h4 className="font-semibold text-neutral-900 mb-3 text-sm sm:text-base">Packaging & Delivery</h4>
                    <div className="bg-neutral-50 rounded-lg p-3 sm:p-4">
                      <div className="grid sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                        <div>
                          <span className="text-neutral-500">Package Size</span>
                          <p className="text-neutral-900">100cm × 100cm × 50cm</p>
                        </div>
                        <div>
                          <span className="text-neutral-500">Gross Weight</span>
                          <p className="text-neutral-900">200kg</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'specifications' && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-3 sm:mb-4">Basic Info</h3>
                    <div className="grid sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 divide-neutral-200">
                      {specifications.map((spec: Specification, index: number) => (
                        <div key={index} className="flex border-b border-neutral-200 sm:border-0 py-3">
                          <span className="text-neutral-500 w-28 sm:w-40 flex-shrink-0 text-xs sm:text-sm">{spec.key}</span>
                          <span className="text-neutral-900 text-xs sm:text-sm">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'faq' && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-3 sm:mb-4">FAQ</h3>
                    <div className="space-y-3">
                      {faq.map((item: FAQItem, index: number) => (
                        <div key={index} className="bg-neutral-50 rounded-lg p-3 sm:p-4">
                          <p className="font-medium text-neutral-900 mb-1 text-xs sm:text-sm">Q{index + 1}: {item.question}</p>
                          <p className="text-xs sm:text-sm text-neutral-600 ml-2 sm:ml-4">A: {item.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'company' && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-3 sm:mb-4">Company Profile</h3>
                    {product.supplier_info && (
                      <div className="bg-neutral-50 rounded-lg p-4 sm:p-6">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary-100 rounded-lg flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">🏭</div>
                          <div>
                            <h4 className="font-semibold text-neutral-900 text-sm sm:text-base">{product.supplier_info.company_name}</h4>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <div className="flex items-center gap-1 text-yellow-500">
                                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                                <span className="text-xs sm:text-sm font-medium">5.0</span>
                              </div>
                              <Badge variant="verified" className="text-xs">Verified</Badge>
                            </div>
                            <div className="flex items-center gap-3 sm:gap-4 mt-2 text-xs sm:text-sm text-neutral-500">
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {product.supplier_info.country}</span>
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 4 YRS</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'logistics' && (
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-3 sm:mb-4">Logistics Information</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                      <div className="bg-neutral-50 rounded-lg p-3 sm:p-4 text-center">
                        <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 mx-auto mb-2" />
                        <p className="font-medium text-neutral-900 text-xs sm:text-sm">Prompt Shipment</p>
                        <p className="text-xs text-neutral-500 mt-1">Fast delivery</p>
                      </div>
                      <div className="bg-neutral-50 rounded-lg p-3 sm:p-4 text-center">
                        <Package className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 mx-auto mb-2" />
                        <p className="font-medium text-neutral-900 text-xs sm:text-sm">Secure Packaging</p>
                        <p className="text-xs text-neutral-500 mt-1">Plywood case</p>
                      </div>
                      <div className="bg-neutral-50 rounded-lg p-3 sm:p-4 text-center col-span-2 sm:col-span-1">
                        <Award className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 mx-auto mb-2" />
                        <p className="font-medium text-neutral-900 text-xs sm:text-sm">Quality Assured</p>
                        <p className="text-xs text-neutral-500 mt-1">CE & ISO</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Related Products */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-4">People who viewed this also viewed</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {relatedProducts.map((p, i) => (
                  <Link key={i} href={`/products/${i}`} className="group">
                    <Card className="overflow-hidden">
                      <div className="aspect-square bg-neutral-100 flex items-center justify-center text-3xl sm:text-4xl p-4">
                        {p.image}
                      </div>
                      <div className="p-2 sm:p-3">
                        <p className="text-[10px] sm:text-xs text-neutral-600 line-clamp-2 mb-1 group-hover:text-primary-600 transition-colors">{p.name}</p>
                        {role === 'guest' ? (
                          <div className="mt-1 flex flex-col gap-0.5">
                            <p className="font-bold text-neutral-400 text-[10px] sm:text-xs">
                              {p.price.split('-')[0].split('.')[0].replace(/\d/g, 'x')}.xx
                            </p>
                            <span className="text-[9px] text-primary-600 font-medium">Sign in to view</span>
                          </div>
                        ) : (
                          <p className="text-xs sm:text-sm font-bold text-neutral-900">{p.price}</p>
                        )}
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Related Categories & Hot Searches */}
            <div className="mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-4">Related Categories</h3>
              <div className="flex flex-wrap gap-2">
                {['Industrial Pump', 'Water Pump', 'Chemical Pump', 'Food Grade Pump', 'High Pressure Pump', 'Oil Pump', 'Vacuum Pump'].map((cat) => (
                  <Link key={cat} href={`/products?category=${cat}`} className="px-4 py-2 bg-white border border-neutral-200 rounded-full text-sm text-neutral-600 hover:border-primary-500 hover:text-primary-600 transition-colors">
                    {cat}
                  </Link>
                ))}
              </div>
            </div>

            {/* Inquiry Form */}
            <div id="inquiry-form" className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-6 mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-semibold text-neutral-900 mb-4">Send your message to this supplier</h3>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs sm:text-sm text-red-500 mb-1 block">* From:</label>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-red-500 mb-1 block">* To:</label>
                    <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs sm:text-sm text-neutral-600 flex items-center gap-2">
                      <span className="text-lg">👤</span>
                      {product.supplier_info?.company_name || 'Supplier'}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-xs sm:text-sm text-red-500 mb-1 block">* Message:</label>
                  <textarea
                    rows={4}
                    placeholder="Detail your product requirements..."
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none text-sm"
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                  />
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <Button onClick={handleInquiry} className="w-full sm:w-auto text-sm">
                    <Send className="w-4 h-4 mr-2" />
                    {role === 'guest' ? 'Login to Send' : 'Send'}
                  </Button>
                  <Link href="#" className="text-xs sm:text-sm text-primary-600 hover:underline">
                    Post a Sourcing Request Now
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="sticky top-16 sm:top-20 space-y-4">
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-lg flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">🏭</div>
                  <div className="min-w-0">
                    <p className="font-semibold text-neutral-900 text-xs sm:text-sm truncate">{product.supplier_info?.company_name || 'Supplier'}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs font-medium">5.0</span>
                      </div>
                      <Badge variant="verified" className="text-[10px]">Verified</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <Button className="w-full bg-red-500 hover:bg-red-600 text-white text-xs sm:text-sm py-2" onClick={() => role === 'guest' ? window.location.href='/login' : document.getElementById('inquiry-form')?.scrollIntoView({ behavior: 'smooth' })}>
                    {role === 'guest' ? 'Join to Connect' : 'Start Order Request'}
                  </Button>
                  <Button variant="outline" className="w-full text-xs sm:text-sm py-2" onClick={() => role === 'guest' ? window.location.href='/login' : null}>
                    Send Inquiry
                  </Button>
                  <Button variant="ghost" className="w-full border border-neutral-300 text-xs sm:text-sm py-2" onClick={() => role === 'guest' ? window.location.href='/login' : null}>
                    💬 Chat Now
                  </Button>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold text-neutral-900 mb-3 text-xs sm:text-sm">Supplier Info</h4>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 text-neutral-600">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600 flex-shrink-0" />
                    <span>{product.supplier_info?.country || 'China'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600 flex-shrink-0" />
                    <span>4 YRS</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-primary-600 flex-shrink-0" />
                    <span>{role === 'guest' ? 'Sign in to view' : '+86 123 456 7890'}</span>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-primary-50 to-accent-50 border-primary-200">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600 flex-shrink-0" />
                  <span className="font-semibold text-primary-700 text-xs sm:text-sm">Trade Assurance</span>
                </div>
                <p className="text-xs text-neutral-600">Protected payment guarantee.</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
