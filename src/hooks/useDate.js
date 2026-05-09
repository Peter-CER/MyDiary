import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import DateUtils from "../utils/DateUtil";

export default function useDate() {
    // URL Helpers
    // Grabs the '?date=' parameter from the current URL string
    const getDateFromURL = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('date');
    }

    // State Initialization
    // Starts with the URL date if valid and not in the future, otherwise defaults to today
    const [selectedDate, setSelectedDate] = useState(() => {
        if (!DateUtils.validate(getDateFromURL()) || new Date(DateUtils.getCurrent()) <= new Date(getDateFromURL())) {
            return DateUtils.getCurrent();
        }
        return getDateFromURL();
    })

    // UI Transitions
    // Wraps state updates in the View Transitions API for smooth visual changes
    const transition = (update) => {
        if (document.startViewTransition) {
            document.startViewTransition(() => {
                flushSync(() => {
                    update();
                });
            });
        } else {
            update();
        }
    };

    // Actions
    // Updates the state and pushes the newly selected date to the browser's URL history
    const changeDate = (date) => {
        if (new Date(DateUtils.getCurrent()) >= new Date(date)) {
            // wrapped iin the transition for smooth timeline change
            transition(() => {
                window.history.pushState(null, '', `?date=${date}`);
                setSelectedDate(date);
            });
        }
    }

    // Browser History Sync
    // Listens for browser back/forward button clicks and keeps the UI in sync with the URL
    useEffect(() => {
        const handlePop = () => {
            let date = getDateFromURL();
            if (!DateUtils.validate(date) || new Date(DateUtils.getCurrent()) <= new Date(date)) {
                date = DateUtils.getCurrent();
            }
            transition(() => {
                setSelectedDate(date);
            });
        }

        window.addEventListener('popstate', handlePop);
        return () => window.removeEventListener('popstate', handlePop)
    }, [])

    return [selectedDate, changeDate]
}
