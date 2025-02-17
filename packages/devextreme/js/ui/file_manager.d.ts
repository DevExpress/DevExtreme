import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    DxPromise,
} from '../core/utils/deferred';

import {
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import FileSystemItem from '../file_management/file_system_item';

import {
    Item as dxContextMenuItem,
} from './context_menu';

import {
    Item as dxToolbarItem,
} from './toolbar';

import Widget, {
    WidgetOptions,
} from './widget/ui.widget';

import {
    template,
    DataType,
    SingleOrMultiple,
    HorizontalAlignment,
    SortOrder,
    ToolbarItemLocation,
} from '../common';

/**
 * 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface ActionEventInfo {
    /**
     * 
     */
    errorCode?: number;
    /**
     * 
     */
    errorText: string;
    /**
     * 
     */
    cancel: boolean | PromiseLike<void>;
}

export {
    DataType,
    SingleOrMultiple,
    HorizontalAlignment,
    SortOrder,
    ToolbarItemLocation,
};

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type FileManagerItemViewMode = 'details' | 'thumbnails';
export type FileManagerPredefinedContextMenuItem = 'create' | 'upload' | 'refresh' | 'download' | 'move' | 'copy' | 'rename' | 'delete';
export type FileManagerPredefinedToolbarItem = 'showNavPane' | 'create' | 'upload' | 'refresh' | 'switchView' | 'download' | 'move' | 'copy' | 'rename' | 'delete' | 'clearSelection' | 'separator';
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type FileManagerViewArea = 'navPane' | 'itemView';

/**
 * The type of the contentReady event handler&apos;s argument.
 */
export type ContentReadyEvent = EventInfo<dxFileManager>;

/**
 * The type of the contextMenuItemClick event handler&apos;s argument.
 */
export type ContextMenuItemClickEvent = NativeEventInfo<dxFileManager, KeyboardEvent | PointerEvent | MouseEvent> & {
    /**
     * 
     */
    readonly itemData: any;
    /**
     * 
     */
    readonly itemElement: DxElement;
    /**
     * 
     */
    readonly itemIndex: number;
    /**
     * 
     */
    readonly fileSystemItem?: FileSystemItem;
    /**
     * 
     */
    readonly viewArea: FileManagerViewArea;
};

/**
 * The type of the contextMenuShowing event handler&apos;s argument.
 */
export type ContextMenuShowingEvent = Cancelable & NativeEventInfo<dxFileManager, KeyboardEvent | PointerEvent | MouseEvent> & {
    /**
     * 
     */
    readonly fileSystemItem?: FileSystemItem;
    /**
     * 
     */
    readonly targetElement?: DxElement;
    /**
     * 
     */
    readonly viewArea: FileManagerViewArea;
};

/**
 * The type of the currentDirectoryChanged event handler&apos;s argument.
 */
export type CurrentDirectoryChangedEvent = EventInfo<dxFileManager> & {
    /**
     * 
     */
    readonly directory: FileSystemItem;
};

/**
 * The type of the disposing event handler&apos;s argument.
 */
export type DisposingEvent = EventInfo<dxFileManager>;

/**
 * The type of the errorOccurred event handler&apos;s argument.
 */
export type ErrorOccurredEvent = EventInfo<dxFileManager> & {
    /**
     * 
     */
    readonly errorCode?: number;
    /**
     * 
     */
    errorText?: string;
    /**
     * 
     */
    readonly fileSystemItem?: FileSystemItem;
};

/**
 * The type of the focusedItemChanged event handler&apos;s argument.
 */
export type FocusedItemChangedEvent = EventInfo<dxFileManager> & {
    /**
     * 
     */
    readonly item?: FileSystemItem;
    /**
     * 
     */
    readonly itemElement?: DxElement;
};

/**
 * The type of the initialized event handler&apos;s argument.
 */
export type InitializedEvent = InitializedEventInfo<dxFileManager>;

/**
 * The type of the optionChanged event handler&apos;s argument.
 */
export type OptionChangedEvent = EventInfo<dxFileManager> & ChangedOptionInfo;

/**
 * The type of the selectedFileOpened event handler&apos;s argument.
 */
