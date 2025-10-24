// Lightweight IndexedDB helper for key-value settings

const DB_NAME = "uwu-clock";
const DB_VERSION = 1;
const STORE_NAME = "settings";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

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

export async function idbGet<T = unknown>(key: string): Promise<T | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result as T | undefined);
    req.onerror = () => reject(req.error);
  });
}

export async function idbSet<T = unknown>(
  key: string,
  value: T,
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const req = store.put(value as unknown, key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function idbGetAll(): Promise<Record<string, unknown>> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);

    // Some browsers support getAllKeys/getAll; fallback to cursor
    type StoreWithGetAll = IDBObjectStore & {
      getAllKeys?: () => IDBRequest<IDBValidKey[]>;
      getAll?: () => IDBRequest<unknown[]>;
    };
    const s = store as StoreWithGetAll;
    if (typeof s.getAllKeys === "function" && typeof s.getAll === "function") {
      const keysReq = s.getAllKeys();
      const valuesReq = s.getAll();
      let keys: IDBValidKey[] = [];
      let values: unknown[] = [];
      keysReq.onsuccess = () => {
        keys = keysReq.result as IDBValidKey[];
        if (
          values.length ||
          (valuesReq.readyState === "done" && valuesReq.result)
        ) {
          const out: Record<string, unknown> = {};
          keys.forEach((k, i) => (out[String(k)] = values[i]));
          resolve(out);
        }
      };
      valuesReq.onsuccess = () => {
        values = valuesReq.result as unknown[];
        if (keys.length || (keysReq.readyState === "done" && keysReq.result)) {
          const out: Record<string, unknown> = {};
          keys.forEach((k, i) => (out[String(k)] = values[i]));
          resolve(out);
        }
      };
      keysReq.onerror = valuesReq.onerror = () =>
        reject(keysReq.error || valuesReq.error);
      return;
    }

    const result: Record<string, unknown> = {};
    const req = store.openCursor();
    req.onsuccess = () => {
      const cursor = req.result as IDBCursorWithValue | null;
      if (cursor) {
        result[String(cursor.key)] = cursor.value;
        cursor.continue();
      } else {
        resolve(result);
      }
    };
    req.onerror = () => reject(req.error);
  });
}
