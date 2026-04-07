'use client';

import React from 'react';
import AIFeatureTemplate from '@/components/templates/AIFeatureTemplate';
import { BarChart3 } from 'lucide-react';

export default function BuyerRadarPage() {
  return (
    <AIFeatureTemplate
      titleKey="hub_radar_title"
      descKey="hub_radar_desc"
      icon={BarChart3}
      accentColor="green"
      benefitsKey="hub_radar_benefits"
      howItWorks={[
        { stepKey: "Data Aggregation", descKey: "Collects insights from 120M+ global shipping records and search behaviors." },
        { stepKey: "AI Buyer Persona", descKey: "Builds a profile of their typical order volume, frequency, and seasonality." },
        { stepKey: "Lead Score Rating", descKey: "Ranks prospects based on their likelihood to switch suppliers or expand." }
      ]}
    />
  );
}
