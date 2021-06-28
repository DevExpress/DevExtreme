import {
    UserDefinedElement,
    DxElement
} from '../core/element';

import {
    DxPromise
} from '../core/utils/deferred';

import {
    Cancelable,
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
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
export type ContentReadyEvent = EventInfo<dxFileManager>;

/** @public */
export type ContextMenuItemClickEvent = NativeEventInfo<dxFileManager> & {
    readonly itemData: any;
    readonly itemElement: DxElement;
    readonly itemIndex: number;
    readonly fileSystemItem?: FileSystemItem;
    readonly viewArea: 'navPane' | 'itemView';
}

/** @public */
export type ContextMenuShowingEvent = Cancelable & NativeEventInfo<dxFileManager> & {
    readonly fileSystemItem?: FileSystemItem;
    readonly targetElement?: DxElement;
    readonly viewArea: 'navPane' | 'itemView';
}

/** @public */
export type CurrentDirectoryChangedEvent = EventInfo<dxFileManager> & {
    readonly directory: FileSystemItem;
}

/** @public */
export type DisposingEvent = EventInfo<dxFileManager>;

/** @public */
export type ErrorOccurredEvent =  EventInfo<dxFileManager> & {
    readonly errorCode?: number;
    errorText?: string;
    readonly fileSystemItem?: FileSystemItem;
}

/** @public */
export type FocusedItemChangedEvent =  EventInfo<dxFileManager> & {
    readonly item?: FileSystemItem;
    readonly itemElement?: DxElement;
}

/** @public */
export type InitializedEvent = InitializedEventInfo<dxFileManager>;


/** @public */
export type OptionChangedEvent = EventInfo<dxFileManager> & ChangedOptionInfo;

/** @public */
export type SelectedFileOpenedEvent = EventInfo<dxFileManager> & {
    readonly file: FileSystemItem;
}

/** @public */
export type SelectionChangedEvent =  EventInfo<dxFileManager> & {
    readonly currentSelectedItemKeys: Array<string>;
    readonly currentDeselectedItemKeys: Array<string>;
    readonly selectedItems: Array<FileSystemItem>;
    readonly selectedItemKeys: Array<string>;
}

/** @public */
export type ToolbarItemClickEvent = NativeEventInfo<dxFileManager> & {
    readonly itemData: any;
    readonly itemElement: DxElement;
    readonly itemIndex: number;
}

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
     * @type_function_param1 columns:Array<dxFileManagerDetailsColumn>
     * @type_function_return Array<dxFileManagerDetailsColumn>
     * @public
     */
    customizeDetailColumns?: ((columns: Array<dxFileManagerDetailsColumn>) => Array<dxFileManagerDetailsColumn>);
    /**
     * @docid
     * @type_function_param1 fileSystemItem:FileSystemItem
     * @type_function_return string
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
        columns?: Array<dxFileManagerDetailsColumn | string>
      },
      /**
       * @docid
       * @type Enums.FileManagerItemViewMode
       * @default "details"
       */
      mode?: 'details' | 'thumbnails',
      /**
       * @docid
       * @default true
       */
      showFolders?: boolean,
      /**
       * @docid
       * @default true
       */
      showParentFolder?: boolean
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
      showPanel?: boolean,
      /**
       * @docid
       * @default true
       */
      showPopup?: boolean
    }
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxFileManager
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:DxElement
     * @type_function_param1_field6 itemIndex:number
     * @type_function_param1_field7 event:event
     * @type_function_param1_field8 fileSystemItem:FileSystemItem
     * @type_function_param1_field9 viewArea:Enums.FileManagerViewArea
     * @action
     * @public
     */
    onContextMenuItemClick?: ((e: ContextMenuItemClickEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxFileManager
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 fileSystemItem:FileSystemItem
     * @type_function_param1_field5 targetElement:DxElement
     * @type_function_param1_field6 cancel:boolean
     * @type_function_param1_field7 event:event
     * @type_function_param1_field8 viewArea:Enums.FileManagerViewArea
     * @action
     * @public
     */
    onContextMenuShowing?: ((e: ContextMenuShowingEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxFileManager
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 directory:FileSystemItem
     * @default null
     * @action
     * @public
     */
    onCurrentDirectoryChanged?: ((e: CurrentDirectoryChangedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxFileManager
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 file:FileSystemItem
     * @default null
     * @action
     * @public
     */
    onSelectedFileOpened?: ((e: SelectedFileOpenedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxFileManager
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 currentSelectedItemKeys:Array<string>
     * @type_function_param1_field5 currentDeselectedItemKeys:Array<string>
     * @type_function_param1_field6 selectedItems:Array<FileSystemItem>
     * @type_function_param1_field7 selectedItemKeys:Array<string>
     * @default null
     * @action
     * @public
     */
    onSelectionChanged?: ((e: SelectionChangedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxFileManager
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:DxElement
     * @type_function_param1_field6 itemIndex:number
     * @type_function_param1_field7 event:event
     * @action
     * @public
     */
    onToolbarItemClick?: ((e: ToolbarItemClickEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxFileManager
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 item:FileSystemItem
     * @type_function_param1_field5 itemElement:DxElement
     * @default null
     * @action
     * @public
     */
    onFocusedItemChanged?: ((e: FocusedItemChangedEvent) => void);
    /**
     * @docid
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxFileManager
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 errorCode:number
     * @type_function_param1_field5 errorText:string
     * @type_function_param1_field6 fileSystemItem:FileSystemItem
     * @default null
     * @action
     * @public
     */
    onErrorOccurred?: ((e: ErrorOccurredEvent) => void);
    /**
     * @docid
     * @public
     */
    permissions?: {
      /**
       * @docid
       * @default false
       */
      copy?: boolean,
      /**
       * @docid
       * @default false
       */
      create?: boolean,
      /**
       * @docid
       * @default false
       */
      download?: boolean,
      /**
       * @docid
       * @default false
       */
      move?: boolean,
      /**
       * @docid
       * @default false
       */
      delete?: boolean,
      /**
       * @docid
       * @default false
       */
      rename?: boolean,
      /**
       * @docid
       * @default false
       */
      upload?: boolean
    };
    /**
     * @docid
     * @default "Files"
     * @public
     */
    rootFolderName?: string;
    /**
     * @docid
     * @type Enums.FileManagerSelectionMode
     * @default "multiple"
     * @public
     */
    selectionMode?: 'multiple' | 'single';
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
      maxFileSize?: number,
      /**
       * @docid
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
    items?: Array<dxFileManagerContextMenuItem | 'create' | 'upload' | 'refresh' | 'download' | 'move' | 'copy' | 'rename' | 'delete'>;
}
/**
 * @docid
 * @inherits dxContextMenuItem
 * @namespace DevExpress.ui
 */
export interface dxFileManagerContextMenuItem extends dxContextMenuItem {
    /**
     * @docid
     * @public
     */
    items?: Array<dxFileManagerContextMenuItem>;
    /**
     * @docid
     * @type Enums.FileManagerContextMenuItem|string
     * @public
     */
    name?: 'create' | 'upload' | 'refresh' | 'download' | 'move' | 'copy' | 'rename' | 'delete' | string;
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
    fileSelectionItems?: Array<dxFileManagerToolbarItem | 'showNavPane' | 'create' | 'upload' | 'refresh' | 'switchView' | 'download' | 'move' | 'copy' | 'rename' | 'delete' | 'clearSelection' | 'separator'>;
    /**
     * @docid
     * @type Array<dxFileManagerToolbarItem,Enums.FileManagerToolbarItem>
     * @default [ "showNavPane", "create", "upload", "switchView", { name: "separator", location: "after" }, "refresh" ]
     * @public
     */
    items?: Array<dxFileManagerToolbarItem | 'showNavPane' | 'create' | 'upload' | 'refresh' | 'switchView' | 'download' | 'move' | 'copy' | 'rename' | 'delete' | 'clearSelection' | 'separator'>;
}

/**
 * @docid
 * @inherits dxToolbarItem
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
     * @type Enums.ToolbarItemLocation|string
     * @default "before"
     * @type Enums.ToolbarItemLocation
     * @public
     */
    location?: 'after' | 'before' | 'center';
    /**
     * @docid
     * @type Enums.FileManagerToolbarItem|string
     * @public
     */
    name?: 'showNavPane' | 'create' | 'upload' | 'refresh' | 'switchView' | 'download' | 'move' | 'copy' | 'rename' | 'delete' | 'clearSelection' | 'separator' | string;
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
    alignment?: 'center' | 'left' | 'right' | undefined;
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
     * @type Enums.GridColumnDataType
     * @default undefined
     * @public
     */
    dataType?: 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime';
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
    sortOrder?: 'asc' | 'desc' | undefined;
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

/** @deprecated use Properties instead */
export type IOptions = dxFileManagerOptions;
