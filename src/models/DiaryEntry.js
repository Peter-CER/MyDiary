export default class DiaryEntry {
    constructor(date) {
        this.date = date; // YYYY-MM-DD
        this.text = "";
        this.media = [];
    }

    // Getters
    getDate() { return this.date; }
    getText() { return this.text; }
    getAllMedia() { return this.media; }
    getMedia(index) { return this.media[index]; }

    // Setters
    setDate(newDate) { this.date = newDate; }
    setText(newText) { this.text = newText; }

    // Media manipulation
    addMedia(mediaFile) { this.media.push(mediaFile); }
    removeMedia(id) {
        this.media = this.media.filter(mediaFile => mediaFile.getId() !== id);
    }

    // Check if entry has any data
    exists() { return !(this.text === "" && this.media.length === 0); }

}   
