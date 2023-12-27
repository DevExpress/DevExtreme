"use client"
import dxFileManager, {
    Properties
} from "devextreme/ui/file_manager";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";
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

class FileManager extends BaseComponent<React.PropsWithChildren<IFileManagerOptions>> {

  public get instance(): dxFileManager {
    return this._instance;
  }

  protected _WidgetClass = dxFileManager;

  protected independentEvents = ["onContentReady","onContextMenuItemClick","onContextMenuShowing","onDirectoryCreated","onDirectoryCreating","onDisposing","onErrorOccurred","onFileUploaded","onFileUploading","onInitialized","onItemCopied","onItemCopying","onItemDeleted","onItemDeleting","onItemDownloading","onItemMoved","onItemMoving","onItemRenamed","onItemRenaming","onSelectedFileOpened","onToolbarItemClick"];

  protected _expectedChildren = {
    contextMenu: { optionName: "contextMenu", isCollectionItem: false },
    itemView: { optionName: "itemView", isCollectionItem: false },
    notifications: { optionName: "notifications", isCollectionItem: false },
    permissions: { optionName: "permissions", isCollectionItem: false },
    toolbar: { optionName: "toolbar", isCollectionItem: false },
    upload: { optionName: "upload", isCollectionItem: false }
  };
}
(FileManager as any).propTypes = {
  accessKey: PropTypes.string,
  activeStateEnabled: PropTypes.bool,
  allowedFileExtensions: PropTypes.array,
  contextMenu: PropTypes.object,
  currentPath: PropTypes.string,
  currentPathKeys: PropTypes.array,
  customizeDetailColumns: PropTypes.func,
  customizeThumbnail: PropTypes.func,
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  focusedItemKey: PropTypes.string,
  focusStateEnabled: PropTypes.bool,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  itemView: PropTypes.object,
  notifications: PropTypes.object,
  onContentReady: PropTypes.func,
  onContextMenuItemClick: PropTypes.func,
  onContextMenuShowing: PropTypes.func,
  onCurrentDirectoryChanged: PropTypes.func,
  onDirectoryCreated: PropTypes.func,
  onDirectoryCreating: PropTypes.func,
  onDisposing: PropTypes.func,
  onErrorOccurred: PropTypes.func,
  onFileUploaded: PropTypes.func,
  onFileUploading: PropTypes.func,
  onFocusedItemChanged: PropTypes.func,
  onInitialized: PropTypes.func,
  onItemCopied: PropTypes.func,
  onItemCopying: PropTypes.func,
  onItemDeleted: PropTypes.func,
  onItemDeleting: PropTypes.func,
  onItemDownloading: PropTypes.func,
  onItemMoved: PropTypes.func,
  onItemMoving: PropTypes.func,
  onItemRenamed: PropTypes.func,
  onItemRenaming: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onSelectedFileOpened: PropTypes.func,
  onSelectionChanged: PropTypes.func,
  onToolbarItemClick: PropTypes.func,
  permissions: PropTypes.object,
  rootFolderName: PropTypes.string,
  rtlEnabled: PropTypes.bool,
  selectedItemKeys: PropTypes.array,
  selectionMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "single",
      "multiple"])
  ]),
  tabIndex: PropTypes.number,
  toolbar: PropTypes.object,
  upload: PropTypes.object,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ])
};


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
class Column extends NestedOption<IColumnProps> {
  public static OptionName = "columns";
  public static IsCollectionItem = true;
}

// owners:
// FileManager
type IContextMenuProps = React.PropsWithChildren<{
  items?: Array<dxFileManagerContextMenuItem | "create" | "upload" | "refresh" | "download" | "move" | "copy" | "rename" | "delete">;
}>
class ContextMenu extends NestedOption<IContextMenuProps> {
  public static OptionName = "contextMenu";
  public static ExpectedChildren = {
    contextMenuItem: { optionName: "items", isCollectionItem: true },
    item: { optionName: "items", isCollectionItem: true }
  };
}

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
class ContextMenuItem extends NestedOption<IContextMenuItemProps> {
  public static OptionName = "items";
  public static IsCollectionItem = true;
}

// owners:
// ItemView
type IDetailsProps = React.PropsWithChildren<{
  columns?: Array<dxFileManagerDetailsColumn | string>;
}>
class Details extends NestedOption<IDetailsProps> {
  public static OptionName = "details";
  public static ExpectedChildren = {
    column: { optionName: "columns", isCollectionItem: true }
  };
}

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
class FileSelectionItem extends NestedOption<IFileSelectionItemProps> {
  public static OptionName = "fileSelectionItems";
  public static IsCollectionItem = true;
}

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
class Item extends NestedOption<IItemProps> {
  public static OptionName = "items";
  public static IsCollectionItem = true;
}

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
class ItemView extends NestedOption<IItemViewProps> {
  public static OptionName = "itemView";
  public static ExpectedChildren = {
    details: { optionName: "details", isCollectionItem: false }
  };
}

// owners:
// FileManager
type INotificationsProps = React.PropsWithChildren<{
  showPanel?: boolean;
  showPopup?: boolean;
}>
class Notifications extends NestedOption<INotificationsProps> {
  public static OptionName = "notifications";
}

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
class Permissions extends NestedOption<IPermissionsProps> {
  public static OptionName = "permissions";
}

// owners:
// FileManager
type IToolbarProps = React.PropsWithChildren<{
  fileSelectionItems?: Array<dxFileManagerToolbarItem | "showNavPane" | "create" | "upload" | "refresh" | "switchView" | "download" | "move" | "copy" | "rename" | "delete" | "clearSelection" | "separator">;
  items?: Array<dxFileManagerToolbarItem | "showNavPane" | "create" | "upload" | "refresh" | "switchView" | "download" | "move" | "copy" | "rename" | "delete" | "clearSelection" | "separator">;
}>
class Toolbar extends NestedOption<IToolbarProps> {
  public static OptionName = "toolbar";
  public static ExpectedChildren = {
    fileSelectionItem: { optionName: "fileSelectionItems", isCollectionItem: true },
    item: { optionName: "items", isCollectionItem: true },
    toolbarItem: { optionName: "items", isCollectionItem: true }
  };
}

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
class ToolbarItem extends NestedOption<IToolbarItemProps> {
  public static OptionName = "items";
  public static IsCollectionItem = true;
}

// owners:
// FileManager
type IUploadProps = React.PropsWithChildren<{
  chunkSize?: number;
  maxFileSize?: number;
}>
class Upload extends NestedOption<IUploadProps> {
  public static OptionName = "upload";
}

export default FileManager;
export {
  FileManager,
  IFileManagerOptions,
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

