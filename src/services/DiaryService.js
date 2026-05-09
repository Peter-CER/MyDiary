export default class DiaryService {
    constructor(diaryEntryStorage) {
        // Inject the storage dependency and preload entries into memory
        this.storage = diaryEntryStorage;
        this.entries = this.storage.load() || [];
    }

    // Read Data
    // Finds a specific entry by its date string, returns null if not found
    getEntry(date) {
        return this.entries.find(entry => entry.getDate() === date) || null;
    }

    // Returns the full array of loaded entries
    getAllEntries() { return this.entries; }

    // Write / Update Data
    // Replaces an existing entry if the dates match, otherwise adds a new one
    saveEntry(newEntry) {
        const index = this.entries.findIndex(entry => entry.getDate() === newEntry.getDate());
        if (index !== -1) {
            this.entries[index] = newEntry; // Update existing
        } else {
            this.entries.push(newEntry); // Add new
        }

        // Sync the updated memory array back to storage
        this.storage.save(this.entries);
    }

    // Delete Data
    // Filters out the entry for the given date and syncs the changes
    removeEntry(date) {
        this.entries = this.entries.filter(entry => entry.getDate() !== date);
        this.storage.save(this.entries);
    }
}
