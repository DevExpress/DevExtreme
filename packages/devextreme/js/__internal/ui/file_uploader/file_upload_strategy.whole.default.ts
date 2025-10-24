import ajax from '@js/core/utils/ajax';
import type { DeferredObj } from '@js/core/utils/deferred';
import { WholeFileUploadStrategyBase } from '@ts/ui/file_uploader/file_upload_strategy.whole.base';
import type {
  FileUploaderChunkUploadResponse,
  FileUploaderItem,
} from '@ts/ui/file_uploader/file_uploader.types';

export class DefaultWholeFileUploadStrategy extends WholeFileUploadStrategyBase {
  _uploadFile(file: FileUploaderItem): DeferredObj<FileUploaderChunkUploadResponse> {
    const {
      uploadUrl, uploadMethod, uploadHeaders, name,
    } = this.fileUploader.option();

    return ajax.sendRequest({
      url: uploadUrl,
      method: uploadMethod,
      headers: uploadHeaders,
      beforeSend: (xhr: XMLHttpRequest) => this._beforeSend(xhr, file),
      upload: {
        onprogress: (e) => this._handleProgress(file, e),
        onloadstart: () => file.onLoadStart.fire(),
        onabort: () => file.onAbort.fire(),
      },
      data: this._createFormData(name, file.value),
    }) as DeferredObj<FileUploaderChunkUploadResponse>;
  }

  _createFormData(fieldName?: string, fieldValue?: File): FormData {
    // @ts-ignore: window.FormData may not be typed in all environments
    const formData = new window.FormData();
    formData.append(fieldName as string, fieldValue as File, fieldValue?.name);
    this._extendFormData(formData);

    return formData;
  }
}
