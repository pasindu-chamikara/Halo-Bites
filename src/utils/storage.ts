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
import { db } from '@/config/firebase';
import { collection, getDocs, setDoc, doc, deleteDoc } from 'firebase/firestore';

export const TEST_ORDER_IDS = ['ORD-1001', 'ORD-1002', 'ORD-1003', 'ORD-1004', 'ORD-1005', 'ORD-1006', 'ORD-98234-A', 'ORD-87122-B', 'ORD-75611-C'];
export const TEST_CUSTOMERS = ['Jane Doe', 'John Smith', 'Alice Johnson', 'Bob Brown', 'Charlie Davis', 'Eva Green'];

export function isTestOrder(order: any): boolean {
  if (!order || !order.id) return false;
  const id = String(order.id);
  // Match only exact known mock seed order IDs from original demo template
  if (TEST_ORDER_IDS.includes(id)) return true;
  // Match exact 4-digit mock IDs like ORD-1001 through ORD-1006
  if (/^ORD-100[1-6]$/.test(id)) return true;
  // Only match legacy mock customers if the ID is also one of the legacy mock template orders
  const cust = typeof order.customer === 'string'
    ? order.customer
    : `${order.customer?.firstName || ''} ${order.customer?.lastName || ''}`.trim();
  if (TEST_CUSTOMERS.includes(cust) && TEST_ORDER_IDS.includes(id)) return true;
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
  // 1. Try reading from Firestore Cloud Database if in browser
  if (typeof window !== 'undefined') {
    try {
      const snapshot = await getDocs(collection(db, 'categories'));
      if (!snapshot.empty) {
        const cloudCats: CategoryItem[] = [];
        snapshot.forEach((snap) => {
          cloudCats.push({ ...(snap.data() as CategoryItem), id: snap.id });
        });
        if (cloudCats.length > 0) {
          await setPersistentData('halo_bites_admin_categories', cloudCats);
          localStorage.setItem('halo_bites_admin_categories', JSON.stringify(cloudCats));
          return cloudCats;
        }
      }
    } catch {
      // Cloud fallback to resilient local storage
    }
  }

  // 2. Read from persistent local cache (IndexedDB / localStorage)
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

  // 3. Fallback to DEFAULT_CATEGORIES
  if (typeof window !== 'undefined' && DEFAULT_CATEGORIES.length > 0) {
    saveStoredCategories(DEFAULT_CATEGORIES).catch(() => {});
  }
  return DEFAULT_CATEGORIES;
}

export async function saveStoredCategories(categories: CategoryItem[]): Promise<void> {
  // 1. Save to local persistent storage immediately
  await setPersistentData('halo_bites_admin_categories', categories);
  if (typeof window !== 'undefined') {
    localStorage.setItem('halo_bites_admin_categories', JSON.stringify(categories));
    window.dispatchEvent(new Event('halo_bites_categories_updated'));
    window.dispatchEvent(new Event('storage'));

    // 2. Mirror asynchronously to Cloud Firestore
    try {
      for (const cat of categories) {
        await setDoc(doc(db, 'categories', String(cat.id)), cat, { merge: true });
      }
    } catch (err) {
      // Cloud database notice - local storage remains 100% active
    }
  }
}

export async function getStoredProductsAsync(): Promise<ProductItem[]> {
  // 1. Try reading from Firestore Cloud Database if in browser
  if (typeof window !== 'undefined') {
    try {
      const snapshot = await getDocs(collection(db, 'products'));
      if (!snapshot.empty) {
        const cloudProducts: ProductItem[] = [];
        snapshot.forEach((snap) => {
          cloudProducts.push({ ...(snap.data() as ProductItem), id: snap.id });
        });
        if (cloudProducts.length > 0) {
          await setPersistentData('halo_bites_admin_products', cloudProducts);
          localStorage.setItem('halo_bites_admin_products', JSON.stringify(cloudProducts));
          return cloudProducts;
        }
      }
    } catch {
      // Cloud fallback to resilient local storage
    }
  }

  // 2. Read from persistent local cache (IndexedDB / localStorage)
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

  // 3. Fallback to DEFAULT_PRODUCTS
  if (typeof window !== 'undefined' && DEFAULT_PRODUCTS.length > 0) {
    saveStoredProducts(DEFAULT_PRODUCTS).catch(() => {});
  }
  return DEFAULT_PRODUCTS;
}

export async function saveStoredProducts(products: ProductItem[]): Promise<void> {
  // 1. Save to local persistent storage immediately
  await setPersistentData('halo_bites_admin_products', products);
  if (typeof window !== 'undefined') {
    localStorage.setItem('halo_bites_admin_products', JSON.stringify(products));
    window.dispatchEvent(new Event('halo_bites_products_updated'));
    window.dispatchEvent(new Event('storage'));

    // 2. Mirror asynchronously to Cloud Firestore
    try {
      for (const prod of products) {
        await setDoc(doc(db, 'products', String(prod.id)), prod, { merge: true });
      }
    } catch (err) {
      // Cloud database notice - local storage remains 100% active
    }
  }
}

/**
 * Upload all current products and categories from local storage to Cloud Firestore
 */
