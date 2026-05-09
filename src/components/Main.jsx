import { useState } from 'react';
import MediaContainer from "./MediaContainer";
import DiaryEntry from "../models/DiaryEntry"
import DiaryText from "./DiaryText.jsx";
import DateUtil from '../utils/DateUtil';

export default function Main({ date, diaryService, mediaService, handleArrow }) {
    // State Initialization
    // Fetch the entry for the current date or create a fresh one if it doesn't exist
    const [entry, setEntry] = useState(() => {
        let existingEntry = diaryService.getEntry(date);
        if (!existingEntry) {
            existingEntry = new DiaryEntry(date);
        }
        return existingEntry;
    });

    // Navigation Logic
    // Check if there is a "tomorrow" relative to the current date to toggle arrow visuals
    const isThere = new Date(DateUtil.getCurrent()) > new Date(date);
    const displayDate = DateUtil.formatForDisplay(date);

    // Render
    return (
        <main>
            {/* Header: Displays formatted day name and date */}
            <h2 className='date'>
                <span>{displayDate.dayName}</span>
                <span className="separator">|</span>
                <span>{displayDate.dateText}</span>
            </h2>

            {/* API Info: Fetches name day information */}
            <nameday-info date={date} />

            <app-main>
                {/* Navigation: Previous Day */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="48px"
                    viewBox="0 -960 960 960"
                    width="48px"
                    fill="#bd34eb"
                    className="arrow"
                    role="button"
                    aria-label="Previous day"
                    onClick={() => handleArrow(DateUtil.getPrevDay(date, 1))}
                >
                    <title>Previous day</title>
                    <path d="M453-241 213-481l240-240 42 42-198 198 198 198-42 42Zm253 0L466-481l240-240 42 42-198 198 198 198-42 42Z" />
                </svg>

                <div className='content'>
                    {/* Text Editor: Saves changes to storage and refreshes local state */}
                    <DiaryText
                        text={entry.getText()}
                        onTextChange={(newText) => {
                            entry.setText(newText);
                            diaryService.saveEntry(entry);
                            // Force a re-render by creating a new object instance
                            setEntry(Object.assign(new DiaryEntry(entry.getDate()), entry));
                        }}
                    />

                    {/* Media Gallery: Handles drag-and-drop and file selection */}
                    <MediaContainer
                        entry={entry}
                        mediaService={mediaService}
                        onEntryChange={(updatedEntry) => {
                            diaryService.saveEntry(updatedEntry);
                            const entry = Object.assign(new DiaryEntry(updatedEntry.getDate()), updatedEntry);
                            setEntry(entry);
                        }}
                    />
                </div>

                {/* Navigation: Next Day (Disabled if viewing today) */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="48px"
                    viewBox="0 -960 960 960"
                    width="48px"
                    fill={isThere ? '#bd34eb' : '#d4cfcf'}
                    className="arrow"
                    role="button"
                    aria-label="Next day"
                    onClick={() => {
                        if (isThere) handleArrow(DateUtil.getPrevDay(date, -1));
                    }}
                >
                    <title>Next day</title>
                    <path d="M411-481 213-679l42-42 240 240-240 240-42-42 198-198Zm253 0L466-679l42-42 240 240-240 240-42-42 198-198Z" />
                </svg>
            </app-main>
        </main>
    )
}   
