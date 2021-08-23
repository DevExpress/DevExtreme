export interface DomAdapter {
  getActiveElement(): HTMLElement;
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
  isElementNode(element: unknown): boolean;
  createElement(tagName: string, context?: Document): HTMLElement;
  createDocumentFragment(): DocumentFragment;
  setClass(element: HTMLElement, className: string, isAdd: boolean): void;
  removeElement(element: HTMLElement): void;
  inject(obj: Record<string, unknown>): void;
}

declare const domAdapter: DomAdapter;
export default domAdapter;