export type SelectedFileOpenedEvent = EventInfo<dxFileManager> & {
    /**
     * 
     */
    readonly file: FileSystemItem;
};

/**
 * The type of the selectionChanged event handler&apos;s argument.
 */
export type SelectionChangedEvent = EventInfo<dxFileManager> & {
    /**
     * 
     */
    readonly currentSelectedItemKeys: Array<string>;
    /**
     * 
     */
    readonly currentDeselectedItemKeys: Array<string>;
    /**
     * 
     */
    readonly selectedItems: Array<FileSystemItem>;
    /**
     * 
     */
    readonly selectedItemKeys: Array<string>;
};

/**
 * The type of the toolbarItemClick event handler&apos;s argument.
 */
export type ToolbarItemClickEvent = NativeEventInfo<dxFileManager, PointerEvent | MouseEvent> & {
    /**
     * 
     */
    readonly itemData: any;
    /**
     * 
     */
    readonly itemElement: DxElement;
    /**
     * 
     */
    readonly itemIndex: number;
};

/**
 * The type of the directoryCreating event handler&apos;s argument.
 */
export type DirectoryCreatingEvent = EventInfo<dxFileManager> & ActionEventInfo & {
    /**
     * 
     */
    readonly parentDirectory: FileSystemItem;
    /**
     * 
     */
    readonly name: string;
};

/**
 * The type of the directoryCreated event handler&apos;s argument.
 */
export type DirectoryCreatedEvent = EventInfo<dxFileManager> & {
    /**
     * 
     */
    readonly parentDirectory: FileSystemItem;
    /**
     * 
     */
    readonly name: string;
};

/**
 * The type of the itemRenaming event handler&apos;s argument.
 */
export type ItemRenamingEvent = EventInfo<dxFileManager> & ActionEventInfo & {
    /**
     * 
     */
    readonly item: FileSystemItem;
    /**
     * 
     */
    readonly newName: string;
};

/**
 * The type of the itemRenamed event handler&apos;s argument.
 */
export type ItemRenamedEvent = EventInfo<dxFileManager> & {
    /**
     * 
     */
    readonly sourceItem: FileSystemItem;
    /**
     * 
     */
    readonly itemName: string;
};

/**
 * The type of the itemMoving event handler&apos;s argument.
 */
export type ItemMovingEvent = EventInfo<dxFileManager> & ActionEventInfo & {
    /**
     * 
     */
    readonly item: FileSystemItem;
    /**
     * 
     */
    readonly destinationDirectory: FileSystemItem;
};

/**
 * The type of the itemMoved event handler&apos;s argument.
 */
export type ItemMovedEvent = EventInfo<dxFileManager> & {
    /**
     * 
     */
    readonly sourceItem: FileSystemItem;
    /**
     * 
     */
    readonly parentDirectory: FileSystemItem;
    /**
     * 
     */
    readonly itemName: string;
    /**
     * 
     */
    readonly itemPath: string;
};

/**
 * The type of the itemCopying event handler&apos;s argument.
 */
export type ItemCopyingEvent = EventInfo<dxFileManager> & ActionEventInfo & {
    /**
     * 
     */
    readonly item: FileSystemItem;
    /**
     * 
     */
    readonly destinationDirectory: FileSystemItem;
};

/**
 * The type of the itemCopied event handler&apos;s argument.
 */
export type ItemCopiedEvent = EventInfo<dxFileManager> & {
    /**
     * 
     */
    readonly sourceItem: FileSystemItem;
    /**
     * 
     */
    readonly parentDirectory: FileSystemItem;
    /**
     * 
     */
    readonly itemName: string;
    /**
     * 
     */
    readonly itemPath: string;
};

/**
 * The type of the itemDeleting event handler&apos;s argument.
 */
export type ItemDeletingEvent = EventInfo<dxFileManager> & ActionEventInfo & {
    /**
     * 
     */
    readonly item: FileSystemItem;
};

/**
 * The type of the itemDeleted event handler&apos;s argument.
 */
export type ItemDeletedEvent = EventInfo<dxFileManager> & {
    /**
     * 
     */
    readonly item: FileSystemItem;
};

