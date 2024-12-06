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
 * @docid
 * @hidden
 */
export interface ActionEventInfo {
    /** @docid */
    errorCode?: number;
    /** @docid */
    errorText: string;
    /**
     * @docid
     * @type boolean|Promise<void>
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

export type FileManagerItemViewMode = 'details' | 'thumbnails';
/** @public */
export type FileManagerPredefinedContextMenuItem = 'create' | 'upload' | 'refresh' | 'download' | 'move' | 'copy' | 'rename' | 'delete';
/** @public */
export type FileManagerPredefinedToolbarItem = 'showNavPane' | 'create' | 'upload' | 'refresh' | 'switchView' | 'download' | 'move' | 'copy' | 'rename' | 'delete' | 'clearSelection' | 'separator';
export type FileManagerViewArea = 'navPane' | 'itemView';

/**
 * @docid _ui_file_manager_ContentReadyEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ContentReadyEvent = EventInfo<dxFileManager>;

/**
 * @docid _ui_file_manager_ContextMenuItemClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type ContextMenuItemClickEvent = NativeEventInfo<dxFileManager, KeyboardEvent | PointerEvent | MouseEvent> & {
    /**
     * @docid _ui_file_manager_ContextMenuItemClickEvent.itemData
     * @type object
     */
    readonly itemData: any;
    /** @docid _ui_file_manager_ContextMenuItemClickEvent.itemElement */
    readonly itemElement: DxElement;
    /** @docid _ui_file_manager_ContextMenuItemClickEvent.itemIndex */
    readonly itemIndex: number;
    /** @docid _ui_file_manager_ContextMenuItemClickEvent.fileSystemItem */
    readonly fileSystemItem?: FileSystemItem;
    /**
     * @docid _ui_file_manager_ContextMenuItemClickEvent.viewArea
     * @type Enums.FileManagerViewArea
     */
    readonly viewArea: FileManagerViewArea;
};

/**
 * @docid _ui_file_manager_ContextMenuShowingEvent
 * @public
 * @type object
 * @inherits Cancelable,NativeEventInfo
 */
export type ContextMenuShowingEvent = Cancelable & NativeEventInfo<dxFileManager, KeyboardEvent | PointerEvent | MouseEvent> & {
    /** @docid _ui_file_manager_ContextMenuShowingEvent.fileSystemItem */
    readonly fileSystemItem?: FileSystemItem;
    /** @docid _ui_file_manager_ContextMenuShowingEvent.targetElement */
    readonly targetElement?: DxElement;
    /**
     * @docid _ui_file_manager_ContextMenuShowingEvent.viewArea
     * @type Enums.FileManagerViewArea
     */
    readonly viewArea: FileManagerViewArea;
};

/**
 * @docid _ui_file_manager_CurrentDirectoryChangedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type CurrentDirectoryChangedEvent = EventInfo<dxFileManager> & {
    /** @docid _ui_file_manager_CurrentDirectoryChangedEvent.directory */
    readonly directory: FileSystemItem;
};

/**
 * @docid _ui_file_manager_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxFileManager>;

/**
 * @docid _ui_file_manager_ErrorOccurredEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ErrorOccurredEvent = EventInfo<dxFileManager> & {
    /** @docid _ui_file_manager_ErrorOccurredEvent.errorCode */
    readonly errorCode?: number;
    /** @docid _ui_file_manager_ErrorOccurredEvent.errorText */
    errorText?: string;
    /** @docid _ui_file_manager_ErrorOccurredEvent.fileSystemItem */
    readonly fileSystemItem?: FileSystemItem;
};

/**
 * @docid _ui_file_manager_FocusedItemChangedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type FocusedItemChangedEvent = EventInfo<dxFileManager> & {
    /** @docid _ui_file_manager_FocusedItemChangedEvent.item */
    readonly item?: FileSystemItem;
    /** @docid _ui_file_manager_FocusedItemChangedEvent.itemElement */
    readonly itemElement?: DxElement;
};

/**
 * @docid _ui_file_manager_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxFileManager>;

/**
 * @docid _ui_file_manager_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxFileManager> & ChangedOptionInfo;

/**
 * @docid _ui_file_manager_SelectedFileOpenedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type SelectedFileOpenedEvent = EventInfo<dxFileManager> & {
    /** @docid _ui_file_manager_SelectedFileOpenedEvent.file */
    readonly file: FileSystemItem;
};

