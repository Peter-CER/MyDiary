import MediaUnit from './MediaUnit';

export default function MediaContainer({ entry, mediaService, onEntryChange }) {
    // Event Handlers (Drag & Drop)
    // Prevents the browser's default behavior so we can actually drop files
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    // Grabs the files dropped into the zone, saves them via the service, and updates the entry
    const handleDrop = async (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);

        if (files.length > 0) {
            const newEntry = await mediaService.save(entry, files);
            onEntryChange(newEntry);
        }
    };

    // Event Handlers (Click to Upload)
    // Handles the standard file input dialog selection
    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files);

        if (files.length > 0) {
            const newEntry = await mediaService.save(entry, files);
            onEntryChange(newEntry);
        }
    };

    // Render
    return (
        <section className='media-container' onDragOver={handleDragOver} onDrop={handleDrop}>
            <h3>Media of the day</h3>

            {/* Display existing media */}
            <div className='media-grid'>
                {entry.getAllMedia().map((mediaFile) => (
                    <MediaUnit
                        key={mediaFile.getId()}
                        mediaFile={mediaFile}
                        mediaService={mediaService}
                        onDelete={async () => {
                            // 1. Remove from storage
                            await mediaService.remove(mediaFile.getId());
                            // 2. Remove from the local memory model
                            entry.removeMedia(mediaFile.getId());
                            // 3. Trigger a UI update
                            onEntryChange(entry);
                        }}
                    />
                ))}
            </div>

            {/* Upload Zone */}
            <label className="drag-and-drop">
                Drag and drop your media
                <input type="file" onChange={handleFileSelect} />
            </label>
        </section>
    );
}
