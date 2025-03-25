// interface IndexedDBHook<T> {
//   addItem: (item: T, storeName: string) => Promise<void>;
//   getItem: (id: string | number, storeName: string) => Promise<T | undefined>;
//   deleteItem: (id: string | number, storeName: string) => Promise<void>;
//   init: () => void;
// }

type IndexedDBProps = {
  dbName: string;
  stores: {
    storeName: string;
    keyPath: string;
  }[];
};

export default class IndexedDB {
  private dbName: string;
  private stores: {
    storeName: string;
    keyPath: string;
  }[];
  static openRequest: IDBOpenDBRequest;

  constructor(props: IndexedDBProps) {
    this.dbName = props.dbName;
    this.stores = props.stores;
    if (!IndexedDB.openRequest) {
      this.init();
    }
  }

  init() {
    const openRequest = indexedDB.open(this.dbName, 1);

    IndexedDB.openRequest = openRequest;
    openRequest.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      for (let i = 0; i < this.stores.length; i++) {
        if (!db.objectStoreNames.contains(this.stores[i].storeName)) {
          db.createObjectStore(this.stores[i].storeName, {
            keyPath: this.stores[i].keyPath,
          });
        }
      }
    };

    openRequest.onsuccess = () => {

      console.log("数据库打开成功");
    };

    openRequest.onerror = (event) => {
      console.error(
        "IndexedDB error:",
        (event.target as IDBOpenDBRequest).error
      );
    };
  }

  async editItem<T>(item: T[], storeName: string): Promise<boolean> {
    const db = await this.openDB();
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    return Promise.all([
      ...item.map((u) => {
        return new Promise((resolve, reject) => {
          const add = store.put(u);
          add.onsuccess = () => {
            resolve(add.result);
          };
          add.onerror = (err) => {
            reject(err);
          };
        });
      }),
    ])
      .then(() => {
        return true;
      })
      .catch((err) => {
        console.log("修改失败", err);
        return false;
      });
  }

  async removeItem(item: string[], storeName: string): Promise<boolean> {
    const db = await this.openDB();
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);
    return Promise.all([
      ...item.map((u) => {
        return new Promise((resolve, reject) => {
          const add = store.delete(u);
          add.onsuccess = () => {
            resolve(add.result);
          };
          add.onerror = (err) => {
            reject(err);
          };
        });
      }),
    ])
      .then(() => {
        return true;
      })
      .catch((err) => {
        console.log("删除失败", err);
        return false;
      });
  }
  async addItem<T>(item: T[], storeName: string): Promise<boolean> {
    const db = await this.openDB();
    const transaction = db.transaction(storeName, "readwrite");
    const store = transaction.objectStore(storeName);

    return Promise.all([
      ...item.map((u) => {
        return new Promise((resolve, reject) => {
          const add = store.add(u);
          add.onsuccess = () => {
            resolve(add.result);
          };
          add.onerror = (err) => {
            reject(err);
          };
        });
      }),
    ])
      .then(() => {
        return true;
      })
      .catch((err) => {
        console.log("添加失败", err);
        return false;
      });
  }

  async getAll<T>(id: string[], storeName: string): Promise<T[]> {
    const db = await this.openDB();
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);
    const keyRange = IDBKeyRange.bound(id[0], id[1], true, true);
    const getAllRequest = store.getAll(keyRange);
    return new Promise((resolve, reject) => {
      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result as T[]);
        console.log(getAllRequest, "1111222");
      };
      getAllRequest.onerror = () => {
        reject(getAllRequest.error);
      };
    });
  }

  async getItem<T>(id: string[], storeName: string): Promise<T[]> {
    const db = await this.openDB();
    const transaction = db.transaction(storeName, "readonly");
    const store = transaction.objectStore(storeName);

    if (Array.isArray(id)) {
      return Promise.all(
        id.map((i) => {
          return new Promise((resolve, reject) => {
            const request = store.get(i);
            request.onsuccess = () => {
              resolve(request.result as T);
            };
            request.onerror = () => {
              reject(request.error);
            };
          });
        })
      )
        .then((res) => {
          return res.filter((item): item is T => item !== undefined); // 使用类型保护
        })
        .catch((err) => {
          console.error("获取失败", err);
          return [];
        });
    }
    return [];
  }
  openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const openRequest = indexedDB.open(this.dbName, 1);

      openRequest.onsuccess = (event) => {
        resolve((event.target as IDBOpenDBRequest).result);
      };

      openRequest.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }
}
