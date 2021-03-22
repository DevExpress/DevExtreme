import {
    TElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import {
    TEvent
} from '../events/index';

import Editor, {
    EditorOptions
} from './editor/editor';

import {
    dxToolbarItem
} from './toolbar';

export interface dxHtmlEditorOptions extends EditorOptions<dxHtmlEditor> {
    /**
     * @docid
     * @type_function_param1 config:object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    customizeModules?: ((config: any) => any);
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    mediaResizing?: dxHtmlEditorMediaResizing;
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    mentions?: Array<dxHtmlEditorMention>;
    /**
     * @docid
     * @hidden false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onFocusIn?: ((e: { component?: dxHtmlEditor, element?: TElement, model?: any, event?: TEvent }) => void);
    /**
     * @docid
     * @extends Action
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onFocusOut?: ((e: { component?: dxHtmlEditor, element?: TElement, model?: any, event?: TEvent }) => void);
    /**
     * @docid
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    placeholder?: string;
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toolbar?: dxHtmlEditorToolbar;
    /**
     * @docid
     * @type Enums.HtmlEditorValueType
     * @default "html"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    valueType?: 'html' | 'markdown';
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    variables?: dxHtmlEditorVariables;
    /**
     * @docid
     * @type Enums.EditorStylingMode
     * @default 'outlined'
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    stylingMode?: 'outlined' | 'underlined' | 'filled';
}
/**
 * @docid
 * @inherits Editor
 * @hasTranscludedContent
 * @isEditor
 * @module ui/html_editor
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxHtmlEditor extends Editor {
    constructor(element: TElement, options?: dxHtmlEditorOptions)
    /**
     * @docid
     * @publicName clearHistory()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    clearHistory(): void;
    /**
     * @docid
     * @publicName delete(index, length)
     * @param1 index:number
     * @param2 length:number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    delete(index: number, length: number): void;
    /**
     * @docid
     * @publicName format(formatName, formatValue)
     * @param1 formatName:Enums.HtmlEditorFormat|string
     * @param2 formatValue:any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    format(formatName: 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'size' | 'strike' | 'script' | 'underline' | 'blockquote' | 'header' | 'indent' | 'list' | 'align' | 'code-block' | string, formatValue: any): void;
    /**
     * @docid
     * @publicName formatLine(index, length, formatName, formatValue)
     * @param1 index:number
     * @param2 length:number
     * @param3 formatName:Enums.HtmlEditorFormat|string
     * @param4 formatValue:any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    formatLine(index: number, length: number, formatName: 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'size' | 'strike' | 'script' | 'underline' | 'blockquote' | 'header' | 'indent' | 'list' | 'align' | 'code-block' | string, formatValue: any): void;
    /**
     * @docid
     * @publicName formatLine(index, length, formats)
     * @param1 index:number
     * @param2 length:number
     * @param3 formats:object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    formatLine(index: number, length: number, formats: any): void;
    /**
     * @docid
     * @publicName formatText(index, length, formatName, formatValue)
     * @param1 index:number
     * @param2 length:number
     * @param3 formatName:Enums.HtmlEditorFormat|string
     * @param4 formatValue:any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    formatText(index: number, length: number, formatName: 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'size' | 'strike' | 'script' | 'underline' | 'blockquote' | 'header' | 'indent' | 'list' | 'align' | 'code-block' | string, formatValue: any): void;
    /**
     * @docid
     * @publicName formatText(index, length, formats)
     * @param1 index:number
     * @param2 length:number
     * @param3 formats:object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    formatText(index: number, length: number, formats: any): void;
    /**
     * @docid
     * @publicName get(componentPath)
     * @param1 componentPath:string
     * @return Object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    get(componentPath: string): any;
    /**
     * @docid
     * @publicName getFormat(index, length)
     * @param1 index:number
     * @param2 length:number
     * @return Object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getFormat(index: number, length: number): any;
    /**
     * @docid
     * @publicName getLength()
     * @return number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getLength(): number;
    /**
     * @docid
     * @publicName getModule(moduleName)
     * @param1 moduleName:string
     * @return Object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getModule(moduleName: string): any;
    /**
     * @docid
     * @publicName getQuillInstance()
     * @return Object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getQuillInstance(): any;
    /**
     * @docid
     * @publicName getSelection()
     * @return Object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getSelection(): any;
    /**
     * @docid
     * @publicName insertEmbed(index, type, config)
     * @param1 index:number
     * @param2 type:string
     * @param3 config:any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    insertEmbed(index: number, type: string, config: any): void;
    /**
     * @docid
     * @publicName insertText(index, text, formats)
     * @param1 index:number
     * @param2 text:string
     * @param3 formats:object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    insertText(index: number, text: string, formats: any): void;
    /**
     * @docid
     * @publicName redo()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    redo(): void;
    /**
     * @docid
     * @publicName register(components)
     * @param1 modules:Object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    register(modules: any): void;
    /**
     * @docid
     * @publicName removeFormat(index, length)
     * @param1 index:number
     * @param2 length:number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    removeFormat(index: number, length: number): void;
    /**
     * @docid
     * @publicName setSelection(index, length)
     * @param1 index:number
     * @param2 length:number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    setSelection(index: number, length: number): void;
    /**
     * @docid
     * @publicName undo()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    undo(): void;
}

/**
* @docid
* @type object
*/
export interface dxHtmlEditorMediaResizing {
    /**
     * @docid
     * @default ["image"]
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowedTargets?: Array<string>;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    enabled?: boolean;
}

/**
* @docid
* @type object
*/
export interface dxHtmlEditorMention {
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: Array<string> | DataSource | DataSourceOptions;
    /**
     * @docid
     * @default "this"
     * @type_function_param1 item:object
     * @type_function_return string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    displayExpr?: string | ((item: any) => string);
    /**
     * @docid
     * @default "item"
     * @type_function_param1 itemData:object
     * @type_function_param2 itemIndex:number
     * @type_function_param3 itemElement:dxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemTemplate?: template | ((itemData: any, itemIndex: number, itemElement: TElement) => string | TElement);
    /**
     * @docid
     * @default "@"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    marker?: string;
    /**
     * @docid
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    minSearchLength?: number;
    /**
     * @docid
     * @type getter|Array<getter>
     * @default "this"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    searchExpr?: string | Function | Array<string | Function>;
    /**
     * @docid
     * @default 500
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    searchTimeout?: number;
    /**
     * @docid
     * @default null
     * @type_function_param1 mentionData:object
     * @type_function_param1_field1 marker:string
     * @type_function_param1_field2 id:string|number
     * @type_function_param1_field3 value:any
     * @type_function_param2 contentElement:dxElement
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    template?: template | ((mentionData: { marker?: string, id?: string | number, value?: any }, contentElement: TElement) => string | TElement);
    /**
     * @docid
     * @default "this"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    valueExpr?: string | Function;
}

/**
* @docid
* @type object
*/
export interface dxHtmlEditorToolbar {
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    container?: string | TElement;
    /**
     * @docid
     * @type Array<dxHtmlEditorToolbarItem,Enums.HtmlEditorToolbarItem>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxHtmlEditorToolbarItem | 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'image' | 'size' | 'strike' | 'subscript' | 'superscript' | 'underline' | 'blockquote' | 'header' | 'increaseIndent' | 'decreaseIndent' | 'orderedList' | 'bulletList' | 'alignLeft' | 'alignCenter' | 'alignRight' | 'alignJustify' | 'codeBlock' | 'variable' | 'separator' | 'undo' | 'redo' | 'clear' | 'insertTable' | 'insertRowAbove' | 'insertRowBelow' | 'insertColumnLeft' | 'insertColumnRight' | 'deleteColumn' | 'deleteRow' | 'deleteTable'>;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    multiline?: boolean;
}

/**
* @docid
* @inherits dxToolbarItem
*/
export interface dxHtmlEditorToolbarItem extends dxToolbarItem {
    /**
     * @docid
     * @type Enums.HtmlEditorToolbarItem|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'image' | 'size' | 'strike' | 'subscript' | 'superscript' | 'underline' | 'blockquote' | 'header' | 'increaseIndent' | 'decreaseIndent' | 'orderedList' | 'bulletList' | 'alignLeft' | 'alignCenter' | 'alignRight' | 'alignJustify' | 'codeBlock' | 'variable' | 'separator' | 'undo' | 'redo' | 'clear' | 'insertTable' | 'insertRowAbove' | 'insertRowBelow' | 'insertColumnLeft' | 'insertColumnRight' | 'deleteColumn' | 'deleteRow' | 'deleteTable' | string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    acceptedValues?: Array<string | number | boolean>;
    /**
     * @docid
     * @default "before"
     * @type Enums.ToolbarItemLocation
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    location?: 'after' | 'before' | 'center';
}

/**
* @docid
* @type object
*/
export interface dxHtmlEditorVariables {
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<string> | DataSource | DataSourceOptions;
    /**
     * @docid
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    escapeChar?: string | Array<string>;
}

export type Options = dxHtmlEditorOptions;

/** @deprecated use Options instead */
export type IOptions = dxHtmlEditorOptions;
