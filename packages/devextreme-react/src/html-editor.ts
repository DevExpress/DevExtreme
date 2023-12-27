"use client"
import dxHtmlEditor, {
    Properties
} from "devextreme/ui/html_editor";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ContentReadyEvent, DisposingEvent, FocusInEvent, FocusOutEvent, InitializedEvent, ValueChangedEvent, dxHtmlEditorImageUploadTabItem, dxHtmlEditorTableContextMenuItem, dxHtmlEditorToolbarItem } from "devextreme/ui/html_editor";
import type { ContentReadyEvent as FileUploaderContentReadyEvent, DisposingEvent as FileUploaderDisposingEvent, InitializedEvent as FileUploaderInitializedEvent, ValueChangedEvent as FileUploaderValueChangedEvent, BeforeSendEvent, DropZoneEnterEvent, DropZoneLeaveEvent, FilesUploadedEvent, OptionChangedEvent, ProgressEvent, UploadAbortedEvent, UploadedEvent, UploadErrorEvent, UploadStartedEvent, dxFileUploaderOptions } from "devextreme/ui/file_uploader";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";
import type { template } from "devextreme/core/templates/template";
import type { DataSourceOptions } from "devextreme/data/data_source";
import type { Store } from "devextreme/data/store";

import type UploadInfo from "devextreme/file_management/upload_info";
import type DataSource from "devextreme/data/data_source";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IHtmlEditorOptionsNarrowedEvents = {
  onContentReady?: ((e: ContentReadyEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onFocusIn?: ((e: FocusInEvent) => void);
  onFocusOut?: ((e: FocusOutEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onValueChanged?: ((e: ValueChangedEvent) => void);
}

type IHtmlEditorOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IHtmlEditorOptionsNarrowedEvents> & IHtmlOptions & {
  defaultValue?: any;
  onValueChange?: (value: any) => void;
}>

class HtmlEditor extends BaseComponent<React.PropsWithChildren<IHtmlEditorOptions>> {

  public get instance(): dxHtmlEditor {
    return this._instance;
  }

  protected _WidgetClass = dxHtmlEditor;

  protected subscribableOptions = ["value"];

  protected independentEvents = ["onContentReady","onDisposing","onFocusIn","onFocusOut","onInitialized","onValueChanged"];

  protected _defaults = {
    defaultValue: "value"
  };

  protected _expectedChildren = {
    imageUpload: { optionName: "imageUpload", isCollectionItem: false },
    mediaResizing: { optionName: "mediaResizing", isCollectionItem: false },
    mention: { optionName: "mentions", isCollectionItem: true },
    tableContextMenu: { optionName: "tableContextMenu", isCollectionItem: false },
    tableResizing: { optionName: "tableResizing", isCollectionItem: false },
    toolbar: { optionName: "toolbar", isCollectionItem: false },
    variables: { optionName: "variables", isCollectionItem: false }
  };
}
(HtmlEditor as any).propTypes = {
  accessKey: PropTypes.string,
  activeStateEnabled: PropTypes.bool,
  allowSoftLineBreak: PropTypes.bool,
  customizeModules: PropTypes.func,
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  focusStateEnabled: PropTypes.bool,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  imageUpload: PropTypes.object,
  isDirty: PropTypes.bool,
  isValid: PropTypes.bool,
  mediaResizing: PropTypes.object,
  mentions: PropTypes.array,
  name: PropTypes.string,
  onContentReady: PropTypes.func,
  onDisposing: PropTypes.func,
  onFocusIn: PropTypes.func,
  onFocusOut: PropTypes.func,
  onInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onValueChanged: PropTypes.func,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  rtlEnabled: PropTypes.bool,
  stylingMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "outlined",
      "underlined",
      "filled"])
  ]),
  tabIndex: PropTypes.number,
  tableContextMenu: PropTypes.object,
  tableResizing: PropTypes.object,
  toolbar: PropTypes.object,
  validationErrors: PropTypes.array,
  validationMessageMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "always",
      "auto"])
  ]),
  validationMessagePosition: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "bottom",
      "left",
      "right",
      "top"])
  ]),
  validationStatus: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "valid",
      "invalid",
      "pending"])
  ]),
  valueType: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "html",
      "markdown"])
  ]),
  variables: PropTypes.object,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ])
};


