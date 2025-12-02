import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { FileUploadStrategyBase } from '@ts/ui/file_uploader/file_upload_strategy.base';
import type {
  FileUploaderItem,
  LoadedFileData,
} from '@ts/ui/file_uploader/file_uploader.types';

export class WholeFileUploadStrategyBase extends FileUploadStrategyBase {
  _uploadCore(file: FileUploaderItem): void {
    file.loadedSize = 0;

    const uploadFileDeferred = this._uploadFile(file);

    if ('done' in uploadFileDeferred) {
      uploadFileDeferred.done(() => {
        if (!file.isAborted) {
          file.onLoad.fire();
        }
      })
        .fail((error) => {
          if (this._shouldHandleError(file, error as { status: number })) {
            this._handleFileError(file, error);
          }
        });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _uploadFile(_file: FileUploaderItem): PromiseLike<unknown> | DeferredObj<unknown> {
    // Abstract method: subclasses should override this.
    // Return a rejected Deferred to satisfy the return type.
    return Deferred().reject();
  }

  _handleProgressCore(
    file: FileUploaderItem,
    e: Event | { loaded?: number; total?: number },
  ): void {
    file.onProgress.fire(e);
  }

  _getLoadedData(
    loaded: number,
    total: number,
    segmentSize: number,
    event: Event,
  ): LoadedFileData {
    const result = super._getLoadedData(loaded, total, segmentSize, event);
    result.event = event;
    return result;
  }
}
