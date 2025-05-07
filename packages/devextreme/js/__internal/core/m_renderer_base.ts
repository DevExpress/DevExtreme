/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable object-shorthand */
import domAdapter from '@js/core/dom_adapter';
import { cleanDataRecursive, data as elementData, removeData } from '@js/core/element_data';
import { isTablePart, parseHTML } from '@js/core/utils/html_parser';
import { getOffset, getWindowByElement } from '@js/core/utils/size';
import { normalizeStyleProp, styleProp } from '@js/core/utils/style';
import {
  isDefined, isFunction, isNumeric, isObject, isPlainObject, isString, isWindow, type,
} from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';

const window = getWindow();

let renderer;
const initRender = function (selector, context) {
  if (!selector) {
    this.length = 0;
    return this;
  }

  if (typeof selector === 'string') {
    if (selector === 'body') {
      this[0] = context ? context.body : domAdapter.getBody();
      this.length = 1;
      return this;
    }

    context = context || domAdapter.getDocument();
    if (selector.startsWith('<')) {
      this[0] = domAdapter.createElement(selector.slice(1, -1), context);
      this.length = 1;
      return this;
    }

    [].push.apply(this, domAdapter.querySelectorAll(context, selector));
    return this;
  } if (domAdapter.isNode(selector) || isWindow(selector)) {
    this[0] = selector;
    this.length = 1;
    return this;
  } if (Array.isArray(selector)) {
    // @ts-expect-error
    [].push.apply(this, selector);
    return this;
  }

  return renderer(selector.toArray ? selector.toArray() : [selector]);
};

renderer = function (selector, context) {
  // @ts-expect-error void constructor
  // eslint-disable-next-line new-cap
  return new initRender(selector, context);
};
renderer.fn = { dxRenderer: true };
initRender.prototype = renderer.fn;

const repeatMethod = function (methodName, args) {
  for (let i = 0; i < this.length; i++) {
    const item = renderer(this[i]);
    item[methodName].apply(item, args);
  }
  return this;
};

const setAttributeValue = function (element, attrName, value) {
  if (value !== undefined && value !== null && value !== false) {
    domAdapter.setAttribute(element, attrName, value);
  } else {
    domAdapter.removeAttribute(element, attrName);
  }
};

initRender.prototype.show = function () {
  return this.toggle(true);
};

initRender.prototype.hide = function () {
  return this.toggle(false);
};

initRender.prototype.toggle = function (value) {
  if (this[0]) {
    this.toggleClass('dx-state-invisible', !value);
  }

  return this;
};

initRender.prototype.attr = function (attrName, value) {
  if (this.length > 1 && arguments.length > 1) return repeatMethod.call(this, 'attr', arguments);
  if (!this[0]) {
    if (isObject(attrName) || value !== undefined) {
      return this;
    }
    return undefined;
  }
  if (!this[0].getAttribute) {
    return this.prop(attrName, value);
  }
  if (typeof attrName === 'string' && arguments.length === 1) {
    const result = this[0].getAttribute(attrName);
    return result == null ? undefined : result;
  } if (isPlainObject(attrName)) {
    for (const key in attrName) {
      this.attr(key, attrName[key]);
    }
  } else {
    setAttributeValue(this[0], attrName, value);
  }
  return this;
};

initRender.prototype.removeAttr = function (attrName) {
  this.each(function (_, element) {
    domAdapter.removeAttribute(element, attrName);
  });

  return this;
};

initRender.prototype.prop = function (propName, value) {
  if (!this[0]) return this;
  if (typeof propName === 'string' && arguments.length === 1) {
    return this[0][propName];
  } if (isPlainObject(propName)) {
    for (const key in propName) {
      this.prop(key, propName[key]);
    }
  } else {
    domAdapter.setProperty(this[0], propName, value);
  }

  return this;
};

initRender.prototype.addClass = function (className) {
  return this.toggleClass(className, true);
};

initRender.prototype.removeClass = function (className) {
  return this.toggleClass(className, false);
};

