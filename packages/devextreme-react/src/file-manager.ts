"use client"
import * as React from "react";
import { memo, forwardRef, useImperativeHandle, useRef, useMemo, ForwardedRef, Ref, ReactElement } from "react";
import dxFileManager, {
    Properties
} from "devextreme/ui/file_manager";

import { Component as BaseComponent, IHtmlOptions, ComponentRef, NestedComponentMeta } from "./core/component";
import NestedOption from "./core/nested-option";

import type { ContentReadyEvent, ContextMenuItemClickEvent, ContextMenuShowingEvent, DirectoryCreatedEvent, DirectoryCreatingEvent, DisposingEvent, ErrorOccurredEvent, FileUploadedEvent, FileUploadingEvent, InitializedEvent, ItemCopiedEvent, ItemCopyingEvent, ItemDeletedEvent, ItemDeletingEvent, ItemDownloadingEvent, ItemMovedEvent, ItemMovingEvent, ItemRenamedEvent, ItemRenamingEvent, SelectedFileOpenedEvent, ToolbarItemClickEvent, dxFileManagerContextMenuItem, FileManagerPredefinedContextMenuItem, dxFileManagerDetailsColumn, FileManagerPredefinedToolbarItem, FileManagerItemViewMode, dxFileManagerToolbarItem } from "devextreme/ui/file_manager";
import type { HorizontalAlignment, DataType, SortOrder, ToolbarItemLocation, ToolbarItemComponent } from "devextreme/common";
import type { LocateInMenuMode, ShowTextMode } from "devextreme/ui/toolbar";

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
  alignment?: HorizontalAlignment | undefined;
  caption?: string | undefined;
  cssClass?: string | undefined;
  dataField?: string | undefined;
  dataType?: DataType | undefined;
  hidingPriority?: number | undefined;
  sortIndex?: number | undefined;
  sortOrder?: SortOrder | undefined;
  visible?: boolean;
  visibleIndex?: number | undefined;
  width?: number | string | undefined;
}>
const _componentColumn = (props: IColumnProps) => {
  return React.createElement(NestedOption<IColumnProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "columns",
      IsCollectionItem: true,
    },
  });
};

const Column = Object.assign<typeof _componentColumn, NestedComponentMeta>(_componentColumn, {
  componentType: "option",
});

// owners:
// FileManager
type IContextMenuProps = React.PropsWithChildren<{
  items?: Array<dxFileManagerContextMenuItem | FileManagerPredefinedContextMenuItem>;
}>
const _componentContextMenu = (props: IContextMenuProps) => {
  return React.createElement(NestedOption<IContextMenuProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "contextMenu",
      ExpectedChildren: {
        contextMenuItem: { optionName: "items", isCollectionItem: true },
        item: { optionName: "items", isCollectionItem: true }
      },
    },
  });
};

const ContextMenu = Object.assign<typeof _componentContextMenu, NestedComponentMeta>(_componentContextMenu, {
  componentType: "option",
});

// owners:
// ContextMenu
// Item
type IContextMenuItemProps = React.PropsWithChildren<{
  beginGroup?: boolean;
  closeMenuOnClick?: boolean;
  disabled?: boolean;
  icon?: string;
  items?: Array<dxFileManagerContextMenuItem>;
  name?: FileManagerPredefinedContextMenuItem | string;
  selectable?: boolean;
  selected?: boolean;
  text?: string;
  visible?: boolean | undefined;
}>
const _componentContextMenuItem = (props: IContextMenuItemProps) => {
  return React.createElement(NestedOption<IContextMenuItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "items",
      IsCollectionItem: true,
      ExpectedChildren: {
        item: { optionName: "items", isCollectionItem: true }
      },
    },
  });
};

const ContextMenuItem = Object.assign<typeof _componentContextMenuItem, NestedComponentMeta>(_componentContextMenuItem, {
  componentType: "option",
});

// owners:
// ItemView
type IDetailsProps = React.PropsWithChildren<{
  columns?: Array<dxFileManagerDetailsColumn | string>;
}>
const _componentDetails = (props: IDetailsProps) => {
  return React.createElement(NestedOption<IDetailsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "details",
      ExpectedChildren: {
        column: { optionName: "columns", isCollectionItem: true }
      },
    },
  });
};

const Details = Object.assign<typeof _componentDetails, NestedComponentMeta>(_componentDetails, {
  componentType: "option",
});

