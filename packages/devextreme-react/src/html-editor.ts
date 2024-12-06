"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxHtmlEditor, {
    Properties
} from "devextreme/ui/html_editor";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ContentReadyEvent, DisposingEvent, FocusInEvent, FocusOutEvent, InitializedEvent, ValueChangedEvent, HtmlEditorImageUploadMode, dxHtmlEditorImageUploadTabItem, HtmlEditorImageUploadTab, dxHtmlEditorTableContextMenuItem, HtmlEditorPredefinedContextMenuItem, HtmlEditorPredefinedToolbarItem, dxHtmlEditorToolbarItem } from "devextreme/ui/html_editor";
import type { ContentReadyEvent as FileUploaderContentReadyEvent, DisposingEvent as FileUploaderDisposingEvent, InitializedEvent as FileUploaderInitializedEvent, ValueChangedEvent as FileUploaderValueChangedEvent, BeforeSendEvent, DropZoneEnterEvent, DropZoneLeaveEvent, FilesUploadedEvent, OptionChangedEvent, ProgressEvent, UploadAbortedEvent, UploadedEvent, UploadErrorEvent, UploadStartedEvent, UploadHttpMethod, FileUploadMode, dxFileUploaderOptions } from "devextreme/ui/file_uploader";
import type { ValidationStatus, template, ToolbarItemLocation, ToolbarItemComponent } from "devextreme/common";
import type { CollectionWidgetItem } from "devextreme/ui/collection/ui.collection_widget.base";
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
        converter: { optionName: "converter", isCollectionItem: false },
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
// HtmlEditor
type IConverterProps = React.PropsWithChildren<{
  fromHtml?: ((value: string) => string);
  toHtml?: ((value: string) => string);
}>
const _componentConverter = (props: IConverterProps) => {
  return React.createElement(NestedOption<IConverterProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "converter",
    },
  });
};

const Converter = Object.assign<typeof _componentConverter, NestedComponentMeta>(_componentConverter, {
  componentType: "option",
});

// owners:
// ImageUpload
type IFileUploaderOptionsProps = React.PropsWithChildren<{
  abortUpload?: ((file: any, uploadInfo?: UploadInfo) => any);
  accept?: string;
  accessKey?: string | undefined;
  activeStateEnabled?: boolean;
  allowCanceling?: boolean;
  allowedFileExtensions?: Array<string>;
  bindingOptions?: Record<string, any>;
  chunkSize?: number;
  dialogTrigger?: any | string | undefined;
  disabled?: boolean;
  dropZone?: any | string | undefined;
  elementAttr?: Record<string, any>;
  focusStateEnabled?: boolean;
  height?: (() => number | string) | number | string | undefined;
  hint?: string | undefined;
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
  width?: (() => number | string) | number | string | undefined;
  defaultValue?: Array<any>;
  onValueChange?: (value: Array<any>) => void;
}>
const _componentFileUploaderOptions = (props: IFileUploaderOptionsProps) => {
  return React.createElement(NestedOption<IFileUploaderOptionsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "fileUploaderOptions",
      DefaultsProps: {
        defaultValue: "value"
      },
    },
  });
};

const FileUploaderOptions = Object.assign<typeof _componentFileUploaderOptions, NestedComponentMeta>(_componentFileUploaderOptions, {
  componentType: "option",
});

// owners:
// HtmlEditor
type IImageUploadProps = React.PropsWithChildren<{
  fileUploaderOptions?: dxFileUploaderOptions;
  fileUploadMode?: HtmlEditorImageUploadMode;
  tabs?: Array<dxHtmlEditorImageUploadTabItem | HtmlEditorImageUploadTab>;
  uploadDirectory?: string | undefined;
  uploadUrl?: string | undefined;
}>
const _componentImageUpload = (props: IImageUploadProps) => {
  return React.createElement(NestedOption<IImageUploadProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "imageUpload",
      ExpectedChildren: {
        fileUploaderOptions: { optionName: "fileUploaderOptions", isCollectionItem: false },
        tab: { optionName: "tabs", isCollectionItem: true }
      },
    },
  });
};

const ImageUpload = Object.assign<typeof _componentImageUpload, NestedComponentMeta>(_componentImageUpload, {
  componentType: "option",
});

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
  name?: HtmlEditorPredefinedContextMenuItem | undefined | HtmlEditorPredefinedToolbarItem | string;
  selectable?: boolean;
  selected?: boolean;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  visible?: boolean;
  acceptedValues?: Array<boolean | number | string>;
  cssClass?: string | undefined;
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
const _componentItem = (props: IItemProps) => {
  return React.createElement(NestedOption<IItemProps>, {
    ...props,
    elementDescriptor: {
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
    },
  });
};

const Item = Object.assign<typeof _componentItem, NestedComponentMeta>(_componentItem, {
  componentType: "option",
});

// owners:
// HtmlEditor
type IMediaResizingProps = React.PropsWithChildren<{
  allowedTargets?: Array<string>;
  enabled?: boolean;
}>
const _componentMediaResizing = (props: IMediaResizingProps) => {
  return React.createElement(NestedOption<IMediaResizingProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "mediaResizing",
    },
  });
};

