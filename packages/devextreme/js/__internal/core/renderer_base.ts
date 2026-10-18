import { cleanDataRecursive, data as elementData, removeData } from '@js/core/element_data';
import type { Coordinates } from '@js/core/renderer';
import { isTablePart, parseHTML } from '@js/core/utils/html_parser';
import { getOffset, getWindowByElement } from '@js/core/utils/size';
import { normalizeStyleProp, styleProp } from '@js/core/utils/style';
import {
  isDefined, isFunction, isNumeric, isObject, isPlainObject, isString, isWindow,
} from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import domAdapter from '@ts/core/dom_adapter';

export interface RendererElement extends HTMLElement {
  host?: RendererElement;
  select?: () => void;
  tBodies?: HTMLCollectionOf<HTMLTableSectionElement>;
}

export type AttributeValue = string | number | boolean | null | undefined;

export type Attributes = Record<string, AttributeValue>;

export type StyleValue = string | number | null | undefined;

export type TextContent = string | number | boolean | null | undefined;

export type TextValue = TextContent | (() => TextContent);

interface ArrayConvertible {
  toArray: () => (Node | Window)[];
}

export type RendererSelector = string | Node | Window | (Node | Window)[] | ArrayConvertible
  | null | undefined;

export type ElementCallback = (
  this: RendererElement,
  index: number,
  element: RendererElement,
) => unknown;

export type RendererFilter = string | Node | Window | ElementCallback | ArrayLike<Node | Window>
  | null | undefined;

export type FindSelector = string | Node | ArrayLike<Node> | null | undefined;

export type WrapTarget = string | Node | Renderer;

type AppendItem = Node | ArrayLike<Node>;

export type AppendSource = string | number | Node | ArrayLike<AppendItem> | null | undefined;

export interface Renderer {
  [index: number]: RendererElement;
  length: number;
  dxRenderer: boolean;

  show: (this: Renderer) => Renderer;
  hide: (this: Renderer) => Renderer;
  toggle: (this: Renderer, value?: boolean | string) => Renderer;
  attr: {
    (this: Renderer, attrName: string): string | undefined;
    (this: Renderer, attrName: string | Attributes, value?: AttributeValue): Renderer;
  };
  removeAttr: (this: Renderer, attrName: string) => Renderer;
  prop: {
    (this: Renderer, propName: string): unknown;
    (this: Renderer, propName: string | Record<string, unknown>, value?: unknown): Renderer;
  };
  addClass: (this: Renderer, className: string) => Renderer;
  removeClass: (this: Renderer, className: string) => Renderer;
  hasClass: (this: Renderer, className: string) => boolean;
  toggleClass: (this: Renderer, className: string, value?: boolean) => Renderer;
  html: {
    (this: Renderer): string;
    (this: Renderer, value: string | number): Renderer;
  };
  css: {
    (this: Renderer, name: string): string | undefined;
    (this: Renderer, name: string | Record<string, StyleValue>, value?: StyleValue): Renderer;
  };
  prepend: (this: Renderer, ...elements: AppendSource[]) => Renderer;
  append: (this: Renderer, ...elements: AppendSource[]) => Renderer;
  prependTo: (this: Renderer, element: RendererSelector) => Renderer;
  appendTo: (this: Renderer, element: RendererSelector) => Renderer;
  insertBefore: (this: Renderer, element: ArrayLike<Node> | null | undefined) => Renderer;
  insertAfter: (this: Renderer, element: ArrayLike<Node> | null | undefined) => Renderer;
  before: (this: Renderer, element: ArrayLike<Node>) => Renderer;
  after: (this: Renderer, element: ArrayLike<Node>) => Renderer;
  wrap: (this: Renderer, wrapper: WrapTarget) => Renderer;
  wrapInner: (this: Renderer, wrapper: WrapTarget) => Renderer;
  replaceWith: (this: Renderer, element: Renderer | null | undefined) => Renderer | undefined;
  remove: (this: Renderer) => Renderer;
  detach: (this: Renderer) => Renderer;
  empty: (this: Renderer) => Renderer;
  clone: (this: Renderer) => Renderer;
  text: {
    (this: Renderer): string;
    (this: Renderer, value: TextValue): Renderer;
  };
  val: {
    (this: Renderer): unknown;
    (this: Renderer, value: unknown): Renderer;
  };
  contents: (this: Renderer) => Renderer;
  find: (this: Renderer, selector: FindSelector) => Renderer;
  filter: (this: Renderer, selector: RendererFilter) => Renderer;
  not: (this: Renderer, selector: RendererFilter) => Renderer;
  is: (this: Renderer, selector: RendererFilter) => boolean;
  children: (this: Renderer, selector?: RendererFilter) => Renderer;
  siblings: (this: Renderer) => Renderer;
  each: (this: Renderer, callback: ElementCallback) => void;
  index: (this: Renderer, element?: RendererSelector) => number;
  get: (this: Renderer, index: number) => RendererElement;
  eq: (this: Renderer, index: number) => Renderer;
  first: (this: Renderer) => Renderer;
  last: (this: Renderer) => Renderer;
  select: (this: Renderer) => Renderer;
  parent: (this: Renderer, selector?: RendererFilter) => Renderer;
  parents: (this: Renderer, selector?: RendererFilter) => Renderer;
  closest: (this: Renderer, selector: RendererFilter) => Renderer;
  next: (this: Renderer, selector?: RendererFilter) => Renderer;
  prev: (this: Renderer) => Renderer;
  add: (this: Renderer, selector: RendererSelector) => Renderer;
  splice: (this: Renderer, start: number, deleteCount?: number) => Renderer;
  slice: (this: Renderer, start?: number, end?: number) => Renderer;
  toArray: (this: Renderer) => RendererElement[];
  offset: (this: Renderer) => Coordinates | undefined;
  offsetParent: (this: Renderer) => Renderer;
  position: (this: Renderer) => Coordinates | undefined;
  scrollLeft: {
    (this: Renderer): number | undefined;
    (this: Renderer, value: number): Renderer | undefined;
  };
  scrollTop: {
    (this: Renderer): number | undefined;
    (this: Renderer, value: number): Renderer | undefined;
  };
  data: {
    (this: Renderer, key?: string): unknown;
    (this: Renderer, key: string, value: unknown): Renderer | undefined;
  };
  removeData: (this: Renderer, key?: string) => Renderer;
}

