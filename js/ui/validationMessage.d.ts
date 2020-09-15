import '../jquery_augmentation';

import dxOverlay, {
    dxOverlayOptions
} from './overlay';

export interface dxValidationMessageOptions<T = dxValidationMessage> extends dxOverlayOptions<T> {
    /**
     * @docid dxValidationMessageOptions.mode
     * @type string
     * @default "auto"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    mode?: string;

    /**
     * @docid dxValidationMessageOptions.validationErrors
     * @type Array<object> | null
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    validationErrors?: Array<object> | null;

    /**
     * @docid dxValidationMessageOptions.positionRequest
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    positionRequest?: string;

    /**
     * @docid dxValidationMessageOptions.boundary
     * @type String | Element | jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    boundary?: String | Element | JQuery;

    /**
     * @docid dxValidationMessageOptions.offset
     * @type object
     * @default { h: 0, v: 0}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    offset?: object;
}
/**
 * @docid dxValidationMessage
 * @inherits dxOverlay
 * @module ui/validation_message
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxValidationMessage extends dxOverlay {
    constructor(element: Element, options?: dxValidationMessageOptions)
    constructor(element: JQuery, options?: dxValidationMessageOptions)
}

declare global {
interface JQuery {
    dxValidationMessage(): JQuery;
    dxValidationMessage(options: "instance"): dxValidationMessage;
    dxValidationMessage(options: string): any;
    dxValidationMessage(options: string, ...params: any[]): any;
    dxValidationMessage(options: dxValidationMessageOptions): JQuery;
}
}
export type Options = dxValidationMessageOptions;

/** @deprecated use Options instead */
export type IOptions = dxValidationMessageOptions;