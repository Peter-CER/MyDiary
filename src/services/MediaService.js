import Media from '../models/Media.js';

export default class MediaService {
    constructor(storage) {
        this.storage = storage;
    }

    // Read Data
    // Attempts to fetch a raw media file by its ID, returning null if it fails
    async get(mediaId) {
        try {
            return await this.storage.get(mediaId);
        } catch (error) {
            console.error(`Failed to load media file with ID: ${mediaId}`, error);
            return null;
        }
    }

    // Delete Data
    // Removes a media file from storage
    async remove(mediaId) {
        try {
            await this.storage.remove(mediaId);
        } catch (error) {
            console.error(`Failed to remove media file with ID: ${mediaId}`, error);
        }
    }

    // Write Data
    // Loops through uploaded files, determines their type, saves them to storage, 
    // and attaches the new Media models to the provided diary entry
    async save(entry, files) {
        for (const file of files) {
            let type = null;

            // Categorize the file based on its MIME type
            if (file.type.startsWith('image/')) type = 'image';
            else if (file.type.startsWith('video/')) type = 'video';
            else if (file.type.startsWith('audio/')) type = 'audio';

            // Skip any file types we don't explicitly support
            if (!type) {
                console.warn(`Ignored unsupported file format: ${file.name}`);
                continue;
            }

            try {
                // Save the raw file to storage and get the generated unique ID
                const newMediaId = await this.storage.save(file);

                // Create an instance of Media
                const newMediaModel = new Media(newMediaId, file.name, type);
                entry.addMedia(newMediaModel);
            } catch (error) {
                console.error(`Failed to save file: ${file.name}`, error);
            }
        }

        // Return the updated entry so the UI can re-render with the new media
        return entry;
    }
}
