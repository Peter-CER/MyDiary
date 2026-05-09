import Node from "./Node";
import DateUtils from "../utils/DateUtil";

export default function Timeline({ date, diaryService, onCircleClick }) {
    const nodes = [];

    // Past Days
    // Generates the 3 nodes leading up to the selected date
    for (let i = 3; i > 0; i--) {
        nodes.push(
            <Node
                key={DateUtils.getPrevDay(date, i)}
                date={DateUtils.getPrevDay(date, i)}
                diaryService={diaryService}
                onCircleClick={onCircleClick}
                isSelected={false}
            />
        );
    }

    // Selected Day
    // The active date currently being viewed
    nodes.push(
        <Node
            key={date}
            date={DateUtils.getPrevDay(date, 0)} // Or just 'date', to keep it consistent!
            diaryService={diaryService}
            onCircleClick={onCircleClick}
            isSelected={true}
        />
    );

    // Future Days
    // Generates the 3 nodes immediately following the selected date
    for (let i = 1; i < 4; i++) {
        nodes.push(
            <Node
                key={DateUtils.getPrevDay(date, -i)}
                date={DateUtils.getPrevDay(date, -i)}
                diaryService={diaryService}
                onCircleClick={onCircleClick}
                isSelected={false}
            />
        );
    }

    // Render
    return (
        <app-timeline>
            {nodes}
        </app-timeline>
    );
}