export interface RendererFactory {
  (selector?: RendererSelector, context?: Document): Renderer;
  fn: Renderer;
}

interface RendererConstructor {
  prototype: Renderer;
  (this: Renderer, selector?: RendererSelector, context?: Document): Renderer;
  new (selector?: RendererSelector, context?: Document): Renderer;
}

type RepeatableMethod = 'attr' | 'toggleClass' | 'appendTo' | 'remove' | 'detach' | 'empty';

interface ScrollStrategy {
  propName: 'scrollLeft' | 'scrollTop';
  offsetProp: 'pageXOffset' | 'pageYOffset';
  scrollWindow: (win: Window, value: number) => void;
}

const window = getWindow();

const fillFromList = (target: Renderer, items: ArrayLike<Node | Window>): void => {
  const { length } = items;
  for (let i = 0; i < length; i += 1) {
    target[i] = items[i] as RendererElement;
  }
  target.length = length;
};

const pushAll = (target: Node[], items: ArrayLike<Node>): void => {
  const { length } = items;
  for (let i = 0; i < length; i += 1) {
    target.push(items[i]);
  }
};

const pushMatches = (
  target: RendererElement[],
  list: ArrayLike<unknown>,
  item: RendererElement,
): void => {
  const { length } = list;
  for (let i = 0; i < length; i += 1) {
    if (list[i] === item) {
      target.push(item);
    }
  }
};

const isArrayConvertible = (value: object): value is ArrayConvertible => (
  isFunction((value as Partial<ArrayConvertible>).toArray)
);

const InitRender = function (
  this: Renderer,
  selector?: RendererSelector,
  context?: Document,
): Renderer {
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

    const rootContext = context ?? domAdapter.getDocument();
    if (selector.startsWith('<')) {
      this[0] = domAdapter.createElement(selector.slice(1, -1), rootContext);
      this.length = 1;
      return this;
    }

    fillFromList(this, domAdapter.querySelectorAll(rootContext, selector));
    return this;
  } if (domAdapter.isNode(selector) || isWindow(selector)) {
    this[0] = selector as RendererElement;
    this.length = 1;
    return this;
  } if (Array.isArray(selector)) {
    fillFromList(this, selector);
    return this;
  }

  return new InitRender(isArrayConvertible(selector) ? selector.toArray() : [selector]);
} as RendererConstructor;

