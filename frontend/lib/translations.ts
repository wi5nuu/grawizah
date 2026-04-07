export type Language = 'en' | 'id';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navbar
    nav_products: 'Products',
    nav_suppliers: 'Suppliers',
    nav_worldwide: 'Worldwide',
    nav_dashboard: 'Dashboard',
    nav_signin: 'Sign In / Join',
    nav_joinfree: 'Join Free',
    nav_categories: 'Categories',
    nav_search_placeholder: 'What are you looking for...',
    nav_global_trade: 'Global Trade Platform',
    
    // Header Hero
    hero_title: 'GO SMART<br />SOURCING',
    hero_subtitle: 'B2B Platform Made Easy',
    hero_popular: 'Popular now:',
    
    // Feature Cards
    feat_vast_title: 'Vast business offerings',
    feat_vast_desc: 'Grow your business with our 110 million+ products and expert suppliers.',
    feat_allinone_title: 'All-in-one trade solution',
    feat_allinone_desc: 'Experience easy steps from finding products, connecting, to starting orders online.',
    feat_secure_title: 'Secured Trading Service',
    feat_secure_desc: 'Get protected from payment until delivery, making global trade simple and safe.',
    
    // Intelligence Hub
    hub_title: 'The Next-Gen Intelligence Hub',
    hub_desc: 'Empowering global trade with Groq AI-driven compliance, market intelligence, and instant document processing to give your business an unfair advantage.',
    hub_doc_title: 'AI Document Processing',
    hub_doc_desc: 'Automatically extract and convert physical trade documents (Invoice, BL, KYC) into actionable digital data using Smart OCR Extraction.',
    hub_hs_title: 'Automated HS Code',
    hub_hs_desc: 'Mitigate customs fines with ultra-fast AI suggesting accurate international HS Code classifications based on product descriptions.',
    hub_sanction_title: 'Sanction Screening',
    hub_sanction_desc: 'Protect your business with automatic background checks against OFAC, UN, and EU blacklists before establishing any international partnership.',
    hub_radar_title: 'Premium Buyer Radar',
    hub_radar_desc: 'Gain deep insights into buyer behavior, competitor pricing, and custom AI lead scoring to dominate the competitive global marketplace.',
    
    // Footer Sections
    footer_discover: 'Discover',
    footer_services: 'Services',
    footer_company: 'Company',
    footer_support: 'Support',
    footer_contact_title: 'Contact',
    footer_follow_us: 'Follow Us',
    footer_stay_updated: 'Stay Updated',
    footer_newsletter_desc: 'Get the latest trade intelligence and market insights delivered to your inbox.',
    footer_email_placeholder: 'Enter your email',
    footer_subscribe: 'Subscribe',
    footer_rights: 'All rights reserved.',
    footer_intelligence_hub: 'Intelligence Hub',
    footer_terms: 'Terms',
    footer_privacy: 'Privacy',
    footer_sitemap: 'Sitemap',
    
    // Footer Links (Discover)
    footer_products: 'All Products',
    footer_suppliers: 'Suppliers',
    footer_buyers: 'Buyers',
    footer_categories: 'Categories',
    footer_trade_shows: 'Trade Shows',
    footer_blog: 'Industry Blog',
    
    // Footer Links (Services)
    footer_market_insights: 'Market Insights',
    footer_compliance: 'Compliance Suite',
    
    // Footer Links (Company)
    footer_about: 'About Grawizah',
    footer_careers: 'Careers',
    footer_press: 'Press & Media',
    footer_partners: 'Partners',
    footer_contact_us: 'Contact Us',
    
    // Footer Links (Support)
    footer_terms_of_service: 'Terms of Service',
    footer_privacy_policy: 'Privacy Policy',
    footer_cookie_policy: 'Cookie Policy',
    footer_help_center: 'Help Center',
    footer_safety_center: 'Safety Center',
    footer_help: 'Help Center',
    footer_faq: 'FAQ',
    footer_safety: 'Safety Center',
    footer_tos: 'Terms of Service',
    footer_pp: 'Privacy Policy',
    footer_cookie: 'Cookie Policy',
    
    hub_trial_title: 'Ready to Trade Globally?',
    hub_trial_desc: 'Join thousands of businesses using Grawizah for smarter global trade.',
    
    // AI Hub Feature Details
    hub_doc_benefits: '99.9% OCR Accuracy,Automated Data Extraction,Multi-language Document Support',
    hub_hs_benefits: 'Instant Classification,WCO Global Harmonization,Customs Compliance',
    hub_sanction_benefits: 'OFAC/UN/EU Data Feeds,PEP Screening,Entity Verification',
    hub_radar_benefits: 'Historical Buy Patterns,Competitor Price Analysis,Predictive Buy Intent',
    hub_insights_benefits: 'Country-level Analytics,Commodity Price Feeds,Supply Chain Monitoring',
    hub_compliance_benefits: 'Standardized Agreements,License Management,Automated Auditing',
    
    hub_start_now: 'Start Now',
    hub_how_it_works: 'How It Works',
    pricing_get_started: 'Get Started',

    // Terms Content (EN)
    foo_terms_intro_title: 'Introduction',
    foo_terms_intro_desc_1: 'Welcome to Grawizah Intelligence Hub. These Terms of Service (the "Terms") govern your access to and use of our Website and Services.',
    foo_terms_intro_desc_2: 'By using Grawizah, you agree to be bound by these corporate-level conditions. If you do not agree, please do not use the Platform.',
    foo_terms_eligibility_title: 'Eligibility',
    foo_terms_eligibility_desc_1: 'We require all users to be legally registered businesses in their respective countries. We do not provide services to individual consumers.',
    foo_terms_eligibility_desc_2: 'You must provide accurate company information and undergo our verification process to participate in global trade activities.',
    foo_terms_prohibited_title: 'Prohibited Content',
    foo_terms_prohibited_desc_1: 'Do not list any illegal products find in the Grawizah catalog. Our AI models monitor for restricted categories such as Weapons, Drugs, and Counterfeits.',
    foo_terms_prohibited_desc_2: 'Violation of these rules will result in immediate account suspension and referral to the appropriate authorities.',

    // Help Center Content (EN)
    foo_help_start_title: 'Getting Started with Grawizah',
    foo_help_start_desc_1: 'Welcome to Grawizah Intelligence Hub. Our platform is designed to make global trade safe, fast, and intelligent.',
    foo_help_start_desc_2: 'To get started, create a Free account as a Buyer or Supplier. After registration, you\'ll need to complete your company profile and undergo our "Trust-Verification" process.',
    foo_help_start_desc_3: 'Once verified, you can start listing products or sourcing from our global directory of millions of verified partners.',
    foo_help_hub_title: 'Using the Intelligence Hub',
    foo_help_hub_desc_1: 'Our AI-powered tools are located in the "Intelligence Hub" section. You can use Groq-powered AI to analyze trade documents, classify HS codes, and screen global sanctions.',
    foo_help_hub_desc_2: 'Each AI tool comes with its own documentation and usage limits based on your subscription plan.',
    foo_help_order_title: 'Managing Orders & Payments',
    foo_help_order_desc_1: 'Transactions on Grawizah are protected by our "Secured Trading Service". Payments are held in escrow until shipping documents are verified by our AI or a designated third-party.',
    foo_help_order_desc_2: 'You can track your shipments and manage invoices directly from your Dashboard.',

    // About Content (EN)
    foo_about_hero_title: 'Empowering Global Trade Through <span class="text-primary-500 underline decoration-primary-500/30 underline-offset-8">Intelligence.</span>',
    foo_about_hero_desc: 'Grawizah is the world\'s first AI-driven B2B marketplace designed to bridge the trust gap between emerging markets and global trade compliance.',
    foo_about_join_mission: 'Join Our Mission',
    foo_about_stat_founded: 'Founded',
    foo_about_stat_hq: 'Headquarters',
    foo_about_stat_suppliers: 'Active Suppliers',
    foo_about_stat_volume: 'Trade Volume',
    foo_about_mission_title: 'Our Mission',
    foo_about_mission_desc: 'To democratize global trade by providing small and medium enterprises (SMEs) with the same compliance, intelligence, and logistical tools traditionally reserved for Fortune 500 companies.',
    foo_about_mission_point_1: 'Zero-Barrier Market Entry',
    foo_about_mission_point_2: 'AI-Powered Trust Verification',
    foo_about_mission_point_3: 'Inclusive Global Supply Chains',

    // Contact Content (EN)
    foo_contact_hero_desc: 'Contact our global trade experts for support, partnerships, or general inquiries. We\'re here to help you scale.',
    foo_contact_form_title: 'Send a Message',
    foo_contact_label_name: 'Full Name',
    foo_contact_label_email: 'Email Address',
    foo_contact_label_subject: 'Subject',
    foo_contact_label_message: 'Message',
    foo_contact_sub_general: 'General Inquiry',
    foo_contact_sub_support: 'Technical Support',
    foo_contact_sub_partner: 'Partnership Proposal',
    foo_contact_sub_press: 'Press & Media',
    foo_contact_message_placeholder: 'How can we help your business today?',
    foo_contact_btn_send: 'Send Message',

    // FAQ Content (EN)
    foo_faq_general_title: 'General Questions',
    foo_faq_general_q1: 'What is Grawizah? Grawizah is an AI-powered global B2B trade marketplace that connects buyers and suppliers worldwide.',
    foo_faq_general_q2: 'Is Grawizah free to use? Yes, we offer a free tier that allows you to list up to 5 products and browse the global directory.',
    foo_faq_general_q3: 'Can I upgrade my plan? Yes, you can upgrade to Basic, Premium, or Enterprise plans directly from your Dashboard to access advanced AI tools and higher limits.',
    foo_faq_account_title: 'Account & Verification',
    foo_faq_account_q1: 'How do I get verified? You\'ll need to submit official company documents (Business License, Tax ID) for our Trust-Verification team to review.',
    foo_faq_account_q2: 'What is the "Verified Supplier" badge? It\'s a system-level trust indicator that shows you have passed our enhanced KYC/KYB checks.',
    foo_faq_payment_title: 'Payments & Disputes',
    foo_faq_payment_q1: 'How do payments work? We support multiple payment methods including Bank Wire, L/C, and Credit Cards via Stripe Connect.',
    foo_faq_payment_q2: 'What if I have a dispute? Grawizah provides a built-in "Dispute Resolution" center where we mediate between parties based on the trade agreement.',

    // Privacy Content (EN)
    foo_privacy_intro_title: 'Introduction',
    foo_privacy_intro_desc_1: 'At Grawizah, we respect your privacy and are committed to protecting your personal and company data.',
    foo_privacy_intro_desc_2: 'This Privacy Policy explains how we collect, use, and share your information in the context of international B2B trade.',
    foo_privacy_collect_title: 'Information We Collect',
    foo_privacy_collect_desc_1: 'We collect company name, tax ID, registration details, and contact information for the purpose of business-level verification.',
    foo_privacy_collect_desc_2: 'Device and usage information is collected automatically to provide our AI-driven features and improve platform security.',
    foo_privacy_share_title: 'How We Share Your Information',
    foo_privacy_share_desc_1: 'We only share your information with other users (Buyers/Suppliers) based on their verified access levels.',
    foo_privacy_share_desc_2: 'We may share your data with third-party partners like Stripe for payment processing and Groq for AI-inference services.',

    // Safety Content (EN)
    foo_safety_intro_title: 'Our Commitment to Safety',
    foo_safety_intro_desc_1: 'Grawizah is built on zero-trust principles. We verify every business and every listing to ensure a secure global trade environment.',
    foo_safety_intro_desc_2: 'Our AI models proactively detect fraud, suspect listings, and fraudulent buyer behavior.',
    foo_safety_practices_title: 'Safe Trading Practices',
    foo_safety_practices_desc_1: 'We recommend always using Grawizah\'s "Secured Trading Service" to hold funds until delivery is verified.',
    foo_safety_practices_desc_2: 'Do not share sensitive banking information or complete payments outside of the platform.',
    foo_safety_report_title: 'Reporting Suspicious Activity',
    foo_safety_report_desc_1: 'If you experience any suspicious behavior, please use the "Report" button on any profile or listing.',
    foo_safety_report_desc_2: 'Our Trust & Safety team will review the report and take action within 24 hours.',

    // Cookie Content (EN)
    foo_cookie_intro_title: 'Introduction',
    foo_cookie_intro_desc_1: 'We use cookies and similar technologies to provide our Website and Services and to improve your browsing experience.',
    foo_cookie_intro_desc_2: 'This Cookie Policy explains how we use these technologies to support Grawizah\'s global B2B trade platform.',
    foo_cookie_definition_title: 'What are Cookies?',
    foo_cookie_definition_desc_1: 'Cookies are small text files that are stored on your device by your browser to remember your unique preferences and interactions.',
    foo_cookie_definition_desc_2: 'Some are "Strictly Necessary" for the platform to function (e.g. login tokens). Others are used for Analytics and Marketing.',
    foo_cookie_choices_title: 'Your Choices',
    foo_cookie_choices_desc_1: 'You can choose to disable all but "Strictly Necessary" cookies in your browser settings.',
    foo_cookie_choices_desc_2: 'Disabling some cookies may affect the performance and personalization of your Grawizah dashboard.',
  },
  id: {
    // Navbar
    nav_products: 'Produk',
    nav_suppliers: 'Pemasok',
    nav_worldwide: 'Seluruh Dunia',
    nav_dashboard: 'Dasbor',
    nav_signin: 'Masuk / Gabung',
    nav_joinfree: 'Gabung Gratis',
    nav_categories: 'Kategori',
    nav_search_placeholder: 'Apa yang Anda cari...',
    nav_global_trade: 'Platform Perdagangan Global',
    
    // Header Hero
    hero_title: 'SUMBER DAYA<br />PINTAR SAMA GO',
    hero_subtitle: 'Platform B2B Menjadi Mudah',
    hero_popular: 'Populer sekarang:',
    
    // Feature Cards
    feat_vast_title: 'Penawaran Bisnis Luas',
    feat_vast_desc: 'Kembangkan bisnis Anda dengan 110 juta+ produk dan pemasok ahli kami.',
    feat_allinone_title: 'Solusi Perdagangan All-in-one',
    feat_allinone_desc: 'Rasakan langkah mudah dari mencari produk, membangun koneksi, hingga memulai pesanan online.',
    feat_secure_title: 'Layanan Perdagangan Aman',
    feat_secure_desc: 'Dapatkan perlindungan dari pembayaran hingga pengiriman, membuat perdagangan global sederhana dan aman.',
    
    // Intelligence Hub
    hub_title: 'Pusat Intelijen Generasi Baru',
    hub_desc: 'Memberdayakan perdagangan global dengan kepatuhan berbasis AI Groq, intelijen pasar, dan pemrosesan dokumen instan untuk memberikan keuntungan luar biasa bagi bisnis Anda.',
    hub_doc_title: 'Pemrosesan Dokumen AI',
    hub_doc_desc: 'Ekstrak dan konversi dokumen perdagangan fisik secara otomatis (Invoice, BL, KYC) menjadi data digital yang dapat ditindaklanjuti menggunakan Smart OCR Extraction.',
    hub_hs_title: 'Kode HS Otomatis',
    hub_hs_desc: 'Mitigasi denda bea cukai dengan AI super cepat yang menyarankan klasifikasi Kode HS internasional yang akurat berdasarkan deskripsi produk.',
    hub_sanction_title: 'Penyaringan Sanksi',
    hub_sanction_desc: 'Lindungi bisnis Anda dengan pemeriksaan latar belakang otomatis terhadap daftar hitam OFAC, PBB, dan UE sebelum menjalin kemitraan internasional.',
    hub_radar_title: 'Radar Pembeli Premium',
    hub_radar_desc: 'Dapatkan wawasan mendalam tentang perilaku pembeli, harga kompetitor, dan penilaian prospek AI kustom untuk mendominasi pasar global yang kompetitif.',
    
    // Footer Sections
    footer_discover: 'Jelajahi',
    footer_services: 'Layanan',
    footer_company: 'Perusahaan',
    footer_support: 'Dukungan',
    footer_contact_title: 'Kontak',
    footer_follow_us: 'Ikuti Kami',
    footer_stay_updated: 'Tetap Terupdate',
    footer_newsletter_desc: 'Dapatkan intelijen perdagangan dan wawasan pasar terbaru yang dikirim ke kotak masuk Anda.',
    footer_email_placeholder: 'Masukkan email Anda',
    footer_subscribe: 'Berlangganan',
    footer_rights: 'Hak cipta dilindungi.',
    footer_intelligence_hub: 'Pusat Intelijen',
    footer_terms: 'Syarat',
    footer_privacy: 'Privasi',
    footer_sitemap: 'Peta Situs',
    
    // Footer Links (Discover)
    footer_products: 'Semua Produk',
    footer_suppliers: 'Pemasok',
    footer_buyers: 'Pembeli',
    footer_categories: 'Kategori',
    footer_trade_shows: 'Pameran Dagang',
    footer_blog: 'Blog Industri',
    
    // Footer Links (Services)
    footer_market_insights: 'Wawasan Pasar',
    footer_compliance: 'Paket Kepatuhan',
    
    // Footer Links (Company)
    footer_about: 'Tentang Grawizah',
    footer_careers: 'Karir',
    footer_press: 'Pers & Media',
    footer_partners: 'Mitra',
    footer_contact_us: 'Hubungi Kami',
    
    // Footer Links (Support)
    footer_help: 'Pusat Bantuan',
    footer_faq: 'Tanya Jawab',
    footer_safety: 'Pusat Keamanan',
    footer_tos: 'Syarat Layanan',
    footer_pp: 'Kebijakan Privasi',
    footer_cookie: 'Kebijakan Cookie',
    
    footer_help_center: 'Pusat Bantuan',
    footer_safety_center: 'Pusat Keamanan',
    footer_terms_of_service: 'Syarat Layanan',
    footer_privacy_policy: 'Kebijakan Privasi',
    footer_cookie_policy: 'Kebijakan Cookie',

    hub_trial_title: 'Siap Berdagang Secara Global?',
    hub_trial_desc: 'Bergabunglah dengan ribuan bisnis yang menggunakan Grawizah untuk perdagangan global yang lebih pintar.',

    // AI Hub Feature Details (ID)
    hub_doc_benefits: '99.9% Akurasi OCR,Ekstraksi Data Otomatis,Dukungan Dokumen Multibahasa',
    hub_hs_benefits: 'Klasifikasi Instan,Harmonisasi Global WCO,Kepatuhan Bea Cukai',
    hub_sanction_benefits: 'Data Sanksi OFAC/PBB/UE,Penyaringan PEP,Verifikasi Entitas',
    hub_radar_benefits: 'Pola Beli Historis,Analisis Harga Pesaing,Niat Beli Prediktif',
    hub_insights_benefits: 'Analitik Tingkat Negara,Data Harga Komoditas,Pemantauan Rantai Pasok',
    hub_compliance_benefits: 'Perjanjian Terstandarisasi,Manajemen Lisensi,Audit Otomatis',
    
    hub_start_now: 'Mulai Sekarang',
    hub_how_it_works: 'Cara Kerja',

    // Terms of Service Content (ID)
    foo_terms_intro_title: 'Pendahuluan',
    foo_terms_intro_desc_1: 'Selamat datang di Grawizah Intelligence Hub. Syarat Layanan ini ("Ketentuan") mengatur akses dan penggunaan Situs Web dan Layanan kami.',
    foo_terms_intro_desc_2: 'Dengan menggunakan Grawizah, Anda setuju untuk terikat oleh kondisi tingkat korporat ini. Jika Anda tidak setuju, mohon untuk tidak menggunakan Platform.',
    foo_terms_eligibility_title: 'Kelayakan',
    foo_terms_eligibility_desc_1: 'Kami mengharuskan semua pengguna untuk menjadi bisnis yang terdaftar secara resmi di negara masing-masing. Kami tidak menyediakan layanan kepada konsumen individu.',
    foo_terms_eligibility_desc_2: 'Anda harus memberikan informasi perusahaan yang akurat dan menjalani proses verifikasi kami untuk berpartisipasi dalam aktivitas perdagangan global.',
    foo_terms_prohibited_title: 'Konten Terlarang',
    foo_terms_prohibited_desc_1: 'Jangan mencantumkan produk ilegal apa pun dalam katalog Grawizah. Model AI kami memantau kategori terlarang seperti Senjata, Obat-obatan, dan Barang Palsu.',
    foo_terms_prohibited_desc_2: 'Pelanggaran terhadap aturan ini akan mengakibatkan penangguhan akun segera dan rujukan ke otoritas yang berwenang.',

    // Help Center Content (ID)
    foo_help_start_title: 'Memulai dengan Grawizah',
    foo_help_start_desc_1: 'Selamat datang di Grawizah Intelligence Hub. Platform kami dirancang untuk membuat perdagangan global aman, cepat, dan cerdas.',
    foo_help_start_desc_2: 'Untuk memulai, buat akun Gratis sebagai Pembeli atau Pemasok. Setelah pendaftaran, Anda perlu melengkapi profil perusahaan dan menjalani proses "Verifikasi Kepercayaan" kami.',
    foo_help_start_desc_3: 'Setelah diverifikasi, Anda dapat mulai mencantumkan produk atau mencari dari direktori global kami yang berisi jutaan mitra terverifikasi.',
    foo_help_hub_title: 'Menggunakan Pusat Intelijen',
    foo_help_hub_desc_1: 'Alat bertenaga AI kami terletak di bagian "Pusat Intelijen". Anda dapat menggunakan AI bertenaga Groq untuk menganalisis dokumen perdagangan, mengklasifikasikan kode HS, dan menyaring sanksi global.',
    foo_help_hub_desc_2: 'Setiap alat AI dilengkapi dengan dokumentasinya sendiri dan batas penggunaan berdasarkan paket langganan Anda.',
    foo_help_order_title: 'Mengelola Pesanan & Pembayaran',
    foo_help_order_desc_1: 'Transaksi di Grawizah dilindungi oleh "Layanan Perdagangan Aman" kami. Pembayaran ditahan dalam jaminan (escrow) sampai dokumen pengiriman diverifikasi oleh AI kami atau pihak ketiga yang ditunjuk.',
    foo_help_order_desc_2: 'Anda dapat melacak pengiriman dan mengelola faktur secara langsung dari Dasbor Anda.',

    // About Grawizah Content (ID)
    foo_about_hero_title: 'Memberdayakan Perdagangan Global Melalui <span class="text-primary-500 underline decoration-primary-500/30 underline-offset-8">Intelijen.</span>',
    foo_about_hero_desc: 'Grawizah adalah marketplace B2B pertama di dunia yang digerakkan oleh AI, dirancang untuk menjembatani kesenjangan kepercayaan antara pasar negara berkembang dan kepatuhan perdagangan global.',
    foo_about_join_mission: 'Bergabung dengan Misi Kami',
    foo_about_stat_founded: 'Didirikan',
    foo_about_stat_hq: 'Kantor Pusat',
    foo_about_stat_suppliers: 'Pemasok Aktif',
    foo_about_stat_volume: 'Volume Perdagangan',
    foo_about_mission_title: 'Misi Kami',
    foo_about_mission_desc: 'Mendemokratisasi perdagangan global dengan menyediakan alat kepatuhan, intelijen, dan logistik yang sama bagi usaha kecil dan menengah (UKM) yang biasanya hanya tersedia bagi perusahaan Fortune 500.',
    foo_about_mission_point_1: 'Akses Pasar Tanpa Hambatan',
    foo_about_mission_point_2: 'Verifikasi Kepercayaan Berbasis AI',
    foo_about_mission_point_3: 'Rantai Pasok Global yang Inklusif',

    // Contact Us Content (ID)
    foo_contact_hero_desc: 'Hubungi pakar perdagangan global kami untuk dukungan, kemitraan, atau pertanyaan umum. Kami di sini untuk membantu Anda berkembang.',
    foo_contact_form_title: 'Kirim Pesan',
    foo_contact_label_name: 'Nama Lengkap',
    foo_contact_label_email: 'Alamat Email',
    foo_contact_label_subject: 'Subjek',
    foo_contact_label_message: 'Pesan',
    foo_contact_sub_general: 'Pertanyaan Umum',
    foo_contact_sub_support: 'Dukungan Teknis',
    foo_contact_sub_partner: 'Proposal Kemitraan',
    foo_contact_sub_press: 'Pers & Media',
    foo_contact_message_placeholder: 'Bagaimana kami bisa membantu bisnis Anda hari ini?',
    foo_contact_btn_send: 'Kirim Pesan',

    // FAQ Content (ID)
    foo_faq_general_title: 'Pertanyaan Umum',
    foo_faq_general_q1: 'Apa itu Grawizah? Grawizah adalah marketplace perdagangan B2B global bertenaga AI yang menghubungkan pembeli dan pemasok di seluruh dunia.',
    foo_faq_general_q2: 'Apakah Grawizah gratis untuk digunakan? Ya, kami menawarkan paket gratis yang memungkinkan Anda mencantumkan hingga 5 produk dan menelusuri direktori global.',
    foo_faq_general_q3: 'Dapatkah saya meningkatkan paket saya? Ya, Anda dapat meningkatkan ke paket Dasar, Premium, atau Perusahaan langsung dari Dasbor untuk mengakses alat AI canggih dan batas yang lebih tinggi.',
    foo_faq_account_title: 'Akun & Verifikasi',
    foo_faq_account_q1: 'Bagaimana cara mendapatkan verifikasi? Anda perlu mengirimkan dokumen resmi perusahaan (Izin Usaha, NPWP) untuk ditinjau oleh tim Verifikasi Kepercayaan kami.',
    foo_faq_account_q2: 'Apa itu lencana "Pemasok Terverifikasi"? Ini adalah indikator kepercayaan tingkat sistem yang menunjukkan bahwa Anda telah lulus pemeriksaan KYC/KYB kami yang ditingkatkan.',
    foo_faq_payment_title: 'Pembayaran & Sengketa',
    foo_faq_payment_q1: 'Bagaimana cara kerja pembayaran? Kami mendukung berbagai metode pembayaran termasuk Transfer Bank, L/C, dan Kartu Kredit melalui Stripe Connect.',
    foo_faq_payment_q2: 'Bagaimana jika saya memiliki sengketa? Grawizah menyediakan pusat "Penyelesaian Sengketa" bawaan di mana kami menengahi antara pihak-pihak berdasarkan perjanjian perdagangan.',

    // Privacy Policy Content (ID)
    foo_privacy_intro_title: 'Pendahuluan',
    foo_privacy_intro_desc_1: 'Di Grawizah, kami menghormati privasi Anda dan berkomitmen untuk melindungi data pribadi dan perusahaan Anda.',
    foo_privacy_intro_desc_2: 'Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan membagikan informasi Anda dalam konteks perdagangan B2B internasional.',
    foo_privacy_collect_title: 'Informasi yang Kami Kumpulkan',
    foo_privacy_collect_desc_1: 'Kami mengumpulkan nama perusahaan, NPWP, detail pendaftaran, dan informasi kontak untuk tujuan verifikasi tingkat bisnis.',
    foo_privacy_collect_desc_2: 'Informasi perangkat dan penggunaan dikumpulkan secara otomatis untuk menyediakan fitur berbasis AI kami dan meningkatkan keamanan platform.',
    foo_privacy_share_title: 'Bagaimana Kami Membagikan Informasi Anda',
    foo_privacy_share_desc_1: 'Kami hanya membagikan informasi Anda dengan pengguna lain (Pembeli/Pemasok) berdasarkan tingkat akses terverifikasi mereka.',
    foo_privacy_share_desc_2: 'Kami dapat membagikan data Anda dengan mitra pihak ketiga seperti Stripe untuk pemrosesan pembayaran dan Groq untuk layanan AI-inference.',

    // Safety Center Content (ID)
    foo_safety_intro_title: 'Komitmen Kami terhadap Keamanan',
    foo_safety_intro_desc_1: 'Grawizah dibangun di atas prinsip zero-trust. Kami memverifikasi setiap bisnis dan setiap daftar produk untuk memastikan lingkungan perdagangan global yang aman.',
    foo_safety_intro_desc_2: 'Model AI kami secara proaktif mendeteksi penipuan, daftar produk yang mencurigakan, dan perilaku pembeli yang curang.',
    foo_safety_practices_title: 'Praktik Perdagangan yang Aman',
    foo_safety_practices_desc_1: 'Kami merekomendasikan untuk selalu menggunakan "Layanan Perdagangan Aman" Grawizah untuk menahan dana sampai pengiriman diverifikasi.',
    foo_safety_practices_desc_2: 'Jangan bagikan informasi perbankan yang sensitif atau menyelesaikan pembayaran di luar platform.',
    foo_safety_report_title: 'Melaporkan Aktivitas Mencurigakan',
    foo_safety_report_desc_1: 'Jika Anda mengalami perilaku mencurigakan, silakan gunakan tombol "Laporkan" pada profil atau daftar produk apa pun.',
    foo_safety_report_desc_2: 'Tim Kepercayaan & Keamanan kami akan meninjau laporan tersebut dan mengambil tindakan dalam waktu 24 jam.',

    // Cookie Policy Content (ID)
    foo_cookie_intro_title: 'Pendahuluan',
    foo_cookie_intro_desc_1: 'Kami menggunakan cookie dan teknologi serupa untuk menyediakan Situs Web dan Layanan kami dan untuk meningkatkan pengalaman browsing Anda.',
    foo_cookie_intro_desc_2: 'Kebijakan Cookie ini menjelaskan bagaimana kami menggunakan teknologi ini untuk mendukung platform perdagangan B2B global Grawizah.',
    foo_cookie_definition_title: 'Apa itu Cookie?',
    foo_cookie_definition_desc_1: 'Cookie adalah file teks kecil yang disimpan di perangkat Anda oleh browser Anda untuk mengingat preferensi dan interaksi unik Anda.',
    foo_cookie_definition_desc_2: 'Beberapa "Sangat Diperlukan" agar platform dapat berfungsi (misalnya token login). Lainnya digunakan untuk Analitik dan Pemasaran.',
    foo_cookie_choices_title: 'Pilihan Anda',
    foo_cookie_choices_desc_1: 'Anda dapat memilih untuk menonaktifkan semua kecuali cookie yang "Sangat Diperlukan" di pengaturan browser Anda.',
    foo_cookie_choices_desc_2: 'Menonaktifkan beberapa cookie dapat mempengaruhi kinerja dan personalisasi dasbor Grawizah Anda.',
  }
};