/**
 * @docid _ui_file_manager_SelectionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type SelectionChangedEvent = EventInfo<dxFileManager> & {
    /**
     * @docid _ui_file_manager_SelectionChangedEvent.currentSelectedItemKeys
     * @type Array<string>
     */
    readonly currentSelectedItemKeys: Array<string>;
    /**
     * @docid _ui_file_manager_SelectionChangedEvent.currentDeselectedItemKeys
     * @type Array<string>
     */
    readonly currentDeselectedItemKeys: Array<string>;
    /**
     * @docid _ui_file_manager_SelectionChangedEvent.selectedItems
     * @type Array<FileSystemItem>
     */
    readonly selectedItems: Array<FileSystemItem>;
    /**
     * @docid _ui_file_manager_SelectionChangedEvent.selectedItemKeys
     * @type Array<string>
     */
    readonly selectedItemKeys: Array<string>;
};

/**
 * @docid _ui_file_manager_ToolbarItemClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type ToolbarItemClickEvent = NativeEventInfo<dxFileManager, PointerEvent | MouseEvent> & {
    /**
     * @docid _ui_file_manager_ToolbarItemClickEvent.itemData
     * @type object
     */
    readonly itemData: any;
    /** @docid _ui_file_manager_ToolbarItemClickEvent.itemElement */
    readonly itemElement: DxElement;
    /** @docid _ui_file_manager_ToolbarItemClickEvent.itemIndex */
    readonly itemIndex: number;
};

/**
 * @docid _ui_file_manager_DirectoryCreatingEvent
 * @public
 * @type object
 * @inherits EventInfo,ActionEventInfo
 */
export type DirectoryCreatingEvent = EventInfo<dxFileManager> & ActionEventInfo & {
    /** @docid _ui_file_manager_DirectoryCreatingEvent.parentDirectory */
    readonly parentDirectory: FileSystemItem;
    /** @docid _ui_file_manager_DirectoryCreatingEvent.name */
    readonly name: string;
};

/**
 * @docid _ui_file_manager_DirectoryCreatedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DirectoryCreatedEvent = EventInfo<dxFileManager> & {
    /** @docid _ui_file_manager_DirectoryCreatedEvent.parentDirectory */
    readonly parentDirectory: FileSystemItem;
    /** @docid _ui_file_manager_DirectoryCreatedEvent.name */
    readonly name: string;
};

/**
 * @docid _ui_file_manager_ItemRenamingEvent
 * @public
 * @type object
 * @inherits EventInfo,ActionEventInfo
 */
export type ItemRenamingEvent = EventInfo<dxFileManager> & ActionEventInfo & {
    /** @docid _ui_file_manager_ItemRenamingEvent.item */
    readonly item: FileSystemItem;
    /** @docid _ui_file_manager_ItemRenamingEvent.newName */
    readonly newName: string;
};

/**
 * @docid _ui_file_manager_ItemRenamedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ItemRenamedEvent = EventInfo<dxFileManager> & {
    /** @docid _ui_file_manager_ItemRenamedEvent.sourceItem */
    readonly sourceItem: FileSystemItem;
    /** @docid _ui_file_manager_ItemRenamedEvent.itemName */
    readonly itemName: string;
};

/**
 * @docid _ui_file_manager_ItemMovingEvent
 * @public
 * @type object
 * @inherits EventInfo,ActionEventInfo
 */
export type ItemMovingEvent = EventInfo<dxFileManager> & ActionEventInfo & {
    /** @docid _ui_file_manager_ItemMovingEvent.item */
    readonly item: FileSystemItem;
    /** @docid _ui_file_manager_ItemMovingEvent.destinationDirectory */
    readonly destinationDirectory: FileSystemItem;
};

/**
 * @docid _ui_file_manager_ItemMovedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ItemMovedEvent = EventInfo<dxFileManager> & {
    /** @docid _ui_file_manager_ItemMovedEvent.sourceItem */
    readonly sourceItem: FileSystemItem;
    /** @docid _ui_file_manager_ItemMovedEvent.parentDirectory */
    readonly parentDirectory: FileSystemItem;
    /** @docid _ui_file_manager_ItemMovedEvent.itemName */
    readonly itemName: string;
    /** @docid _ui_file_manager_ItemMovedEvent.itemPath */
    readonly itemPath: string;
};

/**
 * @docid _ui_file_manager_ItemCopyingEvent
 * @public
 * @type object
 * @inherits EventInfo,ActionEventInfo
 */
