import FileUploader, { Properties } from "devextreme/ui/file_uploader";
import { createComponent } from "./core/index";

type AccessibleOptions = Pick<Properties,
  "abortUpload" |
  "accept" |
  "accessKey" |
  "activeStateEnabled" |
  "allowCanceling" |
  "allowedFileExtensions" |
  "chunkSize" |
  "dialogTrigger" |
  "disabled" |
  "dropZone" |
  "elementAttr" |
  "focusStateEnabled" |
  "height" |
  "hint" |
  "hoverStateEnabled" |
  "inputAttr" |
  "invalidFileExtensionMessage" |
  "invalidMaxFileSizeMessage" |
  "invalidMinFileSizeMessage" |
  "isValid" |
  "labelText" |
  "maxFileSize" |
  "minFileSize" |
  "multiple" |
  "name" |
  "onBeforeSend" |
  "onContentReady" |
  "onDisposing" |
  "onDropZoneEnter" |
  "onDropZoneLeave" |
  "onFilesUploaded" |
  "onInitialized" |
  "onOptionChanged" |
  "onProgress" |
  "onUploadAborted" |
  "onUploaded" |
  "onUploadError" |
  "onUploadStarted" |
  "onValueChanged" |
  "progress" |
  "readOnly" |
  "readyToUploadMessage" |
  "rtlEnabled" |
  "selectButtonText" |
  "showFileList" |
  "tabIndex" |
  "uploadAbortedMessage" |
  "uploadButtonText" |
  "uploadChunk" |
  "uploadCustomData" |
  "uploadedMessage" |
  "uploadFailedMessage" |
  "uploadFile" |
  "uploadHeaders" |
  "uploadMethod" |
  "uploadMode" |
  "uploadUrl" |
  "validationError" |
  "validationErrors" |
  "validationStatus" |
  "value" |
  "visible" |
  "width"
>;

interface DxFileUploader extends AccessibleOptions {
  readonly instance?: FileUploader;
}
const DxFileUploader = createComponent({
  props: {
    abortUpload: Function,
    accept: String,
    accessKey: String,
    activeStateEnabled: Boolean,
    allowCanceling: Boolean,
    allowedFileExtensions: Array,
    chunkSize: Number,
    dialogTrigger: {},
    disabled: Boolean,
    dropZone: {},
    elementAttr: Object,
    focusStateEnabled: Boolean,
    height: [Function, Number, String],
    hint: String,
    hoverStateEnabled: Boolean,
    inputAttr: {},
    invalidFileExtensionMessage: String,
    invalidMaxFileSizeMessage: String,
    invalidMinFileSizeMessage: String,
    isValid: Boolean,
    labelText: String,
    maxFileSize: Number,
    minFileSize: Number,
    multiple: Boolean,
    name: String,
    onBeforeSend: Function,
    onContentReady: Function,
    onDisposing: Function,
    onDropZoneEnter: Function,
    onDropZoneLeave: Function,
    onFilesUploaded: Function,
    onInitialized: Function,
    onOptionChanged: Function,
    onProgress: Function,
    onUploadAborted: Function,
    onUploaded: Function,
    onUploadError: Function,
    onUploadStarted: Function,
    onValueChanged: Function,
    progress: Number,
    readOnly: Boolean,
    readyToUploadMessage: String,
    rtlEnabled: Boolean,
    selectButtonText: String,
    showFileList: Boolean,
    tabIndex: Number,
    uploadAbortedMessage: String,
    uploadButtonText: String,
    uploadChunk: Function,
    uploadCustomData: {},
    uploadedMessage: String,
    uploadFailedMessage: String,
    uploadFile: Function,
    uploadHeaders: {},
    uploadMethod: String,
    uploadMode: String,
    uploadUrl: String,
    validationError: {},
    validationErrors: Array,
    validationStatus: String,
    value: Array,
    visible: Boolean,
    width: [Function, Number, String]
  },
  emits: {
    "update:isActive": null,
    "update:hoveredElement": null,
    "update:abortUpload": null,
    "update:accept": null,
    "update:accessKey": null,
    "update:activeStateEnabled": null,
    "update:allowCanceling": null,
    "update:allowedFileExtensions": null,
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
  computed: {
    instance(): FileUploader {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = FileUploader;
  }
});

export default DxFileUploader;
export {
  DxFileUploader
};
import type * as DxFileUploaderTypes from "devextreme/ui/file_uploader_types";
export { DxFileUploaderTypes };
