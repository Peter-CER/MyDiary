export default function DiaryText({ text, onTextChange }) {
    return (
        <section className="text-container">
            <h3>How was your day?</h3>
            <textarea
                className="diary-textarea"
                placeholder='Start typing about your day...'
                autoFocus="true"
                value={text}
                onChange={(e) => onTextChange(e.target.value)}
                spellCheck="false"
            />
        </section>
    )
}