initRender.prototype.hasClass = function (className) {
  if (!this[0] || this[0].className === undefined) return false;

  const classNames = className.split(' ');
  for (let i = 0; i < classNames.length; i++) {
    if (this[0].classList) {
      if (this[0].classList.contains(classNames[i])) return true;
    } else { // IE9
      const className = isString(this[0].className) ? this[0].className : domAdapter.getAttribute(this[0], 'class');
      if ((className || '').split(' ').indexOf(classNames[i]) >= 0) return true;
    }
  }
  return false;
};

initRender.prototype.toggleClass = function (className, value) {
  if (this.length > 1) {
    return repeatMethod.call(this, 'toggleClass', arguments);
  }

  if (!this[0] || !className) return this;
  value = value === undefined ? !this.hasClass(className) : value;

  const classNames = className.split(' ');
  for (let i = 0; i < classNames.length; i++) {
    domAdapter.setClass(this[0], classNames[i], value);
  }
  return this;
};

initRender.prototype.html = function (value) {
  if (!arguments.length) {
    return this[0].innerHTML;
  }

  this.empty();

  if (typeof value === 'string' && !isTablePart(value) || typeof value === 'number') {
    this[0].innerHTML = value;

    return this;
  }

  return this.append(parseHTML(value));
};

const appendElements = function (element, nextSibling) {
  if (!this[0] || !element) return;

  if (typeof element === 'string') {
    element = parseHTML(element);
  } else if (element.nodeType) {
    element = [element];
  } else if (isNumeric(element)) {
    element = [domAdapter.createTextNode(element)];
  }

  for (let i = 0; i < element.length; i++) {
    const item = element[i];
    let container = this[0];
    const wrapTR = container.tagName === 'TABLE' && item.tagName === 'TR';

    if (wrapTR && container.tBodies && container.tBodies.length) {
      // HTML collection, not an array
      // eslint-disable-next-line prefer-destructuring
      container = container.tBodies[0];
    }
    domAdapter.insertElement(container, item.nodeType ? item : item[0], nextSibling);
  }
};

const setCss = function (name, value) {
  if (!this[0] || !this[0].style) return;

  if (value === null || (typeof value === 'number' && isNaN(value))) {
    return;
  }

  name = styleProp(name);
  for (let i = 0; i < this.length; i++) {
    this[i].style[name] = normalizeStyleProp(name, value);
  }
};

initRender.prototype.css = function (name, value) {
  if (isString(name)) {
    if (arguments.length === 2) {
      setCss.call(this, name, value);
    } else {
      if (!this[0]) return;

      name = styleProp(name);

      const result = window.getComputedStyle(this[0])[name] || this[0].style[name];
      return isNumeric(result) ? result.toString() : result;
    }
  } else if (isPlainObject(name)) {
    for (const key in name) {
      setCss.call(this, key, name[key]);
    }
  }

  return this;
};

initRender.prototype.prepend = function (element) {
  if (arguments.length > 1) {
    for (let i = 0; i < arguments.length; i++) {
      this.prepend(arguments[i]);
    }
    return this;
  }
  appendElements.apply(this, [element, this[0].firstChild]);
  return this;
};

initRender.prototype.append = function (element) {
  if (arguments.length > 1) {
    for (let i = 0; i < arguments.length; i++) {
      this.append(arguments[i]);
    }
    return this;
  }
  // @ts-expect-error
  appendElements.apply(this, [element]);
  return this;
};

initRender.prototype.prependTo = function (element) {
  if (this.length > 1) {
    for (let i = this.length - 1; i >= 0; i--) {
      renderer(this[i]).prependTo(element);
    }
    return this;
  }

  element = renderer(element);
  if (element[0]) {
    domAdapter.insertElement(element[0], this[0], element[0].firstChild);
  }

  return this;
};

initRender.prototype.appendTo = function (element) {
  if (this.length > 1) {
    return repeatMethod.call(this, 'appendTo', arguments);
  }

  domAdapter.insertElement(renderer(element)[0], this[0]);
  return this;
};

initRender.prototype.insertBefore = function (element) {
  if (element && element[0]) {
    domAdapter.insertElement(element[0].parentNode, this[0], element[0]);
  }
  return this;
};

