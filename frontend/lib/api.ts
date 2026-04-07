import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAlertsRequest = error.config?.url?.includes('/intelligence/alerts');
    
    if (error.response?.status === 401 && !isAlertsRequest) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: { email: string; password: string; full_name: string; role: string }) =>
    api.post('/auth/register', data),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getOAuthURL: (provider: string) =>
    api.get(`/auth/oauth/url/${provider}`),
  oauthLogin: (provider: string, code: string) =>
    api.post('/auth/oauth/login', { provider, code }),
};

// Product endpoints
export const productsAPI = {
  list: (params?: { page?: number; limit?: number; category?: string; search?: string }) =>
    api.get('/products', { params }),
  get: (id: string) =>
    api.get(`/products/${id}`),
  getDetail: (id: string) =>
    api.get(`/products/${id}/detail`),
  create: (data: any) =>
    api.post('/products', data),
  update: (id: string, data: any) =>
    api.put(`/products/${id}`, data),
  delete: (id: string) =>
    api.delete(`/products/${id}`),
  getRelated: (id: string, limit?: number) =>
    api.get(`/products/${id}/related`, { params: { limit } }),
  suggestHSCode: (id: string) =>
    api.post(`/products/${id}/hs-code`),
  getCompanyProducts: (companyId: string, params?: { page?: number; limit?: number }) =>
    api.get(`/products/company/${companyId}`, { params }),
  saved: () =>
    api.get('/products/saved'),
  save: (id: string) =>
    api.post(`/products/${id}/save`),
  unsave: (id: string) =>
    api.delete(`/products/${id}/save`),
};

// Product specs & FAQ
export const productSpecsAPI = {
  list: (productId: string) =>
    api.get(`/products/specs/${productId}`),
  add: (productId: string, data: { key: string; value: string }) =>
    api.post(`/products/specs/${productId}`, data),
  delete: (productId: string, specId: string) =>
    api.delete(`/products/specs/${productId}/${specId}`),
};

export const productFAQAPI = {
  list: (productId: string) =>
    api.get(`/products/faq/${productId}`),
  add: (productId: string, data: { question: string; answer: string }) =>
    api.post(`/products/faq/${productId}`, data),
  delete: (productId: string, faqId: string) =>
    api.delete(`/products/faq/${productId}/${faqId}`),
};

// Company endpoints
export const companyAPI = {
  create: (data: any) =>
    api.post('/companies', data),
  get: (id: string) =>
    api.get(`/companies/${id}`),
  getMyCompany: () =>
    api.get('/companies/my'),
  update: (id: string, data: any) =>
    api.put(`/companies/${id}`, data),
};

// Inquiry endpoints
export const inquiryAPI = {
  list: (params?: { page?: number; limit?: number }) =>
    api.get('/inquiries', { params }),
  get: (id: string) =>
    api.get(`/inquiries/${id}`),
  create: (data: any) =>
    api.post('/inquiries', data),
  sendMessage: (id: string, message: string) =>
    api.post(`/inquiries/${id}/messages`, { message }),
  getMessages: (id: string) =>
    api.get(`/inquiries/${id}/messages`),
  close: (id: string) =>
    api.post(`/inquiries/${id}/close`),
  getWhatsAppLink: (id: string) =>
    api.get(`/inquiries/${id}/whatsapp`),
};

// AI endpoints
export const aiAPI = {
  classifyHSCode: (data: any) =>
    api.post('/ai/hs-code', data),
  checkSanction: (data: any) =>
    api.post('/ai/sanction-check', data),
  extractOCR: (data: any) =>
    api.post('/ai/ocr', data),
};

// Buyer endpoints
export const buyerAPI = {
  getProfile: () =>
    api.get('/buyer/profile'),
  createProfile: (data: any) =>
    api.post('/buyer/profile', data),
  updateProfile: (data: any) =>
    api.put('/buyer/profile', data),
  compareSuppliers: (supplierIds: string[]) =>
    api.get('/buyer/compare-suppliers', { params: { suppliers: supplierIds.join(',') } }),
};

// Buyer Intelligence (Premium)
export const intelligenceAPI = {
  getBuyerRadar: (country: string) =>
    api.get(`/intelligence/buyers/${country}`),
  getMarketInsights: (params: { category: string; country: string }) =>
    api.get('/intelligence/insights', { params }),
  getAlerts: (unreadOnly?: boolean) =>
    api.get('/intelligence/alerts', { params: { unread: unreadOnly } }),
  markAlertRead: (id: string) =>
    api.post(`/intelligence/alerts/${id}/read`),
};

// Subscription endpoints
export const subscriptionAPI = {
  get: (companyId: string) =>
    api.get('/subscription', { params: { company_id: companyId } }),
  upgrade: (companyId: string, plan: string) =>
    api.post('/subscription/upgrade', { plan }, { params: { company_id: companyId } }),
  cancel: (companyId: string) =>
    api.post('/subscription/cancel', {}, { params: { company_id: companyId } }),
};

// Dashboard endpoints
export const dashboardAPI = {
  getStats: () =>
    api.get('/dashboard/stats'),
  getRecentInquiries: () =>
    api.get('/dashboard/inquiries'),
  getTopProducts: () =>
    api.get('/dashboard/products/top'),
  getAIUsage: () =>
    api.get('/dashboard/ai-usage'),
};

// Profile endpoints
export const profileAPI = {
  get: () =>
    api.get('/profile'),
  update: (data: { full_name: string }) =>
    api.put('/profile', data),
  delete: () =>
    api.delete('/profile'),
  changePassword: (data: { old_password: string; new_password: string }) =>
    api.post('/auth/password/change', data),
  setup2FA: (enable: boolean) =>
    api.post('/auth/2fa/setup', { enable }),
  verify2FA: (code: string) =>
    api.post('/auth/2fa/verify', { code }),
};

// Document endpoints
export const documentsAPI = {
  list: () =>
    api.get('/documents/my'),
  upload: (data: { doc_type: string; file_name: string; file_url: string }) =>
    api.post('/documents/upload', data),
};

// Admin endpoints
export const adminAPI = {
  getPending: (params?: { page?: number; limit?: number }) =>
    api.get('/admin/pending', { params }),
  verifyCompany: (id: string, data: { is_approved: boolean; notes?: string }) =>
    api.post(`/admin/verify/${id}`, data),
};
