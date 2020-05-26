//indexedDB
export function loadFromIndexedDB(db, storeName, id){
  return new Promise(
    function(resolve, reject) {
      var dbRequest = indexedDB.open(db);

      dbRequest.onerror = function(event) {
        reject(Error("Error text"));
      };

      dbRequest.onupgradeneeded = function(event) {
        // Objectstore does not exist. Nothing to load
        event.target.transaction.abort();
        reject(Error('Not found'));
      };

      dbRequest.onsuccess = function(event) {
        var database      = event.target.result;
        var transaction   = database.transaction([storeName]);
        var objectStore   = transaction.objectStore(storeName);
        var objectRequest = objectStore.get(id);

        objectRequest.onerror = function(event) {
          reject(Error('Error text'));
        };

        objectRequest.onsuccess = function(event) {
          if (objectRequest.result) resolve(objectRequest.result);
          else reject(Error('object not found'));
        };
      };
    }
  );
}
export function  loadAllRowsFromIndexedDB(db, storeName){
  return new Promise(
    function(resolve, reject) {
      var dbRequest = indexedDB.open(db);

      dbRequest.onerror = function(event) {
        reject(Error("Error text"));
      };

      dbRequest.onupgradeneeded = function(event) {
        // Objectstore does not exist. Nothing to load
        event.target.transaction.abort();
        reject(Error('Not found'));
      };

      dbRequest.onsuccess = function(event) {
        var database      = event.target.result;
        var transaction   = database.transaction([storeName]);
        var objectStore   = transaction.objectStore(storeName);
        var objectRequest = objectStore.getAll();

        objectRequest.onerror = function(event) {
          reject(Error('Error text'));
        };

        objectRequest.onsuccess = function(event) {
          if (objectRequest.result) resolve(objectRequest.result);
          else reject(Error('object not found'));
        };
      };
    }
  );
}
export function  saveToIndexedDB(db, storeName, object, key){
  return new Promise(
    function(resolve, reject) {
      var dbRequest = indexedDB.open(db);

      dbRequest.onerror = function(event) {
        reject(Error("IndexedDB database error"));
      };

      dbRequest.onupgradeneeded = function(event) {
        var database    = event.target.result;
        var objectStore = database.createObjectStore(storeName, {keyPath: "id"});
      };

      dbRequest.onsuccess = function(event) {
        var database      = event.target.result;
        var transaction   = database.transaction([storeName], 'readwrite');
        var objectStore   = transaction.objectStore(storeName);
        var objectRequest = objectStore.put(object, key); // Overwrite if exists

        objectRequest.onerror = function(event) {
          reject(Error('Error text'));
        };

        objectRequest.onsuccess = function(event) {
          resolve('Data saved OK');
        };
      };
    }
  );
}


export function  removeFromIndexedDB(db, storeName, key){
  return new Promise(
    function(resolve, reject) {
      var dbRequest = indexedDB.open(db);

      dbRequest.onerror = function(event) {
        reject(Error("IndexedDB database error"));
      };

      dbRequest.onupgradeneeded = function(event) {
        var database    = event.target.result;
        var objectStore = database.createObjectStore(storeName, {keyPath: "id"});
      };

      dbRequest.onsuccess = function(event) {
        var database      = event.target.result;
        var transaction   = database.transaction([storeName], 'readwrite');
        var objectStore   = transaction.objectStore(storeName);
        var objectRequest = objectStore.delete(key); // Overwrite if exists

        objectRequest.onerror = function(event) {
          reject(Error('Error text'));
        };

        objectRequest.onsuccess = function(event) {
          resolve('Data removed OK');
        };
      };
    }
  );
}