/**
 * The type of the fileUploading event handler&apos;s argument.
 */
export type FileUploadingEvent = EventInfo<dxFileManager> & ActionEventInfo & {
    /**
     * 
     */
    readonly fileData: File;
    /**
     * 
     */
    readonly destinationDirectory: FileSystemItem;
};

/**
 * The type of the fileUploaded event handler&apos;s argument.
 */
export type FileUploadedEvent = EventInfo<dxFileManager> & {
    /**
     * 
     */
    readonly fileData: File;
    /**
     * 
     */
    readonly parentDirectory: FileSystemItem;
};

/**
 * The type of the itemDownloading event handler&apos;s argument.
 */
export type ItemDownloadingEvent = EventInfo<dxFileManager> & ActionEventInfo & {
    /**
     * 
     */
    readonly item: FileSystemItem;
};

/**
 * 
 * @deprecated 
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxFileManagerOptions extends WidgetOptions<dxFileManager> {
    /**
     * Specifies the allowed upload file extensions.
     */
    allowedFileExtensions?: Array<string>;
    /**
     * Configures the context menu settings.
     */
    contextMenu?: dxFileManagerContextMenu;
    /**
     * Specifies the path that is used when the FileManager is initialized.
     */
    currentPath?: string;
    /**
     * Specifies an array of path keys to the current location.
     */
    currentPathKeys?: Array<string>;
    /**
     * Customizes columns in details view. Applies only if itemView.mode is &apos;details&apos;.
     */
    customizeDetailColumns?: ((columns: Array<dxFileManagerDetailsColumn>) => Array<dxFileManagerDetailsColumn>);
    /**
     * Allows you to provide custom icons to be used as thumbnails.
     */
    customizeThumbnail?: ((fileSystemItem: FileSystemItem) => string);
    /**
     * Specifies the file system provider.
     */
    fileSystemProvider?: any;
    /**
     * Configures the file and directory view.
     */
    itemView?: {
      /**
       * Configures the &apos;Details&apos; file system representation mode.
       */
      details?: {
        /**
         * Configures the columns.
         */
        columns?: Array<dxFileManagerDetailsColumn | string>;
      };
      /**
       * Specifies the file system representation mode.
       */
      mode?: FileManagerItemViewMode;
      /**
       * Specifies whether to display folders in the view. When this property is false, folders are displayed in the navigation pane only.
       */
      showFolders?: boolean;
      /**
       * Specifies whether to display the parent directory in the view.
       */
      showParentFolder?: boolean;
    };
    /**
     * Configures notification settings.
     */
    notifications?: {
      /**
       * Specifies whether to show the progress panel.
       */
      showPanel?: boolean;
      /**
       * Specifies whether to show the pop-up notification window.
       */
      showPopup?: boolean;
    };
    /**
     * A function that is executed when a context menu item is clicked.
     */
    onContextMenuItemClick?: ((e: ContextMenuItemClickEvent) => void);
    /**
     * A function that is executed before a context menu is displayed.
     */
    onContextMenuShowing?: ((e: ContextMenuShowingEvent) => void);
    /**
     * A function that is executed when the current directory is changed.
     */
    onCurrentDirectoryChanged?: ((e: CurrentDirectoryChangedEvent) => void);
    /**
     * A function that is executed when the selected file is opened.
     */
    onSelectedFileOpened?: ((e: SelectedFileOpenedEvent) => void);
    /**
     * A function that is executed when a file system item is selected or selection is canceled.
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void);
    /**
     * A function that is executed when a toolbar item is clicked.
     */
    onToolbarItemClick?: ((e: ToolbarItemClickEvent) => void);
    /**
     * A function that is executed when the focused item is changed.
     */
    onFocusedItemChanged?: ((e: FocusedItemChangedEvent) => void);
    /**
     * A function that is executed when an error occurs.
     */
    onErrorOccurred?: ((e: ErrorOccurredEvent) => void);
    /**
     * A function that is executed before a directory is created.
     */
    onDirectoryCreating?: ((e: DirectoryCreatingEvent) => void);
    /**
     * A function that is executed when a directory is created.
     */
    onDirectoryCreated?: ((e: DirectoryCreatedEvent) => void);
    /**
     * A function that is executed before a file or directory is renamed.
     */
    onItemRenaming?: ((e: ItemRenamingEvent) => void);
    /**
     * A function that is executed when a file or directory is renamed.
     */
    onItemRenamed?: ((e: ItemRenamedEvent) => void);
    /**
     * A function that is executed before a file or directory is moved.
     */
    onItemMoving?: ((e: ItemMovingEvent) => void);
    /**
     * A function that is executed when a file or directory is moved.
     */
    onItemMoved?: ((e: ItemMovedEvent) => void);
    /**
     * A function that is executed before a file or directory is copied.
     */
    onItemCopying?: ((e: ItemCopyingEvent) => void);
    /**
     * A function that is executed when a file or directory is copied.
     */
    onItemCopied?: ((e: ItemCopiedEvent) => void);
    /**
     * A function that is executed before a file or directory is deleted.
     */
    onItemDeleting?: ((e: ItemDeletingEvent) => void);
    /**
     * A function that is executed when a file or directory is deleted.
     */
    onItemDeleted?: ((e: ItemDeletedEvent) => void);
    /**
     * A function that is executed before the file is uploaded.
     */
    onFileUploading?: ((e: FileUploadingEvent) => void);
    /**
     * A function that is executed when a file is successfully uploaded.
     */
    onFileUploaded?: ((e: FileUploadedEvent) => void);
    /**
     * A function that is executed before a file is downloaded.
     */
    onItemDownloading?: ((e: ItemDownloadingEvent) => void);
    /**
     * Specifies actions that a user is allowed to perform on files and directories.
     */
    permissions?: {
      /**
       * Specifies whether a user is allowed to copy files and directories.
       */
      copy?: boolean;
      /**
       * Specifies whether a user is allowed to create files and directories.
       */
      create?: boolean;
      /**
       * Specifies whether a user is allowed to download files.
       */
      download?: boolean;
      /**
       * Specifies whether a user is allowed to move files and directories.
       */
      move?: boolean;
      /**
       * Specifies whether a user is allowed to delete files and directories.
       */
      delete?: boolean;
      /**
       * Specifies whether a user is allowed to rename files and directories.
       */
      rename?: boolean;
      /**
       * Specifies whether a user is allowed to upload files.
       */
      upload?: boolean;
    };
    /**
     * Specifies the root directory display name.
     */
    rootFolderName?: string;
    /**
     * Specifies whether a user can select a single or multiple files and directories in the item view simultaneously.
     */
    selectionMode?: SingleOrMultiple;
    /**
     * Contains an array of initially or currently selected files and directories&apos; keys.
     */
    selectedItemKeys?: Array<string>;
    /**
     * Specifies a key of the initially or currently focused item.
     */
    focusedItemKey?: string;
    /**
     * Configures toolbar settings.
     */
    toolbar?: dxFileManagerToolbar;
    /**
     * Configures upload settings.
     */
    upload?: {
      /**
       * Specifies the maximum upload file size, in bytes.
       */
      maxFileSize?: number;
      /**
       * Specifies a chunk size, in bytes.
       */
      chunkSize?: number;
    };
}
/**
 * The FileManager is a UI component that allows users to upload, select, and manage files and directories in different file storages.
 */
