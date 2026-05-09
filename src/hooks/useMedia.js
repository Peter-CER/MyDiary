import { useEffect, useState } from "react";

export function useMedia(mediaId, mediaService) {
    // State Initialization
    // Holds the temporary local URL generated for the loaded media file
    const [mediaURL, setMediaURL] = useState(null);

    // Media Loading & Memory Management
    useEffect(() => {
        let url = null;

        // Fetches the raw file from storage and creates a browser-readable URL
        const loadMedia = async () => {
            const file = await mediaService.get(mediaId);
            if (file) {
                url = URL.createObjectURL(file);
                setMediaURL(url);
            }
        }

        if (mediaId) {
            loadMedia();
        }

        // Cleanup
        // Revokes the temporary URL when the component unmounts or the ID changes 
        // to prevent browser memory leaks
        return () => {
            if (url) {
                URL.revokeObjectURL(url);
            }
        };
    }, [mediaService, mediaId])

    return mediaURL;
}
