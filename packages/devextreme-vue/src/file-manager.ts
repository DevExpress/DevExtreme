import FileManager, { Properties } from "devextreme/ui/file_manager";
import { createComponent } from "./core/index";
import { createConfigurationComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "allowedFileExtensions" |
  "contextMenu" |
  "currentPath" |
  "currentPathKeys" |
  "customizeDetailColumns" |
  "customizeThumbnail" |
  "disabled" |
  "elementAttr" |
  "fileSystemProvider" |
  "focusedItemKey" |
  "focusStateEnabled" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "itemView" |
  "notifications" |
  "onContentReady" |
  "onContextMenuItemClick" |
  "onContextMenuShowing" |
  "onCurrentDirectoryChanged" |
  "onDirectoryCreated" |
  "onDirectoryCreating" |
  "onDisposing" |
  "onErrorOccurred" |
  "onFileUploaded" |
  "onFileUploading" |
  "onFocusedItemChanged" |
  "onInitialized" |
  "onItemCopied" |
  "onItemCopying" |
  "onItemDeleted" |
  "onItemDeleting" |
  "onItemDownloading" |
  "onItemMoved" |
  "onItemMoving" |
  "onItemRenamed" |
  "onItemRenaming" |
  "onOptionChanged" |
  "onSelectedFileOpened" |
  "onSelectionChanged" |
  "onToolbarItemClick" |
  "permissions" |
  "rootFolderName" |
  "rtlEnabled" |
  "selectedItemKeys" |
  "selectionMode" |
  "tabIndex" |
  "toolbar" |
  "upload" |
  "visible" |
  "width"
>;

interface DxFileManager extends AccessibleOptions {
  readonly instance?: FileManager;
}
const DxFileManager = createComponent({
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    allowedFileExtensions: Array,
    contextMenu: Object,
    currentPath: String,
    currentPathKeys: Array,
    customizeDetailColumns: Function,
    customizeThumbnail: Function,
    disabled: Boolean,
    elementAttr: Object,
    fileSystemProvider: {},
    focusedItemKey: String,
    focusStateEnabled: Boolean,
    height: [Function, Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    itemView: Object,
    notifications: Object,
    onContentReady: Function,
    onContextMenuItemClick: Function,
    onContextMenuShowing: Function,
    onCurrentDirectoryChanged: Function,
    onDirectoryCreated: Function,
    onDirectoryCreating: Function,
    onDisposing: Function,
    onErrorOccurred: Function,
    onFileUploaded: Function,
    onFileUploading: Function,
    onFocusedItemChanged: Function,
    onInitialized: Function,
    onItemCopied: Function,
    onItemCopying: Function,
    onItemDeleted: Function,
    onItemDeleting: Function,
    onItemDownloading: Function,
    onItemMoved: Function,
    onItemMoving: Function,
    onItemRenamed: Function,
    onItemRenaming: Function,
    onOptionChanged: Function,
    onSelectedFileOpened: Function,
    onSelectionChanged: Function,
    onToolbarItemClick: Function,
    permissions: Object,
    rootFolderName: String,
    rtlEnabled: Boolean,
    selectedItemKeys: Array,
    selectionMode: String,
    tabIndex: Number,
    toolbar: Object,
    upload: Object,
    visible: Boolean,
    width: [Function, Number, String]
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:allowedFileExtensions": null,
    "update:contextMenu": null,
    "update:currentPath": null,
    "update:currentPathKeys": null,
    "update:customizeDetailColumns": null,
    "update:customizeThumbnail": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:fileSystemProvider": null,
    "update:focusedItemKey": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:itemView": null,
    "update:notifications": null,
    "update:onContentReady": null,
    "update:onContextMenuItemClick": null,
    "update:onContextMenuShowing": null,
    "update:onCurrentDirectoryChanged": null,
    "update:onDirectoryCreated": null,
    "update:onDirectoryCreating": null,
    "update:onDisposing": null,
    "update:onErrorOccurred": null,
    "update:onFileUploaded": null,
    "update:onFileUploading": null,
    "update:onFocusedItemChanged": null,
    "update:onInitialized": null,
    "update:onItemCopied": null,
    "update:onItemCopying": null,
    "update:onItemDeleted": null,
    "update:onItemDeleting": null,
    "update:onItemDownloading": null,
    "update:onItemMoved": null,
    "update:onItemMoving": null,
    "update:onItemRenamed": null,
    "update:onItemRenaming": null,
    "update:onOptionChanged": null,
    "update:onSelectedFileOpened": null,
    "update:onSelectionChanged": null,
    "update:onToolbarItemClick": null,
    "update:permissions": null,
    "update:rootFolderName": null,
    "update:rtlEnabled": null,
    "update:selectedItemKeys": null,
    "update:selectionMode": null,
    "update:tabIndex": null,
    "update:toolbar": null,
    "update:upload": null,
    "update:visible": null,
    "update:width": null,
  },
  computed: {
    instance(): FileManager {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = FileManager;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      contextMenu: { isCollectionItem: false, optionName: "contextMenu" },
      itemView: { isCollectionItem: false, optionName: "itemView" },
      notifications: { isCollectionItem: false, optionName: "notifications" },
      permissions: { isCollectionItem: false, optionName: "permissions" },
      toolbar: { isCollectionItem: false, optionName: "toolbar" },
      upload: { isCollectionItem: false, optionName: "upload" }
    };
  }
});

const DxColumn = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:alignment": null,
    "update:caption": null,
    "update:cssClass": null,
    "update:dataField": null,
    "update:dataType": null,
    "update:hidingPriority": null,
    "update:sortIndex": null,
    "update:sortOrder": null,
    "update:visible": null,
    "update:visibleIndex": null,
    "update:width": null,
  },
  props: {
    alignment: String,
    caption: String,
    cssClass: String,
    dataField: String,
    dataType: String,
    hidingPriority: Number,
    sortIndex: Number,
    sortOrder: String,
    visible: Boolean,
    visibleIndex: Number,
    width: [Number, String]
  }
});
(DxColumn as any).$_optionName = "columns";
(DxColumn as any).$_isCollectionItem = true;
const DxContextMenu = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:items": null,
  },
  props: {
    items: Array
  }
});
(DxContextMenu as any).$_optionName = "contextMenu";
(DxContextMenu as any).$_expectedChildren = {
  contextMenuItem: { isCollectionItem: true, optionName: "items" },
  item: { isCollectionItem: true, optionName: "items" }
};
const DxContextMenuItem = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:beginGroup": null,
    "update:closeMenuOnClick": null,
    "update:disabled": null,
    "update:icon": null,
    "update:items": null,
    "update:name": null,
    "update:selectable": null,
    "update:selected": null,
    "update:text": null,
    "update:visible": null,
  },
  props: {
    beginGroup: Boolean,
    closeMenuOnClick: Boolean,
    disabled: Boolean,
    icon: String,
    items: Array,
    name: String,
    selectable: Boolean,
    selected: Boolean,
    text: String,
    visible: Boolean
  }
});
(DxContextMenuItem as any).$_optionName = "items";
(DxContextMenuItem as any).$_isCollectionItem = true;
const DxDetails = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:columns": null,
  },
  props: {
    columns: Array
  }
});
(DxDetails as any).$_optionName = "details";
(DxDetails as any).$_expectedChildren = {
  column: { isCollectionItem: true, optionName: "columns" }
};
const DxFileSelectionItem = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:cssClass": null,
    "update:disabled": null,
    "update:icon": null,
    "update:locateInMenu": null,
    "update:location": null,
    "update:name": null,
    "update:options": null,
    "update:showText": null,
    "update:text": null,
    "update:visible": null,
    "update:widget": null,
  },
  props: {
    cssClass: String,
    disabled: Boolean,
    icon: String,
    locateInMenu: String,
    location: String,
    name: String,
    options: {},
    showText: String,
    text: String,
    visible: Boolean,
    widget: String
  }
});
(DxFileSelectionItem as any).$_optionName = "fileSelectionItems";
(DxFileSelectionItem as any).$_isCollectionItem = true;
const DxItem = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:beginGroup": null,
    "update:closeMenuOnClick": null,
    "update:cssClass": null,
    "update:disabled": null,
    "update:icon": null,
    "update:items": null,
    "update:locateInMenu": null,
    "update:location": null,
    "update:name": null,
    "update:options": null,
    "update:selectable": null,
    "update:selected": null,
    "update:showText": null,
    "update:text": null,
    "update:visible": null,
    "update:widget": null,
  },
  props: {
    beginGroup: Boolean,
    closeMenuOnClick: Boolean,
    cssClass: String,
    disabled: Boolean,
    icon: String,
    items: Array,
    locateInMenu: String,
    location: String,
    name: String,
    options: {},
    selectable: Boolean,
    selected: Boolean,
    showText: String,
    text: String,
    visible: Boolean,
    widget: String
  }
});
(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;
const DxItemView = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:details": null,
    "update:mode": null,
    "update:showFolders": null,
    "update:showParentFolder": null,
  },
  props: {
    details: Object,
    mode: String,
    showFolders: Boolean,
    showParentFolder: Boolean
  }
});
(DxItemView as any).$_optionName = "itemView";
(DxItemView as any).$_expectedChildren = {
  details: { isCollectionItem: false, optionName: "details" }
};
const DxNotifications = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:showPanel": null,
    "update:showPopup": null,
  },
  props: {
    showPanel: Boolean,
    showPopup: Boolean
  }
});
(DxNotifications as any).$_optionName = "notifications";
const DxPermissions = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:copy": null,
    "update:create": null,
    "update:delete": null,
    "update:download": null,
    "update:move": null,
    "update:rename": null,
    "update:upload": null,
  },
  props: {
    copy: Boolean,
    create: Boolean,
    delete: Boolean,
    download: Boolean,
    move: Boolean,
    rename: Boolean,
    upload: Boolean
  }
});
(DxPermissions as any).$_optionName = "permissions";
const DxToolbar = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:fileSelectionItems": null,
    "update:items": null,
  },
  props: {
    fileSelectionItems: Array,
    items: Array
  }
});
(DxToolbar as any).$_optionName = "toolbar";
(DxToolbar as any).$_expectedChildren = {
  fileSelectionItem: { isCollectionItem: true, optionName: "fileSelectionItems" },
  item: { isCollectionItem: true, optionName: "items" },
  toolbarItem: { isCollectionItem: true, optionName: "items" }
};
const DxToolbarItem = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:cssClass": null,
    "update:disabled": null,
    "update:icon": null,
    "update:locateInMenu": null,
    "update:location": null,
    "update:name": null,
    "update:options": null,
    "update:showText": null,
    "update:text": null,
    "update:visible": null,
    "update:widget": null,
  },
  props: {
    cssClass: String,
    disabled: Boolean,
    icon: String,
    locateInMenu: String,
    location: String,
    name: String,
    options: {},
    showText: String,
    text: String,
    visible: Boolean,
    widget: String
  }
});
(DxToolbarItem as any).$_optionName = "items";
(DxToolbarItem as any).$_isCollectionItem = true;
const DxUpload = createConfigurationComponent({
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:chunkSize": null,
    "update:maxFileSize": null,
  },
  props: {
    chunkSize: Number,
    maxFileSize: Number
  }
});
(DxUpload as any).$_optionName = "upload";

export default DxFileManager;
export {
  DxFileManager,
  DxColumn,
  DxContextMenu,
  DxContextMenuItem,
  DxDetails,
  DxFileSelectionItem,
  DxItem,
  DxItemView,
  DxNotifications,
  DxPermissions,
  DxToolbar,
  DxToolbarItem,
  DxUpload
};
import type * as DxFileManagerTypes from "devextreme/ui/file_manager_types";
export { DxFileManagerTypes };