initRender.prototype.insertAfter = function (element) {
  if (element && element[0]) {
    domAdapter.insertElement(element[0].parentNode, this[0], element[0].nextSibling);
  }
  return this;
};

initRender.prototype.before = function (element) {
  if (this[0]) {
    domAdapter.insertElement(this[0].parentNode, element[0], this[0]);
  }
  return this;
};

initRender.prototype.after = function (element) {
  if (this[0]) {
    domAdapter.insertElement(this[0].parentNode, element[0], this[0].nextSibling);
  }
  return this;
};

initRender.prototype.wrap = function (wrapper) {
  if (this[0]) {
    const wrap = renderer(wrapper);

    wrap.insertBefore(this);
    wrap.append(this);
  }

  return this;
};

initRender.prototype.wrapInner = function (wrapper) {
  const contents = this.contents();

  if (contents.length) {
    contents.wrap(wrapper);
  } else {
    this.append(wrapper);
  }

  return this;
};

initRender.prototype.replaceWith = function (element) {
  if (!(element && element[0])) return;
  if (element.is(this)) return this;

  element.insertBefore(this);
  this.remove();

  return element;
};

initRender.prototype.remove = function () {
  if (this.length > 1) {
    return repeatMethod.call(this, 'remove', arguments);
  }

  cleanDataRecursive(this[0], true);
  domAdapter.removeElement(this[0]);

  return this;
};

initRender.prototype.detach = function () {
  if (this.length > 1) {
    return repeatMethod.call(this, 'detach', arguments);
  }

  domAdapter.removeElement(this[0]);

  return this;
};

initRender.prototype.empty = function () {
  if (this.length > 1) {
    return repeatMethod.call(this, 'empty', arguments);
  }

  cleanDataRecursive(this[0]);
  domAdapter.setText(this[0], '');

  return this;
};

initRender.prototype.clone = function () {
  const result: any[] = [];
  for (let i = 0; i < this.length; i++) {
    result.push(this[i].cloneNode(true));
  }
  return renderer(result);
};

initRender.prototype.text = function (value) {
  if (!arguments.length) {
    let result = '';

    for (let i = 0; i < this.length; i++) {
      result += this[i] && this[i].textContent || '';
    }
    return result;
  }

  const text = isFunction(value) ? value() : value;

  cleanDataRecursive(this[0], false);
  domAdapter.setText(this[0], isDefined(text) ? text : '');

  return this;
};

initRender.prototype.val = function (value) {
  if (arguments.length === 1) {
    return this.prop('value', isDefined(value) ? value : '');
  }

  return this.prop('value');
};

initRender.prototype.contents = function () {
  if (!this[0]) return renderer();

  const result = [];
  result.push.apply(result, this[0].childNodes);
  return renderer(result);
};

initRender.prototype.find = function (selector) {
  const result = renderer();
  if (!selector) {
    return result;
  }

  const nodes: any = [];
  let i;

  if (typeof selector === 'string') {
    selector = selector.trim();

    for (i = 0; i < this.length; i++) {
      const element = this[i];
      if (domAdapter.isElementNode(element)) {
        const elementId = element.getAttribute('id');
        let queryId = elementId || 'dx-query-children';

        if (!elementId) {
          setAttributeValue(element, 'id', queryId);
        }
        queryId = `[id='${queryId}'] `;

        const querySelector = queryId + selector.replace(/([^\\])(,)/g, `$1, ${queryId}`);
        nodes.push.apply(nodes, domAdapter.querySelectorAll(element, querySelector));
        setAttributeValue(element, 'id', elementId);
      } else if (domAdapter.isDocument(element) || domAdapter.isDocumentFragment(element)) {
        nodes.push.apply(nodes, domAdapter.querySelectorAll(element, selector));
      }
    }
  } else {
    for (i = 0; i < this.length; i++) {
      selector = domAdapter.isNode(selector) ? selector : selector[0];
      if (this[i] !== selector && this[i].contains(selector)) {
        nodes.push(selector);
      }
    }
  }

  return result.add(nodes);
};

const isVisible = function (_, element) {
  element = element.host ?? element;

  if (!element.nodeType) return true;
  return !!(element.offsetWidth || element.offsetHeight || element.getClientRects?.().length);
};

