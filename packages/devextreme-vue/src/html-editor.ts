import { PropType } from "vue";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import HtmlEditor, { Properties } from "devextreme/ui/html_editor";
import  UploadInfo from "devextreme/file_management/upload_info";
import  DataSource from "devextreme/data/data_source";
import {
 Converter,
 dxHtmlEditorImageUpload,
 dxHtmlEditorMediaResizing,
 dxHtmlEditorMention,
 ContentReadyEvent,
 DisposingEvent,
 FocusInEvent,
 FocusOutEvent,
 InitializedEvent,
 OptionChangedEvent,
 ValueChangedEvent,
 dxHtmlEditorTableContextMenu,
 dxHtmlEditorTableResizing,
 dxHtmlEditorToolbar,
 dxHtmlEditorVariables,
 HtmlEditorImageUploadMode,
 dxHtmlEditorImageUploadTabItem,
 HtmlEditorImageUploadTab,
 dxHtmlEditorTableContextMenuItem,
 HtmlEditorPredefinedContextMenuItem,
 HtmlEditorPredefinedToolbarItem,
 dxHtmlEditorToolbarItem,
} from "devextreme/ui/html_editor";
import {
 EditorStyle,
 ValidationMessageMode,
 Position,
 ValidationStatus,
 ToolbarItemLocation,
 ToolbarItemComponent,
} from "devextreme/common";
import {
 BeforeSendEvent,
 ContentReadyEvent as FileUploaderContentReadyEvent,
 DisposingEvent as FileUploaderDisposingEvent,
 DropZoneEnterEvent,
 DropZoneLeaveEvent,
 FilesUploadedEvent,
 InitializedEvent as FileUploaderInitializedEvent,
 OptionChangedEvent as FileUploaderOptionChangedEvent,
 ProgressEvent,
 UploadAbortedEvent,
 UploadedEvent,
 UploadErrorEvent,
 UploadStartedEvent,
 ValueChangedEvent as FileUploaderValueChangedEvent,
 UploadHttpMethod,
 FileUploadMode,
 dxFileUploaderOptions,
} from "devextreme/ui/file_uploader";
import {
 LocateInMenuMode,
 ShowTextMode,
} from "devextreme/ui/toolbar";
import {
 DataSourceOptions,
} from "devextreme/common/data";
import {
 Store,
} from "devextreme/data/store";
import { prepareConfigurationComponentConfig } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "allowSoftLineBreak" |
  "converter" |
  "customizeModules" |
  "disabled" |
  "elementAttr" |
  "focusStateEnabled" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "imageUpload" |
  "isDirty" |
  "isValid" |
  "mediaResizing" |
  "mentions" |
  "name" |
  "onContentReady" |
  "onDisposing" |
  "onFocusIn" |
  "onFocusOut" |
  "onInitialized" |
  "onOptionChanged" |
  "onValueChanged" |
  "placeholder" |
  "readOnly" |
  "rtlEnabled" |
  "stylingMode" |
  "tabIndex" |
  "tableContextMenu" |
  "tableResizing" |
  "toolbar" |
  "validationError" |
  "validationErrors" |
  "validationMessageMode" |
  "validationMessagePosition" |
  "validationStatus" |
  "value" |
  "variables" |
  "visible" |
  "width"
>;

interface DxHtmlEditor extends AccessibleOptions {
  readonly instance?: HtmlEditor;
}

