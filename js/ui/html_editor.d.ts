import { DataSourceLike } from '../data/data_source';
import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
} from '../core/templates/template';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import {
    EditorStyle,
    ToolbarItemLocation,
} from '../common';

import Editor, {
    ValueChangedInfo,
    EditorOptions,
} from './editor/editor';

import {
  MenuBasePlainItem,
} from './menu';

import {
    Item as dxToolbarItem,
} from './toolbar';

import { Properties as fileUploaderProperties } from './file_uploader';

export {
    EditorStyle,
    ToolbarItemLocation,
};

export type HtmlEditorContextMenuItem = 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'image' | 'strike' | 'subscript' | 'superscript' | 'underline' | 'blockquote' | 'increaseIndent' | 'decreaseIndent' | 'orderedList' | 'bulletList' | 'alignLeft' | 'alignCenter' | 'alignRight' | 'alignJustify' | 'codeBlock' | 'variable' | 'undo' | 'redo' | 'clear' | 'insertTable' | 'insertHeaderRow' | 'insertRowAbove' | 'insertRowBelow' | 'insertColumnLeft' | 'insertColumnRight' | 'deleteColumn' | 'deleteRow' | 'deleteTable' | 'cellProperties' | 'tableProperties';
export type HtmlEditorFormat = 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'size' | 'strike' | 'script' | 'underline' | 'blockquote' | 'header' | 'indent' | 'list' | 'align' | 'code-block';
export type HtmlEditorImageUploadFileUploadMode = 'base64' | 'server' | 'both';
export type HtmlEditorImageUploadTab = 'url' | 'file';
export type HtmlEditorToolbarItem = 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'image' | 'size' | 'strike' | 'subscript' | 'superscript' | 'underline' | 'blockquote' | 'header' | 'increaseIndent' | 'decreaseIndent' | 'orderedList' | 'bulletList' | 'alignLeft' | 'alignCenter' | 'alignRight' | 'alignJustify' | 'codeBlock' | 'variable' | 'separator' | 'undo' | 'redo' | 'clear' | 'cellProperties' | 'tableProperties' | 'insertTable' | 'insertHeaderRow' | 'insertRowAbove' | 'insertRowBelow' | 'insertColumnLeft' | 'insertColumnRight' | 'deleteColumn' | 'deleteRow' | 'deleteTable';
export type HtmlEditorValueType = 'html' | 'markdown';

/** @public */
export type ContentReadyEvent = EventInfo<dxHtmlEditor>;

/** @public */
export type DisposingEvent = EventInfo<dxHtmlEditor>;

/** @public */
export type FocusInEvent = NativeEventInfo<dxHtmlEditor, FocusEvent>;

/** @public */
export type FocusOutEvent = NativeEventInfo<dxHtmlEditor, FocusEvent>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxHtmlEditor>;

/** @public */
export type OptionChangedEvent = EventInfo<dxHtmlEditor> & ChangedOptionInfo;

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxHtmlEditor, KeyboardEvent | ClipboardEvent | Event> & ValueChangedInfo;

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
     * @default false
     * @public
     */
    allowSoftLineBreak?: boolean;
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
     * @default null
     * @public
     */
    tableContextMenu?: dxHtmlEditorTableContextMenu;
    /**
     * @docid
     * @default { tabs: ["url"], fileUploadMode: 'base64', uploadUrl: undefined, uploadDirectory: undefined }
     * @public
     */
    imageUpload?: dxHtmlEditorImageUpload;
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
     * @type_function_param1_field event:event
     * @type_function_param1_field component:dxHtmlEditor
     * @action
     * @public
     */
    onFocusIn?: ((e: FocusInEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field event:event
     * @type_function_param1_field component:dxHtmlEditor
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
     * @default "html"
     * @public
     */
    valueType?: HtmlEditorValueType;
    /**
     * @docid
     * @default null
     * @public
     */
    variables?: dxHtmlEditorVariables;
    /**
     * @docid
     * @default 'outlined'
     * @public
     */
    stylingMode?: EditorStyle;
}
/**
 * @docid
 * @inherits Editor
 * @hasTranscludedContent
 * @isEditor
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
     * @public
     */
    delete(index: number, length: number): void;
    /**
     * @docid
     * @publicName format(formatName, formatValue)
     * @param1 formatName:Enums.HtmlEditorFormat|string
     * @public
     */
    format(formatName: HtmlEditorFormat | string, formatValue: any): void;
    /**
     * @docid
     * @publicName formatLine(index, length, formatName, formatValue)
     * @param3 formatName:Enums.HtmlEditorFormat|string
     * @public
     */
    formatLine(index: number, length: number, formatName: HtmlEditorFormat | string, formatValue: any): void;
    /**
     * @docid
     * @publicName formatLine(index, length, formats)
     * @param3 formats:object
     * @public
     */
    formatLine(index: number, length: number, formats: any): void;
    /**
     * @docid
     * @publicName formatText(index, length, formatName, formatValue)
     * @param3 formatName:Enums.HtmlEditorFormat|string
     * @public
     */
    formatText(index: number, length: number, formatName: HtmlEditorFormat | string, formatValue: any): void;
    /**
     * @docid
     * @publicName formatText(index, length, formats)
     * @param3 formats:object
     * @public
     */
    formatText(index: number, length: number, formats: any): void;
    /**
     * @docid
     * @publicName get(componentPath)
     * @return Object
     * @public
     */
    get(componentPath: string): any;
    /**
     * @docid
     * @publicName getBounds(index, length)
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
     * @return Object
     * @public
     */
    getFormat(index: number, length: number): any;
    /**
     * @docid
     * @publicName getLength()
     * @public
     */
    getLength(): number;
    /**
     * @docid
     * @publicName getModule(moduleName)
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
     * @return Object
     * @public
     */
    getSelection(focus?: boolean | undefined): any;
    /**
     * @docid
     * @publicName getText(index, length)
     * @public
     */
    getText(index: number, length: number): string;
    /**
     * @docid
     * @publicName insertEmbed(index, type, config)
     * @public
     */
    insertEmbed(index: number, type: string, config: any): void;
    /**
     * @docid
     * @publicName insertText(index, text, formatName, formatValue)
     * @param3 formatName:Enums.HtmlEditorFormat|string
     * @public
     */
    insertText(index: number, text: string, formatName: HtmlEditorFormat | string, formatValue: any): void;
    /**
     * @docid
     * @publicName insertText(index, text, formats)
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
     * @public
     */
    removeFormat(index: number, length: number): void;
    /**
     * @docid
     * @publicName setSelection(index, length)
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
  * @default 24
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
 export interface dxHtmlEditorImageUpload {
  /**
   * @docid
   * @default undefined
   * @public
   */
  uploadUrl?: string;
  /**
   * @docid
   * @default undefined
   * @public
   */
  uploadDirectory?: string;
  /**
   * @docid
   * @default 'base64'
   * @public
   */
   fileUploadMode?: HtmlEditorImageUploadFileUploadMode;
     /**
   * @docid
   * @default ["url"]
   * @type Array<dxHtmlEditorImageUploadTabItem, Enums.HtmlEditorImageUploadTab>
   * @public
   */
    tabs?: Array<ImageUploadTab | HtmlEditorImageUploadTab>;
    /**
    * @docid
    * @default null
    * @type dxFileUploaderOptions
    * @public
    */
    fileUploaderOptions?: fileUploaderProperties;
 }

