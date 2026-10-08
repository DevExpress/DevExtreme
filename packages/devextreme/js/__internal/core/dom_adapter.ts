/* global document */
import { noop } from '@js/core/utils/common';
import { getShadowElementsFromPoint } from '@js/core/utils/shadow_dom';
import type { Injectable } from '@ts/core/utils/dependency_injector';
import { injector } from '@ts/core/utils/dependency_injector';

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const DOCUMENT_NODE = 9;
const DOCUMENT_FRAGMENT_NODE = 11;

type ListenOptions = boolean | AddEventListenerOptions;

type ListenCallback = EventListenerOrEventListenerObject | ((...args: never[]) => unknown);

type RootNode = Document | DocumentFragment;

type ActiveElementHolder = Document | ShadowRoot;

type MatchesFn = (this: Element, selector: string) => boolean;

interface LegacyMatchesElement extends Element {
  matchesSelector?: MatchesFn;
  mozMatchesSelector?: MatchesFn;
  msMatchesSelector?: MatchesFn;
  oMatchesSelector?: MatchesFn;
  document?: Document;
}

interface DomAdapterStrategy {
  querySelectorAll: (element: ParentNode, selector: string) => NodeListOf<Element>;
  elementMatches: (element: Element, selector: string) => boolean;
  getActiveElement: (element?: HTMLElement | null) => HTMLElement;
  getDocument: () => Document;
  getDocumentElement: () => HTMLElement;
  getHead: () => HTMLHeadElement;
  listen: (
    element: EventTarget | null | undefined,
    event: string,
    callback: ListenCallback,
    options?: ListenOptions,
  ) => () => void;
  getReadyState: () => DocumentReadyState;
  isNode: (node: unknown) => node is Node;
  isElementNode: (element: unknown) => boolean;
  isTextNode: (element: unknown) => boolean;
  isDocument: (element: unknown) => boolean;
  isDocumentFragment: (element: unknown) => boolean;
  getBody: () => HTMLBodyElement;
  getLocation: () => Location;
  getSelection: () => unknown;
  hasDocumentProperty: (property: string) => boolean;
  getRootNode: (element?: HTMLElement | null) => RootNode;
  getAttribute: (element: Element, name: string) => string | null;
  setAttribute: (element: Element, name: string, value: string) => void;
  createAttribute: (text: string, context?: Document) => Attr;
  removeAttribute: (element: Element, name: string) => void;
  createElement: (tagName: string, context?: Document) => HTMLElement;
  createElementNS: (ns: string, tagName: string, context?: Document) => Element;
  createDocumentFragment: () => DocumentFragment;
  createTextNode: (text: string, context?: Document) => Text;
  setClass: (element: Element, className: string, isAdd: boolean) => void;
  setText: (element: Node | null | undefined, text: string | null) => void;
  setProperty: (element: Element, name: string, value: unknown) => void;
  removeElement: (element: Node | null | undefined) => void;
  setStyle: (element: HTMLElement, name: string, value: string) => void;
  insertElement: (
    parentElement: Node | null | undefined,
    newElement: Node | null | undefined,
    nextSiblingElement?: Node | null,
  ) => void;
  elementsFromPoint: (x: number, y: number, element?: HTMLElement | null) => Element[];
  _document: Document;
}

export type DomAdapter = Injectable<DomAdapterStrategy>;

