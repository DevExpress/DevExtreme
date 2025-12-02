import Guid from '@js/core/guid';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { FileBlobReader } from '@ts/ui/file_uploader/file_blob_reader';
import { FileUploadStrategyBase } from '@ts/ui/file_uploader/file_upload_strategy.base';
import type FileUploader from '@ts/ui/file_uploader/file_uploader';
import type {
  FileBlobChunk,
  FileUploaderChunksData,
  FileUploaderItem,
  UploadChunkInfo,
} from '@ts/ui/file_uploader/file_uploader.types';

export class ChunksFileUploadStrategyBase extends FileUploadStrategyBase {
  chunkSize: number;

  constructor(fileUploader: FileUploader) {
    super(fileUploader);
    const { chunkSize } = this.fileUploader.option();
    this.chunkSize = chunkSize ?? 0;
  }

  _uploadCore(file: FileUploaderItem): void {
    const realFile = file.value;
    const chunksData = {
      name: realFile.name,
      loadedBytes: 0,
      type: realFile.type,
      blobReader: new FileBlobReader(realFile, this.chunkSize),
      guid: new Guid(),
      fileSize: realFile.size,
      count: this._getFileChunksCount(realFile),
      customData: {},
    };
    file.chunksData = chunksData;
    this._sendChunk(file, chunksData);
  }

  _getFileChunksCount(jsFile: File): number {
    return jsFile.size === 0
      ? 1
      : Math.ceil(jsFile.size / this.chunkSize);
  }

  _sendChunk(file: FileUploaderItem, chunksData: FileUploaderChunksData): void {
    const chunk = chunksData.blobReader.read();
    chunksData.currentChunk = chunk;
    if (chunk) {
      (this._sendChunkCore(file, chunksData, chunk) as DeferredObj<unknown>)
        .done(() => {
          if (file.isAborted) {
            return;
          }

          chunksData.loadedBytes += chunk.blob?.size ?? 0;

          file.onProgress.fire({
            loaded: chunksData.loadedBytes,
            total: file.value.size,
          });

          if (chunk.isCompleted) {
            file.onLoad.fire();
          }

          // eslint-disable-next-line no-restricted-globals
          setTimeout(() => this._sendChunk(file, chunksData));
        })
        .fail((error) => {
          if (this._shouldHandleError(file, error as { status: number })) {
            this._handleFileError(file, error);
          }
        });
    }
  }

  _sendChunkCore(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _file: FileUploaderItem,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _chunksData: FileUploaderChunksData,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _chunk: FileBlobChunk,
  ): DeferredObj<unknown> | PromiseLike<unknown> {
    // This is an abstract method and should be implemented in subclasses.
    // Returning a rejected Deferred to satisfy the return type.
    return Deferred().reject();
  }

  _tryRaiseStartLoad(file: FileUploaderItem): void {
    if (!file.isStartLoad) {
      file.isStartLoad = true;
      file.onLoadStart.fire();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _getEvent(_e: Event): null {
    return null;
  }

  _createUploadArgument(file: FileUploaderItem): UploadChunkInfo {
    return this._createChunksInfo(file.chunksData);
  }

  _createChunksInfo(chunksData?: FileUploaderChunksData): UploadChunkInfo {
    return {
      bytesUploaded: chunksData?.loadedBytes ?? 0,
      chunkCount: chunksData?.count ?? 0,
      customData: chunksData?.customData ?? {},
      chunkBlob: chunksData?.currentChunk?.blob ?? new Blob(),
      chunkIndex: chunksData?.currentChunk?.index ?? 0,
    };
  }
}
