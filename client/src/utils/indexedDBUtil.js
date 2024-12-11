// IndexedDB Utility Functions
const DB_NAME = 'MyAppDB';
const STORE_NAME = 'AppStore';
const DB_VERSION = 1;

// Open or create the database
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'key' });
      }
    };

    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

// Get data by key
export async function getLocalData(key) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.get(key);

      request.onsuccess = (event) => resolve(event.target.result ? event.target.result.value : null);
      request.onerror = (event) => reject(event.target.error);
    });
  } catch (error) {
    console.error('Error getting data from IndexedDB:', error);
    return null;
  }
}

// Set data by key
export async function setLocalData(key, value) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(STORE_NAME);
      const request = objectStore.put({ key, value });

      request.onsuccess = () => resolve(true);
      request.onerror = (event) => reject(event.target.error);
    });
  } catch (error) {
    console.error('Error setting data in IndexedDB:', error);
    return false;
  }
}
