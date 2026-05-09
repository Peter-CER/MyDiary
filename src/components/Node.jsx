import DateUtils from '../utils/DateUtil';

export default function Node({ date, diaryService, onCircleClick, isSelected }) {
    // Data Fetching & Setup
    // Check if a diary entry already exists for this specific node's date
    const entry = diaryService.getEntry(date);
    let exist = false;
    if (entry) exist = entry.exists();

    // Time Calculations
    // Dates to use for comparison (Time set tu midnight to normalize)
    const currentDate = new Date(DateUtils.getCurrent());
    const nodeDate = new Date(date);
    currentDate.setHours(0, 0, 0, 0);
    nodeDate.setHours(0, 0, 0, 0);

    const isPast = currentDate >= nodeDate;

    // Visual Styling
    // Determine default colors based on whether an entry exists for this day
    let fill = exist ? "#bf54e36b" : "#cdccccff";
    let outline = exist ? "#dc83e8ff" : "#bbb9b9ff";
    let strokeWidth = "5"

    // Override the default styles if the date is in the future or is actively selected
    if (!isPast) {
        fill = "#e8e8e8";
        outline = "#d4cfcf";
    }
    if (isSelected) {
        outline = "#f0625280";
        fill = "#f057522d";
        strokeWidth = "5";
    }

    // View Transitions
    // Strip special characters to create a safe, unique CSS identifier for smooth animations
    const transName = `node-${date.replace(/[^a-zA-Z0-9]/g, '')}`;

    return (
        <svg
            className="node-box"
            viewBox="0 0 75 75"
            style={{ viewTransitionName: transName }}
        >
            <circle
                cx="37.5"
                cy="37.5"
                r="32"
                fill={fill}
                stroke={outline}
                strokeWidth={strokeWidth}
                onClick={() => onCircleClick(date)}
            />
        </svg>
    )
}