let renderer: RendererFactory = function (
  selector?: RendererSelector,
  context?: Document,
): Renderer {
  return new InitRender(selector, context);
} as RendererFactory;
renderer.fn = { dxRenderer: true } as Renderer;
InitRender.prototype = renderer.fn;

const repeatMethod = function <K extends RepeatableMethod>(
  this: Renderer,
  methodName: K,
  args: Parameters<Renderer[K]>,
): Renderer {
  for (let i = 0; i < this.length; i += 1) {
    const item = renderer(this[i]);
    (item[methodName] as (...methodArgs: Parameters<Renderer[K]>) => unknown)(...args);
  }
  return this;
};

const setAttributeValue = (element: Element, attrName: string, value: AttributeValue): void => {
  if (value !== undefined && value !== null && value !== false) {
    domAdapter.setAttribute(element, attrName, String(value));
  } else {
    domAdapter.removeAttribute(element, attrName);
  }
};

InitRender.prototype.show = function (this: Renderer): Renderer {
  return this.toggle(true);
};

InitRender.prototype.hide = function (this: Renderer): Renderer {
  return this.toggle(false);
};

InitRender.prototype.toggle = function (this: Renderer, value?: boolean | string): Renderer {
  if (this[0]) {
    this.toggleClass('dx-state-invisible', !value);
  }

  return this;
};

function attr(this: Renderer, attrName: string): string | undefined;
function attr(this: Renderer, attrName: string | Attributes, value?: AttributeValue): Renderer;
function attr(
  this: Renderer,
  ...args: [attrName: string | Attributes, value?: AttributeValue]
): Renderer | string | undefined {
  const [attrName, value] = args;
  if (this.length > 1 && args.length > 1) return repeatMethod.call(this, 'attr', args);
  if (!this[0]) {
    if (isObject(attrName) || value !== undefined) {
      return this;
    }
    return undefined;
  }
  if (!this[0].getAttribute) {
    return this.prop(attrName, value);
  }
  if (typeof attrName === 'string' && args.length === 1) {
    const result = this[0].getAttribute(attrName);
    return result ?? undefined;
  } if (isPlainObject(attrName)) {
    Object.keys(attrName).forEach((key) => {
      this.attr(key, attrName[key]);
    });
  } else {
    setAttributeValue(this[0], attrName, value);
  }
  return this;
}
InitRender.prototype.attr = attr;

InitRender.prototype.removeAttr = function (this: Renderer, attrName: string): Renderer {
  this.each((_, element) => {
    domAdapter.removeAttribute(element, attrName);
  });

  return this;
};

function prop(this: Renderer, propName: string): unknown;
function prop(
  this: Renderer,
  propName: string | Record<string, unknown>,
  value?: unknown,
): Renderer;
function prop(
  this: Renderer,
  ...args: [propName: string | Record<string, unknown>, value?: unknown]
): unknown {
  const [propName, value] = args;
  if (!this[0]) return this;
  if (typeof propName === 'string' && args.length === 1) {
    const propValue: unknown = this[0][propName];
    return propValue;
  } if (isPlainObject(propName)) {
    Object.keys(propName).forEach((key) => {
      this.prop(key, propName[key]);
    });
  } else {
    domAdapter.setProperty(this[0], propName, value);
  }

  return this;
}
InitRender.prototype.prop = prop;

InitRender.prototype.addClass = function (this: Renderer, className: string): Renderer {
  return this.toggleClass(className, true);
};

InitRender.prototype.removeClass = function (this: Renderer, className: string): Renderer {
  return this.toggleClass(className, false);
};

InitRender.prototype.hasClass = function (this: Renderer, className: string): boolean {
  const classNames = className.split(' ');

  for (let i = 0; i < this.length; i += 1) {
    if (this[i]?.className && classNames.some((name) => this[i].classList.contains(name))) {
      return true;
    }
  }

  return false;
};

