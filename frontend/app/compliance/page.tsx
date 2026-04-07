'use client';

import React from 'react';
import AIFeatureTemplate from '@/components/templates/AIFeatureTemplate';
import { Gavel } from 'lucide-react';

export default function ComplianceSuitePage() {
  return (
    <AIFeatureTemplate
      titleKey="footer_compliance"
      descKey="hub_radar_desc"
      icon={Gavel}
      accentColor="accent"
      benefitsKey="hub_compliance_benefits"
      howItWorks={[
        { stepKey: "Regulatory Database Check", descKey: "Monitors the latest WTO and country-specific trade regulations." },
        { stepKey: "Risk Scoring Entity", descKey: "Builds a trust profile of your partners based on their past compliance." },
        { stepKey: "Auto-Drafting Contracts", descKey: "Uses secure, legally-vetted templates for your trade agreements." }
      ]}
    />
  );
}
