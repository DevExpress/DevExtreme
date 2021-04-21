import { dxElementWrapper } from '../core/renderer';

export interface ElementWrapper<T extends Element> { }
export interface ElementsArrayWrapper<T extends Element> { }
/**
 * @docid
 * @type dxElement|dxSVGElement
 * @prevFileNamespace DevExpress.core
 */
export type DxElement<T extends Element = HTMLElement> = {} extends ElementWrapper<T> ? T : ElementWrapper<T>;

/**
 * @docid
 * @prevFileNamespace DevExpress.core
 */
export type UserDefinedElement<T extends Element = Element> = {} extends ElementWrapper<T> ? T : ElementWrapper<T> | T;

export type UserDefinedElementsArray = {} extends ElementsArrayWrapper<Element> ? Array<Element> : ElementsArrayWrapper<Element>;

export interface InternalElementWrapper<T extends Element> { }
export type InternalElement<T extends Element> = {} extends InternalElementWrapper<T> ? dxElementWrapper : InternalElementWrapper<T>;

/**
 * @docid
 * @hidden
 * @type HTMLElement|JQuery
 * @prevFileNamespace DevExpress.core
 * @deprecated
 */
export type dxElement = DxElement<HTMLElement>;

/**
 * @docid
 * @hidden
 * @type SVGElement|JQuery
 * @prevFileNamespace DevExpress.core
 * @deprecated
 */
export type dxSVGElement = DxElement<SVGElement>;

export function getPublicElement(element: InternalElement<Element>): DxElement<Element>;
export function setPublicElementWrapper(newStrategy: (element: InternalElement<Element>) => DxElement<Element>): void;