InitRender.prototype.toggleClass = function (
  this: Renderer,
  ...args: [className: string, value?: boolean]
): Renderer {
  const [className, value] = args;
  if (this.length > 1) {
    return repeatMethod.call(this, 'toggleClass', args);
  }

  if (!this[0] || !className) return this;
  const isAdd = value === undefined ? !this.hasClass(className) : value;

  const classNames = className.split(' ');
  for (const name of classNames) {
    domAdapter.setClass(this[0], name, isAdd);
  }
  return this;
};

function html(this: Renderer): string;
function html(this: Renderer, value: string | number): Renderer;
function html(this: Renderer, ...args: [value?: string | number]): Renderer | string {
  if (!args.length) {
    return this[0].innerHTML;
  }

  const [value] = args;
  this.empty();

  if ((typeof value === 'string' && !isTablePart(value)) || typeof value === 'number') {
    this[0].innerHTML = String(value);

    return this;
  }

  return this.append(parseHTML(value));
}
InitRender.prototype.html = html;

const toAppendItems = (source: NonNullable<AppendSource>): ArrayLike<AppendItem> => {
  if (typeof source === 'string') {
    return parseHTML(source) ?? [];
  }
  if (domAdapter.isNode(source)) {
    return [source];
  }
  if (isNumeric(source)) {
    return [domAdapter.createTextNode(String(source))];
  }
  return source;
};

const appendElements = function (
  this: Renderer,
  source: AppendSource,
  nextSibling?: Node | null,
): void {
  if (!this[0] || !source) return;

  const items = toAppendItems(source);
  const { length } = items;

  for (let i = 0; i < length; i += 1) {
    const item = items[i];
    const container = this[0];
    const wrapTR = container.tagName === 'TABLE' && domAdapter.isNode(item) && item.nodeName === 'TR';
    const target = wrapTR && container.tBodies?.length ? container.tBodies[0] : container;

    domAdapter.insertElement(target, domAdapter.isNode(item) ? item : item[0], nextSibling);
  }
};

const setCss = function (this: Renderer, name: string, value: StyleValue): void {
  if (!this[0]?.style) return;

  if (value === null || (typeof value === 'number' && isNaN(value))) {
    return;
  }

  const styleName: string = styleProp(name);
  for (let i = 0; i < this.length; i += 1) {
    this[i].style[styleName] = normalizeStyleProp(styleName, value);
  }
};

function css(this: Renderer, name: string): string | undefined;
function css(
  this: Renderer,
  name: string | Record<string, StyleValue>,
  value?: StyleValue,
): Renderer;
function css(
  this: Renderer,
  ...args: [name: string | Record<string, StyleValue>, value?: StyleValue]
): Renderer | string | undefined {
  const [name, value] = args;
  if (isString(name)) {
    if (args.length === 2) {
      setCss.call(this, name, value);
    } else {
      if (!this[0]) return undefined;

      const styleName: string = styleProp(name);

      const result: string | number | undefined = window.getComputedStyle(this[0])[styleName]
        || this[0].style[styleName];
      return isNumeric(result) ? result.toString() : result;
    }
  } else if (isPlainObject(name)) {
    Object.keys(name).forEach((key) => {
      setCss.call(this, key, name[key]);
    });
  }

  return this;
}
InitRender.prototype.css = css;

InitRender.prototype.prepend = function (this: Renderer, ...elements: AppendSource[]): Renderer {
  if (elements.length > 1) {
    for (const element of elements) {
      this.prepend(element);
    }
    return this;
  }
  const [element] = elements;
  appendElements.call(this, element, this[0].firstChild);
  return this;
};

InitRender.prototype.append = function (this: Renderer, ...elements: AppendSource[]): Renderer {
  if (elements.length > 1) {
    for (const element of elements) {
      this.append(element);
    }
    return this;
  }
  const [element] = elements;
  appendElements.call(this, element);
  return this;
};

InitRender.prototype.prependTo = function (this: Renderer, element: RendererSelector): Renderer {
  if (this.length > 1) {
    for (let i = this.length - 1; i >= 0; i -= 1) {
      renderer(this[i]).prependTo(element);
    }
    return this;
  }

  const $element = renderer(element);
  if ($element[0]) {
    domAdapter.insertElement($element[0], this[0], $element[0].firstChild);
  }

  return this;
};

