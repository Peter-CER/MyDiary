//IndexedDB
export default class MediaStorage {
    constructor() {
        this.dbPromise = this.init();
    }

    // Database Setup
    // Initializes IndexedDB and creates the 'media' store if it doesn't exist
    init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open("media_storage", 2);

            // Triggered on first load or when the version number increases
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('media')) {
                    db.createObjectStore('media');
                }
            }
            request.onsuccess = (event) => resolve(event.target.result);
            request.onerror = (event) => reject(event.target.error);
        })
    }

    // Write Data
    // Takes a file object, generates a unique ID, stores it, and returns the ID
    async save(file) {
        const db = await this.dbPromise;

        // Generate a unique ID using a timestamp and a random string
        const mediaId = `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['media'], 'readwrite');
            const store = transaction.objectStore('media');
            const request = store.put(file, mediaId);

            request.onsuccess = () => resolve(mediaId);
            request.onerror = (event) => reject(event.target.error);
        });
    }

    // Delete Data
    // Removes a file from the store using its ID
    async remove(id) {
        const db = await this.dbPromise;
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['media'], 'readwrite');
            const store = transaction.objectStore('media');

            const request = store.delete(id);

            request.onsuccess = (event) => resolve();
            request.onerror = (event) => reject(event.target.error);
        });
    }

    // Read Data
    // Retrieves a file from the store using its ID
    async get(id) {
        const db = await this.dbPromise;
        return new Promise((resolve, reject) => {
            // Use 'readonly' since we are only fetching data
            const transaction = db.transaction(['media'], 'readonly');
            const store = transaction.objectStore('media');

            const request = store.get(id);

            request.onsuccess = (event) => resolve(event.target.result);
            request.onerror = (event) => reject(event.target.error);
        });
    }

}