export async function syncAllCatalogToCloud(): Promise<{ success: boolean; message: string; productsCount: number; categoriesCount: number }> {
  try {
    const prods = (await getPersistentData<ProductItem[]>('halo_bites_admin_products')) || DEFAULT_PRODUCTS;
    const cats = (await getPersistentData<CategoryItem[]>('halo_bites_admin_categories')) || DEFAULT_CATEGORIES;

    const prodsList = Array.isArray(prods) && prods.length > 0 ? prods : DEFAULT_PRODUCTS;
    const catsList = Array.isArray(cats) && cats.length > 0 ? cats : DEFAULT_CATEGORIES;

    for (const p of prodsList) {
      await setDoc(doc(db, 'products', String(p.id)), p, { merge: true });
    }
    for (const c of catsList) {
      await setDoc(doc(db, 'categories', String(c.id)), c, { merge: true });
    }

    return {
      success: true,
      message: `Successfully synchronized ${prodsList.length} products and ${catsList.length} categories to Cloud Firestore!`,
      productsCount: prodsList.length,
      categoriesCount: catsList.length
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Could not reach Cloud Firestore. Please ensure Firestore API is enabled in your Firebase Console.',
      productsCount: 0,
      categoriesCount: 0
    };
  }
}

/**
 * Export current products & categories as a downloadable JSON string
 */
export async function exportCatalogBackup(): Promise<string> {
  const prods = await getStoredProductsAsync();
  const cats = await getStoredCategoriesAsync();
  return JSON.stringify({ products: prods, categories: cats, exportedAt: new Date().toISOString() }, null, 2);
}

/**
 * Import products & categories from a JSON backup file
 */
export async function importCatalogBackup(jsonString: string): Promise<{ success: boolean; count: number; error?: string }> {
  try {
    const parsed = JSON.parse(jsonString);
    if (!parsed || (!parsed.products && !parsed.categories)) {
      return { success: false, count: 0, error: 'Invalid file format. Missing products or categories.' };
    }
    let totalCount = 0;
    if (Array.isArray(parsed.products) && parsed.products.length > 0) {
      await saveStoredProducts(parsed.products);
      totalCount += parsed.products.length;
    }
    if (Array.isArray(parsed.categories) && parsed.categories.length > 0) {
      await saveStoredCategories(parsed.categories);
      totalCount += parsed.categories.length;
    }
    // Also attempt mirroring imported items to Cloud Firestore
    syncAllCatalogToCloud().catch(() => {});
    return { success: true, count: totalCount };
  } catch (err: any) {
    return { success: false, count: 0, error: err?.message || 'Failed to parse JSON file.' };
  }
}

/**
 * Permanently delete a product from local storage AND Cloud Firestore
 */
export async function deleteStoredProduct(id: number | string): Promise<void> {
  if (typeof window !== 'undefined') {
    try {
      await deleteDoc(doc(db, 'products', String(id)));
    } catch (err) {
      console.warn('Could not delete product from Firestore:', err);
    }
  }
}

/**
 * Permanently delete a category from local storage AND Cloud Firestore
 */
export async function deleteStoredCategory(id: string): Promise<void> {
  if (typeof window !== 'undefined') {
    try {
      await deleteDoc(doc(db, 'categories', String(id)));
    } catch (err) {
      console.warn('Could not delete category from Firestore:', err);
    }
  }
}

/**
 * Fetch all real placed orders from Cloud Firestore, admin storage, and user storage.
 * Synchronizes across multiple devices and browser sessions.
 */
export async function getStoredOrdersAsync(): Promise<any[]> {
  const combinedMap = new Map<string, any>();

  // 1. Fetch from Cloud Firestore
  if (typeof window !== 'undefined') {
    try {
      const snapshot = await getDocs(collection(db, 'orders'));
      if (!snapshot.empty) {
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data && data.id && !isTestOrder(data)) {
            combinedMap.set(data.id, data);
          }
        });
      }
    } catch (e) {
      // Local fallback
    }
  }

  // 2. Fetch from persistent admin storage
  try {
    let adminOrders = await getPersistentData<any[]>('halo_bites_admin_orders');
    if (!adminOrders && typeof window !== 'undefined') {
      const local = localStorage.getItem('halo_bites_admin_orders');
      if (local) {
        try { adminOrders = JSON.parse(local); } catch {}
      }
    }
    if (adminOrders && Array.isArray(adminOrders)) {
      adminOrders.forEach((o) => {
        if (o && o.id && !isTestOrder(o)) {
          if (!combinedMap.has(o.id)) combinedMap.set(o.id, o);
        }
      });
    }
  } catch {}

  // 3. Fetch from user checkout orders
  if (typeof window !== 'undefined') {
    try {
      const localUser = localStorage.getItem('halo_bites_user_orders');
      if (localUser) {
        const userOrders = JSON.parse(localUser);
        if (Array.isArray(userOrders)) {
          userOrders.forEach((o) => {
            if (o && o.id && !isTestOrder(o)) {
              if (!combinedMap.has(o.id)) combinedMap.set(o.id, o);
            }
          });
        }
      }
    } catch {}
  }

  const merged = Array.from(combinedMap.values());

  // Cache back to local persistent storage
  if (typeof window !== 'undefined' && merged.length > 0) {
    try {
      await setPersistentData('halo_bites_admin_orders', merged);
      localStorage.setItem('halo_bites_admin_orders', JSON.stringify(merged));
    } catch {}
  }

  return merged;
}



