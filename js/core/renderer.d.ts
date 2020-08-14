interface Coordinates {
    left: number;
    top: number;
}

export interface dxElementWrapper {
    
    addClass(className: string): JQuery;
    
    attr(attributeName: string, value: string|number|null): JQuery;

    hasClass(className: string): boolean;
    
    html(value: string): JQuery;

    prop(propertyName: string, value: string|number|boolean): JQuery;

    removeAttr(attributeName: string): JQuery;
    
    removeClass(className?: string): JQuery;
       
    toggleClass(className: string, swtch?: boolean): JQuery;
    
    val(value: string|string[]|number): JQuery;   
    
    css(propertyName: string, value: string|number): JQuery;
    
    height(value: string|number): number;
    
    innerHeight(value: string|number): number;
    
    innerWidth(value: string|number): number;
    
    offset(): Coordinates|undefined;
    
    outerHeight(value: number|string): JQuery;
    
    outerWidth(value: number|string): JQuery;
    
    position(): Coordinates|undefined;
    
    scrollLeft(value: string|undefined): JQuery;
    
    scrollTop(value: string|undefined): JQuery;
    
    width(value: number|string): JQuery;
    
    data(key: string, value: any): JQuery;
       
    removeData(key: string): JQuery;
    
    hide(): JQuery;
    
    show(): JQuery;
    
    toggle(value: string|undefined): JQuery;
  
    after(element: Element|JQuery): JQuery;
    
    append(element: Element|JQuery): JQuery;
    
    appendTo(element: Element|JQuery): JQuery;

    clone(withDataAndEvents?: boolean, deepWithDataAndEvents?: boolean): JQuery;
    
    detach(): JQuery;
    
    empty(): JQuery;
    
    insertAfter(element: Element|JQuery): JQuery;
    
    insertBefore(element: Element|JQuery): JQuery;
    
    prepend(element: Element|JQuery): JQuery;
    
    remove(element: Element|JQuery): JQuery;
    
    replaceWith(element: Element|JQuery): JQuery;
 
    text(text: string|number|boolean): JQuery;
    
    toArray(): Element[];
    
    wrap(wrappingElement: JQuery|Element|string): JQuery;
    
    wrapInner(wrappingElement: JQuery|Element|string): JQuery;
    
    each(func: () => boolean | void): JQuery;
    
    get(index: number): Element;

    index(element: Element|JQuery): number;
    
    add(selector: string): JQuery;
    
    children(selector: string): JQuery;   
    
    closest(selector: string): JQuery;
    
    contents(): JQuery;
    
    eq(index: number): JQuery;
    
    filter(selector: string): JQuery;
    
    find(selector_element: string | Element | JQuery): JQuery;
    
    first(): JQuery;
    
    is(selector: string): boolean;
    
    last(): JQuery;
    
    next(selector: string): JQuery;
    
    not(selector: string): JQuery;

    offsetParent(): JQuery;
    
    parent(selector: string): JQuery;
    
    parents(selector: string): JQuery;
    
    prev(): JQuery;
    
    siblings(): JQuery;
    
    slice(): JQuery;
}
