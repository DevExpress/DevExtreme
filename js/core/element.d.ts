import { dxElementWrapper } from '../core/renderer';
/**
 * @docid
 * @type HTMLElement|jQuery
 * @hidden
 * @prevFileNamespace DevExpress.core
 */
export type dxElement = HTMLElement & JQuery;

/**
 * @docid
 * @type SVGElement|jQuery
 * @hidden
 * @prevFileNamespace DevExpress.core
 */
export type dxSVGElement = SVGElement & JQuery;

export function getPublicElement(element: JQuery|dxElementWrapper): dxElement;
export function setPublicElementWrapper(newStrategy: (element: JQuery|dxElementWrapper) => dxElement): void;
