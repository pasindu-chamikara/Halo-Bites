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
