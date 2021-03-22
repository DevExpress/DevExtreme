import {
    TElement
} from '../core/element';

import {
    TPromise
} from '../core/utils/deferred';

import {
    TEvent
} from '../events/index';

import Editor, {
    EditorOptions
} from './editor/editor';

import UploadInfo from '../file_management/upload_info';

export interface dxFileUploaderOptions extends EditorOptions<dxFileUploader> {
    /**
     * @docid
     * @type_function_param1 file:File
     * @type_function_param2 uploadInfo?:UploadInfo
     * @type_function_return Promise<any>|any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    abortUpload?: ((file: File, uploadInfo?: UploadInfo) => TPromise<any> | any);
    /**
     * @docid
     * @default ""
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    accept?: string;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowCanceling?: boolean;
    /**
     * @docid
     * @default []
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    allowedFileExtensions?: Array<string>;
    /**
     * @docid
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    chunkSize?: number;
    /**
     * @docid
     * @default true [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default "File type is not allowed"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    invalidFileExtensionMessage?: string;
    /**
     * @docid
     * @default "File is too large"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    invalidMaxFileSizeMessage?: string;
    /**
     * @docid
     * @default "File is too small"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    invalidMinFileSizeMessage?: string;
    /**
     * @docid
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    inputAttr?: any;
    /**
     * @docid
     * @default "or Drop file here"
     * @default "" [for](InternetExplorer|desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    labelText?: string;
    /**
     * @docid
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    maxFileSize?: number;
    /**
     * @docid
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    minFileSize?: number;
    /**
     * @docid
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    multiple?: boolean;
    /**
     * @docid
     * @default "files[]"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 request: XMLHttpRequest
     * @type_function_param1_field5 file:File
     * @type_function_param1_field6 uploadInfo:UploadInfo
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onBeforeSend?: ((e: { component?: dxFileUploader, element?: TElement, model?: any, request?: XMLHttpRequest, file?: File, uploadInfo?: UploadInfo }) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 dropZoneElement:dxElement
     * @type_function_param1_field5 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onDropZoneEnter?: ((e: { component?: dxFileUploader, element?: TElement, model?: any, dropZoneElement?: TElement, event?: TEvent }) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 dropZoneElement:dxElement
     * @type_function_param1_field5 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onDropZoneLeave?: ((e: { component?: dxFileUploader, element?: TElement, model?: any, dropZoneElement?: TElement, event?: TEvent }) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onFilesUploaded?: ((e: { component?: dxFileUploader, element?: TElement, model?: any }) => void);
    /**
     * @docid
     * @default null
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
    onProgress?: ((e: { component?: dxFileUploader, element?: TElement, model?: any, file?: File, segmentSize?: number, bytesLoaded?: number, bytesTotal?: number, event?: TEvent, request?: XMLHttpRequest }) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 file:File
     * @type_function_param1_field5 event:event
     * @type_function_param1_field6 request:XMLHttpRequest
     * @type_function_param1_field7 message:string
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onUploadAborted?: ((e: { component?: dxFileUploader, element?: TElement, model?: any, file?: File, event?: TEvent, request?: XMLHttpRequest, message?: string }) => void);
    /**
     * @docid
     * @default null
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
    onUploadError?: ((e: { component?: dxFileUploader, element?: TElement, model?: any, file?: File, event?: TEvent, request?: XMLHttpRequest, error?: any, message?: string }) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 file:File
     * @type_function_param1_field5 event:event
     * @type_function_param1_field6 request:XMLHttpRequest
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onUploadStarted?: ((e: { component?: dxFileUploader, element?: TElement, model?: any, file?: File, event?: TEvent, request?: XMLHttpRequest }) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 file:File
     * @type_function_param1_field5 event:event
     * @type_function_param1_field6 request:XMLHttpRequest
     * @type_function_param1_field7 message:string
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onUploaded?: ((e: { component?: dxFileUploader, element?: TElement, model?: any, file?: File, event?: TEvent, request?: XMLHttpRequest, message?: string }) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field4 value:Array<File>
     * @type_function_param1_field5 previousValue:Array<File>
     * @type_function_param1_field6 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onValueChanged?: ((e: { component?: dxFileUploader, element?: TElement, model?: any, value?: Array<File>, previousValue?: Array<File>, event?: TEvent }) => void);
    /**
     * @docid
     * @default 0
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    progress?: number;
    /**
     * @docid
     * @default "Ready to upload"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    readyToUploadMessage?: string;
    /**
     * @docid
     * @default "Select File"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    selectButtonText?: string;
    /**
     * @docid
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    showFileList?: boolean;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dialogTrigger?: string | TElement;
    /**
     * @docid
     * @default undefined
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    dropZone?: string | TElement;
    /**
     * @docid
     * @default "Upload"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    uploadButtonText?: string;
    /**
     * @docid
     * @type_function_param1 file:File
     * @type_function_param2 uploadInfo:UploadInfo
     * @type_function_return Promise<any>|any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    uploadChunk?: ((file: File, uploadInfo: UploadInfo) => TPromise<any> | any);
    /**
     * @docid
     * @default "Upload failed"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    uploadFailedMessage?: string;
    /**
     * @docid
     * @default "Upload cancelled"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    uploadAbortedMessage?: string;
    /**
     * @docid
     * @type_function_param1 file:File
     * @type_function_param2 progressCallback:Function
     * @type_function_return Promise<any>|any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    uploadFile?: ((file: File, progressCallback: Function) => TPromise<any> | any);
    /**
     * @docid
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    uploadHeaders?: any;
    /**
     * @docid
     * @default {}
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    uploadCustomData?: any;
    /**
     * @docid
     * @type Enums.UploadHttpMethod
     * @default "POST"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    uploadMethod?: 'POST' | 'PUT';
    /**
     * @docid
     * @type Enums.FileUploadMode
     * @default "instantly"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    uploadMode?: 'instantly' | 'useButtons' | 'useForm';
    /**
     * @docid
     * @default "/"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    uploadUrl?: string;
    /**
     * @docid
     * @default "Uploaded"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    uploadedMessage?: string;
    /**
     * @docid
     * @default []
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: Array<File>;
}
/**
 * @docid
 * @inherits Editor
 * @module ui/file_uploader
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxFileUploader extends Editor {
    constructor(element: TElement, options?: dxFileUploaderOptions)
    /**
     * @docid
     * @publicName upload()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    upload(): void;
    /**
     * @docid
     * @publicName upload(fileIndex)
     * @param1 fileIndex:number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    upload(fileIndex: number): void;
    /**
     * @docid
     * @publicName upload(file)
     * @param1 file:File
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    upload(file: File): void;
    /**
     * @docid
     * @publicName abortUpload()
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    abortUpload(): void;
    /**
     * @docid
     * @publicName abortUpload(fileIndex)
     * @param1 fileIndex:number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    abortUpload(fileIndex: number): void;
    /**
     * @docid
     * @publicName abortUpload(file)
     * @param1 file:File
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    abortUpload(file: File): void;
    /**
     * @docid
     * @publicName removeFile(fileIndex)
     * @param1 fileIndex:number
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    removeFile(fileIndex: number): void;
    /**
     * @docid
     * @publicName removeFile(file)
     * @param1 file:File
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    removeFile(file: File): void;
}

export type Options = dxFileUploaderOptions;

/** @deprecated use Options instead */
export type IOptions = dxFileUploaderOptions;
