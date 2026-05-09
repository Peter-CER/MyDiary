export default class MediaFile {
    constructor(id, name, type) {
        this.name = name;
        this.type = type; // audi/video/image
        this.id = id; // for indexedDB
    }

    // Getters
    getName() { return this.name; }
    getType() { return this.type; }
    getId() { return this.id; }

    // Setters
    setName(name) { this.name = name; }
    setType(type) { this.type = type; }
    setId(id) { this.id = id; }

    // Type Check
    isImage() { return this.type === "image"; }
    isVideo() { return this.type === "video"; }
    isAudio() { return this.type === "audio"; }
}