const nativeDOMAdapterStrategy: DomAdapterStrategy = {
  querySelectorAll(element, selector) {
    return element.querySelectorAll(selector);
  },

  elementMatches(this: DomAdapterStrategy, element, selector) {
    const legacyElement = element as LegacyMatchesElement;
    const matches: MatchesFn = legacyElement.matches || legacyElement.matchesSelector
            || legacyElement.mozMatchesSelector || legacyElement.msMatchesSelector
            || legacyElement.oMatchesSelector || legacyElement.webkitMatchesSelector
            || ((candidate: string): boolean => {
              const doc = legacyElement.document ?? legacyElement.ownerDocument;

              if (!doc) {
                return false;
              }

              const items = this.querySelectorAll(doc, candidate);
              const { length } = items;

              for (let i = 0; i < length; i += 1) {
                if (items[i] === element) {
                  return true;
                }
              }

              return false;
            });

    return matches.call(element, selector);
  },

  createElement(this: DomAdapterStrategy, tagName, context) {
    const doc = context ?? this._document;
    return doc.createElement(tagName);
  },

  createElementNS(this: DomAdapterStrategy, ns, tagName, context) {
    const doc = context ?? this._document;
    return doc.createElementNS(ns, tagName);
  },

  createTextNode(this: DomAdapterStrategy, text, context) {
    const doc = context ?? this._document;
    return doc.createTextNode(text);
  },

  createAttribute(this: DomAdapterStrategy, text: string, context?: Document) {
    const doc = context ?? this._document;
    return doc.createAttribute(text);
  },

  isNode(element: unknown): element is Node {
    return !!element && typeof element === 'object' && 'nodeType' in element && 'nodeName' in element;
  },

  isElementNode(element) {
    return !!element && (element as Node).nodeType === ELEMENT_NODE;
  },

  isTextNode(element) {
    return !!element && (element as Node).nodeType === TEXT_NODE;
  },

  isDocument(element) {
    return !!element && (element as Node).nodeType === DOCUMENT_NODE;
  },

  isDocumentFragment(element) {
    return !!element && (element as Node).nodeType === DOCUMENT_FRAGMENT_NODE;
  },

  removeElement(element) {
    const parentNode = element?.parentNode;
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
      (element as HTMLElement).style.cssText = value;
    } else {
      element.setAttribute(name, value);
    }
  },

  removeAttribute(element, name) {
    element.removeAttribute(name);
  },

  setProperty(element, name, value) {
    (element as unknown as Record<string, unknown>)[name] = value;
  },

  setText(element, text) {
    if (element) {
      element.textContent = text;
    }
  },

  setClass(element, className, isAdd) {
    if (element.nodeType === 1 && className) {
      if (isAdd) {
        element.classList.add(className);
      } else {
        element.classList.remove(className);
      }
    }
  },

  setStyle(element, name, value) {
    (element.style as unknown as Record<string, string>)[name] = value || '';
  },

  _document: (typeof document === 'undefined' ? undefined : document) as Document,

  getDocument(this: DomAdapterStrategy) {
    return this._document;
  },

  getActiveElement(this: DomAdapterStrategy, element) {
    const activeElementHolder = this.getRootNode(element);

    return (activeElementHolder as ActiveElementHolder).activeElement as HTMLElement;
  },

  getRootNode(this: DomAdapterStrategy, element) {
    return (element?.getRootNode?.() ?? this._document) as RootNode;
  },

  getBody(this: DomAdapterStrategy) {
    return this._document.body as HTMLBodyElement;
  },

  createDocumentFragment(this: DomAdapterStrategy) {
    return this._document.createDocumentFragment();
  },

  getDocumentElement(this: DomAdapterStrategy) {
    return this._document.documentElement;
  },

  getLocation(this: DomAdapterStrategy) {
    return this._document.location;
  },

  getSelection(this: DomAdapterStrategy) {
    return (this._document as Document & { selection?: unknown }).selection;
  },

  getReadyState(this: DomAdapterStrategy): DocumentReadyState {
    return this._document.readyState;
  },

  getHead(this: DomAdapterStrategy) {
    return this._document.head;
  },

  hasDocumentProperty(this: DomAdapterStrategy, property) {
    return property in this._document;
  },

  listen(element, event, callback, options) {
    if (!element || !('addEventListener' in element)) {
      return noop;
    }

    element.addEventListener(event, callback as EventListenerOrEventListenerObject, options);

    return () => {
      element.removeEventListener(event, callback as EventListenerOrEventListenerObject);
    };
  },

  elementsFromPoint(this: DomAdapterStrategy, x, y, element) {
    const activeElementHolder = this.getRootNode(element);

    if ((activeElementHolder as ShadowRoot).host) {
      return getShadowElementsFromPoint(x, y, activeElementHolder) as Element[];
    }

    return (activeElementHolder as Document).elementsFromPoint(x, y);
  },
};

const domAdapter: DomAdapter = injector(nativeDOMAdapterStrategy);
export { domAdapter };
export default domAdapter;
