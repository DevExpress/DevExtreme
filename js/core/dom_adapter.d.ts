export interface DomAdapter {
  getDocument: () => Document;
  getDocumentElement: () => HTMLDocument & {
    scrollLeft: number;
    scrollTop: number;
    clientWidth: number;
    scrollHeight: number;
    offsetHeight: number;
    clientHeight: number;
  };
  isNode: (node: unknown) => boolean;
  getBody: () => HTMLBodyElement;
  isElementNode: (element: unknown) => boolean;
  createElement: (tagName: string, context?: Document) => HTMLElement;
  createDocumentFragment: () => DocumentFragment;
}

declare const domAdapter: DomAdapter;
export default domAdapter;
