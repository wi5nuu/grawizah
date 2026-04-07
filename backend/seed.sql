-- =============================================================
-- GRAWIZAH - Full Seed Data Script
-- Includes: users, super_admins, companies, subscriptions, products,
--           product_specifications, product_faq, buyer_radar, market_insights
-- =============================================================

-- ---- 1. USERS ----
INSERT INTO users (id, email, full_name, role, password_hash, is_email_verified, created_at, updated_at) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'admin@grawizah.com',     'Grawizah Admin',          'admin',    '$2a$10$eLBufh0EgltYA5qzXBPzXOYYOsi.Fjc.Wf/TMbrAAvII/Z7b7ccra',     true,  NOW(), NOW()),
  ('a1000000-0000-0000-0000-000000000002', 'shenzhen.star@grawizah.com', 'Starmax Technology',  'trader', '$2a$10$ZUAMLxl0JEhf3tzQpphZIe.wKAN9Ty8CN5qucpC0hvuYewpyO1nxa',       true,  NOW(), NOW()),
  ('a1000000-0000-0000-0000-000000000003', 'yoke.elec@grawizah.com',     'Yoke Electronics',   'trader', '$2a$10$hzrQy3m9JRklLsN2NUbWJeYn/2NAM1N4XsUZyaap.1f5Lr8UX.zV.',       true,  NOW(), NOW()),
  ('a1000000-0000-0000-0000-000000000004', 'shineworld@grawizah.com',    'Shineworld Innov',   'trader', '$2a$10$placeholder_hash_003',       true,  NOW(), NOW()),
  ('a1000000-0000-0000-0000-000000000005', 'yboge@grawizah.com',         'Yboge Technology',   'trader', '$2a$10$placeholder_hash_004',       true,  NOW(), NOW()),
  ('a1000000-0000-0000-0000-000000000006', 'mefine@grawizah.com',        'Mefine Electronics', 'trader', '$2a$10$placeholder_hash_005',       true,  NOW(), NOW()),
  ('a1000000-0000-0000-0000-000000000007', 'huasifei@grawizah.com',      'Huasifei Technology','trader', '$2a$10$placeholder_hash_006',       true,  NOW(), NOW()),
  ('a1000000-0000-0000-0000-000000000008', 'xinruisi@grawizah.com',      'Xinruisi Technology','trader', '$2a$10$placeholder_hash_007',       true,  NOW(), NOW()),
  ('a1000000-0000-0000-0000-000000000009', 'doke@grawizah.com',          'Doke Electronic',    'trader', '$2a$10$placeholder_hash_008',       true,  NOW(), NOW()),
  ('a1000000-0000-0000-0000-000000000010', 'karenm@grawizah.com',        'Karen M Electronics','trader', '$2a$10$placeholder_hash_009',       true,  NOW(), NOW()),
  ('a1000000-0000-0000-0000-000000000011', 'dongguan.ind@grawizah.com',  'Dongguan Industrial','trader', '$2a$10$placeholder_hash_010',       true,  NOW(), NOW()),
  ('a1000000-0000-0000-0000-000000000012', 'guangzhou.mfg@grawizah.com', 'Guangzhou Mfg Co',   'trader', '$2a$10$placeholder_hash_011',       true,  NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ---- 2. SUPER ADMINS ----
INSERT INTO super_admins (id, user_id, admin_level, department, created_at) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 1, 'Platform Operations', NOW())
ON CONFLICT (id) DO NOTHING;

