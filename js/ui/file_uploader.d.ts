import {
    UserDefinedElement,
    DxElement,
} from '../core/element';

import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../events/index';

import Editor, {
    EditorOptions,
} from './editor/editor';

import UploadInfo from '../file_management/upload_info';

/** @public */
export type FileUploadMode = 'instantly' | 'useButtons' | 'useForm';
/** @public */
export type UploadHttpMethod = 'POST' | 'PUT';

/** @public */
export type BeforeSendEvent = EventInfo<dxFileUploader> & {
    readonly request: XMLHttpRequest;
    readonly file: File;
    readonly uploadInfo?: UploadInfo;
};

/** @public */
export type ContentReadyEvent = EventInfo<dxFileUploader>;

/** @public */
export type DisposingEvent = EventInfo<dxFileUploader>;

/** @public */
export type DropZoneEnterEvent = NativeEventInfo<dxFileUploader, PointerEvent | MouseEvent> & {
    readonly dropZoneElement: DxElement;
};

/** @public */
export type DropZoneLeaveEvent = NativeEventInfo<dxFileUploader, PointerEvent | MouseEvent> & {
    readonly dropZoneElement: DxElement;
};

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
};

/** @public */
export type UploadAbortedEvent = NativeEventInfo<dxFileUploader> & {
    readonly file: File;
    readonly request: XMLHttpRequest;
    message: string;
};

/** @public */
export type UploadedEvent = NativeEventInfo<dxFileUploader> & {
    readonly file: File;
    readonly request: XMLHttpRequest;
    message: string;
};

/** @public */
export type UploadErrorEvent = NativeEventInfo<dxFileUploader> & {
    readonly file: File;
    readonly request: XMLHttpRequest;
    readonly error: any;
    message: string;
};

/** @public */
export type UploadStartedEvent = NativeEventInfo<dxFileUploader> & {
    readonly file: File;
    readonly request: XMLHttpRequest;
};

/** @public */
export type ValueChangedEvent = NativeEventInfo<dxFileUploader> & {
    readonly value?: Array<File>;
    readonly previousValue?: Array<File>;
};

/**
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @docid
 */
export interface dxFileUploaderOptions extends EditorOptions<dxFileUploader> {
    /**
     * @docid
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
     * @default true &for(desktop)
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @default true
     * @public
     */
    hoverStateEnabled?: boolean;
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
     * @default "" &for(InternetExplorer|desktop)
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
     * @type_function_param1 e:{ui/file_uploader:BeforeSendEvent}
     * @action
     * @public
     */
    onBeforeSend?: ((e: BeforeSendEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/file_uploader:DropZoneEnterEvent}
     * @action
     * @public
     */
    onDropZoneEnter?: ((e: DropZoneEnterEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/file_uploader:DropZoneLeaveEvent}
     * @action
     * @public
     */
    onDropZoneLeave?: ((e: DropZoneLeaveEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/file_uploader:FilesUploadedEvent}
     * @action
     * @public
     */
    onFilesUploaded?: ((e: FilesUploadedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/file_uploader:ProgressEvent}
     * @action
     * @public
     */
    onProgress?: ((e: ProgressEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/file_uploader:UploadAbortedEvent}
     * @action
     * @public
     */
    onUploadAborted?: ((e: UploadAbortedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/file_uploader:UploadErrorEvent}
     * @action
     * @public
     */
    onUploadError?: ((e: UploadErrorEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/file_uploader:UploadStartedEvent}
     * @action
     * @public
     */
    onUploadStarted?: ((e: UploadStartedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/file_uploader:UploadedEvent}
     * @action
     * @public
     */
    onUploaded?: ((e: UploadedEvent) => void);
    /**
     * @docid
     * @default null
     * @type_function_param1 e:{ui/file_uploader:ValueChangedEvent}
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
     * @default "POST"
     * @public
     */
    uploadMethod?: UploadHttpMethod;
    /**
     * @docid
     * @default "instantly"
     * @public
     */
    uploadMode?: FileUploadMode;
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
 * @namespace DevExpress.ui
 * @public
 */
export default class dxFileUploader extends Editor<dxFileUploaderOptions> {
    /**
     * @docid
     * @publicName upload()
     * @public
     */
    upload(): void;
    /**
     * @docid
     * @publicName upload(fileIndex)
     * @public
     */
    upload(fileIndex: number): void;
    /**
     * @docid
     * @publicName upload(file)
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
     * @public
     */
    abortUpload(fileIndex: number): void;
    /**
     * @docid
     * @publicName abortUpload(file)
     * @public
     */
    abortUpload(file: File): void;
    /**
     * @docid
     * @publicName removeFile(fileIndex)
     * @public
     */
    removeFile(fileIndex: number): void;
    /**
     * @docid
     * @publicName removeFile(file)
     * @public
     */
    removeFile(file: File): void;
}

/** @public */
export type Properties = dxFileUploaderOptions;

/** @deprecated use Properties instead */
export type Options = dxFileUploaderOptions;

///#DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

type EventsIntegrityCheckingHelper = CheckedEvents<FilterOutHidden<Properties>, Required<Events>, 'onBeforeSend', 'onDropZoneEnter', 'onDropZoneLeave', 'onFilesUploaded', 'onProgress', 'onUploadAborted', 'onUploaded', 'onUploadError', 'onUploadStarted', 'onValueChanged'>;

/**
* @hidden
*/
type Events = {
/**
 * @skip
 * @docid dxFileUploaderOptions.onContentReady
 * @type_function_param1 e:{ui/file_uploader:ContentReadyEvent}
 */
onContentReady?: ((e: ContentReadyEvent) => void);
/**
 * @skip
 * @docid dxFileUploaderOptions.onDisposing
 * @type_function_param1 e:{ui/file_uploader:DisposingEvent}
 */
onDisposing?: ((e: DisposingEvent) => void);
/**
 * @skip
 * @docid dxFileUploaderOptions.onInitialized
 * @type_function_param1 e:{ui/file_uploader:InitializedEvent}
 */
onInitialized?: ((e: InitializedEvent) => void);
/**
 * @skip
 * @docid dxFileUploaderOptions.onOptionChanged
 * @type_function_param1 e:{ui/file_uploader:OptionChangedEvent}
 */
onOptionChanged?: ((e: OptionChangedEvent) => void);
};
///#ENDDEBUG
