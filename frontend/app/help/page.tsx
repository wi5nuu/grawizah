'use client';

import React from 'react';
import InfoPageTemplate from '@/components/templates/InfoPageTemplate';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HelpPage() {
  const { t } = useLanguage();

  return (
    <InfoPageTemplate
      titleKey="footer_help_center"
      icon="help"
      sections={[
        {
          title: t('foo_help_start_title' as any) || "Getting Started with Grawizah",
          content: [
            t('foo_help_start_desc_1' as any) || "Welcome to Grawizah Intelligence Hub. Our platform is designed to make global trade safe, fast, and intelligent.",
            t('foo_help_start_desc_2' as any) || "To get started, create a Free account as a Buyer or Supplier. After registration, you'll need to complete your company profile and undergo our 'Trust-Verification' process.",
            t('foo_help_start_desc_3' as any) || "Once verified, you can start listing products or sourcing from our global directory of millions of verified partners."
          ]
        },
        {
          title: t('foo_help_hub_title' as any) || "Using the Intelligence Hub",
          content: [
            t('foo_help_hub_desc_1' as any) || "Our AI-powered tools are located in the 'Intelligence Hub' section. You can use Groq-powered AI to analyze trade documents, classify HS codes, and screen global sanctions.",
            t('foo_help_hub_desc_2' as any) || "Each AI tool comes with its own documentation and usage limits based on your subscription plan."
          ]
        },
        {
          title: t('foo_help_order_title' as any) || "Managing Orders & Payments",
          content: [
            t('foo_help_order_desc_1' as any) || "Transactions on Grawizah are protected by our 'Secured Trading Service'. Payments are held in escrow until shipping documents are verified by our AI or a designated third-party.",
            t('foo_help_order_desc_2' as any) || "You can track your shipments and manage invoices directly from your Dashboard."
          ]
        }
      ]}
    />
  );
}
