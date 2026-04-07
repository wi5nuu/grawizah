'use client';

import React from 'react';
import InfoPageTemplate from '@/components/templates/InfoPageTemplate';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SafetyPage() {
  const { t } = useLanguage();

  return (
    <InfoPageTemplate
      titleKey="footer_safety_center"
      icon="legal"
      sections={[
        {
          title: t('foo_safety_intro_title' as any) || "Our Commitment to Safety",
          content: [
            t('foo_safety_intro_desc_1' as any) || "Grawizah is built on zero-trust principles. We verify every business and every listing to ensure a secure global trade environment.",
            t('foo_safety_intro_desc_2' as any) || "Our AI models proactively detect fraud, suspect listings, and fraudulent buyer behavior."
          ]
        },
        {
          title: t('foo_safety_practices_title' as any) || "Safe Trading Practices",
          content: [
            t('foo_safety_practices_desc_1' as any) || "We recommend always using Grawizah's 'Secured Trading Service' to hold funds until delivery is verified.",
            t('foo_safety_practices_desc_2' as any) || "Do not share sensitive banking information or complete payments outside of the platform."
          ]
        },
        {
          title: t('foo_safety_report_title' as any) || "Reporting Suspicious Activity",
          content: [
            t('foo_safety_report_desc_1' as any) || "If you experience any suspicious behavior, please use the 'Report' button on any profile or listing.",
            t('foo_safety_report_desc_2' as any) || "Our Trust & Safety team will review the report and take action within 24 hours."
          ]
        }
      ]}
    />
  );
}
