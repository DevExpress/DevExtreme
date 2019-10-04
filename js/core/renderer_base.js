var dataUtils = require("./element_data");
var domAdapter = require("./dom_adapter").default;
var windowUtils = require("./utils/window");
var window = windowUtils.getWindow();
var typeUtils = require("./utils/type");
var styleUtils = require("./utils/style");
var sizeUtils = require("./utils/size");
var htmlParser = require("./utils/html_parser");

var renderer = function(selector, context) {
    return new initRender(selector, context);
};

var initRender = function(selector, context) {
    if(!selector) {
        this.length = 0;
        return this;
    }

    if(typeof selector === "string") {
        if(selector === "body") {
            this[0] = context ? context.body : domAdapter.getBody();
            this.length = 1;
            return this;
        }

        context = context || domAdapter.getDocument();
        if(selector[0] === "<") {
            this[0] = domAdapter.createElement(selector.slice(1, -1), context);
            this.length = 1;
            return this;
        }

        [].push.apply(this, domAdapter.querySelectorAll(context, selector));
        return this;
    } else if(domAdapter.isNode(selector) || typeUtils.isWindow(selector)) {
        this[0] = selector;
        this.length = 1;
        return this;
    } else if(Array.isArray(selector)) {
        [].push.apply(this, selector);
        return this;
    }

    return renderer(selector.toArray ? selector.toArray() : [selector]);
};

renderer.fn = { dxRenderer: true };
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
        domAdapter.setAttribute(element, attrName, value);
    } else {
        domAdapter.removeAttribute(element, attrName);
    }
};

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
    this[0] && domAdapter.removeAttribute(this[0], attrName);
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
        domAdapter.setProperty(this[0], propName, value);
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
        } else { // IE9
            const className = typeUtils.isString(this[0].className) ? this[0].className : domAdapter.getAttribute(this[0], 'class');
            if((className || "").split(" ").indexOf(classNames[i]) >= 0) return true;
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
        domAdapter.setClass(this[0], classNames[i], value);
    }
    return this;
};

["width", "height", "outerWidth", "outerHeight", "innerWidth", "innerHeight"].forEach(function(methodName) {
    var partialName = methodName.toLowerCase().indexOf("width") >= 0 ? "Width" : "Height";
    var propName = partialName.toLowerCase();
    var isOuter = methodName.indexOf("outer") === 0;
    var isInner = methodName.indexOf("inner") === 0;

    initRender.prototype[methodName] = function(value) {
        if(this.length > 1 && arguments.length > 0) {
            return repeatMethod.call(this, methodName, arguments);
        }

        var element = this[0];

        if(!element) {
            return;
        }

        if(typeUtils.isWindow(element)) {
            return isOuter ? element["inner" + partialName] : domAdapter.getDocumentElement()["client" + partialName];
        }

        if(domAdapter.isDocument(element)) {
            var documentElement = domAdapter.getDocumentElement(),
                body = domAdapter.getBody();

            return Math.max(
                body["scroll" + partialName],
                body["offset" + partialName],
                documentElement["scroll" + partialName],
                documentElement["offset" + partialName],
                documentElement["client" + partialName]
            );
        }

        if(arguments.length === 0 || typeof value === "boolean") {
            var include = {
                paddings: isInner || isOuter,
                borders: isOuter,
                margins: value
            };

            return sizeUtils.getSize(element, propName, include);
        }

        if(value === undefined || value === null) {
            return this;
        }

        if(typeUtils.isNumeric(value)) {
            var elementStyles = window.getComputedStyle(element);
            var sizeAdjustment = sizeUtils.getElementBoxParams(propName, elementStyles);
            var isBorderBox = elementStyles.boxSizing === "border-box";
            value = Number(value);

            if(isOuter) {
                value -= isBorderBox ? 0 : (sizeAdjustment.border + sizeAdjustment.padding);
            } else if(isInner) {
                value += isBorderBox ? sizeAdjustment.border : -sizeAdjustment.padding;
            } else if(isBorderBox) {
                value += sizeAdjustment.border + sizeAdjustment.padding;
            }
        }
        value += typeUtils.isNumeric(value) ? "px" : "";

        domAdapter.setStyle(element, propName, value);

        return this;
    };
});

initRender.prototype.html = function(value) {
    if(!arguments.length) {
        return this[0].innerHTML;
    }

    this.empty();

    if(typeof value === "string" && !htmlParser.isTablePart(value) || typeof value === "number") {
        this[0].innerHTML = value;

        return this;
    }

    return this.append(htmlParser.parseHTML(value));
};

var appendElements = function(element, nextSibling) {
    if(!this[0] || !element) return;

    if(typeof element === "string") {
        element = htmlParser.parseHTML(element);
    } else if(element.nodeType) {
        element = [element];
    } else if(typeUtils.isNumeric(element)) {
        element = [domAdapter.createTextNode(element)];
    }

    for(var i = 0; i < element.length; i++) {
        var item = element[i],
            container = this[0],
            wrapTR = container.tagName === "TABLE" && item.tagName === "TR";

        if(wrapTR && container.tBodies && container.tBodies.length) {
            container = container.tBodies[0];
        }
        domAdapter.insertElement(container, item.nodeType ? item : item[0], nextSibling);
    }
};

var setCss = function(name, value) {
    if(!this[0] || !this[0].style) return;

    if(value === null || (typeof value === "number" && isNaN(value))) {
        return;
    }

    name = styleUtils.styleProp(name);
    for(var i = 0; i < this.length; i++) {
        this[i].style[name] = styleUtils.normalizeStyleProp(name, value);
    }
};

