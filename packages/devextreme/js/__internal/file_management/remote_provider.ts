import { Guid } from '@js/common';
import eventsEngine from '@js/common/core/events/core/events_engine';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import ajax from '@js/core/utils/ajax';
import { ensureDefined, noop } from '@js/core/utils/common';
import { compileGetter } from '@js/core/utils/data';
import { Deferred } from '@js/core/utils/deferred';
import { each } from '@js/core/utils/iterator';
import { isDefined, isEmptyObject, isFunction } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import type { Options } from '@js/file_management/remote_provider';
import type UploadInfo from '@js/file_management/upload_info';
import type FileSystemItem from '@ts/file_management/file_system_item';
import FileSystemProviderBase from '@ts/file_management/provider_base';

const window = getWindow();
const FILE_CHUNK_BLOB_NAME = 'chunk';
const FILE_SYSTEM_COMMNAD = {
  GET_DIR_CONTENTS: 'GetDirContents',
  CREATE_DIR: 'CreateDir',
  RENAME: 'Rename',
  MOVE: 'Move',
  COPY: 'Copy',
  REMOVE: 'Remove',
  UPLOAD_CHUNK: 'UploadChunk',
  ABORT_UPLOAD: 'AbortUpload',
  DOWLOAD: 'Download',
};
const REQUEST_METHOD = {
  GET: 'GET',
  POST: 'POST',
};

interface DownloadArgs {
  url?: string;
  arguments?: string;
  command?: string;
}

class RemoteFileSystemProvider extends FileSystemProviderBase {
  _endpointUrl?: Options['endpointUrl'];

  _beforeAjaxSend?: Options['beforeAjaxSend'];

  _beforeSubmit?: Options['beforeSubmit'];

  _requestHeaders?: Options['requestHeaders'];

  _hasSubDirsGetter?: Options['hasSubDirectoriesExpr'];

  constructor(options: Options) {
    // eslint-disable-next-line no-param-reassign
    options = ensureDefined(options, {});
    super(options);
    this._endpointUrl = options.endpointUrl;
    this._beforeAjaxSend = options.beforeAjaxSend;
    this._beforeSubmit = options.beforeSubmit;
    this._requestHeaders = options.requestHeaders;
    // @ts-expect-error ts-error
    this._hasSubDirsGetter = compileGetter(options.hasSubDirectoriesExpr ?? 'hasSubDirectories');
  }

