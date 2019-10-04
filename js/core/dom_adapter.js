/* global document */
import injector from "./utils/dependency_injector";
import { noop } from "./utils/common";

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const DOCUMENT_NODE = 9;

const nativeDOMAdapterStrategy = {
    querySelectorAll(element, selector) {
        return element.querySelectorAll(selector);
    },

    elementMatches(element, selector) {
        const matches = element.matches || element.matchesSelector || element.mozMatchesSelector ||
            element.msMatchesSelector || element.oMatchesSelector || element.webkitMatchesSelector ||
            (selector => {
                const doc = element.document || element.ownerDocument;

                if(!doc) {
                    return false;
                }

                const items = this.querySelectorAll(doc, selector);

                for(let i = 0; i < items.length; i++) {
                    if(items[i] === element) {
                        return true;
                    }
                }
            });

        return matches.call(element, selector);
    },

    createElement(tagName, context) {
        context = context || this._document;
        return context.createElement(tagName);
    },

    createElementNS(ns, tagName, context) {
        context = context || this._document;
        return context.createElementNS(ns, tagName);
    },

    createTextNode(text, context) {
        context = context || this._document;
        return context.createTextNode(text);
    },

    isNode(element) {
        return typeof element === "object" && "nodeType" in element;
    },

    isElementNode(element) {
        return element && element.nodeType === ELEMENT_NODE;
    },

    isTextNode(element) {
        return element && element.nodeType === TEXT_NODE;
    },

    isDocument(element) {
        return element && element.nodeType === DOCUMENT_NODE;
    },

    removeElement(element) {
        const parentNode = element && element.parentNode;
        if(parentNode) {
            parentNode.removeChild(element);
        }
    },

    insertElement(parentElement, newElement, nextSiblingElement) {
        if(parentElement && newElement && parentElement !== newElement) {
            if(nextSiblingElement) {
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
        element.setAttribute(name, value);
    },

    removeAttribute(element, name) {
        element.removeAttribute(name);
    },

    setProperty(element, name, value) {
        element[name] = value;
    },

    setText(element, text) {
        if(element) {
            element.textContent = text;
        }
    },

    setClass(element, className, isAdd) {
        if(element.nodeType === 1 && className) {
            if(element.classList) {
                if(isAdd) {
                    element.classList.add(className);
                } else {
                    element.classList.remove(className);
                }
            } else { // IE9
                const classNameSupported = typeof element.className === 'string';
                const elementClass = classNameSupported ? element.className : (this.getAttribute(element, 'class') || '');
                const classNames = elementClass.split(" ");
                const classIndex = classNames.indexOf(className);
                let resultClassName;
                if(isAdd && classIndex < 0) {
                    resultClassName = elementClass ? elementClass + " " + className : className;
                }
                if(!isAdd && classIndex >= 0) {
                    classNames.splice(classIndex, 1);
                    resultClassName = classNames.join(" ");
                }
                if(resultClassName !== undefined) {
                    if(classNameSupported) {
                        element.className = resultClassName;
                    } else {
                        this.setAttribute(element, 'class', resultClassName);
                    }
                }
            }
        }
    },

    setStyle(element, name, value) {
        element.style[name] = value || '';
    },

    _document: typeof document === "undefined" ? undefined : document,

    getDocument() {
        return this._document;
    },

    getActiveElement() {
        return this._document.activeElement;
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

    getReadyState() {
        return this._document.readyState;
    },

    getHead() {
        return this._document.head;
    },

    hasDocumentProperty(property) {
        return property in this._document;
    },

    listen(element, event, callback, options) {
        if(!element || !("addEventListener" in element)) {
            return noop;
        }

        element.addEventListener(event, callback, options);

        return () => {
            element.removeEventListener(event, callback);
        };
    }
};

export default injector(nativeDOMAdapterStrategy);
