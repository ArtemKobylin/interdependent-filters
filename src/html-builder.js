export class HTMLBuilder {
    constructor() {
        this.body = document.body;
    }
    createElem(tagName) {
        return document.createElement(tagName)
    }
    getElem(query) {
        return document.querySelector(query)
    }
    css(key, value) {

    }
}