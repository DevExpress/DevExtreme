import { dxElementWrapper } from '../core/renderer';

export interface ElementWrapper<T extends Element> { }
/**
 * @docid
 * @type dxElement|dxSVGElement
 * @prevFileNamespace DevExpress.core
 */
export type TElement<T extends Element> = {} extends ElementWrapper<T> ? T : ElementWrapper<T>;
export type THTMLElement = TElement<HTMLElement>;

export type ElementIntake<T extends Element = Element> = {} extends ElementWrapper<T> ? T : ElementWrapper<T> | T;

export interface InternalElementWrapper<T extends Element> { }
export type TInternalElement<T extends Element> = {} extends InternalElementWrapper<T> ? dxElementWrapper : InternalElementWrapper<T>;

export interface ElementsArrayWrapper<T extends Element> { }
export type TElementsArray<T extends Element> = {} extends ElementsArrayWrapper<T> ? Array<T> : ElementsArrayWrapper<T>;

/**
 * @docid
 * @hidden
 * @type HTMLElement|JQuery
 * @prevFileNamespace DevExpress.core
 * @deprecated TElement
 */
export type dxElement = TElement<HTMLElement>;

/**
 * @docid
 * @hidden
 * @type SVGElement|JQuery
 * @prevFileNamespace DevExpress.core
 * @deprecated TElement
 */
export type dxSVGElement = TElement<SVGElement>;

export function getPublicElement(element: TInternalElement<Element>): TElement<Element>;
export function setPublicElementWrapper(newStrategy: (element: TInternalElement<Element>) => TElement<Element>): void;
