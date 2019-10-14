import { ClientFunction } from 'testcafe';

interface IOptions {
    id: string,
    width: number,
    height: number,
    backgroundColor: string
}

const createInsertedElement = (tagName: string, options: IOptions) => {
    const element = document.createElement(tagName);
    const { id, width, height, backgroundColor } = options;

    element.setAttribute("id", id);
    element.style.cssText = `width: ${width}px; height: ${height}px; background-color: ${backgroundColor};`;
    element.innerText = id;

    return element;
};

const appendElementTo = ClientFunction((selector: string, tagName: string, options: IOptions) => {
    const container = document.querySelector(selector);

    container.appendChild(createInsertedElement(tagName, options));
}, { dependencies: { createInsertedElement }});

const insertElementBefore = ClientFunction((selector: string, referenceElementSelector: string, tagName: string, options: IOptions) => {
    const container = document.querySelector(selector);
    const referenceElement = document.querySelector(referenceElementSelector);

    container.insertBefore(createInsertedElement(tagName, options), referenceElement);
}, { dependencies: { createInsertedElement }});

export {
    appendElementTo,
    insertElementBefore
}
