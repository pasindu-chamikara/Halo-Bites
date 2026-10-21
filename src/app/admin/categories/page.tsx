"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, X, Check, Upload, Image as ImageIcon } from 'lucide-react';
import { 
  compressImageFile, 
  getStoredCategoriesAsync, 
  saveStoredCategories, 
  getStoredProductsAsync 
} from '@/utils/storage';
import { DEFAULT_CATEGORIES, CategoryItem } from '@/data/catalog';

interface Category {
  id: string;
  name: string;
  count?: number;
  status: 'Active' | 'Draft';
  description: string;
  image?: string;
}

const INITIAL_CATEGORIES: Category[] = DEFAULT_CATEGORIES.map(c => ({
  id: c.id,
  name: c.name,
  count: c.count ?? 10,
  status: (c.status as 'Active' | 'Draft') || 'Active',
  description: c.description,
  image: c.image || '/hero1.png'
}));

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Active' as 'Active' | 'Draft',
    image: ''
  });

  const [products, setProducts] = useState<any[]>([]);

  // Load persisted categories and products
  useEffect(() => {
    const loadCategoriesData = async () => {
      try {
        const [savedCats, savedProds] = await Promise.all([
          getStoredCategoriesAsync(),
          getStoredProductsAsync()
        ]);
        if (savedCats && Array.isArray(savedCats)) {
          setCategories(savedCats as any);
        }
        if (savedProds && Array.isArray(savedProds)) {
          setProducts(savedProds);
        }
      } catch (err) {
        console.warn('Error loading categories data:', err);
      }
    };

    loadCategoriesData();

    const handleUpdate = () => {
      loadCategoriesData();
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('halo_bites_products_updated', handleUpdate);
    window.addEventListener('halo_bites_categories_updated', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('halo_bites_products_updated', handleUpdate);
      window.removeEventListener('halo_bites_categories_updated', handleUpdate);
    };
  }, []);

  const saveCategories = (updated: Category[]) => {
    setCategories(updated);
    saveStoredCategories(updated as any);
  };

  const getCategoryProductCount = (cat: Category) => {
    if (products.length > 0) {
      return products.filter(
        (p) => p.category?.trim().toLowerCase() === cat.name?.trim().toLowerCase()
      ).length;
    }
    return cat.count || 0;
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      const filtered = categories.filter((c) => c.id !== id);
      saveCategories(filtered);
    }
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', status: 'Active', image: '' });
    setIsAddModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      description: cat.description,
      status: cat.status,
      image: cat.image || ''
    });
    setIsAddModalOpen(true);
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImageFile(file, 600, 0.75);
        setFormData((prev) => ({ ...prev, image: compressed }));
      } catch (err) {
        console.error("Category image compression error:", err);
      }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingCategory) {
      const updated = categories.map((cat) =>
        cat.id === editingCategory.id
          ? { 
              ...cat, 
              name: formData.name.trim(),
              description: formData.description.trim(),
              status: formData.status,
              image: formData.image || cat.image || '/hero1.png'
            }
          : cat
      );
      saveCategories(updated);
    } else {
      const newCategory: Category = {
        id: `CAT-${Date.now().toString().slice(-4)}`,
        name: formData.name.trim(),
        description: formData.description.trim() || 'No description provided.',
        status: formData.status,
        count: 0,
        image: formData.image || '/hero1.png'
      };
      saveCategories([...categories, newCategory]);
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Product Categories</h2>
          <p className="text-sm text-zinc-400">Manage, organize, and edit cake and dessert categories.</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-[#E91E63] text-white px-5 py-3 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors shadow-lg shadow-[#E91E63]/20 cursor-pointer"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Categories List */}
      {categories.length === 0 ? (
        <div className="bg-white/5 border border-white/10 p-12 text-center">
          <p className="text-zinc-400 mb-4">No categories found.</p>
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 bg-[#E91E63] text-white px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors"
          >
            <Plus size={14} /> Create One Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#E91E63]/50 transition-colors group relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Category Image Banner */}
                <div className="relative w-full h-48 bg-black/60 overflow-hidden border-b border-white/10">
                  {cat.image ? (
                    <img 
                      src={cat.image} 
                      alt={cat.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 gap-2">
                      <ImageIcon size={32} />
                      <span className="text-xs uppercase tracking-widest font-bold">No Image</span>
                    </div>
                  )}

                  {/* Gradient shadow for text/buttons */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest border backdrop-blur-md
                      ${cat.status === 'Active' ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50' : 'bg-zinc-900/80 text-zinc-400 border-zinc-600'}`}>
                      {cat.status}
                    </span>
                  </div>

                  {/* Actions (Edit & Delete) */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button
                      onClick={() => openEditModal(cat)}
                      title="Edit Category"
                      className="bg-black/60 p-2 text-zinc-300 hover:text-white transition-colors backdrop-blur-md cursor-pointer hover:bg-black/80 border border-white/10"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      title="Delete Category"
                      className="bg-black/60 p-2 text-zinc-300 hover:text-red-500 transition-colors backdrop-blur-md cursor-pointer hover:bg-black/80 border border-white/10"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-black mb-2">{cat.name}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Products</span>
                <span className="font-black text-[#E91E63]">{getCategoryProductCount(cat)} items</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#121212] border border-white/15 w-full max-w-md p-6 shadow-2xl relative my-8">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-black mb-1">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            <p className="text-xs text-zinc-400 mb-6">
              {editingCategory ? 'Update existing category details and image.' : 'Fill out the details and upload an image for the category.'}
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Category Image Upload / Preview */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
                  Category Image
                </label>
                
                {formData.image ? (
                  <div className="relative w-full h-40 bg-black/50 border border-white/15 overflow-hidden group mb-2">
                    <img 
                      src={formData.image} 
                      alt="Category Preview" 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white text-black px-3 py-1.5 text-xs font-bold uppercase tracking-wider hover:bg-[#E91E63] hover:text-white transition-colors"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, image: '' }))}
                        className="bg-red-600 text-white px-3 py-1.5 text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-32 border-2 border-dashed border-white/20 hover:border-[#E91E63] transition-colors flex flex-col items-center justify-center gap-2 cursor-pointer bg-white/5 hover:bg-white/10 mb-2"
                  >
                    <Upload size={20} className="text-zinc-400" />
                    <span className="text-xs text-zinc-300 font-semibold">Click to upload category image</span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider">PNG, JPG, WEBP (Max 3MB)</span>
                  </div>
                )}

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  onChange={handleImageFileUpload} 
                  className="hidden" 
                />

                {/* Direct Image URL input as alternative */}
                <input
                  type="text"
                  value={formData.image.startsWith('data:') ? '' : formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="Or paste image URL (e.g. /hero1.png or https://...)"
                  className="w-full bg-black/50 border border-white/10 px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E91E63]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Signature Cakes"
                  className="w-full bg-black/50 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E91E63]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description about items in this category"
                  className="w-full bg-black/50 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E91E63]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Draft' })}
                  className="w-full bg-black/50 border border-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E91E63]"
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-[#E91E63] text-white px-5 py-2 text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors cursor-pointer"
                >
                  <Check size={14} /> {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
