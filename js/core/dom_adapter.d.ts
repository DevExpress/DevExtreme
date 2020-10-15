type DOMAdapterType = {
    querySelectorAll: (element: Element, selector: string) => NodeListOf<Element>;
    elementMatches: (element: Element, selector: string) => boolean;
    createElement: (tagName: string, context?: Element) => Element;
    createElementNS: (ns, tagName: string, context?: Element) => Element;
    createTextNode: (text: string, context?: Element) => Text;
    isNode: (element: Element) => boolean;
    isElementNode: (element: Element) => boolean;
    isTextNode: (element: Element) => boolean;
    isDocument: (element: Element) => boolean;
    removeElement: (element: Element) => void;
    insertElement: (parentElement: Element, newElement: Element, nextSiblingElement?: Element) => void;
    getAttribute: (element: Element, name: string) => Text;
    setAttribute: (element: Element, name: string, value: string) => void;
    removeAttribute: (element: Element, name: string) => void;
    setProperty: (element: Element, name: string, value: string) => void;
    setText: (element: Element, text: Text) => void;
    setClass: (element: Element, className: string, isAdd?: boolean) => void;
    setStyle: (element: Element, name: string, value: string | undefined) => void;
    getDocument: () => Document | undefined;
    getActiveElement: () => Element | undefined;
    getBody: () => HTMLElement;
    createDocumentFragment: () => DocumentFragment;
    getDocumentElement: () => Element;
    getLocation: () => Location;
    getSelection: () => Selection;
    getReadyState: () => DocumentReadyState;
    getHead: () => HTMLHeadElement;
    hasDocumentProperty: (property: string) => boolean;
    listen: (element: Element, event: string, callback: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined) => () => void;
    inject: (injection: object) => void;
};

declare const domAdapter: DOMAdapterType;

export default domAdapter;
