import { ClientFunction } from 'testcafe';

interface IOptions {
    id: string,
    width: number,
    height: number,
    backgroundColor: string
}

const createElement = (tagName: string, options: IOptions) => {
    const element = document.createElement(tagName);
    const { id, width, height, backgroundColor } = options;

    element.setAttribute("id", id);
    element.style.cssText = `width: ${width}px; height: ${height}px; background-color: ${backgroundColor};`;
    element.innerText = id;

    return element;
};

const appendElementTo = ClientFunction((containerSelector: string, tagName: string, options: IOptions) => {
    document.querySelector(containerSelector).appendChild(createElement(tagName, options));
}, { dependencies: { createElement }});

const insertElementBefore = ClientFunction((containerSelector: string, referenceSelector: string, tagName: string, options: IOptions) => {
    document.querySelector(containerSelector).insertBefore(createElement(tagName, options), document.querySelector(referenceSelector));
}, { dependencies: { createElement }});

export {
    appendElementTo,
    insertElementBefore
}