const componentConfig = {
  props: {
    accessKey: String,
    activeStateEnabled: Boolean,
    allowSoftLineBreak: Boolean,
    converter: Object as PropType<Converter | Record<string, any>>,
    customizeModules: Function as PropType<((config: any) => void)>,
    disabled: Boolean,
    elementAttr: Object as PropType<Record<string, any>>,
    focusStateEnabled: Boolean,
    height: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    imageUpload: Object as PropType<dxHtmlEditorImageUpload | Record<string, any>>,
    isDirty: Boolean,
    isValid: Boolean,
    mediaResizing: Object as PropType<dxHtmlEditorMediaResizing | Record<string, any>>,
    mentions: Array as PropType<Array<dxHtmlEditorMention>>,
    name: String,
    onContentReady: Function as PropType<((e: ContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: DisposingEvent) => void)>,
    onFocusIn: Function as PropType<((e: FocusInEvent) => void)>,
    onFocusOut: Function as PropType<((e: FocusOutEvent) => void)>,
    onInitialized: Function as PropType<((e: InitializedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: OptionChangedEvent) => void)>,
    onValueChanged: Function as PropType<((e: ValueChangedEvent) => void)>,
    placeholder: String,
    readOnly: Boolean,
    rtlEnabled: Boolean,
    stylingMode: String as PropType<EditorStyle>,
    tabIndex: Number,
    tableContextMenu: Object as PropType<dxHtmlEditorTableContextMenu | Record<string, any>>,
    tableResizing: Object as PropType<dxHtmlEditorTableResizing | Record<string, any>>,
    toolbar: Object as PropType<dxHtmlEditorToolbar | Record<string, any>>,
    validationError: {},
    validationErrors: Array as PropType<Array<any>>,
    validationMessageMode: String as PropType<ValidationMessageMode>,
    validationMessagePosition: String as PropType<Position>,
    validationStatus: String as PropType<ValidationStatus>,
    value: {},
    variables: Object as PropType<dxHtmlEditorVariables | Record<string, any>>,
    visible: Boolean,
    width: [Function, Number, String] as PropType<((() => number | string)) | number | string>
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:allowSoftLineBreak": null,
    "update:converter": null,
    "update:customizeModules": null,
    "update:disabled": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:imageUpload": null,
    "update:isDirty": null,
    "update:isValid": null,
    "update:mediaResizing": null,
    "update:mentions": null,
    "update:name": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onFocusIn": null,
    "update:onFocusOut": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:onValueChanged": null,
    "update:placeholder": null,
    "update:readOnly": null,
    "update:rtlEnabled": null,
    "update:stylingMode": null,
    "update:tabIndex": null,
    "update:tableContextMenu": null,
    "update:tableResizing": null,
    "update:toolbar": null,
    "update:validationError": null,
    "update:validationErrors": null,
    "update:validationMessageMode": null,
    "update:validationMessagePosition": null,
    "update:validationStatus": null,
    "update:value": null,
    "update:variables": null,
    "update:visible": null,
    "update:width": null,
  },
  model: { prop: "value", event: "update:value" },
  computed: {
    instance(): HtmlEditor {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = HtmlEditor;
    (this as any).$_hasAsyncTemplate = true;
    (this as any).$_expectedChildren = {
      converter: { isCollectionItem: false, optionName: "converter" },
      imageUpload: { isCollectionItem: false, optionName: "imageUpload" },
      mediaResizing: { isCollectionItem: false, optionName: "mediaResizing" },
      mention: { isCollectionItem: true, optionName: "mentions" },
      tableContextMenu: { isCollectionItem: false, optionName: "tableContextMenu" },
      tableResizing: { isCollectionItem: false, optionName: "tableResizing" },
      toolbar: { isCollectionItem: false, optionName: "toolbar" },
      variables: { isCollectionItem: false, optionName: "variables" }
    };
  }
};

prepareComponentConfig(componentConfig);

const DxHtmlEditor = defineComponent(componentConfig);


const DxConverterConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:fromHtml": null,
    "update:toHtml": null,
  },
  props: {
    fromHtml: Function as PropType<((value: string) => string)>,
    toHtml: Function as PropType<((value: string) => string)>
  }
};

prepareConfigurationComponentConfig(DxConverterConfig);

const DxConverter = defineComponent(DxConverterConfig);

(DxConverter as any).$_optionName = "converter";

const DxFileUploaderOptionsConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:abortUpload": null,
    "update:accept": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:allowCanceling": null,
    "update:allowedFileExtensions": null,
    "update:bindingOptions": null,
    "update:chunkSize": null,
    "update:dialogTrigger": null,
    "update:disabled": null,
    "update:dropZone": null,
    "update:elementAttr": null,
    "update:focusStateEnabled": null,
    "update:height": null,
    "update:hint": null,
    "update:hoverStateEnabled": null,
    "update:inputAttr": null,
    "update:invalidFileExtensionMessage": null,
    "update:invalidMaxFileSizeMessage": null,
    "update:invalidMinFileSizeMessage": null,
    "update:isDirty": null,
    "update:isValid": null,
    "update:labelText": null,
    "update:maxFileSize": null,
    "update:minFileSize": null,
    "update:multiple": null,
    "update:name": null,
    "update:onBeforeSend": null,
    "update:onContentReady": null,
    "update:onDisposing": null,
    "update:onDropZoneEnter": null,
    "update:onDropZoneLeave": null,
    "update:onFilesUploaded": null,
    "update:onInitialized": null,
    "update:onOptionChanged": null,
    "update:onProgress": null,
    "update:onUploadAborted": null,
    "update:onUploaded": null,
    "update:onUploadError": null,
    "update:onUploadStarted": null,
    "update:onValueChanged": null,
    "update:progress": null,
    "update:readOnly": null,
    "update:readyToUploadMessage": null,
    "update:rtlEnabled": null,
    "update:selectButtonText": null,
    "update:showFileList": null,
    "update:tabIndex": null,
    "update:uploadAbortedMessage": null,
    "update:uploadButtonText": null,
    "update:uploadChunk": null,
    "update:uploadCustomData": null,
    "update:uploadedMessage": null,
    "update:uploadFailedMessage": null,
    "update:uploadFile": null,
    "update:uploadHeaders": null,
    "update:uploadMethod": null,
    "update:uploadMode": null,
    "update:uploadUrl": null,
    "update:validationError": null,
    "update:validationErrors": null,
    "update:validationStatus": null,
    "update:value": null,
    "update:visible": null,
    "update:width": null,
  },
  props: {
    abortUpload: Function as PropType<((file: any, uploadInfo?: UploadInfo) => any)>,
    accept: String,
    accessKey: String,
    activeStateEnabled: Boolean,
    allowCanceling: Boolean,
    allowedFileExtensions: Array as PropType<Array<string>>,
    bindingOptions: Object as PropType<Record<string, any>>,
    chunkSize: Number,
    dialogTrigger: {},
    disabled: Boolean,
    dropZone: {},
    elementAttr: Object as PropType<Record<string, any>>,
    focusStateEnabled: Boolean,
    height: [Function, Number, String] as PropType<((() => number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    inputAttr: {},
    invalidFileExtensionMessage: String,
    invalidMaxFileSizeMessage: String,
    invalidMinFileSizeMessage: String,
    isDirty: Boolean,
    isValid: Boolean,
    labelText: String,
    maxFileSize: Number,
    minFileSize: Number,
    multiple: Boolean,
    name: String,
    onBeforeSend: Function as PropType<((e: BeforeSendEvent) => void)>,
    onContentReady: Function as PropType<((e: FileUploaderContentReadyEvent) => void)>,
    onDisposing: Function as PropType<((e: FileUploaderDisposingEvent) => void)>,
    onDropZoneEnter: Function as PropType<((e: DropZoneEnterEvent) => void)>,
    onDropZoneLeave: Function as PropType<((e: DropZoneLeaveEvent) => void)>,
    onFilesUploaded: Function as PropType<((e: FilesUploadedEvent) => void)>,
    onInitialized: Function as PropType<((e: FileUploaderInitializedEvent) => void)>,
    onOptionChanged: Function as PropType<((e: FileUploaderOptionChangedEvent) => void)>,
    onProgress: Function as PropType<((e: ProgressEvent) => void)>,
    onUploadAborted: Function as PropType<((e: UploadAbortedEvent) => void)>,
    onUploaded: Function as PropType<((e: UploadedEvent) => void)>,
    onUploadError: Function as PropType<((e: UploadErrorEvent) => void)>,
    onUploadStarted: Function as PropType<((e: UploadStartedEvent) => void)>,
    onValueChanged: Function as PropType<((e: FileUploaderValueChangedEvent) => void)>,
    progress: Number,
    readOnly: Boolean,
    readyToUploadMessage: String,
    rtlEnabled: Boolean,
    selectButtonText: String,
    showFileList: Boolean,
    tabIndex: Number,
    uploadAbortedMessage: String,
    uploadButtonText: String,
    uploadChunk: Function as PropType<((file: any, uploadInfo: UploadInfo) => any)>,
    uploadCustomData: {},
    uploadedMessage: String,
    uploadFailedMessage: String,
    uploadFile: Function as PropType<((file: any, progressCallback: (() => void)) => any)>,
    uploadHeaders: {},
    uploadMethod: String as PropType<UploadHttpMethod>,
    uploadMode: String as PropType<FileUploadMode>,
    uploadUrl: String,
    validationError: {},
    validationErrors: Array as PropType<Array<any>>,
    validationStatus: String as PropType<ValidationStatus>,
    value: Array as PropType<Array<any>>,
    visible: Boolean,
    width: [Function, Number, String] as PropType<((() => number | string)) | number | string>
  }
};

prepareConfigurationComponentConfig(DxFileUploaderOptionsConfig);

const DxFileUploaderOptions = defineComponent(DxFileUploaderOptionsConfig);

(DxFileUploaderOptions as any).$_optionName = "fileUploaderOptions";

const DxImageUploadConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:fileUploaderOptions": null,
    "update:fileUploadMode": null,
    "update:tabs": null,
    "update:uploadDirectory": null,
    "update:uploadUrl": null,
  },
  props: {
    fileUploaderOptions: Object as PropType<dxFileUploaderOptions | Record<string, any>>,
    fileUploadMode: String as PropType<HtmlEditorImageUploadMode>,
    tabs: Array as PropType<Array<dxHtmlEditorImageUploadTabItem | HtmlEditorImageUploadTab>>,
    uploadDirectory: String,
    uploadUrl: String
  }
};

