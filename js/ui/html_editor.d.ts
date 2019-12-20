import {
    dxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import {
    event
} from '../events';

import Editor, {
    EditorOptions
} from './editor/editor';

import {
    dxToolbarItem
} from './toolbar';

export interface dxHtmlEditorOptions extends EditorOptions<dxHtmlEditor> {
    /**
     * @docid dxHtmlEditorOptions.customizeModules
     * @type function
     * @type_function_param1 config:object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    customizeModules?: ((config: any) => any);
    /**
     * @docid dxHtmlEditorOptions.focusStateEnabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid dxHtmlEditorOptions.mediaResizing
     * @type dxHtmlEditorMediaResizing
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    mediaResizing?: dxHtmlEditorMediaResizing;
    /**
     * @docid dxHtmlEditorOptions.mentions
     * @type Array<dxHtmlEditorMention>
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    mentions?: Array<dxHtmlEditorMention>;
    /**
     * @docid dxHtmlEditorOptions.name
     * @type string
     * @hidden false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid dxHtmlEditorOptions.onFocusIn
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onFocusIn?: ((e: { component?: dxHtmlEditor, element?: dxElement, model?: any, event?: event }) => any);
    /**
     * @docid dxHtmlEditorOptions.onFocusOut
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onFocusOut?: ((e: { component?: dxHtmlEditor, element?: dxElement, model?: any, event?: event }) => any);
    /**
     * @docid dxHtmlEditorOptions.placeholder
     * @type string
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    placeholder?: string;
    /**
     * @docid dxHtmlEditorOptions.toolbar
     * @type dxHtmlEditorToolbar
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toolbar?: dxHtmlEditorToolbar;
    /**
     * @docid dxHtmlEditorOptions.valueType
     * @type Enums.HtmlEditorValueType
     * @default "html"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    valueType?: 'html' | 'markdown';
    /**
     * @docid dxHtmlEditorOptions.variables
     * @type dxHtmlEditorVariables
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    variables?: dxHtmlEditorVariables;
}
/**
 * @docid dxHtmlEditor
 * @inherits Editor
 * @hasTranscludedContent
 * @isEditor
 * @module ui/html_editor
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxHtmlEditor extends Editor {
    constructor(element: Element, options?: dxHtmlEditorOptions)
    constructor(element: JQuery, options?: dxHtmlEditorOptions)
    /**
     * @docid dxHtmlEditorMethods.clearHistory
     * @publicName clearHistory()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    clearHistory(): void;
    /**
     * @docid dxHtmlEditorMethods.delete
     * @publicName delete(index, length)
     * @param1 index:number
     * @param2 length:number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    delete(index: number, length: number): void;
    /**
     * @docid dxHtmlEditorMethods.format
     * @publicName format(formatName, formatValue)
     * @param1 formatName:Enums.HtmlEditorFormat|string
     * @param2 formatValue:any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    format(formatName: 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'size' | 'strike' | 'script' | 'underline' | 'blockquote' | 'header' | 'indent' | 'list' | 'align' | 'code-block' | string, formatValue: any): void;
    /**
     * @docid dxHtmlEditorMethods.formatLine
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
     * @docid dxHtmlEditorMethods.formatLine
     * @publicName formatLine(index, length, formats)
     * @param1 index:number
     * @param2 length:number
     * @param3 formats:object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    formatLine(index: number, length: number, formats: any): void;
    /**
     * @docid dxHtmlEditorMethods.formatText
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
     * @docid dxHtmlEditorMethods.formatText
     * @publicName formatText(index, length, formats)
     * @param1 index:number
     * @param2 length:number
     * @param3 formats:object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    formatText(index: number, length: number, formats: any): void;
    /**
     * @docid dxHtmlEditorMethods.get
     * @publicName get(componentPath)
     * @param1 componentPath:string
     * @return Object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    get(componentPath: string): any;
    /**
     * @docid dxHtmlEditorMethods.getFormat
     * @publicName getFormat(index, length)
     * @param1 index:number
     * @param2 length:number
     * @return Object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getFormat(index: number, length: number): any;
    /**
     * @docid dxHtmlEditorMethods.getLength
     * @publicName getLength()
     * @return number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getLength(): number;
    /**
     * @docid dxHtmlEditorMethods.getQuillInstance
     * @publicName getQuillInstance()
     * @return Object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getQuillInstance(): any;
    /**
     * @docid dxHtmlEditorMethods.getSelection
     * @publicName getSelection()
     * @return Object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getSelection(): any;
    /**
     * @docid dxHtmlEditorMethods.insertEmbed
     * @publicName insertEmbed(index, type, config)
     * @param1 index:number
     * @param2 type:string
     * @param3 config:any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    insertEmbed(index: number, type: string, config: any): void;
    /**
     * @docid dxHtmlEditorMethods.insertText
     * @publicName insertText(index, text, formats)
     * @param1 index:number
     * @param2 text:string
     * @param3 formats:object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    insertText(index: number, text: string, formats: any): void;
    /**
     * @docid dxHtmlEditorMethods.redo
     * @publicName redo()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    redo(): void;
    /**
     * @docid dxHtmlEditorMethods.register
     * @publicName register(components)
     * @param1 modules:Object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    register(modules: any): void;
    /**
     * @docid dxHtmlEditorMethods.removeFormat
     * @publicName removeFormat(index, length)
     * @param1 index:number
     * @param2 length:number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    removeFormat(index: number, length: number): void;
    /**
     * @docid dxHtmlEditorMethods.setSelection
     * @publicName setSelection(index, length)
     * @param1 index:number
     * @param2 length:number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    setSelection(index: number, length: number): void;
    /**
     * @docid dxHtmlEditorMethods.undo
     * @publicName undo()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    undo(): void;
}

export interface dxHtmlEditorMediaResizing {
    /**
     * @docid dxHtmlEditorMediaResizing.allowedTargets
     * @type Array<string>
     * @default ["images"]
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowedTargets?: Array<string>;
    /**
     * @docid dxHtmlEditorMediaResizing.enabled
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    enabled?: boolean;
}

export interface dxHtmlEditorMention {
    /**
     * @docid dxHtmlEditorMention.dataSource
     * @type Array<string>|DataSource|DataSourceOptions
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: Array<string> | DataSource | DataSourceOptions;
    /**
     * @docid dxHtmlEditorMention.displayExpr
     * @type string|function(item)
     * @default "this"
     * @type_function_param1 item:object
     * @type_function_return string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    displayExpr?: string | ((item: any) => string);
    /**
     * @docid dxHtmlEditorMention.itemTemplate
     * @type template|function
     * @default "item"
     * @type_function_param1 itemData:object
     * @type_function_param2 itemIndex:number
     * @type_function_param3 itemElement:dxElement
     * @type_function_return string|Node|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemTemplate?: template | ((itemData: any, itemIndex: number, itemElement: dxElement) => string | Element | JQuery);
    /**
     * @docid dxHtmlEditorMention.marker
     * @type string
     * @default "@"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    marker?: string;
    /**
     * @docid dxHtmlEditorMention.minSearchLength
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    minSearchLength?: number;
    /**
     * @docid dxHtmlEditorMention.searchExpr
     * @type getter|Array<getter>
     * @default "this"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    searchExpr?: string | Function | Array<string | Function>;
    /**
     * @docid dxHtmlEditorMention.searchTimeout
     * @type number
     * @default 500
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    searchTimeout?: number;
    /**
     * @docid dxHtmlEditorMention.template
     * @type template|function
     * @default null
     * @type_function_param1 mentionData:object
     * @type_function_param1_field1 marker:string
     * @type_function_param1_field2 id:string|number
     * @type_function_param1_field3 value:any
     * @type_function_param2 contentElement:dxElement
     * @type_function_return string|Node|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    template?: template | ((mentionData: { marker?: string, id?: string | number, value?: any }, contentElement: dxElement) => string | Element | JQuery);
    /**
     * @docid dxHtmlEditorMention.valueExpr
     * @type string|function
     * @default "this"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    valueExpr?: string | Function;
}

export interface dxHtmlEditorToolbar {
    /**
     * @docid dxHtmlEditorToolbar.container
     * @type string|Node|jQuery
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    container?: string | Element | JQuery;
    /**
     * @docid dxHtmlEditorToolbar.items
     * @type Array<dxHtmlEditorToolbarItem,Enums.HtmlEditorToolbarItem>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxHtmlEditorToolbarItem | 'background' | 'bold' | 'color' | 'italic' | 'link' | 'image' | 'strike' | 'subscript' | 'superscript' | 'underline' | 'blockquote' | 'header' | 'increaseIndent' | 'decreaseIndent' | 'orderedList' | 'bulletList' | 'alignLeft' | 'alignCenter' | 'alignRight' | 'alignJustify' | 'codeBlock' | 'variable' | 'separator' | 'undo' | 'redo' | 'clear'>;
}

export interface dxHtmlEditorToolbarItem extends dxToolbarItem {
    /**
     * @docid dxHtmlEditorToolbarItem.formatName
     * @type Enums.HtmlEditorToolbarItem|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    formatName?: 'background' | 'bold' | 'color' | 'italic' | 'link' | 'image' | 'strike' | 'subscript' | 'superscript' | 'underline' | 'blockquote' | 'header' | 'increaseIndent' | 'decreaseIndent' | 'orderedList' | 'bulletList' | 'alignLeft' | 'alignCenter' | 'alignRight' | 'alignJustify' | 'codeBlock' | 'variable' | 'separator' | 'undo' | 'redo' | 'clear' | string;
    /**
     * @docid dxHtmlEditorToolbarItem.formatValues
     * @type Array<string,number,boolean>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    formatValues?: Array<string | number | boolean>;
    /**
     * @docid dxHtmlEditorToolbarItem.location
     * @default "before"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    location?: 'after' | 'before' | 'center';
}

export interface dxHtmlEditorVariables {
    /**
     * @docid dxHtmlEditorVariables.dataSource
     * @type string|Array<string>|DataSource|DataSourceOptions
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataSource?: string | Array<string> | DataSource | DataSourceOptions;
    /**
     * @docid dxHtmlEditorVariables.escapeChar
     * @type string|Array<string>
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    escapeChar?: string | Array<string>;
}

declare global {
interface JQuery {
    dxHtmlEditor(): JQuery;
    dxHtmlEditor(options: "instance"): dxHtmlEditor;
    dxHtmlEditor(options: string): any;
    dxHtmlEditor(options: string, ...params: any[]): any;
    dxHtmlEditor(options: dxHtmlEditorOptions): JQuery;
}
}
export type Options = dxHtmlEditorOptions;

/** @deprecated use Options instead */
export type IOptions = dxHtmlEditorOptions;