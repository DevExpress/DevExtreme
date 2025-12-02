import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { isDefined, isFunction } from '@js/core/utils/type';
import { fromPromise } from '@ts/core/utils/m_deferred';
import type FileUploader from '@ts/ui/file_uploader/file_uploader';
import type {
  FileUploaderItem,
  FileUploaderProperties,
  LoadedFileData,
  UploadChunkInfo,
} from '@ts/ui/file_uploader/file_uploader.types';

export class FileUploadStrategyBase {
  fileUploader!: FileUploader;

  constructor(fileUploader: FileUploader) {
    this.fileUploader = fileUploader;
  }

  upload(file: FileUploaderItem): void {
    if (file.isInitialized && file.isAborted) {
      this.fileUploader?._resetFileState(file);
    }
    if (file.isValid() && !file.uploadStarted) {
      this._prepareFileBeforeUpload(file);
      this._uploadCore(file);
    }
  }

  abortUpload(file: FileUploaderItem): void {
    if (file._isError || file._isLoaded || file.isAborted || !file.uploadStarted) {
      return;
    }

    file.isAborted = true;
    file.request?.abort();

    if (this._isCustomCallback('abortUpload')) {
      const { abortUpload } = this.fileUploader.option();
      const arg = this._createUploadArgument(file);

      let deferred: Promise<unknown> | DeferredObj<unknown> | null = null;

      try {
        const result = abortUpload?.(file.value, arg);
        deferred = fromPromise(result);
      } catch (error) {
        deferred = Deferred().reject(error).promise();
      }

      if (deferred && 'done' in deferred) {
        deferred
          ?.done(() => file.onAbort.fire())
          .fail((error) => this._handleFileError(file, error));
      }
    }
  }

  _beforeSend(xhr: XMLHttpRequest, file: FileUploaderItem): void {
    const arg = this._createUploadArgument(file);
    this.fileUploader._beforeSendAction?.({
      request: xhr,
      file: file.value,
      uploadInfo: arg,
    });
    file.request = xhr;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _createUploadArgument(_file: FileUploaderItem): UploadChunkInfo {
    // This is an abstract method and should be implemented in subclasses.
    // Returning a default object to satisfy the return type.
    return {
      bytesUploaded: 0,
      chunkCount: 0,
      customData: {},
      chunkBlob: new Blob(),
      chunkIndex: 0,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _uploadCore(_file: FileUploaderItem): void {
  }

  _isCustomCallback(name: keyof FileUploaderProperties): boolean {
    const callback = this.fileUploader?.option(name);
    return callback && isFunction(callback);
  }

  _handleProgress(file: FileUploaderItem, e: Event | { loaded?: number; total?: number }): void {
    if (file._isError) {
      return;
    }

    file._isProgressStarted = true;

    this._handleProgressCore(file, e);
  }

  _handleProgressCore(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _file: FileUploaderItem,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _e: Event | { loaded?: number; total?: number },
  ): void {
  }

  _handleFileError(file: FileUploaderItem, error: unknown): void {
    file._isError = true;
    file.onError.fire(error);
  }

  _prepareFileBeforeUpload(file: FileUploaderItem): void {
    if (file.$file) {
      file.progressBar?.dispose();
      this.fileUploader._createFileProgressBar(file);
    }

    if (file.isInitialized) {
      return;
    }

    file.onLoadStart.add(this._onUploadStarted.bind(this, file));
    file.onLoad.add(this._onLoadedHandler.bind(this, file));
    file.onError.add(this._onErrorHandler.bind(this, file));
    file.onAbort.add(this._onAbortHandler.bind(this, file));
    file.onProgress.add(this._onProgressHandler.bind(this, file));
    file.isInitialized = true;
  }

  _shouldHandleError(file: FileUploaderItem, e: { status: number }): boolean {
    return (this._isStatusError(e.status) || !file._isProgressStarted) && !file.isAborted;
  }

  _isStatusError(status: number): boolean {
    return (status >= 400 && status < 500) || (status >= 500 && status < 600);
  }

  _onUploadStarted(file: FileUploaderItem, e: Event): void {
    file.uploadStarted = true;

    this.fileUploader?._uploadStartedAction?.({
      file: file.value,
      event: e,
      request: file.request,
    });
  }

  _onAbortHandler(file: FileUploaderItem, e: Event): void {
    const args = {
      file: file.value,
      event: e,
      request: file.request,
      message: this.fileUploader?._getUploadAbortedStatusMessage(),
    };
    this.fileUploader._uploadAbortedAction?.(args);
    this.fileUploader._setStatusMessage(file, args.message);
    this.fileUploader._handleAllFilesUploaded();
  }

  _onErrorHandler(file: FileUploaderItem, error: unknown): void {
    const { uploadFailedMessage } = this.fileUploader.option();
    const args = {
      file: file.value,
      event: undefined,
      request: file.request,
      error,
      message: uploadFailedMessage,
    };
    this.fileUploader._uploadErrorAction?.(args);
    this.fileUploader._setStatusMessage?.(file, args.message);
    this.fileUploader._handleAllFilesUploaded();
  }

  _onLoadedHandler(file: FileUploaderItem, e: Event): void {
    const { uploadedMessage } = this.fileUploader.option();
    const args = {
      file: file.value,
      event: e,
      request: file.request,
      message: uploadedMessage,
    };
    file._isLoaded = true;
    this.fileUploader._uploadedAction?.(args);
    this.fileUploader._setStatusMessage(file, args.message);
    this.fileUploader._handleAllFilesUploaded();
  }

  _onProgressHandler(
    file: FileUploaderItem,
    e: ProgressEvent & { loaded?: number; total?: number },
  ): void {
    if (file) {
      const totalFilesSize = this.fileUploader._getTotalFilesSize();
      const totalLoadedFilesSize = this.fileUploader._getTotalLoadedFilesSize();

      // ProgressEvent from XMLHttpRequest or FileReader
      const loaded = (e as ProgressEvent & { loaded?: number }).loaded ?? 0;
      const loadedSize = Math.min(loaded, file.value.size);
      const segmentSize = loadedSize - file.loadedSize;
      file.loadedSize = loadedSize;

      this.fileUploader._updateTotalProgress(totalFilesSize, totalLoadedFilesSize + segmentSize);
      this.fileUploader._updateProgressBar(
        file,
        this._getLoadedData(
          loadedSize,
          e.total,
          segmentSize,
          e,
        ),
      );
    }
  }

  _getLoadedData(
    loaded: number,
    total: number,
    currentSegmentSize: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _event: Event,
  ): LoadedFileData {
    return {
      loaded,
      total,
      currentSegmentSize,
    };
  }

  _extendFormData(formData: FormData): void {
    const { uploadCustomData: formDataEntries } = this.fileUploader.option();
    // eslint-disable-next-line no-restricted-syntax
    for (const entryName in formDataEntries) {
      if (Object.prototype.hasOwnProperty.call(formDataEntries, entryName)
         && isDefined(formDataEntries[entryName])) {
        formData.append(entryName, formDataEntries[entryName]);
      }
    }
  }
}
