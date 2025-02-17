import { DataSourceLike } from '../data/data_source';
import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    template,
    EditorStyle,
    ToolbarItemLocation,
} from '../common';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

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

export type HtmlEditorFormat = 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'size' | 'strike' | 'script' | 'underline' | 'blockquote' | 'header' | 'indent' | 'list' | 'align' | 'code-block';
export type HtmlEditorImageUploadMode = 'base64' | 'server' | 'both';
export type HtmlEditorImageUploadTab = 'url' | 'file';
export type HtmlEditorPredefinedContextMenuItem = 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'image' | 'strike' | 'subscript' | 'superscript' | 'underline' | 'blockquote' | 'increaseIndent' | 'decreaseIndent' | 'orderedList' | 'bulletList' | 'alignLeft' | 'alignCenter' | 'alignRight' | 'alignJustify' | 'codeBlock' | 'variable' | 'undo' | 'redo' | 'clear' | 'insertTable' | 'insertHeaderRow' | 'insertRowAbove' | 'insertRowBelow' | 'insertColumnLeft' | 'insertColumnRight' | 'deleteColumn' | 'deleteRow' | 'deleteTable' | 'cellProperties' | 'tableProperties';
export type HtmlEditorPredefinedToolbarItem = 'background' | 'bold' | 'color' | 'font' | 'italic' | 'link' | 'image' | 'size' | 'strike' | 'subscript' | 'superscript' | 'underline' | 'blockquote' | 'header' | 'increaseIndent' | 'decreaseIndent' | 'orderedList' | 'bulletList' | 'alignLeft' | 'alignCenter' | 'alignRight' | 'alignJustify' | 'codeBlock' | 'variable' | 'separator' | 'undo' | 'redo' | 'clear' | 'cellProperties' | 'tableProperties' | 'insertTable' | 'insertHeaderRow' | 'insertRowAbove' | 'insertRowBelow' | 'insertColumnLeft' | 'insertColumnRight' | 'deleteColumn' | 'deleteRow' | 'deleteTable';

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent = EventInfo<dxHtmlEditor>;

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxHtmlEditor>;

/**
 * The type of the focusIn event handler&apos;s argument.
 */
export type FocusInEvent = NativeEventInfo<dxHtmlEditor, FocusEvent>;

/**
 * The type of the focusOut event handler&apos;s argument.
 */
export type FocusOutEvent = NativeEventInfo<dxHtmlEditor, FocusEvent>;

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxHtmlEditor>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxHtmlEditor> & ChangedOptionInfo;

/**
 * The type of the valueChanged event handler&apos;s argument.
 */
export type ValueChangedEvent = NativeEventInfo<dxHtmlEditor, KeyboardEvent | ClipboardEvent | Event> & ValueChangedInfo;

export interface MentionTemplateData {
    readonly marker: string;
    readonly id?: string | number;
    readonly value?: any;
}

/**
 * An object that configures converter settings.
 */
export type Converter = {
     /**
     * A function that converts an HTML Editor value from a markup language to HTML.
     */
    toHtml?: ((value: string) => string);
     /**
     * A function that converts an HTML Editor value from HTML to another markup language.
     */
    fromHtml?: ((value: string) => string);
};

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxHtmlEditorOptions extends EditorOptions<dxHtmlEditor> {
    /**
     * Allows users to break content into multiple lines within a single block element. The Shift + Enter key combination generates the new line.
     */
    allowSoftLineBreak?: boolean;
    /**
     * Allows you to customize the DevExtreme Quill and 3rd-party modules.
     */
    customizeModules?: ((config: any) => void);
    /**
     * Allows you to convert an HTML Editor value between different markups.
     */
    converter?: Converter | undefined;
    /**
     * Specifies whether the UI component can be focused using keyboard navigation.
     */
    focusStateEnabled?: boolean;
    /**
     * Configures media resizing.
     */
    mediaResizing?: dxHtmlEditorMediaResizing;
    /**
     * Configures table resize.
     */
    tableResizing?: dxHtmlEditorTableResizing;
    /**
     * Configures mentions.
     */
    mentions?: Array<dxHtmlEditorMention>;
    /**
     * Configures table context menu settings.
     */
    tableContextMenu?: dxHtmlEditorTableContextMenu;
    /**
     * Configures the image upload.
     */
    imageUpload?: dxHtmlEditorImageUpload;
    /**
     * The value to be assigned to the `name` attribute of the underlying HTML element.
     */
    name?: string;
    /**
     * A function that is executed when the UI component gets focus.
     */
    onFocusIn?: ((e: FocusInEvent) => void);
    /**
     * A function that is executed when the UI component loses focus.
     */
    onFocusOut?: ((e: FocusOutEvent) => void);
    /**
     * Specifies the text displayed when the input field is empty.
     */
    placeholder?: string;
    /**
     * Configures the UI component&apos;s toolbar.
     */
    toolbar?: dxHtmlEditorToolbar;
    /**
     * Configures variables, which are placeholders to be replaced with actual values when processing text.
     */
    variables?: dxHtmlEditorVariables;
    /**
     * Specifies how the HTML Editor&apos;s toolbar and content field are styled.
     */
    stylingMode?: EditorStyle;
}
/**
 * HTML Editor is a WYSIWYG editor that allows you to format textual and visual content and to output it in HTML. HTML Editor is built on top of and requires the DevExtreme Quill.
 */
