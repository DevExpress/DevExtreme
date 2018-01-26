"use strict";

/* global document, Node */

var domAdapter = module.exports = {
    querySelectorAll: function(element, selector) {
        element = element || domAdapter.getDocument();
        return element.querySelectorAll(selector);
    },

    elementMatches: function(element, selector) {
        var matches = element.matches || element.matchesSelector || element.mozMatchesSelector ||
            element.msMatchesSelector || element.oMatchesSelector || element.webkitMatchesSelector ||
            function(selector) {
                var items = domAdapter.querySelectorAll(element.document || element.ownerDocument, selector);

                for(var i = 0; i < items.length; i++) {
                    if(items[i] === element) {
                        return true;
                    }
                }
            };

        return matches.call(element, selector);
    },

    createElement: function(tagName, context) {
        context = context || domAdapter.getDocument();
        return context.createElement(tagName);
    },

    createElementNS: function(ns, tagName, context) {
        context = context || domAdapter.getDocument();
        return context.createElementNS(ns, tagName);
    },

    createTextNode: function(text, context) {
        context = context || domAdapter.getDocument();
        return context.createTextNode(text);
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
        if(element.nodeType === 1) {
            if(element.classList) {
                if(isAdd) {
                    element.classList.add(className);
                } else {
                    element.classList.remove(className);
                }
            } else { //IE9
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

    getDocument: function() {
        return typeof document !== "undefined" && document;
    },

    getActiveElement: function() {
        var document = domAdapter.getDocument();
        return document.activeElement;
    },

    getBody: function() {
        var document = domAdapter.getDocument();
        return document.body;
    },

    createDocumentFragment: function() {
        var document = domAdapter.getDocument();
        return document.createDocumentFragment();
    },

    getDocumentElement: function() {
        var document = domAdapter.getDocument();
        return document.documentElement;
    },

    getLocation: function() {
        var document = domAdapter.getDocument();
        return document.location;
    },

    getSelection: function() {
        var document = domAdapter.getDocument();
        return document.selection;
    },

    getReadyState: function() {
        var document = domAdapter.getDocument();
        return document.readyState;
    },

    getHead: function() {
        var document = domAdapter.getDocument();
        return document.head;
    },

    listen: function(element, event, callback, useCapture) {
        element.addEventListener(event, callback, useCapture);

        return function() {
            element.removeEventListener(event, callback);
        };
    }
};
