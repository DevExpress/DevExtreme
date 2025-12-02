import { Deferred } from '@js/core/utils/deferred';
import { fromPromise } from '@ts/core/utils/m_deferred';
import { ChunksFileUploadStrategyBase } from '@ts/ui/file_uploader/file_upload_strategy.chunks.base';
import type {
  FileUploaderChunksData,
  FileUploaderItem,
} from '@ts/ui/file_uploader/file_uploader.types';

export class CustomChunksFileUploadStrategy extends ChunksFileUploadStrategyBase {
  _sendChunkCore(
    file: FileUploaderItem,
    chunksData: FileUploaderChunksData,
  ): PromiseLike<unknown> {
    this._tryRaiseStartLoad(file);

    const chunksInfo = this._createChunksInfo(chunksData);
    const { uploadChunk } = this.fileUploader.option();
    try {
      const result = uploadChunk?.(file.value, chunksInfo);
      return fromPromise(result) as PromiseLike<unknown>;
    } catch (error) {
      return Deferred().reject(error).promise();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _shouldHandleError(_file: FileUploaderItem, _error: unknown): boolean {
    return true;
  }
}
