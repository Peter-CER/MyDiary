import DiaryEntry from '../models/DiaryEntry.js';
import MediaFile from '../models/Media.js';

// LocalStorage
export default class DiaryEntryStorage {
    constructor() { }

    // Write Data
    save(entries) {
        const data = JSON.stringify(entries);
        localStorage.setItem('diary_entries', data);
    }

    // Read Data
    load() {
        const data = localStorage.getItem('diary_entries');
        if (!data) return [];

        try {
            const parsedData = JSON.parse(data);

            // Rebuild class instances from raw JSON objects
            return parsedData.map(item => {
                const entry = new DiaryEntry();
                Object.assign(entry, item);

                // Rebuild nested MediaFile instances
                if (item.media && Array.isArray(item.media)) {
                    entry.media = item.media.map(mediaData => {
                        const mediaFile = new MediaFile();
                        Object.assign(mediaFile, mediaData);
                        return mediaFile;
                    });
                }
                return entry;
            });
        } catch (error) {
            console.error("Failed to parse diary entries from local storage:", error);
            return [];
        }
    }
}
