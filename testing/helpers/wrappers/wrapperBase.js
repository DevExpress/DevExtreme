import $ from "jquery";

export class WrapperBase {
    constructor(containerSelector) {
        this.containerSelector = containerSelector;
    }

    getContainer() {
        return $(this.containerSelector);
    }
}
