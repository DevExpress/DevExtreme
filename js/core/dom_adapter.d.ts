export interface DomAdapter {
  getActiveElement(element?: HTMLElement | null): HTMLElement;
  getDocument(): Document;
  getDocumentElement(): HTMLDocument & {
    scrollLeft: number;
    scrollTop: number;
    clientWidth: number;
    scrollHeight: number;
    offsetHeight: number;
    clientHeight: number;
  };
  isNode(node: unknown): boolean;
  getBody(): HTMLBodyElement;
  getRootNode(element: HTMLElement): Document | DocumentFragment;
  isElementNode(element: unknown): boolean;
  createElement(tagName: string, context?: Document): HTMLElement;
  createDocumentFragment(): DocumentFragment;
  setClass(element: HTMLElement, className: string, isAdd: boolean): void;
  removeElement(element: HTMLElement): void;
  inject(obj: Record<string, unknown>): void;
  setStyle(element: HTMLElement, name: string, value: string): void;
  insertElement(parentElement: HTMLElement, newElement: HTMLElement, nextSiblingElement?: HTMLElement): void;
}

declare const domAdapter: DomAdapter;
export default domAdapter;
