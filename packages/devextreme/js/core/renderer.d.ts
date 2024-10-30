interface Coordinates {
    left: number;
    top: number;
}

export interface dxElementWrapper {

  add(selector: string): this;

  addClass(className: string): this;

  after(element: Element | dxElementWrapper): this;

  append(element: Element | dxElementWrapper): this;

  appendTo(element: Element | dxElementWrapper): this;

  attr(attributeName: string, value: string | number | boolean | null): this;

  attr(attributeName: string): string | undefined;

  before(element: Element | dxElementWrapper): this;

  children(selector?: string): this;

  clone(): this;

  closest(selector: string | dxElementWrapper | Node): this;

  contents(): this;

  css(propertyName: string, value: string | number): this;
  css(properties: Record<string, any>): this;

  data(key: string, value?: any): this;

  detach(): this;

  each(func: (this: Element, index: number, element: Element) => boolean): this;

  empty(): this;

  eq(index: number): this;

  filter(selector: string): this;

  find(selector_element: string | Element | dxElementWrapper): this;

  first(): this;

  get(index: number): Element;

  hasClass(className: string): boolean;

  hide(): this;

  html(value?: string): this;

  index(element?: Element | dxElementWrapper): number;

  insertAfter(element: Element | dxElementWrapper): this;

  insertBefore(element: Element | dxElementWrapper): this;

  is(selector: string | dxElementWrapper): boolean;

  last(): this;

  next(selector?: string): this;

  not(selector: string): this;

  offset(): Coordinates | undefined;

  offsetParent(): this;

  parent(selector?: string): this;

  parents(selector?: string): this;

  position(): Coordinates | undefined;

  prepend(element: Element | dxElementWrapper): this;

  prependTo(element: Element | dxElementWrapper): this;

  prev(): this;

  prop(propertyName: string, value: string | number | boolean): this;

  remove(element?: Element | dxElementWrapper): this;

  removeAttr(attributeName: string): this;

  removeClass(className: string): this;

  removeData(key: string): this;

  replaceWith(element: Element | dxElementWrapper): this;

  scrollLeft(value?: string | undefined): this;

  scrollTop(value?: string): this;

  show(): this;

  siblings(): this;

  slice(start?: number, end?: number): this;

  splice(start: number, deleteCount?: number): this;

  text(text: string | number | boolean): this;
  text(): string;

  toArray(): Element[];

  toggle(value: string | undefined): this;

  toggleClass(className: string, value?: boolean): this;

  trim(): this;

  val(value?: string | string[] | number): this;

  wrap(wrappingElement: this | Element | string): this;

  wrapInner(wrappingElement: this | Element | string): this;

  length: number;
}

declare function renderer(selector?: string | Element | dxElementWrapper): dxElementWrapper;

export default renderer;
