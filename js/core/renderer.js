"use strict";

var $ = require("jquery"),
    rendererStrategy = require("./native_renderer_strategy");

var useJQueryRenderer = window.useJQueryRenderer !== false;

var methods = [
    "width", "height", "outerWidth", "innerWidth", "outerHeight", "innerHeight", "offset", "offsetParent", "position", "scrollLeft", "scrollTop",
    "data", "removeData",
    "on", "off", "one", "trigger", "triggerHandler", "focusin", "focusout", "click",
    "css", "attr", "removeAttr", "prop", "removeProp",
    "remove", "detach", "empty", "text",
    "html", "is", "not", "wrapInner", "wrap",
    "each", "val", "index",
    "hide", "show", "toggle", "slideUp", "slideDown", "slideToggle", "focus", "blur", "submit", "has"];

var renderer = function(selector, context) {
    return new initRender(selector, context);
};

var initRender = function(selector, context) {
    if(selector instanceof initRender) {
        this.$element = selector.$element;
    } else {
        this.$element = new $.fn.init(selector, context);
    }

    this.length = 0;
    for(var i = 0; i < this.$element.length; i++) {
        [].push.call(this, this.$element[i]);
    }
};

renderer.fn = { jquery: $.fn.jquery };
initRender.prototype = renderer.fn;

