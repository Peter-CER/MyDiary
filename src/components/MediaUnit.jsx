import React, { useRef, useState } from 'react';
import { useMedia } from '../hooks/useMedia';

export default function MediaUnit({ mediaFile, mediaService, onDelete }) {
    // State & References
    // Load the local URL and keep track of playback/modal states
    const url = useMedia(mediaFile.getId(), mediaService);
    const mediaRef = useRef(null); // Used to directly control HTML5 audio/video elements
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);

    // Media Controls
    // Toggles play/pause on the underlying audio or video DOM element
    const togglePlay = () => {
        if (mediaRef.current) {
            if (isPlaying) {
                mediaRef.current.pause();
            } else {
                mediaRef.current.play();
            }
        }
    };

    // Pauses the underlying video before opening the maximized modal
    const handleMaximize = () => {
        if (mediaRef.current) {
            mediaRef.current.pause();
        }
        setIsMaximized(true);
    };

    // Dynamic Content Rendering
    // Returns the correct HTML element based on the specific media type
    const renderMediaContent = () => {
        if (!url) {
            return <span className='media-loading'>Loading...</span>;
        }

        // Render Image
        if (mediaFile.isImage()) {
            return (
                <img
                    className='media-image'
                    src={url}
                    alt={mediaFile.getName()}
                    onClick={handleMaximize}
                />
            );
        }

        // Render Video
        if (mediaFile.isVideo()) {
            return (
                <div>
                    <video
                        className='media-video'
                        src={url}
                        ref={mediaRef}
                        controls={false}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onClick={handleMaximize}
                    />
                    <button onClick={togglePlay} className='media-play-button'>
                        {isPlaying ? '⏸ Pause Video' : '▶ Play Video'}
                    </button>
                </div>
            );
        }

        // Render Audio
        if (mediaFile.isAudio()) {
            return (
                <div>
                    <img alt="Audio File" className='audio-img' src='/MyDiary/audio.svg' />
                    <audio
                        className='media-audio'
                        src={url}
                        controls={false}
                        ref={mediaRef}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                    />
                    <button onClick={togglePlay} className='media-play-button'>
                        {isPlaying ? '⏸ Pause Audio' : '▶ Play Audio'}
                    </button>
                </div>
            );
        }

        // Fallback
        return <div className='media-unsupported'>Unsupported Format</div>;
    };

    return (
        <>
            {/* Standard Grid Item */}
            <article className='media-unit'>
                {renderMediaContent()}
                <h4>{mediaFile.getName()}</h4>
                <button onClick={() => onDelete(mediaFile.getId())} className='media-remove-button'>
                    Delete
                </button>
            </article>

            {/* Maximized Modal Overlay */}
            <div
                className={`media-modal-overlay ${isMaximized ? 'show' : ''}`}
                onClick={() => { setIsMaximized(false) }}
            >
                {isMaximized && mediaFile.isImage() && (
                    <img src={url} alt={mediaFile.getName()} className="maximized-media" />
                )}
                {isMaximized && mediaFile.isVideo() && (
                    <video src={url} controls autoPlay className="maximized-media" />
                )}
            </div>
        </>
    )
}
