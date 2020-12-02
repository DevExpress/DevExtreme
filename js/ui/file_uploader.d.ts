import '../jquery_augmentation';

import {
    dxElement
} from '../core/element';

import {
    event
} from '../events/index';

import Editor, {
    EditorOptions
} from './editor/editor';

import UploadInfo from '../file_management/upload_info';

export interface dxFileUploaderOptions extends EditorOptions<dxFileUploader> {
    /**
     * @docid dxFileUploaderOptions.abortUpload
     * @type function
     * @type_function_param1 file:File
     * @type_function_param2 uploadInfo?:UploadInfo
     * @type_function_return Promise<any>|any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    abortUpload?: ((file: File, uploadInfo?: UploadInfo) => Promise<any> | JQueryPromise<any> | any);
    /**
     * @docid dxFileUploaderOptions.accept
     * @type string
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    accept?: string;
    /**
     * @docid dxFileUploaderOptions.allowCanceling
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowCanceling?: boolean;
    /**
     * @docid dxFileUploaderOptions.allowedFileExtensions
     * @type Array<string>
     * @default []
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowedFileExtensions?: Array<string>;
    /**
     * @docid dxFileUploaderOptions.chunkSize
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    chunkSize?: number;
    /**
     * @docid dxFileUploaderOptions.focusStateEnabled
     * @type boolean
     * @default true [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid dxFileUploaderOptions.invalidFileExtensionMessage
     * @type string
     * @default "File type is not allowed"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    invalidFileExtensionMessage?: string;
    /**
     * @docid dxFileUploaderOptions.invalidMaxFileSizeMessage
     * @type string
     * @default "File is too large"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    invalidMaxFileSizeMessage?: string;
    /**
     * @docid dxFileUploaderOptions.invalidMinFileSizeMessage
     * @type string
     * @default "File is too small"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    invalidMinFileSizeMessage?: string;
    /**
     * @docid dxFileUploaderOptions.inputAttr
     * @type object
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    inputAttr?: any;
    /**
     * @docid dxFileUploaderOptions.labelText
     * @type string
     * @default "or Drop file here"
     * @default "" [for](InternetExplorer|desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    labelText?: string;
    /**
     * @docid dxFileUploaderOptions.maxFileSize
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxFileSize?: number;
    /**
     * @docid dxFileUploaderOptions.minFileSize
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    minFileSize?: number;
    /**
     * @docid dxFileUploaderOptions.multiple
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    multiple?: boolean;
    /**
     * @docid dxFileUploaderOptions.name
     * @type string
     * @default "files[]"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid dxFileUploaderOptions.onBeforeSend
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 request: XMLHttpRequest
     * @type_function_param1_field5 file:File
     * @type_function_param1_field6 uploadInfo:UploadInfo
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onBeforeSend?: ((e: { component?: dxFileUploader, element?: dxElement, model?: any, request?: XMLHttpRequest, file?: File, uploadInfo?: UploadInfo }) => any);
    /**
     * @docid dxFileUploaderOptions.onDropZoneEnter
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 dropZoneElement:dxElement
     * @type_function_param1_field5 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onDropZoneEnter?: ((e: { component?: dxFileUploader, element?: dxElement, model?: any, dropZoneElement?: dxElement, event?: event }) => any);
    /**
     * @docid dxFileUploaderOptions.onDropZoneLeave
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 dropZoneElement:dxElement
     * @type_function_param1_field5 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onDropZoneLeave?: ((e: { component?: dxFileUploader, element?: dxElement, model?: any, dropZoneElement?: dxElement, event?: event }) => any);
    /**
     * @docid dxFileUploaderOptions.onFilesUploaded
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onFilesUploaded?: ((e: { component?: dxFileUploader, element?: dxElement, model?: any }) => any);
    /**
     * @docid dxFileUploaderOptions.onProgress
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 file:File
     * @type_function_param1_field5 segmentSize:Number
     * @type_function_param1_field6 bytesLoaded:Number
     * @type_function_param1_field7 bytesTotal:Number
     * @type_function_param1_field8 event:event
     * @type_function_param1_field9 request:XMLHttpRequest
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onProgress?: ((e: { component?: dxFileUploader, element?: dxElement, model?: any, file?: File, segmentSize?: number, bytesLoaded?: number, bytesTotal?: number, event?: event, request?: XMLHttpRequest }) => any);
    /**
     * @docid dxFileUploaderOptions.onUploadAborted
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 file:File
     * @type_function_param1_field5 event:event
     * @type_function_param1_field6 request:XMLHttpRequest
     * @type_function_param1_field7 message:string
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onUploadAborted?: ((e: { component?: dxFileUploader, element?: dxElement, model?: any, file?: File, event?: event, request?: XMLHttpRequest, message?: string }) => any);
    /**
     * @docid dxFileUploaderOptions.onUploadError
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 file:File
     * @type_function_param1_field5 event:event
     * @type_function_param1_field6 request:XMLHttpRequest
     * @type_function_param1_field7 error:any
     * @type_function_param1_field8 message:string
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onUploadError?: ((e: { component?: dxFileUploader, element?: dxElement, model?: any, file?: File, event?: event, request?: XMLHttpRequest, error?: any, message?: string }) => any);
    /**
     * @docid dxFileUploaderOptions.onUploadStarted
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 file:File
     * @type_function_param1_field5 event:event
     * @type_function_param1_field6 request:XMLHttpRequest
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onUploadStarted?: ((e: { component?: dxFileUploader, element?: dxElement, model?: any, file?: File, event?: event, request?: XMLHttpRequest }) => any);
    /**
     * @docid dxFileUploaderOptions.onUploaded
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 file:File
     * @type_function_param1_field5 event:event
     * @type_function_param1_field6 request:XMLHttpRequest
     * @type_function_param1_field7 message:string
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onUploaded?: ((e: { component?: dxFileUploader, element?: dxElement, model?: any, file?: File, event?: event, request?: XMLHttpRequest, message?: string }) => any);
    /**
     * @docid dxFileUploaderOptions.onValueChanged
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 value:Array<File>
     * @type_function_param1_field5 previousValue:Array<File>
     * @type_function_param1_field6 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onValueChanged?: ((e: { component?: dxFileUploader, element?: dxElement, model?: any, value?: Array<File>, previousValue?: Array<File>, event?: event }) => any);
    /**
     * @docid dxFileUploaderOptions.progress
     * @type number
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    progress?: number;
    /**
     * @docid dxFileUploaderOptions.readyToUploadMessage
     * @type string
     * @default "Ready to upload"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    readyToUploadMessage?: string;
    /**
     * @docid dxFileUploaderOptions.selectButtonText
     * @type string
     * @default "Select File"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectButtonText?: string;
    /**
     * @docid dxFileUploaderOptions.showFileList
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showFileList?: boolean;
    /**
     * @docid dxFileUploaderOptions.dialogTrigger
     * @type string|Element|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dialogTrigger?: string | Element | JQuery;
    /**
     * @docid dxFileUploaderOptions.dropZone
     * @type string|Element|jQuery
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dropZone?: string | Element | JQuery;
    /**
     * @docid dxFileUploaderOptions.uploadButtonText
     * @type string
     * @default "Upload"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    uploadButtonText?: string;
    /**
     * @docid dxFileUploaderOptions.uploadChunk
     * @type function
     * @type_function_param1 file:File
     * @type_function_param2 uploadInfo:UploadInfo
     * @type_function_return Promise<any>|any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    uploadChunk?: ((file: File, uploadInfo: UploadInfo) => Promise<any> | JQueryPromise<any> | any);
    /**
     * @docid dxFileUploaderOptions.uploadFailedMessage
     * @type string
     * @default "Upload failed"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    uploadFailedMessage?: string;
    /**
     * @docid dxFileUploaderOptions.uploadAbortedMessage
     * @type string
     * @default "Upload cancelled"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    uploadAbortedMessage?: string;
    /**
     * @docid dxFileUploaderOptions.uploadFile
     * @type function
     * @type_function_param1 file:File
     * @type_function_param2 progressCallback:Function
     * @type_function_return Promise<any>|any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    uploadFile?: ((file: File, progressCallback: Function) => Promise<any> | JQueryPromise<any> | any);
    /**
     * @docid dxFileUploaderOptions.uploadHeaders
     * @type object
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    uploadHeaders?: any;
    /**
     * @docid dxFileUploaderOptions.uploadCustomData
     * @type object
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    uploadCustomData?: any;
    /**
     * @docid dxFileUploaderOptions.uploadMethod
     * @type Enums.UploadHttpMethod
     * @default "POST"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    uploadMethod?: 'POST' | 'PUT';
    /**
     * @docid dxFileUploaderOptions.uploadMode
     * @type Enums.FileUploadMode
     * @default "instantly"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    uploadMode?: 'instantly' | 'useButtons' | 'useForm';
    /**
     * @docid dxFileUploaderOptions.uploadUrl
     * @type string
     * @default "/"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    uploadUrl?: string;
    /**
     * @docid dxFileUploaderOptions.uploadedMessage
     * @type string
     * @default "Uploaded"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    uploadedMessage?: string;
    /**
     * @docid dxFileUploaderOptions.value
     * @type Array<File>
     * @default []
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: Array<File>;
}
/**
 * @docid dxFileUploader
 * @inherits Editor
 * @module ui/file_uploader
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxFileUploader extends Editor {
    constructor(element: Element, options?: dxFileUploaderOptions)
    constructor(element: JQuery, options?: dxFileUploaderOptions)
    /**
     * @docid dxFileUploaderMethods.upload
     * @publicName upload()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    upload(): void;
    /**
     * @docid dxFileUploaderMethods.upload
     * @publicName upload(fileIndex)
     * @param1 fileIndex:number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    upload(fileIndex: number): void;
    /**
     * @docid dxFileUploaderMethods.upload
     * @publicName upload(file)
     * @param1 file:File
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    upload(file: File): void;
    /**
     * @docid dxFileUploaderMethods.abortUpload
     * @publicName abortUpload()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    abortUpload(): void;
    /**
     * @docid dxFileUploaderMethods.abortUpload
     * @publicName abortUpload(fileIndex)
     * @param1 fileIndex:number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    abortUpload(fileIndex: number): void;
    /**
     * @docid dxFileUploaderMethods.abortUpload
     * @publicName abortUpload(file)
     * @param1 file:File
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    abortUpload(file: File): void;
    /**
     * @docid dxFileUploaderMethods.removeFile
     * @publicName removeFile(fileIndex)
     * @param1 fileIndex:number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    removeFile(fileIndex: number): void;
    /**
     * @docid dxFileUploaderMethods.removeFile
     * @publicName removeFile(file)
     * @param1 file:File
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    removeFile(file: File): void;
}

declare global {
interface JQuery {
    dxFileUploader(): JQuery;
    dxFileUploader(options: "instance"): dxFileUploader;
    dxFileUploader(options: string): any;
    dxFileUploader(options: string, ...params: any[]): any;
    dxFileUploader(options: dxFileUploaderOptions): JQuery;
}
}
export type Options = dxFileUploaderOptions;

/** @deprecated use Options instead */
export type IOptions = dxFileUploaderOptions;
