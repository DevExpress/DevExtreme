import ajax from '@js/core/utils/ajax';
import type { DeferredObj } from '@js/core/utils/deferred';
import { ChunksFileUploadStrategyBase } from '@ts/ui/file_uploader/file_upload_strategy.chunks.base';
import type {
  ChunkFormDataOptions,
  FileBlobChunk,
  FileUploaderChunksData,
  FileUploaderChunkUploadResponse,
  FileUploaderItem,
} from '@ts/ui/file_uploader/file_uploader.types';

const FILEUPLOADER_CHUNK_META_DATA_NAME = 'chunkMetadata';

export class DefaultChunksFileUploadStrategy extends ChunksFileUploadStrategyBase {
  _sendChunkCore(
    file: FileUploaderItem,
    chunksData: FileUploaderChunksData,
    chunk: FileBlobChunk,
  ): DeferredObj<FileUploaderChunkUploadResponse> {
    const {
      uploadUrl, uploadMethod, uploadHeaders, name,
    } = this.fileUploader.option();

    return ajax.sendRequest({
      url: uploadUrl,
      method: uploadMethod,
      headers: uploadHeaders,
      beforeSend: (xhr: XMLHttpRequest) => this._beforeSend(xhr, file),
      upload: {
        onprogress: (e: Event) => this._handleProgress(file, e),
        onloadstart: () => this._tryRaiseStartLoad(file),
        onabort: () => file.onAbort.fire(),
      },
      data: this._createFormData({
        fileName: chunksData.name,
        blobName: name,
        blob: chunk.blob,
        index: chunk.index,
        count: chunksData.count,
        type: chunksData.type,
        guid: chunksData.guid,
        size: chunksData.fileSize,
      }),
    }) as DeferredObj<FileUploaderChunkUploadResponse>;
  }

  _createFormData(options: ChunkFormDataOptions): FormData {
    // @ts-ignore: window.FormData may not be typed in all environments
    const formData = new window.FormData();
    formData.append(options.blobName as string, options.blob as Blob);
    formData.append(FILEUPLOADER_CHUNK_META_DATA_NAME, JSON.stringify({
      FileName: options.fileName,
      Index: options.index,
      TotalCount: options.count,
      FileSize: options.size,
      FileType: options.type,
      FileGuid: options.guid,
    }));
    this._extendFormData(formData);

    return formData;
  }
}
