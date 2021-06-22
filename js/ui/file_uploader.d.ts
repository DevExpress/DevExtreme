import {
    UserDefinedElement,
    DxElement
} from '../core/element';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo
} from '../events/index';

import Editor, {
    EditorOptions
} from './editor/editor';

import UploadInfo from '../file_management/upload_info';

/** @public */
export type BeforeSendEvent = EventInfo<dxFileUploader> & {
    readonly request: XMLHttpRequest;
    readonly file: File;
    readonly uploadInfo?: UploadInfo;
}

/** @public */
export type ContentReadyEvent = EventInfo<dxFileUploader>;

/** @public */
export type DisposingEvent = EventInfo<dxFileUploader>;

/** @public */
export type DropZoneEnterEvent = NativeEventInfo<dxFileUploader> & {
    readonly dropZoneElement: DxElement;
}

/** @public */
export type DropZoneLeaveEvent = NativeEventInfo<dxFileUploader> & {
    readonly dropZoneElement: DxElement;
}

/** @public */
export type FilesUploadedEvent = EventInfo<dxFileUploader>;

/** @public */
export type InitializedEvent = InitializedEventInfo<dxFileUploader>;

/** @public */
export type OptionChangedEvent = EventInfo<dxFileUploader> & ChangedOptionInfo;

/** @public */
export type ProgressEvent = NativeEventInfo<dxFileUploader> & {
    readonly file: File;
    readonly segmentSize: number;
    readonly bytesLoaded: number;
    readonly bytesTotal: number;
    readonly request: XMLHttpRequest;
}

/** @public */
export type UploadAbortedEvent = NativeEventInfo<dxFileUploader> & {
    readonly file: File;
    readonly request: XMLHttpRequest;
    message: string
}

/** @public */
export type UploadedEvent = NativeEventInfo<dxFileUploader> & {
    readonly file: File;
    readonly request: XMLHttpRequest;
    message: string;
}

/** @public */
export type UploadErrorEvent = NativeEventInfo<dxFileUploader> & {
    readonly file: File;
    readonly request: XMLHttpRequest;
    readonly error: any;
    message: string;
}

