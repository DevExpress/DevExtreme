import { ClientFunction } from 'testcafe';

interface Options {
  id: string;
  width: number;
  height: number;
  backgroundColor: string;
}

const createElement = (tagName: string, options: Options): HTMLElement => {
  const element = document.createElement(tagName);
  const {
    id, width, height, backgroundColor,
  } = options;

  element.setAttribute('id', id);
  element.style.cssText = `width: ${width}px; height: ${height}px; background-color: ${backgroundColor};`;
  element.innerText = id;

  return element;
};

export const appendElementTo = ClientFunction((
  containerSelector: string,
  tagName: string,
  options: Options,
) => {
  document
    .querySelector(containerSelector)
    .appendChild(createElement(tagName, options));
}, { dependencies: { createElement } });

export const insertElementBefore = ClientFunction((
  containerSelector: string,
  referenceSelector: string,
  tagName: string,
  options: Options,
) => {
  document
    .querySelector(containerSelector)
    .insertBefore(createElement(tagName, options), document.querySelector(referenceSelector));
}, { dependencies: { createElement } });
