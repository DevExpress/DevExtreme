import { PropType } from "vue";
import HtmlEditor, { Properties } from "devextreme/ui/html_editor";
import {  ContentReadyEvent , DisposingEvent , FocusInEvent , FocusOutEvent , InitializedEvent , OptionChangedEvent , ValueChangedEvent ,} from "devextreme/ui/html_editor";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";
import { prepareConfigurationComponentConfig } from "./core/index";
import { 
 BeforeSendEvent  as FileUploaderOptionsBeforeSendEvent,
 ContentReadyEvent  as FileUploaderOptionsContentReadyEvent,
 DisposingEvent  as FileUploaderOptionsDisposingEvent,
 DropZoneEnterEvent  as FileUploaderOptionsDropZoneEnterEvent,
 DropZoneLeaveEvent  as FileUploaderOptionsDropZoneLeaveEvent,
 FilesUploadedEvent  as FileUploaderOptionsFilesUploadedEvent,
 InitializedEvent  as FileUploaderOptionsInitializedEvent,
 OptionChangedEvent  as FileUploaderOptionsOptionChangedEvent,
 ProgressEvent  as FileUploaderOptionsProgressEvent,
 UploadAbortedEvent  as FileUploaderOptionsUploadAbortedEvent,
 UploadedEvent  as FileUploaderOptionsUploadedEvent,
 UploadErrorEvent  as FileUploaderOptionsUploadErrorEvent,
 UploadStartedEvent  as FileUploaderOptionsUploadStartedEvent,
 ValueChangedEvent  as FileUploaderOptionsValueChangedEvent,
} from "devextreme/ui/file_uploader";