prepareConfigurationComponentConfig(DxImageUploadConfig);

const DxImageUpload = defineComponent(DxImageUploadConfig);

(DxImageUpload as any).$_optionName = "imageUpload";
(DxImageUpload as any).$_expectedChildren = {
  fileUploaderOptions: { isCollectionItem: false, optionName: "fileUploaderOptions" },
  tab: { isCollectionItem: true, optionName: "tabs" }
};

const DxItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:acceptedValues": null,
    "update:beginGroup": null,
    "update:closeMenuOnClick": null,
    "update:cssClass": null,
    "update:disabled": null,
    "update:formatName": null,
    "update:formatValues": null,
    "update:html": null,
    "update:icon": null,
    "update:items": null,
    "update:locateInMenu": null,
    "update:location": null,
    "update:menuItemTemplate": null,
    "update:name": null,
    "update:options": null,
    "update:selectable": null,
    "update:selected": null,
    "update:showText": null,
    "update:template": null,
    "update:text": null,
    "update:visible": null,
    "update:widget": null,
  },
  props: {
    acceptedValues: Array as PropType<Array<boolean | number | string>>,
    beginGroup: Boolean,
    closeMenuOnClick: Boolean,
    cssClass: String,
    disabled: Boolean,
    formatName: String as PropType<HtmlEditorPredefinedToolbarItem | string>,
    formatValues: Array as PropType<Array<boolean | number | string>>,
    html: String,
    icon: String,
    items: Array as PropType<Array<dxHtmlEditorTableContextMenuItem | HtmlEditorPredefinedContextMenuItem>>,
    locateInMenu: String as PropType<LocateInMenuMode>,
    location: String as PropType<ToolbarItemLocation>,
    menuItemTemplate: {},
    name: String as PropType<HtmlEditorPredefinedContextMenuItem | HtmlEditorPredefinedToolbarItem | string>,
    options: {},
    selectable: Boolean,
    selected: Boolean,
    showText: String as PropType<ShowTextMode>,
    template: {},
    text: String,
    visible: Boolean,
    widget: String as PropType<ToolbarItemComponent>
  }
};

