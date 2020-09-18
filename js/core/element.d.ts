import { dxElementWrapper } from '../core/renderer';
/**
 * @docid dxElement
 * @type HTMLElement|jQuery
 * @hidden
 * @prevFileNamespace DevExpress.core
 */
export type dxElement = HTMLElement & JQuery;

/**
 * @docid dxSVGElement
 * @type SVGElement|jQuery
 * @hidden
 * @prevFileNamespace DevExpress.core
 */
export type dxSVGElement = SVGElement & JQuery;

export function getPublicElement(element: JQuery|dxElementWrapper): dxElement;
