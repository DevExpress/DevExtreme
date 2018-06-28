"use strict";

/* global document, Node */

var injector = require("./utils/dependency_injector");
var noop = require("./utils/common").noop;

var nativeDOMAdapterStrategy = {
    querySelectorAll: function(element, selector) {
        return element.querySelectorAll(selector);
    },

    elementMatches: function(element, selector) {
        var matches = element.matches || element.matchesSelector || element.mozMatchesSelector ||
            element.msMatchesSelector || element.oMatchesSelector || element.webkitMatchesSelector ||
            function(selector) {
                var doc = element.document || element.ownerDocument;

                if(!doc) {
                    return false;
                }

                var items = this.querySelectorAll(doc, selector);

                for(var i = 0; i < items.length; i++) {
                    if(items[i] === element) {
                        return true;
                    }
                }
            }.bind(this);

        return matches.call(element, selector);
    },

    createElement: function(tagName, context) {
        context = context || this._document;
        return context.createElement(tagName);
    },

    createElementNS: function(ns, tagName, context) {
        context = context || this._document;
        return context.createElementNS(ns, tagName);
    },

    createTextNode: function(text, context) {
        context = context || this._document;
        return context.createTextNode(text);
    },

    isNode: function(element) {
        return typeof element === "object" && "nodeType" in element;
    },

    isElementNode: function(element) {
        return element && element.nodeType === Node.ELEMENT_NODE;
    },

    isTextNode: function(element) {
        return element && element.nodeType === Node.TEXT_NODE;
    },

    isDocument: function(element) {
        return element && element.nodeType === Node.DOCUMENT_NODE;
    },

    removeElement: function(element) {
        var parentNode = element && element.parentNode;
        if(parentNode) {
            parentNode.removeChild(element);
        }
    },

    insertElement: function(parentElement, newElement, nextSiblingElement) {
        if(parentElement && newElement && parentElement !== newElement) {
            if(nextSiblingElement) {
                parentElement.insertBefore(newElement, nextSiblingElement);
            } else {
                parentElement.appendChild(newElement);
            }
        }
    },

    setAttribute: function(element, name, value) {
        element.setAttribute(name, value);
    },

    removeAttribute: function(element, name) {
        element.removeAttribute(name);
    },

    setProperty: function(element, name, value) {
        element[name] = value;
    },

    setText: function(element, text) {
        if(element) {
            element.textContent = text;
        }
    },

    setClass: function(element, className, isAdd) {
        if(element.nodeType === 1 && className) {
            if(element.classList) {
                if(isAdd) {
                    element.classList.add(className);
                } else {
                    element.classList.remove(className);
                }
            } else { // IE9
                var classNames = element.className.split(" ");
                var classIndex = classNames.indexOf(className);
                if(isAdd && classIndex < 0) {
                    element.className = element.className ? element.className + " " + className : className;
                }
                if(!isAdd && classIndex >= 0) {
                    classNames.splice(classIndex, 1);
                    element.className = classNames.join(" ");
                }
            }
        }
    },

    setStyle: function(element, name, value) {
        element.style[name] = value || '';
    },

    _document: typeof document === "undefined" ? undefined : document,

    getDocument: function() {
        return this._document;
    },

    getActiveElement: function() {
        return this._document.activeElement;
    },

    getBody: function() {
        return this._document.body;
    },

    createDocumentFragment: function() {
        return this._document.createDocumentFragment();
    },

    getDocumentElement: function() {
        return this._document.documentElement;
    },

    getLocation: function() {
        return this._document.location;
    },

    getSelection: function() {
        return this._document.selection;
    },

    getReadyState: function() {
        return this._document.readyState;
    },

    getHead: function() {
        return this._document.head;
    },

    hasDocumentProperty: function(property) {
        return property in this._document;
    },

    listen: function(element, event, callback, options) {
        if(!element || !("addEventListener" in element)) {
            return noop;
        }

        element.addEventListener(event, callback, options);

        return function() {
            element.removeEventListener(event, callback);
        };
    }
};

module.exports = injector(nativeDOMAdapterStrategy);