  getItems(parentDirectory: FileSystemItem): Promise<FileSystemItem[]> {
    const pathInfo = parentDirectory.getFullPathInfo();
    return this._executeRequest(FILE_SYSTEM_COMMNAD.GET_DIR_CONTENTS, { pathInfo })
      .then((result) => this._convertDataObjectsToFileItems(result.result, pathInfo));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renameItem(item: FileSystemItem, name: string): Promise<any> {
    return this._executeRequest(FILE_SYSTEM_COMMNAD.RENAME, {
      pathInfo: item.getFullPathInfo(),
      isDirectory: item.isDirectory,
      name,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createDirectory(parentDirectory: FileSystemItem, name: string): Promise<any> {
    return this._executeRequest(FILE_SYSTEM_COMMNAD.CREATE_DIR, {
      pathInfo: parentDirectory.getFullPathInfo(),
      name,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deleteItems(items: FileSystemItem[]): Promise<any>[] {
    return items.map((item: FileSystemItem) => this._executeRequest(FILE_SYSTEM_COMMNAD.REMOVE, {
      pathInfo: item.getFullPathInfo(),
      isDirectory: item.isDirectory,
    }));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  moveItems(items: FileSystemItem[], destinationDirectory: FileSystemItem): Promise<any>[] {
    return items.map((item: FileSystemItem) => this._executeRequest(FILE_SYSTEM_COMMNAD.MOVE, {
      sourcePathInfo: item.getFullPathInfo(),
      sourceIsDirectory: item.isDirectory,
      destinationPathInfo: destinationDirectory.getFullPathInfo(),
    }));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  copyItems(items: FileSystemItem[], destinationFolder: FileSystemItem): Promise<any>[] {
    return items.map((item) => this._executeRequest(FILE_SYSTEM_COMMNAD.COPY, {
      sourcePathInfo: item.getFullPathInfo(),
      sourceIsDirectory: item.isDirectory,
      destinationPathInfo: destinationFolder.getFullPathInfo(),
    }));
  }

  uploadFileChunk(
    fileData: File,
    chunksInfo: UploadInfo,
    destinationDirectory: FileSystemItem,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    if (chunksInfo.chunkIndex === 0) {
      chunksInfo.customData.uploadId = new Guid();
    }

    const args = {
      destinationPathInfo: destinationDirectory.getFullPathInfo(),
      chunkMetadata: JSON.stringify({
        UploadId: chunksInfo.customData.uploadId,
        FileName: fileData.name,
        Index: chunksInfo.chunkIndex,
        TotalCount: chunksInfo.chunkCount,
        FileSize: fileData.size,
      }),
    };
    const ajaxSettings = {
      url: this._endpointUrl,
      headers: this._requestHeaders || {},
      method: REQUEST_METHOD.POST,
      dataType: 'json',
      data: {
        [FILE_CHUNK_BLOB_NAME]: chunksInfo.chunkBlob,
        arguments: JSON.stringify(args),
        command: FILE_SYSTEM_COMMNAD.UPLOAD_CHUNK,
      },
      upload: {
        onprogress: noop,
        onloadstart: noop,
        onabort: noop,
      },
      xhrFields: {},
      cache: false,
    };
    // @ts-expect-error ts-error
    const deferred = new Deferred();

    this._beforeSendInternal(ajaxSettings);
    ajax.sendRequest(ajaxSettings)
      .done((result): void => {
        if (result.success) {
          deferred.resolve(result);
        } else {
          deferred.reject(result);
        }
      })
      .fail(deferred.reject);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return deferred.promise();
  }

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  abortFileUpload(
    fileData: File,
    chunksInfo: UploadInfo,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    destinationDirectory: FileSystemItem,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    return this._executeRequest(
      FILE_SYSTEM_COMMNAD.ABORT_UPLOAD,
      { uploadId: chunksInfo.customData.uploadId },
    );
  }

  downloadItems(items: FileSystemItem[]): void {
    const args = this._getDownloadArgs(items);

    const $form = $('<form>')
      .css({ display: 'none' })
      // @ts-expect-error ts-error
      .attr({
        method: REQUEST_METHOD.POST,
        action: args.url,
      });
    const formDataEntries = {
      command: args.command,
      arguments: args.arguments,
    };

    this._beforeSubmitInternal(formDataEntries);
    this._appendFormDataInputsToForm(formDataEntries, $form);

    // @ts-expect-error ts-error
    $form.appendTo('body');

    // @ts-expect-error ts-error
    eventsEngine.trigger($form, 'submit');

    // eslint-disable-next-line no-restricted-globals
    setTimeout(() => $form.remove());
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getItemsContent(items: FileSystemItem[]): Promise<any> {
    const args = this._getDownloadArgs(items);
    const ajaxSettings = {
      url: args.url,
      headers: this._requestHeaders || {},
      method: REQUEST_METHOD.POST,
      responseType: 'arraybuffer',
      data: {
        command: args.command,
        arguments: args.arguments,
      },
      upload: {
        onprogress: noop,
        onloadstart: noop,
        onabort: noop,
      },
      xhrFields: {},
      cache: false,
    };

    this._beforeSendInternal(ajaxSettings);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return ajax.sendRequest(ajaxSettings);
  }

  _getDownloadArgs(items: FileSystemItem[]): DownloadArgs {
    const pathInfoList = items.map((item) => item.getFullPathInfo());
    const args = { pathInfoList };
    const argsStr = JSON.stringify(args);
    return {
      url: this._endpointUrl,
      arguments: argsStr,
      command: FILE_SYSTEM_COMMNAD.DOWLOAD,
    };
  }

  _getItemsIds(items: FileSystemItem[]): (string | undefined)[] {
    return items.map((it) => it.relativeName);
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  _executeRequest(command: string, args): Promise<any> {
    const method = command === FILE_SYSTEM_COMMNAD.GET_DIR_CONTENTS
      ? REQUEST_METHOD.GET : REQUEST_METHOD.POST;
    // @ts-expect-error ts-error
    const deferred = new Deferred();
    const ajaxSettings = {
      url: this._getEndpointUrl(command, args),
      headers: this._requestHeaders || {},
      method,
      dataType: 'json',
      data: {},
      xhrFields: {},
      cache: false,
    };

    this._beforeSendInternal(ajaxSettings);
    ajax.sendRequest(ajaxSettings).then(
      (result): void => {
        if (result.success) {
          deferred.resolve(result);
        } else {
          deferred.reject(result);
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      (e) => deferred.reject(e),
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return deferred.promise();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _beforeSubmitInternal(formDataEntries): void {
    if (isFunction(this._beforeSubmit)) {
      this._beforeSubmit({ formData: formDataEntries });
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _beforeSendInternal(ajaxSettings): void {
    if (isFunction(this._beforeAjaxSend)) {
      const ajaxArguments = {
        headers: ajaxSettings.headers,
        formData: ajaxSettings.data,
        xhrFields: ajaxSettings.xhrFields,
      };

      this._beforeAjaxSend(ajaxArguments);
      ajaxSettings.headers = ajaxArguments.headers;
      ajaxSettings.data = ajaxArguments.formData;
      ajaxSettings.xhrFields = ajaxArguments.xhrFields;
    }
    if (isEmptyObject(ajaxSettings.data)) {
      delete ajaxSettings.data;
      // if using core.utils.ajax
    } else if (ajaxSettings.responseType || ajaxSettings.upload) {
      ajaxSettings.data = this._createFormData(ajaxSettings.data);
    }
    // else using jQuery.ajax, keep plain object
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  _createFormData(formDataEntries) {
    // @ts-expect-error ts-error
    const formData = new window.FormData();
    // eslint-disable-next-line no-restricted-syntax
    for (const entryName in formDataEntries) {
      if (Object.prototype.hasOwnProperty.call(formDataEntries, entryName)
        && isDefined(formDataEntries[entryName])) {
        formData.append(entryName, formDataEntries[entryName]);
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return formData;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _appendFormDataInputsToForm(formDataEntries, formElement: dxElementWrapper): void {
    // eslint-disable-next-line no-restricted-syntax
    for (const entryName in formDataEntries) {
      if (Object.prototype.hasOwnProperty.call(formDataEntries, entryName)
        && isDefined(formDataEntries[entryName])) {
        // @ts-expect-error ts-error
        $('<input>').attr({
          type: 'hidden',
          name: entryName,
          value: formDataEntries[entryName],
        }).appendTo(formElement);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _getEndpointUrl(command: string, args): string {
    const queryString = this._getQueryString({
      command,
      arguments: JSON.stringify(args),
    });
    const separator = this._endpointUrl && this._endpointUrl.indexOf('?') > 0 ? '&' : '?';
    return this._endpointUrl + separator + queryString;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _getQueryString(params): string {
    const pairs: string[] = [];

    const keys = Object.keys(params);
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      let value = params[key];

      if (value === undefined) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (value === null) {
        value = '';
      }

      if (Array.isArray(value)) {
        this._processQueryStringArrayParam(key, value, pairs);
      } else {
        const pair = this._getQueryStringPair(key, value);
        pairs.push(pair);
      }
    }

    return pairs.join('&');
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _processQueryStringArrayParam(key, array, pairs): void {
    each(array, (_, item) => {
      const pair = this._getQueryStringPair(key, item);
      pairs.push(pair);
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _getQueryStringPair(key, value): string {
    return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _hasSubDirs(dataObj): boolean {
    const hasSubDirs = isFunction(this._hasSubDirsGetter) && this._hasSubDirsGetter(dataObj);
    return typeof hasSubDirs === 'boolean' ? hasSubDirs : true;
  }

  _getKeyExpr(options: Options): string | Function {
    return options.keyExpr ?? 'key';
  }
}

export default RemoteFileSystemProvider;
