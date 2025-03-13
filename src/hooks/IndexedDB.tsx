interface IndexedDBHook<T> {
  addItem: (item: T, storeName: string) => Promise<void>;
  getItem: (id: string | number, storeName: string) => Promise<T | undefined>;
  deleteItem: (id: string | number, storeName: string) => Promise<void>;
  init:()=>void;
}

type IndexedDBProps = {
  dbName: string;
  stores: {
    storeName: string;
    keyPath: string;
  }[];
};

export function IndexedDB<T>(props: IndexedDBProps): IndexedDBHook<T> {
  const { dbName, stores } = props;

  const init = () => {
    const openRequest = indexedDB.open(dbName, 1);

    openRequest.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      for (let i = 0; i < stores.length; i++) {
        if (!db.objectStoreNames.contains(stores[i].storeName)) {
          db.createObjectStore(stores[i].storeName, {
            keyPath: stores[i].keyPath,
          });
        }
      }
    };

    openRequest.onsuccess = () => {};

    openRequest.onerror = (event) => {
      console.error(
        "IndexedDB error:",
        (event.target as IDBOpenDBRequest).error
      );
    };
  };

  const addItem = async (item: T | T[], storeName: string) => {
    const db = await openDB();
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    if (Array.isArray(item)) {
      item.forEach((u) => {
        store.add(u);
      });
    } else {
      store.add(item);
    }

    transaction.oncomplete = (event) => {
      console.log("添加成功", event);
    };
  };

  const getItem = async (
    id: string | number,
    storeName: string
  ): Promise<T | undefined> => {
    const db = await openDB();
    const transaction = db.transaction(storeName, "readonly");
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

  const deleteItem = async (id: string | number, storeName: string) => {
    const db = await openDB();
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    store.delete(id);

    transaction.oncomplete = () => {};
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

  return { addItem, getItem, deleteItem,init };
}