type AccessibleOptions = Pick<Properties,
  "accessKey" |
  "activeStateEnabled" |
  "allowSoftLineBreak" |
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
  "valueType" |
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
    customizeModules: Function as PropType<(config: Object) => void>,
    disabled: Boolean,
    elementAttr: Object,
    focusStateEnabled: Boolean,
    height: [Function, Number, String] as PropType<(() => (number | string)) | number | string>,
    hint: String,
    hoverStateEnabled: Boolean,
    imageUpload: Object,
    isDirty: Boolean,
    isValid: Boolean,
    mediaResizing: Object,
    mentions: Array as PropType<Array<Object>>,
    name: String,
    onContentReady: Function as PropType<(e: ContentReadyEvent) => void>,
    onDisposing: Function as PropType<(e: DisposingEvent) => void>,
    onFocusIn: Function as PropType<(e: FocusInEvent) => void>,
    onFocusOut: Function as PropType<(e: FocusOutEvent) => void>,
    onInitialized: Function as PropType<(e: InitializedEvent) => void>,
    onOptionChanged: Function as PropType<(e: OptionChangedEvent) => void>,
    onValueChanged: Function as PropType<(e: ValueChangedEvent) => void>,
    placeholder: String,
    readOnly: Boolean,
    rtlEnabled: Boolean,
    stylingMode: String as PropType<"outlined" | "underlined" | "filled">,
    tabIndex: Number,
    tableContextMenu: Object,
    tableResizing: Object,
    toolbar: Object,
    validationError: {},
    validationErrors: Array as PropType<Array<any>>,
    validationMessageMode: String as PropType<"always" | "auto">,
    validationMessagePosition: String as PropType<"bottom" | "left" | "right" | "top">,
    validationStatus: String as PropType<"valid" | "invalid" | "pending">,
    value: {},
    valueType: String as PropType<"html" | "markdown">,
    variables: Object,
    visible: Boolean,
    width: [Function, Number, String] as PropType<(() => (number | string)) | number | string>
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:allowSoftLineBreak": null,
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
    "update:valueType": null,
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
    abortUpload: Function as PropType<(file: any, uploadInfo?: Object) => any>,
    accept: String,
    accessKey: String,
    activeStateEnabled: Boolean,
    allowCanceling: Boolean,
    allowedFileExtensions: Array as PropType<Array<string>>,
    bindingOptions: Object,
    chunkSize: Number,
    dialogTrigger: {},
    disabled: Boolean,
    dropZone: {},
    elementAttr: Object,
    focusStateEnabled: Boolean,
    height: [Function, Number, String] as PropType<(() => (number | string)) | number | string>,
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
    onBeforeSend: Function as PropType<(e: FileUploaderOptionsBeforeSendEvent) => void>,
    onContentReady: Function as PropType<(e: FileUploaderOptionsContentReadyEvent) => void>,
    onDisposing: Function as PropType<(e: FileUploaderOptionsDisposingEvent) => void>,
    onDropZoneEnter: Function as PropType<(e: FileUploaderOptionsDropZoneEnterEvent) => void>,
    onDropZoneLeave: Function as PropType<(e: FileUploaderOptionsDropZoneLeaveEvent) => void>,
    onFilesUploaded: Function as PropType<(e: FileUploaderOptionsFilesUploadedEvent) => void>,
    onInitialized: Function as PropType<(e: FileUploaderOptionsInitializedEvent) => void>,
    onOptionChanged: Function as PropType<(e: FileUploaderOptionsOptionChangedEvent) => void>,
    onProgress: Function as PropType<(e: FileUploaderOptionsProgressEvent) => void>,
    onUploadAborted: Function as PropType<(e: FileUploaderOptionsUploadAbortedEvent) => void>,
    onUploaded: Function as PropType<(e: FileUploaderOptionsUploadedEvent) => void>,
    onUploadError: Function as PropType<(e: FileUploaderOptionsUploadErrorEvent) => void>,
    onUploadStarted: Function as PropType<(e: FileUploaderOptionsUploadStartedEvent) => void>,
    onValueChanged: Function as PropType<(e: FileUploaderOptionsValueChangedEvent) => void>,
    progress: Number,
    readOnly: Boolean,
    readyToUploadMessage: String,
    rtlEnabled: Boolean,
    selectButtonText: String,
    showFileList: Boolean,
    tabIndex: Number,
    uploadAbortedMessage: String,
    uploadButtonText: String,
    uploadChunk: Function as PropType<(file: any, uploadInfo: Object) => any>,
    uploadCustomData: {},
    uploadedMessage: String,
    uploadFailedMessage: String,
    uploadFile: Function as PropType<(file: any, progressCallback: () => void) => any>,
    uploadHeaders: {},
    uploadMethod: String as PropType<"POST" | "PUT">,
    uploadMode: String as PropType<"instantly" | "useButtons" | "useForm">,
    uploadUrl: String,
    validationError: {},
    validationErrors: Array as PropType<Array<any>>,
    validationStatus: String as PropType<"valid" | "invalid" | "pending">,
    value: Array as PropType<Array<any>>,
    visible: Boolean,
    width: [Function, Number, String] as PropType<(() => (number | string)) | number | string>
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
    fileUploaderOptions: Object,
    fileUploadMode: String as PropType<"base64" | "server" | "both">,
    tabs: Array as PropType<Array<Object> | Array<"url" | "file">>,
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
    acceptedValues: Array as PropType<Array<Boolean> | Array<number> | Array<string>>,
    beginGroup: Boolean,
    closeMenuOnClick: Boolean,
    cssClass: String,
    disabled: Boolean,
    formatName: String as PropType<"background" | "bold" | "color" | "font" | "italic" | "link" | "image" | "size" | "strike" | "subscript" | "superscript" | "underline" | "blockquote" | "header" | "increaseIndent" | "decreaseIndent" | "orderedList" | "bulletList" | "alignLeft" | "alignCenter" | "alignRight" | "alignJustify" | "codeBlock" | "variable" | "separator" | "undo" | "redo" | "clear" | "cellProperties" | "tableProperties" | "insertTable" | "insertHeaderRow" | "insertRowAbove" | "insertRowBelow" | "insertColumnLeft" | "insertColumnRight" | "deleteColumn" | "deleteRow" | "deleteTable">,
    formatValues: Array as PropType<Array<Boolean> | Array<number> | Array<string>>,
    html: String,
    icon: String,
    items: Array as PropType<Array<Object> | Array<"background" | "bold" | "color" | "font" | "italic" | "link" | "image" | "strike" | "subscript" | "superscript" | "underline" | "blockquote" | "increaseIndent" | "decreaseIndent" | "orderedList" | "bulletList" | "alignLeft" | "alignCenter" | "alignRight" | "alignJustify" | "codeBlock" | "variable" | "undo" | "redo" | "clear" | "insertTable" | "insertHeaderRow" | "insertRowAbove" | "insertRowBelow" | "insertColumnLeft" | "insertColumnRight" | "deleteColumn" | "deleteRow" | "deleteTable" | "cellProperties" | "tableProperties">>,
    locateInMenu: String as PropType<"always" | "auto" | "never">,
    location: String as PropType<"after" | "before" | "center">,
    menuItemTemplate: {},
    name: String as PropType<"background" | "bold" | "color" | "font" | "italic" | "link" | "image" | "strike" | "subscript" | "superscript" | "underline" | "blockquote" | "increaseIndent" | "decreaseIndent" | "orderedList" | "bulletList" | "alignLeft" | "alignCenter" | "alignRight" | "alignJustify" | "codeBlock" | "variable" | "undo" | "redo" | "clear" | "insertTable" | "insertHeaderRow" | "insertRowAbove" | "insertRowBelow" | "insertColumnLeft" | "insertColumnRight" | "deleteColumn" | "deleteRow" | "deleteTable" | "cellProperties" | "tableProperties" | "size" | "header" | "separator">,
    options: {},
    selectable: Boolean,
    selected: Boolean,
    showText: String as PropType<"always" | "inMenu">,
    template: {},
    text: String,
    visible: Boolean,
    widget: String as PropType<"dxAutocomplete" | "dxButton" | "dxButtonGroup" | "dxCheckBox" | "dxDateBox" | "dxDropDownButton" | "dxMenu" | "dxSelectBox" | "dxSwitch" | "dxTabs" | "dxTextBox">
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
    dataSource: {},
    displayExpr: [Function, String] as PropType<((item: Object) => string) | string>,
    itemTemplate: {},
    marker: String,
    minSearchLength: Number,
    searchExpr: [Array, Function, String] as PropType<(Array<Function> | Array<string>) | Function | string>,
    searchTimeout: Number,
    template: {},
    valueExpr: [Function, String] as PropType<(() => void) | string>
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
    name: String as PropType<"url" | "file">
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
    items: Array as PropType<Array<Object> | Array<"background" | "bold" | "color" | "font" | "italic" | "link" | "image" | "strike" | "subscript" | "superscript" | "underline" | "blockquote" | "increaseIndent" | "decreaseIndent" | "orderedList" | "bulletList" | "alignLeft" | "alignCenter" | "alignRight" | "alignJustify" | "codeBlock" | "variable" | "undo" | "redo" | "clear" | "insertTable" | "insertHeaderRow" | "insertRowAbove" | "insertRowBelow" | "insertColumnLeft" | "insertColumnRight" | "deleteColumn" | "deleteRow" | "deleteTable" | "cellProperties" | "tableProperties">>
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
    items: Array as PropType<Array<Object> | Array<"background" | "bold" | "color" | "font" | "italic" | "link" | "image" | "strike" | "subscript" | "superscript" | "underline" | "blockquote" | "increaseIndent" | "decreaseIndent" | "orderedList" | "bulletList" | "alignLeft" | "alignCenter" | "alignRight" | "alignJustify" | "codeBlock" | "variable" | "undo" | "redo" | "clear" | "insertTable" | "insertHeaderRow" | "insertRowAbove" | "insertRowBelow" | "insertColumnLeft" | "insertColumnRight" | "deleteColumn" | "deleteRow" | "deleteTable" | "cellProperties" | "tableProperties">>,
    name: String as PropType<"background" | "bold" | "color" | "font" | "italic" | "link" | "image" | "strike" | "subscript" | "superscript" | "underline" | "blockquote" | "increaseIndent" | "decreaseIndent" | "orderedList" | "bulletList" | "alignLeft" | "alignCenter" | "alignRight" | "alignJustify" | "codeBlock" | "variable" | "undo" | "redo" | "clear" | "insertTable" | "insertHeaderRow" | "insertRowAbove" | "insertRowBelow" | "insertColumnLeft" | "insertColumnRight" | "deleteColumn" | "deleteRow" | "deleteTable" | "cellProperties" | "tableProperties">,
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
    items: Array as PropType<Array<Object> | Array<"background" | "bold" | "color" | "font" | "italic" | "link" | "image" | "size" | "strike" | "subscript" | "superscript" | "underline" | "blockquote" | "header" | "increaseIndent" | "decreaseIndent" | "orderedList" | "bulletList" | "alignLeft" | "alignCenter" | "alignRight" | "alignJustify" | "codeBlock" | "variable" | "separator" | "undo" | "redo" | "clear" | "cellProperties" | "tableProperties" | "insertTable" | "insertHeaderRow" | "insertRowAbove" | "insertRowBelow" | "insertColumnLeft" | "insertColumnRight" | "deleteColumn" | "deleteRow" | "deleteTable">>,
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
    acceptedValues: Array as PropType<Array<Boolean> | Array<number> | Array<string>>,
    cssClass: String,
    disabled: Boolean,
    formatName: String as PropType<"background" | "bold" | "color" | "font" | "italic" | "link" | "image" | "size" | "strike" | "subscript" | "superscript" | "underline" | "blockquote" | "header" | "increaseIndent" | "decreaseIndent" | "orderedList" | "bulletList" | "alignLeft" | "alignCenter" | "alignRight" | "alignJustify" | "codeBlock" | "variable" | "separator" | "undo" | "redo" | "clear" | "cellProperties" | "tableProperties" | "insertTable" | "insertHeaderRow" | "insertRowAbove" | "insertRowBelow" | "insertColumnLeft" | "insertColumnRight" | "deleteColumn" | "deleteRow" | "deleteTable">,
    formatValues: Array as PropType<Array<Boolean> | Array<number> | Array<string>>,
    html: String,
    locateInMenu: String as PropType<"always" | "auto" | "never">,
    location: String as PropType<"after" | "before" | "center">,
    menuItemTemplate: {},
    name: String as PropType<"background" | "bold" | "color" | "font" | "italic" | "link" | "image" | "size" | "strike" | "subscript" | "superscript" | "underline" | "blockquote" | "header" | "increaseIndent" | "decreaseIndent" | "orderedList" | "bulletList" | "alignLeft" | "alignCenter" | "alignRight" | "alignJustify" | "codeBlock" | "variable" | "separator" | "undo" | "redo" | "clear" | "cellProperties" | "tableProperties" | "insertTable" | "insertHeaderRow" | "insertRowAbove" | "insertRowBelow" | "insertColumnLeft" | "insertColumnRight" | "deleteColumn" | "deleteRow" | "deleteTable">,
    options: {},
    showText: String as PropType<"always" | "inMenu">,
    template: {},
    text: String,
    visible: Boolean,
    widget: String as PropType<"dxAutocomplete" | "dxButton" | "dxButtonGroup" | "dxCheckBox" | "dxDateBox" | "dxDropDownButton" | "dxMenu" | "dxSelectBox" | "dxSwitch" | "dxTabs" | "dxTextBox">
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
    dataSource: {},
    escapeChar: [Array, String] as PropType<Array<string> | string>
  }
};

prepareConfigurationComponentConfig(DxVariablesConfig);

const DxVariables = defineComponent(DxVariablesConfig);

(DxVariables as any).$_optionName = "variables";

export default DxHtmlEditor;
export {
  DxHtmlEditor,
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
