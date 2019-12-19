import $ from 'jquery';

export class WrapperBase {
    constructor(containerSelector) {
        this.containerSelector = containerSelector;
    }

    getElement() {
        throw 'getElement() is not implemented';
    }

    getContainer() {
        return $(this.containerSelector);
    }
}
