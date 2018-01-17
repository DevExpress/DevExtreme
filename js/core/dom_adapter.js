"use strict";

/* global window */
var domAdapter = module.exports = {
    createElement: function(tagName, text, context) {
        context = context || this.getWindow().document;
        if(tagName === "#text") {
            return context.createTextNode(text);
        }

        return context.createElement(typeof tagName === "string" ? tagName : "div");
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

    setEvent: function(element, name, value) {
        element.addEventListener(name, value);
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

    getWindow: function() {
        return domAdapter._window;
    },

    _window: window,

    ready: function(callback) {
        domAdapter._readyCallbacks.add(callback);

        var document = domAdapter.getWindow().document;

        if(!document) {
            return;
        }

        //NOTE: we can't use document.readyState === "interactive" because of ie9/ie10 support
        if(document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
            callback();
            return;
        }

        if(!domAdapter._contentLoadedListening) {
            domAdapter._contentLoadedListening = true;
            var loadedCallback = function() {
                domAdapter._readyCallbacks.fire();
                document.removeEventListener("DOMContentLoaded", loadedCallback);
            };
            document.addEventListener("DOMContentLoaded", loadedCallback);
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
