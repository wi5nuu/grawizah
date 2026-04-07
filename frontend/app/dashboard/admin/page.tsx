'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Clock, 
  Building2, 
  Search, 
  CheckCircle, 
  XCircle, 
  FileText,
  Filter,
  MoreVertical,
  ExternalLink
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Company {
  id: string;
  company_name: string;
  tax_id: string;
  country: string;
  is_verified: boolean;
  created_at: string;
  owner_email: string;
}

export default function AdminDashboardPage() {
  const { role, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: 'c1',
      company_name: 'PT Sinergi Jaya Export',
      tax_id: '9120101234567',
      country: 'Indonesia',
      is_verified: false,
      created_at: '2026-04-05T10:00:00Z',
      owner_email: 'budi@sinergijaya.id'
    },
    {
      id: 'c2',
      company_name: 'Guangzhou Tech Trading',
      tax_id: 'CN-882199201',
      country: 'China',
      is_verified: false,
      created_at: '2026-04-06T08:30:00Z',
      owner_email: 'chen@gztech.cn'
    },
    {
      id: 'c3',
      company_name: 'Vietnam Rubber Corp',
      tax_id: 'VN-TAX-5512',
      country: 'Vietnam',
      is_verified: true,
      created_at: '2026-04-01T14:15:00Z',
      owner_email: 'nguyen@vnrubber.vn'
    }
  ]);

  useEffect(() => {
    if (!authLoading && role !== 'admin') {
      router.push('/dashboard');
    }
  }, [role, authLoading, router]);

  const handleVerify = (id: string, status: boolean) => {
    setCompanies(prev => prev.map(c => 
      c.id === id ? { ...c, is_verified: status } : c
    ));
  };

  if (authLoading || role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const pendingCount = companies.filter(c => !c.is_verified).length;
  const verifiedCount = companies.filter(c => c.is_verified).length;

  return (
    <div className="space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 flex items-center gap-3">
            Admin Control Center
            <ShieldCheck className="w-8 h-8 text-primary-600" />
          </h1>
          <p className="text-neutral-500 mt-1 font-medium">Manage global trade entities and verification status</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white hover:bg-neutral-50 transition-colors shadow-sm">
            <FileText className="w-4 h-4 mr-2" /> Global Trade Logs
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6 bg-white border border-neutral-200 border-l-4 border-l-primary-500 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <Building2 className="w-5 h-5 text-neutral-400" />
            <Badge variant="default" className="text-[10px] uppercase font-bold tracking-wider">Lifetime</Badge>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-neutral-900 leading-none mb-1">{companies.length}</p>
          <p className="text-sm font-medium text-neutral-500">Total Companies</p>
        </Card>
        <Card className="p-4 sm:p-6 bg-white border border-neutral-200 border-l-4 border-l-yellow-500 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            <Badge className="text-[10px] uppercase font-bold tracking-wider bg-yellow-100 text-yellow-700 border-yellow-200">Attention Required</Badge>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-neutral-900 leading-none mb-1">{pendingCount}</p>
          <p className="text-sm font-medium text-neutral-500">Pending Verification</p>
        </Card>
        <Card className="p-4 sm:p-6 bg-white border border-neutral-200 border-l-4 border-l-green-500 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <Badge className="text-[10px] uppercase font-bold tracking-wider bg-green-100 text-green-700 border-green-200">Verified</Badge>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-neutral-900 leading-none mb-1">{verifiedCount}</p>
          <p className="text-sm font-medium text-neutral-500">Active Verified Entities</p>
        </Card>
      </div>

      {/* Main Table */}
      <Card className="overflow-hidden shadow-sm border border-neutral-200 bg-white">
        <div className="p-4 border-b border-neutral-100 flex flex-wrap items-center justify-between gap-4 bg-neutral-50/50">
          <h3 className="font-bold text-neutral-800 text-sm sm:text-base">Entity KYB List (NIB/Tax Review)</h3>
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <div className="relative flex-1 sm:flex-none min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input 
                type="text" 
                placeholder="Search NIB or Company..." 
                className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white transition-all"
              />
            </div>
            <Button variant="outline" size="sm" className="bg-white text-xs">
              <Filter className="w-4 h-4 mr-2" /> Sort
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-neutral-50/80 text-neutral-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest border-b border-neutral-100">
              <tr>
                <th className="px-6 py-4">Company & Country</th>
                <th className="px-6 py-4">NIB / Tax ID</th>
                <th className="px-6 py-4">Owner Email</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Submitted</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {companies.map((co) => (
                <tr key={co.id} className="hover:bg-neutral-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg shadow-inner">
                        {co.company_name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-neutral-900 text-sm leading-tight group-hover:text-primary-700 transition-colors">{co.company_name}</p>
                        <p className="text-[10px] sm:text-xs font-medium text-neutral-500 mt-1 uppercase tracking-wider">{co.country}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-[10px] sm:text-xs bg-neutral-100 px-2 py-1 rounded font-mono text-neutral-700 font-bold border border-neutral-200">{co.tax_id}</code>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600 font-medium">
                    {co.owner_email}
                  </td>
                  <td className="px-6 py-4">
                    {co.is_verified ? (
                      <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px] py-1 px-2.5 font-bold uppercase tracking-wider">
                        <CheckCircle className="w-3 h-3 mr-1" /> Verified
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-[10px] py-1 px-2.5 font-bold uppercase tracking-wider">
                        <Clock className="w-3 h-3 mr-1" /> Pending Review
                      </Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-[10px] sm:text-xs font-semibold text-neutral-500">
                    {new Date(co.created_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-right">
                      {!co.is_verified ? (
                        <>
                          <Button 
                            size="sm" 
                            className="bg-primary-600 hover:bg-primary-700 h-8 text-[10px] px-3 font-bold uppercase tracking-wider shadow-sm"
                            onClick={() => handleVerify(co.id, true)}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 text-[10px] px-3 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 font-bold uppercase tracking-wider"
                            onClick={() => handleVerify(co.id, false)}
                          >
                            Reject
                          </Button>
                        </>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-8 text-[10px] font-bold text-neutral-500 hover:text-primary-600 hover:bg-primary-50 px-2"
                          onClick={() => window.open(`/suppliers/profile/${co.id}`, '_blank')}
                        >
                          <ExternalLink className="w-3.5 h-3.5 mr-1" /> View Profile
                        </Button>
                      )}
                      <button className="p-1 text-neutral-400 hover:text-neutral-600 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Admin Logic Info */}
      <div className="bg-neutral-900 rounded-2xl p-6 sm:p-8 border border-neutral-800 text-white shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
          <ShieldAlert className="w-32 h-32" />
        </div>
        <div className="relative z-10 flex gap-6 items-start">
          <div className="p-3 rounded-xl bg-primary-500/20 border border-primary-500/30">
            <ShieldAlert className="w-6 h-6 text-primary-400" />
          </div>
          <div>
            <h4 className="font-bold text-white text-lg mb-2">Administrative Control Guidelines v1.0</h4>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-3xl">
              Verification is a critical step in maintaining the <strong>Intelligence Integrity</strong> of the Grawizah platform. 
              Before approving, ensure that the <strong>NIB (Nomor Induk Berusaha)</strong> matches the company records in the 
              official ministry registry. Verified entities are granted superior visibility in the global directory 
              and full access to the B2B trader bridge.
            </p>
            <div className="flex gap-4 mt-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary-400">
                <ShieldCheck className="w-4 h-4" /> Secure Logic
              </div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500 underline decoration-neutral-700 underline-offset-4 cursor-pointer hover:text-white transition-colors">
                View Documentation
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
