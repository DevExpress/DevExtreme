/* global document */
import { noop } from '@js/core/utils/common';
import injector from '@js/core/utils/dependency_injector';
import { getShadowElementsFromPoint } from '@js/core/utils/shadow_dom';

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const DOCUMENT_NODE = 9;
const DOCUMENT_FRAGMENT_NODE = 11;

export interface DomAdapter {
  querySelectorAll: (element, selector) => any;
  elementMatches: (element, selector) => any;
  getActiveElement: (element?: HTMLElement | null) => HTMLElement;
  getDocument: () => Document;
  getDocumentElement: () => HTMLDocument & {
    scrollLeft: number;
    scrollTop: number;
    clientWidth: number;
    scrollHeight: number;
    offsetHeight: number;
    clientHeight: number;
  };
  getHead: () => any;
  listen: (element, event, callback, options?) => any;
  getReadyState: () => DocumentReadyState;
  isNode: (node: unknown) => boolean;
  isDocument: (element: any) => boolean;
  isDocumentFragment: (element: any) => boolean;
  getBody: () => HTMLBodyElement;
  getRootNode: (element: HTMLElement) => Document | DocumentFragment;
  getAttribute: (element, name) => any;
  setAttribute: (element, name, value) => void;
  removeAttribute: (element, name) => void;
  isElementNode: (element: any) => boolean;
  createElement: (tagName: string, context?: Document) => HTMLElement;
  createDocumentFragment: () => DocumentFragment;
  createTextNode: (text: any, context?: any) => any;
  setClass: (element: HTMLElement, className: string, isAdd: boolean) => void;
  setText: (element, text) => void;
  setProperty: (element, name, value) => void;
  removeElement: (element: HTMLElement) => void;
  inject: (obj: Record<string, unknown>) => void;
  setStyle: (element: HTMLElement, name: string, value: string) => void;
  insertElement: (parentElement: HTMLElement, newElement: HTMLElement, nextSiblingElement?: HTMLElement) => void;
}

const nativeDOMAdapterStrategy: DomAdapter = {
  querySelectorAll(element, selector) {
    return element.querySelectorAll(selector);
  },

  elementMatches(element, selector) {
    const matches = element.matches || element.matchesSelector || element.mozMatchesSelector
            || element.msMatchesSelector || element.oMatchesSelector || element.webkitMatchesSelector
            || ((selector) => {
              const doc = element.document || element.ownerDocument;

              if (!doc) {
                return false;
              }

              const items = this.querySelectorAll(doc, selector);

              for (let i = 0; i < items.length; i++) {
                if (items[i] === element) {
                  return true;
                }
              }
            });

    return matches.call(element, selector);
  },

  createElement(tagName, context) {
    context = context ?? this._document;
    return context!.createElement(tagName);
  },

  createElementNS(ns, tagName, context) {
    context = context || this._document;
    return context.createElementNS(ns, tagName);
  },

  createTextNode(text, context) {
    context = context || this._document;
    return context.createTextNode(text);
  },

  createAttribute(text, context) {
    context = context || this._document;
    return context.createAttribute(text);
  },

  isNode(element) {
    return !!element && typeof element === 'object' && 'nodeType' in element && 'nodeName' in element;
  },

  isElementNode(element) {
    return !!element && element.nodeType === ELEMENT_NODE;
  },

  isTextNode(element) {
    return element && element.nodeType === TEXT_NODE;
  },

  isDocument(element) {
    return element && element.nodeType === DOCUMENT_NODE;
  },

  isDocumentFragment(element) {
    return element && element.nodeType === DOCUMENT_FRAGMENT_NODE;
  },

  removeElement(element) {
    const parentNode = element && element.parentNode;
    if (parentNode) {
      parentNode.removeChild(element);
    }
  },

  insertElement(parentElement, newElement, nextSiblingElement) {
    if (parentElement && newElement && parentElement !== newElement) {
      if (nextSiblingElement) {
        parentElement.insertBefore(newElement, nextSiblingElement);
      } else {
        parentElement.appendChild(newElement);
      }
    }
  },

  getAttribute(element, name) {
    return element.getAttribute(name);
  },

  setAttribute(element, name, value) {
    if (name === 'style') {
      element.style.cssText = value;
    } else {
      element.setAttribute(name, value);
    }
  },

  removeAttribute(element, name) {
    element.removeAttribute(name);
  },

  setProperty(element, name, value) {
    element[name] = value;
  },

  setText(element, text) {
    if (element) {
      element.textContent = text;
    }
  },

  setClass(element, className, isAdd) {
    if (element.nodeType === 1 && className) {
      isAdd
        ? element.classList.add(className)
        : element.classList.remove(className);
    }
  },

  setStyle(element, name, value) {
    element.style[name] = value || '';
  },

  _document: typeof document === 'undefined' ? undefined : document,

  getDocument() {
    return this._document;
  },

  getActiveElement(element) {
    const activeElementHolder = this.getRootNode(element);

    return activeElementHolder.activeElement;
  },
  // @ts-expect-error return type is not assignable
  getRootNode(element) {
    return element?.getRootNode?.() ?? this._document;
  },

  getBody() {
    return this._document.body;
  },

  createDocumentFragment() {
    return this._document.createDocumentFragment();
  },

  getDocumentElement() {
    return this._document.documentElement;
  },

  getLocation() {
    return this._document.location;
  },

  getSelection() {
    return this._document.selection;
  },

  getReadyState(): DocumentReadyState {
    return this._document.readyState;
  },

  getHead() {
    return this._document.head;
  },

  hasDocumentProperty(property) {
    return property in this._document;
  },

  listen(element, event, callback, options) {
    if (!element || !('addEventListener' in element)) {
      return noop;
    }

    element.addEventListener(event, callback, options);

    return () => {
      element.removeEventListener(event, callback);
    };
  },

  elementsFromPoint(x, y, element) {
    const activeElementHolder = this.getRootNode(element);

    if (activeElementHolder.host) {
      return getShadowElementsFromPoint(x, y, activeElementHolder);
    }

    return activeElementHolder.elementsFromPoint(x, y);
  },
};

const domAdapter: DomAdapter = injector(nativeDOMAdapterStrategy);
export { domAdapter };
