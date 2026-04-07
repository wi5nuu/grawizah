'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Card';
import { productsAPI } from '@/lib/api';

export default function DashboardProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.list({ page: 1, limit: 20 });
      if (response.data.success) {
        setProducts(response.data.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-neutral-900">Products</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Manage your product catalog</p>
        </div>
        <Button className="w-full sm:w-auto text-sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="mb-4 sm:mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 sm:py-2.5 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Products Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-neutral-600 uppercase">Product</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-neutral-600 uppercase hidden sm:table-cell">Category</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-neutral-600 uppercase">Price</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-neutral-600 uppercase hidden md:table-cell">Status</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-xs font-semibold text-neutral-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-3 sm:px-6 py-8 sm:py-12 text-center text-neutral-500 text-sm">
                    Loading...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 sm:px-6 py-8 sm:py-12 text-center text-neutral-500 text-sm">
                    No products found. Add your first product to get started.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50">
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {product.images_url?.[0] ? (
                            <img src={product.images_url[0]} alt="" className="w-full h-full object-cover rounded-lg" />
                          ) : (
                            <span className="text-sm">📦</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-neutral-900 text-xs sm:text-sm truncate max-w-[120px] sm:max-w-[200px]">{product.title}</p>
                          <p className="text-[10px] sm:text-xs text-neutral-500 line-clamp-1 hidden sm:block">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-neutral-600 hidden sm:table-cell">{product.category}</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-neutral-900 whitespace-nowrap">
                      ${product.price_min?.toLocaleString()} - ${product.price_max?.toLocaleString()}
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                      <Badge variant={product.is_active ? 'success' : 'default'} className="text-xs">
                        {product.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <button className="p-1.5 sm:p-2 hover:bg-neutral-100 rounded-lg" title="View">
                          <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-600" />
                        </button>
                        <button className="p-1.5 sm:p-2 hover:bg-neutral-100 rounded-lg" title="Edit">
                          <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-600" />
                        </button>
                        <button className="p-1.5 sm:p-2 hover:bg-red-50 rounded-lg" title="Delete">
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
