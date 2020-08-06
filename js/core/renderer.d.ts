export interface dxElementWrapper {
    
    addClass(className: string): JQuery;
    
    attr(attributeName: string, value: string|number|null): JQuery;
    
    attr(attributeName: string, func: (index: number, attr: string) => string|number): JQuery;
    
    hasClass(className: string): boolean;
    
    html(htmlString: string): JQuery;
    
    html(func: (index: number, oldhtml: string) => string): JQuery;
    
    prop(propertyName: string, value: string|number|boolean): JQuery;
    
    prop(propertyName: string, func: (index: number, oldPropertyValue: any) => any): JQuery;
    
    removeAttr(attributeName: string): JQuery;
    
    removeClass(className?: string): JQuery;
    
    removeClass(func: (index: number, className: string) => string): JQuery;
       
    toggleClass(className: string, swtch?: boolean): JQuery;
    
    val(value: string|string[]|number): JQuery;   
    
    css(propertyName: string): string;
    
    css(propertyNames: string[]): any;
    
    css(propertyName: string, value: string|number): JQuery;
    
    css(propertyName: string, value: (index: number, value: string) => string|number): JQuery;
    
    
    height(): number;
    
    height(value: number|string): JQuery;
    
    height(func: (index: number, height: number) => number|string): JQuery;
    
    innerHeight(): number;
    
    innerHeight(value: number|string): JQuery;
    
    innerWidth(): number;
    
    innerWidth(value: number|string): JQuery;
    
    offset(): JQueryCoordinates | undefined;
    
    outerHeight(includeMargin?: boolean): number;
    
    outerHeight(value: number|string): JQuery;
    
    outerWidth(includeMargin?: boolean): number;
    
    outerWidth(value: number|string): JQuery;
    
    position(): JQueryCoordinates;
    
    scrollLeft(): number;
    
    scrollLeft(value: number): JQuery;
    
    scrollTop(): number;
    
    scrollTop(value: number): JQuery;
    
    width(): number;
    
    width(value: number|string): JQuery;
    
    width(func: (index: number, width: number) => number|string): JQuery;
    
    clearQueue(queueName?: string): JQuery;
    
    data(key: string, value: any): JQuery;
    
    data(obj: { [key: string]: any; }): JQuery; 
       
    removeData(name: string): JQuery;
    
    removeData(list: string[]): JQuery;
    
    removeData(): JQuery;
    
    hide(duration?: number|string, complete?: Function): JQuery;
    
    hide(duration?: number|string, easing?: string, complete?: Function): JQuery;
    
    hide(options: JQueryAnimationOptions): JQuery;
    
    show(duration?: number|string, complete?: Function): JQuery;
    
    show(duration?: number|string, easing?: string, complete?: Function): JQuery;   
    
    toggle(duration?: number|string, complete?: Function): JQuery;
    
    toggle(duration?: number|string, easing?: string, complete?: Function): JQuery;
    
    scroll(): JQuery;
    
    scroll(handler: (eventObject: JQueryEventObject) => any): JQuery;
    
    scroll(eventData: Object, handler: (eventObject: JQueryEventObject) => any): JQuery;
    
    after(content1: JQuery|any[]|Element|DocumentFragment|Text|string, ...content2: any[]): JQuery;
    
    after(func: (index: number, html: string) => string|Element|JQuery): JQuery;
    
    append(content1: JQuery|any[]|Element|DocumentFragment|Text|string, ...content2: any[]): JQuery;
    
    append(func: (index: number, html: string) => string|Element|JQuery): JQuery;
    
    appendTo(target: JQuery|any[]|Element|string): JQuery;
    
    before(content1: JQuery|any[]|Element|DocumentFragment|Text|string, ...content2: any[]): JQuery;
    
    before(func: (index: number, html: string) => string|Element|JQuery): JQuery;
    
    clone(withDataAndEvents?: boolean, deepWithDataAndEvents?: boolean): JQuery;
    
    detach(selector?: string): JQuery;
    
    empty(): JQuery;
    
    insertAfter(target: JQuery|any[]|Element|Text|string): JQuery;
    
    insertBefore(target: JQuery|any[]|Element|Text|string): JQuery;
    
    prepend(func: (index: number, html: string) => string|Element|JQuery): JQuery;
    
    remove(selector?: string): JQuery;
    
    replaceWith(func: () => Element|JQuery): JQuery;
    
    text(): string;
    
    text(text: string|number|boolean): JQuery;
    
    text(func: (index: number, text: string) => string): JQuery;
    
    toArray(): Element[];
    
    wrap(wrappingElement: JQuery|Element|string): JQuery;
    
    wrap(func: (index: number) => string|JQuery): JQuery;
    
    wrapInner(wrappingElement: JQuery|Element|string): JQuery;
    
    wrapInner(func: (index: number) => string): JQuery;
    
    each(func: (index: number, elem: Element) => boolean | void): JQuery;
    
    get(index: number): Element;
    
    get(): Element[];
    
    index(): number;
    
    index(selector: string|JQuery|Element): number;
    
    length: number;
    
    add(selector: string, context?: Element): JQuery;
    
    add(...elements: Element[]): JQuery;
    
    add(obj: JQuery): JQuery;
    
    children(selector?: string): JQuery;   
    
    closest(selector: string, context?: Element): JQuery;
    
    closest(obj: JQuery): JQuery;
    
    closest(element: Element): JQuery;
    
    contents(): JQuery;
    
    eq(index: number): JQuery;
    
    filter(selector: string): JQuery;
    
    filter(func: (index: number, element: Element) => boolean): JQuery;
    
    filter(element: Element): JQuery;
    
    filter(obj: JQuery): JQuery;
    
    find(selector_element: string | Element | JQuery): JQuery;
    
    first(): JQuery;
    
    is(selector: string): boolean;
    
    is(func: (index: number, element: Element) => boolean): boolean;
    
    is(obj: JQuery): boolean;
    
    last(): JQuery;
    
    next(selector?: string): JQuery;
    
    not(selector: string): JQuery;
    
    not(func: (index: number, element: Element) => boolean): JQuery;
    
    not(elements: Element|Element[]): JQuery;
    
    not(obj: JQuery): JQuery;
    
    offsetParent(): JQuery;
    
    parent(selector?: string): JQuery;
    
    parents(selector?: string): JQuery;
    
    prev(selector?: string): JQuery;
    
    siblings(selector?: string): JQuery;
    
    slice(start: number, end?: number): JQuery;
}