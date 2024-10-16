"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxHtmlEditor, {
    Properties
} from "devextreme/ui/html_editor";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, IElementDescriptor } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ContentReadyEvent, DisposingEvent, FocusInEvent, FocusOutEvent, InitializedEvent, ValueChangedEvent, HtmlEditorImageUploadMode, dxHtmlEditorImageUploadTabItem, HtmlEditorImageUploadTab, dxHtmlEditorTableContextMenuItem, HtmlEditorPredefinedContextMenuItem, HtmlEditorPredefinedToolbarItem, dxHtmlEditorToolbarItem } from "devextreme/ui/html_editor";
import type { ContentReadyEvent as FileUploaderContentReadyEvent, DisposingEvent as FileUploaderDisposingEvent, InitializedEvent as FileUploaderInitializedEvent, ValueChangedEvent as FileUploaderValueChangedEvent, BeforeSendEvent, DropZoneEnterEvent, DropZoneLeaveEvent, FilesUploadedEvent, OptionChangedEvent, ProgressEvent, UploadAbortedEvent, UploadedEvent, UploadErrorEvent, UploadStartedEvent, UploadHttpMethod, FileUploadMode, dxFileUploaderOptions } from "devextreme/ui/file_uploader";
import type { ValidationStatus, ToolbarItemLocation, ToolbarItemComponent } from "devextreme/common";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";
import type { template } from "devextreme/core/templates/template";
import type { LocateInMenuMode, ShowTextMode } from "devextreme/ui/toolbar";
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

interface HtmlEditorRef {
  instance: () => dxHtmlEditor;
}

