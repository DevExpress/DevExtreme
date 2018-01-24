"use strict";

/* global window */
var domAdapter = module.exports = {
    querySelectorAll: function(element, selector) {
        return element.querySelectorAll(selector);
    },

    createElement: function(tagName, context) {
        context = context || domAdapter.getWindow().document;
        return context.createElement(tagName);
    },

    createElementNS: function(ns, tagName, context) {
        context = context || domAdapter.getWindow().document;
        return context.createElementNS(ns, tagName);
    },

    createTextNode: function(text, context) {
        context = context || domAdapter.getWindow().document;
        return context.createTextNode(text);
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

    getActiveElement: function() {
        var document = domAdapter.getWindow().document;
        return document.activeElement;
    },

    getBody: function() {
        var document = domAdapter.getWindow().document;
        return document.body;
    },

    createDocumentFragment: function() {
        var document = domAdapter.getWindow().document;
        return document.createDocumentFragment();
    },

    getDocumentElement: function() {
        var document = domAdapter.getWindow().document;
        return document.documentElement;
    },

    getLocation: function() {
        var document = domAdapter.getWindow().document;
        return document.location;
    },

    getReadyState: function() {
        var document = domAdapter.getWindow().document;
        return document.readyState;
    },

    getHead: function() {
        var document = domAdapter.getWindow().document;
        return document.head;
    },

    getWindow: function() {
        return domAdapter._window;
    },

    _window: typeof window === "undefined" ? {} : window,

    hasDocument: function() {
        return "document" in domAdapter.getWindow();
    },

    listen: function(element, event, callback, useCapture) {
        element.addEventListener(event, callback, useCapture);
    },

    ready: function(callback) {
        domAdapter._readyCallbacks.add(callback);

        if(!domAdapter.hasDocument()) {
            return;
        }

        var document = domAdapter.getWindow().document;

        //NOTE: we can't use document.readyState === "interactive" because of ie9/ie10 support
        if(domAdapter.getReadyState() === "complete" || (domAdapter.getReadyState() !== "loading" && !domAdapter.getDocumentElement().doScroll)) {
            callback();
            return;
        }

        if(!domAdapter._contentLoadedListening) {
            domAdapter._contentLoadedListening = true;
            var loadedCallback = function() {
                domAdapter._readyCallbacks.fire();
                document.removeEventListener("DOMContentLoaded", loadedCallback);
            };
            domAdapter.listen(document, "DOMContentLoaded", loadedCallback);
        }
    },

    _readyCallbacks: (function() {
        var callbacks = [];
        return {
            add: function(callback) {
                callbacks.push(callback);
            },
            fire: function() {
                callbacks.forEach(function(callback) {
                    callback();
                });
            }
        };
    })()
};