initRender.prototype.filter = function (selector) {
  if (!selector) return renderer();

  if (selector === ':visible') {
    return this.filter(isVisible);
  } if (selector === ':hidden') {
    return this.filter(function (_, element) {
      return !isVisible(_, element);
    });
  }

  const result: any[] = [];
  for (let i = 0; i < this.length; i++) {
    const item = this[i];
    if (domAdapter.isElementNode(item) && type(selector) === 'string') {
      domAdapter.elementMatches(item, selector) && result.push(item);
    } else if (domAdapter.isNode(selector) || isWindow(selector)) {
      selector === item && result.push(item);
    } else if (isFunction(selector)) {
      selector.call(item, i, item) && result.push(item);
    } else {
      for (let j = 0; j < selector.length; j++) {
        selector[j] === item && result.push(item);
      }
    }
  }

  return renderer(result);
};

initRender.prototype.not = function (selector) {
  const result: any[] = [];
  const nodes = this.filter(selector).toArray();

  for (let i = 0; i < this.length; i++) {
    if (nodes.indexOf(this[i]) === -1) {
      result.push(this[i]);
    }
  }

  return renderer(result);
};

initRender.prototype.is = function (selector) {
  return !!this.filter(selector).length;
};

initRender.prototype.children = function (selector) {
  let result: any[] = [];
  for (let i = 0; i < this.length; i++) {
    const nodes = this[i] ? this[i].childNodes : [];
    for (let j = 0; j < nodes.length; j++) {
      if (domAdapter.isElementNode(nodes[j])) {
        result.push(nodes[j]);
      }
    }
  }

  result = renderer(result);

  return selector ? result.filter(selector) : result;
};

initRender.prototype.siblings = function () {
  const element = this[0];
  if (!element || !element.parentNode) {
    return renderer();
  }

  const result: any[] = [];
  const parentChildNodes = element.parentNode.childNodes || [];

  for (let i = 0; i < parentChildNodes.length; i++) {
    const node = parentChildNodes[i];
    if (domAdapter.isElementNode(node) && node !== element) {
      result.push(node);
    }
  }

  return renderer(result);
};

initRender.prototype.each = function (callback) {
  for (let i = 0; i < this.length; i++) {
    if (callback.call(this[i], i, this[i]) === false) {
      break;
    }
  }
};

initRender.prototype.index = function (element) {
  if (!element) {
    return this.parent().children().index(this);
  }

  element = renderer(element);
  return this.toArray().indexOf(element[0]);
};

initRender.prototype.get = function (index) {
  return this[index < 0 ? this.length + index : index];
};

initRender.prototype.eq = function (index) {
  index = index < 0 ? this.length + index : index;
  return renderer(this[index]);
};

initRender.prototype.first = function () {
  return this.eq(0);
};

initRender.prototype.last = function () {
  return this.eq(-1);
};

initRender.prototype.select = function () {
  for (let i = 0; i < this.length; i += 1) {
    this[i].select && this[i].select();
  }

  return this;
};

initRender.prototype.parent = function (selector) {
  if (!this[0]) return renderer();
  const result = renderer(this[0].parentNode);
  return !selector || result.is(selector) ? result : renderer();
};

initRender.prototype.parents = function (selector) {
  const result: any[] = [];
  let parent = this.parent();

  while (parent && parent[0] && !domAdapter.isDocument(parent[0])) {
    if (domAdapter.isElementNode(parent[0])) {
      if (!selector || parent.is(selector)) {
        result.push(parent.get(0));
      }
    }
    parent = parent.parent();
  }
  return renderer(result);
};

initRender.prototype.closest = function (selector) {
  if (this.is(selector)) {
    return this;
  }

  let parent = this.parent();
  while (parent && parent.length) {
    if (parent.is(selector)) {
      return parent;
    }
    parent = parent.parent();
  }

  return renderer();
};

initRender.prototype.next = function (selector) {
  if (!this[0]) return renderer();
  let next = renderer(this[0].nextSibling);
  if (!arguments.length) {
    return next;
  }
  while (next && next.length) {
    if (next.is(selector)) return next;
    next = next.next();
  }
  return renderer();
};

