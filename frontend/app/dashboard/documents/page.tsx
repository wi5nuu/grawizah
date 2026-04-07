'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, Badge } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ShieldCheck,
  Download,
  Info,
  Loader2,
  RefreshCw,
  Plus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { documentsAPI } from '@/lib/api';

interface DocumentRecord {
  id: string;
  doc_type: string;
  file_name: string;
  file_url: string;
  status: string;
  updated_at: string;
}

export default function DocumentVaultPage() {
  const { user, role } = useAuth();
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeDocType, setActiveDocType] = useState<string | null>(null);

  const isBuyer = role === 'buyer';

  const docConfig = isBuyer ? [
    {
      id: 'invoice',
      name: 'Proforma Invoice / Commercial Invoice',
      description: 'Draft or final invoice sent by the seller for AI validation.'
    },
    {
      id: 'bill_of_lading',
      name: 'Bill of Lading (B/L)',
      description: 'The official shipping document required for international trade.'
    },
    {
      id: 'packing_list',
      name: 'Packing List',
      description: 'Detailed list of items in the shipment for customs clearance.'
    }
  ] : [
    {
      id: 'nib',
      name: 'NIB (Business Identification Number)',
      description: 'Mandatory for business verification and export-import activities.'
    },
    {
      id: 'tax_id',
      name: 'Tax ID (NPWP)',
      description: 'Legal tax identification for your business entity.'
    },
    {
      id: 'business_permit',
      name: 'Business Permit (SIUP)',
      description: 'Standard operational permit for trading companies.'
    }
  ];

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const response = await documentsAPI.list();
      setDocuments(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [role]); // Refresh if role changes

  const getDocStatus = (type: string) => {
    const doc = documents.find(d => d.doc_type === type);
    return doc || { status: 'missing', file_name: null, updated_at: null, id: null, file_url: null };
  };

  const handleUploadClick = (type: string) => {
    setActiveDocType(type);
    fileInputRef.current?.click();
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeDocType) return;

    setUploading(activeDocType);
    try {
      // Simulate real upload delay and path
      await documentsAPI.upload({
        doc_type: activeDocType,
        file_name: file.name,
        file_url: `https://grawizah.storage/uploads/${file.name}`
      });
      await fetchDocs();
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(null);
      setActiveDocType(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="verified" className="bg-green-100 text-green-700 border-green-200">Verified</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Pending Review</Badge>;
      case 'missing':
        return <Badge className="bg-neutral-100 text-neutral-500 border-neutral-200">Action Required</Badge>;
      default:
        return null;
    }
  };

  const verifiedCount = documents.filter(d => d.status === 'verified').length;
  const pendingCount = documents.filter(d => d.status === 'pending').length;
  const totalUploaded = verifiedCount + pendingCount;
  const progressPercent = Math.round((totalUploaded / 3) * 100);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        onChange={onFileChange} 
        accept=".pdf,.jpg,.png"
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-primary-600" />
            Document Vault
          </h1>
          <p className="text-neutral-500 mt-1">Manage your legal and compliance documents for platform verification.</p>
        </div>
        
        <div className="bg-primary-50 border border-primary-100 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
            {progressPercent}%
          </div>
          <div>
            <p className="text-xs font-semibold text-primary-900">Verification Progress</p>
            <p className="text-[10px] text-primary-700">
              {3 - totalUploaded} document{3 - totalUploaded !== 1 ? 's' : ''} remaining for full verified status
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Compliance Alert */}
        {totalUploaded < 3 && (
          <Card className="bg-amber-50 border-amber-200 p-4 flex gap-4">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 flex-shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-amber-900 text-sm">
                {isBuyer ? 'Validate Your Trade Documents' : 'Complete Your Verification'}
              </h3>
              <p className="text-xs text-amber-800 mt-1 mb-3 leading-relaxed">
                {isBuyer 
                  ? 'To ensure safe international trade, please upload your Invoice or Bill of Lading for our AI compliance check.' 
                  : 'To unlock full trader features like "Unlimited Sourcing Requests" and "Buyer Radar", please upload your missing documents.'}
              </p>
              <Button 
                size="sm" 
                className="bg-amber-600 hover:bg-amber-700 text-white border-0 text-xs h-8"
                onClick={() => handleUploadClick(docConfig.find(d => getDocStatus(d.id).status === 'missing')?.id || 'nib')}
              >
                Update Missing Documents
              </Button>
            </div>
          </Card>
        )}

        {/* Document List */}
        <div className="grid gap-4">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-primary-600 mb-4" />
              <p className="text-neutral-500 text-sm font-medium">Loading Vault...</p>
            </div>
          ) : (
            docConfig.map((config) => {
              const doc = getDocStatus(config.id);
              const isUploading = uploading === config.id;

              return (
                <Card key={config.id} className={`p-4 sm:p-6 hover:shadow-md transition-shadow border-neutral-200 ${isUploading ? 'opacity-60 pointer-events-none' : ''}`}>
                  <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="flex gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        doc.status === 'verified' ? 'bg-green-50 text-green-600' : 
                        doc.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-neutral-50 text-neutral-400'
                      }`}>
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-bold text-neutral-900">{config.name}</h3>
                          {getStatusBadge(doc.status)}
                        </div>
                        <p className="text-xs text-neutral-500 mb-2 max-w-md">{config.description}</p>
                        
                        {doc.file_name && (
                          <div className="flex items-center gap-2 text-xs text-primary-600 font-medium">
                            <CheckCircle className="w-3 h-3" />
                            {doc.file_name}
                            <span className="text-neutral-400 font-normal">
                              ({doc.updated_at ? new Date(doc.updated_at).toLocaleDateString() : 'Just now'})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-center gap-2">
                      {isUploading ? (
                        <div className="flex items-center gap-2 text-primary-600 font-black text-[10px]">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> UPLOADING...
                        </div>
                      ) : doc.status === 'missing' ? (
                        <Button 
                          variant="outline" 
                          className="text-xs h-9 border-dashed border-2 hover:border-primary-600 hover:bg-primary-50 px-4"
                          onClick={() => handleUploadClick(config.id)}
                        >
                          <Plus className="w-3.5 h-3.5 mr-2" /> Upload PDF
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-9 w-9 text-neutral-500 hover:text-primary-600"
                            onClick={() => {
                              const docStatus = getDocStatus(config.id);
                              if ('file_url' in docStatus && docStatus.file_url) {
                                window.open(docStatus.file_url, '_blank');
                              }
                            }}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            className="text-xs h-9 px-4 hover:bg-neutral-50"
                            onClick={() => handleUploadClick(config.id)}
                          >
                            <RefreshCw className="w-3 h-3 mr-2" /> Replace
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>

        {/* Security Notice */}
        <div className="mt-8 pt-6 border-t border-neutral-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center text-neutral-500 flex-shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-neutral-900 text-sm">Security & Privacy</h4>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Your documents are encrypted and stored securely. They are only used for verification purposes by Grawizah compliance administrators. By uploading documents, you agree to our verification terms and data privacy policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
