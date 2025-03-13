import { useState, useEffect } from 'react';

interface IndexedDBHook<T> {
  addItem: (item: T) => Promise<void>;
  getItem: (id: string | number) => Promise<T | undefined>;
  deleteItem: (id: string | number) => Promise<void>;
  items: T[];
}


export function useIndexedDB<T>(dbName: string, storeName: string): IndexedDBHook<T> {
  const [items, setItems] = useState<T[]>([]);

  useEffect(() => {
    const openRequest = indexedDB.open(dbName, 1);

    openRequest.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id' });
      }
    };

    openRequest.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const getAllRequest = store.getAll();

      getAllRequest.onsuccess = () => {
        setItems(getAllRequest.result);
      };
    };

    openRequest.onerror = (event) => {
      console.error('IndexedDB error:', (event.target as IDBOpenDBRequest).error);
    };
  }, [dbName, storeName]);

  const addItem = async (item: T) => {
    const db = await openDB();
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    store.add(item);

    transaction.oncomplete = () => {
      setItems((prevItems) => [...prevItems, item]);
    };
  };

  const getItem = async (id: string | number): Promise<T | undefined> => {
    const db = await openDB();
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.get(id);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  };

  const deleteItem = async (id: string | number) => {
    const db = await openDB();
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    store.delete(id);

    transaction.oncomplete = () => {
      setItems((prevItems) => prevItems.filter((item) => (item as any).id !== id));
    };
  };

  const openDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const openRequest = indexedDB.open(dbName, 1);

      openRequest.onsuccess = (event) => {
        resolve((event.target as IDBOpenDBRequest).result);
      };

      openRequest.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  };

  return { addItem, getItem, deleteItem, items };
}