export type ItemCopyingEvent = EventInfo<dxFileManager> & ActionEventInfo & {
    /** @docid _ui_file_manager_ItemCopyingEvent.item */
    readonly item: FileSystemItem;
    /** @docid _ui_file_manager_ItemCopyingEvent.destinationDirectory */
    readonly destinationDirectory: FileSystemItem;
};

/**
 * @docid _ui_file_manager_ItemCopiedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ItemCopiedEvent = EventInfo<dxFileManager> & {
    /** @docid _ui_file_manager_ItemCopiedEvent.sourceItem */
    readonly sourceItem: FileSystemItem;
    /** @docid _ui_file_manager_ItemCopiedEvent.parentDirectory */
    readonly parentDirectory: FileSystemItem;
    /** @docid _ui_file_manager_ItemCopiedEvent.itemName */
    readonly itemName: string;
    /** @docid _ui_file_manager_ItemCopiedEvent.itemPath */
    readonly itemPath: string;
};

/**
 * @docid _ui_file_manager_ItemDeletingEvent
 * @public
 * @type object
 * @inherits EventInfo,ActionEventInfo
 */
export type ItemDeletingEvent = EventInfo<dxFileManager> & ActionEventInfo & {
    /** @docid _ui_file_manager_ItemDeletingEvent.item */
    readonly item: FileSystemItem;
};

/**
 * @docid _ui_file_manager_ItemDeletedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ItemDeletedEvent = EventInfo<dxFileManager> & {
    /** @docid _ui_file_manager_ItemDeletedEvent.item */
    readonly item: FileSystemItem;
};

/**
 * @docid _ui_file_manager_FileUploadingEvent
 * @public
 * @type object
 * @inherits EventInfo,ActionEventInfo
 */
export type FileUploadingEvent = EventInfo<dxFileManager> & ActionEventInfo & {
    /** @docid _ui_file_manager_FileUploadingEvent.fileData */
    readonly fileData: File;
    /** @docid _ui_file_manager_FileUploadingEvent.destinationDirectory */
    readonly destinationDirectory: FileSystemItem;
};

/**
 * @docid _ui_file_manager_FileUploadedEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type FileUploadedEvent = EventInfo<dxFileManager> & {
    /** @docid _ui_file_manager_FileUploadedEvent.fileData */
    readonly fileData: File;
    /** @docid _ui_file_manager_FileUploadedEvent.parentDirectory */
    readonly parentDirectory: FileSystemItem;
};

/**
 * @docid _ui_file_manager_ItemDownloadingEvent
 * @public
 * @type object
 * @inherits EventInfo,ActionEventInfo
 */
export type ItemDownloadingEvent = EventInfo<dxFileManager> & ActionEventInfo & {
    /** @docid _ui_file_manager_ItemDownloadingEvent.item */
    readonly item: FileSystemItem;
};

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
 */