prepareConfigurationComponentConfig(DxItemConfig);

const DxItem = defineComponent(DxItemConfig);

(DxItem as any).$_optionName = "items";
(DxItem as any).$_isCollectionItem = true;

const DxMediaResizingConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:allowedTargets": null,
    "update:enabled": null,
  },
  props: {
    allowedTargets: Array as PropType<Array<string>>,
    enabled: Boolean
  }
};

prepareConfigurationComponentConfig(DxMediaResizingConfig);

const DxMediaResizing = defineComponent(DxMediaResizingConfig);

(DxMediaResizing as any).$_optionName = "mediaResizing";

const DxMentionConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:dataSource": null,
    "update:displayExpr": null,
    "update:itemTemplate": null,
    "update:marker": null,
    "update:minSearchLength": null,
    "update:searchExpr": null,
    "update:searchTimeout": null,
    "update:template": null,
    "update:valueExpr": null,
  },
  props: {
    dataSource: [Array, Object, String] as PropType<Array<any> | DataSource | DataSourceOptions | null | Store | string | Record<string, any>>,
    displayExpr: [Function, String] as PropType<(((item: any) => string)) | string>,
    itemTemplate: {},
    marker: String,
    minSearchLength: Number,
    searchExpr: [Array, Function, String] as PropType<(Array<(() => any) | string>) | ((() => any)) | string>,
    searchTimeout: Number,
    template: {},
    valueExpr: [Function, String] as PropType<((() => void)) | string>
  }
};

prepareConfigurationComponentConfig(DxMentionConfig);

const DxMention = defineComponent(DxMentionConfig);

(DxMention as any).$_optionName = "mentions";
(DxMention as any).$_isCollectionItem = true;

const DxTabConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:name": null,
  },
  props: {
    name: String as PropType<HtmlEditorImageUploadTab>
  }
};

prepareConfigurationComponentConfig(DxTabConfig);

const DxTab = defineComponent(DxTabConfig);

(DxTab as any).$_optionName = "tabs";
(DxTab as any).$_isCollectionItem = true;

const DxTableContextMenuConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:enabled": null,
    "update:items": null,
  },
  props: {
    enabled: Boolean,
    items: Array as PropType<Array<dxHtmlEditorTableContextMenuItem | HtmlEditorPredefinedContextMenuItem>>
  }
};

prepareConfigurationComponentConfig(DxTableContextMenuConfig);

const DxTableContextMenu = defineComponent(DxTableContextMenuConfig);

(DxTableContextMenu as any).$_optionName = "tableContextMenu";
(DxTableContextMenu as any).$_expectedChildren = {
  item: { isCollectionItem: true, optionName: "items" },
  tableContextMenuItem: { isCollectionItem: true, optionName: "items" }
};

const DxTableContextMenuItemConfig = {
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
    "update:template": null,
    "update:text": null,
    "update:visible": null,
  },
  props: {
    beginGroup: Boolean,
    closeMenuOnClick: Boolean,
    disabled: Boolean,
    icon: String,
    items: Array as PropType<Array<dxHtmlEditorTableContextMenuItem | HtmlEditorPredefinedContextMenuItem>>,
    name: String as PropType<HtmlEditorPredefinedContextMenuItem>,
    selectable: Boolean,
    selected: Boolean,
    template: {},
    text: String,
    visible: Boolean
  }
};

