interface Coordinates {
    left: number;
    top: number;
}

export interface dxElementWrapper {
    
    addClass(className: string): JQuery;
    
    attr(attributeName: string, value: string|number|null): JQuery;

    hasClass(className: string): boolean;
    
    html(htmlString: string): JQuery;

    prop(propertyName: string, value: string|number|boolean): JQuery;

    removeAttr(attributeName: string): JQuery;
    
    removeClass(className?: string): JQuery;
       
    toggleClass(className: string, swtch?: boolean): JQuery;
    
    val(value: string|string[]|number): JQuery;   
    
    css(propertyName: string, value: string|number): JQuery;
    
    height(): number;
    
    innerHeight(): number;
    
    innerWidth(): number;
    
    offset(): Coordinates | undefined;
    
    outerHeight(value: number|string): JQuery;
    
    outerWidth(value: number|string): JQuery;
    
    position(): Coordinates;
    
    scrollLeft(value: number): JQuery;
    
    scrollTop(value: number): JQuery;
    
    width(value: number|string): JQuery;
    
    clearQueue(queueName?: string): JQuery;
    
    data(key: string, value: any): JQuery;
       
    removeData(name: string): JQuery;
    
    hide(duration?: number|string, complete?: Function): JQuery;
    
    show(duration?: number|string, complete?: Function): JQuery;
    
    toggle(duration?: number|string, complete?: Function): JQuery;
    
    scroll(): JQuery;
  
    after(func: (index: number, html: string) => string|Element|JQuery): JQuery;
    
    append(func: (index: number, html: string) => string|Element|JQuery): JQuery;
    
    appendTo(target: JQuery|any[]|Element|string): JQuery;

    clone(withDataAndEvents?: boolean, deepWithDataAndEvents?: boolean): JQuery;
    
    detach(selector?: string): JQuery;
    
    empty(): JQuery;
    
    insertAfter(target: JQuery|any[]|Element|Text|string): JQuery;
    
    insertBefore(target: JQuery|any[]|Element|Text|string): JQuery;
    
    prepend(func: (index: number, html: string) => string|Element|JQuery): JQuery;
    
    remove(selector?: string): JQuery;
    
    replaceWith(func: () => Element|JQuery): JQuery;
 
    text(text: string|number|boolean): JQuery;
    
    toArray(): Element[];
    
    wrap(wrappingElement: JQuery|Element|string): JQuery;
    
    wrapInner(wrappingElement: JQuery|Element|string): JQuery;
    
    each(func: (index: number, elem: Element) => boolean | void): JQuery;
    
    get(index: number): Element;

    index(selector: string|JQuery|Element): number;
    
    add(...elements: Element[]): JQuery;
    
    children(selector?: string): JQuery;   
    
    closest(selector: string, context?: Element): JQuery;
    
    contents(): JQuery;
    
    eq(index: number): JQuery;
    
    filter(selector: string): JQuery;
    
    find(selector_element: string | Element | JQuery): JQuery;
    
    first(): JQuery;
    
    is(selector: string): boolean;
    
    last(): JQuery;
    
    next(selector?: string): JQuery;
    
    not(selector: string): JQuery;

    offsetParent(): JQuery;
    
    parent(selector?: string): JQuery;
    
    parents(selector?: string): JQuery;
    
    prev(selector?: string): JQuery;
    
    siblings(selector?: string): JQuery;
    
    slice(start: number, end?: number): JQuery;
}
