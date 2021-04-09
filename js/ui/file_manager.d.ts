import {
    TElement
} from '../core/element';

import {
    TPromise
} from '../core/utils/deferred';

import {
    Cancelable,
    ComponentEvent,
    ComponentNativeEvent,
    ComponentInitializedEvent,
    ChangedOptionInfo
} from '../events/index';

import FileSystemItem from '../file_management/file_system_item';

import {
    dxContextMenuItem
} from './context_menu';

import {
    dxToolbarItem
} from './toolbar';

import Widget, {
    WidgetOptions
} from './widget/ui.widget';

import {
    template
} from '../core/templates/template';


/** @public */
export type ContentReadyEvent = ComponentEvent<dxFileManager>;

/** @public */
export type ContextMenuItemClickEvent = ComponentNativeEvent<dxFileManager> & {
    readonly itemData: any;
    readonly itemElement: TElement;
    readonly itemIndex: number;
    readonly fileSystemItem?: FileSystemItem;
    readonly viewArea: 'navPane' | 'itemView';
}

/** @public */
export type ContextMenuShowingEvent = Cancelable & ComponentNativeEvent<dxFileManager> & {
    readonly fileSystemItem?: FileSystemItem;
    readonly targetElement?: TElement;
    readonly viewArea: 'navPane' | 'itemView';
}

/** @public */
export type CurrentDirectoryChangedEvent = ComponentEvent<dxFileManager> & {
    readonly directory: FileSystemItem;
}

/** @public */
export type DisposingEvent = ComponentEvent<dxFileManager>;

/** @public */
export type ErrorOccurredEvent =  ComponentEvent<dxFileManager> & {
    readonly errorCode?: number;
    errorText?: string;
    readonly fileSystemItem?: FileSystemItem;
}

/** @public */
export type FocusedItemChangedEvent =  ComponentEvent<dxFileManager> & {
    readonly item?: FileSystemItem;
    readonly itemElement?: TElement;
}

/** @public */
export type InitializedEvent = ComponentInitializedEvent<dxFileManager>;


/** @public */
export type OptionChangedEvent = ComponentEvent<dxFileManager> & ChangedOptionInfo;

/** @public */
export type SelectedFileOpenedEvent = ComponentEvent<dxFileManager> & {
    readonly file: FileSystemItem;
}

/** @public */
export type SelectionChangedEvent =  ComponentEvent<dxFileManager> & {
    readonly currentSelectedItemKeys: Array<string>;
    readonly currentDeselectedItemKeys: Array<string>;
    readonly selectedItems: Array<FileSystemItem>;
    readonly selectedItemKeys: Array<string>;
}

/** @public */
export type ToolbarItemClickEvent = ComponentNativeEvent<dxFileManager> & {
    readonly itemData: any;
    readonly itemElement: TElement;
    readonly itemIndex: number;
}