// owners:
// ImageUpload
type IFileUploaderOptionsProps = React.PropsWithChildren<{
  abortUpload?: ((file: any, uploadInfo?: UploadInfo) => any);
  accept?: string;
  accessKey?: string;
  activeStateEnabled?: boolean;
  allowCanceling?: boolean;
  allowedFileExtensions?: Array<string>;
  bindingOptions?: Record<string, any>;
  chunkSize?: number;
  dialogTrigger?: any | string;
  disabled?: boolean;
  dropZone?: any | string;
  elementAttr?: Record<string, any>;
  focusStateEnabled?: boolean;
  height?: (() => number | string) | number | string;
  hint?: string;
  hoverStateEnabled?: boolean;
  inputAttr?: any;
  invalidFileExtensionMessage?: string;
  invalidMaxFileSizeMessage?: string;
  invalidMinFileSizeMessage?: string;
  isDirty?: boolean;
  isValid?: boolean;
  labelText?: string;
  maxFileSize?: number;
  minFileSize?: number;
  multiple?: boolean;
  name?: string;
  onBeforeSend?: ((e: BeforeSendEvent) => void);
  onContentReady?: ((e: FileUploaderContentReadyEvent) => void);
  onDisposing?: ((e: FileUploaderDisposingEvent) => void);
  onDropZoneEnter?: ((e: DropZoneEnterEvent) => void);
  onDropZoneLeave?: ((e: DropZoneLeaveEvent) => void);
  onFilesUploaded?: ((e: FilesUploadedEvent) => void);
  onInitialized?: ((e: FileUploaderInitializedEvent) => void);
  onOptionChanged?: ((e: OptionChangedEvent) => void);
  onProgress?: ((e: ProgressEvent) => void);
  onUploadAborted?: ((e: UploadAbortedEvent) => void);
  onUploaded?: ((e: UploadedEvent) => void);
  onUploadError?: ((e: UploadErrorEvent) => void);
  onUploadStarted?: ((e: UploadStartedEvent) => void);
  onValueChanged?: ((e: FileUploaderValueChangedEvent) => void);
  progress?: number;
  readOnly?: boolean;
  readyToUploadMessage?: string;
  rtlEnabled?: boolean;
  selectButtonText?: string;
  showFileList?: boolean;
  tabIndex?: number;
  uploadAbortedMessage?: string;
  uploadButtonText?: string;
  uploadChunk?: ((file: any, uploadInfo: UploadInfo) => any);
  uploadCustomData?: any;
  uploadedMessage?: string;
  uploadFailedMessage?: string;
  uploadFile?: ((file: any, progressCallback: (() => void)) => any);
  uploadHeaders?: any;
  uploadMethod?: "POST" | "PUT";
  uploadMode?: "instantly" | "useButtons" | "useForm";
  uploadUrl?: string;
  validationError?: any;
  validationErrors?: Array<any>;
  validationStatus?: "valid" | "invalid" | "pending";
  value?: Array<any>;
  visible?: boolean;
  width?: (() => number | string) | number | string;
  defaultValue?: Array<any>;
  onValueChange?: (value: Array<any>) => void;
}>
class FileUploaderOptions extends NestedOption<IFileUploaderOptionsProps> {
  public static OptionName = "fileUploaderOptions";
  public static DefaultsProps = {
    defaultValue: "value"
  };
}

// owners:
// HtmlEditor
type IImageUploadProps = React.PropsWithChildren<{
  fileUploaderOptions?: dxFileUploaderOptions;
  fileUploadMode?: "base64" | "server" | "both";
  tabs?: Array<dxHtmlEditorImageUploadTabItem | "url" | "file">;
  uploadDirectory?: string;
  uploadUrl?: string;
}>
class ImageUpload extends NestedOption<IImageUploadProps> {
  public static OptionName = "imageUpload";
  public static ExpectedChildren = {
    fileUploaderOptions: { optionName: "fileUploaderOptions", isCollectionItem: false },
    tab: { optionName: "tabs", isCollectionItem: true }
  };
}

