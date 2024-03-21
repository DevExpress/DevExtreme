import $ from 'jquery';

export class WrapperBase {
    constructor(container) {
        this.container = container;
    }

    getElement() {
        throw 'getElement() is not implemented';
    }

    getContainer() {
        return typeof this.container === 'object' ? this.container : $(this.container);
    }
}

export class ElementWrapper extends WrapperBase {
    constructor(containerWrapper, selector) {
        super(containerWrapper);
        this.container = containerWrapper;
        this.selector = selector;
    }

    getElement() {
        return this.container.getElement().find(this.selector);
    }

    isExists() {
        return this.getElement().length > 0;
    }
}