export default class dxFileManager extends Widget<dxFileManagerOptions> {
    /**
     * Gets the current directory object.
     */
    getCurrentDirectory(): any;
    /**
     * Gets the selected items.
     */
    getSelectedItems(): Array<any>;
    /**
     * Reloads data and repaints the UI component.
     */
    refresh(): DxPromise<any>;
}

/**
 * Configures the context menu.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxFileManagerContextMenu {
    /**
     * Configures context menu items&apos; settings.
     */
    items?: Array<ContextMenuItem | FileManagerPredefinedContextMenuItem>;
}

export type ContextMenuItem = dxFileManagerContextMenuItem;

/**
 * @deprecated Use ContextMenuItem instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxFileManagerContextMenuItem extends dxContextMenuItem {
    /**
     * Configures settings of a context menu item&apos;s subitems.
     */
    items?: Array<ContextMenuItem>;
    /**
     * Specifies the context menu item&apos;s name.
     */
    name?: FileManagerPredefinedContextMenuItem | string;
    /**
     * Specifies the context menu item&apos;s visibility.
     */
    visible?: boolean | undefined;
    /**
     * 
     */
    template?: template | (() => string | UserDefinedElement);
}

/**
 * Configures the toolbar.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxFileManagerToolbar {
    /**
     * Configures settings of the toolbar items that are visible when users select files.
     */
    fileSelectionItems?: Array<ToolbarItem | FileManagerPredefinedToolbarItem>;
    /**
     * Configures toolbar items&apos; settings.
     */
    items?: Array<ToolbarItem | FileManagerPredefinedToolbarItem >;
}