// owners:
// TableContextMenu
// Item
// Toolbar
type IItemProps = React.PropsWithChildren<{
  beginGroup?: boolean;
  closeMenuOnClick?: boolean;
  disabled?: boolean;
  icon?: string;
  items?: Array<dxHtmlEditorTableContextMenuItem | "background" | "bold" | "color" | "font" | "italic" | "link" | "image" | "strike" | "subscript" | "superscript" | "underline" | "blockquote" | "increaseIndent" | "decreaseIndent" | "orderedList" | "bulletList" | "alignLeft" | "alignCenter" | "alignRight" | "alignJustify" | "codeBlock" | "variable" | "undo" | "redo" | "clear" | "insertTable" | "insertHeaderRow" | "insertRowAbove" | "insertRowBelow" | "insertColumnLeft" | "insertColumnRight" | "deleteColumn" | "deleteRow" | "deleteTable" | "cellProperties" | "tableProperties">;
  name?: "background" | "bold" | "color" | "font" | "italic" | "link" | "image" | "strike" | "subscript" | "superscript" | "underline" | "blockquote" | "increaseIndent" | "decreaseIndent" | "orderedList" | "bulletList" | "alignLeft" | "alignCenter" | "alignRight" | "alignJustify" | "codeBlock" | "variable" | "undo" | "redo" | "clear" | "insertTable" | "insertHeaderRow" | "insertRowAbove" | "insertRowBelow" | "insertColumnLeft" | "insertColumnRight" | "deleteColumn" | "deleteRow" | "deleteTable" | "cellProperties" | "tableProperties" | "size" | "header" | "separator";
  selectable?: boolean;
  selected?: boolean;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  visible?: boolean;
  acceptedValues?: Array<boolean | number | string>;
  cssClass?: string;
  formatName?: "background" | "bold" | "color" | "font" | "italic" | "link" | "image" | "size" | "strike" | "subscript" | "superscript" | "underline" | "blockquote" | "header" | "increaseIndent" | "decreaseIndent" | "orderedList" | "bulletList" | "alignLeft" | "alignCenter" | "alignRight" | "alignJustify" | "codeBlock" | "variable" | "separator" | "undo" | "redo" | "clear" | "cellProperties" | "tableProperties" | "insertTable" | "insertHeaderRow" | "insertRowAbove" | "insertRowBelow" | "insertColumnLeft" | "insertColumnRight" | "deleteColumn" | "deleteRow" | "deleteTable";
  formatValues?: Array<boolean | number | string>;
  html?: string;
  locateInMenu?: "always" | "auto" | "never";
  location?: "after" | "before" | "center";
  menuItemTemplate?: (() => string | any) | template;
  options?: any;
  showText?: "always" | "inMenu";
  widget?: "dxAutocomplete" | "dxButton" | "dxButtonGroup" | "dxCheckBox" | "dxDateBox" | "dxDropDownButton" | "dxMenu" | "dxSelectBox" | "dxSwitch" | "dxTabs" | "dxTextBox";
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
  menuItemRender?: (...params: any) => React.ReactNode;
  menuItemComponent?: React.ComponentType<any>;
  menuItemKeyFn?: (data: any) => string;
}>
class Item extends NestedOption<IItemProps> {
  public static OptionName = "items";
  public static IsCollectionItem = true;
  public static TemplateProps = [{
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }, {
    tmplOption: "menuItemTemplate",
    render: "menuItemRender",
    component: "menuItemComponent",
    keyFn: "menuItemKeyFn"
  }];
}

// owners:
// HtmlEditor
type IMediaResizingProps = React.PropsWithChildren<{
  allowedTargets?: Array<string>;
  enabled?: boolean;
}>
class MediaResizing extends NestedOption<IMediaResizingProps> {
  public static OptionName = "mediaResizing";
}

