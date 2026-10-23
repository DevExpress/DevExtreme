import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { fromPromise } from '@ts/core/utils/deferred';
import { WholeFileUploadStrategyBase } from '@ts/ui/file_uploader/file_upload_strategy.whole.base';
import type { FileUploaderItem } from '@ts/ui/file_uploader/file_uploader.types';

export class CustomWholeFileUploadStrategy extends WholeFileUploadStrategyBase {
  _uploadFile(file: FileUploaderItem): PromiseLike<unknown> | DeferredObj<unknown> {
    file.onLoadStart.fire();

    const progressCallback = (loadedBytes: number): void => {
      const arg = {
        loaded: loadedBytes,
        total: file.value.size,
      };
      this._handleProgress(file, arg);
    };

    const { uploadFile } = this.fileUploader.option();
    try {
      const result = uploadFile?.(file.value, progressCallback);
      return fromPromise(result);
    } catch (error) {
      return Deferred().reject(error).promise();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _shouldHandleError(_file: FileUploaderItem, _e: unknown): boolean {
    return true;
  }
}
