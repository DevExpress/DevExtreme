"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxFileManager, {
    Properties
} from "devextreme/ui/file_manager";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, IElementDescriptor } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ContentReadyEvent, ContextMenuItemClickEvent, ContextMenuShowingEvent, DirectoryCreatedEvent, DirectoryCreatingEvent, DisposingEvent, ErrorOccurredEvent, FileUploadedEvent, FileUploadingEvent, InitializedEvent, ItemCopiedEvent, ItemCopyingEvent, ItemDeletedEvent, ItemDeletingEvent, ItemDownloadingEvent, ItemMovedEvent, ItemMovingEvent, ItemRenamedEvent, ItemRenamingEvent, SelectedFileOpenedEvent, ToolbarItemClickEvent, dxFileManagerContextMenuItem, dxFileManagerDetailsColumn, dxFileManagerToolbarItem } from "devextreme/ui/file_manager";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IFileManagerOptionsNarrowedEvents = {
  onContentReady?: ((e: ContentReadyEvent) => void);
  onContextMenuItemClick?: ((e: ContextMenuItemClickEvent) => void);
  onContextMenuShowing?: ((e: ContextMenuShowingEvent) => void);
  onDirectoryCreated?: ((e: DirectoryCreatedEvent) => void);
  onDirectoryCreating?: ((e: DirectoryCreatingEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onErrorOccurred?: ((e: ErrorOccurredEvent) => void);
  onFileUploaded?: ((e: FileUploadedEvent) => void);
  onFileUploading?: ((e: FileUploadingEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onItemCopied?: ((e: ItemCopiedEvent) => void);
  onItemCopying?: ((e: ItemCopyingEvent) => void);
  onItemDeleted?: ((e: ItemDeletedEvent) => void);
  onItemDeleting?: ((e: ItemDeletingEvent) => void);
  onItemDownloading?: ((e: ItemDownloadingEvent) => void);
  onItemMoved?: ((e: ItemMovedEvent) => void);
  onItemMoving?: ((e: ItemMovingEvent) => void);
  onItemRenamed?: ((e: ItemRenamedEvent) => void);
  onItemRenaming?: ((e: ItemRenamingEvent) => void);
  onSelectedFileOpened?: ((e: SelectedFileOpenedEvent) => void);
  onToolbarItemClick?: ((e: ToolbarItemClickEvent) => void);
}

type IFileManagerOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IFileManagerOptionsNarrowedEvents> & IHtmlOptions>

interface FileManagerRef {
  instance: () => dxFileManager;
}

const FileManager = memo(
  forwardRef(
    (props: React.PropsWithChildren<IFileManagerOptions>, ref: ForwardedRef<FileManagerRef>) => {
      const baseRef = useRef<ComponentRef>(null);

      useImperativeHandle(ref, () => (
        {
          instance() {
            return baseRef.current?.getInstance();
          }
        }
      ), [baseRef.current]);

      const independentEvents = useMemo(() => (["onContentReady","onContextMenuItemClick","onContextMenuShowing","onDirectoryCreated","onDirectoryCreating","onDisposing","onErrorOccurred","onFileUploaded","onFileUploading","onInitialized","onItemCopied","onItemCopying","onItemDeleted","onItemDeleting","onItemDownloading","onItemMoved","onItemMoving","onItemRenamed","onItemRenaming","onSelectedFileOpened","onToolbarItemClick"]), []);

      const expectedChildren = useMemo(() => ({
        contextMenu: { optionName: "contextMenu", isCollectionItem: false },
        itemView: { optionName: "itemView", isCollectionItem: false },
        notifications: { optionName: "notifications", isCollectionItem: false },
        permissions: { optionName: "permissions", isCollectionItem: false },
        toolbar: { optionName: "toolbar", isCollectionItem: false },
        upload: { optionName: "upload", isCollectionItem: false }
      }), []);

      return (
        React.createElement(BaseComponent<React.PropsWithChildren<IFileManagerOptions>>, {
          WidgetClass: dxFileManager,
          ref: baseRef,
          independentEvents,
          expectedChildren,
          ...props,
        })
      );
    },
  ),
) as (props: React.PropsWithChildren<IFileManagerOptions> & { ref?: Ref<FileManagerRef> }) => ReactElement | null;


// owners:
// Details
type IColumnProps = React.PropsWithChildren<{
  alignment?: "center" | "left" | "right";
  caption?: string;
  cssClass?: string;
  dataField?: string;
  dataType?: "string" | "number" | "date" | "boolean" | "object" | "datetime";
  hidingPriority?: number;
  sortIndex?: number;
  sortOrder?: "asc" | "desc";
  visible?: boolean;
  visibleIndex?: number;
  width?: number | string;
}>
const _componentColumn = memo(
  (props: IColumnProps) => {
    return React.createElement(NestedOption<IColumnProps>, { ...props });
  }
);

const Column: typeof _componentColumn & IElementDescriptor = Object.assign(_componentColumn, {
  OptionName: "columns",
  IsCollectionItem: true,
})

// owners:
// FileManager
type IContextMenuProps = React.PropsWithChildren<{
  items?: Array<dxFileManagerContextMenuItem | "create" | "upload" | "refresh" | "download" | "move" | "copy" | "rename" | "delete">;
}>
const _componentContextMenu = memo(
  (props: IContextMenuProps) => {
    return React.createElement(NestedOption<IContextMenuProps>, { ...props });
  }
);

const ContextMenu: typeof _componentContextMenu & IElementDescriptor = Object.assign(_componentContextMenu, {
  OptionName: "contextMenu",
  ExpectedChildren: {
    contextMenuItem: { optionName: "items", isCollectionItem: true },
    item: { optionName: "items", isCollectionItem: true }
  },
})

// owners:
// ContextMenu
// Item
type IContextMenuItemProps = React.PropsWithChildren<{
  beginGroup?: boolean;
  closeMenuOnClick?: boolean;
  disabled?: boolean;
  icon?: string;
  items?: Array<dxFileManagerContextMenuItem>;
  name?: "create" | "upload" | "refresh" | "download" | "move" | "copy" | "rename" | "delete";
  selectable?: boolean;
  selected?: boolean;
  text?: string;
  visible?: boolean;
}>
const _componentContextMenuItem = memo(
  (props: IContextMenuItemProps) => {
    return React.createElement(NestedOption<IContextMenuItemProps>, { ...props });
  }
);

const ContextMenuItem: typeof _componentContextMenuItem & IElementDescriptor = Object.assign(_componentContextMenuItem, {
  OptionName: "items",
  IsCollectionItem: true,
})

// owners:
// ItemView
type IDetailsProps = React.PropsWithChildren<{
  columns?: Array<dxFileManagerDetailsColumn | string>;
}>
const _componentDetails = memo(
  (props: IDetailsProps) => {
    return React.createElement(NestedOption<IDetailsProps>, { ...props });
  }
);

const Details: typeof _componentDetails & IElementDescriptor = Object.assign(_componentDetails, {
  OptionName: "details",
  ExpectedChildren: {
    column: { optionName: "columns", isCollectionItem: true }
  },
})

// owners:
// Toolbar
type IFileSelectionItemProps = React.PropsWithChildren<{
  cssClass?: string;
  disabled?: boolean;
  icon?: string;
  locateInMenu?: "always" | "auto" | "never";
  location?: "after" | "before" | "center";
  name?: "showNavPane" | "create" | "upload" | "refresh" | "switchView" | "download" | "move" | "copy" | "rename" | "delete" | "clearSelection" | "separator";
  options?: any;
  showText?: "always" | "inMenu";
  text?: string;
  visible?: boolean;
  widget?: "dxAutocomplete" | "dxButton" | "dxButtonGroup" | "dxCheckBox" | "dxDateBox" | "dxDropDownButton" | "dxMenu" | "dxSelectBox" | "dxSwitch" | "dxTabs" | "dxTextBox";
}>
const _componentFileSelectionItem = memo(
  (props: IFileSelectionItemProps) => {
    return React.createElement(NestedOption<IFileSelectionItemProps>, { ...props });
  }
);

const FileSelectionItem: typeof _componentFileSelectionItem & IElementDescriptor = Object.assign(_componentFileSelectionItem, {
  OptionName: "fileSelectionItems",
  IsCollectionItem: true,
})

// owners:
// ContextMenu
// Item
// Toolbar
type IItemProps = React.PropsWithChildren<{
  beginGroup?: boolean;
  closeMenuOnClick?: boolean;
  disabled?: boolean;
  icon?: string;
  items?: Array<dxFileManagerContextMenuItem>;
  name?: "create" | "upload" | "refresh" | "download" | "move" | "copy" | "rename" | "delete" | "showNavPane" | "switchView" | "clearSelection" | "separator";
  selectable?: boolean;
  selected?: boolean;
  text?: string;
  visible?: boolean;
  cssClass?: string;
  locateInMenu?: "always" | "auto" | "never";
  location?: "after" | "before" | "center";
  options?: any;
  showText?: "always" | "inMenu";
  widget?: "dxAutocomplete" | "dxButton" | "dxButtonGroup" | "dxCheckBox" | "dxDateBox" | "dxDropDownButton" | "dxMenu" | "dxSelectBox" | "dxSwitch" | "dxTabs" | "dxTextBox";
}>
const _componentItem = memo(
  (props: IItemProps) => {
    return React.createElement(NestedOption<IItemProps>, { ...props });
  }
);

const Item: typeof _componentItem & IElementDescriptor = Object.assign(_componentItem, {
  OptionName: "items",
  IsCollectionItem: true,
})

// owners:
// FileManager
type IItemViewProps = React.PropsWithChildren<{
  details?: Record<string, any> | {
    columns?: Array<dxFileManagerDetailsColumn | string>;
  };
  mode?: "details" | "thumbnails";
  showFolders?: boolean;
  showParentFolder?: boolean;
}>
const _componentItemView = memo(
  (props: IItemViewProps) => {
    return React.createElement(NestedOption<IItemViewProps>, { ...props });
  }
);

const ItemView: typeof _componentItemView & IElementDescriptor = Object.assign(_componentItemView, {
  OptionName: "itemView",
  ExpectedChildren: {
    details: { optionName: "details", isCollectionItem: false }
  },
})

// owners:
// FileManager
type INotificationsProps = React.PropsWithChildren<{
  showPanel?: boolean;
  showPopup?: boolean;
}>
const _componentNotifications = memo(
  (props: INotificationsProps) => {
    return React.createElement(NestedOption<INotificationsProps>, { ...props });
  }
);

const Notifications: typeof _componentNotifications & IElementDescriptor = Object.assign(_componentNotifications, {
  OptionName: "notifications",
})

// owners:
// FileManager
type IPermissionsProps = React.PropsWithChildren<{
  copy?: boolean;
  create?: boolean;
  delete?: boolean;
  download?: boolean;
  move?: boolean;
  rename?: boolean;
  upload?: boolean;
}>
const _componentPermissions = memo(
  (props: IPermissionsProps) => {
    return React.createElement(NestedOption<IPermissionsProps>, { ...props });
  }
);

const Permissions: typeof _componentPermissions & IElementDescriptor = Object.assign(_componentPermissions, {
  OptionName: "permissions",
})

// owners:
// FileManager
type IToolbarProps = React.PropsWithChildren<{
  fileSelectionItems?: Array<dxFileManagerToolbarItem | "showNavPane" | "create" | "upload" | "refresh" | "switchView" | "download" | "move" | "copy" | "rename" | "delete" | "clearSelection" | "separator">;
  items?: Array<dxFileManagerToolbarItem | "showNavPane" | "create" | "upload" | "refresh" | "switchView" | "download" | "move" | "copy" | "rename" | "delete" | "clearSelection" | "separator">;
}>
const _componentToolbar = memo(
  (props: IToolbarProps) => {
    return React.createElement(NestedOption<IToolbarProps>, { ...props });
  }
);

const Toolbar: typeof _componentToolbar & IElementDescriptor = Object.assign(_componentToolbar, {
  OptionName: "toolbar",
  ExpectedChildren: {
    fileSelectionItem: { optionName: "fileSelectionItems", isCollectionItem: true },
    item: { optionName: "items", isCollectionItem: true },
    toolbarItem: { optionName: "items", isCollectionItem: true }
  },
})

// owners:
// Toolbar
type IToolbarItemProps = React.PropsWithChildren<{
  cssClass?: string;
  disabled?: boolean;
  icon?: string;
  locateInMenu?: "always" | "auto" | "never";
  location?: "after" | "before" | "center";
  name?: "showNavPane" | "create" | "upload" | "refresh" | "switchView" | "download" | "move" | "copy" | "rename" | "delete" | "clearSelection" | "separator";
  options?: any;
  showText?: "always" | "inMenu";
  text?: string;
  visible?: boolean;
  widget?: "dxAutocomplete" | "dxButton" | "dxButtonGroup" | "dxCheckBox" | "dxDateBox" | "dxDropDownButton" | "dxMenu" | "dxSelectBox" | "dxSwitch" | "dxTabs" | "dxTextBox";
}>
const _componentToolbarItem = memo(
  (props: IToolbarItemProps) => {
    return React.createElement(NestedOption<IToolbarItemProps>, { ...props });
  }
);

const ToolbarItem: typeof _componentToolbarItem & IElementDescriptor = Object.assign(_componentToolbarItem, {
  OptionName: "items",
  IsCollectionItem: true,
})

// owners:
// FileManager
type IUploadProps = React.PropsWithChildren<{
  chunkSize?: number;
  maxFileSize?: number;
}>
const _componentUpload = memo(
  (props: IUploadProps) => {
    return React.createElement(NestedOption<IUploadProps>, { ...props });
  }
);

const Upload: typeof _componentUpload & IElementDescriptor = Object.assign(_componentUpload, {
  OptionName: "upload",
})

export default FileManager;
export {
  FileManager,
  IFileManagerOptions,
  FileManagerRef,
  Column,
  IColumnProps,
  ContextMenu,
  IContextMenuProps,
  ContextMenuItem,
  IContextMenuItemProps,
  Details,
  IDetailsProps,
  FileSelectionItem,
  IFileSelectionItemProps,
  Item,
  IItemProps,
  ItemView,
  IItemViewProps,
  Notifications,
  INotificationsProps,
  Permissions,
  IPermissionsProps,
  Toolbar,
  IToolbarProps,
  ToolbarItem,
  IToolbarItemProps,
  Upload,
  IUploadProps
};
import type * as FileManagerTypes from 'devextreme/ui/file_manager_types';
export { FileManagerTypes };

