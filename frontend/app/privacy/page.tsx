'use client';

import React from 'react';
import InfoPageTemplate from '@/components/templates/InfoPageTemplate';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PrivacyPage() {
  const { t } = useLanguage();

  return (
    <InfoPageTemplate
      titleKey="footer_privacy_policy"
      icon="legal"
      sections={[
        {
          title: t('foo_privacy_intro_title' as any) || "Introduction",
          content: [
            t('foo_privacy_intro_desc_1' as any) || "At Grawizah, we respect your privacy and are committed to protecting your personal and company data.",
            t('foo_privacy_intro_desc_2' as any) || "This Privacy Policy explains how we collect, use, and share your information in the context of international B2B trade."
          ]
        },
        {
          title: t('foo_privacy_collect_title' as any) || "Information We Collect",
          content: [
            t('foo_privacy_collect_desc_1' as any) || "We collect company name, tax ID, registration details, and contact information for the purpose of business-level verification.",
            t('foo_privacy_collect_desc_2' as any) || "Device and usage information is collected automatically to provide our AI-driven features and improve platform security."
          ]
        },
        {
          title: t('foo_privacy_share_title' as any) || "How We Share Your Information",
          content: [
            t('foo_privacy_share_desc_1' as any) || "We only share your information with other users (Buyers/Suppliers) based on their verified access levels.",
            t('foo_privacy_share_desc_2' as any) || "We may share your data with third-party partners like Stripe for payment processing and Groq for AI-inference services."
          ]
        }
      ]}
    />
  );
}
