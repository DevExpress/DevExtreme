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
} from '../events/index';

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
} from '../core/templates/template';

import {
    HorizontalAlignment,
    SortOrder,
} from '../types/enums';

import {
   ForcedSelectionMode,
   ToolbarItemLocation,
} from '../common';

import {
    GridColumnDataType,
 } from '../common/grids';

interface ActionEventInfo {
    errorCode?: number;
    errorText: string;
    cancel: boolean | PromiseLike<void>;
}

export {
    ForcedSelectionMode,
    GridColumnDataType,
    ToolbarItemLocation,
};

export type FileManagerContextMenuItem = 'create' | 'upload' | 'refresh' | 'download' | 'move' | 'copy' | 'rename' | 'delete';
export type FileManagerItemViewMode = 'details' | 'thumbnails';
export type FileManagerToolbarItem = 'showNavPane' | 'create' | 'upload' | 'refresh' | 'switchView' | 'download' | 'move' | 'copy' | 'rename' | 'delete' | 'clearSelection' | 'separator';
export type FileManagerViewArea = 'navPane' | 'itemView';

/** @public */
export type ContentReadyEvent = EventInfo<dxFileManager>;

/** @public */
export type ContextMenuItemClickEvent = NativeEventInfo<dxFileManager, KeyboardEvent | PointerEvent | MouseEvent> & {
    readonly itemData: any;
    readonly itemElement: DxElement;
    readonly itemIndex: number;
    readonly fileSystemItem?: FileSystemItem;
    readonly viewArea: FileManagerViewArea;
};

/** @public */
export type ContextMenuShowingEvent = Cancelable & NativeEventInfo<dxFileManager, KeyboardEvent | PointerEvent | MouseEvent> & {
    readonly fileSystemItem?: FileSystemItem;
    readonly targetElement?: DxElement;
    readonly viewArea: FileManagerViewArea;
};

/** @public */
export type CurrentDirectoryChangedEvent = EventInfo<dxFileManager> & {
    readonly directory: FileSystemItem;
};

/** @public */
export type DisposingEvent = EventInfo<dxFileManager>;

/** @public */
export type ErrorOccurredEvent = EventInfo<dxFileManager> & {
    readonly errorCode?: number;
    errorText?: string;
    readonly fileSystemItem?: FileSystemItem;
};

/** @public */
export type FocusedItemChangedEvent = EventInfo<dxFileManager> & {
    readonly item?: FileSystemItem;
    readonly itemElement?: DxElement;
};

/** @public */
export type InitializedEvent = InitializedEventInfo<dxFileManager>;

/** @public */
export type OptionChangedEvent = EventInfo<dxFileManager> & ChangedOptionInfo;

/** @public */
export type SelectedFileOpenedEvent = EventInfo<dxFileManager> & {
    readonly file: FileSystemItem;
};

/** @public */
export type SelectionChangedEvent = EventInfo<dxFileManager> & {
    readonly currentSelectedItemKeys: Array<string>;
    readonly currentDeselectedItemKeys: Array<string>;
    readonly selectedItems: Array<FileSystemItem>;
    readonly selectedItemKeys: Array<string>;
};

/** @public */
export type ToolbarItemClickEvent = NativeEventInfo<dxFileManager, PointerEvent | MouseEvent> & {
    readonly itemData: any;
    readonly itemElement: DxElement;
    readonly itemIndex: number;
};

/** @public */
export type DirectoryCreatingEvent = EventInfo<dxFileManager> & ActionEventInfo & {
    readonly parentDirectory: FileSystemItem;
    readonly name: string;
};

/** @public */
export type DirectoryCreatedEvent = EventInfo<dxFileManager> & {
    readonly parentDirectory: FileSystemItem;
    readonly name: string;
};

/** @public */
export type ItemRenamingEvent = EventInfo<dxFileManager> & ActionEventInfo & {
    readonly item: FileSystemItem;
    readonly newName: string;
};

/** @public */
export type ItemRenamedEvent = EventInfo<dxFileManager> & {
    readonly sourceItem: FileSystemItem;
    readonly itemName: string;
};

/** @public */
export type ItemMovingEvent = EventInfo<dxFileManager> & ActionEventInfo & {
    readonly item: FileSystemItem;
    readonly destinationDirectory: FileSystemItem;
};

/** @public */
export type ItemMovedEvent = EventInfo<dxFileManager> & {
    readonly sourceItem: FileSystemItem;
    readonly parentDirectory: FileSystemItem;
    readonly itemName: string;
    readonly itemPath: string;
};

/** @public */
export type ItemCopyingEvent = EventInfo<dxFileManager> & ActionEventInfo & {
    readonly item: FileSystemItem;
    readonly destinationDirectory: FileSystemItem;
};

/** @public */
export type ItemCopiedEvent = EventInfo<dxFileManager> & {
    readonly sourceItem: FileSystemItem;
    readonly parentDirectory: FileSystemItem;
    readonly itemName: string;
    readonly itemPath: string;
};

/** @public */
export type ItemDeletingEvent = EventInfo<dxFileManager> & ActionEventInfo & {
    readonly item: FileSystemItem;
};

/** @public */
export type ItemDeletedEvent = EventInfo<dxFileManager> & {
    readonly item: FileSystemItem;
};

/** @public */
export type FileUploadingEvent = EventInfo<dxFileManager> & ActionEventInfo & {
    readonly fileData: File;
    readonly destinationDirectory: FileSystemItem;
};

/** @public */
export type FileUploadedEvent = EventInfo<dxFileManager> & {
    readonly fileData: File;
    readonly parentDirectory: FileSystemItem;
};