prepareConfigurationComponentConfig(DxTableContextMenuItemConfig);

const DxTableContextMenuItem = defineComponent(DxTableContextMenuItemConfig);

(DxTableContextMenuItem as any).$_optionName = "items";
(DxTableContextMenuItem as any).$_isCollectionItem = true;

const DxTableResizingConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:enabled": null,
    "update:minColumnWidth": null,
    "update:minRowHeight": null,
  },
  props: {
    enabled: Boolean,
    minColumnWidth: Number,
    minRowHeight: Number
  }
};

prepareConfigurationComponentConfig(DxTableResizingConfig);

const DxTableResizing = defineComponent(DxTableResizingConfig);

(DxTableResizing as any).$_optionName = "tableResizing";

const DxToolbarConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:container": null,
    "update:items": null,
    "update:multiline": null,
  },
  props: {
    container: {},
    items: Array as PropType<Array<dxHtmlEditorToolbarItem | HtmlEditorPredefinedToolbarItem>>,
    multiline: Boolean
  }
};

prepareConfigurationComponentConfig(DxToolbarConfig);

const DxToolbar = defineComponent(DxToolbarConfig);

(DxToolbar as any).$_optionName = "toolbar";
(DxToolbar as any).$_expectedChildren = {
  item: { isCollectionItem: true, optionName: "items" },
  toolbarItem: { isCollectionItem: true, optionName: "items" }
};

const DxToolbarItemConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:acceptedValues": null,
    "update:cssClass": null,
    "update:disabled": null,
    "update:formatName": null,
    "update:formatValues": null,
    "update:html": null,
    "update:locateInMenu": null,
    "update:location": null,
    "update:menuItemTemplate": null,
    "update:name": null,
    "update:options": null,
    "update:showText": null,
    "update:template": null,
    "update:text": null,
    "update:visible": null,
    "update:widget": null,
  },
  props: {
    acceptedValues: Array as PropType<Array<boolean | number | string>>,
    cssClass: String,
    disabled: Boolean,
    formatName: String as PropType<HtmlEditorPredefinedToolbarItem | string>,
    formatValues: Array as PropType<Array<boolean | number | string>>,
    html: String,
    locateInMenu: String as PropType<LocateInMenuMode>,
    location: String as PropType<ToolbarItemLocation>,
    menuItemTemplate: {},
    name: String as PropType<HtmlEditorPredefinedToolbarItem | string>,
    options: {},
    showText: String as PropType<ShowTextMode>,
    template: {},
    text: String,
    visible: Boolean,
    widget: String as PropType<ToolbarItemComponent>
  }
};

prepareConfigurationComponentConfig(DxToolbarItemConfig);

const DxToolbarItem = defineComponent(DxToolbarItemConfig);

(DxToolbarItem as any).$_optionName = "items";
(DxToolbarItem as any).$_isCollectionItem = true;

const DxVariablesConfig = {
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:dataSource": null,
    "update:escapeChar": null,
  },
  props: {
    dataSource: [Array, Object, String] as PropType<Array<string> | DataSource | DataSourceOptions | null | Store | string | Record<string, any>>,
    escapeChar: [Array, String] as PropType<Array<string> | string>
  }
};

prepareConfigurationComponentConfig(DxVariablesConfig);

const DxVariables = defineComponent(DxVariablesConfig);

(DxVariables as any).$_optionName = "variables";

export default DxHtmlEditor;
export {
  DxHtmlEditor,
  DxConverter,
  DxFileUploaderOptions,
  DxImageUpload,
  DxItem,
  DxMediaResizing,
  DxMention,
  DxTab,
  DxTableContextMenu,
  DxTableContextMenuItem,
  DxTableResizing,
  DxToolbar,
  DxToolbarItem,
  DxVariables
};
import type * as DxHtmlEditorTypes from "devextreme/ui/html_editor_types";
export { DxHtmlEditorTypes };