InitRender.prototype.appendTo = function (
  this: Renderer,
  ...args: [element: RendererSelector]
): Renderer {
  if (this.length > 1) {
    return repeatMethod.call(this, 'appendTo', args);
  }

  const [element] = args;
  domAdapter.insertElement(renderer(element)[0], this[0]);
  return this;
};

InitRender.prototype.insertBefore = function (
  this: Renderer,
  element: ArrayLike<Node> | null | undefined,
): Renderer {
  if (element?.[0]) {
    domAdapter.insertElement(element[0].parentNode, this[0], element[0]);
  }
  return this;
};

InitRender.prototype.insertAfter = function (
  this: Renderer,
  element: ArrayLike<Node> | null | undefined,
): Renderer {
  if (element?.[0]) {
    domAdapter.insertElement(element[0].parentNode, this[0], element[0].nextSibling);
  }
  return this;
};

InitRender.prototype.before = function (this: Renderer, element: ArrayLike<Node>): Renderer {
  if (this[0]) {
    domAdapter.insertElement(this[0].parentNode, element[0], this[0]);
  }
  return this;
};

InitRender.prototype.after = function (this: Renderer, element: ArrayLike<Node>): Renderer {
  if (this[0]) {
    domAdapter.insertElement(this[0].parentNode, element[0], this[0].nextSibling);
  }
  return this;
};

InitRender.prototype.wrap = function (this: Renderer, wrapper: WrapTarget): Renderer {
  if (this[0]) {
    const wrap = renderer(wrapper);

    wrap.insertBefore(this);
    wrap.append(this);
  }

  return this;
};

InitRender.prototype.wrapInner = function (this: Renderer, wrapper: WrapTarget): Renderer {
  const contents = this.contents();

  if (contents.length) {
    contents.wrap(wrapper);
  } else {
    this.append(wrapper);
  }

  return this;
};

InitRender.prototype.replaceWith = function (
  this: Renderer,
  element: Renderer | null | undefined,
): Renderer | undefined {
  if (!element?.[0]) return undefined;
  if (element.is(this)) return this;

  element.insertBefore(this);
  this.remove();

  return element;
};

InitRender.prototype.remove = function (this: Renderer, ...args: []): Renderer {
  if (this.length > 1) {
    return repeatMethod.call(this, 'remove', args);
  }

  cleanDataRecursive(this[0], true);
  domAdapter.removeElement(this[0]);

  return this;
};

InitRender.prototype.detach = function (this: Renderer, ...args: []): Renderer {
  if (this.length > 1) {
    return repeatMethod.call(this, 'detach', args);
  }

  domAdapter.removeElement(this[0]);

  return this;
};

InitRender.prototype.empty = function (this: Renderer, ...args: []): Renderer {
  if (this.length > 1) {
    return repeatMethod.call(this, 'empty', args);
  }

  cleanDataRecursive(this[0]);
  domAdapter.setText(this[0], '');

  return this;
};

InitRender.prototype.clone = function (this: Renderer): Renderer {
  const result: Node[] = [];
  for (let i = 0; i < this.length; i += 1) {
    result.push(this[i].cloneNode(true));
  }
  return renderer(result);
};

function text(this: Renderer): string;
function text(this: Renderer, value: TextValue): Renderer;
function text(this: Renderer, ...args: [value?: TextValue]): Renderer | string {
  if (!args.length) {
    let result = '';

    for (let i = 0; i < this.length; i += 1) {
      result += this[i]?.textContent || '';
    }
    return result;
  }

  const [value] = args;
  const textValue = isFunction(value) ? value() : value;

  cleanDataRecursive(this[0], false);
  domAdapter.setText(this[0], isDefined(textValue) ? String(textValue) : '');

  return this;
}
InitRender.prototype.text = text;

function val(this: Renderer): unknown;
function val(this: Renderer, value: unknown): Renderer;
function val(this: Renderer, ...args: [value?: unknown]): unknown {
  if (args.length === 1) {
    const [value] = args;
    return this.prop('value', isDefined(value) ? value : '');
  }

  return this.prop('value');
}
InitRender.prototype.val = val;

InitRender.prototype.contents = function (this: Renderer): Renderer {
  if (!this[0]) return renderer();

  const result: Node[] = [];
  pushAll(result, this[0].childNodes);
  return renderer(result);
};