initRender.prototype.prev = function () {
  if (!this[0]) return renderer();
  return renderer(this[0].previousSibling);
};

initRender.prototype.add = function (selector) {
  const targets = renderer(selector);
  const result = this.toArray();

  for (let i = 0; i < targets.length; i++) {
    const target = targets[i];
    if (result.indexOf(target) === -1) {
      result.push(target);
    }
  }

  return renderer(result);
};

const emptyArray: any[] = [];
initRender.prototype.splice = function () {
  // @ts-expect-error get rid of arguments
  // eslint-disable-next-line prefer-rest-params
  return renderer(emptyArray.splice.apply(this, arguments));
};
initRender.prototype.slice = function () {
  // @ts-expect-error get rid of arguments
  // eslint-disable-next-line prefer-rest-params
  return renderer(emptyArray.slice.apply(this, arguments));
};
initRender.prototype.toArray = function () {
  return emptyArray.slice.call(this);
};

initRender.prototype.offset = function () {
  if (!this[0]) return;

  return getOffset(this[0]);
};

initRender.prototype.offsetParent = function () {
  if (!this[0]) return renderer();

  let offsetParent = renderer(this[0].offsetParent);

  while (offsetParent[0] && offsetParent.css('position') === 'static') {
    offsetParent = renderer(offsetParent[0].offsetParent);
  }

  offsetParent = offsetParent[0] ? offsetParent : renderer(domAdapter.getDocumentElement());

  return offsetParent;
};

initRender.prototype.position = function () {
  if (!this[0]) return;

  let offset;
  const marginTop = parseFloat(this.css('marginTop'));
  const marginLeft = parseFloat(this.css('marginLeft'));

  if (this.css('position') === 'fixed') {
    offset = this[0].getBoundingClientRect();

    return {
      top: offset.top - marginTop,
      left: offset.left - marginLeft,
    };
  }

  offset = this.offset();

  const offsetParent = this.offsetParent();
  let parentOffset = {
    top: 0,
    left: 0,
  };

  if (offsetParent[0].nodeName !== 'HTML') {
    parentOffset = offsetParent.offset();
  }

  parentOffset = {
    top: parentOffset.top + parseFloat(offsetParent.css('borderTopWidth')),
    left: parentOffset.left + parseFloat(offsetParent.css('borderLeftWidth')),
  };

  return {
    top: offset.top - parentOffset.top - marginTop,
    left: offset.left - parentOffset.left - marginLeft,
  };
};

[{
  name: 'scrollLeft',
  offsetProp: 'pageXOffset',
  scrollWindow: function (win, value) {
    win.scrollTo(value, win.pageYOffset);
  },
}, {
  name: 'scrollTop',
  offsetProp: 'pageYOffset',
  scrollWindow: function (win, value) {
    win.scrollTo(win.pageXOffset, value);
  },
}].forEach(function (directionStrategy) {
  const propName = directionStrategy.name;

  initRender.prototype[propName] = function (value) {
    if (!this[0]) {
      return;
    }

    const window = getWindowByElement(this[0]);

    if (value === undefined) {
      return window ? window[directionStrategy.offsetProp] : this[0][propName];
    }

    if (window) {
      directionStrategy.scrollWindow(window, value);
    } else {
      this[0][propName] = value;
    }
    return this;
  };
});

initRender.prototype.data = function (key, value) {
  if (!this[0]) return;

  if (arguments.length < 2) {
    return elementData.call(renderer, this[0], key);
  }
  elementData.call(renderer, this[0], key, value);
  return this;
};

initRender.prototype.removeData = function (key) {
  this[0] && removeData(this[0], key);

  return this;
};

const rendererWrapper = function () {
  return renderer.apply(this, arguments);
};

Object.defineProperty(rendererWrapper, 'fn', {
  enumerable: true,
  configurable: true,

  get: function () {
    return renderer.fn;
  },

  set: function (value) {
    renderer.fn = value;
  },
});

export default {
  set: function (strategy) {
    renderer = strategy;
  },
  get: function () {
    return rendererWrapper;
  },
};
