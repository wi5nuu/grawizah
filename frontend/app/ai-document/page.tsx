'use client';

import React from 'react';
import AIFeatureTemplate from '@/components/templates/AIFeatureTemplate';
import { FileText } from 'lucide-react';

export default function AIDocumentPage() {
  return (
    <AIFeatureTemplate
      titleKey="hub_doc_title"
      descKey="hub_doc_desc"
      icon={FileText}
      accentColor="primary"
      benefitsKey="hub_doc_benefits"
      howItWorks={[
        { stepKey: "Upload Document", descKey: "Upload your physical trade documents (Invoice, BL, KYC) in PDF or Image format." },
        { stepKey: "AI Analysis", descKey: "Our Groq-powered AI instantly extracts all relevant data fields with high precision." },
        { stepKey: "Digital Integration", descKey: "The extracted data is automatically converted into actionable digital formats for your ERP." }
      ]}
    />
  );
}
