'use client';

import React from 'react';
import AIFeatureTemplate from '@/components/templates/AIFeatureTemplate';
import { Zap } from 'lucide-react';

export default function HSCodePage() {
  return (
    <AIFeatureTemplate
      titleKey="hub_hs_title"
      descKey="hub_hs_desc"
      icon={Zap}
      accentColor="accent"
      benefitsKey="hub_hs_benefits"
      howItWorks={[
        { stepKey: "Product Description", descKey: "Our AI analyzes descriptions and technical specs to identify the correct category." },
        { stepKey: "Global HS Mapping", descKey: "Cross-checks against WCO 2022+ standards to find the accurate 6-10 digit code." },
        { stepKey: "Duty Estimation", descKey: "Provides initial estimates for duties and taxes based on the identified HS Code." }
      ]}
    />
  );
}
