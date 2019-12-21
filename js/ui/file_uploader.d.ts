import {
    JQueryEventObject,
    JQueryPromise
} from '../common';

import {
    dxElement
} from '../core/element';

import {
    event
} from '../events';

import Editor, {
    EditorOptions
} from './editor/editor';

export interface dxFileUploaderOptions extends EditorOptions<dxFileUploader> {
    /**
     * @docid dxFileUploaderOptions.abortUpload
     * @type function
     * @type_function_param1 file:File
     * @type_function_param2 uploadInfo:object
     * @type_function_param2_field1 bytesUploaded:Number
     * @type_function_param2_field2 chunkCount:Number
     * @type_function_param2_field3 customData:object
     * @type_function_param2_field4 chunkBlob:Blob
     * @type_function_param2_field5 chunkIndex:Number
     * @type_function_return Promise<any>|any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    abortUpload?: ((file: File, uploadInfo: { bytesUploaded?: number, chunkCount?: number, customData?: any, chunkBlob?: Blob, chunkIndex?: number }) => Promise<any> | JQueryPromise<any> | any);
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
     * @docid dxFileUploaderOptions.labelText
     * @type string
     * @default "or Drop file here"
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
     * @docid dxFileUploaderOptions.onProgress
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 file:File
     * @type_function_param1_field5 segmentSize:Number
     * @type_function_param1_field6 bytesLoaded:Number
     * @type_function_param1_field7 bytesTotal:Number
     * @type_function_param1_field8 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field9 event:event
     * @type_function_param1_field10 request:XMLHttpRequest
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onProgress?: ((e: { component?: dxFileUploader, element?: dxElement, model?: any, file?: File, segmentSize?: number, bytesLoaded?: number, bytesTotal?: number, jQueryEvent?: JQueryEventObject, event?: event, request?: XMLHttpRequest }) => any);
    /**
     * @docid dxFileUploaderOptions.onUploadAborted
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 file:File
     * @type_function_param1_field5 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field6 event:event
     * @type_function_param1_field7 request:XMLHttpRequest
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onUploadAborted?: ((e: { component?: dxFileUploader, element?: dxElement, model?: any, file?: File, jQueryEvent?: JQueryEventObject, event?: event, request?: XMLHttpRequest }) => any);
    /**
     * @docid dxFileUploaderOptions.onUploadError
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 file:File
     * @type_function_param1_field5 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field6 event:event
     * @type_function_param1_field7 request:XMLHttpRequest
     * @type_function_param1_field8 error:any
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onUploadError?: ((e: { component?: dxFileUploader, element?: dxElement, model?: any, file?: File, jQueryEvent?: JQueryEventObject, event?: event, request?: XMLHttpRequest, error?: any }) => any);
    /**
     * @docid dxFileUploaderOptions.onUploadStarted
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 file:File
     * @type_function_param1_field5 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field6 event:event
     * @type_function_param1_field7 request:XMLHttpRequest
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onUploadStarted?: ((e: { component?: dxFileUploader, element?: dxElement, model?: any, file?: File, jQueryEvent?: JQueryEventObject, event?: event, request?: XMLHttpRequest }) => any);
    /**
     * @docid dxFileUploaderOptions.onUploaded
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 file:File
     * @type_function_param1_field5 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field6 event:event
     * @type_function_param1_field7 request:XMLHttpRequest
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onUploaded?: ((e: { component?: dxFileUploader, element?: dxElement, model?: any, file?: File, jQueryEvent?: JQueryEventObject, event?: event, request?: XMLHttpRequest }) => any);
    /**
     * @docid dxFileUploaderOptions.onValueChanged
     * @extends Action
     * @type function(e)
     * @type_function_param1 e:object
     * @type_function_param1_field4 value:Array<File>
     * @type_function_param1_field5 previousValue:Array<File>
     * @type_function_param1_field6 jQueryEvent:jQuery.Event:deprecated(event)
     * @type_function_param1_field7 event:event
     * @action
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onValueChanged?: ((e: { component?: dxFileUploader, element?: dxElement, model?: any, value?: Array<File>, previousValue?: Array<File>, jQueryEvent?: JQueryEventObject, event?: event }) => any);
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
     * @type_function_param2 uploadInfo:object
     * @type_function_param2_field1 bytesUploaded:Number
     * @type_function_param2_field2 chunkCount:Number
     * @type_function_param2_field3 customData:object
     * @type_function_param2_field4 chunkBlob:Blob
     * @type_function_param2_field5 chunkIndex:Number
     * @type_function_return Promise<any>|any
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    uploadChunk?: ((file: File, uploadInfo: { bytesUploaded?: number, chunkCount?: number, customData?: any, chunkBlob?: Blob, chunkIndex?: number }) => Promise<any> | JQueryPromise<any> | any);
    /**
     * @docid dxFileUploaderOptions.uploadFailedMessage
     * @type string
     * @default "Upload failed"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    uploadFailedMessage?: string;
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