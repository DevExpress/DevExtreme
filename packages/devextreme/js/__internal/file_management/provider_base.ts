import { ensureDefined } from '@js/core/utils/common';
import { compileGetter } from '@js/core/utils/data';
import dateSerialization from '@js/core/utils/date_serialization';
// @ts-expect-error ts-error
import { Deferred, fromPromise } from '@js/core/utils/deferred';
import { each } from '@js/core/utils/iterator';
import { isPromise } from '@js/core/utils/type';
import type { FileSystemProviderBaseOptions as Options } from '@js/file_management/provider_base';
import type UploadInfo from '@js/file_management/upload_info';
import type { PathInfo } from '@ts/file_management/file_system_item';
import FileSystemItem from '@ts/file_management/file_system_item';

const DEFAULT_FILE_UPLOAD_CHUNK_SIZE = 200000;

abstract class FileSystemProviderBase {
  _keyGetter?: Function;

  _nameGetter?: Function;

  _isDirGetter?: Function;

  _sizeGetter?: Function;

  _dateModifiedGetter?: Function;

  _thumbnailGetter?: Function;

  constructor(options: Options) {
    // eslint-disable-next-line no-param-reassign
    options = ensureDefined(options, {});

    // @ts-expect-error ts-error
    this._keyGetter = compileGetter(this._getKeyExpr(options));
    // @ts-expect-error ts-error
    this._nameGetter = compileGetter(this._getNameExpr(options));
    // @ts-expect-error ts-error
    this._isDirGetter = compileGetter(this._getIsDirExpr(options));
    // @ts-expect-error ts-error
    this._sizeGetter = compileGetter(this._getSizeExpr(options));
    // @ts-expect-error ts-error
    this._dateModifiedGetter = compileGetter(this._getDateModifiedExpr(options));
    // @ts-expect-error ts-error
    this._thumbnailGetter = compileGetter(this._getThumbnailExpr(options));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getItems(parentDirectory: FileSystemItem): Promise<FileSystemItem[]> {
    // @ts-expect-error ts-error
    const deferred = new Deferred<FileSystemItem[]>();
    deferred.resolve([]);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return deferred.promise();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract renameItem(item: FileSystemItem, name: string): Promise<any>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract createDirectory(parentDirectory: FileSystemItem, name: string): Promise<any>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract deleteItems(items: FileSystemItem[]): Promise<any>[];

  abstract moveItems(
    items: FileSystemItem[],
    destinationDirectory: FileSystemItem,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any>[];

  abstract copyItems(
    items: FileSystemItem[],
    destinationDirectory: FileSystemItem,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any>[];

  abstract uploadFileChunk(
    fileData: File,
    chunksInfo: UploadInfo,
    destinationDirectory: FileSystemItem,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any>;

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  abortFileUpload(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fileData: File,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    chunksInfo: UploadInfo,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    destinationDirectory: FileSystemItem,
  ) {
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type,@typescript-eslint/no-explicit-any
  abstract downloadItems(items: FileSystemItem[]): Promise<any> | void;

  // @ts-expect-error ts-error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unused-vars
  getItemsContent(items: FileSystemItem[]): Promise<any> {}

  getFileUploadChunkSize(): number {
    return DEFAULT_FILE_UPLOAD_CHUNK_SIZE;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _convertDataObjectsToFileItems(entries, pathInfo: PathInfo[]): FileSystemItem[] {
    const result: FileSystemItem[] = [];
    each(entries, (_, entry): void => {
      const fileItem = this._createFileItem(entry, pathInfo);
      result.push(fileItem);
    });
    return result;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _createFileItem(dataObj, pathInfo: PathInfo[]): FileSystemItem {
    const key = this._keyGetter?.(dataObj);
    const fileItem = new FileSystemItem(
      pathInfo,
      this._nameGetter?.(dataObj),
      !!this._isDirGetter?.(dataObj),
      key,
    );

    fileItem.size = this._sizeGetter?.(dataObj);
    if (fileItem.size === undefined) {
      fileItem.size = 0;
    }

    fileItem.dateModified = dateSerialization.deserializeDate(this._dateModifiedGetter?.(dataObj));
    if (fileItem.dateModified === undefined) {
      fileItem.dateModified = new Date();
    }

    if (fileItem.isDirectory) {
      fileItem.hasSubDirectories = this._hasSubDirs(dataObj);
    }

    if (!key) {
      fileItem.key = fileItem.relativeName;
    }

    fileItem.thumbnail = this._thumbnailGetter?.(dataObj) || '';
    fileItem.dataItem = dataObj;
    return fileItem;
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/explicit-module-boundary-types
  _hasSubDirs(dataObj): boolean {
    return true;
  }

  _getKeyExpr(options: Options): string | Function {
    return options.keyExpr ?? this._defaultKeyExpr;
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  _defaultKeyExpr(fileItem) {
    if (arguments.length === 2) {
      // eslint-disable-next-line prefer-destructuring,prefer-rest-params
      fileItem.__KEY__ = arguments[1];
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,consistent-return
    return Object.prototype.hasOwnProperty.call(fileItem, '__KEY__') ? fileItem.__KEY__ : null;
  }

  _getNameExpr(options: Options): string | Function {
    return options.nameExpr ?? 'name';
  }

  _getIsDirExpr(options: Options): string | Function {
    return options.isDirectoryExpr ?? 'isDirectory';
  }

  _getSizeExpr(options: Options): string | Function {
    return options.sizeExpr ?? 'size';
  }

  _getDateModifiedExpr(options: Options): string | Function {
    return options.dateModifiedExpr ?? 'dateModified';
  }

  _getThumbnailExpr(options: Options): string | Function {
    return options.thumbnailExpr ?? 'thumbnail';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _executeActionAsDeferred(action: Function, keepResult?: boolean): Promise<any> {
    // @ts-expect-error ts-error
    const deferred = new Deferred();

    try {
      const result = action();

      if (isPromise(result)) {
        fromPromise(result)
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          .done((userResult) => deferred.resolve(keepResult ? userResult : undefined))
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          .fail((error) => deferred.reject(error));
      } else {
        deferred.resolve(keepResult ? result : undefined);
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return deferred.reject(error);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return deferred.promise();
  }
}

export default FileSystemProviderBase;
