'use client';

import React from 'react';
import InfoPageTemplate from '@/components/templates/InfoPageTemplate';
import { useLanguage } from '@/contexts/LanguageContext';

export default function FAQPage() {
  const { t } = useLanguage();

  return (
    <InfoPageTemplate
      titleKey="footer_faq"
      icon="help"
      sections={[
        {
          title: t('foo_faq_general_title' as any) || "General Questions",
          content: [
            t('foo_faq_general_q1' as any) || "What is Grawizah? Grawizah is an AI-powered global B2B trade marketplace that connects buyers and suppliers worldwide.",
            t('foo_faq_general_q2' as any) || "Is Grawizah free to use? Yes, we offer a free tier that allows you to list up to 5 products and browse the global directory.",
            t('foo_faq_general_q3' as any) || "Can I upgrade my plan? Yes, you can upgrade to Basic, Premium, or Enterprise plans directly from your Dashboard to access advanced AI tools and higher limits."
          ]
        },
        {
          title: t('foo_faq_account_title' as any) || "Account & Verification",
          content: [
            t('foo_faq_account_q1' as any) || "How do I get verified? You'll need to submit official company documents (Business License, Tax ID) for our Trust-Verification team to review.",
            t('foo_faq_account_q2' as any) || "What is the 'Verified Supplier' badge? It's a system-level trust indicator that shows you have passed our enhanced KYC/KYB checks."
          ]
        },
        {
          title: t('foo_faq_payment_title' as any) || "Payments & Disputes",
          content: [
            t('foo_faq_payment_q1' as any) || "How do payments work? We support multiple payment methods including Bank Wire, L/C, and Credit Cards via Stripe Connect.",
            t('foo_faq_payment_q2' as any) || "What if I have a dispute? Grawizah provides a built-in 'Dispute Resolution' center where we mediate between parties based on the trade agreement."
          ]
        }
      ]}
    />
  );
}