const findInElement = (element: RendererElement, selector: string, nodes: Node[]): void => {
  const elementId = element.getAttribute('id');
  let queryId = elementId || 'dx-query-children';

  if (!elementId) {
    setAttributeValue(element, 'id', queryId);
  }
  queryId = `[id='${queryId}'] `;

  const querySelector = queryId + selector.replace(/([^\\])(,)/g, `$1, ${queryId}`);
  pushAll(nodes, domAdapter.querySelectorAll(element, querySelector));
  setAttributeValue(element, 'id', elementId);
};

InitRender.prototype.find = function (this: Renderer, selector: FindSelector): Renderer {
  const result = renderer();
  if (!selector) {
    return result;
  }

  const nodes: Node[] = [];

  if (typeof selector === 'string') {
    const trimmedSelector = selector.trim();

    for (let i = 0; i < this.length; i += 1) {
      const element = this[i];
      if (domAdapter.isElementNode(element)) {
        findInElement(element, trimmedSelector, nodes);
      } else if (domAdapter.isDocument(element) || domAdapter.isDocumentFragment(element)) {
        pushAll(nodes, domAdapter.querySelectorAll(element, trimmedSelector));
      }
    }
  } else {
    const node = domAdapter.isNode(selector) ? selector : selector[0];
    for (let i = 0; i < this.length; i += 1) {
      if (this[i] !== node && this[i].contains(node)) {
        nodes.push(node);
      }
    }
  }

  return result.add(nodes);
};

const isVisible = (_: number, element: RendererElement): boolean => {
  const target = element.host ?? element;

  if (!target.nodeType) return true;
  return !!(target.offsetWidth || target.offsetHeight || target.getClientRects?.().length);
};

InitRender.prototype.filter = function (this: Renderer, selector: RendererFilter): Renderer {
  if (!selector) return renderer();

  if (selector === ':visible') {
    return this.filter(isVisible);
  } if (selector === ':hidden') {
    return this.filter((_, element) => !isVisible(_, element));
  }

  const result: RendererElement[] = [];
  for (let i = 0; i < this.length; i += 1) {
    const item = this[i];
    if (domAdapter.isElementNode(item) && isString(selector)) {
      if (domAdapter.elementMatches(item, selector)) {
        result.push(item);
      }
    } else if (domAdapter.isNode(selector) || isWindow(selector)) {
      if (selector === item) {
        result.push(item);
      }
    } else if (isFunction(selector)) {
      if (selector.call(item, i, item)) {
        result.push(item);
      }
    } else {
      pushMatches(result, selector, item);
    }
  }

  return renderer(result);
};

InitRender.prototype.not = function (this: Renderer, selector: RendererFilter): Renderer {
  const result: RendererElement[] = [];
  const nodes = this.filter(selector).toArray();

  for (let i = 0; i < this.length; i += 1) {
    if (!nodes.includes(this[i])) {
      result.push(this[i]);
    }
  }

  return renderer(result);
};

InitRender.prototype.is = function (this: Renderer, selector: RendererFilter): boolean {
  return !!this.filter(selector).length;
};

InitRender.prototype.children = function (this: Renderer, selector?: RendererFilter): Renderer {
  const result: Node[] = [];
  for (let i = 0; i < this.length; i += 1) {
    const nodes: ArrayLike<Node> = this[i] ? this[i].childNodes : [];
    const { length } = nodes;
    for (let j = 0; j < length; j += 1) {
      if (domAdapter.isElementNode(nodes[j])) {
        result.push(nodes[j]);
      }
    }
  }

  const $result = renderer(result);

  return selector ? $result.filter(selector) : $result;
};

InitRender.prototype.siblings = function (this: Renderer): Renderer {
  const element = this[0];
  if (!element?.parentNode) {
    return renderer();
  }

  const result: Node[] = [];
  const parentChildNodes: ArrayLike<Node> = element.parentNode.childNodes || [];
  const { length } = parentChildNodes;

  for (let i = 0; i < length; i += 1) {
    const node = parentChildNodes[i];
    if (domAdapter.isElementNode(node) && node !== element) {
      result.push(node);
    }
  }

  return renderer(result);
};