export interface dxFileManagerOptions extends WidgetOptions<dxFileManager> {
    /**
     * @docid
     * @default []
     * @public
     */
    allowedFileExtensions?: Array<string>;
    /**
     * @docid
     * @public
     */
    contextMenu?: dxFileManagerContextMenu;
    /**
     * @docid
     * @default ""
     * @public
     */
    currentPath?: string;
    /**
     * @docid
     * @default []
     * @public
     */
    currentPathKeys?: Array<string>;
    /**
     * @docid
     * @public
     */
    customizeDetailColumns?: ((columns: Array<dxFileManagerDetailsColumn>) => Array<dxFileManagerDetailsColumn>);
    /**
     * @docid
     * @public
     */
    customizeThumbnail?: ((fileSystemItem: FileSystemItem) => string);
    /**
     * @docid
     * @default null
     * @public
     */
    fileSystemProvider?: any;
    /**
     * @docid
     * @default null
     * @public
     */
    itemView?: {
      /**
       * @docid
       */
      details?: {
        /**
         * @docid
         * @default ["thumbnail", "name", "dateModified", "size"]
         */
        columns?: Array<dxFileManagerDetailsColumn | string>;
      };
      /**
       * @docid
       * @default "details"
       */
      mode?: FileManagerItemViewMode;
      /**
       * @docid
       * @default true
       */
      showFolders?: boolean;
      /**
       * @docid
       * @default true
       */
      showParentFolder?: boolean;
    };
    /**
     * @docid
     * @public
     */
    notifications?: {
      /**
       * @docid
       * @default true
       */
      showPanel?: boolean;
      /**
       * @docid
       * @default true
       */
      showPopup?: boolean;
    };
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/file_manager:ContextMenuItemClickEvent}
     * @action
     * @public
     */
    onContextMenuItemClick?: ((e: ContextMenuItemClickEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/file_manager:ContextMenuShowingEvent}
     * @action
     * @public
     */
    onContextMenuShowing?: ((e: ContextMenuShowingEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/file_manager:CurrentDirectoryChangedEvent}
     * @default null
     * @action
     * @public
     */
    onCurrentDirectoryChanged?: ((e: CurrentDirectoryChangedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/file_manager:SelectedFileOpenedEvent}
     * @default null
     * @action
     * @public
     */
    onSelectedFileOpened?: ((e: SelectedFileOpenedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/file_manager:SelectionChangedEvent}
     * @default null
     * @action
     * @public
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/file_manager:ToolbarItemClickEvent}
     * @action
     * @public
     */
    onToolbarItemClick?: ((e: ToolbarItemClickEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/file_manager:FocusedItemChangedEvent}
     * @default null
     * @action
     * @public
     */
    onFocusedItemChanged?: ((e: FocusedItemChangedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/file_manager:ErrorOccurredEvent}
     * @default null
     * @action
     * @public
     */
    onErrorOccurred?: ((e: ErrorOccurredEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/file_manager:DirectoryCreatingEvent}
     * @default null
     * @action
     * @public
     */
    onDirectoryCreating?: ((e: DirectoryCreatingEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/file_manager:DirectoryCreatedEvent}
     * @default null
     * @action
     * @public
     */
    onDirectoryCreated?: ((e: DirectoryCreatedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/file_manager:ItemRenamingEvent}
     * @default null
     * @action
     * @public
     */
    onItemRenaming?: ((e: ItemRenamingEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/file_manager:ItemRenamedEvent}
     * @default null
     * @action
     * @public
     */
    onItemRenamed?: ((e: ItemRenamedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/file_manager:ItemMovingEvent}
     * @default null
     * @action
     * @public
     */
    onItemMoving?: ((e: ItemMovingEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/file_manager:ItemMovedEvent}
     * @default null
     * @action
     * @public
     */
    onItemMoved?: ((e: ItemMovedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/file_manager:ItemCopyingEvent}
     * @default null
     * @action
     * @public
     */
    onItemCopying?: ((e: ItemCopyingEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/file_manager:ItemCopiedEvent}
     * @default null
     * @action
     * @public
     */
    onItemCopied?: ((e: ItemCopiedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/file_manager:ItemDeletingEvent}
     * @default null
     * @action
     * @public
     */
    onItemDeleting?: ((e: ItemDeletingEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/file_manager:ItemDeletedEvent}
     * @default null
     * @action
     * @public
     */
    onItemDeleted?: ((e: ItemDeletedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/file_manager:FileUploadingEvent}
     * @default null
     * @action
     * @public
     */
    onFileUploading?: ((e: FileUploadingEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/file_manager:FileUploadedEvent}
     * @default null
     * @action
     * @public
     */
    onFileUploaded?: ((e: FileUploadedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:{ui/file_manager:ItemDownloadingEvent}
     * @default null
     * @action
     * @public
     */
    onItemDownloading?: ((e: ItemDownloadingEvent) => void);
    /**
     * @docid
     * @public
     */
    permissions?: {
      /**
       * @docid
       * @default false
       */
      copy?: boolean;
      /**
       * @docid
       * @default false
       */
      create?: boolean;
      /**
       * @docid
       * @default false
       */
      download?: boolean;
      /**
       * @docid
       * @default false
       */
      move?: boolean;
      /**
       * @docid
       * @default false
       */
      delete?: boolean;
      /**
       * @docid
       * @default false
       */
      rename?: boolean;
      /**
       * @docid
       * @default false
       */
      upload?: boolean;
    };
    /**
     * @docid
     * @default "Files"
     * @public
     */
    rootFolderName?: string;
    /**
     * @docid
     * @default "multiple"
     * @public
     */
    selectionMode?: SingleOrMultiple;
    /**
     * @docid
     * @default []
     * @public
     */
    selectedItemKeys?: Array<string>;
    /**
     * @docid
     * @default null
     * @public
     */
    focusedItemKey?: string;
    /**
     * @docid
     * @public
     */
    toolbar?: dxFileManagerToolbar;
    /**
     * @docid
     * @public
     */
    upload?: {
      /**
       * @docid
       * @default 0
       */
      maxFileSize?: number;
      /**
       * @docid
       * @default 200000
       */
      chunkSize?: number;
    };
}
/**
 * @docid
 * @inherits Widget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxFileManager extends Widget<dxFileManagerOptions> {
    /**
     * @docid
     * @publicName getCurrentDirectory()
     * @return object
     * @public
     */
    getCurrentDirectory(): any;
    /**
     * @docid
     * @publicName getSelectedItems()
     * @return Array<object>
     * @public
     */
    getSelectedItems(): Array<any>;
    /**
     * @docid
     * @publicName refresh()
     * @return Promise<any>
     * @public
     */
    refresh(): DxPromise<any>;
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxFileManagerContextMenu {
    /**
     * @docid
     * @type Array<dxFileManagerContextMenuItem,Enums.FileManagerPredefinedContextMenuItem>
     * @default [ "create", "upload", "rename", "move", "copy", "delete", "refresh", "download" ]
     * @public
     */
    items?: Array<ContextMenuItem | FileManagerPredefinedContextMenuItem>;
}

/**
 * @public
 * @namespace DevExpress.ui.dxFileManager
 */
export type ContextMenuItem = dxFileManagerContextMenuItem;

/**
 * @deprecated Use ContextMenuItem instead
 * @namespace DevExpress.ui
 */
export interface dxFileManagerContextMenuItem extends dxContextMenuItem {
    /**
     * @docid
     * @public
     * @type Array<dxFileManagerContextMenuItem>
     */
    items?: Array<ContextMenuItem>;
    /**
     * @docid
     * @public
     */
    name?: FileManagerPredefinedContextMenuItem | string;
    /**
     * @docid
     * @default undefined
     * @public
     */
    visible?: boolean | undefined;
    /**
     * @docid
     * @hidden
     */
    template?: template | (() => string | UserDefinedElement);
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxFileManagerToolbar {
    /**
     * @docid
     * @type Array<dxFileManagerToolbarItem,Enums.FileManagerPredefinedToolbarItem>
     * @default [ "download", "separator", "move", "copy", "rename", "separator", "delete", "clearSelection", { name: "separator", location: "after" }, "refresh" ]
     * @public
     */
    fileSelectionItems?: Array<ToolbarItem | FileManagerPredefinedToolbarItem>;
    /**
     * @docid
     * @type Array<dxFileManagerToolbarItem,Enums.FileManagerPredefinedToolbarItem>
     * @default [ "showNavPane", "create", "upload", "switchView", { name: "separator", location: "after" }, "refresh" ]
     * @public
     */
    items?: Array<ToolbarItem | FileManagerPredefinedToolbarItem >;
}

/**
 * @public
 * @namespace DevExpress.ui.dxFileManager
 */
export type ToolbarItem = dxFileManagerToolbarItem;

/**
 * @deprecated Use ToolbarItem instead
 * @namespace DevExpress.ui
 */
export interface dxFileManagerToolbarItem extends dxToolbarItem {
    /**
     * @docid
     * @default ""
     * @public
     */
    icon?: string;
    /**
     * @docid
     * @default "before"
     * @public
     */
    location?: ToolbarItemLocation;
    /**
     * @docid
     * @public
     */
    name?: FileManagerPredefinedToolbarItem | string;
    /**
     * @docid
     * @default undefined
     * @public
     */
    visible?: boolean | undefined;
    /**
     * @docid
     * @hidden
     */
    html?: string;
    /**
     * @docid
     * @hidden
     */
    template?: template | (() => string | UserDefinedElement);
    /**
     * @docid
     * @hidden
     */
    menuItemTemplate?: template | (() => string | UserDefinedElement);
}

/**
 * @docid
 * @type object
 * @namespace DevExpress.ui
 */
export interface dxFileManagerDetailsColumn {
    /**
     * @docid
     * @type Enums.HorizontalAlignment | undefined
     * @default undefined
     * @acceptValues undefined
     * @public
     */
    alignment?: HorizontalAlignment | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    caption?: string | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    cssClass?: string | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    dataField?: string | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    dataType?: DataType | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    hidingPriority?: number | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    sortIndex?: number | undefined;
    /**
     * @docid
     * @type Enums.SortOrder | undefined
     * @default undefined
     * @acceptValues undefined
     * @public
     */
    sortOrder?: SortOrder | undefined;
    /**
     * @docid
     * @default true
     * @public
     */
    visible?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    visibleIndex?: number | undefined;
    /**
     * @docid
     * @default undefined
     * @public
     */
    width?: number | string | undefined;
}

/** @public */
export type Properties = dxFileManagerOptions;

/** @deprecated use Properties instead */
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