export interface dxFileManagerOptions extends WidgetOptions<dxFileManager> {
    /**
     * @docid
     * @default []
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowedFileExtensions?: Array<string>;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    contextMenu?: dxFileManagerContextMenu;
    /**
     * @docid
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    currentPath?: string;
    /**
     * @docid
     * @default []
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    currentPathKeys?: Array<string>;
    /**
     * @docid
     * @type_function_param1 columns:Array<dxFileManagerDetailsColumn>
     * @type_function_return Array<dxFileManagerDetailsColumn>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    customizeDetailColumns?: ((columns: Array<dxFileManagerDetailsColumn>) => Array<dxFileManagerDetailsColumn>);
    /**
     * @docid
     * @type_function_param1 fileSystemItem:FileSystemItem
     * @type_function_return string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    customizeThumbnail?: ((fileSystemItem: FileSystemItem) => string);
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fileSystemProvider?: any;
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemView?: {
      /**
       * @docid
       */
      details?: {
        /**
         * @docid
         * @prevFileNamespace DevExpress.ui
         * @default ["thumbnail", "name", "dateModified", "size"]
         */
        columns?: Array<dxFileManagerDetailsColumn | string>
      },
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @type Enums.FileManagerItemViewMode
      * @default "details"
      */
      mode?: 'details' | 'thumbnails',
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default true
      */
      showFolders?: boolean,
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default true
      */
      showParentFolder?: boolean
    };
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    notifications?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      showPanel?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default true
       */
      showPopup?: boolean
    }
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxFileManager
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:dxElement
     * @type_function_param1_field6 itemIndex:number
     * @type_function_param1_field7 event:event
     * @type_function_param1_field8 fileSystemItem:FileSystemItem
     * @type_function_param1_field9 viewArea:Enums.FileManagerViewArea
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onContextMenuItemClick?: ((e: ContextMenuItemClickEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxFileManager
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 fileSystemItem:FileSystemItem
     * @type_function_param1_field5 targetElement:dxElement
     * @type_function_param1_field6 cancel:boolean
     * @type_function_param1_field7 event:event
     * @type_function_param1_field8 viewArea:Enums.FileManagerViewArea
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onContextMenuShowing?: ((e: ContextMenuShowingEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxFileManager
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 directory:FileSystemItem
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onCurrentDirectoryChanged?: ((e: CurrentDirectoryChangedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxFileManager
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 file:FileSystemItem
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onSelectedFileOpened?: ((e: SelectedFileOpenedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxFileManager
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 currentSelectedItemKeys:Array<string>
     * @type_function_param1_field5 currentDeselectedItemKeys:Array<string>
     * @type_function_param1_field6 selectedItems:Array<FileSystemItem>
     * @type_function_param1_field7 selectedItemKeys:Array<string>
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxFileManager
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:dxElement
     * @type_function_param1_field6 itemIndex:number
     * @type_function_param1_field7 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onToolbarItemClick?: ((e: ToolbarItemClickEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxFileManager
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 item:FileSystemItem
     * @type_function_param1_field5 itemElement:dxElement
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onFocusedItemChanged?: ((e: FocusedItemChangedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxFileManager
     * @type_function_param1_field2 element:TElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 errorCode:number
     * @type_function_param1_field5 errorText:string
     * @type_function_param1_field6 fileSystemItem:FileSystemItem
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onErrorOccurred?: ((e: ErrorOccurredEvent) => void);
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    permissions?: {
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      copy?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      create?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      download?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      move?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      delete?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      rename?: boolean,
      /**
       * @docid
       * @prevFileNamespace DevExpress.ui
       * @default false
       */
      upload?: boolean
    };
    /**
     * @docid
     * @default "Files"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    rootFolderName?: string;
    /**
     * @docid
     * @type Enums.FileManagerSelectionMode
     * @default "multiple"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectionMode?: 'multiple' | 'single';
    /**
     * @docid
     * @default []
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedItemKeys?: Array<string>;
    /**
     * @docid
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusedItemKey?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toolbar?: dxFileManagerToolbar;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    upload?: {
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default 0
      */
      maxFileSize?: number,
      /**
      * @docid
      * @prevFileNamespace DevExpress.ui
      * @default 200000
      */
      chunkSize?: number
    };
}
/**
 * @docid
 * @inherits Widget
 * @module ui/file_manager
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxFileManager extends Widget {
    constructor(element: TElement, options?: dxFileManagerOptions)
    /**
     * @docid
     * @publicName getCurrentDirectory()
     * @return object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getCurrentDirectory(): any;
    /**
     * @docid
     * @publicName getSelectedItems()
     * @return Array<object>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getSelectedItems(): Array<any>;
    /**
     * @docid
     * @publicName refresh()
     * @return Promise<any>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    refresh(): TPromise<any>;
}

/**
 * @docid
 * @type object
 */
export interface dxFileManagerContextMenu {
    /**
     * @docid
     * @type Array<dxFileManagerContextMenuItem,Enums.FileManagerContextMenuItem>
     * @default [ "create", "upload", "rename", "move", "copy", "delete", "refresh", "download" ]
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxFileManagerContextMenuItem | 'create' | 'upload' | 'refresh' | 'download' | 'move' | 'copy' | 'rename' | 'delete'>;
}
/**
 * @docid
 * @inherits dxContextMenuItem
 */
export interface dxFileManagerContextMenuItem extends dxContextMenuItem {
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxFileManagerContextMenuItem>;
    /**
     * @docid
     * @type Enums.FileManagerContextMenuItem|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: 'create' | 'upload' | 'refresh' | 'download' | 'move' | 'copy' | 'rename' | 'delete' | string;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @hidden
     */
    template?: template | (() => string | TElement);
}

/**
 * @docid
 * @type object
 */
export interface dxFileManagerToolbar {
    /**
     * @docid
     * @type Array<dxFileManagerToolbarItem,Enums.FileManagerToolbarItem>
     * @default [ "download", "separator", "move", "copy", "rename", "separator", "delete", "clearSelection", { name: "separator", location: "after" }, "refresh" ]
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fileSelectionItems?: Array<dxFileManagerToolbarItem | 'showNavPane' | 'create' | 'upload' | 'refresh' | 'switchView' | 'download' | 'move' | 'copy' | 'rename' | 'delete' | 'clearSelection' | 'separator'>;
    /**
     * @docid
     * @type Array<dxFileManagerToolbarItem,Enums.FileManagerToolbarItem>
     * @default [ "showNavPane", "create", "upload", "switchView", { name: "separator", location: "after" }, "refresh" ]
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxFileManagerToolbarItem | 'showNavPane' | 'create' | 'upload' | 'refresh' | 'switchView' | 'download' | 'move' | 'copy' | 'rename' | 'delete' | 'clearSelection' | 'separator'>;
}

/**
 * @docid
 * @inherits dxToolbarItem
 */
export interface dxFileManagerToolbarItem extends dxToolbarItem {
    /**
     * @docid
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    icon?: string;
    /**
     * @docid
     * @type Enums.ToolbarItemLocation|string
     * @default "before"
     * @type Enums.ToolbarItemLocation
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    location?: 'after' | 'before' | 'center';
    /**
     * @docid
     * @type Enums.FileManagerToolbarItem|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: 'showNavPane' | 'create' | 'upload' | 'refresh' | 'switchView' | 'download' | 'move' | 'copy' | 'rename' | 'delete' | 'clearSelection' | 'separator' | string;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @hidden
     */
    html?: string;
    /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @hidden
     */
    template?: template | (() => string | TElement);
     /**
     * @docid
     * @prevFileNamespace DevExpress.ui
     * @hidden
     */
    menuItemTemplate?: template | (() => string | TElement);
}


/**
 * @docid
 * @type object
 */
export interface dxFileManagerDetailsColumn {
    /**
     * @docid
     * @type Enums.HorizontalAlignment
     * @default undefined
     * @acceptValues undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    alignment?: 'center' | 'left' | 'right' | undefined;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    caption?: string;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cssClass?: string;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataField?: string;
    /**
     * @docid
     * @type Enums.GridColumnDataType
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataType?: 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime';
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hidingPriority?: number;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    sortIndex?: number;
    /**
     * @docid
     * @type Enums.SortOrder
     * @default undefined
     * @acceptValues undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    sortOrder?: 'asc' | 'desc' | undefined;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visibleIndex?: number;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    width?: number | string;
}

export type Options = dxFileManagerOptions;

/** @deprecated use Options instead */
export type IOptions = dxFileManagerOptions;
