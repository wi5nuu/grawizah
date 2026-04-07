'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { productsAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import {
  Search, ChevronRight, Star, Shield, Truck,
  MessageSquare, FileText, Zap, Brain, BarChart3,
  TrendingUp, Package, Tag, ZapIcon, Menu, X, Globe,
  Check, Lock, Crown, Clock, ChevronDown, Factory,
  Smartphone, Shirt, Car, Coffee, Cpu, TestTube, Stethoscope,
  Sparkles, Zap as BoltIcon, Crown as CrownIcon, ArrowRight
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/Button';

const categories = [
  { name: 'Machinery', href: '/products?category=machinery', icon: Factory },
  { name: 'Electronics', href: '/products?category=electronics', icon: Smartphone },
  { name: 'Textiles', href: '/products?category=textiles', icon: Shirt },
  { name: 'Automotive', href: '/products?category=automotive', icon: Car },
  { name: 'Food & Beverage', href: '/products?category=food', icon: Coffee },
  { name: 'Electrical', href: '/products?category=electrical', icon: Cpu },
  { name: 'Chemicals', href: '/products?category=chemicals', icon: TestTube },
  { name: 'Medical', href: '/products?category=medical', icon: Stethoscope },
];

const frequentlySearched = [
  { title: 'Mobile Phones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop', href: '/products?search=mobile', id: 'e1000000-0000-0000-0000-000000000017' },
  { title: 'Luxury Watches', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop', href: '/products?search=watch', id: 'e1000000-0000-0000-0000-000000000018' },
  { title: 'Premium Perfume', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=300&h=300&fit=crop', href: '/products?search=perfume', id: 'e1000000-0000-0000-0000-000000000019' },
  { title: 'Fresh Coconut', image: '/assets/products/coconut.png', href: '/products?search=coconut', id: 'e1000000-0000-0000-0000-000000000020' },
  { title: 'Crude Palm Oil', image: '/assets/products/palm_oil.png', href: '/products?search=palm', id: 'e1000000-0000-0000-0000-000000000021' },
  { title: 'Smart LED TV', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=300&fit=crop', href: '/products?search=tv', id: 'e1000000-0000-0000-0000-000000000022' },
  { title: 'Gaming Laptop', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop', href: '/products?search=laptop', id: 'e1000000-0000-0000-0000-000000000023' },
  { title: 'Arabica Coffee', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=300&fit=crop', href: '/products?search=coffee', id: 'e1000000-0000-0000-0000-000000000024' },
  { title: 'Safety Boots', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop', href: '/products?search=boots', id: 'e1000000-0000-0000-0000-000000000025' }
];

const firstOrderProducts = [
  { name: 'Smart Watch Pro', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop', price: 'Rp 171,219', moq: 'MOQ: 3' },
  { name: 'Luxury Watch', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop', price: 'Rp 1,088,312', moq: 'MOQ: 1' },
  { name: 'Wireless Earbuds', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=300&fit=crop', price: 'Rp 6,759', moq: 'MOQ: 40' },
  { name: 'Bluetooth Speaker', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop', price: 'Rp 117,843', moq: 'MOQ: 10' },
  { name: 'Sport Watch', image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=300&h=300&fit=crop', price: 'Rp 68,627', moq: 'MOQ: 10' },
  { name: 'Industrial Motor', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&h=300&fit=crop', price: 'Rp 311,937', moq: 'MOQ: 10' },
];

const guaranteedProducts = [
  { name: 'Circuit Board', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=300&fit=crop', price: 'Rp 10,225', shipping: 'FREE shipping' },
  { name: 'USB Drive', image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=300&h=300&fit=crop', price: 'Rp 2,947', shipping: 'FREE shipping' },
  { name: 'Custom T-Shirt', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop', price: 'Rp 47,138', shipping: 'FREE shipping' },
  { name: 'Safety Glasses', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop', price: 'Rp 398,586', shipping: 'FREE shipping' },
];

const customizationProducts = [
  { name: 'Leather Sandals', image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?w=300&h=300&fit=crop', price: 'Rp 129,974', moq: 'MOQ: 2', label: 'Logo/graphic design' },
  { name: 'Industrial Motor', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&h=300&fit=crop', price: 'Rp 1,299,735', moq: 'MOQ: 1', label: 'Name plate' },
  { name: 'Green Tea', image: 'https://images.unsplash.com/photo-1563822249366-3efb23b8e0c9?w=300&h=300&fit=crop', price: 'Rp 779,841', moq: 'MOQ: 1', label: 'Logo/graphic design' },
  { name: 'Colorful Straws', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop', price: 'Rp 10,398', moq: 'MOQ: 2', label: 'Cardboard' },
];

const topDeals = [
  { name: 'Beauty Serum', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop', price: 'Rp 34,660', moq: 'MOQ: 12' },
  { name: 'Glass Bottles', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=300&h=300&fit=crop', price: 'Rp 6,932', moq: 'MOQ: 100' },
  { name: 'Hair Care Oil', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=300&h=300&fit=crop', price: 'Rp 22,009', moq: 'MOQ: 10' },
  { name: 'Hair Serum', image: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300&h=300&fit=crop', price: 'Rp 63,254', moq: 'MOQ: 1' },
  { name: 'Lab Equipment', image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=300&h=300&fit=crop', price: 'Rp 5,632,185', moq: 'MOQ: 1' },
  { name: 'Car Coating', image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=300&h=300&fit=crop', price: 'Rp 15,597', moq: 'MOQ: 20' },
  { name: 'Portable Charger', image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=300&h=300&fit=crop', price: 'Rp 45,000', moq: 'MOQ: 50' },
  { name: 'LED Strip Light', image: '/assets/products/led_strip.png', price: 'Rp 28,500', moq: 'MOQ: 30' },
];

const topRankings = [
  { name: 'Adhesives & Sealants', image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=300&h=300&fit=crop', tag: 'Hot selling' },
  { name: 'Shock Absorbers', image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=300&h=300&fit=crop', tag: 'Hot selling' },
  { name: 'Office Chairs', image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=300&h=300&fit=crop', tag: 'Hot selling' },
  { name: 'Dump Trucks', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=300&fit=crop', tag: 'Hot selling' },
  { name: 'Car Body Kits', image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=300&h=300&fit=crop', tag: 'Hot selling' },
  { name: 'Gear Boxes', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&h=300&fit=crop', tag: 'Hot selling' },
];

const samples = [
  { name: 'Industrial Pump', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=300&fit=crop', price: '$1,600' },
  { name: 'CNC Machine Parts', image: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=300&h=300&fit=crop', price: '$500' },
  { name: 'LED Display Panel', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop', price: '$501' },
  { name: 'Motor Assembly', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&h=300&fit=crop', price: '$1,471' },
  { name: 'Hydraulic Valve', image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=300&h=300&fit=crop', price: '$890' },
  { name: 'Conveyor Belt', image: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=300&h=300&fit=crop', price: '$2,300' },
  { name: 'Air Filter Unit', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop', price: '$750' },
  { name: 'Steel Bearing', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=300&fit=crop', price: '$320' },
  { name: 'Electric Relay', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&h=300&fit=crop', price: '$185' },
];

const popularTags = ['Coffee Beans', 'Palm Oil', 'Rubber', 'Machinery', 'Electronics'];

const heroImages = [
  'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1920&q=80',
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&q=80',
  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1920&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=1920&q=80',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80'
];

const protection = [
  { icon: FileText, title: 'Ordering', features: ['Secured Trading', 'Refunds'] },
  { icon: Shield, title: 'Payment', features: ['Batch payment', 'Multiple methods'] },
  { icon: Truck, title: 'Shipment', features: ['Prompt delivery', 'Trackable'] },
  { icon: MessageSquare, title: 'After-sales', features: ['Confirm receipt', 'Support'] },
];

// Pricing plans data
const pricingPlans = [
  {
    name: 'Free',
    subtitle: 'For beginners',
    price: 'Rp0',
    period: '/month',
    discount: null,
    isPopular: false,
    features: [
      { name: 'Browse products', included: true },
      { name: 'Upload up to 5 products', included: true },
      { name: 'Basic AI HS Code', included: true },
      { name: 'Chat support', included: true },
      { name: 'Buyer database access', included: false },
      { name: 'Competitor intelligence', included: false },
      { name: 'Premium badge', included: false },
      { name: 'Priority support', included: false },
    ],
    cta: 'Get Started',
    ctaVariant: 'outline' as const,
  },
  {
    name: 'Basic',
    subtitle: 'For small businesses',
    price: 'Rp299,000',
    period: '/month',
    discount: 'Save 20%',
    isPopular: false,
    features: [
      { name: 'Unlimited product uploads', included: true },
      { name: 'Advanced AI HS Code', included: true },
      { name: 'WhatsApp bridge', included: true },
      { name: 'Basic buyer database', included: true },
      { name: '50 AI queries/month', included: true },
      { name: 'Competitor intelligence', included: false },
      { name: 'Premium badge', included: false },
      { name: 'Priority support', included: false },
    ],
    cta: 'Start Free Trial',
    ctaVariant: 'outline' as const,
  },
  {
    name: 'Premium',
    subtitle: 'For growing businesses',
    price: 'Rp799,000',
    period: '/month',
    discount: 'Save 30%',
    isPopular: true,
    features: [
      { name: 'Everything in Basic', included: true },
      { name: 'Unlimited AI queries', included: true },
      { name: 'Buyer radar scoring', included: true },
      { name: 'Competitor benchmark', included: true },
      { name: 'Market alerts', included: true },
      { name: 'Premium badge', included: true },
      { name: 'Priority support', included: true },
      { name: 'Custom branding', included: true },
    ],
    cta: 'Start Free Trial',
    ctaVariant: 'primary' as const,
  },
  {
    name: 'Enterprise',
    subtitle: 'For large organizations',
    price: 'Rp2,499,000',
    period: '/month',
    discount: 'Save 40%',
    isPopular: false,
    features: [
      { name: 'Everything in Premium', included: true },
      { name: 'Dedicated account manager', included: true },
      { name: 'Custom API access', included: true },
      { name: 'White-label solution', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Team collaboration', included: true },
      { name: 'SLA guarantee', included: true },
      { name: '24/7 phone support', included: true },
    ],
    cta: 'Contact Sales',
    ctaVariant: 'outline' as const,
  },
];

export default function HomePage() {
  const { t } = useLanguage();
  const { role } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  // States for mobile auto-switching cards
  const [activeSavingsIdx, setActiveSavingsIdx] = useState(0);
  const [activeGuaranteedIdx, setActiveGuaranteedIdx] = useState(0);
  const [activeCustomizationIdx, setActiveCustomizationIdx] = useState(0);

  const [dFirstOrder, setDFirstOrder] = useState<any[]>(firstOrderProducts);
  const [dGuaranteed, setDGuaranteed] = useState<any[]>(guaranteedProducts);
  const [dCustomization, setDCustomization] = useState<any[]>(customizationProducts);
  const [dTopDeals, setDTopDeals] = useState<any[]>(topDeals);
  const [dTopRankings, setDTopRankings] = useState<any[]>(topRankings);
  const [dSamples, setDSamples] = useState<any[]>(samples);
  const [dFrequentlySearched, setDFrequentlySearched] = useState<any[]>(frequentlySearched);

  useEffect(() => {
    const loadDynamic = async () => {
      try {
        const res = await productsAPI.list({ limit: 50 });
        const items = res.data?.data?.data || [];
        if (items.length === 0) return;

        const mapToFormat = (arr: any[]) => arr.map(p => {
            let img = '';
            try {
                img = Array.isArray(p.images_url) ? p.images_url[0] : (p.images_url && typeof p.images_url === 'string' ? JSON.parse(p.images_url)[0] : 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop');
            } catch (e) {}
            return {
                id: p.id,
                name: p.title,
                image: img,
                price: `${p.currency} ${p.price_min}${p.price_max > p.price_min ? ' - ' + p.price_max : ''}`,
                is_premium: p.is_premium,
                moq: 'MOQ: 1',
                shipping: 'Free shipping',
                label: p.category,
                tag: 'Hot selling'
            };
        });

        if (items.length >= 6) setDFirstOrder(mapToFormat(items.slice(0, 6)));
        if (items.length >= 10) setDGuaranteed(mapToFormat(items.slice(6, 10)));
        if (items.length >= 14) setDCustomization(mapToFormat(items.slice(10, 14)));
        if (items.length >= 8) setDTopDeals(mapToFormat(items.slice(0, 8)));
        if (items.length >= 14) setDTopRankings(mapToFormat(items.slice(8, 14)));
        if (items.length >= 9) setDSamples(mapToFormat(items.slice(0, 9)));
        
        // Populate Frequently Searched from DB (User Requested 9 products)
        const searchedItems = items.filter((p: any) => 
          ['Mobile Phones', 'Luxury Watches', 'Premium Perfume', 'Fresh Coconut', 'Crude Palm Oil', 'Smart LED TV', 'Gaming Laptop', 'Arabica Coffee', 'Safety Boots']
          .some(title => p.title.includes(title.split(' ')[0])) 
        ).slice(0, 9);
        
        if (searchedItems.length > 0) {
            setDFrequentlySearched(searchedItems.map((p: any) => ({
                title: p.title.split(' ').slice(0, 2).join(' '), // Shorten title
                image: (typeof p.images_url === 'string' ? JSON.parse(p.images_url)[0] : p.images_url[0]),
                href: `/products/${p.id}`,
                id: p.id
            })));
        }
      } catch (err) {
          console.error(err);
      }
    };
    loadDynamic();
  }, []);

  // Auto-scroll for Top Deals on mobile
  useEffect(() => {
    const container = document.getElementById('top-deals-scroll');
    if (!container || window.innerWidth >= 768) return;

    let scrollAmount = 0;
    const scrollStep = 1;
    const scrollInterval = 30;

    const autoScroll = () => {
      scrollAmount += scrollStep;
      if (scrollAmount >= container.scrollWidth - container.clientWidth) {
        scrollAmount = 0;
      }
      container.scrollLeft = scrollAmount;
    };

    const intervalId = setInterval(autoScroll, scrollInterval);

    // Pause on hover/touch
    const pauseOnInteraction = () => clearInterval(intervalId);
    container.addEventListener('mouseenter', pauseOnInteraction);
    container.addEventListener('touchstart', pauseOnInteraction);

    return () => {
      clearInterval(intervalId);
      container.removeEventListener('mouseenter', pauseOnInteraction);
      container.removeEventListener('touchstart', pauseOnInteraction);
    };
  }, []);

  // Auto-scroll for Frequently Searched section
  useEffect(() => {
    const container = document.getElementById('frequently-searched-scroll');
    if (!container) return;

    let scrollAmount = 0;
    const scrollStep = 1;
    const scrollInterval = 30;

    const autoScroll = () => {
      scrollAmount += scrollStep;
      if (scrollAmount >= container.scrollWidth - container.clientWidth) {
        scrollAmount = 0;
      }
      container.scrollLeft = scrollAmount;
    };

    const intervalId = setInterval(autoScroll, scrollInterval);

    // Pause on hover/touch
    const pauseOnInteraction = () => clearInterval(intervalId);
    container.addEventListener('mouseenter', pauseOnInteraction);
    container.addEventListener('touchstart', pauseOnInteraction);

    return () => {
      clearInterval(intervalId);
      container.removeEventListener('mouseenter', pauseOnInteraction);
      container.removeEventListener('touchstart', pauseOnInteraction);
    };
  }, []);

  // Hero Image Slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Automated Mobile Product Switching (Single Swapping Cards)
  useEffect(() => {
    if (window.innerWidth >= 1024) return;
    
    const timer1 = setInterval(() => {
      setActiveSavingsIdx(prev => prev + 1);
    }, 3000);
    const timer2 = setInterval(() => {
      setActiveGuaranteedIdx(prev => prev + 1);
    }, 4000);
    const timer3 = setInterval(() => {
      setActiveCustomizationIdx(prev => prev + 1);
    }, 3500);

    return () => {
      clearInterval(timer1);
      clearInterval(timer2);
      clearInterval(timer3);
    };
  }, []);

  return (
    <div className="bg-neutral-50">
      {/* ========== HERO SECTION WITH BACKGROUND IMAGE ========== */}
      <section className="relative bg-neutral-900 overflow-hidden">
        {/* Animated Background Slider */}
        <div className="absolute inset-0">
          {heroImages.map((src, i) => (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                currentHeroImage === i ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={src}
                alt={`Slide ${i}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/90 via-neutral-900/70 to-neutral-900/50" />
        </div>

        {/* Hero Content */}
        <div className="relative max-w-[1440px] mx-auto px-4 pt-16 pb-24 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-32">
          <div className="max-w-2xl">
            {/* Main Title */}
            <h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3"
              dangerouslySetInnerHTML={{ __html: t('hero_title') }}
            />
            <p className="text-xl sm:text-2xl text-white/90 mb-6 font-light">
              {t('hero_subtitle')}
            </p>

            {/* Search Bar */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const query = formData.get('search') as string;
                if (query?.trim()) {
                  router.push(`/products?search=${encodeURIComponent(query.trim())}`);
                }
              }}
              className="flex items-center max-w-xl mb-4"
            >
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  name="search"
                  type="text"
                  placeholder="What are you looking for..."
                  className="w-full pl-11 pr-4 py-3.5 bg-white rounded-l-full text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <button 
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3.5 rounded-r-full text-sm font-semibold transition-colors"
              >
                Search
              </button>
            </form>

            {/* Popular Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-white/80">{t('hero_popular')}</span>
              {popularTags.map((tag) => (
                <Link key={tag} href={`/products?search=${tag}`} className="text-sm text-white bg-white/10 hover:bg-primary-600 px-3 py-1 rounded-full transition-colors border border-white/20 hover:border-primary-600">
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURE CARDS BELOW HERO ========== */}
      <section className="bg-neutral-800 relative z-10 -mt-12 sm:-mt-16 lg:-mt-20">
        <div className="max-w-[1440px] mx-auto px-4 py-4 sm:py-5 lg:py-6">
          {/* Desktop: 3-column grid */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {/* Card 1: Vast business offerings */}
            <div className="bg-neutral-700/60 rounded-xl border border-neutral-600/30 p-4 lg:p-5 flex flex-col md:flex-row items-center text-center md:text-left gap-3 lg:gap-4 hover:bg-neutral-600 transition-colors shadow-lg">
              <div className="w-12 h-12 bg-primary-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h3 className="text-white text-sm lg:text-base font-semibold mb-1">{t('feat_vast_title')}</h3>
                <p className="text-neutral-300 text-xs leading-relaxed">
                  {t('feat_vast_desc')}
                </p>
              </div>
            </div>

            {/* Card 2: All-in-one trade solution */}
            <div className="bg-neutral-700/60 rounded-xl border border-neutral-600/30 p-4 lg:p-5 flex flex-col md:flex-row items-center text-center md:text-left gap-3 lg:gap-4 hover:bg-neutral-600 transition-colors shadow-lg">
              <div className="w-12 h-12 bg-primary-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Globe className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h3 className="text-white text-sm lg:text-base font-semibold mb-1">{t('feat_allinone_title')}</h3>
                <p className="text-neutral-300 text-xs leading-relaxed">
                  {t('feat_allinone_desc')}
                </p>
              </div>
            </div>

            {/* Card 3: Secured Trading Service */}
            <div className="bg-neutral-700/60 rounded-xl border border-neutral-600/30 p-4 lg:p-5 flex flex-col md:flex-row items-center text-center md:text-left gap-3 lg:gap-4 hover:bg-neutral-600 transition-colors shadow-lg">
              <div className="w-12 h-12 bg-primary-600/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-primary-400" />
              </div>
              <div>
                <h3 className="text-white text-sm lg:text-base font-semibold mb-1">{t('feat_secure_title')}</h3>
                <p className="text-neutral-300 text-xs leading-relaxed">
                  {t('feat_secure_desc')}
                </p>
              </div>
            </div>
          </div>

          {/* Mobile: Horizontal scroll with icon + small text */}
          <div className="md:hidden flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {/* Card 1 */}
            <div className="flex-shrink-0 w-28 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-primary-600/20 rounded-full flex items-center justify-center mb-2">
                <Package className="w-5 h-5 text-primary-400" />
              </div>
              <p className="text-[10px] text-neutral-300 leading-tight">Vast business offerings</p>
            </div>

            {/* Card 2 */}
            <div className="flex-shrink-0 w-28 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-primary-600/20 rounded-full flex items-center justify-center mb-2">
                <Globe className="w-5 h-5 text-primary-400" />
              </div>
              <p className="text-[10px] text-neutral-300 leading-tight">All-in-one trade solution</p>
            </div>

            {/* Card 3 */}
            <div className="flex-shrink-0 w-28 flex flex-col items-center text-center">
              <div className="w-10 h-10 bg-primary-600/20 rounded-full flex items-center justify-center mb-2">
                <Shield className="w-5 h-5 text-primary-400" />
              </div>
              <p className="text-[10px] text-neutral-300 leading-tight">Secured Trading Service</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FREQUENTLY SEARCHED ========== */}
      <section className="py-4 bg-neutral-50">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex gap-3">
            {/* Left: Auto-scrolling product cards */}
            <div className="flex-1 overflow-hidden">
              <div id="frequently-searched-scroll" className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                {dFrequentlySearched.map((item, index) => (
                  <Link key={index} href={item.href} className="flex-shrink-0 w-36 sm:w-40 bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-md transition-all group">
                    <div className="aspect-square bg-neutral-100 overflow-hidden">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-2">
                      <p className="text-[10px] font-medium text-neutral-500">Frequently searched</p>
                      <p className="text-xs font-semibold text-neutral-900 mt-0.5 truncate">{item.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: Promotional Card */}
            <div className="flex-shrink-0 w-32 sm:w-40 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg p-3 flex flex-col justify-center items-center text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-600 rounded-full flex items-center justify-center mb-2">
                <Factory className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-primary-900 mb-1 leading-tight">Discover new manufacturers</h3>
              <Link href="/manufacturers" className="bg-primary-600 hover:bg-primary-700 text-white px-3 py-1 rounded-full text-[10px] font-medium transition-colors">
                View more
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FIRST ORDER - FREE SHIPPING ========== */}
      <section className="py-4 bg-gradient-to-r from-primary-100 via-primary-50 to-white border-b border-neutral-200">
        <div className="max-w-[1440px] mx-auto px-4">
          {/* Desktop: Banner left, Products right in grid */}
          <div className="hidden lg:flex gap-4 items-center">
            <div className="flex-shrink-0 w-64 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-6">
              <div className="inline-block bg-primary-600 text-white text-xs font-medium px-2 py-1 rounded mb-2">
                Savings Booster
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-1">First order,</h3>
              <h3 className="text-xl font-bold text-primary-600 mb-3">FREE shipping</h3>
              <Link href="/first-order" className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
                Explore now
              </Link>
            </div>
            <div className="flex-1 grid grid-cols-6 gap-3">
              {dFirstOrder.map((product, index) => (
                <Link key={index} href={`/products/${product.id || "1"}`} className="bg-white/80 backdrop-blur-sm rounded-lg border border-primary-200 overflow-hidden hover:shadow-md transition-all group">
                  <div className="aspect-square bg-neutral-100 overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-neutral-700 line-clamp-1 mb-1">{product.name}</p>
                    {role === "guest" ? (<Link href="/login" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium text-xs rounded transition-colors group-hover:bg-primary-50"><Lock className="w-3.5 h-3.5" /> Sign in for pricing</Link>) : (<p className="text-sm font-bold text-primary-600">{product.price}</p>)}
                    <p className="text-[10px] text-neutral-400">{product.moq}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile: Banner left, Single Product Card right */}
          <div className="lg:hidden flex gap-3">
            {/* Left: Savings Booster Banner */}
            <div className="flex-shrink-0 w-36 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-3 flex flex-col justify-center">
              <div className="inline-block bg-primary-600 text-white text-[9px] font-medium px-1.5 py-0.5 rounded mb-1.5 w-fit">
                Savings Booster
              </div>
              <h3 className="text-sm font-bold text-neutral-900 mb-0.5">First order,</h3>
              <h3 className="text-sm font-bold text-primary-600 mb-2">FREE shipping</h3>
              <Link href="/first-order" className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors w-fit">
                Explore now
              </Link>
            </div>

            {/* Right: Single Auto-Swapping Product Card */}
            <div className="flex-1 min-w-0">
              {dFirstOrder.length > 0 && (
                <Link href={`/products/${dFirstOrder[activeSavingsIdx % dFirstOrder.length].id || "1"}`} className="block w-full h-full bg-white/80 backdrop-blur-sm rounded-lg border border-primary-200 overflow-hidden shadow-sm transition-opacity duration-300">
                  <div className="aspect-square bg-neutral-100 overflow-hidden relative">
                    <img src={dFirstOrder[activeSavingsIdx % dFirstOrder.length].image} alt={dFirstOrder[activeSavingsIdx % dFirstOrder.length].name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2 flex flex-col justify-between h-[calc(100%-100px)]">
                    <p className="text-[10px] leading-tight text-neutral-700 line-clamp-2 mb-1">{dFirstOrder[activeSavingsIdx % dFirstOrder.length].name}</p>
                    <div>
                      {role === "guest" ? (<div className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 bg-neutral-100 text-neutral-600 font-medium text-[9px] rounded"><Lock className="w-2.5 h-2.5" /> Sign in</div>) : (<p className="text-xs font-bold text-primary-600 truncate">{dFirstOrder[activeSavingsIdx % dFirstOrder.length].price}</p>)}
                      <p className="text-[9px] text-neutral-400 mt-0.5">{dFirstOrder[activeSavingsIdx % dFirstOrder.length].moq}</p>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURED COLLECTIONS ========== */}
      <section className="py-4 bg-neutral-50">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="text-center mb-4">
            <p className="text-xs text-neutral-500">Recommended for your business</p>
          </div>

          <div className="space-y-4">
            {/* Grawizah Guaranteed - Desktop: Banner left, Products grid right */}
            <div className="hidden lg:grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-primary-700 to-primary-900 rounded-xl overflow-hidden">
                <div className="p-6 text-center text-white">
                  <h3 className="text-xl font-bold mb-2">
                    <span className="text-primary-300">Grawizah</span> Guaranteed
                  </h3>
                  <div className="flex items-center justify-center gap-4 text-xs text-primary-200 mb-4">
                    <span className="flex items-center gap-1"><Check className="w-3 h-3" /> Quick order & pay</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> On-time delivery</span>
                    <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Money-back guarantee</span>
                  </div>
                  <Link href="/guaranteed" className="inline-block bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-xs font-medium transition-colors">
                    Explore now
                  </Link>
                </div>
                <div className="grid grid-cols-4 gap-2 px-4 pb-4">
                  {dGuaranteed.map((product, index) => (
                    <Link key={index} href={`/products/${product.id || "1"}`} className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-all group">
                      <div className="aspect-square bg-neutral-100 overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="p-2">
                        {role === "guest" ? (<Link href="/login" className="inline-flex mt-1 items-center gap-1.5 px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium text-[10px] rounded transition-colors group-hover:bg-primary-50"><Lock className="w-2.5 h-2.5" /> Sign in</Link>) : (<p className="text-sm font-bold text-neutral-900">{product.price}</p>)}
                        <p className="text-[10px] text-primary-600">{product.shipping}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Fast Customization */}
              <div className="bg-gradient-to-br from-accent-700 to-accent-900 rounded-xl overflow-hidden">
                <div className="p-6 text-center text-white">
                  <h3 className="text-xl font-bold mb-2 flex items-center justify-center gap-2">
                    Fast customization
                  </h3>
                  <div className="flex items-center justify-center gap-4 text-xs text-accent-200 mb-4">
                    <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> Low MOQ</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 14-day dispatch</span>
                    <span className="flex items-center gap-1"><Check className="w-3 h-3" /> True to design</span>
                  </div>
                  <Link href="/customization" className="inline-block bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-xs font-medium transition-colors">
                    Explore now
                  </Link>
                </div>
                <div className="grid grid-cols-4 gap-2 px-4 pb-4">
                  {dCustomization.map((product, index) => (
                    <Link key={index} href={`/products/${product.id || "1"}`} className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-all group">
                      <div className="aspect-square bg-neutral-100 overflow-hidden relative">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1.5">
                          <p className="text-[9px] text-white text-center font-medium">{product.label}</p>
                        </div>
                      </div>
                      <div className="p-2">
                        {role === "guest" ? (<Link href="/login" className="inline-flex mt-1 items-center gap-1.5 px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium text-[10px] rounded transition-colors group-hover:bg-primary-50"><Lock className="w-2.5 h-2.5" /> Sign in</Link>) : (<p className="text-sm font-bold text-neutral-900">{product.price}</p>)}
                        <p className="text-[10px] text-neutral-400">{product.moq}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile: Grawizah Guaranteed - Single Product Card left, Banner right */}
            <div className="lg:hidden">
              <div className="flex gap-3">
                {/* Left: Single Auto-Swapping Product Card */}
                <div className="flex-1 min-w-0">
                  {dGuaranteed.length > 0 && (
                    <Link href={`/products/${dGuaranteed[activeGuaranteedIdx % dGuaranteed.length].id || "1"}`} className="block w-full h-full bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-sm transition-opacity duration-300">
                      <div className="aspect-square bg-neutral-100 overflow-hidden relative">
                        <img src={dGuaranteed[activeGuaranteedIdx % dGuaranteed.length].image} alt={dGuaranteed[activeGuaranteedIdx % dGuaranteed.length].name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-2 flex flex-col justify-between h-[calc(100%-100px)]">
                        <p className="text-[10px] leading-tight text-neutral-700 line-clamp-2 mb-1">{dGuaranteed[activeGuaranteedIdx % dGuaranteed.length].name}</p>
                        <div>
                          {role === "guest" ? (<div className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 bg-neutral-100 text-neutral-600 font-medium text-[9px] rounded"><Lock className="w-2.5 h-2.5" /> Sign in</div>) : (<p className="text-xs font-bold text-neutral-900 truncate">{dGuaranteed[activeGuaranteedIdx % dGuaranteed.length].price}</p>)}
                          <p className="text-[9px] text-primary-600 mt-0.5">{dGuaranteed[activeGuaranteedIdx % dGuaranteed.length].shipping}</p>
                        </div>
                      </div>
                    </Link>
                  )}
                </div>

                {/* Right: Banner */}
                <div className="flex-shrink-0 w-36 bg-gradient-to-br from-primary-700 to-primary-900 rounded-xl p-3 flex flex-col justify-center text-white">
                  <h3 className="text-sm font-bold mb-1.5">
                    <span className="text-primary-300">Grawizah</span> Guaranteed
                  </h3>
                  <div className="space-y-1 text-[9px] text-primary-200 mb-2.5">
                    <p className="flex items-center gap-1"><Check className="w-2.5 h-2.5" /> Quick order</p>
                    <p className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> On-time delivery</p>
                    <p className="flex items-center gap-1"><Shield className="w-2.5 h-2.5" /> Money-back</p>
                  </div>
                  <Link href="/guaranteed" className="inline-block bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors w-fit">
                    Explore now
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile: Fast Customization - Banner left, Single Product Card right */}
            <div className="lg:hidden">
              <div className="flex gap-3">
                {/* Left: Banner */}
                <div className="flex-shrink-0 w-36 bg-gradient-to-br from-accent-700 to-accent-900 rounded-xl p-3 flex flex-col justify-center text-white">
                  <h3 className="text-sm font-bold mb-1.5 flex items-center gap-1">
                    Fast customization
                  </h3>
                  <div className="space-y-1 text-[9px] text-accent-200 mb-2.5">
                    <p className="flex items-center gap-1"><Tag className="w-2.5 h-2.5" /> Low MOQ</p>
                    <p className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" /> 14-day dispatch</p>
                    <p className="flex items-center gap-1"><Check className="w-2.5 h-2.5" /> True to design</p>
                  </div>
                  <Link href="/customization" className="inline-block bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors w-fit">
                    Explore now
                  </Link>
                </div>

                {/* Right: Single Auto-Swapping Product Card */}
                <div className="flex-1 min-w-0">
                  {dCustomization.length > 0 && (
                    <Link href={`/products/${dCustomization[activeCustomizationIdx % dCustomization.length].id || "1"}`} className="block w-full h-full bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-sm transition-opacity duration-300">
                      <div className="aspect-square bg-neutral-100 overflow-hidden relative">
                        <img src={dCustomization[activeCustomizationIdx % dCustomization.length].image} alt={dCustomization[activeCustomizationIdx % dCustomization.length].name} className="w-full h-full object-cover" />
                        <div className="absolute bottom-1 left-1 right-1 bg-gradient-to-t from-black/80 to-transparent p-1 rounded">
                          <p className="text-[8px] leading-tight text-white text-center font-medium line-clamp-2">{dCustomization[activeCustomizationIdx % dCustomization.length].label}</p>
                        </div>
                      </div>
                      <div className="p-2 flex flex-col justify-between h-[calc(100%-100px)]">
                         <p className="text-[10px] leading-tight text-neutral-700 line-clamp-2 mb-1">{dCustomization[activeCustomizationIdx % dCustomization.length].name}</p>
                        <div>
                          {role === "guest" ? (<div className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 bg-neutral-100 text-neutral-600 font-medium text-[9px] rounded"><Lock className="w-2.5 h-2.5" /> Sign in</div>) : (<p className="text-xs font-bold text-neutral-900 truncate">{dCustomization[activeCustomizationIdx % dCustomization.length].price}</p>)}
                          <p className="text-[9px] text-neutral-400 mt-0.5">{dCustomization[activeCustomizationIdx % dCustomization.length].moq}</p>
                        </div>
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TOP DEALS WITH AUTO-SCROLL ON MOBILE ========== */}
      <section className="py-4 bg-white">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Top Deals</h2>
              <p className="text-xs text-neutral-500">Score the lowest prices on Grawizah</p>
            </div>
            <Link href="/products" className="text-sm text-neutral-500 hover:text-primary-600 flex items-center gap-1">
              View more <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div id="top-deals-scroll" className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide scroll-smooth">
            {dTopDeals.map((deal, index) => (
              <Link key={index} href={`/products/${deal.id || "1"}`} className="flex-shrink-0 w-40 group">
                <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-md transition-all">
                  <div className="aspect-square bg-neutral-100 overflow-hidden">
                    <img src={deal.image} alt={deal.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-neutral-600 line-clamp-1 mb-2">{deal.name}</p>
                    <p className="text-sm font-bold text-red-600 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {role === "guest" ? "Sign in to view" : deal.price}
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-1">{deal.moq}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TOP RANKING ========== */}
      <section className="py-4 bg-neutral-50">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Top Ranking</h2>
              <p className="text-xs text-neutral-500">Data-driven rankings</p>
            </div>
            <Link href="/products" className="text-sm text-neutral-500 hover:text-primary-600 flex items-center gap-1">
              View more <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {dTopRankings.map((item, index) => (
              <Link key={index} href={`/products/${item.id || "1"}`} className="group">
                <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-md transition-all">
                  <div className="aspect-square bg-neutral-100 overflow-hidden relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                      <div className="bg-primary-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">
                        TOP
                      </div>
                    </div>
                  </div>
                  <div className="p-3 text-center">
                    <p className="text-xs font-semibold text-neutral-900 line-clamp-1 group-hover:text-primary-600 transition-colors">{item.name}</p>
                    <p className="text-[10px] text-neutral-400 mt-1">{item.tag}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SAMPLES AVAILABLE ========== */}
      <section className="py-4 bg-gradient-to-br from-primary-700 via-primary-600 to-accent-600">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-white" />
              <h2 className="text-lg font-bold text-white">Samples available</h2>
            </div>
            <Link href="/samples" className="text-sm text-white/80 hover:text-white flex items-center gap-1">
              View more <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {dSamples.map((item, index) => (
              <Link key={index} href={`/products/${item.id || "1"}`} className="flex-shrink-0 w-36 group">
                <div className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-all">
                  <div className="aspect-square bg-neutral-100 overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-neutral-700 line-clamp-1 mb-1">{item.name}</p>
                    {role === "guest" ? (<Link href="/login" className="inline-flex mt-1 items-center gap-1.5 px-2 py-0.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium text-[10px] rounded transition-colors group-hover:bg-primary-50"><Lock className="w-2.5 h-2.5" /> Sign in</Link>) : (<p className="text-sm font-semibold text-neutral-900">{item.price}</p>)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PRICING PLANS ========== */}
      <section className="py-8 bg-neutral-50">
        <div className="max-w-[1440px] mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-neutral-900 mb-2">Choose Your Plan</h2>
            <p className="text-sm text-neutral-500 max-w-lg mx-auto">
              Unlock powerful features for your business
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <span className={`text-sm ${billingPeriod === 'monthly' ? 'text-neutral-900 font-medium' : 'text-neutral-500'}`}>Monthly</span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                className="relative w-14 h-7 bg-primary-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <div className={`absolute top-0.5 w-6 h-6 bg-primary-600 rounded-full shadow transition-transform ${billingPeriod === 'yearly' ? 'translate-x-7' : 'translate-x-0.5'}`} />
              </button>
              <span className={`text-sm ${billingPeriod === 'yearly' ? 'text-neutral-900 font-medium' : 'text-neutral-500'}`}>
                Yearly
                <span className="ml-1 text-[10px] text-primary-600 font-semibold">Save 20%</span>
              </span>
            </div>
          </div>

          {/* Desktop: Show all plans in grid */}
          <div className="hidden md:grid grid-cols-4 gap-4">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-xl border-2 overflow-hidden transition-all hover:shadow-lg ${
                  plan.isPopular
                    ? 'border-primary-600 shadow-md'
                    : 'border-neutral-200'
                }`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 bg-primary-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}

                {/* Discount Badge */}
                {plan.discount && (
                  <div className="absolute top-0 left-0 bg-primary-100 text-primary-700 text-[10px] font-semibold px-2 py-1 rounded-br-lg">
                    {plan.discount}
                  </div>
                )}

                <div className="p-5">
                  {/* Plan Header */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-neutral-900">{plan.name}</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">{plan.subtitle}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-neutral-900">{plan.price}</span>
                    <span className="text-sm text-neutral-500">{plan.period}</span>
                  </div>

                  {/* CTA Button */}
                  <button
                    className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors mb-5 ${
                      plan.ctaVariant === 'primary'
                        ? 'bg-primary-600 hover:bg-primary-700 text-white'
                        : 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    {plan.cta}
                  </button>

                  {/* Features */}
                  <div className="space-y-2.5">
                    {plan.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-start gap-2">
                        {feature.included ? (
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Lock className="w-4 h-4 text-neutral-300 flex-shrink-0 mt-0.5" />
                        )}
                        <p className={`text-xs leading-relaxed ${feature.included ? 'text-neutral-700' : 'text-neutral-400'}`}>
                          {feature.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: Horizontal scroll */}
          <div className="md:hidden flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`flex-shrink-0 w-72 relative bg-white rounded-xl border-2 overflow-hidden transition-all hover:shadow-lg ${
                  plan.isPopular
                    ? 'border-primary-600 shadow-md'
                    : 'border-neutral-200'
                }`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute top-0 right-0 bg-primary-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}

                {/* Discount Badge */}
                {plan.discount && (
                  <div className="absolute top-0 left-0 bg-primary-100 text-primary-700 text-[10px] font-semibold px-2 py-1 rounded-br-lg">
                    {plan.discount}
                  </div>
                )}

                <div className="p-5">
                  {/* Plan Header */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-neutral-900">{plan.name}</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">{plan.subtitle}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-neutral-900">{plan.price}</span>
                    <span className="text-sm text-neutral-500">{plan.period}</span>
                  </div>

                  {/* CTA Button */}
                  <button
                    className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors mb-5 ${
                      plan.ctaVariant === 'primary'
                        ? 'bg-primary-600 hover:bg-primary-700 text-white'
                        : 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    {plan.cta}
                  </button>

                  {/* Features */}
                  <div className="space-y-2.5">
                    {plan.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-start gap-2">
                        {feature.included ? (
                          <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Lock className="w-4 h-4 text-neutral-300 flex-shrink-0 mt-0.5" />
                        )}
                        <p className={`text-xs leading-relaxed ${feature.included ? 'text-neutral-700' : 'text-neutral-400'}`}>
                          {feature.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SMART BUSINESS SOLUTIONS (COMPETITION HIGHLIGHT) ========== */}
      <section className="py-12 md:py-24 bg-white relative overflow-hidden border-t border-neutral-100">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-accent-100 rounded-full blur-3xl opacity-50"></div>
        
        <div className="max-w-[1440px] mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-20">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
              {t('hub_title')}
            </h2>
            <p className="text-neutral-600 text-sm md:text-lg leading-relaxed">
              {t('hub_desc')}
            </p>
          </div>

          <div className="relative max-w-[1440px] mx-auto py-4 px-1 md:py-32 md:px-10 overflow-hidden lg:overflow-visible">
            {/* The Central Horizontal Root (Desktop) - Adjusted for Light Theme */}
            <div className="hidden lg:block absolute top-1/2 left-20 right-20 h-[3px] bg-gradient-to-r from-primary-200 via-accent-400 to-primary-200 -translate-y-1/2 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.1)]"></div>
            
            <div className="flex flex-col lg:flex-row items-center justify-around gap-1 lg:gap-0 relative z-10 w-full px-0 md:px-10">
              
              {/* Feature 1 (Top) */}
              <div className="lg:w-1/4 flex flex-col items-center lg:-translate-y-36 group relative">
                <div className="bg-white border border-neutral-200 rounded-2xl p-3 sm:p-6 w-full max-w-[280px] hover:border-primary-500 transition-all duration-300 shadow-[0_2px_15px_rgba(0,0,0,0.02)] group-hover:shadow-[0_20px_40px_rgba(99,102,241,0.12)] group-hover:-translate-y-3">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-2 transition-colors group-hover:bg-primary-600">
                    <FileText className="w-4 h-4 md:w-6 md:h-6 text-primary-600 group-hover:text-white" />
                  </div>
                  <h3 className="text-xs md:text-base font-bold mb-0.5 text-neutral-900 leading-tight">{t('hub_doc_title')}</h3>
                  <p className="text-[10px] md:text-xs text-neutral-500 leading-relaxed font-medium">
                    {t('hub_doc_desc')}
                  </p>
                </div>
                {/* Vertical Connector to Center (Desktop) */}
                <div className="hidden lg:block absolute bottom-[-9rem] left-1/2 -translate-x-1/2 w-[2px] h-36 bg-gradient-to-t from-primary-300 to-transparent"></div>
                <div className="hidden lg:flex absolute bottom-[-9.2rem] left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-2 border-primary-500 items-center justify-center z-20 shadow-sm">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse"></div>
                </div>
                {/* Mobile Connector (Down) */}
                <div className="lg:hidden w-[1.5px] h-4 bg-gradient-to-b from-primary-200 to-transparent"></div>
              </div>

              {/* Feature 2 (Bottom) */}
              <div className="lg:w-1/4 flex flex-col items-center lg:translate-y-36 group relative">
                {/* Vertical Connector to Center (Desktop) */}
                <div className="hidden lg:block absolute top-[-9rem] left-1/2 -translate-x-1/2 w-[2px] h-36 bg-gradient-to-b from-accent-300 to-transparent"></div>
                <div className="hidden lg:flex absolute top-[-9.2rem] left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-2 border-accent-500 items-center justify-center z-20 shadow-sm">
                   <div className="w-1.5 h-1.5 bg-accent-500 rounded-full animate-pulse"></div>
                </div>
                <div className="bg-white border border-neutral-200 rounded-2xl p-3 sm:p-6 w-full max-w-[280px] hover:border-accent-500 transition-all duration-300 shadow-[0_2px_15px_rgba(0,0,0,0.02)] group-hover:shadow-[0_20px_40px_rgba(236,72,153,0.12)] group-hover:translate-y-3">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-accent-50 rounded-lg flex items-center justify-center mb-2 transition-colors group-hover:bg-accent-600">
                    <ZapIcon className="w-4 h-4 md:w-6 md:h-6 text-accent-600 group-hover:text-white" />
                  </div>
                  <h3 className="text-xs md:text-base font-bold mb-0.5 text-neutral-900 leading-tight">{t('hub_hs_title')}</h3>
                  <p className="text-[10px] md:text-xs text-neutral-500 leading-relaxed font-medium">
                    {t('hub_hs_desc')}
                  </p>
                </div>
                {/* Mobile Connector (Down) */}
                <div className="lg:hidden w-[1.5px] h-4 bg-gradient-to-b from-accent-200 to-transparent"></div>
              </div>

              {/* Feature 3 (Top) */}
              <div className="lg:w-1/4 flex flex-col items-center lg:-translate-y-36 group relative">
                <div className="bg-white border border-neutral-200 rounded-2xl p-3 sm:p-6 w-full max-w-[280px] hover:border-red-500 transition-all duration-300 shadow-[0_2px_15px_rgba(0,0,0,0.02)] group-hover:shadow-[0_20px_40px_rgba(239,68,68,0.12)] group-hover:-translate-y-3">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-red-50 rounded-lg flex items-center justify-center mb-2 transition-colors group-hover:bg-red-600">
                    <Shield className="w-4 h-4 md:w-6 md:h-6 text-red-600 group-hover:text-white" />
                  </div>
                  <h3 className="text-xs md:text-base font-bold mb-0.5 text-neutral-900 leading-tight">{t('hub_sanction_title')}</h3>
                  <p className="text-[10px] md:text-xs text-neutral-500 leading-relaxed font-medium">
                    {t('hub_sanction_desc')}
                  </p>
                </div>
                {/* Vertical Connector to Center (Desktop) */}
                <div className="hidden lg:block absolute bottom-[-9rem] left-1/2 -translate-x-1/2 w-[2px] h-36 bg-gradient-to-t from-red-300 to-transparent"></div>
                <div className="hidden lg:flex absolute bottom-[-9.2rem] left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-2 border-red-500 items-center justify-center z-20 shadow-sm">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                </div>
                {/* Mobile Connector (Down) */}
                <div className="lg:hidden w-[1.5px] h-4 bg-gradient-to-b from-red-200 to-transparent"></div>
              </div>

              {/* Feature 4 (Bottom) */}
              <div className="lg:w-1/4 flex flex-col items-center lg:translate-y-36 group relative">
                {/* Vertical Connector to Center (Desktop) */}
                <div className="hidden lg:block absolute top-[-9rem] left-1/2 -translate-x-1/2 w-[2px] h-36 bg-gradient-to-b from-green-300 to-transparent"></div>
                <div className="hidden lg:flex absolute top-[-9.2rem] left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-2 border-green-500 items-center justify-center z-20 shadow-sm">
                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <div className="bg-white border border-neutral-200 rounded-2xl p-3 sm:p-6 w-full max-w-[280px] hover:border-green-500 transition-all duration-300 shadow-[0_2px_15px_rgba(0,0,0,0.02)] group-hover:shadow-[0_20px_40px_rgba(34,197,94,0.12)] group-hover:translate-y-3">
                  <div className="w-8 h-8 md:w-12 md:h-12 bg-green-50 rounded-lg flex items-center justify-center mb-2 transition-colors group-hover:bg-green-600">
                    <BarChart3 className="w-4 h-4 md:w-6 md:h-6 text-green-600 group-hover:text-white" />
                  </div>
                  <h3 className="text-xs md:text-base font-bold mb-0.5 text-neutral-900 leading-tight">{t('hub_radar_title')}</h3>
                  <p className="text-[10px] md:text-xs text-neutral-500 leading-relaxed font-medium">
                    {t('hub_radar_desc')}
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ========== TRADING PROTECTION ========== */}
      <section className="py-6 bg-white">
        <div className="max-w-[1440px] mx-auto px-4">
          <h2 className="text-lg font-bold text-center text-neutral-900 mb-6">We protect your trading</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {protection.map((item, index) => (
              <div key={index} className="border border-neutral-200 rounded-lg p-4 text-center hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-neutral-900 mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-neutral-500">{item.features[0]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="py-12 bg-neutral-900 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">{t('hub_trial_title') || 'Ready to Trade Globally?'}</h2>
          <p className="text-neutral-400 mb-8 text-sm sm:text-base">{t('hub_trial_desc') || 'Join thousands of businesses using Grawizah for smarter global trade.'}</p>
          <div className="flex flex-row gap-2.5 justify-center mt-6">
            <Link href="/register" className="flex-1 max-w-[160px]">
              <Button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2.5 rounded-lg text-xs w-full">
                {t('nav_joinfree')}
              </Button>
            </Link>
            <Link href="/products" className="flex-1 max-w-[160px]">
              <Button className="border border-white/30 text-white hover:bg-white hover:text-neutral-900 px-4 py-2.5 rounded-lg text-xs bg-transparent w-full">
                {t('nav_products')}
              </Button>
            </Link>
          </div>
          <p className="text-xs text-neutral-500 mt-6">
            Grawizah {t('footer_intelligence_hub')} - 2026
          </p>
        </div>
      </section>
    </div>
  );
}



