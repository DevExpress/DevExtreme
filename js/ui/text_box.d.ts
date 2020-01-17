import dxTextEditor, {
    dxTextEditorOptions
} from './text_box/ui.text_editor.base';

export interface dxTextBoxOptions<T = dxTextBox> extends dxTextEditorOptions<T> {
    /**
     * @docid dxTextBoxOptions.maxLength
     * @type string|number
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxLength?: string | number;
    /**
     * @docid dxTextBoxOptions.mode
     * @type Enums.TextBoxMode
     * @default "text"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    mode?: 'email' | 'password' | 'search' | 'tel' | 'text' | 'url';
    /**
     * @docid dxTextBoxOptions.value
     * @type string
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: string;
}
/**
 * @docid dxTextBox
 * @isEditor
 * @inherits dxTextEditor
 * @module ui/text_box
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxTextBox extends dxTextEditor {
    constructor(element: Element, options?: dxTextBoxOptions)
    constructor(element: JQuery, options?: dxTextBoxOptions)
}

declare global {
interface JQuery {
    dxTextBox(): JQuery;
    dxTextBox(options: "instance"): dxTextBox;
    dxTextBox(options: string): any;
    dxTextBox(options: string, ...params: any[]): any;
    dxTextBox(options: dxTextBoxOptions): JQuery;
}
}
export type Options = dxTextBoxOptions;

/** @deprecated use Options instead */
export type IOptions = dxTextBoxOptions;