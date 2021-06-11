import {
    UserDefinedElement,
    DxElement
} from '../core/element';

import {
    template
} from '../core/templates/template';

import DataSource, {
    DataSourceOptions
} from '../data/data_source';

import Store from '../data/abstract_store';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import Editor, {
    ValueChangedInfo,
    EditorOptions
} from './editor/editor';

import {
    dxToolbarItem
} from './toolbar';

/** @public */
export type ContentReadyEvent = EventInfo<dxHtmlEditor>;

/** @public */
export type DisposingEvent = EventInfo<dxHtmlEditor>;

/** @public */
export type FocusInEvent = NativeEventInfo<dxHtmlEditor>;

/** @public */
export type FocusOutEvent = NativeEventInfo<dxHtmlEditor>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxHtmlEditor>;

/** @public */
export type OptionChangedEvent = EventInfo<dxHtmlEditor> & ChangedOptionInfo;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxHtmlEditor> & ValueChangedInfo;

/** @public */
export interface MentionTemplateData {
    readonly marker: string;
    readonly id?: string | number;
    readonly value?: any;
}
/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxHtmlEditorOptions extends EditorOptions<dxHtmlEditor> {
    /**
     * @docid
     * @type_function_param1 config:object
     * @public
     */
    customizeModules?: ((config: any) => void);
    /**
     * @docid
     * @default true
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default null
     * @public
     */
    mediaResizing?: dxHtmlEditorMediaResizing;
    /**
     * @docid
     * @default null
     * @public
     */
    tableResizing?: dxHtmlEditorTableResizing;
    /**
     * @docid
     * @default null
     * @public
     */
    mentions?: Array<dxHtmlEditorMention>;
    /**
     * @docid
     * @hidden false
     * @public
     */
    name?: string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field1 component:dxHtmlEditor
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onFocusIn?: ((e: FocusInEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 event:event
     * @type_function_param1_field1 component:dxHtmlEditor
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onFocusOut?: ((e: FocusOutEvent) => void);
    /**
     * @docid
     * @default ""
     * @public
     */
    placeholder?: string;
    /**
     * @docid
     * @default null
     * @public
     */
    toolbar?: dxHtmlEditorToolbar;
    /**
     * @docid
     * @type Enums.HtmlEditorValueType
     * @default "html"
     * @public
     */
    valueType?: 'html' | 'markdown';
    /**
     * @docid
     * @default null
     * @public
     */
    variables?: dxHtmlEditorVariables;
    /**
     * @docid
     * @type Enums.EditorStylingMode
     * @default 'outlined'
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
 * @namespace DevExpress.ui
 * @public
 */
export default class dxHtmlEditor extends Editor<dxHtmlEditorOptions> {
    /**
     * @docid
     * @publicName blur()
     * @public
     */
    blur(): void;
    /**
     * @docid
     * @publicName clearHistory()
     * @public
     */
    clearHistory(): void;
    /**
     * @docid
     * @publicName delete(index, length)
     * @param1 index:number
     * @param2 length:number
     * @public
     */
    delete(index: number, length: number): void;
    /**
     * @docid
     * @publicName format(formatName, formatValue)
     * @param1 formatName:Enums.HtmlEditorFormat|string
     * @param2 formatValue:any
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
     * @public
     */
    formatLine(index: number, length: number, formatName: 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'size' | 'strike' | 'script' | 'underline' | 'blockquote' | 'header' | 'indent' | 'list' | 'align' | 'code-block' | string, formatValue: any): void;
    /**
     * @docid
     * @publicName formatLine(index, length, formats)
     * @param1 index:number
     * @param2 length:number
     * @param3 formats:object
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
     * @public
     */
    formatText(index: number, length: number, formatName: 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'size' | 'strike' | 'script' | 'underline' | 'blockquote' | 'header' | 'indent' | 'list' | 'align' | 'code-block' | string, formatValue: any): void;
    /**
     * @docid
     * @publicName formatText(index, length, formats)
     * @param1 index:number
     * @param2 length:number
     * @param3 formats:object
     * @public
     */
    formatText(index: number, length: number, formats: any): void;
    /**
     * @docid
     * @publicName get(componentPath)
     * @param1 componentPath:string
     * @return Object
     * @public
     */
    get(componentPath: string): any;
    /**
     * @docid
     * @publicName getBounds(index, length)
     * @param1 index:number
     * @param2 length:number
     * @return Object
     * @public
     */
    getBounds(index: number, length: number): any;
    /**
     * @docid
     * @publicName getFormat()
     * @return Object
     * @public
     */
    getFormat(): any;
    /**
     * @docid
     * @publicName getFormat(index, length)
     * @param1 index:number
     * @param2 length:number
     * @return Object
     * @public
     */
    getFormat(index: number, length: number): any;
    /**
     * @docid
     * @publicName getLength()
     * @return number
     * @public
     */
    getLength(): number;
    /**
     * @docid
     * @publicName getModule(moduleName)
     * @param1 moduleName:string
     * @return Object
     * @public
     */
    getModule(moduleName: string): any;
    /**
     * @docid
     * @publicName getQuillInstance()
     * @return Object
     * @public
     */
    getQuillInstance(): any;
    /**
     * @docid
     * @publicName getSelection()
     * @param1 focus:boolean|undefined
     * @return Object
     * @public
     */
    getSelection(focus?: boolean|undefined): any;
    /**
     * @docid
     * @publicName getText(index, length)
     * @param1 index:number
     * @param2 length:number
     * @public
     */
    getText(index: number, length: number): string;
    /**
     * @docid
     * @publicName insertEmbed(index, type, config)
     * @param1 index:number
     * @param2 type:string
     * @param3 config:any
     * @public
     */
    insertEmbed(index: number, type: string, config: any): void;
    /**
     * @docid
     * @publicName insertText(index, text, formatName, formatValue)
     * @param1 index:number
     * @param2 text:string
     * @param3 formatName:Enums.HtmlEditorFormat|string
     * @param4 formatValue:any
     * @public
     */
    insertText(index: number, text: string, formatName: 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'size' | 'strike' | 'script' | 'underline' | 'blockquote' | 'header' | 'indent' | 'list' | 'align' | 'code-block' | string, formatValue: any): void;
    /**
     * @docid
     * @publicName insertText(index, text, formats)
     * @param1 index:number
     * @param2 text:string
     * @param3 formats:object
     * @public
     */
    insertText(index: number, text: string, formats: any): void;
    /**
     * @docid
     * @publicName redo()
     * @public
     */
    redo(): void;
    /**
     * @docid
     * @publicName register(components)
     * @param1 modules:Object
     * @public
     */
    register(modules: any): void;
    /**
     * @docid
     * @publicName removeFormat(index, length)
     * @param1 index:number
     * @param2 length:number
     * @public
     */
    removeFormat(index: number, length: number): void;
    /**
     * @docid
     * @publicName setSelection(index, length)
     * @param1 index:number
     * @param2 length:number
     * @public
     */
    setSelection(index: number, length: number): void;
    /**
     * @docid
     * @publicName undo()
     * @public
     */
    undo(): void;
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxHtmlEditorMediaResizing {
    /**
     * @docid
     * @default ["image"]
     * @public
     */
    allowedTargets?: Array<string>;
    /**
     * @docid
     * @default false
     * @public
     */
    enabled?: boolean;
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.ui
 */
 export interface dxHtmlEditorTableResizing {
  /**
   * @docid
   * @default 40
   * @public
   */
   minColumnWidth?: number;
  /**
   * @docid
   * @default 20
   * @public
   */
  minRowHeight?: number;
  /**
   * @docid
   * @default false
   * @public
   */
  enabled?: boolean;
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxHtmlEditorMention {
    /**
     * @docid
     * @default null
     * @public
     */
    dataSource?: Array<string> | Store | DataSource | DataSourceOptions;
    /**
     * @docid
     * @default "this"
     * @type_function_param1 item:object
     * @type_function_return string
     * @public
     */
    displayExpr?: string | ((item: any) => string);
    /**
     * @docid
     * @default "item"
     * @type_function_param1 itemData:object
     * @type_function_param2 itemIndex:number
     * @type_function_param3 itemElement:DxElement
     * @type_function_return string|Element|jQuery
     * @public
     */
    itemTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default "@"
     * @public
     */
    marker?: string;
    /**
     * @docid
     * @default 0
     * @public
     */
    minSearchLength?: number;
    /**
     * @docid
     * @type getter|Array<getter>
     * @default "this"
     * @public
     */
    searchExpr?: string | Function | Array<string | Function>;
    /**
     * @docid
     * @default 500
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
     * @type_function_param2 contentElement:DxElement
     * @type_function_return string|Element|jQuery
     * @public
     */
    template?: template | ((mentionData: MentionTemplateData, contentElement: DxElement) => string | UserDefinedElement);
    /**
     * @docid
     * @default "this"
     * @public
     */
    valueExpr?: string | Function;
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxHtmlEditorToolbar {
    /**
     * @docid
     * @public
     */
    container?: string | UserDefinedElement;
    /**
     * @docid
     * @type Array<dxHtmlEditorToolbarItem,Enums.HtmlEditorToolbarItem>
     * @public
     */
    items?: Array<dxHtmlEditorToolbarItem | 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'image' | 'size' | 'strike' | 'subscript' | 'superscript' | 'underline' | 'blockquote' | 'header' | 'increaseIndent' | 'decreaseIndent' | 'orderedList' | 'bulletList' | 'alignLeft' | 'alignCenter' | 'alignRight' | 'alignJustify' | 'codeBlock' | 'variable' | 'separator' | 'undo' | 'redo' | 'clear' | 'insertTable' | 'insertRowAbove' | 'insertRowBelow' | 'insertColumnLeft' | 'insertColumnRight' | 'deleteColumn' | 'deleteRow' | 'deleteTable'>;
    /**
     * @docid
     * @default true
     * @public
     */
    multiline?: boolean;
}

/**
 * @docid
 * @inherits dxToolbarItem
 * @namespace DevExpress.ui
 */
export interface dxHtmlEditorToolbarItem extends dxToolbarItem {
    /**
     * @docid
     * @type Enums.HtmlEditorToolbarItem|string
     * @public
     */
    name?: 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'image' | 'size' | 'strike' | 'subscript' | 'superscript' | 'underline' | 'blockquote' | 'header' | 'increaseIndent' | 'decreaseIndent' | 'orderedList' | 'bulletList' | 'alignLeft' | 'alignCenter' | 'alignRight' | 'alignJustify' | 'codeBlock' | 'variable' | 'separator' | 'undo' | 'redo' | 'clear' | 'insertTable' | 'insertRowAbove' | 'insertRowBelow' | 'insertColumnLeft' | 'insertColumnRight' | 'deleteColumn' | 'deleteRow' | 'deleteTable' | string;
    /**
     * @docid
     * @type Enums.HtmlEditorToolbarItem|string
     * @deprecated dxHtmlEditorToolbarItem.name
     */
    formatName?: 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'image' | 'size' | 'strike' | 'subscript' | 'superscript' | 'underline' | 'blockquote' | 'header' | 'increaseIndent' | 'decreaseIndent' | 'orderedList' | 'bulletList' | 'alignLeft' | 'alignCenter' | 'alignRight' | 'alignJustify' | 'codeBlock' | 'variable' | 'separator' | 'undo' | 'redo' | 'clear' | 'insertTable' | 'insertRowAbove' | 'insertRowBelow' | 'insertColumnLeft' | 'insertColumnRight' | 'deleteColumn' | 'deleteRow' | 'deleteTable' | string;
    /**
     * @docid
     * @public
     */
    acceptedValues?: Array<string | number | boolean>;
    /**
     * @docid
     * @deprecated dxHtmlEditorToolbarItem.acceptedValues
     */
    formatValues?: Array<string | number | boolean>;
    /**
     * @docid
     * @default "before"
     * @type Enums.ToolbarItemLocation
     * @public
     */
    location?: 'after' | 'before' | 'center';
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxHtmlEditorVariables {
    /**
     * @docid
     * @default null
     * @public
     */
    dataSource?: string | Array<string> | Store | DataSource | DataSourceOptions;
    /**
     * @docid
     * @default ""
     * @public
     */
    escapeChar?: string | Array<string>;
}

/** @public */
export type Properties = dxHtmlEditorOptions;

/** @deprecated use Properties instead */
export type Options = dxHtmlEditorOptions;

/** @deprecated use Properties instead */
export type IOptions = dxHtmlEditorOptions;
