import { Guid } from '@js/common';
import { errors } from '@js/common/data/errors';
import { ensureDefined } from '@js/core/utils/common';
import { compileGetter, compileSetter } from '@js/core/utils/data';
import { Deferred } from '@js/core/utils/deferred';
import { isFunction } from '@js/core/utils/type';
import { getWindow } from '@js/core/utils/window';
import type { Options } from '@js/file_management/object_provider';
import type UploadInfo from '@js/file_management/upload_info';
import Errors from '@js/ui/widget/ui.errors';
import { fileSaver } from '@ts/exporter/file_saver';
import FileSystemError from '@ts/file_management/error';
import ErrorCode from '@ts/file_management/error_codes';
import type FileSystemItem from '@ts/file_management/file_system_item';
import FileSystemProviderBase from '@ts/file_management/provider_base';
import { pathCombine } from '@ts/file_management/utils';
import JSZip from 'jszip';

const window = getWindow();

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function getJSZip() {
  if (!JSZip) {
    throw Errors.Error('E1041', 'JSZip');
  }

  return JSZip;
}

class ObjectFileSystemProvider extends FileSystemProviderBase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _subFileItemsGetter?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _subFileItemsSetter?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _contentGetter?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _contentSetter?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _nameSetter?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _getIsDirSetter?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _keySetter?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _sizeSetter?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _dateModifiedSetter?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _data?: any;

  constructor(options: Options) {
    // eslint-disable-next-line no-param-reassign
    options = ensureDefined(options, { });
    super(options);

    const initialArray = options.data;
    if (initialArray && !Array.isArray(initialArray)) {
      throw errors.Error('E4006');
    }

    const itemsExpr = options.itemsExpr ?? 'items';
    // @ts-expect-error ts-error
    this._subFileItemsGetter = compileGetter(itemsExpr);
    this._subFileItemsSetter = this._getSetter(itemsExpr);

    const contentExpr = options.contentExpr ?? 'content';
    // @ts-expect-error ts-error
    this._contentGetter = compileGetter(contentExpr);
    this._contentSetter = this._getSetter(contentExpr);

    const nameExpr = this._getNameExpr(options);
    this._nameSetter = this._getSetter(nameExpr);

    const isDirExpr = this._getIsDirExpr(options);
    this._getIsDirSetter = this._getSetter(isDirExpr);

    const keyExpr = this._getKeyExpr(options);
    this._keySetter = this._getSetter(keyExpr);

    const sizeExpr = this._getSizeExpr(options);
    this._sizeSetter = this._getSetter(sizeExpr);

    const dateModifiedExpr = this._getDateModifiedExpr(options);
    this._dateModifiedSetter = this._getSetter(dateModifiedExpr);

    this._data = initialArray ?? [];
  }

  getItems(parentDirectory: FileSystemItem): Promise<FileSystemItem[]> {
    return this._executeActionAsDeferred(() => this._getItems(parentDirectory), true);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renameItem(item: FileSystemItem, name: string): Promise<any> {
    return this._executeActionAsDeferred(() => this._renameItemCore(item, name));
  }

  _renameItemCore(item: FileSystemItem, name: string): void {
    if (!item) {
      return;
    }
    const dataItem = this._findDataObject(item);
    this._nameSetter(dataItem, name);
    item.name = name;
    item.key = this._ensureDataObjectKey(dataItem);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createDirectory(parentDirectory: FileSystemItem, name: string): Promise<any> {
    return this._executeActionAsDeferred(() => {
      this._validateDirectoryExists(parentDirectory);
      this._createDataObject(parentDirectory, name, true);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deleteItems(items: FileSystemItem[]): Promise<any>[] {
    return items.map((item) => this._executeActionAsDeferred(() => this._deleteItem(item)));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  moveItems(items: FileSystemItem[], destinationDirectory: FileSystemItem): Promise<any>[] {
    const destinationDataItem = this._findDataObject(destinationDirectory);
    const array = this._getDirectoryDataItems(destinationDataItem);

    return items.map((item) => this._executeActionAsDeferred(() => {
      this._checkAbilityToMoveOrCopyItem(item, destinationDirectory);

      const dataItem = this._findDataObject(item);
      this._deleteItem(item);
      array.push(dataItem);
    }));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  copyItems(items: FileSystemItem[], destinationDirectory: FileSystemItem): Promise<any>[] {
    const destinationDataItem = this._findDataObject(destinationDirectory);
    const array = this._getDirectoryDataItems(destinationDataItem);

    return items.map((item) => this._executeActionAsDeferred(() => {
      this._checkAbilityToMoveOrCopyItem(item, destinationDirectory);

      const dataItem = this._findDataObject(item);
      const copiedItem = this._createCopy(dataItem);
      array.push(copiedItem);
    }));
  }

  uploadFileChunk(
    fileData: File,
    chunksInfo: UploadInfo,
    destinationDirectory: FileSystemItem,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    if (chunksInfo.chunkIndex > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return chunksInfo.customData.deferred;
    }

    this._validateDirectoryExists(destinationDirectory);

    // @ts-expect-error ts-error
    // eslint-disable-next-line no-multi-assign
    const deferred = chunksInfo.customData.deferred = new Deferred();
    const reader = this._createFileReader();
    reader.readAsDataURL(fileData);

    reader.onload = (): void => {
      const content = reader.result.split(',')[1];

      const dataObj = this._createDataObject(destinationDirectory, fileData.name, false);
      this._sizeSetter(dataObj, fileData.size);
      this._dateModifiedSetter(dataObj, fileData.lastModified);
      this._contentSetter(dataObj, content);

      deferred.resolve();
    };

    // eslint-disable-next-line @stylistic/max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/explicit-function-return-type
    reader.onerror = (error) => deferred.reject(error);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return deferred;
  }

  downloadItems(items: FileSystemItem[]): void {
    if (items.length === 1) {
      this._downloadSingleFile(items[0]);
    } else {
      this._downloadMultipleFiles(items);
    }
  }

  _downloadSingleFile(file: FileSystemItem): void {
    const content = this._getFileContent(file);

    const byteString = window.atob(content);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i += 1) {
      array[i] = byteString.charCodeAt(i);
    }

    // @ts-expect-error ts-error
    const blob = new window.Blob([arrayBuffer], { type: 'application/octet-stream' });
    fileSaver.saveAs(file.name, null, blob);
  }

  _downloadMultipleFiles(files: FileSystemItem[]): void {
    const jsZip = getJSZip();
    // eslint-disable-next-line new-cap
    const zip = new jsZip();

    files.forEach((file) => zip.file(file.name, this._getFileContent(file), { base64: true }));

    const options = {
      type: 'blob',
      compression: 'DEFLATE',
      mimeType: 'application/zip',
    };
    // @ts-expect-error ts-error
    const deferred = new Deferred();

    if (zip.generateAsync) {
      // @ts-expect-error ts-error
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      zip.generateAsync(options).then(deferred.resolve);
    } else {
      // @ts-expect-error ts-error
      deferred.resolve(zip.generate(options));
    }

    deferred.done((blob) => fileSaver.saveAs('files.zip', null, blob));
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  _getFileContent(file: FileSystemItem) {
    const dataItem = this._findDataObject(file);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._contentGetter(dataItem) || '';
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _validateDirectoryExists(directoryInfo): void {
    if (!this._isFileItemExists(directoryInfo) || this._isDirGetter?.(directoryInfo.fileItem)) {
      throw new FileSystemError(ErrorCode.DirectoryNotFound, directoryInfo);
    }
  }

  _checkAbilityToMoveOrCopyItem(item: FileSystemItem, destinationDirectory: FileSystemItem): void {
    const dataItem = this._findDataObject(item);
    const itemKey = this._getKeyFromDataObject(dataItem, item.parentPath);
    const pathInfo = destinationDirectory.getFullPathInfo();
    let currentPath = '';

    pathInfo.forEach((info) => {
      currentPath = pathCombine(currentPath, info.name);
      const pathKey = this._getDataObjectKey(info.key, currentPath);
      if (pathKey === itemKey) {
        throw new FileSystemError(ErrorCode.Other, item);
      }
    });
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  _createDataObject(parentDirectory: FileSystemItem, name: string, isDirectory: boolean) {
    const dataObj = {};

    this._nameSetter(dataObj, name);
    this._getIsDirSetter(dataObj, isDirectory);
    this._keySetter(dataObj, String(new Guid()));

    const parentDataItem = this._findDataObject(parentDirectory);
    const array = this._getDirectoryDataItems(parentDataItem);
    array.push(dataObj);

    return dataObj;
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  _createCopy(dataObj) {
    const copyObj = {};
    this._nameSetter(copyObj, this._nameGetter?.(dataObj));
    this._getIsDirSetter(copyObj, this._isDirGetter?.(dataObj));

    const items = this._subFileItemsGetter(dataObj);
    if (Array.isArray(items)) {
      const itemsCopy = [];
      items.forEach((childItem): void => {
        const childCopy = this._createCopy(childItem);
        // @ts-expect-error ts-error
        itemsCopy.push(childCopy);
      });
      this._subFileItemsSetter(copyObj, itemsCopy);
    }
    return copyObj;
  }

  _deleteItem(fileItem: FileSystemItem): void {
    const dataItem = this._findDataObject(fileItem);
    const parentDirDataObj = this._findFileItemObj(fileItem.pathInfo);
    const array = this._getDirectoryDataItems(parentDirDataObj);
    const index = array.indexOf(dataItem);
    array.splice(index, 1);
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  _getDirectoryDataItems(directoryDataObj) {
    if (!directoryDataObj) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this._data;
    }

    let dataItems = this._subFileItemsGetter(directoryDataObj);
    if (!Array.isArray(dataItems)) {
      dataItems = [];
      this._subFileItemsSetter(directoryDataObj, dataItems);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return dataItems;
  }

  _getItems(parentDirectory: FileSystemItem): FileSystemItem[] {
    this._validateDirectoryExists(parentDirectory);
    const pathInfo = parentDirectory.getFullPathInfo();
    const parentDirKey = pathInfo && pathInfo.length > 0 ? pathInfo[pathInfo.length - 1].key : null;
    let dirFileObjects = this._data;
    if (parentDirKey) {
      const directoryEntry = this._findFileItemObj(pathInfo);
      // eslint-disable-next-line @stylistic/max-len
      // eslint-disable-next-line @stylistic/no-mixed-operators,@typescript-eslint/prefer-nullish-coalescing
      dirFileObjects = directoryEntry && this._subFileItemsGetter(directoryEntry) || [];
    }

    this._ensureKeysForDuplicateNameItems(dirFileObjects);

    return this._convertDataObjectsToFileItems(dirFileObjects, pathInfo);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _ensureKeysForDuplicateNameItems(dataObjects): void {
    const names = {};

    dataObjects.forEach((obj): void => {
      const name = this._nameGetter?.(obj);
      if (names[name]) {
        this._ensureDataObjectKey(obj);
      } else {
        names[name] = true;
      }
    });
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  _findDataObject(item: FileSystemItem) {
    if (item.isRoot()) {
      return null;
    }

    const result = this._findFileItemObj(item.getFullPathInfo());
    if (!result) {
      const errorCode = item.isDirectory ? ErrorCode.DirectoryNotFound : ErrorCode.FileNotFound;
      throw new FileSystemError(errorCode, item);
    }
    return result;
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  _findFileItemObj(pathInfo) {
    if (!Array.isArray(pathInfo)) {
      // eslint-disable-next-line no-param-reassign
      pathInfo = [];
    }

    let currentPath = '';
    let fileItemObj = null;
    let fileItemObjects = this._data;
    for (let i = 0; i < pathInfo.length && (i === 0 || fileItemObj); i += 1) {
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      fileItemObj = fileItemObjects.find((item) => {
        const hasCorrectFileItemType = this._isDirGetter?.(item) || i === pathInfo.length - 1;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this._getKeyFromDataObject(item, currentPath) === pathInfo[i].key
          && this._nameGetter?.(item) === pathInfo[i].name && hasCorrectFileItemType;
      });
      if (fileItemObj) {
        currentPath = pathCombine(currentPath, this._nameGetter?.(fileItemObj));
        fileItemObjects = this._subFileItemsGetter(fileItemObj);
      }
    }
    return fileItemObj;
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  _getKeyFromDataObject(dataObj, defaultKeyPrefix) {
    const key = this._keyGetter?.(dataObj);
    const relativeName = pathCombine(defaultKeyPrefix, this._nameGetter?.(dataObj));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._getDataObjectKey(key, relativeName);
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  _getDataObjectKey(key, relativeName) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return key || relativeName;
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
  _ensureDataObjectKey(dataObj) {
    let key = this._keyGetter?.(dataObj);
    if (!key) {
      key = String(new Guid());
      this._keySetter(dataObj, key);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return key;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _hasSubDirs(dataObj): boolean {
    const subItems = ensureDefined(this._subFileItemsGetter(dataObj), []);

    if (!Array.isArray(subItems)) {
      return true;
    }

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < subItems.length; i += 1) {
      if (this._isDirGetter?.(subItems[i]) === true) {
        return true;
      }
    }
    return false;
  }

  _getSetter(expr: string | Function): Function {
    // @ts-expect-error ts-error
    return isFunction(expr) ? expr : compileSetter(expr);
  }

  _isFileItemExists(fileItem: FileSystemItem): boolean {
    return fileItem.isDirectory
      // eslint-disable-next-line @stylistic/no-mixed-operators
      && fileItem.isRoot()
      // eslint-disable-next-line @stylistic/max-len
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing,@stylistic/no-mixed-operators
      || !!this._findFileItemObj(fileItem.getFullPathInfo());
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
  _createFileReader() {
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return new window.FileReader();
  }
}

export default ObjectFileSystemProvider;