// owners:
// HtmlEditor
type IMentionProps = React.PropsWithChildren<{
  dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string;
  displayExpr?: ((item: any) => string) | string;
  itemTemplate?: ((itemData: any, itemIndex: number, itemElement: any) => string | any) | template;
  marker?: string;
  minSearchLength?: number;
  searchExpr?: Array<(() => any) | string> | (() => any) | string;
  searchTimeout?: number;
  template?: ((mentionData: { id: string | number, marker: string, value: any }, contentElement: any) => string | any) | template;
  valueExpr?: (() => void) | string;
  itemRender?: (...params: any) => React.ReactNode;
  itemComponent?: React.ComponentType<any>;
  itemKeyFn?: (data: any) => string;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>
class Mention extends NestedOption<IMentionProps> {
  public static OptionName = "mentions";
  public static IsCollectionItem = true;
  public static TemplateProps = [{
    tmplOption: "itemTemplate",
    render: "itemRender",
    component: "itemComponent",
    keyFn: "itemKeyFn"
  }, {
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
}

// owners:
// ImageUpload
type ITabProps = React.PropsWithChildren<{
  name?: "url" | "file";
}>
class Tab extends NestedOption<ITabProps> {
  public static OptionName = "tabs";
  public static IsCollectionItem = true;
}

// owners:
// HtmlEditor
type ITableContextMenuProps = React.PropsWithChildren<{
  enabled?: boolean;
  items?: Array<dxHtmlEditorTableContextMenuItem | "background" | "bold" | "color" | "font" | "italic" | "link" | "image" | "strike" | "subscript" | "superscript" | "underline" | "blockquote" | "increaseIndent" | "decreaseIndent" | "orderedList" | "bulletList" | "alignLeft" | "alignCenter" | "alignRight" | "alignJustify" | "codeBlock" | "variable" | "undo" | "redo" | "clear" | "insertTable" | "insertHeaderRow" | "insertRowAbove" | "insertRowBelow" | "insertColumnLeft" | "insertColumnRight" | "deleteColumn" | "deleteRow" | "deleteTable" | "cellProperties" | "tableProperties">;
}>
class TableContextMenu extends NestedOption<ITableContextMenuProps> {
  public static OptionName = "tableContextMenu";
  public static ExpectedChildren = {
    item: { optionName: "items", isCollectionItem: true },
    tableContextMenuItem: { optionName: "items", isCollectionItem: true }
  };
}

// owners:
// TableContextMenu
// Item
type ITableContextMenuItemProps = React.PropsWithChildren<{
  beginGroup?: boolean;
  closeMenuOnClick?: boolean;
  disabled?: boolean;
  icon?: string;
  items?: Array<dxHtmlEditorTableContextMenuItem | "background" | "bold" | "color" | "font" | "italic" | "link" | "image" | "strike" | "subscript" | "superscript" | "underline" | "blockquote" | "increaseIndent" | "decreaseIndent" | "orderedList" | "bulletList" | "alignLeft" | "alignCenter" | "alignRight" | "alignJustify" | "codeBlock" | "variable" | "undo" | "redo" | "clear" | "insertTable" | "insertHeaderRow" | "insertRowAbove" | "insertRowBelow" | "insertColumnLeft" | "insertColumnRight" | "deleteColumn" | "deleteRow" | "deleteTable" | "cellProperties" | "tableProperties">;
  name?: "background" | "bold" | "color" | "font" | "italic" | "link" | "image" | "strike" | "subscript" | "superscript" | "underline" | "blockquote" | "increaseIndent" | "decreaseIndent" | "orderedList" | "bulletList" | "alignLeft" | "alignCenter" | "alignRight" | "alignJustify" | "codeBlock" | "variable" | "undo" | "redo" | "clear" | "insertTable" | "insertHeaderRow" | "insertRowAbove" | "insertRowBelow" | "insertColumnLeft" | "insertColumnRight" | "deleteColumn" | "deleteRow" | "deleteTable" | "cellProperties" | "tableProperties";
  selectable?: boolean;
  selected?: boolean;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  visible?: boolean;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>
class TableContextMenuItem extends NestedOption<ITableContextMenuItemProps> {
  public static OptionName = "items";
  public static IsCollectionItem = true;
  public static TemplateProps = [{
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
}

// owners:
// HtmlEditor
type ITableResizingProps = React.PropsWithChildren<{
  enabled?: boolean;
  minColumnWidth?: number;
  minRowHeight?: number;
}>
class TableResizing extends NestedOption<ITableResizingProps> {
  public static OptionName = "tableResizing";
}

// owners:
// HtmlEditor
type IToolbarProps = React.PropsWithChildren<{
  container?: any | string;
  items?: Array<dxHtmlEditorToolbarItem | "background" | "bold" | "color" | "font" | "italic" | "link" | "image" | "size" | "strike" | "subscript" | "superscript" | "underline" | "blockquote" | "header" | "increaseIndent" | "decreaseIndent" | "orderedList" | "bulletList" | "alignLeft" | "alignCenter" | "alignRight" | "alignJustify" | "codeBlock" | "variable" | "separator" | "undo" | "redo" | "clear" | "cellProperties" | "tableProperties" | "insertTable" | "insertHeaderRow" | "insertRowAbove" | "insertRowBelow" | "insertColumnLeft" | "insertColumnRight" | "deleteColumn" | "deleteRow" | "deleteTable">;
  multiline?: boolean;
}>
class Toolbar extends NestedOption<IToolbarProps> {
  public static OptionName = "toolbar";
  public static ExpectedChildren = {
    item: { optionName: "items", isCollectionItem: true },
    toolbarItem: { optionName: "items", isCollectionItem: true }
  };
}

// owners:
// Toolbar
type IToolbarItemProps = React.PropsWithChildren<{
  acceptedValues?: Array<boolean | number | string>;
  cssClass?: string;
  disabled?: boolean;
  formatName?: "background" | "bold" | "color" | "font" | "italic" | "link" | "image" | "size" | "strike" | "subscript" | "superscript" | "underline" | "blockquote" | "header" | "increaseIndent" | "decreaseIndent" | "orderedList" | "bulletList" | "alignLeft" | "alignCenter" | "alignRight" | "alignJustify" | "codeBlock" | "variable" | "separator" | "undo" | "redo" | "clear" | "cellProperties" | "tableProperties" | "insertTable" | "insertHeaderRow" | "insertRowAbove" | "insertRowBelow" | "insertColumnLeft" | "insertColumnRight" | "deleteColumn" | "deleteRow" | "deleteTable";
  formatValues?: Array<boolean | number | string>;
  html?: string;
  locateInMenu?: "always" | "auto" | "never";
  location?: "after" | "before" | "center";
  menuItemTemplate?: (() => string | any) | template;
  name?: "background" | "bold" | "color" | "font" | "italic" | "link" | "image" | "size" | "strike" | "subscript" | "superscript" | "underline" | "blockquote" | "header" | "increaseIndent" | "decreaseIndent" | "orderedList" | "bulletList" | "alignLeft" | "alignCenter" | "alignRight" | "alignJustify" | "codeBlock" | "variable" | "separator" | "undo" | "redo" | "clear" | "cellProperties" | "tableProperties" | "insertTable" | "insertHeaderRow" | "insertRowAbove" | "insertRowBelow" | "insertColumnLeft" | "insertColumnRight" | "deleteColumn" | "deleteRow" | "deleteTable";
  options?: any;
  showText?: "always" | "inMenu";
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  visible?: boolean;
  widget?: "dxAutocomplete" | "dxButton" | "dxButtonGroup" | "dxCheckBox" | "dxDateBox" | "dxDropDownButton" | "dxMenu" | "dxSelectBox" | "dxSwitch" | "dxTabs" | "dxTextBox";
  menuItemRender?: (...params: any) => React.ReactNode;
  menuItemComponent?: React.ComponentType<any>;
  menuItemKeyFn?: (data: any) => string;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  keyFn?: (data: any) => string;
}>
class ToolbarItem extends NestedOption<IToolbarItemProps> {
  public static OptionName = "items";
  public static IsCollectionItem = true;
  public static TemplateProps = [{
    tmplOption: "menuItemTemplate",
    render: "menuItemRender",
    component: "menuItemComponent",
    keyFn: "menuItemKeyFn"
  }, {
    tmplOption: "template",
    render: "render",
    component: "component",
    keyFn: "keyFn"
  }];
}

// owners:
// HtmlEditor
type IVariablesProps = React.PropsWithChildren<{
  dataSource?: Array<string> | DataSource | DataSourceOptions | null | Store | string;
  escapeChar?: Array<string> | string;
}>
class Variables extends NestedOption<IVariablesProps> {
  public static OptionName = "variables";
}

export default HtmlEditor;
export {
  HtmlEditor,
  IHtmlEditorOptions,
  FileUploaderOptions,
  IFileUploaderOptionsProps,
  ImageUpload,
  IImageUploadProps,
  Item,
  IItemProps,
  MediaResizing,
  IMediaResizingProps,
  Mention,
  IMentionProps,
  Tab,
  ITabProps,
  TableContextMenu,
  ITableContextMenuProps,
  TableContextMenuItem,
  ITableContextMenuItemProps,
  TableResizing,
  ITableResizingProps,
  Toolbar,
  IToolbarProps,
  ToolbarItem,
  IToolbarItemProps,
  Variables,
  IVariablesProps
};
import type * as HtmlEditorTypes from 'devextreme/ui/html_editor_types';
export { HtmlEditorTypes };