-- ---- 3. COMPANIES ----
INSERT INTO companies (id, owner_id, company_name, tax_id, address, city, country, is_verified, created_at, updated_at) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002', 'Shenzhen Starmax Technology Co., Ltd.', 'CN-TAX-001', '3F, Bldg A, Shenzhen Science Park', 'Shenzhen', 'China', true,  NOW(), NOW()),
  ('c1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000003', 'Shenzhen Yoke Electronics Co., Ltd.',   'CN-TAX-002', 'Block B, Electronics Zone, Longhua',  'Shenzhen', 'China', true,  NOW(), NOW()),
  ('c1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000004', 'Dongguan Shineworld Innovations Co., Ltd.','CN-TAX-003','Industrial Park, Dongguan',          'Dongguan', 'China', true,  NOW(), NOW()),
  ('c1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000005', 'Shenzhen Yboge Technology Co., Ltd.',   'CN-TAX-004', '10F Tech Tower, Nanshan',             'Shenzhen', 'China', true,  NOW(), NOW()),
  ('c1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000006', 'Guangzhou Mefine Electronics Co., Ltd.','CN-TAX-005', 'Rose Valley Industrial Zone',         'Guangzhou','China', true,  NOW(), NOW()),
  ('c1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000007', 'Shenzhen Huasifei Technology Co., Ltd.','CN-TAX-006', '5F Innovation Building, Futian',      'Shenzhen', 'China', true,  NOW(), NOW()),
  ('c1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000008', 'Dongguan Xinruisi Technology Co., Ltd.','CN-TAX-007', 'Qishi Industrial District',           'Dongguan', 'China', true,  NOW(), NOW()),
  ('c1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000009', 'Shenzhen Doke Electronic Co., Ltd.',   'CN-TAX-008', 'Bantian Hi-Tech Zone',                'Shenzhen', 'China', false, NOW(), NOW()),
  ('c1000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000010', 'Shenzhen Karen M Electronics Co., Ltd.','CN-TAX-009','Shenzhen Bay Technology Cluster',     'Shenzhen', 'China', true,  NOW(), NOW()),
  ('c1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000011', 'Dongguan Industrial Pump Co., Ltd.',   'CN-TAX-010', 'Industrial Estate, Chang''an',        'Dongguan', 'China', true,  NOW(), NOW()),
  ('c1000000-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000012', 'Guangzhou CNC Parts Co., Ltd.',        'CN-TAX-011', 'Panyu District Factory Zone',         'Guangzhou','China', true,  NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ---- 4. SUBSCRIPTIONS ----
INSERT INTO subscriptions (id, company_id, plan, start_date, end_date, auto_renew, created_at, updated_at) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'premium',    NOW(), NOW() + INTERVAL '1 year', true, NOW(), NOW()),
  ('d1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'premium',    NOW(), NOW() + INTERVAL '1 year', true, NOW(), NOW()),
  ('d1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000003', 'basic',      NOW(), NOW() + INTERVAL '6 months', false, NOW(), NOW()),
  ('d1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000004', 'premium',    NOW(), NOW() + INTERVAL '1 year', true, NOW(), NOW()),
  ('d1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000005', 'basic',      NOW(), NOW() + INTERVAL '6 months', false, NOW(), NOW()),
  ('d1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000006', 'free',       NOW(), NOW() + INTERVAL '1 month', false, NOW(), NOW()),
  ('d1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000007', 'basic',      NOW(), NOW() + INTERVAL '6 months', true, NOW(), NOW()),
  ('d1000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000008', 'free',       NOW(), NOW() + INTERVAL '1 month', false, NOW(), NOW()),
  ('d1000000-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-000000000009', 'enterprise', NOW(), NOW() + INTERVAL '2 years', true, NOW(), NOW()),
  ('d1000000-0000-0000-0000-000000000010', 'c1000000-0000-0000-0000-000000000010', 'basic',      NOW(), NOW() + INTERVAL '6 months', true, NOW(), NOW()),
  ('d1000000-0000-0000-0000-000000000011', 'c1000000-0000-0000-0000-000000000011', 'premium',    NOW(), NOW() + INTERVAL '1 year', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ---- 5. PRODUCTS ----
INSERT INTO products (id, company_id, title, description, category, hs_code_manual, price_est_min, price_est_max, currency, images_url, is_active, created_at, updated_at) VALUES

-- Electronics / Smart Watches
('e1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001',
 '2025 GTR6 AI Smart Watch AMOLED Screen Magnetic IP68 Waterproof 24-Hour Heart Rate and Sleep Monitor',
 'The 2025 GTR6 is our flagship AI-powered smartwatch featuring a stunning 1.43" AMOLED display with 466x466 resolution. Equipped with advanced health monitoring sensors including 24-hour heart rate, blood oxygen (SpO2), sleep tracking, and stress monitoring. IP68 waterproof rating means it can be worn while swimming. The magnetic charging system ensures quick and convenient charging. Compatible with both iOS and Android devices via Bluetooth 5.3.',
 'electronics', '8517.62', 10.00, 25.00, 'USD',
 '["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop","https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop","https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop"]',
 true, NOW(), NOW()),

('e1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002',
 '2.19" Screen Smartwatch Ultra Phone Calls Heart Rate and Sleep Monitor iOS Android',
 'Premium smartwatch with a large 2.19" HD display for superior visibility. Supports Bluetooth phone calls directly from the wrist without needing your phone nearby. Real-time heart rate and sleep stage monitoring with AI-powered insights. Ultra-thin aluminum alloy body with comfortable silicone strap. Compatible with all iOS 9.0+ and Android 5.0+ devices.',
 'electronics', '8517.62', 3.00, 8.00, 'USD',
 '["https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop","https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop"]',
 true, NOW(), NOW()),

('e1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000003',
 '1.32" 366x366 Resolution 450nits QSPI B2B AMOLED Smartwatches Round Touchscreen Display',
 'Professional-grade B2B smartwatch panel featuring a 1.32" round AMOLED display with 366x366 resolution and impressive 450nits brightness for excellent outdoor visibility. QSPI interface for fast data transfer. Perfect for OEM/ODM smart watch manufacturers. Minimum order quantity is flexible based on partnership agreements.',
 'electronics', '8517.62', 8.00, 15.00, 'USD',
 '["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop","https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop"]',
 true, NOW(), NOW()),

('e1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000004',
 'Zeblaze Stratos 4 2025 Outdoor GPS Smart Watch 5 ATM Waterproof Built-in Compass',
 'The Zeblaze Stratos 4 is built for adventurers and outdoor enthusiasts. Features built-in GPS for accurate route tracking, 5 ATM water resistance (up to 50 meters), military-grade durability, and a comprehensive suite of over 100+ sport modes. The built-in compass and altimeter support navigation in remote areas. Battery life up to 20 days on a single charge.',
 'electronics', '8517.62', 55.00, 70.00, 'USD',
 '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop","https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop"]',
 true, NOW(), NOW()),

('e1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000005',
 'Ultra Series 8 Smartwatch Bluetooth Call Heart Rate Monitor Fitness Tracker',
 'Feature-packed Ultra Series 8 smartwatch with premium aluminum alloy case and fluoroelastomer band. Bluetooth calling allows you to answer and make calls directly from your wrist. Comprehensive health suite including ECG, blood pressure, SpO2, and continuous heart rate monitoring. 100+ fitness tracking modes and a 7-day battery life on a single charge.',
 'electronics', '8517.62', 11.00, 16.00, 'USD',
 '["https://images.unsplash.com/photo-1544117519-31a4b71922bb?w=400&h=400&fit=crop","https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop"]',
 true, NOW(), NOW()),

('e1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000006',
 'T500 Plus Smart Watch Series 5 Fitness Tracker Heart Rate Blood Pressure Monitor',
 'Affordable yet feature-rich T500 Plus smartwatch ideal for daily health tracking. Large 1.75" full touch screen with customizable watch faces. Tracks heart rate, blood pressure, blood oxygen, steps, calories, and distance. Multiple sport modes including running, cycling, swimming, and yoga. IP67 water-resistant for everyday use.',
 'electronics', '8517.62', 4.50, 8.00, 'USD',
 '["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop","https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop"]',
 true, NOW(), NOW()),

('e1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000007',
 'HW22 Pro Max Smartwatch 1.75" HD Screen Wireless Charging Bluetooth Call',
 'The HW22 Pro Max combines premium aesthetics with powerful functionality. The 1.75" full-circle HD display delivers crisp visuals for notifications, health data, and custom watch faces. Wireless charging technology for cable-free convenience. Bluetooth call function, music control, sedentary reminders, and sleep quality analysis.',
 'electronics', '8517.62', 9.00, 13.00, 'USD',
 '["https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop","https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop"]',
 true, NOW(), NOW()),

('e1000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000008',
 'DT No.1 DT100 Smart Watch Men 1.32" AMOLED Always-on Display IP68 Waterproof',
 'High-end DT100 smartwatch for men with a premium 1.32" always-on AMOLED display that stays visible even in bright sunlight. IP68 waterproof certified for swimming and diving up to 30 meters. Advanced health monitoring with 24-hour ECG, blood pressure, and temperature sensors. Supports NFC payments and 200+ cloud watch faces.',
 'electronics', '8517.62', 25.00, 35.00, 'USD',
 '["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop","https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&h=400&fit=crop"]',
 true, NOW(), NOW()),

-- Machinery / Industrial
('e1000000-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-000000000010',
 'Industrial Centrifugal Pump 15KW High-Flow Stainless Steel Water Pump',
 'Heavy-duty industrial centrifugal pump designed for high-volume liquid transfer in manufacturing and processing plants. 15KW motor with 316L stainless steel impeller for excellent chemical resistance and durability. Flow rate up to 500 m³/h with a max head of 120 meters. Suitable for water, oil, chemicals, and food-grade liquids. CE and ISO 9001 certified.',
 'machinery', '8413.70', 900.00, 1800.00, 'USD',
 '["https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop","https://images.unsplash.com/photo-1565043666747-69f6646db940?w=400&h=400&fit=crop"]',
 true, NOW(), NOW()),

('e1000000-0000-0000-0000-000000000010', 'c1000000-0000-0000-0000-000000000011',
 'CNC Machine Parts Precision Aluminum Milling Components Custom OEM',
 'High-precision CNC milled aluminum parts manufactured to customer specifications. Tolerances down to ±0.005mm using 5-axis CNC machining centers. Materials including 6061, 7075 aluminum, titanium, and stainless steel. Surface treatments: anodizing, powder coating, polishing. Suitable for aerospace, automotive, medical, and electronics industries. Free samples available.',
 'machinery', '8466.93', 300.00, 700.00, 'USD',
 '["https://images.unsplash.com/photo-1565043666747-69f6646db940?w=400&h=400&fit=crop","https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop"]',
 true, NOW(), NOW()),

-- Textiles
('e1000000-0000-0000-0000-000000000011', 'c1000000-0000-0000-0000-000000000006',
 'Custom Logo Men''s Cotton T-Shirt Bulk Wholesale OEM Manufacturing',
 'Premium quality 100% ring-spun cotton t-shirts available for custom printing and branding. 180 GSM fabric weight for comfortable everyday wear. Available in 30+ colors and all sizes from XS to 5XL. Screen printing, DTG, embroidery, and sublimation printing options available. Minimum order 100 pieces per design. Quick turnaround: 7-14 business days.',
 'textiles', '6109.10', 2.50, 6.00, 'USD',
 '["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop","https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=400&fit=crop"]',
 true, NOW(), NOW()),

-- Food & Beverage
('e1000000-0000-0000-0000-000000000012', 'c1000000-0000-0000-0000-000000000007',
 'Organic Green Tea Premium Grade Export Quality Loose Leaf Bulk',
 'Certified organic green tea sourced from high-altitude tea gardens in Yunnan and Fujian provinces. First flush spring harvest ensuring highest quality and antioxidant content. Available grades: Dragon Well (Longjing), Bi Luo Chun, Mao Feng, Sencha-style. Packed in nitrogen-flushed airtight bags to preserve freshness. USDA Organic, EU Organic, and HACCP certified.',
 'food', '0902.10', 45.00, 120.00, 'USD',
 '["https://images.unsplash.com/photo-1563822249366-3efb23b8e0c9?w=400&h=400&fit=crop","https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=400&fit=crop"]',
 true, NOW(), NOW()),

-- Automotive
('e1000000-0000-0000-0000-000000000013', 'c1000000-0000-0000-0000-000000000010',
 'Premium Car Paint Protection Film PPF Self-Healing Anti-Scratch Transparent',
 'Professional-grade paint protection film (PPF) with self-healing technology — minor scratches disappear with heat exposure. 8 mil thick TPU film with optical clarity (99% transparency). UV resistant to prevent yellowing over time. Hydrophobic coating for easy cleaning. Suitable for hoods, bumpers, doors, and full-vehicle wraps. Custom cutting available via our digital plotter.',
 'automotive', '3919.10', 8.00, 20.00, 'USD',
 '["https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=400&fit=crop","https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=400&fit=crop"]',
 true, NOW(), NOW()),

-- Electrical
('e1000000-0000-0000-0000-000000000014', 'c1000000-0000-0000-0000-000000000009',
 'LED Strip Light RGB 5050 SMD Flexible 12V Waterproof IP68 Smart WiFi',
 'High-quality RGB LED strip lights using premium 5050 SMD chips for vibrant, consistent color output. Smart WiFi control via app (Android/iOS) compatible with Alexa and Google Home. IP68 fully waterproof for outdoor and underwater installation. 12V DC low voltage for safety. 300 LEDs/5m with 16 million color options and multiple dynamic modes. Cut-and-reconnect design for flexible installation.',
 'electrical', '8539.50', 1.50, 5.00, 'USD',
 '["https://images.unsplash.com/photo-1565814636199-ae8133025a74?w=400&h=400&fit=crop","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop"]',
 true, NOW(), NOW()),

-- Chemicals
('e1000000-0000-0000-0000-000000000015', 'c1000000-0000-0000-0000-000000000011',
 'Industrial Epoxy Adhesive High-Strength 2-Part Structural Bonding System',
 'Professional 2-component epoxy adhesive system providing exceptional bond strength up to 30 MPa shear strength. Suitable for bonding metals, composites, ceramics, glass, and most plastics. Chemical resistant to oils, fuels, solvents, and mild acids. Working time: 30 minutes; full cure: 24 hours at room temperature. Available in 50ml, 200ml, 500ml, and 5L bulk sizes. Meets MIL-SPEC and aerospace standards.',
 'chemicals', '3506.10', 5.00, 25.00, 'USD',
 '["https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=400&fit=crop","https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=400&fit=crop"]',
 true, NOW(), NOW()),

-- Medical
('e1000000-0000-0000-0000-000000000016', 'c1000000-0000-0000-0000-000000000009',
 'Medical Safety Glasses Anti-Fog UV Protection Polycarbonate Lens CE EN166',
 'Professional medical-grade safety glasses with impact-resistant polycarbonate lenses providing ANSI Z87.1 and EN166 rated protection. Anti-fog coating on both lens surfaces for clear vision even during intense activity. UV400 protection blocks 99.9% of harmful UVA and UVB radiation. Adjustable temples and comfortable nose bridge fit all face shapes. Suitable for laboratories, hospitals, and industrial environments.',
 'medical', '9004.10', 1.20, 4.00, 'USD',
 '["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop","https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=400&fit=crop"]',
 true, NOW(), NOW()),

-- User Requested Additions (Mobile, Jam, Parfum, Kelapa, Sawit)
('e1000000-0000-0000-0000-000000000017', 'c1000000-0000-0000-0000-000000000001',
 'Latest 5G Mobile Phone Flagship 2025',
 'Top of the line 5G smartphone with 120Hz display, Snapdragon processor, and 1TB storage capabilities. Designed for global markets with an unlocked carrier network. Includes advanced AI camera systems.',
 'electronics', '8517.12', 400.00, 900.00, 'USD',
 '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop","https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=400&fit=crop"]',
 true, NOW(), NOW()),

('e1000000-0000-0000-0000-000000000018', 'c1000000-0000-0000-0000-000000000002',
 'Jam Tangan Luxury Automatic Watch Submariner',
 'Classic automatic diving watch with sapphire crystal glass and premium stainless steel band. Water-resistant up to 200m making it suitable for deep diving and luxury aesthetics.',
 'electronics', '9102.21', 1200.00, 3500.00, 'USD',
 '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop"]',
 true, NOW(), NOW()),

('e1000000-0000-0000-0000-000000000019', 'c1000000-0000-0000-0000-000000000003',
 'Premium French Vanilla Perfume (Parfum) 100ml',
 'Long-lasting Eau de Parfum with luxurious vanilla extract. Designed for evening wear with base notes of amber and musk. Sourced and manufactured with pure essential oils.',
 'chemicals', '3303.00', 45.00, 110.00, 'USD',
 '["https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=400&fit=crop"]',
 true, NOW(), NOW()),

('e1000000-0000-0000-0000-000000000020', 'c1000000-0000-0000-0000-000000000004',
 'Indonesian Fresh Coconut Premium Export (Kelapa)',
 'High quality young coconuts directly from Sumatra plantations. Perfect for coconut water extraction and food industry usage. Hand-picked and carefully packed for international sea freight.',
 'food', '0801.19', 0.50, 1.20, 'USD',
 '["https://images.unsplash.com/photo-1550259114-ad213b313ef0?w=400&h=400&fit=crop"]',
 true, NOW(), NOW()),

('e1000000-0000-0000-0000-000000000021', 'c1000000-0000-0000-0000-000000000005',
 'Crude Palm Oil (Kelapa Sawit) Bulk Drum',
 'Grade A unrefined crude palm oil (CPO) for industrial and food manufacturing processing. Extracted using sustainable practices with RSPO certification available upon request.',
 'food', '1511.10', 800.00, 1000.00, 'USD',
 '["https://images.unsplash.com/photo-1518531933037-91b2f5ab45f1?w=400&h=400&fit=crop"]',
 true, NOW(), NOW())

ON CONFLICT (id) DO NOTHING;

-- ---- 6. PRODUCT SPECIFICATIONS ----
INSERT INTO product_specifications (id, product_id, spec_key, spec_value, created_at) VALUES
  -- GTR6 Smart Watch
  (gen_random_uuid(), 'e1000000-0000-0000-0000-000000000001', 'Display Size', '1.43 inch AMOLED', NOW()),
  (gen_random_uuid(), 'e1000000-0000-0000-0000-000000000001', 'Resolution', '466 x 466 pixels', NOW()),
  (gen_random_uuid(), 'e1000000-0000-0000-0000-000000000001', 'Water Resistance', 'IP68 (up to 50m)', NOW()),
  (gen_random_uuid(), 'e1000000-0000-0000-0000-000000000001', 'Battery Life', '14 days typical use', NOW()),
  (gen_random_uuid(), 'e1000000-0000-0000-0000-000000000001', 'Connectivity', 'Bluetooth 5.3, GPS', NOW()),
  (gen_random_uuid(), 'e1000000-0000-0000-0000-000000000001', 'Sensors', 'Heart Rate, SpO2, Accelerometer, Gyroscope', NOW()),
  (gen_random_uuid(), 'e1000000-0000-0000-0000-000000000001', 'Compatibility', 'iOS 10+, Android 7.0+', NOW()),
  (gen_random_uuid(), 'e1000000-0000-0000-0000-000000000001', 'MOQ', '10 units', NOW()),
  -- Zeblaze Stratos 4
  (gen_random_uuid(), 'e1000000-0000-0000-0000-000000000004', 'Display', '1.43" AMOLED 466x466', NOW()),
  (gen_random_uuid(), 'e1000000-0000-0000-0000-000000000004', 'GPS', 'Built-in GPS + GLONASS + Galileo', NOW()),
  (gen_random_uuid(), 'e1000000-0000-0000-0000-000000000004', 'Water Resistance', '5 ATM (50 meters)', NOW()),
  (gen_random_uuid(), 'e1000000-0000-0000-0000-000000000004', 'Battery', '20 days typical / 100 hours GPS', NOW()),
  (gen_random_uuid(), 'e1000000-0000-0000-0000-000000000004', 'Sport Modes', '100+', NOW()),
  -- Industrial Pump
  (gen_random_uuid(), 'e1000000-0000-0000-0000-000000000009', 'Motor Power', '15 KW', NOW()),
  (gen_random_uuid(), 'e1000000-0000-0000-0000-000000000009', 'Max Flow Rate', '500 m³/h', NOW()),
  (gen_random_uuid(), 'e1000000-0000-0000-0000-000000000009', 'Max Head', '120 meters', NOW()),
  (gen_random_uuid(), 'e1000000-0000-0000-0000-000000000009', 'Material', '316L Stainless Steel', NOW()),
  (gen_random_uuid(), 'e1000000-0000-0000-0000-000000000009', 'Certification', 'CE, ISO 9001', NOW()),
  -- LED Strip
  (gen_random_uuid(), 'e1000000-0000-0000-0000-000000000014', 'LED Type', 'SMD 5050 RGB', NOW()),
  (gen_random_uuid(), 'e1000000-0000-0000-0000-000000000014', 'Voltage', '12V DC', NOW()),
  (gen_random_uuid(), 'e1000000-0000-0000-0000-000000000014', 'LED Density', '300 LEDs / 5 meters', NOW()),
  (gen_random_uuid(), 'e1000000-0000-0000-0000-000000000014', 'IP Rating', 'IP68 Waterproof', NOW()),
  (gen_random_uuid(), 'e1000000-0000-0000-0000-000000000014', 'Smart Control', 'WiFi, Alexa, Google Home', NOW())
ON CONFLICT DO NOTHING;

-- ---- 7. PRODUCT FAQ ----
INSERT INTO product_faq (id, product_id, question, answer, created_at) VALUES
  (gen_random_uuid(), 'e1000000-0000-0000-0000-000000000001', 'What is the minimum order quantity?', 'Minimum order quantity is 10 units. For orders above 100 units, we offer special pricing discounts.', NOW()),
  (gen_random_uuid(), 'e1000000-0000-0000-0000-000000000001', 'Do you offer custom branding/OEM?', 'Yes, we offer full OEM/ODM services including custom logo, packaging, and firmware customization for orders of 500+ units.', NOW()),
  (gen_random_uuid(), 'e1000000-0000-0000-0000-000000000001', 'What certifications does this product have?', 'CE, FCC, RoHS, and REACH certified. We can provide additional certifications upon request.', NOW()),
  (gen_random_uuid(), 'e1000000-0000-0000-0000-000000000001', 'What is the warranty period?', 'We offer a 12-month warranty against manufacturing defects. Extended warranties are available for larger orders.', NOW()),
  (gen_random_uuid(), 'e1000000-0000-0000-0000-000000000009', 'Can you customize the pump specifications?', 'Yes, we manufacture custom pumps based on your specific flow rate, head, and material requirements.', NOW()),
  (gen_random_uuid(), 'e1000000-0000-0000-0000-000000000009', 'What is the lead time for production?', 'Standard models: 15-20 working days. Custom orders: 30-45 working days depending on specifications.', NOW()),
  (gen_random_uuid(), 'e1000000-0000-0000-0000-000000000014', 'Is the LED strip cuttable?', 'Yes, the LED strip can be cut every 3 LEDs (about 5cm intervals) and reconnected using standard 4-pin connectors.', NOW()),
  (gen_random_uuid(), 'e1000000-0000-0000-0000-000000000014', 'Does it work with smart home systems?', 'Yes, it supports Amazon Alexa, Google Home, and Apple HomeKit via the companion app.', NOW())
ON CONFLICT DO NOTHING;

-- ---- 8. MARKET INSIGHTS ----
INSERT INTO market_insights (id, category, country, trend_data, avg_price, demand_level, generated_at) VALUES
  (gen_random_uuid(), 'electronics', 'Indonesia', '{"growth": "15%", "trend": "rising", "top_products": ["smart_watch", "earbuds", "smartphone"]}', 12.50, 'High', NOW()),
  (gen_random_uuid(), 'machinery',   'Indonesia', '{"growth": "8%",  "trend": "stable", "top_products": ["pumps", "cnc", "motors"]}',                850.00, 'Medium', NOW()),
  (gen_random_uuid(), 'textiles',    'Indonesia', '{"growth": "5%",  "trend": "stable", "top_products": ["t_shirts", "uniforms", "fabric"]}',          3.50, 'High', NOW()),
  (gen_random_uuid(), 'automotive',  'Indonesia', '{"growth": "12%", "trend": "rising", "top_products": ["ppf", "accessories", "parts"]}',            15.00, 'Medium', NOW()),
  (gen_random_uuid(), 'electronics', 'Malaysia',  '{"growth": "18%", "trend": "rising", "top_products": ["smart_watch", "components", "cables"]}',    10.00, 'High', NOW()),
  (gen_random_uuid(), 'food',        'Malaysia',  '{"growth": "10%", "trend": "rising", "top_products": ["green_tea", "coffee", "herbs"]}',            80.00, 'Medium', NOW())
ON CONFLICT DO NOTHING;

-- ---- 9. BUYER RADAR DATA ----
INSERT INTO buyer_radar (id, target_country, company_name, buy_score, trade_history_data, import_frequency, preferred_products, created_at, updated_at) VALUES
  (gen_random_uuid(), 'Indonesia', 'PT Maju Bersama Teknologi',    89.5, '{"total_imports": 250, "avg_value": 15000, "last_year_growth": "23%"}', 'monthly',   '{"smart_watches", "electronics", "gadgets"}', NOW(), NOW()),
  (gen_random_uuid(), 'Indonesia', 'CV Sumber Rejeki Import',      75.2, '{"total_imports": 120, "avg_value": 8500,  "last_year_growth": "12%"}', 'quarterly', '{"machinery", "industrial_equipment"}',       NOW(), NOW()),
  (gen_random_uuid(), 'Malaysia',  'Syn Trading Sdn Bhd',          92.1, '{"total_imports": 380, "avg_value": 22000, "last_year_growth": "31%"}', 'monthly',   '{"electronics", "smart_devices", "cables"}',  NOW(), NOW()),
  (gen_random_uuid(), 'Vietnam',   'Cong Ty TNHH Nhap Khau ABC',   68.7, '{"total_imports": 90,  "avg_value": 5500,  "last_year_growth": "8%"}',  'quarterly', '{"textiles", "machinery", "chemicals"}',      NOW(), NOW()),
  (gen_random_uuid(), 'Thailand',  'Bangkok Import Export Co Ltd', 81.3, '{"total_imports": 200, "avg_value": 12000, "last_year_growth": "18%"}', 'monthly',   '{"automotive", "electronics", "food"}',       NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ---- 10. SANCTION LIST (OFAC/UN/EU) ----
INSERT INTO sanction_list (id, name, alias, country, list_source, entity_type, reason, is_active, created_at) VALUES
  (gen_random_uuid(), 'IRGC - Islamic Revolutionary Guard Corps', '{"IRGC", "Sepah-e Pasdaran"}', 'Iran', 'OFAC', 'Entity', 'Designated as a Foreign Terrorist Organization', true, NOW()),
  (gen_random_uuid(), 'Al-Qaida', '{"Al Qaeda", "Al-Qa ida"}', 'Afghanistan', 'UN', 'Entity', 'UNSC 1267 Committee sanctions list', true, NOW()),
  (gen_random_uuid(), 'Taliban', '{"Taleban"}', 'Afghanistan', 'UN', 'Entity', 'UNSC 1988 sanctions regime', true, NOW()),
  (gen_random_uuid(), 'Rosneft', '{"Rosneft Oil Company"}', 'Russia', 'OFAC', 'Entity', 'Russian energy company subject to sectoral sanctions', true, NOW()),
  (gen_random_uuid(), 'Sberbank', '{"Sberbank of Russia"}', 'Russia', 'OFAC', 'Entity', 'Subject to Directive 2 sanctions', true, NOW()),
  (gen_random_uuid(), 'Wagner Group', '{"PMC Wagner"}', 'Russia', 'EU', 'Entity', 'EU sanctions re: destabilizing activities', true, NOW()),
  (gen_random_uuid(), 'Hizballah', '{"Hezbollah", "Party of God"}', 'Lebanon', 'OFAC', 'Entity', 'Specially Designated Global Terrorist', true, NOW()),
  (gen_random_uuid(), 'Korea Mining Development Trading Corp', '{"KOMID"}', 'North Korea', 'UN', 'Entity', 'UNSC 1718 DPRK sanctions committee', true, NOW()),
  (gen_random_uuid(), 'Myanmar Economic Corporation', '{"MEC"}', 'Myanmar', 'EU', 'Entity', 'EU sanctions re: situation in Myanmar', true, NOW()),
  (gen_random_uuid(), 'Gazprom', '{"Gazprom PJSC"}', 'Russia', 'EU', 'Entity', 'EU restrictive measures re: Russia', true, NOW())
ON CONFLICT DO NOTHING;