export type ToolbarItem = dxFileManagerToolbarItem;

/**
 * @deprecated Use ToolbarItem instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxFileManagerToolbarItem extends dxToolbarItem {
    /**
     * Specifies the icon to be displayed on the toolbar item.
     */
    icon?: string;
    /**
     * Specifies the toolbar item&apos;s location.
     */
    location?: ToolbarItemLocation;
    /**
     * Specifies the toolbar item&apos;s name.
     */
    name?: FileManagerPredefinedToolbarItem | string;
    /**
     * Specifies the toolbar item&apos;s visibility.
     */
    visible?: boolean | undefined;
    /**
     * 
     */
    html?: string;
    /**
     * 
     */
    template?: template | (() => string | UserDefinedElement);
    /**
     * 
     */
    menuItemTemplate?: template | (() => string | UserDefinedElement);
}

/**
 * Configures the column.
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export interface dxFileManagerDetailsColumn {
    /**
     * Specifies the column alignment.
     */
    alignment?: HorizontalAlignment | undefined;
    /**
     * Specifies the column caption.
     */
    caption?: string | undefined;
    /**
     * Specifies a CSS class to be applied to the column.
     */
    cssClass?: string | undefined;
    /**
     * Specifies which data field provides data for the column.
     */
    dataField?: string | undefined;
    /**
     * Casts column values to a specific data type.
     */
    dataType?: DataType | undefined;
    /**
     * Specifies the order in which columns are hidden when the UI component adapts to the screen or container size.
     */
    hidingPriority?: number | undefined;
    /**
     * Specifies the order in which the column is sorted.
     */
    sortIndex?: number | undefined;
    /**
     * Specifies the sort order of column values.
     */
    sortOrder?: SortOrder | undefined;
    /**
     * Specifies the column visibility.
     */
    visible?: boolean;
    /**
     * Specifies the position of the column in the resulting UI component.
     */
    visibleIndex?: number | undefined;
    /**
     * Specifies the column width.
     */
    width?: number | string | undefined;
}

export type Properties = dxFileManagerOptions;

/**
 * @deprecated use Properties instead
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export type Options = dxFileManagerOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onContextMenuItemClick' | 'onContextMenuShowing' | 'onCurrentDirectoryChanged' | 'onDirectoryCreated' | 'onDirectoryCreating' | 'onErrorOccurred' | 'onFileUploaded' | 'onFileUploading' | 'onFocusedItemChanged' | 'onItemCopied' | 'onItemCopying' | 'onItemDeleted' | 'onItemDeleting' | 'onItemDownloading' | 'onItemMoved' | 'onItemMoving' | 'onItemRenamed' | 'onItemRenaming' | 'onSelectedFileOpened' | 'onSelectionChanged' | 'onToolbarItemClick'>;

/**
* @hidden
*/
type Events = {
/**
 * @docid dxFileManagerOptions.onContentReady
 * @type_function_param1 e:{ui/file_manager:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @docid dxFileManagerOptions.onDisposing
 * @type_function_param1 e:{ui/file_manager:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @docid dxFileManagerOptions.onInitialized
 * @type_function_param1 e:{ui/file_manager:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @docid dxFileManagerOptions.onOptionChanged
 * @type_function_param1 e:{ui/file_manager:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
