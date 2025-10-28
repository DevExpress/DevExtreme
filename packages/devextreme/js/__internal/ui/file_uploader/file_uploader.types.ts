import type Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import type Callbacks from '@js/core/utils/callbacks';
import type { DxEvent, InteractionEvent, NativeEventInfo } from '@js/events';
import type Button from '@js/ui/button';
import type { ButtonStyle, ButtonType } from '@js/ui/button';
import type { Properties as PublicProperties } from '@js/ui/file_uploader';
import type ProgressBar from '@js/ui/progress_bar';
import type { EditorProperties, UnresolvedEvents } from '@ts/ui/editor/editor';
import type { FileBlobReader } from '@ts/ui/file_uploader/file_blob_reader';
import type FileUploader from '@ts/ui/file_uploader/file_uploader';

type CallbacksInstance = ReturnType<typeof Callbacks>;

export interface FileUploaderItem {
  value: File;
  loadedSize: number;
  onProgress: CallbacksInstance;
  onAbort: CallbacksInstance;
  onLoad: CallbacksInstance;
  onError: CallbacksInstance;
  onLoadStart: CallbacksInstance;
  isValidFileExtension: boolean;
  isValidMaxSize: boolean;
  isValidMinSize: boolean;
  isInitialized: boolean;
  $file?: dxElementWrapper | null;
  $statusMessage?: dxElementWrapper | null;
  progressBar?: ProgressBar;
  cancelButton?: Button;
  uploadButton?: Button;
  isAborted?: boolean;
  uploadStarted?: boolean;
  isStartLoad?: boolean;
  chunksData?: FileUploaderChunksData;
  request?: XMLHttpRequest | null;
  _isProgressStarted?: boolean;
  _isError?: boolean;
  _isLoaded?: boolean;
  isValid: () => boolean;
}

export interface FileUploaderChunksData {
  name: string;
  loadedBytes: number;
  type: string;
  blobReader: FileBlobReader;
  guid: Guid;
  fileSize: number;
  count: number;
  customData: Record<string, unknown>;
  currentChunk?: {
    blob: Blob | null;
    index: number;
    isCompleted: boolean;
  } | null;
}

export interface UploadChunkInfo {
  bytesUploaded: number;
  chunkCount: number;
  customData: Record<string, unknown>;
  chunkBlob: Blob;
  chunkIndex: number;
}

export type DragLikeEvent = DxEvent & {
  originalEvent: {
    dataTransfer: DataTransfer;
    type?: string;
    currentTarget?: EventTarget | null;
    target?: EventTarget | null;
    clientX?: number;
    clientY?: number;
    pageX?: number;
    pageY?: number;
    files?: FileList;
    dropEffect?: string;
    types?: string[];
    preventDefault?: () => void;
    stopPropagation?: () => void;
  };
};

export type MouseLikeEvent = MouseEvent | TouchEvent | DxEvent | DragLikeEvent;

export interface LoadedFileData {
  loaded: number;
  total: number;
  currentSegmentSize: number;
  event?: Event;
}

export interface FileBlobChunk {
  blob: Blob | null;
  index: number;
  isCompleted: boolean;
}

export interface ChunkFormDataOptions {
  fileName: string;
  blobName?: string;
  blob: Blob | null;
  index: number;
  count: number;
  type: string;
  guid: Guid;
  size: number;
}

export interface FileUploaderChunkUploadResponse {
  [key: string]: unknown;
  success?: boolean;
  error?: string;
}

export type CancelButtonClickEvent = NativeEventInfo<InteractionEvent> & {
  readonly file?: File;
};

export interface Properties extends PublicProperties {
  _buttonStylingMode?: ButtonStyle;

  _uploadButtonType?: ButtonType;

  _hideCancelButtonOnUpload?: boolean;

  _showFileIcon?: boolean;

  _cancelButtonPosition?: 'start' | 'end';

  extendSelection?: boolean;

  allowCanceling?: boolean;

  useNativeInputClick?: boolean;

  nativeDropSupported?: boolean;

  useDragOver?: boolean;

  onCancelButtonClick?: ((e: CancelButtonClickEvent) => void);
}

export interface FileUploaderProperties extends Properties,
  Omit<EditorProperties<FileUploader>, UnresolvedEvents | 'value'> {}

export type FileDialogEventTarget = dxElementWrapper | FileUploaderProperties['dialogTrigger'];
