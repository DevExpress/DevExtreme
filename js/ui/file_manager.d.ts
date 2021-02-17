import '../jquery_augmentation';

import {
    dxElement
} from '../core/element';

import {
    event
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

export interface dxFileManagerOptions extends WidgetOptions<dxFileManager> {
    /**
     * @docid dxFileManagerOptions.allowedFileExtensions
     * @type Array<string>
     * @default []
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowedFileExtensions?: Array<string>;
    /**
     * @docid dxFileManagerOptions.contextMenu
     * @type dxFileManagerContextMenu
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    contextMenu?: dxFileManagerContextMenu;
    /**
     * @docid dxFileManagerOptions.currentPath
     * @type string
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    currentPath?: string;
    /**
     * @docid dxFileManagerOptions.currentPathKeys
     * @type Array<string>
     * @default []
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    currentPathKeys?: Array<string>;
    /**
     * @docid dxFileManagerOptions.customizeDetailColumns
     * @type function
     * @type_function_param1 columns:Array<dxFileManagerDetailsColumn>
     * @type_function_return Array<dxFileManagerDetailsColumn>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    customizeDetailColumns?: ((columns: Array<dxFileManagerDetailsColumn>) => Array<dxFileManagerDetailsColumn>);
    /**
     * @docid dxFileManagerOptions.customizeThumbnail
     * @type function
     * @type_function_param1 fileSystemItem:FileSystemItem
     * @type_function_return string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    customizeThumbnail?: ((fileSystemItem: FileSystemItem) => string);
    /**
     * @docid dxFileManagerOptions.fileSystemProvider
     * @type object
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fileSystemProvider?: any;
    /**
     * @docid dxFileManagerOptions.itemView
     * @type object
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    itemView?: {details?: { columns?: Array<dxFileManagerDetailsColumn | string>}, mode?: 'details' | 'thumbnails', showFolders?: boolean, showParentFolder?: boolean };
    /**
     * @docid dxFileManagerOptions.onContextMenuItemClick
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
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
    onContextMenuItemClick?: ((e: { component?: dxFileManager, element?: dxElement, model?: any, itemData?: any, itemElement?: dxElement, itemIndex?: number, event?: event, fileSystemItem?: FileSystemItem, viewArea?: 'navPane' | 'itemView' }) => any);
    /**
     * @docid dxFileManagerOptions.onCurrentDirectoryChanged
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 directory:FileSystemItem
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onCurrentDirectoryChanged?: ((e: { component?: dxFileManager, element?: dxElement, model?: any, directory?: FileSystemItem }) => any);
    /**
     * @docid dxFileManagerOptions.onSelectedFileOpened
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 file:FileSystemItem
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onSelectedFileOpened?: ((e: { component?: dxFileManager, element?: dxElement, model?: any, file?: FileSystemItem }) => any);
    /**
     * @docid dxFileManagerOptions.onSelectionChanged
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 currentSelectedItemKeys:Array<string>
     * @type_function_param1_field5 currentDeselectedItemKeys:Array<string>
     * @type_function_param1_field6 selectedItems:Array<FileSystemItem>
     * @type_function_param1_field7 selectedItemKeys:Array<string>
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onSelectionChanged?: ((e: { component?: dxFileManager, element?: dxElement, model?: any, currentSelectedItemKeys?: Array<string>, currentDeselectedItemKeys?: Array<string>, selectedItems?: Array<FileSystemItem>, selectedItemKeys?: Array<string>}) => any);
    /**
     * @docid dxFileManagerOptions.onToolbarItemClick
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 itemData:object
     * @type_function_param1_field5 itemElement:dxElement
     * @type_function_param1_field6 itemIndex:number
     * @type_function_param1_field7 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onToolbarItemClick?: ((e: { component?: dxFileManager, element?: dxElement, model?: any, itemData?: any, itemElement?: dxElement, itemIndex?: number, event?: event }) => any);
    /**
     * @docid dxFileManagerOptions.onFocusedItemChanged
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 item:FileSystemItem
     * @type_function_param1_field5 itemElement:dxElement
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onFocusedItemChanged?: ((e: { component?: dxFileManager, element?: dxElement, model?: any, item?: FileSystemItem, itemElement?: dxElement }) => any);
    /**
     * @docid dxFileManagerOptions.onErrorOccurred
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 errorCode:number
     * @type_function_param1_field5 errorText:string
     * @type_function_param1_field6 fileSystemItem:FileSystemItem
     * @default null
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onErrorOccurred?: ((e: { component?: dxFileManager, element?: dxElement, model?: any, errorCode?: number, errorText?: string, fileSystemItem?: FileSystemItem }) => any);
    /**
     * @docid dxFileManagerOptions.permissions
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    permissions?: { copy?: boolean, create?: boolean, download?: boolean, move?: boolean, delete?: boolean, rename?: boolean, upload?: boolean };
    /**
     * @docid dxFileManagerOptions.rootFolderName
     * @type string
     * @default "Files"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    rootFolderName?: string;
    /**
     * @docid dxFileManagerOptions.selectionMode
     * @type Enums.FileManagerSelectionMode
     * @default "multiple"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectionMode?: 'multiple' | 'single';
    /**
     * @docid dxFileManagerOptions.selectedItemKeys
     * @type Array<string>
     * @default []
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectedItemKeys?: Array<string>;
    /**
     * @docid dxFileManagerOptions.focusedItemKey
     * @type string
     * @default null
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusedItemKey?: string;
    /**
     * @docid dxFileManagerOptions.toolbar
     * @type dxFileManagerToolbar
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    toolbar?: dxFileManagerToolbar;
    /**
     * @docid dxFileManagerOptions.upload
     * @type object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    upload?: { maxFileSize?: number, chunkSize?: number };
}
/**
 * @docid dxFileManager
 * @inherits Widget
 * @module ui/file_manager
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxFileManager extends Widget {
    constructor(element: Element, options?: dxFileManagerOptions)
    constructor(element: JQuery, options?: dxFileManagerOptions)
    /**
     * @docid dxFileManagerMethods.getCurrentDirectory
     * @publicName getCurrentDirectory()
     * @return object
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getCurrentDirectory(): any;
    /**
     * @docid dxFileManagerMethods.getSelectedItems
     * @publicName getSelectedItems()
     * @return Array<object>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    getSelectedItems(): Array<any>;
    /**
     * @docid dxFileManagerMethods.refresh
     * @publicName refresh()
     * @return Promise<any>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    refresh(): Promise<any> & JQueryPromise<any>;
}

export interface dxFileManagerContextMenu {
    /**
     * @docid dxFileManagerContextMenu.items
     * @type Array<dxFileManagerContextMenuItem,Enums.FileManagerContextMenuItem>
     * @default [ "create", "upload", "rename", "move", "copy", "delete", "refresh", "download" ]
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxFileManagerContextMenuItem | 'create' | 'upload' | 'refresh' | 'download' | 'move' | 'copy' | 'rename' | 'delete'>;
}

export interface dxFileManagerContextMenuItem extends dxContextMenuItem {
    /**
     * @docid dxFileManagerContextMenuItem.items
     * @type Array<dxFileManagerContextMenuItem>
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxFileManagerContextMenuItem>;
    /**
     * @docid dxFileManagerContextMenuItem.name
     * @type Enums.FileManagerContextMenuItem|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: 'create' | 'upload' | 'refresh' | 'download' | 'move' | 'copy' | 'rename' | 'delete' | string;
    /**
     * @docid dxFileManagerContextMenuItem.visible
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxFileManagerContextMenuItem.template
     * @type template|function
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @hidden
     */
    template?: template | (() => string | Element | JQuery);
}

export interface dxFileManagerToolbar {
    /**
     * @docid dxFileManagerToolbar.fileSelectionItems
     * @type Array<dxFileManagerToolbarItem,Enums.FileManagerToolbarItem>
     * @default [ "download", "separator", "move", "copy", "rename", "separator", "delete", "clearSelection", { name: "separator", location: "after" }, "refresh" ]
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    fileSelectionItems?: Array<dxFileManagerToolbarItem | 'showNavPane' | 'create' | 'upload' | 'refresh' | 'switchView' | 'download' | 'move' | 'copy' | 'rename' | 'delete' | 'clearSelection' | 'separator'>;
    /**
     * @docid dxFileManagerToolbar.items
     * @type Array<dxFileManagerToolbarItem,Enums.FileManagerToolbarItem>
     * @default [ "showNavPane", "create", "upload", "switchView", { name: "separator", location: "after" }, "refresh" ]
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    items?: Array<dxFileManagerToolbarItem | 'showNavPane' | 'create' | 'upload' | 'refresh' | 'switchView' | 'download' | 'move' | 'copy' | 'rename' | 'delete' | 'clearSelection' | 'separator'>;
}

export interface dxFileManagerToolbarItem extends dxToolbarItem {
    /**
     * @docid dxFileManagerToolbarItem.icon
     * @type string
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    icon?: string;
    /**
     * @docid dxFileManagerToolbarItem.location
     * @default "before"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    location?: 'after' | 'before' | 'center';
    /**
     * @docid dxFileManagerToolbarItem.name
     * @type Enums.FileManagerToolbarItem|string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: 'showNavPane' | 'create' | 'upload' | 'refresh' | 'switchView' | 'download' | 'move' | 'copy' | 'rename' | 'delete' | 'clearSelection' | 'separator' | string;
    /**
     * @docid dxFileManagerToolbarItem.visible
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxFileManagerToolbarItem.html
     * @type String
     * @prevFileNamespace DevExpress.ui
     * @hidden
     */
    html?: string;
    /**
     * @docid dxFileManagerToolbarItem.template
     * @type template|function
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @hidden
     */
    template?: template | (() => string | Element | JQuery);
    /**
     * @docid dxFileManagerToolbarItem.menuItemTemplate
     * @type template|function
     * @type_function_return string|Element|jQuery
     * @prevFileNamespace DevExpress.ui
     * @hidden
     */
    menuItemTemplate?: template | (() => string | Element | JQuery);
}

export interface dxFileManagerDetailsColumn {
    /**
     * @docid dxFileManagerDetailsColumn.alignment
     * @type Enums.HorizontalAlignment
     * @default undefined
     * @acceptValues undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    alignment?: 'center' | 'left' | 'right' | undefined;
    /**
     * @docid dxFileManagerDetailsColumn.caption
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    caption?: string;
    /**
     * @docid dxFileManagerDetailsColumn.cssClass
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    cssClass?: string;
    /**
     * @docid dxFileManagerDetailsColumn.dataField
     * @type string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataField?: string;
    /**
     * @docid dxFileManagerDetailsColumn.dataType
     * @type Enums.GridColumnDataType
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dataType?: 'string' | 'number' | 'date' | 'boolean' | 'object' | 'datetime';
    /**
     * @docid dxFileManagerDetailsColumn.hidingPriority
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hidingPriority?: number;
    /**
     * @docid dxFileManagerDetailsColumn.sortIndex
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    sortIndex?: number;
    /**
     * @docid dxFileManagerDetailsColumn.sortOrder
     * @type Enums.SortOrder
     * @default undefined
     * @acceptValues undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    sortOrder?: 'asc' | 'desc' | undefined;
    /**
     * @docid dxFileManagerDetailsColumn.visible
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visible?: boolean;
    /**
     * @docid dxFileManagerDetailsColumn.visibleIndex
     * @type number
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    visibleIndex?: number;
    /**
     * @docid dxFileManagerDetailsColumn.width
     * @type number|string
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    width?: number | string;
}

declare global {
interface JQuery {
    dxFileManager(): JQuery;
    dxFileManager(options: "instance"): dxFileManager;
    dxFileManager(options: string): any;
    dxFileManager(options: string, ...params: any[]): any;
    dxFileManager(options: dxFileManagerOptions): JQuery;
}
}
export type Options = dxFileManagerOptions;

/** @deprecated use Options instead */
export type IOptions = dxFileManagerOptions;