InitRender.prototype.each = function (this: Renderer, callback: ElementCallback): void {
  for (let i = 0; i < this.length; i += 1) {
    if (callback.call(this[i], i, this[i]) === false) {
      break;
    }
  }
};

InitRender.prototype.index = function (this: Renderer, element?: RendererSelector): number {
  if (!element) {
    return this.parent().children().index(this);
  }

  const $element = renderer(element);
  return this.toArray().indexOf($element[0]);
};

InitRender.prototype.get = function (this: Renderer, index: number): RendererElement {
  return this[index < 0 ? this.length + index : index];
};

InitRender.prototype.eq = function (this: Renderer, index: number): Renderer {
  const normalizedIndex = index < 0 ? this.length + index : index;
  return renderer(this[normalizedIndex]);
};

InitRender.prototype.first = function (this: Renderer): Renderer {
  return this.eq(0);
};

InitRender.prototype.last = function (this: Renderer): Renderer {
  return this.eq(-1);
};

InitRender.prototype.select = function (this: Renderer): Renderer {
  for (let i = 0; i < this.length; i += 1) {
    this[i].select?.();
  }

  return this;
};

InitRender.prototype.parent = function (this: Renderer, selector?: RendererFilter): Renderer {
  if (!this[0]) return renderer();
  const result = renderer(this[0].parentNode);
  return !selector || result.is(selector) ? result : renderer();
};

InitRender.prototype.parents = function (this: Renderer, selector?: RendererFilter): Renderer {
  const result: Node[] = [];
  let parent = this.parent();

  while (parent?.[0] && !domAdapter.isDocument(parent[0])) {
    if (domAdapter.isElementNode(parent[0])) {
      if (!selector || parent.is(selector)) {
        result.push(parent.get(0));
      }
    }
    parent = parent.parent();
  }
  return renderer(result);
};

InitRender.prototype.closest = function (this: Renderer, selector: RendererFilter): Renderer {
  if (this.is(selector)) {
    return this;
  }

  let parent = this.parent();
  while (parent?.length) {
    if (parent.is(selector)) {
      return parent;
    }
    parent = parent.parent();
  }

  return renderer();
};

InitRender.prototype.next = function (
  this: Renderer,
  ...args: [selector?: RendererFilter]
): Renderer {
  if (!this[0]) return renderer();
  let next = renderer(this[0].nextSibling);
  if (!args.length) {
    return next;
  }
  const [selector] = args;
  while (next?.length) {
    if (next.is(selector)) return next;
    next = next.next();
  }
  return renderer();
};

InitRender.prototype.prev = function (this: Renderer): Renderer {
  if (!this[0]) return renderer();
  return renderer(this[0].previousSibling);
};

InitRender.prototype.add = function (this: Renderer, selector: RendererSelector): Renderer {
  const targets = renderer(selector);
  const result = this.toArray();
  const { length } = targets;

  for (let i = 0; i < length; i += 1) {
    const target = targets[i];
    if (!result.includes(target)) {
      result.push(target);
    }
  }

  return renderer(result);
};

const emptyArray: RendererElement[] = [];
const arraySplice: (
  this: ArrayLike<RendererElement>,
  start: number,
  deleteCount?: number,
) => RendererElement[] = emptyArray.splice;
InitRender.prototype.splice = function (
  this: Renderer,
  ...args: [start: number, deleteCount?: number]
): Renderer {
  return renderer(arraySplice.apply(this, args));
};
InitRender.prototype.slice = function (
  this: Renderer,
  ...args: [start?: number, end?: number]
): Renderer {
  return renderer(emptyArray.slice.apply(this, args));
};
InitRender.prototype.toArray = function (this: Renderer): RendererElement[] {
  return emptyArray.slice.call(this);
};

InitRender.prototype.offset = function (this: Renderer): Coordinates | undefined {
  if (!this[0]) return undefined;

  const offset: Coordinates = getOffset(this[0]);
  return offset;
};

InitRender.prototype.offsetParent = function (this: Renderer): Renderer {
  if (!this[0]) return renderer();

  let offsetParent = renderer(this[0].offsetParent);

  while (offsetParent[0] && offsetParent.css('position') === 'static') {
    offsetParent = renderer(offsetParent[0].offsetParent);
  }

  offsetParent = offsetParent[0] ? offsetParent : renderer(domAdapter.getDocumentElement());

  return offsetParent;
};