const MediaResizing = Object.assign<typeof _componentMediaResizing, NestedComponentMeta>(_componentMediaResizing, {
  componentType: "option",
});

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
const _componentMention = (props: IMentionProps) => {
  return React.createElement(NestedOption<IMentionProps>, {
    ...props,
    elementDescriptor: {
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
    },
  });
};

const Mention = Object.assign<typeof _componentMention, NestedComponentMeta>(_componentMention, {
  componentType: "option",
});

// owners:
// ImageUpload
type ITabProps = React.PropsWithChildren<{
  name?: HtmlEditorImageUploadTab | undefined;
}>
const _componentTab = (props: ITabProps) => {
  return React.createElement(NestedOption<ITabProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "tabs",
      IsCollectionItem: true,
    },
  });
};

const Tab = Object.assign<typeof _componentTab, NestedComponentMeta>(_componentTab, {
  componentType: "option",
});

// owners:
// HtmlEditor
type ITableContextMenuProps = React.PropsWithChildren<{
  enabled?: boolean;
  items?: Array<dxHtmlEditorTableContextMenuItem | HtmlEditorPredefinedContextMenuItem>;
}>
const _componentTableContextMenu = (props: ITableContextMenuProps) => {
  return React.createElement(NestedOption<ITableContextMenuProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "tableContextMenu",
      ExpectedChildren: {
        item: { optionName: "items", isCollectionItem: true },
        tableContextMenuItem: { optionName: "items", isCollectionItem: true }
      },
    },
  });
};

const TableContextMenu = Object.assign<typeof _componentTableContextMenu, NestedComponentMeta>(_componentTableContextMenu, {
  componentType: "option",
});

// owners:
// TableContextMenu
// Item
type ITableContextMenuItemProps = React.PropsWithChildren<{
  beginGroup?: boolean;
  closeMenuOnClick?: boolean;
  disabled?: boolean;
  icon?: string;
  items?: Array<dxHtmlEditorTableContextMenuItem | HtmlEditorPredefinedContextMenuItem>;
  name?: HtmlEditorPredefinedContextMenuItem | undefined;
  selectable?: boolean;
  selected?: boolean;
  template?: ((itemData: CollectionWidgetItem, itemIndex: number, itemElement: any) => string | any) | template;
  text?: string;
  visible?: boolean;
  render?: (...params: any) => React.ReactNode;
  component?: React.ComponentType<any>;
}>
const _componentTableContextMenuItem = (props: ITableContextMenuItemProps) => {
  return React.createElement(NestedOption<ITableContextMenuItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "items",
      IsCollectionItem: true,
      TemplateProps: [{
        tmplOption: "template",
        render: "render",
        component: "component"
      }],
    },
  });
};

const TableContextMenuItem = Object.assign<typeof _componentTableContextMenuItem, NestedComponentMeta>(_componentTableContextMenuItem, {
  componentType: "option",
});

// owners:
// HtmlEditor
type ITableResizingProps = React.PropsWithChildren<{
  enabled?: boolean;
  minColumnWidth?: number;
  minRowHeight?: number;
}>
const _componentTableResizing = (props: ITableResizingProps) => {
  return React.createElement(NestedOption<ITableResizingProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "tableResizing",
    },
  });
};

const TableResizing = Object.assign<typeof _componentTableResizing, NestedComponentMeta>(_componentTableResizing, {
  componentType: "option",
});

// owners:
// HtmlEditor
type IToolbarProps = React.PropsWithChildren<{
  container?: any | string;
  items?: Array<dxHtmlEditorToolbarItem | HtmlEditorPredefinedToolbarItem>;
  multiline?: boolean;
}>
const _componentToolbar = (props: IToolbarProps) => {
  return React.createElement(NestedOption<IToolbarProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "toolbar",
      ExpectedChildren: {
        item: { optionName: "items", isCollectionItem: true },
        toolbarItem: { optionName: "items", isCollectionItem: true }
      },
    },
  });
};

const Toolbar = Object.assign<typeof _componentToolbar, NestedComponentMeta>(_componentToolbar, {
  componentType: "option",
});

// owners:
// Toolbar
type IToolbarItemProps = React.PropsWithChildren<{
  acceptedValues?: Array<boolean | number | string>;
  cssClass?: string | undefined;
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
const _componentToolbarItem = (props: IToolbarItemProps) => {
  return React.createElement(NestedOption<IToolbarItemProps>, {
    ...props,
    elementDescriptor: {
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
    },
  });
};

const ToolbarItem = Object.assign<typeof _componentToolbarItem, NestedComponentMeta>(_componentToolbarItem, {
  componentType: "option",
});

// owners:
// HtmlEditor
type IVariablesProps = React.PropsWithChildren<{
  dataSource?: Array<string> | DataSource | DataSourceOptions | null | Store | string;
  escapeChar?: Array<string> | string;
}>
const _componentVariables = (props: IVariablesProps) => {
  return React.createElement(NestedOption<IVariablesProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "variables",
    },
  });
};

const Variables = Object.assign<typeof _componentVariables, NestedComponentMeta>(_componentVariables, {
  componentType: "option",
});

export default HtmlEditor;
export {
  HtmlEditor,
  IHtmlEditorOptions,
  HtmlEditorRef,
  Converter,
  IConverterProps,
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

