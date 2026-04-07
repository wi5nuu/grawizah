'use client';

import React from 'react';
import InfoPageTemplate from '@/components/templates/InfoPageTemplate';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TermsPage() {
  const { t } = useLanguage();

  return (
    <InfoPageTemplate
      titleKey="footer_tos"
      icon="legal"
      sections={[
        {
          title: t('foo_terms_intro_title' as any) || "Introduction",
          content: [
            t('foo_terms_intro_desc_1' as any) || "Welcome to Grawizah Intelligence Hub. These Terms of Service (the 'Terms') govern your access to and use of our Website and Services.",
            t('foo_terms_intro_desc_2' as any) || "By using Grawizah, you agree to be bound by these corporate-level conditions. If you do not agree, please do not use the Platform."
          ]
        },
        {
          title: t('foo_terms_eligibility_title' as any) || "Eligibility",
          content: [
            t('foo_terms_eligibility_desc_1' as any) || "We require all users to be legally registered businesses in their respective countries. We do not provide services to individual consumers.",
            t('foo_terms_eligibility_desc_2' as any) || "You must provide accurate company information and undergo our verification process to participate in global trade activities."
          ]
        },
        {
          title: t('foo_terms_prohibited_title' as any) || "Prohibited Content",
          content: [
            t('foo_terms_prohibited_desc_1' as any) || "Do not list any illegal products find in the Grawizah catalog. Our AI models monitor for restricted categories such as Weapons, Drugs, and Counterfeits.",
            t('foo_terms_prohibited_desc_2' as any) || "Violation of these rules will result in immediate account suspension and referral to the appropriate authorities."
          ]
        }
      ]}
    />
  );
}