export default class dxHtmlEditor extends Editor<dxHtmlEditorOptions> {
    /**
     * Removes focus from the content field of the editor.
     */
    blur(): void;
    /**
     * Clears the history of changes.
     */
    clearHistory(): void;
    /**
     * Deletes content from the given range.
     */
    delete(index: number, length: number): void;
    /**
     * Applies a format to the selected content. Cannot be used with embedded formats.
     */
    format(formatName: HtmlEditorFormat | string, formatValue: any): void;
    /**
     * Applies a single block format to all lines in the given range.
     */
    formatLine(index: number, length: number, formatName: HtmlEditorFormat | string, formatValue: any): void;
    /**
     * Applies several block formats to all lines in the given range.
     */
    formatLine(index: number, length: number, formats: any): void;
    /**
     * Applies a single text format to all characters in the given range.
     */
    formatText(index: number, length: number, formatName: HtmlEditorFormat | string, formatValue: any): void;
    /**
     * Applies several text formats to all characters in the given range.
     */
    formatText(index: number, length: number, formats: any): void;
    /**
     * Gets a format, module, or Parchment.
     */
    get(componentPath: string): any;
    /**
     * Retrieves the pixel position and size of a selection at a specified location.
     */
    getBounds(index: number, length: number): any;
    /**
     * Retrieves formatting of the text within the current selection range.
     */
    getFormat(): any;
    /**
     * Gets formats applied to the content in the specified range.
     */
    getFormat(index: number, length: number): any;
    /**
     * Gets the entire content&apos;s length.
     */
    getLength(): number;
    /**
     * Gets the instance of a module.
     */
    getModule(moduleName: string): any;
    /**
     * Gets the DevExtreme Quill&apos;s instance.
     */
    getQuillInstance(): any;
    /**
     * Gets the selected content&apos;s position and length.
     */
    getSelection(focus?: boolean | undefined): any;
    /**
     * Retrieves text content from the HTML Editor.
     */
    getText(index: number, length: number): string;
    /**
     * Inserts an embedded content at the specified position.
     */
    insertEmbed(index: number, type: string, config: any): void;
    /**
     * Inserts text into the HTML Editor.
     */
    insertText(index: number, text: string, formatName: HtmlEditorFormat | string, formatValue: any): void;
    /**
     * Inserts formatted text at the specified position. Used with all formats except embedded.
     */
    insertText(index: number, text: string, formats: any): void;
    /**
     * Reapplies the most recent undone change. Repeated calls reapply preceding undone changes.
     */
    redo(): void;
    /**
     * Registers custom formats and modules.
     */
    register(modules: any): void;
    /**
     * Removes all formatting and embedded content from the specified range.
     */
    removeFormat(index: number, length: number): void;
    /**
     * Selects and highlights content in the specified range.
     */
    setSelection(index: number, length: number): void;
    /**
     * Reverses the most recent change. Repeated calls reverse preceding changes.
     */
    undo(): void;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxHtmlEditorMediaResizing {
    /**
     * Specifies media types that can be resized. Currently, only images are supported.
     */
    allowedTargets?: Array<string>;
    /**
     * Enables media resizing.
     */
    enabled?: boolean;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxHtmlEditorTableResizing {
 /**
   * The minimum column width.
   */
  minColumnWidth?: number;
 /**
  * The minimum row height.
  */
 minRowHeight?: number;
 /**
  * Enables users to resize tables.
  */
 enabled?: boolean;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxHtmlEditorImageUpload {
  /**
   * Specifies a target Url for the upload request.
   */
  uploadUrl?: string | undefined;
  /**
   * Specifies a target directory for uploaded images.
   */
  uploadDirectory?: string | undefined;
  /**
    * Specifies how the HTML Editor UI component uploads files.
    */
   fileUploadMode?: HtmlEditorImageUploadMode;
     /**
     * Contains an array of tabs in the &apos;Add an Image&apos; dialog.
     */
    tabs?: Array<ImageUploadTab | HtmlEditorImageUploadTab>;
    /**
     * Configures the file uploader options.
     */
    fileUploaderOptions?: fileUploaderProperties;
 }

export type ImageUploadTab = dxHtmlEditorImageUploadTabItem;

 /**
 * @deprecated Use ImageUploadTab instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxHtmlEditorImageUploadTabItem {
    /**
     * Specifies the tab&apos;s name.
     */
    name?: HtmlEditorImageUploadTab | undefined;
 }

/**
 * Configures table context menu settings.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxHtmlEditorTableContextMenu {
    /**
     * Specifies whether to enable the table context menu.
     */
    enabled?: boolean;
    /**
     * Configures context menu items.
     */
    items?: Array<ContextMenuItem | HtmlEditorPredefinedContextMenuItem>;
}

export type ContextMenuItem = dxHtmlEditorTableContextMenuItem;

/**
 * @deprecated Use ContextMenuItem instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxHtmlEditorTableContextMenuItem extends MenuBasePlainItem {
    /**
     * A name used to identify the context menu item.
     */
    name?: HtmlEditorPredefinedContextMenuItem | undefined;
    /**
     * Configures nested context menu items.
     */
    items?: Array<ContextMenuItem | HtmlEditorPredefinedContextMenuItem>;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxHtmlEditorMention {
    /**
     * Provides data for the suggestion list.
     */
    dataSource?: DataSourceLike<any> | null;
    /**
     * Specifies the data field whose values should be displayed in the suggestion list.
     */
    displayExpr?: string | ((item: any) => string);
    /**
     * Specifies a custom template for suggestion list items.
     */
    itemTemplate?: template | ((itemData: any, itemIndex: number, itemElement: DxElement) => string | UserDefinedElement);
    /**
     * Specifies the prefix that a user enters to activate mentions. You can use different prefixes with different dataSources.
     */
    marker?: string;
    /**
     * Specifies the minimum number of characters that a user should type to trigger the search.
     */
    minSearchLength?: number;
    /**
     * Specifies one or several data fields to search.
     */
    searchExpr?: string | Function | Array<string | Function>;
    /**
     * Specifies the delay between when a user stops typing and when the search is executed.
     */
    searchTimeout?: number;
    /**
     * Specifies a custom template for mentions.
     */
    template?: template | ((mentionData: MentionTemplateData, contentElement: DxElement) => string | UserDefinedElement);
    /**
     * Specifies which data field provides unique values to the template&apos;s `id` parameter.
     */
    valueExpr?: string | Function;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxHtmlEditorToolbar {
    /**
     * Specifies the container in which to place the toolbar.
     */
    container?: string | UserDefinedElement;
    /**
     * Configures toolbar items. These items allow users to format text and execute commands.
     */
    items?: Array<ToolbarItem | HtmlEditorPredefinedToolbarItem>;
    /**
     * Specifies whether or not items are arranged into multiple lines when their combined width exceeds the toolbar width.
     */
    multiline?: boolean;
}

export type ToolbarItem = dxHtmlEditorToolbarItem;

/**
 * @deprecated Use ToolbarItem instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxHtmlEditorToolbarItem extends dxToolbarItem {
    /**
     * Specifies the predefined item that this object customizes or a format with multiple choices.
     */
    name?: HtmlEditorPredefinedToolbarItem | string;
    /**
     * Specifies the predefined item that this object customizes or a format with multiple choices.
     * @deprecated Use name instead.
     */
    formatName?: HtmlEditorPredefinedToolbarItem | string;
    /**
     * Specifies values for a format with multiple choices. Should be used with the name.
     */
    acceptedValues?: Array<string | number | boolean>;
    /**
     * Specifies values for a format with multiple choices.
     * @deprecated Use acceptedValues instead.
     */
    formatValues?: Array<string | number | boolean>;
    /**
     * Specifies a location for the item on the toolbar.
     */
    location?: ToolbarItemLocation;
}

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxHtmlEditorVariables {
    /**
     * Specifies a collection of variables available for a user.
     */
    dataSource?: DataSourceLike<string> | null;
    /**
     * Specifies the special character(s) that should surround the variables.
     */
    escapeChar?: string | Array<string>;
}

export type Properties = dxHtmlEditorOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxHtmlEditorOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type EventsIntegrityCheckingHelper = CheckedEvents<Properties, Required<Events>, 'onFocusIn' | 'onFocusOut'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxHtmlEditorOptions.onContentReady
 * @type_function_param1 e:{ui/html_editor:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxHtmlEditorOptions.onDisposing
 * @type_function_param1 e:{ui/html_editor:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxHtmlEditorOptions.onInitialized
 * @type_function_param1 e:{ui/html_editor:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxHtmlEditorOptions.onOptionChanged
 * @type_function_param1 e:{ui/html_editor:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
/**
 * @docid dxHtmlEditorOptions.onValueChanged
 * @type_function_param1 e:{ui/html_editor:ValueChangedEvent}
 */
onValueChanged?: ((e: ValueChangedEvent) => void);
};
///#ENDDEBUG
