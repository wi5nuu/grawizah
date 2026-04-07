'use client';

import React from 'react';
import AIFeatureTemplate from '@/components/templates/AIFeatureTemplate';
import { Shield } from 'lucide-react';

export default function SanctionScreeningPage() {
  return (
    <AIFeatureTemplate
      titleKey="hub_sanction_title"
      descKey="hub_sanction_desc"
      icon={Shield}
      accentColor="red"
      benefitsKey="hub_sanction_benefits"
      howItWorks={[
        { stepKey: "Global Blacklist Search", descKey: "Cross-checks partners and companies against official global sanction lists." },
        { stepKey: "UBO Analysis", descKey: "Identifies the actual Ultimate Beneficial Owner to detect hidden risks." },
        { stepKey: "Compliance Report", descKey: "Generates an evidentiary audit log to demonstrate AML/KYC diligence." }
      ]}
    />
  );
}
