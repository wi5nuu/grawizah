'use client';

import React from 'react';
import InfoPageTemplate from '@/components/templates/InfoPageTemplate';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CookiesPage() {
  const { t } = useLanguage();

  return (
    <InfoPageTemplate
      titleKey="footer_cookie_policy"
      icon="legal"
      sections={[
        {
          title: t('foo_cookie_intro_title' as any) || "Introduction",
          content: [
            t('foo_cookie_intro_desc_1' as any) || "We use cookies and similar technologies to provide our Website and Services and to improve your browsing experience.",
            t('foo_cookie_intro_desc_2' as any) || "This Cookie Policy explains how we use these technologies to support Grawizah's global B2B trade platform."
          ]
        },
        {
          title: t('foo_cookie_definition_title' as any) || "What are Cookies?",
          content: [
            t('foo_cookie_definition_desc_1' as any) || "Cookies are small text files that are stored on your device by your browser to remember your unique preferences and interactions.",
            t('foo_cookie_definition_desc_2' as any) || "Some are 'Strictly Necessary' for the platform to function (e.g. login tokens). Others are used for Analytics and Marketing."
          ]
        },
        {
          title: t('foo_cookie_choices_title' as any) || "Your Choices",
          content: [
            t('foo_cookie_choices_desc_1' as any) || "You can choose to disable all but 'Strictly Necessary' cookies in your browser settings.",
            t('foo_cookie_choices_desc_2' as any) || "Disabling some cookies may affect the performance and personalization of your Grawizah dashboard."
          ]
        }
      ]}
    />
  );
}
