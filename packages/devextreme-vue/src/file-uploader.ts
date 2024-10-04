import { PropType } from "vue";
import FileUploader, { Properties } from "devextreme/ui/file_uploader";
import {  BeforeSendEvent , ContentReadyEvent , DisposingEvent , DropZoneEnterEvent , DropZoneLeaveEvent , FilesUploadedEvent , InitializedEvent , OptionChangedEvent , ProgressEvent , UploadAbortedEvent , UploadedEvent , UploadErrorEvent , UploadStartedEvent , ValueChangedEvent ,} from "devextreme/ui/file_uploader";
import { defineComponent } from "vue";
import { prepareComponentConfig } from "./core/index";

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
  "isDirty" |
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

const componentConfig = {
  props: {
    abortUpload: Function as PropType<(file: any, uploadInfo?: Object) => any>,
    accept: String,
    accessKey: String,
    activeStateEnabled: Boolean,
    allowCanceling: Boolean,
    allowedFileExtensions: Array as PropType<Array<string>>,
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
    onBeforeSend: Function as PropType<(e: BeforeSendEvent) => void>,
    onContentReady: Function as PropType<(e: ContentReadyEvent) => void>,
    onDisposing: Function as PropType<(e: DisposingEvent) => void>,
    onDropZoneEnter: Function as PropType<(e: DropZoneEnterEvent) => void>,
    onDropZoneLeave: Function as PropType<(e: DropZoneLeaveEvent) => void>,
    onFilesUploaded: Function as PropType<(e: FilesUploadedEvent) => void>,
    onInitialized: Function as PropType<(e: InitializedEvent) => void>,
    onOptionChanged: Function as PropType<(e: OptionChangedEvent) => void>,
    onProgress: Function as PropType<(e: ProgressEvent) => void>,
    onUploadAborted: Function as PropType<(e: UploadAbortedEvent) => void>,
    onUploaded: Function as PropType<(e: UploadedEvent) => void>,
    onUploadError: Function as PropType<(e: UploadErrorEvent) => void>,
    onUploadStarted: Function as PropType<(e: UploadStartedEvent) => void>,
    onValueChanged: Function as PropType<(e: ValueChangedEvent) => void>,
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
    uploadMethod: {},
    uploadMode: {},
    uploadUrl: String,
    validationError: {},
    validationErrors: Array as PropType<Array<any>>,
    validationStatus: {},
    value: Array as PropType<Array<any>>,
    visible: Boolean,
    width: [Function, Number, String] as PropType<(() => (number | string)) | number | string>
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
  computed: {
    instance(): FileUploader {
      return (this as any).$_instance;
    }
  },
  beforeCreate() {
    (this as any).$_WidgetClass = FileUploader;
    (this as any).$_hasAsyncTemplate = true;
  }
};

prepareComponentConfig(componentConfig);

const DxFileUploader = defineComponent(componentConfig);

export default DxFileUploader;
export {
  DxFileUploader
};
import type * as DxFileUploaderTypes from "devextreme/ui/file_uploader_types";
export { DxFileUploaderTypes };
