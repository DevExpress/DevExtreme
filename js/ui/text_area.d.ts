import {
    TElement
} from '../core/element';

import dxTextBox, {
    dxTextBoxOptions
} from './text_box';

export interface dxTextAreaOptions extends dxTextBoxOptions<dxTextArea> {
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    autoResizeEnabled?: boolean;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxHeight?: number | string;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    minHeight?: number | string;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    spellcheck?: boolean;
}
/**
 * @docid
 * @isEditor
 * @inherits dxTextBox
 * @module ui/text_area
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxTextArea extends dxTextBox {
    constructor(element: TElement, options?: dxTextAreaOptions)
}

declare global {
interface JQuery {
    dxTextArea(): JQuery;
    dxTextArea(options: "instance"): dxTextArea;
    dxTextArea(options: string): any;
    dxTextArea(options: string, ...params: any[]): any;
    dxTextArea(options: dxTextAreaOptions): JQuery;
}
}
export type Options = dxTextAreaOptions;

/** @deprecated use Options instead */
export type IOptions = dxTextAreaOptions;
