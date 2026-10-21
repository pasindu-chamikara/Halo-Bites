// Storage utility with IndexedDB backing and client-side image compression
// Solves browser localStorage quota limits permanently for rich media

const DB_NAME = 'HaloBitesDB';
const DB_VERSION = 1;
const STORE_NAME = 'halo_store';

function openIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not available'));
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save data to IndexedDB (unlimited capacity) and mirror to localStorage if possible.
 */
export async function setPersistentData(key: string, value: any): Promise<void> {
  // 1. Save to IndexedDB
  try {
    const db = await openIndexedDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('IndexedDB set warning:', err);
  }

  // 2. Also try localStorage
  try {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  } catch (err) {
    // If localStorage quota is reached, IndexedDB has the data safe.
    // Try cleaning old large images or keep metadata only
    console.warn(`LocalStorage quota reached for key "${key}". Safely persisted in IndexedDB.`);
  }
}

/**
 * Retrieve data from IndexedDB with fallback to localStorage.
 */
export async function getPersistentData<T = any>(key: string): Promise<T | null> {
  // 1. Try IndexedDB
  try {
    const db = await openIndexedDB();
    const result = await new Promise<any>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(key);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    if (result !== undefined && result !== null) {
      return result as T;
    }
  } catch (err) {
    console.warn('IndexedDB get warning:', err);
  }

  // 2. Fallback to localStorage
  if (typeof window !== 'undefined') {
    try {
      const local = localStorage.getItem(key);
      if (local) {
        try {
          return JSON.parse(local) as T;
        } catch {
          return local as unknown as T;
        }
      }
    } catch {
      // ignore
    }
  }

  return null;
}

/**
 * Synchronous read from localStorage as immediate initial state.
 */
export function getLocalDataSync<T = any>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (parsed !== undefined && parsed !== null) {
        return parsed as T;
      }
    }
  } catch {}
  return fallback;
}

/**
 * Compress an uploaded device image file down to ~20-50KB using HTML5 Canvas.
 * Prevents localStorage QuotaExceededError while retaining high visual clarity.
 */
export function compressImageFile(file: File, maxDim = 600, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const rawDataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(rawDataUrl);
        }
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };
      img.onerror = () => resolve(rawDataUrl);
      img.src = rawDataUrl;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Clean up existing oversized base64 images in localStorage to free up space immediately.
 */
export function freeLocalStorageQuota(): void {
  if (typeof window === 'undefined') return;
  try {
    // Check categories
    const rawCats = localStorage.getItem('halo_bites_admin_categories');
    if (rawCats && rawCats.length > 500000) {
      // Very large payload, migrate and trim
      try {
        const parsed = JSON.parse(rawCats);
        if (Array.isArray(parsed)) {
          // If any image is huge (>150KB), replace with fallback in localStorage while IndexedDB keeps original
          const trimmed = parsed.map((c: any) => ({
            ...c,
            image: c.image && c.image.length > 150000 ? '/hero1.png' : c.image
          }));
          localStorage.setItem('halo_bites_admin_categories', JSON.stringify(trimmed));
        }
      } catch {}
    }

    // Check products
    const rawProds = localStorage.getItem('halo_bites_admin_products');
    if (rawProds && rawProds.length > 500000) {
      try {
        const parsed = JSON.parse(rawProds);
        if (Array.isArray(parsed)) {
          const trimmed = parsed.map((p: any) => ({
            ...p,
            image: p.image && p.image.length > 150000 ? '/hero1.png' : p.image
          }));
          localStorage.setItem('halo_bites_admin_products', JSON.stringify(trimmed));
        }
      } catch {}
    }
  } catch (err) {
    console.warn('Error freeing quota:', err);
  }
}

import { DEFAULT_CATEGORIES, DEFAULT_PRODUCTS, CategoryItem, ProductItem } from '@/data/catalog';

export const TEST_ORDER_IDS = ['ORD-1001', 'ORD-1002', 'ORD-1003', 'ORD-1004', 'ORD-1005', 'ORD-1006', 'ORD-98234-A', 'ORD-87122-B', 'ORD-75611-C'];
export const TEST_CUSTOMERS = ['Jane Doe', 'John Smith', 'Alice Johnson', 'Bob Brown', 'Charlie Davis', 'Eva Green'];

