"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, Plus, Trash2, Edit2, X, Check, Filter, ExternalLink, Image as ImageIcon, Upload, RefreshCw } from 'lucide-react';
import { 
  setPersistentData, 
  getPersistentData, 
  compressImageFile, 
  freeLocalStorageQuota,
  getStoredCategoriesAsync,
  getStoredProductsAsync,
  saveStoredProducts,
  saveStoredCategories,
  purgeAllTestDataFromBrowser
} from '@/utils/storage';
import { DEFAULT_CATEGORIES as CATALOG_CATEGORIES, DEFAULT_PRODUCTS } from '@/data/catalog';

export interface Product {
  id: number | string;
  name: string;
  category: string;
  price: string;
  stock?: number;
  status?: string;
  image?: string;
}

const INITIAL_PRODUCTS: Product[] = DEFAULT_PRODUCTS.map(p => ({
  id: p.id,
  name: p.name,
  category: p.category,
  price: typeof p.price === 'string' ? p.price : `Rs. ${p.price}`,
  stock: p.stock ?? 20,
  status: p.status ?? 'Active',
  image: p.image || '/hero1.png'
}));

const DEFAULT_CATEGORIES: string[] = CATALOG_CATEGORIES.map(c => c.name);

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isPurging, setIsPurging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    customCategory: '',
    price: '',
    stock: 0,
    status: 'Active',
    image: ''
  });
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  // Refresh categories from persistent storage
  const refreshCategories = async () => {
    try {
      const catsList = await getStoredCategoriesAsync();
      const names = catsList
        .filter(c => c.status !== 'Draft')
        .map(c => c.name)
        .filter(Boolean);
      if (names.length > 0) {
        const uniqueNames = Array.from(new Set(names));
        setCategories(uniqueNames);
        return uniqueNames;
      }
    } catch (err) {
      console.warn("Failed to refresh categories:", err);
    }
    setCategories(DEFAULT_CATEGORIES);
    return DEFAULT_CATEGORIES;
  };

  const loadProductsFromStorage = async () => {
    freeLocalStorageQuota();
    try {
      const normalize = (list: any[]) =>
        list.map(p => ({
          ...p,
          price: typeof p.price === 'string' ? p.price.replace(/^\$\s*/, 'Rs. ') : `Rs. ${p.price || 0}`
        }));

      const prods = await getStoredProductsAsync();
      if (prods && Array.isArray(prods)) {
        setProducts(normalize(prods));
      }
    } catch (err) {
      console.warn("Failed to load products from storage:", err);
    }
  };

  // Load products and categories on mount & listen to changes
  useEffect(() => {
    loadProductsFromStorage();
    refreshCategories();

    // Listen to updates from other tabs or pages
    const handleCategoryUpdate = () => {
      refreshCategories();
    };

    const handleProductUpdate = () => {
      loadProductsFromStorage();
    };

    window.addEventListener('storage', handleCategoryUpdate);
    window.addEventListener('storage', handleProductUpdate);
    window.addEventListener('halo_bites_categories_updated', handleCategoryUpdate);
    window.addEventListener('halo_bites_products_updated', handleProductUpdate);

    return () => {
      window.removeEventListener('storage', handleCategoryUpdate);
      window.removeEventListener('storage', handleProductUpdate);
      window.removeEventListener('halo_bites_categories_updated', handleCategoryUpdate);
      window.removeEventListener('halo_bites_products_updated', handleProductUpdate);
    };
  }, []);

  const saveProducts = (updated: Product[]) => {
    setProducts(updated);
    saveStoredProducts(updated as any);
  };

  const handleDeleteProduct = (id: number | string, name: string) => {
    if (window.confirm(`Are you sure you want to delete product "${name}"?`)) {
      setProducts(prev => {
        const updated = prev.filter(p => String(p.id) !== String(id));
        saveStoredProducts(updated as any);
        return updated;
      });
    }
  };

  // Auto-compress uploaded device images using HTML5 Canvas to prevent QuotaExceededError
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, 600, 0.75);
        setFormData(prev => ({ ...prev, image: compressed }));
      } catch (err) {
        console.error("Product image compression error:", err);
      }
    }
  };

  const openAddModal = async () => {
    const currentCats = await refreshCategories();
    setEditingProduct(null);
    setIsCustomCategory(false);
    const initialCategory = currentCats.length > 0 ? currentCats[0] : '';
    setFormData({
      name: '',
      category: initialCategory,
      customCategory: '',
      price: '',
      stock: 0,
      status: 'Active',
      image: ''
    });
    setIsModalOpen(true);
  };

  const openEditModal = async (product: Product) => {
    const currentCats = await refreshCategories();
    setEditingProduct(product);
    setIsCustomCategory(false);

    if (product.category && !currentCats.includes(product.category)) {
      setCategories(prev => Array.from(new Set([...prev, product.category])));
    }

    setFormData({
      name: product.name,
      category: product.category || (currentCats.length > 0 ? currentCats[0] : ''),
      customCategory: '',
      price: product.price,
      stock: product.stock ?? 0,
      status: product.status ?? 'Active',
      image: product.image || ''
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = (isCustomCategory ? formData.customCategory : formData.category).trim();

    if (!formData.name.trim() || !formData.price.trim() || !finalCategory) {
      alert("Please provide a product name, category, and price.");
      return;
    }

    const finalImage = formData.image.trim() || '/hero1.png';

    // If the user typed a new custom category, register it into halo_bites_admin_categories too
    if (isCustomCategory && finalCategory) {
      try {
        const catsList = await getStoredCategoriesAsync();
        const exists = catsList.some((c: any) =>
          (typeof c === 'string' ? c : c?.name)?.toLowerCase() === finalCategory.toLowerCase()
        );
        if (!exists) {
          const newCatObj = {
            id: `CAT-${Date.now().toString().slice(-4)}`,
            name: finalCategory,
            count: 1,
            status: 'Active' as const,
            description: `Category for ${finalCategory}`,
            image: finalImage
          };
          const updatedCats = [...catsList, newCatObj];
          await saveStoredCategories(updatedCats as any);
          setCategories(prev => Array.from(new Set([...prev, finalCategory])));
        }
      } catch (err) {
        console.error(err);
      }
    }

    const rawPrice = formData.price.trim().replace(/^\$/, '').trim();
    const formattedPrice = rawPrice.startsWith('Rs') ? rawPrice : `Rs. ${rawPrice}`;

    if (editingProduct) {
      const updated = products.map(p =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: formData.name.trim(),
              category: finalCategory,
              price: formattedPrice,
              stock: Number(formData.stock) || 0,
              status: formData.status,
              image: finalImage
            }
          : p
      );
      saveProducts(updated);
    } else {
      const newProduct: Product = {
        id: Date.now(),
        name: formData.name.trim(),
        category: finalCategory,
        price: formattedPrice,
        stock: Number(formData.stock) || 0,
        status: formData.status,
        image: finalImage
      };
      // Reset filter and search so the new product is immediately visible at the top!
      setSelectedCategoryFilter('All');
      setSearchQuery('');
      // Place newly added products at the beginning of the list
      saveProducts([newProduct, ...products]);
    }

    setIsModalOpen(false);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat =
      selectedCategoryFilter === 'All' ||
      (p.category && p.category.toLowerCase() === selectedCategoryFilter.toLowerCase());
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Controls */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-white/5 backdrop-blur-md p-4 border border-white/10">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Search Input */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 py-2.5 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#E91E63] transition-colors" 
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-zinc-500 hidden sm:block" />
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="bg-black/40 border border-white/10 py-2.5 px-3 text-sm text-zinc-300 focus:outline-none focus:border-[#E91E63] transition-colors cursor-pointer"
            >
              <option value="All">All Categories ({products.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/categories"
            className="bg-white/5 border border-white/10 text-zinc-300 hover:text-white hover:bg-white/10 px-4 py-2.5 text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Categories</span>
            <ExternalLink size={14} className="opacity-70" />
          </Link>
          <button 
            onClick={openAddModal}
            className="bg-[#E91E63] text-white px-5 py-2.5 text-sm font-bold flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-colors shadow-lg shadow-[#E91E63]/20 cursor-pointer whitespace-nowrap"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* Active Filter Banner */}
      {(selectedCategoryFilter !== 'All' || searchQuery.trim() !== '') && (
        <div className="flex flex-wrap items-center justify-between gap-2 bg-[#E91E63]/10 border border-[#E91E63]/30 px-4 py-2.5 text-xs text-white">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-[#E91E63]" />
            <span>
              Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products
              {selectedCategoryFilter !== 'All' && ` in "${selectedCategoryFilter}"`}
              {searchQuery && ` matching "${searchQuery}"`}
            </span>
          </div>
          <button
            onClick={() => {
              setSelectedCategoryFilter('All');
              setSearchQuery('');
            }}
            className="underline font-bold text-[#E91E63] hover:text-white cursor-pointer transition-colors"
          >
            Clear Filters & Show All ({products.length})
          </button>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[750px]">
          <thead>
            <tr className="bg-black/20 text-xs font-bold text-zinc-500 uppercase tracking-widest">
              <th className="p-4 pl-6 border-b border-white/5">Product ({filteredProducts.length})</th>
              <th className="p-4 border-b border-white/5">Category</th>
              <th className="p-4 border-b border-white/5">Price</th>
              <th className="p-4 border-b border-white/5">Stock</th>
              <th className="p-4 border-b border-white/5">Status</th>
              <th className="p-4 pr-6 border-b border-white/5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-zinc-500 text-sm">
                  {searchQuery || selectedCategoryFilter !== 'All' ? (
                    <div>
                      <p className="mb-2">No products match your current filters.</p>
                      <button
                        onClick={() => {
                          setSelectedCategoryFilter('All');
                          setSearchQuery('');
                        }}
                        className="text-[#E91E63] underline font-bold hover:text-white cursor-pointer"
                      >
                        Click here to show all products ({products.length})
                      </button>
                    </div>
                  ) : (
                    "No products found. Click '+ Add Product' to create one."
                  )}
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-10 h-10 object-cover bg-black/40 border border-white/10 flex-shrink-0 rounded-sm"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = '/hero1.png';
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-zinc-600 flex-shrink-0 rounded-sm">
                          <ImageIcon size={16} />
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-white group-hover:text-[#E91E63] transition-colors">{product.name}</div>
                        <div className="text-[11px] text-zinc-500 font-mono">ID: #{product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-block bg-white/5 border border-white/10 px-2.5 py-1 text-xs font-semibold text-zinc-300">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-[#E91E63]">{product.price}</td>
                  <td className="p-4 text-zinc-300">{product.stock ?? 0} in stock</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border
                      ${product.status === 'Active' ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40' :
                        product.status === 'Low Stock' ? 'bg-amber-950/80 text-amber-400 border-amber-500/40' :
                        'bg-red-950/80 text-red-400 border-red-500/40'}`}>
                      {product.status || 'Active'}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(product)}
                        title="Edit Product"
                        className="p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                        title="Delete Product"
                        className="p-1.5 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#121212] border border-white/15 w-full max-w-lg p-6 shadow-2xl relative my-8">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-black mb-1">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              {editingProduct ? 'Update existing product details and image.' : 'Upload an image from your device and fill out product details below.'}
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Product Image Upload from Device */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  Product Image (From Device)
                </label>

                {formData.image ? (
                  <div className="relative w-full h-44 bg-black/60 border border-white/15 overflow-hidden group mb-2 rounded-sm flex items-center justify-center">
                    <img 
                      src={formData.image} 
                      alt="Product Preview" 
                      className="w-full h-full object-contain p-2" 
                    />
                    <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white text-black px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider hover:bg-[#E91E63] hover:text-white transition-colors cursor-pointer"
                      >
                        Change Image
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                        className="bg-red-600 text-white px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-white/20 hover:border-[#E91E63] transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer bg-white/5 hover:bg-white/10 mb-2 rounded-sm"
                  >
                    <Upload size={22} className="text-[#E91E63]" />
                    <span className="text-xs text-zinc-200 font-bold">Click to choose image from your device</span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider">PNG, JPG, WEBP, GIF (Auto-compressed)</span>
                  </div>
                )}

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  onChange={handleImageFileUpload} 
                  className="hidden" 
                />

                {/* Optional Fallback / External Image URL */}
                <input
                  type="text"
                  value={formData.image.startsWith('data:') ? '' : formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Or enter image URL (e.g. /hero1.png or https://...)"
                  className="w-full bg-black/50 border border-white/10 px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E91E63]"
                />
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Classic Chocolate Explosion"
                  className="w-full bg-black/50 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E91E63]"
                />
              </div>

              {/* Category Selection */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Category *
                  </label>
                  <Link
                    href="/admin/categories"
                    target="_blank"
                    className="text-[11px] text-[#E91E63] hover:underline flex items-center gap-1 font-semibold"
                  >
                    + Manage Categories
                  </Link>
                </div>

                {!isCustomCategory ? (
                  <div className="space-y-1.5">
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        if (e.target.value === '__NEW__') {
                          setIsCustomCategory(true);
                          setFormData({ ...formData, customCategory: '' });
                        } else {
                          setFormData({ ...formData, category: e.target.value });
                        }
                      }}
                      className="w-full bg-black/50 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E91E63]"
                    >
                      {categories.length === 0 ? (
                        <option value="">No categories available</option>
                      ) : (
                        categories.map((catName) => (
                          <option key={catName} value={catName}>
                            {catName}
                          </option>
                        ))
                      )}
                      <option value="__NEW__" className="text-[#E91E63] font-bold">
                        + Enter new category...
                      </option>
                    </select>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={formData.customCategory}
                        onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                        placeholder="Type new category name..."
                        className="flex-1 bg-black/50 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E91E63]"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomCategory(false);
                          if (!formData.category && categories.length > 0) {
                            setFormData({ ...formData, category: categories[0] });
                          }
                        }}
                        className="px-3 py-2 text-xs bg-white/10 text-zinc-300 hover:text-white hover:bg-white/20 transition-colors cursor-pointer font-semibold"
                      >
                        Choose List
                      </button>
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      This will also add the new category to your Categories list.
                    </p>
                  </div>
                )}
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">Price *</label>
                  <input
                    type="text"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 35.00"
                    className="w-full bg-black/50 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E91E63]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">In Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full bg-black/50 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E91E63]"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E91E63]"
                >
                  <option value="Active">Active</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-[#E91E63] text-white px-5 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors cursor-pointer"
                >
                  <Check size={14} /> {editingProduct ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
