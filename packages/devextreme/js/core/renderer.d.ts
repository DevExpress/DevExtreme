export interface Coordinates {
  left: number;
  top: number;
}

export interface dxElementWrapper {

  add(selector: string | dxElementWrapper): this;

  addClass(className: string): this;

  after(element: Element | dxElementWrapper): this;

  append(element: Element | dxElementWrapper | string): this;
  append(element: Element[] | dxElementWrapper[] | string[]): this;

  appendTo(element: Element | dxElementWrapper): this;

  attr(attributeName: string, value: string | number | boolean | null): this;

  attr(attributes: Record<string, string | number | boolean | null | undefined>): this;

  attr(attributeName: string): string | undefined;

  before(element: Element | dxElementWrapper): this;

  children(selector?: string): this;

  clone(): this;

  closest(selector: string | dxElementWrapper | Node): this;

  contents(): this;

  css(propertyName: string, value: string | number): this;
  css(properties: Record<string, any>): this;
  css(propertyName: string): string | undefined;

  data(key: string, value: any): this;

  data<T = any>(key?: string): T;

  detach(): this;

  each(func: (this: Element, index: number, element: Element) => unknown): this;

  empty(): this;

  eq(index: number): this;

  filter(selector: string | Element | Element[] | dxElementWrapper | ((this: Element, index: number, element: Element) => unknown) | null | undefined): this;

  find(selector_element: string | Element | dxElementWrapper): this;

  first(): this;

  get(index: number): Element;

  hasClass(className: string): boolean;

  hide(): this;

  html<T = any>(): T;
  html(value: string | number | undefined): this;

  index(element?: Element | dxElementWrapper): number;

  insertAfter(element: Element | dxElementWrapper): this;

  insertBefore(element: Element | dxElementWrapper): this;

  is(selector: string | Element | Element[] | dxElementWrapper | ((this: Element, index: number, element: Element) => unknown) | null | undefined): boolean;

  last(): this;

  next(selector?: string): this;

  not(selector: string | Element | Element[] | dxElementWrapper | ((this: Element, index: number, element: Element) => unknown) | null | undefined): this;

  offset(): Coordinates | undefined;

  offsetParent(): this;

  parent(selector?: string): this;

  parents(selector?: string): this;

  position(): Coordinates | undefined;

  prepend(element: Element | dxElementWrapper): this;

  prependTo(element: Element | dxElementWrapper): this;

  prev(): this;

  prop(propertyName: string, value: string | number | boolean): this;
  prop<T = any>(propertyName: string, value?: string | number | boolean): T;

  remove(element?: Element | dxElementWrapper): this;

  removeAttr(attributeName: string): this;

  removeClass(className: string): this;

  removeData(key: string): this;

  replaceWith(element: Element | dxElementWrapper): this;

  scrollLeft<T = any>(): T;
  scrollLeft(value: string | number | undefined): this;

  scrollTop<T = any>(): T;
  scrollTop(value: string | number | undefined): this;

  show(): this;

  siblings(): this;

  slice(start?: number, end?: number): this;

  splice(start: number, deleteCount?: number): this;

  text(text: string | number | boolean): this;
  text(): string;

  toArray(): Element[];

  toggle(value?: boolean | string): this;

  toggleClass(className: string, value?: boolean): this;

  trim(): this;

  val(): string;
  val(value?: string | string[] | number): this;

  wrap(wrappingElement: this | Element | string): this;

  wrapInner(wrappingElement: this | Element | string): this;

  length: number;
}

declare function renderer(selector?: string | EventTarget | EventTarget[] | dxElementWrapper | null): dxElementWrapper;

export default renderer;