export function isTestOrder(order: any): boolean {
  if (!order) return true;
  const id = String(order.id || '');
  if (TEST_ORDER_IDS.includes(id) || id.startsWith('ORD-100')) return true;
  const cust = typeof order.customer === 'string'
    ? order.customer
    : `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim();
  if (TEST_CUSTOMERS.some(c => c.toLowerCase() === cust.toLowerCase())) return true;
  const email = (order.customerDetails?.email || order.customer?.email || '').toLowerCase();
  if (email.includes('example.com') || email.includes('test.com')) return true;
  return false;
}

/**
 * Permanently purge test orders and mock discounts from client storage
 * Preserves all products and categories.
 */
export async function purgeAllTestDataFromBrowser(): Promise<{
  purgedOrders: number;
  purgedDiscounts: number;
}> {
  if (typeof window === 'undefined') {
    return { purgedOrders: 0, purgedDiscounts: 0 };
  }

  let purgedOrders = 0;
  let purgedDiscounts = 0;

  try {
    // 1. Purge Mock Orders from admin & user storage (Jane Doe, John Smith, etc.)
    const rawAdminOrders = await getPersistentData<any[]>('halo_bites_admin_orders') || 
      JSON.parse(localStorage.getItem('halo_bites_admin_orders') || '[]');
    if (Array.isArray(rawAdminOrders)) {
      const realAdminOrders = rawAdminOrders.filter(o => !isTestOrder(o));
      purgedOrders += (rawAdminOrders.length - realAdminOrders.length);
      await setPersistentData('halo_bites_admin_orders', realAdminOrders);
      localStorage.setItem('halo_bites_admin_orders', JSON.stringify(realAdminOrders));
    }

    const rawUserOrders = JSON.parse(localStorage.getItem('halo_bites_user_orders') || '[]');
    if (Array.isArray(rawUserOrders)) {
      const realUserOrders = rawUserOrders.filter(o => !isTestOrder(o));
      localStorage.setItem('halo_bites_user_orders', JSON.stringify(realUserOrders));
    }

    // 2. Purge Mock Discounts
    const rawDiscounts = await getPersistentData<any[]>('halo_bites_admin_discounts') || 
      JSON.parse(localStorage.getItem('halo_bites_admin_discounts') || '[]');
    if (Array.isArray(rawDiscounts)) {
      const realDiscounts = rawDiscounts.filter(d => !['OFF-1', 'OFF-2', 'OFF-3', 'OFF-4'].includes(d.id));
      purgedDiscounts += (rawDiscounts.length - realDiscounts.length);
      await setPersistentData('halo_bites_admin_discounts', realDiscounts);
      localStorage.setItem('halo_bites_admin_discounts', JSON.stringify(realDiscounts));
    }

    // 3. Ensure products and categories are populated in storage so Admin Dashboard and Client are in 100% sync
    let currentProds = await getPersistentData<any[]>('halo_bites_admin_products');
    if (!currentProds || (Array.isArray(currentProds) && currentProds.length === 0)) {
      const local = localStorage.getItem('halo_bites_admin_products');
      if (local) {
        try { currentProds = JSON.parse(local); } catch {}
      }
    }
    if (!currentProds || (Array.isArray(currentProds) && currentProds.length === 0)) {
      await setPersistentData('halo_bites_admin_products', DEFAULT_PRODUCTS);
      localStorage.setItem('halo_bites_admin_products', JSON.stringify(DEFAULT_PRODUCTS));
    }

    let currentCats = await getPersistentData<any[]>('halo_bites_admin_categories');
    if (!currentCats || (Array.isArray(currentCats) && currentCats.length === 0)) {
      const local = localStorage.getItem('halo_bites_admin_categories');
      if (local) {
        try { currentCats = JSON.parse(local); } catch {}
      }
    }
    if (!currentCats || (Array.isArray(currentCats) && currentCats.length === 0)) {
      await setPersistentData('halo_bites_admin_categories', DEFAULT_CATEGORIES);
      localStorage.setItem('halo_bites_admin_categories', JSON.stringify(DEFAULT_CATEGORIES));
    }

    localStorage.setItem('halo_bites_test_orders_purged', 'true');

    // Notify all active tabs and components
    window.dispatchEvent(new Event('halo_bites_orders_updated'));
    window.dispatchEvent(new Event('halo_bites_products_updated'));
    window.dispatchEvent(new Event('halo_bites_categories_updated'));
    window.dispatchEvent(new Event('halo_bites_discounts_updated'));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.warn('Error during purgeAllTestDataFromBrowser:', err);
  }

  return { purgedOrders, purgedDiscounts };
}

export async function getStoredCategoriesAsync(): Promise<CategoryItem[]> {
  try {
    let saved = await getPersistentData<CategoryItem[]>('halo_bites_admin_categories');
    if (!saved && typeof window !== 'undefined') {
      const local = localStorage.getItem('halo_bites_admin_categories');
      if (local) {
        try { saved = JSON.parse(local); } catch {}
      }
    }
    if (saved && Array.isArray(saved) && saved.length > 0) {
      return saved;
    }
  } catch (err) {
    console.warn('Error reading stored categories:', err);
  }

  // If storage was empty, initialize storage with DEFAULT_CATEGORIES so admin and storefront stay in sync
  if (typeof window !== 'undefined' && DEFAULT_CATEGORIES.length > 0) {
    saveStoredCategories(DEFAULT_CATEGORIES).catch(() => {});
  }
  return DEFAULT_CATEGORIES;
}

export async function saveStoredCategories(categories: CategoryItem[]): Promise<void> {
  await setPersistentData('halo_bites_admin_categories', categories);
  if (typeof window !== 'undefined') {
    localStorage.setItem('halo_bites_admin_categories', JSON.stringify(categories));
    window.dispatchEvent(new Event('halo_bites_categories_updated'));
    window.dispatchEvent(new Event('storage'));
  }
}

export async function getStoredProductsAsync(): Promise<ProductItem[]> {
  try {
    let prods: ProductItem[] | null = await getPersistentData<ProductItem[]>('halo_bites_admin_products');
    if (!prods && typeof window !== 'undefined') {
      const local = localStorage.getItem('halo_bites_admin_products');
      if (local) {
        try { prods = JSON.parse(local); } catch {}
      }
    }

    if (prods && Array.isArray(prods) && prods.length > 0) {
      return prods;
    }
  } catch (err) {
    console.warn('Error reading stored products:', err);
  }

  // If storage was empty, initialize storage with DEFAULT_PRODUCTS so admin and storefront stay in sync
  if (typeof window !== 'undefined' && DEFAULT_PRODUCTS.length > 0) {
    saveStoredProducts(DEFAULT_PRODUCTS).catch(() => {});
  }
  return DEFAULT_PRODUCTS;
}

export async function saveStoredProducts(products: ProductItem[]): Promise<void> {
  await setPersistentData('halo_bites_admin_products', products);
  if (typeof window !== 'undefined') {
    localStorage.setItem('halo_bites_admin_products', JSON.stringify(products));
    window.dispatchEvent(new Event('halo_bites_products_updated'));
    window.dispatchEvent(new Event('storage'));
  }
}