const HtmlEditor = memo(
  forwardRef(
    (props: React.PropsWithChildren<IHtmlEditorOptions>, ref: ForwardedRef<HtmlEditorRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const subscribableOptions = useMemo(() => (["value"]), []);
      const independentEvents = useMemo(() => (["onContentReady","onDisposing","onFocusIn","onFocusOut","onInitialized","onValueChanged"]), []);

      const defaults = useMemo(() => ({
        defaultValue: "value",
      }), []);

      const expectedChildren = useMemo(() => ({
        imageUpload: { optionName: "imageUpload", isCollectionItem: false },
        mediaResizing: { optionName: "mediaResizing", isCollectionItem: false },
        mention: { optionName: "mentions", isCollectionItem: true },
        tableContextMenu: { optionName: "tableContextMenu", isCollectionItem: false },
        tableResizing: { optionName: "tableResizing", isCollectionItem: false },
        toolbar: { optionName: "toolbar", isCollectionItem: false },
        variables: { optionName: "variables", isCollectionItem: false }
      }), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IHtmlEditorOptions>>, {
          WidgetClass: dxHtmlEditor,
          ref: baseRef,
          subscribableOptions,
          independentEvents,
          defaults,
          expectedChildren,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<IHtmlEditorOptions> & { ref?: Ref<HtmlEditorRef> }) => ReactElement | null;


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
  uploadMethod?: UploadHttpMethod;
  uploadMode?: FileUploadMode;
  uploadUrl?: string;
  validationError?: any;
  validationErrors?: Array<any>;
  validationStatus?: ValidationStatus;
  value?: Array<any>;
  visible?: boolean;
  width?: (() => number | string) | number | string;
  defaultValue?: Array<any>;
  onValueChange?: (value: Array<any>) => void;
}>
const _componentFileUploaderOptions = memo(
  (props: IFileUploaderOptionsProps) => {
    return React.createElement(NestedOption<IFileUploaderOptionsProps>, { ...props });
  }
);

const FileUploaderOptions: typeof _componentFileUploaderOptions & IElementDescriptor = Object.assign(_componentFileUploaderOptions, {
  OptionName: "fileUploaderOptions",
  DefaultsProps: {
    defaultValue: "value"
  },
})

// owners:
// HtmlEditor
type IImageUploadProps = React.PropsWithChildren<{
  fileUploaderOptions?: dxFileUploaderOptions;
  fileUploadMode?: HtmlEditorImageUploadMode;
  tabs?: Array<dxHtmlEditorImageUploadTabItem | HtmlEditorImageUploadTab>;
  uploadDirectory?: string;
  uploadUrl?: string;
}>
const _componentImageUpload = memo(
  (props: IImageUploadProps) => {
    return React.createElement(NestedOption<IImageUploadProps>, { ...props });
  }
);

const ImageUpload: typeof _componentImageUpload & IElementDescriptor = Object.assign(_componentImageUpload, {
  OptionName: "imageUpload",
  ExpectedChildren: {
    fileUploaderOptions: { optionName: "fileUploaderOptions", isCollectionItem: false },
    tab: { optionName: "tabs", isCollectionItem: true }
  },
})

// owners:
// TableContextMenu
// Item
// Toolbar
type IItemProps = React.PropsWithChildren<{
  beginGroup?: boolean;
  closeMenuOnClick?: boolean;
  disabled?: boolean;
  icon?: string;
  items?: Array<dxHtmlEditorTableContextMenuItem | HtmlEditorPredefinedContextMenuItem>;
  name?: HtmlEditorPredefinedContextMenuItem | HtmlEditorPredefinedToolbarItem | string;
  selectable?: boolean;
  selected?: boolean;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  visible?: boolean;
  acceptedValues?: Array<boolean | number | string>;
  cssClass?: string;
  formatName?: HtmlEditorPredefinedToolbarItem | string;
  formatValues?: Array<boolean | number | string>;
  html?: string;
  locateInMenu?: LocateInMenuMode;
  location?: ToolbarItemLocation;
  menuItemTemplate?: (() => string | any) | template;
  options?: any;
  showText?: ShowTextMode;
  widget?: ToolbarItemComponent;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
  menuItemRender?: (...params: any) => React.ReactNode;
  menuItemComponent?: React.ComponentType<any>;
}>
const _componentItem = memo(
  (props: IItemProps) => {
    return React.createElement(NestedOption<IItemProps>, { ...props });
  }
);

const Item: typeof _componentItem & IElementDescriptor = Object.assign(_componentItem, {
  OptionName: "items",
  IsCollectionItem: true,
  TemplateProps: [{
    tmplOption: "template",
    render: "render",
    component: "component"
  }, {
    tmplOption: "menuItemTemplate",
    render: "menuItemRender",
    component: "menuItemComponent"
  }],
})

// owners:
// HtmlEditor
type IMediaResizingProps = React.PropsWithChildren<{
  allowedTargets?: Array<string>;
  enabled?: boolean;
}>
const _componentMediaResizing = memo(
  (props: IMediaResizingProps) => {
    return React.createElement(NestedOption<IMediaResizingProps>, { ...props });
  }
);

const MediaResizing: typeof _componentMediaResizing & IElementDescriptor = Object.assign(_componentMediaResizing, {
  OptionName: "mediaResizing",
})

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
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentMention = memo(
  (props: IMentionProps) => {
    return React.createElement(NestedOption<IMentionProps>, { ...props });
  }
);

const Mention: typeof _componentMention & IElementDescriptor = Object.assign(_componentMention, {
  OptionName: "mentions",
  IsCollectionItem: true,
  TemplateProps: [{
    tmplOption: "itemTemplate",
    render: "itemRender",
    component: "itemComponent"
  }, {
    tmplOption: "template",
    render: "render",
    component: "component"
  }],
})

// owners:
// ImageUpload
type ITabProps = React.PropsWithChildren<{
  name?: HtmlEditorImageUploadTab;
}>
const _componentTab = memo(
  (props: ITabProps) => {
    return React.createElement(NestedOption<ITabProps>, { ...props });
  }
);

const Tab: typeof _componentTab & IElementDescriptor = Object.assign(_componentTab, {
  OptionName: "tabs",
  IsCollectionItem: true,
})

// owners:
// HtmlEditor
type ITableContextMenuProps = React.PropsWithChildren<{
  enabled?: boolean;
  items?: Array<dxHtmlEditorTableContextMenuItem | HtmlEditorPredefinedContextMenuItem>;
}>
const _componentTableContextMenu = memo(
  (props: ITableContextMenuProps) => {
    return React.createElement(NestedOption<ITableContextMenuProps>, { ...props });
  }
);

const TableContextMenu: typeof _componentTableContextMenu & IElementDescriptor = Object.assign(_componentTableContextMenu, {
  OptionName: "tableContextMenu",
  ExpectedChildren: {
    item: { optionName: "items", isCollectionItem: true },
    tableContextMenuItem: { optionName: "items", isCollectionItem: true }
  },
})

// owners:
// TableContextMenu
// Item
type ITableContextMenuItemProps = React.PropsWithChildren<{
  beginGroup?: boolean;
  closeMenuOnClick?: boolean;
  disabled?: boolean;
  icon?: string;
  items?: Array<dxHtmlEditorTableContextMenuItem | HtmlEditorPredefinedContextMenuItem>;
  name?: HtmlEditorPredefinedContextMenuItem;
  selectable?: boolean;
  selected?: boolean;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  visible?: boolean;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentTableContextMenuItem = memo(
  (props: ITableContextMenuItemProps) => {
    return React.createElement(NestedOption<ITableContextMenuItemProps>, { ...props });
  }
);

const TableContextMenuItem: typeof _componentTableContextMenuItem & IElementDescriptor = Object.assign(_componentTableContextMenuItem, {
  OptionName: "items",
  IsCollectionItem: true,
  TemplateProps: [{
    tmplOption: "template",
    render: "render",
    component: "component"
  }],
})

// owners:
// HtmlEditor
type ITableResizingProps = React.PropsWithChildren<{
  enabled?: boolean;
  minColumnWidth?: number;
  minRowHeight?: number;
}>
const _componentTableResizing = memo(
  (props: ITableResizingProps) => {
    return React.createElement(NestedOption<ITableResizingProps>, { ...props });
  }
);

const TableResizing: typeof _componentTableResizing & IElementDescriptor = Object.assign(_componentTableResizing, {
  OptionName: "tableResizing",
})

// owners:
// HtmlEditor
type IToolbarProps = React.PropsWithChildren<{
  container?: any | string;
  items?: Array<dxHtmlEditorToolbarItem | HtmlEditorPredefinedToolbarItem>;
  multiline?: boolean;
}>
const _componentToolbar = memo(
  (props: IToolbarProps) => {
    return React.createElement(NestedOption<IToolbarProps>, { ...props });
  }
);

const Toolbar: typeof _componentToolbar & IElementDescriptor = Object.assign(_componentToolbar, {
  OptionName: "toolbar",
  ExpectedChildren: {
    item: { optionName: "items", isCollectionItem: true },
    toolbarItem: { optionName: "items", isCollectionItem: true }
  },
})

// owners:
// Toolbar
type IToolbarItemProps = React.PropsWithChildren<{
  acceptedValues?: Array<boolean | number | string>;
  cssClass?: string;
  disabled?: boolean;
  formatName?: HtmlEditorPredefinedToolbarItem | string;
  formatValues?: Array<boolean | number | string>;
  html?: string;
  locateInMenu?: LocateInMenuMode;
  location?: ToolbarItemLocation;
  menuItemTemplate?: (() => string | any) | template;
  name?: HtmlEditorPredefinedToolbarItem | string;
  options?: any;
  showText?: ShowTextMode;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  visible?: boolean;
  widget?: ToolbarItemComponent;
  menuItemRender?: (...params: any) => React.ReactNode;
  menuItemComponent?: React.ComponentType<any>;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentToolbarItem = memo(
  (props: IToolbarItemProps) => {
    return React.createElement(NestedOption<IToolbarItemProps>, { ...props });
  }
);

const ToolbarItem: typeof _componentToolbarItem & IElementDescriptor = Object.assign(_componentToolbarItem, {
  OptionName: "items",
  IsCollectionItem: true,
  TemplateProps: [{
    tmplOption: "menuItemTemplate",
    render: "menuItemRender",
    component: "menuItemComponent"
  }, {
    tmplOption: "template",
    render: "render",
    component: "component"
  }],
})

// owners:
// HtmlEditor
type IVariablesProps = React.PropsWithChildren<{
  dataSource?: Array<string> | DataSource | DataSourceOptions | null | Store | string;
  escapeChar?: Array<string> | string;
}>
const _componentVariables = memo(
  (props: IVariablesProps) => {
    return React.createElement(NestedOption<IVariablesProps>, { ...props });
  }
);

const Variables: typeof _componentVariables & IElementDescriptor = Object.assign(_componentVariables, {
  OptionName: "variables",
})

export default HtmlEditor;
export {
  HtmlEditor,
  IHtmlEditorOptions,
  HtmlEditorRef,
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

