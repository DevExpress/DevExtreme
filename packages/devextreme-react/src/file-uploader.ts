"use client"
import dxFileUploader, {
    Properties
} from "devextreme/ui/file_uploader";

import * as PropTypes from "prop-types";
import { Component as BaseComponent, IHtmlOptions } from "./core/component";

import type { BeforeSendEvent, ContentReadyEvent, DisposingEvent, DropZoneEnterEvent, DropZoneLeaveEvent, FilesUploadedEvent, InitializedEvent, ProgressEvent, UploadAbortedEvent, UploadedEvent, UploadErrorEvent, UploadStartedEvent, ValueChangedEvent } from "devextreme/ui/file_uploader";

type ReplaceFieldTypes<TSource, TReplacement> = {
  [P in keyof TSource]: P extends keyof TReplacement ? TReplacement[P] : TSource[P];
}

type IFileUploaderOptionsNarrowedEvents = {
  onBeforeSend?: ((e: BeforeSendEvent) => void);
  onContentReady?: ((e: ContentReadyEvent) => void);
  onDisposing?: ((e: DisposingEvent) => void);
  onDropZoneEnter?: ((e: DropZoneEnterEvent) => void);
  onDropZoneLeave?: ((e: DropZoneLeaveEvent) => void);
  onFilesUploaded?: ((e: FilesUploadedEvent) => void);
  onInitialized?: ((e: InitializedEvent) => void);
  onProgress?: ((e: ProgressEvent) => void);
  onUploadAborted?: ((e: UploadAbortedEvent) => void);
  onUploaded?: ((e: UploadedEvent) => void);
  onUploadError?: ((e: UploadErrorEvent) => void);
  onUploadStarted?: ((e: UploadStartedEvent) => void);
  onValueChanged?: ((e: ValueChangedEvent) => void);
}

type IFileUploaderOptions = React.PropsWithChildren<ReplaceFieldTypes<Properties, IFileUploaderOptionsNarrowedEvents> & IHtmlOptions & {
  defaultValue?: Array<any>;
  onValueChange?: (value: Array<any>) => void;
}>

class FileUploader extends BaseComponent<React.PropsWithChildren<IFileUploaderOptions>> {

  public get instance(): dxFileUploader {
    return this._instance;
  }

  protected _WidgetClass = dxFileUploader;

  protected subscribableOptions = ["value"];

  protected independentEvents = ["onBeforeSend","onContentReady","onDisposing","onDropZoneEnter","onDropZoneLeave","onFilesUploaded","onInitialized","onProgress","onUploadAborted","onUploaded","onUploadError","onUploadStarted","onValueChanged"];

  protected _defaults = {
    defaultValue: "value"
  };
}
(FileUploader as any).propTypes = {
  abortUpload: PropTypes.func,
  accept: PropTypes.string,
  accessKey: PropTypes.string,
  activeStateEnabled: PropTypes.bool,
  allowCanceling: PropTypes.bool,
  allowedFileExtensions: PropTypes.array,
  chunkSize: PropTypes.number,
  disabled: PropTypes.bool,
  elementAttr: PropTypes.object,
  focusStateEnabled: PropTypes.bool,
  height: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ]),
  hint: PropTypes.string,
  hoverStateEnabled: PropTypes.bool,
  invalidFileExtensionMessage: PropTypes.string,
  invalidMaxFileSizeMessage: PropTypes.string,
  invalidMinFileSizeMessage: PropTypes.string,
  isDirty: PropTypes.bool,
  isValid: PropTypes.bool,
  labelText: PropTypes.string,
  maxFileSize: PropTypes.number,
  minFileSize: PropTypes.number,
  multiple: PropTypes.bool,
  name: PropTypes.string,
  onBeforeSend: PropTypes.func,
  onContentReady: PropTypes.func,
  onDisposing: PropTypes.func,
  onDropZoneEnter: PropTypes.func,
  onDropZoneLeave: PropTypes.func,
  onFilesUploaded: PropTypes.func,
  onInitialized: PropTypes.func,
  onOptionChanged: PropTypes.func,
  onProgress: PropTypes.func,
  onUploadAborted: PropTypes.func,
  onUploaded: PropTypes.func,
  onUploadError: PropTypes.func,
  onUploadStarted: PropTypes.func,
  onValueChanged: PropTypes.func,
  progress: PropTypes.number,
  readOnly: PropTypes.bool,
  readyToUploadMessage: PropTypes.string,
  rtlEnabled: PropTypes.bool,
  selectButtonText: PropTypes.string,
  showFileList: PropTypes.bool,
  tabIndex: PropTypes.number,
  uploadAbortedMessage: PropTypes.string,
  uploadButtonText: PropTypes.string,
  uploadChunk: PropTypes.func,
  uploadedMessage: PropTypes.string,
  uploadFailedMessage: PropTypes.string,
  uploadFile: PropTypes.func,
  uploadMethod: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "POST",
      "PUT"])
  ]),
  uploadMode: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "instantly",
      "useButtons",
      "useForm"])
  ]),
  uploadUrl: PropTypes.string,
  validationErrors: PropTypes.array,
  validationStatus: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf([
      "valid",
      "invalid",
      "pending"])
  ]),
  value: PropTypes.array,
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.number,
    PropTypes.string
  ])
};
export default FileUploader;
export {
  FileUploader,
  IFileUploaderOptions
};
import type * as FileUploaderTypes from 'devextreme/ui/file_uploader_types';
export { FileUploaderTypes };

