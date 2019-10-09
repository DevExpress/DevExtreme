import { ClientFunction } from 'testcafe';

interface IOptions {
    id: string,
    width: number,
    height: number,
    backgroundColor: string
}

const appendElementTo = ClientFunction((selector: string, tagName: string, options: IOptions) => {
    const container = document.querySelector(selector);
    const element = document.createElement(tagName);
    const { id, width, height, backgroundColor } = options;

    element.setAttribute("id", id);
    element.style.cssText = `width: ${width}px; height: ${height}px; background-color: ${backgroundColor};`;
    element.innerText = id;

    container.appendChild(element);
});

export {
    appendElementTo
}
