"use strict";

var $ = require("jquery");
var rendererStrategy = require("./native_renderer_strategy");
var typeUtils = require("./utils/type");
var matches = require("./polyfills/matches");

var methods = [
    "width", "height", "outerWidth", "innerWidth", "outerHeight", "innerHeight", "offset", "offsetParent", "position",
    "data", "removeData",
    "on", "off", "one", "trigger", "triggerHandler", "focusin", "focusout", "click",
    "html", "css",
    "val",
    "hide", "show", "toggle", "slideUp", "slideDown", "slideToggle", "focus", "blur", "submit"];

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

var repeatMethod = function(methodName, args) {
    for(var i = 0; i < this.length; i++) {
        var item = renderer(this[i]);
        item[methodName].apply(item, args);
    }
    return this;
};

var setAttributeValue = function(element, attrName, value) {
    if(value !== undefined && value !== null) {
        rendererStrategy.setAttribute(element, attrName, value);
    } else {
        rendererStrategy.removeAttribute(element, attrName);
    }
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

initRender.prototype.show = function() {
    return this.toggle(true);
};

initRender.prototype.hide = function() {
    return this.toggle(false);
};

initRender.prototype.toggle = function(value) {
    if(this[0]) {
        this.toggleClass("dx-state-invisible", !value);
    }

    return this;
};

initRender.prototype.attr = function(attrName, value) {
    if(this.length > 1 && arguments.length > 1) return repeatMethod.call(this, "attr", arguments);
    if(!this[0]) {
        if(typeUtils.isObject(attrName) || value !== undefined) {
            return this;
        } else {
            return undefined;
        }
    }
    if(!this[0].getAttribute) {
        return this.prop(attrName, value);
    }
    if(typeof attrName === "string" && arguments.length === 1) {
        var result = this[0].getAttribute(attrName);
        return result == null ? undefined : result;
    } else if(typeUtils.isPlainObject(attrName)) {
        for(var key in attrName) {
            this.attr(key, attrName[key]);
        }
    } else {
        setAttributeValue(this[0], attrName, value);
    }
    return this;
};

initRender.prototype.removeAttr = function(attrName) {
    this[0] && rendererStrategy.removeAttribute(this[0], attrName);
    return this;
};

initRender.prototype.prop = function(propName, value) {
    if(!this[0]) return this;
    if(typeof propName === "string" && arguments.length === 1) {
        return this[0][propName];
    } else if(typeUtils.isPlainObject(propName)) {
        for(var key in propName) {
            this.prop(key, propName[key]);
        }
    } else {
        rendererStrategy.setProperty(this[0], propName, value);
    }

    return this;
};

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

var appendElements = function(element, nextSibling) {
    if(!this[0]) return;

    if(typeUtils.type(element) === "string") {
        var html = element.trim();
        if(html[0] === "<" && html[html.length - 1] === ">") {
            element = renderer(element);
        } else {
            element = renderer("<div>").html(element).contents();
        }
    } else {
        element = renderer(element);
    }

    for(var i = 0; i < element.length; i++) {
        var item = element[i],
            container = this[0],
            wrapTR = container.tagName === "TABLE" && item.tagName === "TR";

        if(wrapTR && container.tBodies.length) {
            container = container.tBodies[0];
        }
        rendererStrategy.insertElement(container, item.nodeType ? item : item[0], nextSibling);
    }
};

initRender.prototype.prepend = function(element) {
    if(arguments.length > 1) {
        for(var i = 0; i < arguments.length; i++) {
            this.prepend(arguments[i]);
        }
        return this;
    }
    appendElements.apply(this, [element, this[0].firstChild]);
    return this;
};

initRender.prototype.append = function(element) {
    if(arguments.length > 1) {
        for(var i = 0; i < arguments.length; i++) {
            this.append(arguments[i]);
        }
        return this;
    }
    appendElements.apply(this, [element]);
    return this;
};

initRender.prototype.prependTo = function(element) {
    element = renderer(element);
    if(element[0]) {
        rendererStrategy.insertElement(element[0], this[0], element[0].firstChild);
    }

    return this;
};

initRender.prototype.appendTo = function(element) {
    if(this.length > 1) {
        return repeatMethod.call(this, "appendTo", arguments);
    }

    rendererStrategy.insertElement(renderer(element)[0], this[0]);
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

initRender.prototype.wrap = function(wrapper) {
    if(this[0]) {
        var wrap = renderer(wrapper);

        wrap.insertBefore(this);
        wrap.append(this);
    }

    return this;
};

initRender.prototype.wrapInner = function(wrapper) {
    var contents = this.contents();

    if(contents.length) {
        contents.wrap(wrapper);
    } else {
        this.append(wrapper);
    }

    return this;
};

initRender.prototype.replaceWith = function(element) {
    this.$element.replaceWith(element.$element || element);
    return this;
};

var cleanData = function(node, cleanSelf) {
    if(!node) {
        return;
    }

    var childNodes = node.getElementsByTagName("*");

    renderer.cleanData(childNodes);
    if(cleanSelf) {
        renderer.cleanData([node]);
    }
};

initRender.prototype.remove = function() {
    if(this.length > 1) {
        return repeatMethod.call(this, "remove", arguments);
    }

    cleanData(this[0], true);
    rendererStrategy.removeElement(this[0]);

    return this;
};

initRender.prototype.detach = function() {
    if(this.length > 1) {
        return repeatMethod.call(this, "detach", arguments);
    }

    rendererStrategy.removeElement(this[0]);

    return this;
};

initRender.prototype.empty = function() {
    if(this.length > 1) {
        return repeatMethod.call(this, "empty", arguments);
    }

    cleanData(this[0]);
    rendererStrategy.setText(this[0], "");

    return this;
};

initRender.prototype.clone = function() {
    var result = [];
    for(var i = 0; i < this.length; i++) {
        result.push(this[i].cloneNode(true));
    }
    return renderer(result);
};

initRender.prototype.text = function(text) {
    if(!arguments.length) {
        var result = "";

        for(var i = 0; i < this.length; i++) {
            result += this[i] && this[i].textContent || "";
        }
        return result;
    }

    cleanData(this[0], false);

    text = text === undefined ? "" : text;
    rendererStrategy.setText(this[0], text);

    return this;
};

initRender.prototype.contents = function() {
    return renderer(this[0] ? this[0].childNodes : []);
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
                    setAttributeValue(element, "id", queryId);
                }
                queryId = "[id='" + queryId + "'] ";

                var querySelector = queryId + selector.replace(/([^\\])(\,)/g, "$1, " + queryId);
                nodes.push.apply(nodes, element.querySelectorAll(querySelector));
                setAttributeValue(element, "id", elementId);
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

var isVisible = function(_, element) {
    if(!element.nodeType) return true;
    return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
};

initRender.prototype.filter = function(selector) {
    if(!selector) return renderer();

    if(selector === ":visible") {
        return this.filter(isVisible);
    } else if(selector === ":hidden") {
        return this.filter(function(_, element) {
            return !isVisible(_, element);
        });
    }

    var result = [];
    for(var i = 0; i < this.length; i++) {
        var item = this[i];
        if(item.nodeType === Node.ELEMENT_NODE && typeUtils.type(selector) === "string") {
            matches(item, selector) && result.push(item);
        } else if(selector.nodeType || typeUtils.isWindow(selector)) {
            selector === item && result.push(item);
        } else if(typeUtils.isFunction(selector)) {
            selector.call(item, i, item) && result.push(item);
        } else {
            for(var j = 0; j < selector.length; j++) {
                selector[j] === item && result.push(item);
            }
        }
    }

    return renderer(result);
};

initRender.prototype.not = function(selector) {
    var result = [],
        nodes = this.filter(selector).toArray();

    for(var i = 0; i < this.length; i++) {
        if(nodes.indexOf(this[i]) === -1) {
            result.push(this[i]);
        }
    }

    return renderer(result);
};

initRender.prototype.is = function(selector) {
    return !!this.filter(selector).length;
};

initRender.prototype.children = function(selector) {
    var result = [];
    for(var i = 0; i < this.length; i++) {
        var nodes = this[i] ? this[i].childNodes : [];
        for(var j = 0; j < nodes.length; j++) {
            if(nodes[j].nodeType === Node.ELEMENT_NODE) {
                result.push(nodes[j]);
            }
        }
    }

    result = renderer(result);

    return selector ? result.filter(selector) : result;
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

initRender.prototype.each = function(callback) {
    for(var i = 0; i < this.length; i++) {
        if(callback.call(this[i], i, this[i]) === false) {
            break;
        }
    }
};

initRender.prototype.index = function(element) {
    if(!element) {
        return this.parent().children().index(this);
    }

    element = renderer(element);
    return this.toArray().indexOf(element[0]);
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

var getWindow = function(element) {
    return typeUtils.isWindow(element) ? element : element.defaultView;
};

initRender.prototype.offset = function() {
    if(!this[0]) return;

    if(!this[0].getClientRects().length) {
        return {
            top: 0,
            left: 0
        };
    }

    var rect = this[0].getBoundingClientRect();
    var win = getWindow(this[0].ownerDocument);
    var docElem = this[0].ownerDocument.documentElement;

    return {
        top: rect.top + win.pageYOffset - docElem.clientTop,
        left: rect.left + win.pageXOffset - docElem.clientLeft
    };
};

initRender.prototype.offsetParent = function() {
    if(!this[0]) return renderer();

    var offsetParent = renderer(this[0].offsetParent);

    while(offsetParent[0] && offsetParent.css("position") === "static") {
        offsetParent = renderer(offsetParent[0].offsetParent);
    }

    offsetParent = offsetParent[0] ? offsetParent : renderer(document.documentElement);

    return offsetParent;
};

initRender.prototype.position = function() {
    if(!this[0]) return;

    var offset;
    var marginTop = parseFloat(this.css("marginTop"));
    var marginLeft = parseFloat(this.css("marginLeft"));

    if(this.css("position") === "fixed") {
        offset = this[0].getBoundingClientRect();

        return {
            top: offset.top - marginTop,
            left: offset.left - marginLeft
        };
    }

    offset = this.offset();

    var offsetParent = this.offsetParent();
    var parentOffset = {
        top: 0,
        left: 0
    };

    if(offsetParent[0].nodeName !== "HTML") {
        parentOffset = offsetParent.offset();
    }

    parentOffset = {
        top: parentOffset.top + parseFloat(offsetParent.css("borderTopWidth")),
        left: parentOffset.left + parseFloat(offsetParent.css("borderLeftWidth"))
    };

    return {
        top: offset.top - parentOffset.top - marginTop,
        left: offset.left - parentOffset.left - marginLeft
    };
};

[{
    name: "scrollLeft",
    offsetProp: "pageXOffset",
    scrollWindow: function(win, value) {
        win.scrollTo(value, win.pageYOffset);
    }
}, {
    name: "scrollTop",
    offsetProp: "pageYOffset",
    scrollWindow: function(win, value) {
        win.scrollTo(win.pageXOffset, value);
    }
}].forEach(function(directionStrategy) {
    var propName = directionStrategy.name;

    initRender.prototype[propName] = function(value) {
        if(!this[0]) {
            return;
        }

        var window = getWindow(this[0]);

        if(value === undefined) {
            return window ? window[directionStrategy.offsetProp] : this[0][propName];
        }

        if(window) {
            directionStrategy.scrollWindow(window, value);
        } else {
            this[0][propName] = value;
        }
        return this;
    };
});

renderer.tmpl = function() {
    return $.tmpl.apply(this, arguments);
};
renderer.templates = function() {
    return $.templates.apply(this, arguments);
};
renderer._data = $._data;
renderer.data = $.data;
renderer.removeData = $.removeData;

renderer.cleanData = function(element) {
    $.cleanData($(element));
};

renderer.when = $.when;
renderer.event = $.event;
renderer.Event = $.Event;
renderer.easing = $.easing;
renderer.holdReady = $.holdReady || $.fn.holdReady;
renderer.makeArray = $.makeArray;
renderer.contains = $.contains;
renderer.Deferred = $.Deferred;
renderer.map = $.map;
renderer.each = $.each;

module.exports = {
    set: function(strategy) { renderer = strategy; },
    get: function() { return renderer; }
};
