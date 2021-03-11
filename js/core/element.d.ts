import { dxElementWrapper } from '../core/renderer';

export interface ElementWrapper<T extends Element> { }
export type TElement<T extends Element = HTMLElement> = {} extends ElementWrapper<T> ? T : ElementWrapper<T>
export type TElementWrapper<T extends Element = HTMLElement> = {} extends ElementWrapper<T> ? dxElementWrapper : ElementWrapper<T>

export interface ElementsArrayWrapper<T extends Element> { }
export type TElementsArray<T extends Element = HTMLElement> = {} extends ElementsArrayWrapper<T> ? Array<T> : ElementsArrayWrapper<T>

/**
 * @docid
 * @hidden
 * @prevFileNamespace DevExpress.core
 * @deprecated Use TElement instead
 */
export type dxElement = TElement<HTMLElement>;

/**
 * @docid
 * @hidden
 * @prevFileNamespace DevExpress.core
 * @deprecated Use TElement instead
 */
export type dxSVGElement = TElement<SVGElement>;

export function getPublicElement(element: TElementWrapper): TElement;
export function setPublicElementWrapper(newStrategy: (element: TElementWrapper) => TElement): void;