/**
 * @public
 * @namespace DevExpress.ui.dxHtmlEditor
 */
 export type ImageUploadTab = dxHtmlEditorImageUploadTabItem;

 /**
  * @deprecated Use ImageUploadTab instead
  * @namespace DevExpress.ui
  */
 export interface dxHtmlEditorImageUploadTabItem {
    /**
     * @docid
     * @default undefined
     * @public
     */
    name?: HtmlEditorImageUploadTab;
 }

/**
 * @docid
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxHtmlEditorTableContextMenu {
    /**
     * @docid
     * @default false
     * @public
     */
    enabled?: boolean;
    /**
     * @docid
     * @type Array<dxHtmlEditorTableContextMenuItem,Enums.HtmlEditorContextMenuItem>
     * @public
     */
    items?: Array<ContextMenuItem | HtmlEditorContextMenuItem>;
}

/**
 * @public
 * @namespace DevExpress.ui.dxHtmlEditor
 */
export type ContextMenuItem = dxHtmlEditorTableContextMenuItem;

/**
 * @deprecated Use ContextMenuItem instead
 * @namespace DevExpress.ui
 */
export interface dxHtmlEditorTableContextMenuItem extends MenuBasePlainItem {
    /**
     * @docid
     * @default undefined
     * @public
     */
    name?: HtmlEditorContextMenuItem;
    /**
     * @docid
     * @public
     * @type Array<dxHtmlEditorTableContextMenuItem,Enums.HtmlEditorContextMenuItem>
     */
    items?: Array<ContextMenuItem | HtmlEditorContextMenuItem>;
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
     * @type Store|DataSource|DataSourceOptions|string|Array<any>
     */
    dataSource?: DataSourceLike<string>;
    /**
     * @docid
     * @default "this"
     * @type_function_param1 item:object
     * @public
     */
    displayExpr?: string | ((item: any) => string);
    /**
     * @docid
     * @default "item"
     * @type_function_param1 itemData:object
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
    items?: Array<ToolbarItem | HtmlEditorToolbarItem>;
    /**
     * @docid
     * @default true
     * @public
     */
    multiline?: boolean;
}

/**
 * @public
 * @namespace DevExpress.ui.dxHtmlEditor
 */
export type ToolbarItem = dxHtmlEditorToolbarItem;

/**
 * @deprecated Use ToolbarItem instead
 * @namespace DevExpress.ui
 */
export interface dxHtmlEditorToolbarItem extends dxToolbarItem {
    /**
     * @docid
     * @public
     */
    name?: HtmlEditorToolbarItem | string;
    /**
     * @docid
     * @deprecated dxHtmlEditorToolbarItem.name
     */
    formatName?: HtmlEditorToolbarItem | string;
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
     * @public
     */
    location?: ToolbarItemLocation;
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
     * @type Store|DataSource|DataSourceOptions|string|Array<string>
     */
    dataSource?: DataSourceLike<string>;
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
