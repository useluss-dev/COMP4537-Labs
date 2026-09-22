export default class Note {
    constructor(content = "", id = crypto.randomUUID()) {
        this.id = id;
        this.content = content;
    }
}
