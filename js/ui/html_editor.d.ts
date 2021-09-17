import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
} from '../core/templates/template';

import DataSource, {
    DataSourceOptions,
} from '../data/data_source';

import Store from '../data/abstract_store';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import Editor, {
    ValueChangedInfo,
    EditorOptions,
} from './editor/editor';

import {
    Item as dxToolbarItem,
} from './toolbar';

import {
    ToolbarItemLocation,
    HtmlEditorValueType,
    HtmlEditorToolbarItem,
    HtmlEditorFormat,
    EditorStylingMode,
} from '../docEnums';

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
     * @default true
     * @public
     */
    tableContextMenu?: dxHtmlEditorTableContextMenu;
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
    stylingMode?: EditorStylingMode;
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
     * @param1 formatName:{docEnums.HtmlEditorFormat}|string
     * @param2 formatValue:any
     * @public
     */
    format(formatName: HtmlEditorFormat | string, formatValue: any): void;
    /**
     * @docid
     * @publicName formatLine(index, length, formatName, formatValue)
     * @param1 index:number
     * @param2 length:number
     * @param3 formatName:{docEnums.HtmlEditorFormat}|string
     * @param4 formatValue:any
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
     * @param1 index:number
     * @param2 length:number
     * @param3 formatName:{docEnums.HtmlEditorFormat}|string
     * @param4 formatValue:any
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
     * @param1 index:number
     * @param2 text:string
     * @param3 formatName:{docEnums.HtmlEditorFormat}|string
     * @param4 formatValue:any
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

export interface dxHtmlEditorTableContextMenu {
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
     * @type_function_param1_field1 marker:string
     * @type_function_param1_field2 id:string|number
     * @type_function_param1_field3 value:any
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
     * @type Array<dxHtmlEditorToolbarItem,HtmlEditorToolbarItem>
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