// owners:
// Toolbar
type IFileSelectionItemProps = React.PropsWithChildren<{
  cssClass?: string | undefined;
  disabled?: boolean;
  icon?: string;
  locateInMenu?: LocateInMenuMode;
  location?: ToolbarItemLocation;
  name?: FileManagerPredefinedToolbarItem | string;
  options?: any;
  showText?: ShowTextMode;
  text?: string;
  visible?: boolean | undefined;
  widget?: ToolbarItemComponent;
}>
const _componentFileSelectionItem = (props: IFileSelectionItemProps) => {
  return React.createElement(NestedOption<IFileSelectionItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "fileSelectionItems",
      IsCollectionItem: true,
    },
  });
};

const FileSelectionItem = Object.assign<typeof _componentFileSelectionItem, NestedComponentMeta>(_componentFileSelectionItem, {
  componentType: "option",
});

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
  name?: FileManagerPredefinedContextMenuItem | string | FileManagerPredefinedToolbarItem;
  selectable?: boolean;
  selected?: boolean;
  text?: string;
  visible?: boolean | undefined;
  cssClass?: string | undefined;
  locateInMenu?: LocateInMenuMode;
  location?: ToolbarItemLocation;
  options?: any;
  showText?: ShowTextMode;
  widget?: ToolbarItemComponent;
}>
const _componentItem = (props: IItemProps) => {
  return React.createElement(NestedOption<IItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "items",
      IsCollectionItem: true,
      ExpectedChildren: {
        item: { optionName: "items", isCollectionItem: true }
      },
    },
  });
};

const Item = Object.assign<typeof _componentItem, NestedComponentMeta>(_componentItem, {
  componentType: "option",
});

// owners:
// FileManager
type IItemViewProps = React.PropsWithChildren<{
  details?: Record<string, any> | {
    columns?: Array<dxFileManagerDetailsColumn | string>;
  };
  mode?: FileManagerItemViewMode;
  showFolders?: boolean;
  showParentFolder?: boolean;
}>
const _componentItemView = (props: IItemViewProps) => {
  return React.createElement(NestedOption<IItemViewProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "itemView",
      ExpectedChildren: {
        details: { optionName: "details", isCollectionItem: false }
      },
    },
  });
};

const ItemView = Object.assign<typeof _componentItemView, NestedComponentMeta>(_componentItemView, {
  componentType: "option",
});

// owners:
// FileManager
type INotificationsProps = React.PropsWithChildren<{
  showPanel?: boolean;
  showPopup?: boolean;
}>
const _componentNotifications = (props: INotificationsProps) => {
  return React.createElement(NestedOption<INotificationsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "notifications",
    },
  });
};

const Notifications = Object.assign<typeof _componentNotifications, NestedComponentMeta>(_componentNotifications, {
  componentType: "option",
});

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
const _componentPermissions = (props: IPermissionsProps) => {
  return React.createElement(NestedOption<IPermissionsProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "permissions",
    },
  });
};

const Permissions = Object.assign<typeof _componentPermissions, NestedComponentMeta>(_componentPermissions, {
  componentType: "option",
});

// owners:
// FileManager
type IToolbarProps = React.PropsWithChildren<{
  fileSelectionItems?: Array<dxFileManagerToolbarItem | FileManagerPredefinedToolbarItem>;
  items?: Array<dxFileManagerToolbarItem | FileManagerPredefinedToolbarItem>;
}>
const _componentToolbar = (props: IToolbarProps) => {
  return React.createElement(NestedOption<IToolbarProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "toolbar",
      ExpectedChildren: {
        fileSelectionItem: { optionName: "fileSelectionItems", isCollectionItem: true },
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
  cssClass?: string | undefined;
  disabled?: boolean;
  icon?: string;
  locateInMenu?: LocateInMenuMode;
  location?: ToolbarItemLocation;
  name?: FileManagerPredefinedToolbarItem | string;
  options?: any;
  showText?: ShowTextMode;
  text?: string;
  visible?: boolean | undefined;
  widget?: ToolbarItemComponent;
}>
const _componentToolbarItem = (props: IToolbarItemProps) => {
  return React.createElement(NestedOption<IToolbarItemProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "items",
      IsCollectionItem: true,
    },
  });
};

const ToolbarItem = Object.assign<typeof _componentToolbarItem, NestedComponentMeta>(_componentToolbarItem, {
  componentType: "option",
});

// owners:
// FileManager
type IUploadProps = React.PropsWithChildren<{
  chunkSize?: number;
  maxFileSize?: number;
}>
const _componentUpload = (props: IUploadProps) => {
  return React.createElement(NestedOption<IUploadProps>, {
    ...props,
    elementDescriptor: {
      OptionName: "upload",
    },
  });
};

const Upload = Object.assign<typeof _componentUpload, NestedComponentMeta>(_componentUpload, {
  componentType: "option",
});

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

