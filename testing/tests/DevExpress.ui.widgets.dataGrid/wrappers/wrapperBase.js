import $ from "jquery";

export class wrapperBase {
    constructor(containerSelector) {
        this.containerSelector = containerSelector;
    }

    getContainer() {
        return $(this.containerSelector);
    }
}
