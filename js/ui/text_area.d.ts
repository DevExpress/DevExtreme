import dxTextBox, {
    dxTextBoxOptions
} from './text_box';

export interface dxTextAreaOptions extends dxTextBoxOptions<dxTextArea> {
    /**
     * @docid dxTextAreaOptions.autoResizeEnabled
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    autoResizeEnabled?: boolean;
    /**
     * @docid dxTextAreaOptions.maxHeight
     * @type numeric|string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxHeight?: number | string;
    /**
     * @docid dxTextAreaOptions.minHeight
     * @type numeric|string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    minHeight?: number | string;
    /**
     * @docid dxTextAreaOptions.spellcheck
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    spellcheck?: boolean;
}
/**
 * @docid dxTextArea
 * @isEditor
 * @inherits dxTextBox
 * @module ui/text_area
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxTextArea extends dxTextBox {
    constructor(element: Element, options?: dxTextAreaOptions)
    constructor(element: JQuery, options?: dxTextAreaOptions)
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