/** @public */
export type ItemDownloadingEvent = EventInfo<dxFileManager> & ActionEventInfo & {
    readonly item: FileSystemItem;
};

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
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
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxFileManager
     * @type_function_param1_field itemData:object
     * @type_function_param1_field event:event
     * @type_function_param1_field viewArea:Enums.FileManagerViewArea
     * @action
     * @public
     */
    onContextMenuItemClick?: ((e: ContextMenuItemClickEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxFileManager
     * @type_function_param1_field event:event
     * @type_function_param1_field viewArea:Enums.FileManagerViewArea
     * @action
     * @public
     */
    onContextMenuShowing?: ((e: ContextMenuShowingEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxFileManager
     * @default null
     * @action
     * @public
     */
    onCurrentDirectoryChanged?: ((e: CurrentDirectoryChangedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxFileManager
     * @default null
     * @action
     * @public
     */
    onSelectedFileOpened?: ((e: SelectedFileOpenedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxFileManager
     * @type_function_param1_field currentSelectedItemKeys:Array<string>
     * @type_function_param1_field currentDeselectedItemKeys:Array<string>
     * @type_function_param1_field selectedItems:Array<FileSystemItem>
     * @type_function_param1_field selectedItemKeys:Array<string>
     * @default null
     * @action
     * @public
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxFileManager
     * @type_function_param1_field itemData:object
     * @type_function_param1_field event:event
     * @action
     * @public
     */
    onToolbarItemClick?: ((e: ToolbarItemClickEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxFileManager
     * @default null
     * @action
     * @public
     */
    onFocusedItemChanged?: ((e: FocusedItemChangedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxFileManager
     * @default null
     * @action
     * @public
     */
    onErrorOccurred?: ((e: ErrorOccurredEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxFileManager
     * @type_function_param1_field cancel:boolean|Promise<void>
     * @default null
     * @action
     * @public
     */
    onDirectoryCreating?: ((e: DirectoryCreatingEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxFileManager
     * @default null
     * @action
     * @public
     */
    onDirectoryCreated?: ((e: DirectoryCreatedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxFileManager
     * @type_function_param1_field cancel:boolean|Promise<void>
     * @default null
     * @action
     * @public
     */
    onItemRenaming?: ((e: ItemRenamingEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxFileManager
     * @default null
     * @action
     * @public
     */
    onItemRenamed?: ((e: ItemRenamedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxFileManager
     * @type_function_param1_field cancel:boolean|Promise<void>
     * @default null
     * @action
     * @public
     */
    onItemMoving?: ((e: ItemMovingEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxFileManager
     * @default null
     * @action
     * @public
     */
    onItemMoved?: ((e: ItemMovedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxFileManager
     * @type_function_param1_field cancel:boolean|Promise<void>
     * @default null
     * @action
     * @public
     */
    onItemCopying?: ((e: ItemCopyingEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxFileManager
     * @default null
     * @action
     * @public
     */
    onItemCopied?: ((e: ItemCopiedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxFileManager
     * @type_function_param1_field cancel:boolean|Promise<void>
     * @default null
     * @action
     * @public
     */
    onItemDeleting?: ((e: ItemDeletingEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxFileManager
     * @default null
     * @action
     * @public
     */
    onItemDeleted?: ((e: ItemDeletedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxFileManager
     * @type_function_param1_field cancel:boolean|Promise<void>
     * @default null
     * @action
     * @public
     */
    onFileUploading?: ((e: FileUploadingEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxFileManager
     * @default null
     * @action
     * @public
     */
    onFileUploaded?: ((e: FileUploadedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field component:dxFileManager
     * @type_function_param1_field cancel:boolean|Promise<void>
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
    selectionMode?: ForcedSelectionMode;
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
     * @type Array<dxFileManagerContextMenuItem,Enums.FileManagerContextMenuItem>
     * @default [ "create", "upload", "rename", "move", "copy", "delete", "refresh", "download" ]
     * @public
     */
    items?: Array<ContextMenuItem | FileManagerContextMenuItem>;
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
    name?: FileManagerContextMenuItem | string;
    /**
     * @docid
     * @default undefined
     * @public
     */
    visible?: boolean;
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
     * @type Array<dxFileManagerToolbarItem,Enums.FileManagerToolbarItem>
     * @default [ "download", "separator", "move", "copy", "rename", "separator", "delete", "clearSelection", { name: "separator", location: "after" }, "refresh" ]
     * @public
     */
    fileSelectionItems?: Array<ToolbarItem | FileManagerToolbarItem>;
    /**
     * @docid
     * @type Array<dxFileManagerToolbarItem,Enums.FileManagerToolbarItem>
     * @default [ "showNavPane", "create", "upload", "switchView", { name: "separator", location: "after" }, "refresh" ]
     * @public
     */
    items?: Array<ToolbarItem | FileManagerToolbarItem >;
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
    name?: FileManagerToolbarItem | string;
    /**
     * @docid
     * @default undefined
     * @public
     */
    visible?: boolean;
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
     * @type Enums.HorizontalAlignment
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
    caption?: string;
    /**
     * @docid
     * @default undefined
     * @public
     */
    cssClass?: string;
    /**
     * @docid
     * @default undefined
     * @public
     */
    dataField?: string;
    /**
     * @docid
     * @default undefined
     * @public
     */
    dataType?: GridColumnDataType;
    /**
     * @docid
     * @default undefined
     * @public
     */
    hidingPriority?: number;
    /**
     * @docid
     * @default undefined
     * @public
     */
    sortIndex?: number;
    /**
     * @docid
     * @type Enums.SortOrder
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
    visibleIndex?: number;
    /**
     * @docid
     * @default undefined
     * @public
     */
    width?: number | string;
}

/** @public */
export type Properties = dxFileManagerOptions;

/** @deprecated use Properties instead */
export type Options = dxFileManagerOptions;
