'use client';

import React from 'react';
import AIFeatureTemplate from '@/components/templates/AIFeatureTemplate';
import { LineChart } from 'lucide-react';

export default function MarketInsightsPage() {
  return (
    <AIFeatureTemplate
      titleKey="footer_market_insights"
      descKey="hub_radar_desc"
      icon={LineChart}
      accentColor="primary"
      benefitsKey="hub_insights_benefits"
      howItWorks={[
        { stepKey: "Economic Forecasting", descKey: "Our AI models project demand shifts based on macro-economic indicators." },
        { stepKey: "Supply Source Mapping", descKey: "Identify top exporting countries and their key manufacturing clusters." },
        { stepKey: "Risk Assessment", descKey: "Monitors geopolitical events and port delays impacting your routes." }
      ]}
    />
  );
}
