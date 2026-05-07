import { ensureDefined, noop } from '@js/core/utils/common';
import { compileGetter } from '@js/core/utils/data';
import { isFunction } from '@js/core/utils/type';
import type { Options } from '@js/file_management/custom_provider';
import type UploadInfo from '@js/file_management/upload_info';
import type FileSystemItem from '@ts/file_management/file_system_item';
import FileSystemProviderBase from '@ts/file_management/provider_base';

class CustomFileSystemProvider extends FileSystemProviderBase {
  _hasSubDirsGetter?: Function;

  _getItemsFunction?: Function;

  _renameItemFunction?: Function;

  _createDirectoryFunction?: Function;

  _deleteItemFunction?: Function;

  _moveItemFunction?: Function;

  _copyItemFunction?: Function;

  _uploadFileChunkFunction?: Function;

  _abortFileUploadFunction?: Function;

  _downloadItemsFunction?: Function;

  _getItemsContentFunction?: Function;

  constructor(options: Options) {
    // eslint-disable-next-line no-param-reassign
    options = ensureDefined(options, { });
    super(options);

    // @ts-expect-error ts-error
    this._hasSubDirsGetter = compileGetter(options.hasSubDirectoriesExpr ?? 'hasSubDirectories');

    this._getItemsFunction = this._ensureFunction(options.getItems, () => []);

    this._renameItemFunction = this._ensureFunction(options.renameItem);

    this._createDirectoryFunction = this._ensureFunction(options.createDirectory);

    this._deleteItemFunction = this._ensureFunction(options.deleteItem);

    this._moveItemFunction = this._ensureFunction(options.moveItem);

    this._copyItemFunction = this._ensureFunction(options.copyItem);

    this._uploadFileChunkFunction = this._ensureFunction(options.uploadFileChunk);

    this._abortFileUploadFunction = this._ensureFunction(options.abortFileUpload);

    this._downloadItemsFunction = this._ensureFunction(options.downloadItems);

    this._getItemsContentFunction = this._ensureFunction(options.getItemsContent);
  }

  getItems(parentDirectory: FileSystemItem): Promise<FileSystemItem[]> {
    const pathInfo = parentDirectory.getFullPathInfo();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._executeActionAsDeferred(() => this._getItemsFunction?.(parentDirectory), true)
      .then((dataItems) => this._convertDataObjectsToFileItems(dataItems, pathInfo));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renameItem(item: FileSystemItem, name: string): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._executeActionAsDeferred(() => this._renameItemFunction?.(item, name));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createDirectory(parentDirectory: FileSystemItem, name: string): Promise<any> {
    return this._executeActionAsDeferred(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      () => this._createDirectoryFunction?.(parentDirectory, name),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deleteItems(items: FileSystemItem[]): Promise<any>[] {
    return items.map((item) => this._executeActionAsDeferred(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      () => this._deleteItemFunction?.(item),
    ));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  moveItems(items: FileSystemItem[], destinationDirectory: FileSystemItem): Promise<any>[] {
    return items.map((item) => this._executeActionAsDeferred(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      () => this._moveItemFunction?.(item, destinationDirectory),
    ));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  copyItems(items: FileSystemItem[], destinationFolder: FileSystemItem): Promise<any>[] {
    return items.map((item) => this._executeActionAsDeferred(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      () => this._copyItemFunction?.(item, destinationFolder),
    ));
  }

  uploadFileChunk(
    fileData: File,
    chunksInfo: UploadInfo,
    destinationDirectory: FileSystemItem,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    return this._executeActionAsDeferred(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      () => this._uploadFileChunkFunction?.(fileData, chunksInfo, destinationDirectory),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  abortFileUpload(
    fileData: File,
    chunksInfo: UploadInfo,
    destinationDirectory: FileSystemItem,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    return this._executeActionAsDeferred(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      () => this._abortFileUploadFunction?.(fileData, chunksInfo, destinationDirectory),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  downloadItems(items: FileSystemItem[]): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._executeActionAsDeferred(() => this._downloadItemsFunction?.(items));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getItemsContent(items: FileSystemItem[]): Promise<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._executeActionAsDeferred(() => this._getItemsContentFunction?.(items));
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  _hasSubDirs(dataObj): boolean {
    const hasSubDirs = this._hasSubDirsGetter?.(dataObj);
    return typeof hasSubDirs === 'boolean' ? hasSubDirs : true;
  }

  _getKeyExpr(options: Options): string | Function {
    return options.keyExpr ?? 'key';
  }

  // eslint-disable-next-line @stylistic/max-len
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/no-explicit-any
  _ensureFunction(functionObject: any, defaultFunction?: Function): Function {
    // eslint-disable-next-line no-param-reassign
    defaultFunction = defaultFunction ?? noop;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return isFunction(functionObject) ? functionObject : defaultFunction;
  }
}

export default CustomFileSystemProvider;