const parseCssValue = (value: string | undefined): number => parseFloat(value ?? '');

InitRender.prototype.position = function (this: Renderer): Coordinates | undefined {
  if (!this[0]) return undefined;

  const marginTop = parseCssValue(this.css('marginTop'));
  const marginLeft = parseCssValue(this.css('marginLeft'));

  if (this.css('position') === 'fixed') {
    const rect = this[0].getBoundingClientRect();

    return {
      top: rect.top - marginTop,
      left: rect.left - marginLeft,
    };
  }

  const offset = this.offset();
  if (!offset) return undefined;

  const offsetParent = this.offsetParent();
  let parentOffset: Coordinates = {
    top: 0,
    left: 0,
  };

  if (offsetParent[0].nodeName !== 'HTML') {
    parentOffset = offsetParent.offset() ?? parentOffset;
  }

  parentOffset = {
    top: parentOffset.top + parseCssValue(offsetParent.css('borderTopWidth')),
    left: parentOffset.left + parseCssValue(offsetParent.css('borderLeftWidth')),
  };

  return {
    top: offset.top - parentOffset.top - marginTop,
    left: offset.left - parentOffset.left - marginLeft,
  };
};

const SCROLL_LEFT_STRATEGY: ScrollStrategy = {
  propName: 'scrollLeft',
  offsetProp: 'pageXOffset',
  scrollWindow(win, value) {
    win.scrollTo(value, win.pageYOffset);
  },
};

const SCROLL_TOP_STRATEGY: ScrollStrategy = {
  propName: 'scrollTop',
  offsetProp: 'pageYOffset',
  scrollWindow(win, value) {
    win.scrollTo(win.pageXOffset, value);
  },
};

const scroll = function (
  this: Renderer,
  strategy: ScrollStrategy,
  value?: number,
): Renderer | number | undefined {
  if (!this[0]) {
    return undefined;
  }

  const elementWindow: Window | undefined = getWindowByElement(this[0]);

  if (value === undefined) {
    return elementWindow ? elementWindow[strategy.offsetProp] : this[0][strategy.propName];
  }

  if (elementWindow) {
    strategy.scrollWindow(elementWindow, value);
  } else {
    this[0][strategy.propName] = value;
  }
  return this;
};

function scrollLeft(this: Renderer): number | undefined;
function scrollLeft(this: Renderer, value: number): Renderer | undefined;
function scrollLeft(this: Renderer, value?: number): Renderer | number | undefined {
  return scroll.call(this, SCROLL_LEFT_STRATEGY, value);
}
InitRender.prototype.scrollLeft = scrollLeft;

function scrollTop(this: Renderer): number | undefined;
function scrollTop(this: Renderer, value: number): Renderer | undefined;
function scrollTop(this: Renderer, value?: number): Renderer | number | undefined {
  return scroll.call(this, SCROLL_TOP_STRATEGY, value);
}
InitRender.prototype.scrollTop = scrollTop;

function data(this: Renderer, key?: string): unknown;
function data(this: Renderer, key: string, value: unknown): Renderer | undefined;
function data(this: Renderer, ...args: [key?: string, value?: unknown]): unknown {
  if (!this[0]) return undefined;

  const [key, value] = args;
  if (args.length < 2) {
    return elementData.call(renderer, this[0], key);
  }
  elementData.call(renderer, this[0], key, value);
  return this;
}
InitRender.prototype.data = data;

InitRender.prototype.removeData = function (this: Renderer, key?: string): Renderer {
  if (this[0]) {
    removeData(this[0], key);
  }

  return this;
};

const rendererWrapper = function (this: unknown, ...args: Parameters<RendererFactory>): Renderer {
  return renderer.apply(this, args);
} as RendererFactory;

Object.defineProperty(rendererWrapper, 'fn', {
  enumerable: true,
  configurable: true,

  get(): Renderer {
    return renderer.fn;
  },

  set(value: Renderer): void {
    renderer.fn = value;
  },
});

export default {
  set(strategy: RendererFactory): void {
    renderer = strategy;
  },
  get(): RendererFactory {
    return rendererWrapper;
  },
};