initRender.prototype.css = function(name, value) {
    if(typeUtils.isString(name)) {
        if(arguments.length === 2) {
            setCss.call(this, name, value);
        } else {
            if(!this[0]) return;

            name = styleUtils.styleProp(name);

            var result = window.getComputedStyle(this[0])[name] || this[0].style[name];
            return typeUtils.isNumeric(result) ? result.toString() : result;
        }
    } else if(typeUtils.isPlainObject(name)) {
        for(var key in name) {
            setCss.call(this, key, name[key]);
        }
    }

    return this;
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
        domAdapter.insertElement(element[0], this[0], element[0].firstChild);
    }

    return this;
};

initRender.prototype.appendTo = function(element) {
    if(this.length > 1) {
        return repeatMethod.call(this, "appendTo", arguments);
    }

    domAdapter.insertElement(renderer(element)[0], this[0]);
    return this;
};

initRender.prototype.insertBefore = function(element) {
    if(element && element[0]) {
        domAdapter.insertElement(element[0].parentNode, this[0], element[0]);
    }
    return this;
};

initRender.prototype.insertAfter = function(element) {
    if(element && element[0]) {
        domAdapter.insertElement(element[0].parentNode, this[0], element[0].nextSibling);
    }
    return this;
};

initRender.prototype.before = function(element) {
    if(this[0]) {
        domAdapter.insertElement(this[0].parentNode, element[0], this[0]);
    }
    return this;
};

initRender.prototype.after = function(element) {
    if(this[0]) {
        domAdapter.insertElement(this[0].parentNode, element[0], this[0].nextSibling);
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
    if(!(element && element[0])) return;

    element.insertBefore(this);
    this.remove();

    return element;
};

initRender.prototype.remove = function() {
    if(this.length > 1) {
        return repeatMethod.call(this, "remove", arguments);
    }

    dataUtils.cleanDataRecursive(this[0], true);
    domAdapter.removeElement(this[0]);

    return this;
};

initRender.prototype.detach = function() {
    if(this.length > 1) {
        return repeatMethod.call(this, "detach", arguments);
    }

    domAdapter.removeElement(this[0]);

    return this;
};

initRender.prototype.empty = function() {
    if(this.length > 1) {
        return repeatMethod.call(this, "empty", arguments);
    }

    dataUtils.cleanDataRecursive(this[0]);
    domAdapter.setText(this[0], "");

    return this;
};

initRender.prototype.clone = function() {
    var result = [];
    for(var i = 0; i < this.length; i++) {
        result.push(this[i].cloneNode(true));
    }
    return renderer(result);
};

initRender.prototype.text = function(value) {
    if(!arguments.length) {
        var result = "";

        for(var i = 0; i < this.length; i++) {
            result += this[i] && this[i].textContent || "";
        }
        return result;
    }

    var text = typeUtils.isFunction(value) ? value() : value;

    dataUtils.cleanDataRecursive(this[0], false);
    domAdapter.setText(this[0], typeUtils.isDefined(text) ? text : "");

    return this;
};

initRender.prototype.val = function(value) {
    if(arguments.length === 1) {
        return this.prop("value", typeUtils.isDefined(value) ? value : "");
    }

    return this.prop("value");
};

initRender.prototype.contents = function() {
    if(!this[0]) return renderer();

    var result = [];
    result.push.apply(result, this[0].childNodes);
    return renderer(result);
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
            if(domAdapter.isElementNode(element)) {
                var elementId = element.getAttribute("id"),
                    queryId = elementId || "dx-query-children";

                if(!elementId) {
                    setAttributeValue(element, "id", queryId);
                }
                queryId = "[id='" + queryId + "'] ";

                var querySelector = queryId + selector.replace(/([^\\])(,)/g, "$1, " + queryId);
                nodes.push.apply(nodes, domAdapter.querySelectorAll(element, querySelector));
                setAttributeValue(element, "id", elementId);
            } else if(domAdapter.isDocument(element)) {
                nodes.push.apply(nodes, domAdapter.querySelectorAll(element, selector));
            }
        }
    } else {
        for(i = 0; i < this.length; i++) {
            selector = domAdapter.isNode(selector) ? selector : selector[0];
            if(this[i] !== selector && this[i].contains(selector)) {
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
        if(domAdapter.isElementNode(item) && typeUtils.type(selector) === "string") {
            domAdapter.elementMatches(item, selector) && result.push(item);
        } else if(domAdapter.isNode(selector) || typeUtils.isWindow(selector)) {
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
            if(domAdapter.isElementNode(nodes[j])) {
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
        if(domAdapter.isElementNode(node) && node !== element) {
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

    while(parent && parent[0] && !domAdapter.isDocument(parent[0])) {
        if(domAdapter.isElementNode(parent[0])) {
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

var getWindowByElement = function(element) {
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
    var win = getWindowByElement(this[0].ownerDocument);
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

    offsetParent = offsetParent[0] ? offsetParent : renderer(domAdapter.getDocumentElement());

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

        var window = getWindowByElement(this[0]);

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

initRender.prototype.data = function(key, value) {
    if(!this[0]) return;

    if(arguments.length < 2) {
        return dataUtils.data.call(renderer, this[0], key);
    }

    dataUtils.data.call(renderer, this[0], key, value);
    return this;
};

initRender.prototype.removeData = function(key) {
    this[0] && dataUtils.removeData(this[0], key);

    return this;
};

var rendererWrapper = function() {
    return renderer.apply(this, arguments);
};

Object.defineProperty(rendererWrapper, "fn", {
    enumerable: true,
    configurable: true,

    get: function() {
        return renderer.fn;
    },

    set: function(value) {
        renderer.fn = value;
    }
});

module.exports = {
    set: function(strategy) {
        renderer = strategy;
    },
    get: function() {
        return rendererWrapper;
    }
};