/** @public */
export type UploadStartedEvent = NativeEventInfo<dxFileUploader> & {
    readonly file: File;
    readonly request: XMLHttpRequest 
}

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxFileUploader> & {
    readonly value?: Array<File>;
    readonly previousValue?: Array<File>;
}

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 */
export interface dxFileUploaderOptions extends EditorOptions<dxFileUploader> {
    /**
     * @docid
     * @type_function_param1 file:File
     * @type_function_param2 uploadInfo?:UploadInfo
     * @type_function_return Promise<any>|any
     * @public
     */
    abortUpload?: ((file: File, uploadInfo?: UploadInfo) => PromiseLike<any> | any);
    /**
     * @docid
     * @default ""
     * @public
     */
    accept?: string;
    /**
     * @docid
     * @default true
     * @public
     */
    allowCanceling?: boolean;
    /**
     * @docid
     * @default []
     * @public
     */
    allowedFileExtensions?: Array<string>;
    /**
     * @docid
     * @default 0
     * @public
     */
    chunkSize?: number;
    /**
     * @docid
     * @default true [for](desktop)
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default "File type is not allowed"
     * @public
     */
    invalidFileExtensionMessage?: string;
    /**
     * @docid
     * @default "File is too large"
     * @public
     */
    invalidMaxFileSizeMessage?: string;
    /**
     * @docid
     * @default "File is too small"
     * @public
     */
    invalidMinFileSizeMessage?: string;
    /**
     * @docid
     * @default {}
     * @public
     */
    inputAttr?: any;
    /**
     * @docid
     * @default "or Drop file here"
     * @default "" [for](InternetExplorer|desktop)
     * @public
     */
    labelText?: string;
    /**
     * @docid
     * @default 0
     * @public
     */
    maxFileSize?: number;
    /**
     * @docid
     * @default 0
     * @public
     */
    minFileSize?: number;
    /**
     * @docid
     * @default false
     * @public
     */
    multiple?: boolean;
    /**
     * @docid
     * @default "files[]"
     * @public
     */
    name?: string;
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxFileUploader
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 request: XMLHttpRequest
     * @type_function_param1_field5 file:File
     * @type_function_param1_field6 uploadInfo:UploadInfo
     * @action
     * @public
     */
    onBeforeSend?: ((e: BeforeSendEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxFileUploader
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 dropZoneElement:DxElement
     * @type_function_param1_field5 event:event
     * @action
     * @public
     */
    onDropZoneEnter?: ((e: DropZoneEnterEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxFileUploader
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 dropZoneElement:DxElement
     * @type_function_param1_field5 event:event
     * @action
     * @public
     */
    onDropZoneLeave?: ((e: DropZoneLeaveEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxFileUploader
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @action
     * @public
     */
    onFilesUploaded?: ((e: FilesUploadedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxFileUploader
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 file:File
     * @type_function_param1_field5 segmentSize:Number
     * @type_function_param1_field6 bytesLoaded:Number
     * @type_function_param1_field7 bytesTotal:Number
     * @type_function_param1_field8 event:event
     * @type_function_param1_field9 request:XMLHttpRequest
     * @action
     * @public
     */
    onProgress?: ((e: ProgressEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxFileUploader
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 file:File
     * @type_function_param1_field5 event:event
     * @type_function_param1_field6 request:XMLHttpRequest
     * @type_function_param1_field7 message:string
     * @action
     * @public
     */
    onUploadAborted?: ((e: UploadAbortedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxFileUploader
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 file:File
     * @type_function_param1_field5 event:event
     * @type_function_param1_field6 request:XMLHttpRequest
     * @type_function_param1_field7 error:any
     * @type_function_param1_field8 message:string
     * @action
     * @public
     */
    onUploadError?: ((e: UploadErrorEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxFileUploader
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 file:File
     * @type_function_param1_field5 event:event
     * @type_function_param1_field6 request:XMLHttpRequest
     * @action
     * @public
     */
    onUploadStarted?: ((e: UploadStartedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxFileUploader
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 file:File
     * @type_function_param1_field5 event:event
     * @type_function_param1_field6 request:XMLHttpRequest
     * @type_function_param1_field7 message:string
     * @action
     * @public
     */
    onUploaded?: ((e: UploadedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:object
     * @type_function_param1_field1 component:dxFileUploader
     * @type_function_param1_field2 element:DxElement
     * @type_function_param1_field3 model:any
     * @type_function_param1_field4 value:Array<File>
     * @type_function_param1_field5 previousValue:Array<File>
     * @type_function_param1_field6 event:event
     * @action
     * @public
     */
    onValueChanged?: ((e: ValueChangedEvent) => void);
    /**
     * @docid
     * @default 0
     * @public
     */
    progress?: number;
    /**
     * @docid
     * @default "Ready to upload"
     * @public
     */
    readyToUploadMessage?: string;
    /**
     * @docid
     * @default "Select File"
     * @public
     */
    selectButtonText?: string;
    /**
     * @docid
     * @default true
     * @public
     */
    showFileList?: boolean;
    /**
     * @docid
     * @default undefined
     * @public
     */
    dialogTrigger?: string | UserDefinedElement;
    /**
     * @docid
     * @default undefined
     * @public
     */
    dropZone?: string | UserDefinedElement;
    /**
     * @docid
     * @default "Upload"
     * @public
     */
    uploadButtonText?: string;
    /**
     * @docid
     * @type_function_param1 file:File
     * @type_function_param2 uploadInfo:UploadInfo
     * @type_function_return Promise<any>|any
     * @public
     */
    uploadChunk?: ((file: File, uploadInfo: UploadInfo) => PromiseLike<any> | any);
    /**
     * @docid
     * @default "Upload failed"
     * @public
     */
    uploadFailedMessage?: string;
    /**
     * @docid
     * @default "Upload cancelled"
     * @public
     */
    uploadAbortedMessage?: string;
    /**
     * @docid
     * @type_function_param1 file:File
     * @type_function_param2 progressCallback:Function
     * @type_function_return Promise<any>|any
     * @public
     */
    uploadFile?: ((file: File, progressCallback: Function) => PromiseLike<any> | any);
    /**
     * @docid
     * @default {}
     * @public
     */
    uploadHeaders?: any;
    /**
     * @docid
     * @default {}
     * @public
     */
    uploadCustomData?: any;
    /**
     * @docid
     * @type Enums.UploadHttpMethod
     * @default "POST"
     * @public
     */
    uploadMethod?: 'POST' | 'PUT';
    /**
     * @docid
     * @type Enums.FileUploadMode
     * @default "instantly"
     * @public
     */
    uploadMode?: 'instantly' | 'useButtons' | 'useForm';
    /**
     * @docid
     * @default "/"
     * @public
     */
    uploadUrl?: string;
    /**
     * @docid
     * @default "Uploaded"
     * @public
     */
    uploadedMessage?: string;
    /**
     * @docid
     * @default []
     * @public
     */
    value?: Array<File>;
}
/**
 * @docid
 * @inherits Editor
 * @module ui/file_uploader
 * @export default
 * @namespace DevExpress.ui
 * @public
 */
export default class dxFileUploader extends Editor {
    constructor(element: UserDefinedElement, options?: dxFileUploaderOptions)
    /**
     * @docid
     * @publicName upload()
     * @public
     */
    upload(): void;
    /**
     * @docid
     * @publicName upload(fileIndex)
     * @param1 fileIndex:number
     * @public
     */
    upload(fileIndex: number): void;
    /**
     * @docid
     * @publicName upload(file)
     * @param1 file:File
     * @public
     */
    upload(file: File): void;
    /**
     * @docid
     * @publicName abortUpload()
     * @public
     */
    abortUpload(): void;
    /**
     * @docid
     * @publicName abortUpload(fileIndex)
     * @param1 fileIndex:number
     * @public
     */
    abortUpload(fileIndex: number): void;
    /**
     * @docid
     * @publicName abortUpload(file)
     * @param1 file:File
     * @public
     */
    abortUpload(file: File): void;
    /**
     * @docid
     * @publicName removeFile(fileIndex)
     * @param1 fileIndex:number
     * @public
     */
    removeFile(fileIndex: number): void;
    /**
     * @docid
     * @publicName removeFile(file)
     * @param1 file:File
     * @public
     */
    removeFile(file: File): void;
}

/** @public */
export type Properties = dxFileUploaderOptions;

/** @deprecated use Properties instead */
export type Options = dxFileUploaderOptions;

/** @deprecated use Properties instead */
export type IOptions = dxFileUploaderOptions;
