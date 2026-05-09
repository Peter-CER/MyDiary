export default class DateUtil {
    // Constants
    static maxDay = new Map([
        [1, 31], [2, 28], [3, 31], [4, 30], [5, 31], [6, 30],
        [7, 31], [8, 31], [9, 30], [10, 31], [11, 30], [12, 31],
    ]);

    // Validation
    // Ensures a string is a valid "YYYY-MM-DD" date, accounting for leap years
    static validate(date) {
        if (!date) return false;

        const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
        if (!regex.test(date)) return false;

        const [year, month, day] = date.split('-').map(Number);
        const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;

        if (month === 2 && isLeap) {
            return day <= 29;
        }

        return day <= DateUtil.maxDay.get(month);
    }

    // Current Date
    // Returns today's date formatted as "YYYY-MM-DD"
    static getCurrent() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Formatting
    // Converts "YYYY-MM-DD" into a readable object: { dayName: "Monday", dateText: "15 August, 2023" }
    static formatForDisplay(date) {
        const months = new Map([
            [1, "January"], [2, "February"], [3, "March"], [4, "April"],
            [5, "May"], [6, "June"], [7, "July"], [8, "August"],
            [9, "September"], [10, "October"], [11, "November"], [12, "December"],
        ]);

        const daysOfWeek = [
            "Sunday", "Monday", "Tuesday", "Wednesday",
            "Thursday", "Friday", "Saturday"
        ];

        const [year, month, day] = date.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);
        const dayName = daysOfWeek[dateObj.getDay()];

        return {
            dayName: dayName,
            dateText: `${day} ${months.get(month)}, ${year}`
        };
    }

    // Date Math
    // Subtracts or adds days to a given "YYYY-MM-DD" string and returns the new date string
    static getPrevDay(dateStr, index) {
        const dateObj = new Date(dateStr);
        dateObj.setDate(dateObj.getDate() - index);

        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }
}