if(!useJQueryRenderer) {
    var repeatMethod = function(methodName, args) {
        for(var i = 0; i < this.length; i++) {
            var item = renderer(this[i]);
            item[methodName].apply(item, args);
        }
        return this;
    };

    methods.forEach(function(method) {
        var methodName = method;
        initRender.prototype[method] = function() {
            var result = this.$element[methodName].apply(this.$element, arguments);
            if(result === this.$element) {
                return this;
            }
            return result;
        };
    });

    initRender.prototype.addClass = function(className) {
        return this.toggleClass(className, true);
    };

    initRender.prototype.removeClass = function(className) {
        return this.toggleClass(className, false);
    };

    initRender.prototype.hasClass = function(className) {
        if(!this[0] || this[0].className === undefined) return false;

        var classNames = className.split(" ");
        for(var i = 0; i < classNames.length; i++) {
            if(this[0].classList) {
                if(this[0].classList.contains(classNames[i])) return true;
            } else { //IE9
                if(this[0].className.split(" ").indexOf(classNames[i]) >= 0) return true;
            }
        }
        return false;
    };

    initRender.prototype.toggleClass = function(className, value) {
        if(this.length > 1) {
            return repeatMethod.call(this, "toggleClass", arguments);
        }

        if(!this[0] || !className) return this;
        value = value === undefined ? !this.hasClass(className) : value;

        var classNames = className.split(" ");
        for(var i = 0; i < classNames.length; i++) {
            rendererStrategy.setClass(this[0], classNames[i], value);
        }
        return this;
    };

    initRender.prototype.prepend = function(element) {
        this.$element.prepend(element.$element || element);
        return this;
    };
    initRender.prototype.append = function() {
        for(var i = 0; i < arguments.length; i++) {
            var element = arguments[i];
            element && this.$element.append(element.$element || element);
        }
        return this;
    };
    initRender.prototype.prependTo = function(element) {
        this.$element.prependTo(element.$element || element);
        return this;
    };
    initRender.prototype.appendTo = function(element) {
        if(!element) return this;
        this.$element.appendTo(element.$element || element);
        return this;
    };

    initRender.prototype.insertBefore = function(element) {
        if(element && element[0]) {
            rendererStrategy.insertElement(element[0].parentNode, this[0], element[0]);
        }
        return this;
    };

    initRender.prototype.insertAfter = function(element) {
        if(element && element[0]) {
            rendererStrategy.insertElement(element[0].parentNode, this[0], element[0].nextSibling);
        }
        return this;
    };

    initRender.prototype.before = function(element) {
        if(this[0]) {
            rendererStrategy.insertElement(this[0].parentNode, element[0], this[0]);
        }
        return this;
    };

    initRender.prototype.after = function(element) {
        if(this[0]) {
            rendererStrategy.insertElement(this[0].parentNode, element[0], this[0].nextSibling);
        }
        return this;
    };

    initRender.prototype.replaceWith = function(element) {
        this.$element.replaceWith(element.$element || element);
        return this;
    };

    initRender.prototype.clone = function() {
        var result = [];
        for(var i = 0; i < this.length; i++) {
            result.push(this[i].cloneNode(true));
        }
        return renderer(result);
    };

    initRender.prototype.contents = function() {
        return renderer(this.$element.contents());
    };

    initRender.prototype.find = function(selector) {
        var result = renderer();
        if(!selector) {
            return result;
        }

        var nodes = [],
            i;

        if(typeof selector === "string") {
            selector = selector.trim();

            for(i = 0; i < this.length; i++) {
                var element = this[i];
                if(element.nodeType === Node.ELEMENT_NODE) {
                    var elementId = element.getAttribute("id"),
                        queryId = elementId || "dx-query-children";

                    if(!elementId) {
                        rendererStrategy.setAttribute(element, "id", queryId);
                    }
                    queryId = "#" + queryId + " ";

                    var querySelector = queryId + selector.replace(",", ", " + queryId);
                    nodes.push.apply(nodes, element.querySelectorAll(querySelector));
                    rendererStrategy.setAttribute(element, "id", elementId);
                } else if(element.nodeType === Node.DOCUMENT_NODE) {
                    nodes.push.apply(nodes, element.querySelectorAll(selector));
                }
            }
        } else {
            for(i = 0; i < this.length; i++) {
                selector = selector.nodeType ? selector : selector[0];
                if(renderer.contains(this[i], selector)) {
                    nodes.push(selector);
                }
            }
        }

        return result.add(nodes);
    };

    initRender.prototype.filter = function() {
        return renderer(this.$element.filter.apply(this.$element, arguments));
    };
    initRender.prototype.children = function() {
        return renderer(this.$element.children.apply(this.$element, arguments));
    };

    initRender.prototype.siblings = function() {
        var element = this[0];
        if(!element || !element.parentNode) {
            return renderer();
        }

        var result = [],
            parentChildNodes = element.parentNode.childNodes || [];

        for(var i = 0; i < parentChildNodes.length; i++) {
            var node = parentChildNodes[i];
            if(node.nodeType === Node.ELEMENT_NODE && node !== element) {
                result.push(node);
            }
        }

        return renderer(result);
    };

    initRender.prototype.get = function(index) {
        return this[index < 0 ? this.length + index : index];
    };

    initRender.prototype.eq = function(index) {
        index = index < 0 ? this.length + index : index;
        return renderer(this[index]);
    };

    initRender.prototype.first = function() {
        return this.eq(0);
    };

    initRender.prototype.last = function() {
        return this.eq(-1);
    };

    initRender.prototype.parent = function(selector) {
        if(!this[0]) return renderer();
        var result = renderer(this[0].parentNode);
        return !selector || result.is(selector) ? result : renderer();
    };

    initRender.prototype.parents = function(selector) {
        var result = [],
            parent = this.parent();

        while(parent && parent[0] && parent[0].nodeType !== Node.DOCUMENT_NODE) {
            if(parent[0].nodeType === Node.ELEMENT_NODE) {
                if(!selector || (selector && parent.is(selector))) {
                    result.push(parent.get(0));
                }
            }
            parent = parent.parent();
        }
        return renderer(result);
    };

    initRender.prototype.closest = function(selector) {
        if(this.is(selector)) {
            return this;
        }

        var parent = this.parent();
        while(parent && parent.length) {
            if(parent.is(selector)) {
                return parent;
            }
            parent = parent.parent();
        }

        return renderer();
    };

    initRender.prototype.next = function(selector) {
        if(!this[0]) return renderer();
        var next = renderer(this[0].nextSibling);
        if(!arguments.length) {
            return next;
        }
        while(next && next.length) {
            if(next.is(selector)) return next;
            next = next.next();
        }
        return renderer();
    };

    initRender.prototype.prev = function() {
        if(!this[0]) return renderer();
        return renderer(this[0].previousSibling);
    };

    initRender.prototype.add = function(selector) {
        var targets = renderer(selector),
            result = this.toArray();

        for(var i = 0; i < targets.length; i++) {
            var target = targets[i];
            if(result.indexOf(target) === -1) {
                result.push(target);
            }
        }

        return renderer(result);
    };

    var emptyArray = [];
    initRender.prototype.splice = function() {
        return renderer(emptyArray.splice.apply(this, arguments));
    };
    initRender.prototype.slice = function() {
        return renderer(emptyArray.slice.apply(this, arguments));
    };
    initRender.prototype.toArray = function() {
        return emptyArray.slice.call(this);
    };
}

renderer.ajax = function() {
    return $.ajax.apply(this, arguments);
};
renderer.getJSON = $.getJSON;
renderer.getScript = $.getScript;
renderer.parseXML = $.parseXML;
renderer.tmpl = function() {
    return $.tmpl.apply(this, arguments);
};
renderer.templates = function() {
    return $.templates.apply(this, arguments);
};
renderer.merge = $.merge;
renderer.param = $.param;
renderer._data = $._data;
renderer.data = $.data;
renderer.removeData = $.removeData;
renderer.cleanData = $.cleanData;
renderer.when = $.when;
renderer.event = $.event;
renderer.Event = $.Event;
renderer.easing = $.easing;
renderer.holdReady = $.holdReady || $.fn.holdReady;
renderer.makeArray = $.makeArray;
renderer.contains = $.contains;
renderer.Callbacks = $.Callbacks;
renderer.Deferred = $.Deferred;
renderer.map = $.map;
renderer.each = $.each;

module.exports = useJQueryRenderer ? $ : renderer;
