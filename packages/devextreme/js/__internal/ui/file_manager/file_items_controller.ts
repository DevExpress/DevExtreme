/* eslint-disable max-classes-per-file,@typescript-eslint/explicit-module-boundary-types */
import Guid from '@js/core/guid';
import { equalByValue } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { isDefined, isObject, isPromise } from '@js/core/utils/type';
import type { Properties as FileManagerProperties } from '@js/ui/file_manager';
import CustomFileSystemProvider from '@ts/file_management/custom_provider';
import FileSystemError from '@ts/file_management/error';
import ErrorCode from '@ts/file_management/error_codes';
import FileSystemItem from '@ts/file_management/file_system_item';
import ObjectFileSystemProvider from '@ts/file_management/object_provider';
import FileSystemProviderBase from '@ts/file_management/provider_base';
import RemoteFileSystemProvider from '@ts/file_management/remote_provider';
import {
  getEscapedFileName,
  getFileExtension,
  getPathParts,
  pathCombine,
} from '@ts/file_management/utils';
import type { FileManagerActions } from '@ts/ui/file_manager/ui.file_manager';
import { whenSome } from '@ts/ui/file_manager/ui.file_manager.common';

const DEFAULT_ROOT_FILE_SYSTEM_ITEM_NAME = 'Files';

export const OPERATIONS = {
  NAVIGATION: 'navigation',
  REFRESH: 'refresh',
};

interface ErrorInfo {
  errorCode?: string;
  errorText?: string;
}

interface FileSecurityControllerOptions {
  allowedFileExtensions?: string[];
  maxFileSize?: number;
}

class FileSecurityController {
  _options: FileSecurityControllerOptions;

  _extensionsMap: Record<string, boolean>;

  constructor(options: FileSecurityControllerOptions) {
    const defaultOptions = {
      allowedFileExtensions: [],
      maxFileSize: 0,
    };

    this._options = extend(defaultOptions, options);

    this._extensionsMap = {};
    this._allowedFileExtensions?.forEach((extension): void => {
      this._extensionsMap[extension.toUpperCase()] = true;
    });
  }

  getAllowedItems(items: FileSystemItem[]): FileSystemItem[] {
    if (this._allowedFileExtensions?.length === 0) {
      return items;
    }
    return items.filter(
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      (item: FileSystemItem): boolean => item.isDirectory || this._isValidExtension(item.name),
    );
  }

  validateExtension(name: string): void {
    if (!this._isValidExtension(name)) {
      throw new FileSystemError(ErrorCode.WrongFileExtension);
    }
  }

  validateMaxFileSize(size: number): void {
    if (this._maxFileSize && size > this._maxFileSize) {
      throw new FileSystemError(ErrorCode.MaxFileSizeExceeded);
    }
  }

  _isValidExtension(name: string): boolean {
    if (this._allowedFileExtensions?.length === 0) {
      return true;
    }
    const extension = getFileExtension(name).toUpperCase();
    return this._extensionsMap[extension];
  }

  get _allowedFileExtensions(): string[] | undefined {
    return this._options?.allowedFileExtensions;
  }

  get _maxFileSize(): number | undefined {
    return this._options?.maxFileSize;
  }
}

interface FileItemsControllerOptions {
  currentPathKeys?: FileManagerProperties['currentPathKeys'];
  currentPath?: FileManagerProperties['currentPath'];
  allowedFileExtensions?: FileManagerProperties['allowedFileExtensions'];
  uploadMaxFileSize?: NonNullable<FileManagerProperties['upload']>['maxFileSize'];
  uploadChunkSize?: NonNullable<FileManagerProperties['upload']>['chunkSize'];
  rootText?: FileManagerProperties['rootFolderName'];
  fileProvider?: FileManagerProperties['fileSystemProvider'];
  onInitialized?: (e: { controller: FileItemsController }) => void;
  onDataLoading?: (e: { operation: string }) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSelectedDirectoryChanged?: (e: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPathPotentiallyChanged?: (e: any) => void;
  editingEvents?: FileManagerActions['editing'];
}

export class FileItemsController {
  _options: FileItemsControllerOptions;

  _isInitialized: boolean;

  _dataLoading: boolean;

  _dataLoadingDeferred: DeferredObj<void> | null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _rootDirectoryInfo: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _currentDirectoryInfo: any;

  _defaultIconMap: Record<string, string>;

  _singleOperationLockId?: string;

  _fileProvider?: FileSystemProviderBase;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _loadedItems!: Record<string, DeferredObj<any>>;

  _securityController?: FileSecurityController;

  _lockRefresh?: boolean;

  _refreshDeferred?: DeferredObj<void>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _selectedDirectory?: any;

  constructor(options: FileItemsControllerOptions) {
    // eslint-disable-next-line no-param-reassign
    options = options || {};
    this._options = extend({}, options);

    this._isInitialized = false;
    this._dataLoading = false;
    this._dataLoadingDeferred = null;

    this._rootDirectoryInfo = this._createRootDirectoryInfo(options.rootText);
    this._currentDirectoryInfo = this._rootDirectoryInfo;

    this._defaultIconMap = this._createDefaultIconMap();

    this.startSingleLoad();
    this._setSecurityController();
    this._setProvider(options.fileProvider);
    this._initialize();
  }

  _initialize(): void {
    const result = this._options.currentPathKeys?.length
      ? this.setCurrentPathByKeys(this._options.currentPathKeys)
      : this.setCurrentPath(this._options.currentPath);

    const completeInitialization = (): void => {
      this._isInitialized = true;
      this._raiseInitialized();
    };

    if (result) {
      when(result).always(completeInitialization);
    } else {
      completeInitialization();
    }
  }

  _setSecurityController(): void {
    this._securityController = new FileSecurityController({
      allowedFileExtensions: this._options.allowedFileExtensions,
      maxFileSize: this._options.uploadMaxFileSize,
    });
    this._resetState();
  }

  setAllowedFileExtensions(allowedFileExtensions?: string[]): void {
    if (isDefined(allowedFileExtensions)) {
      this._options.allowedFileExtensions = allowedFileExtensions;
    }
    this._setSecurityController();
    this.refresh();
  }

  setUploadOptions({ maxFileSize, chunkSize }: { maxFileSize?: number; chunkSize?: number }): void {
    if (isDefined(chunkSize)) {
      this._options.uploadChunkSize = chunkSize;
    }
    if (isDefined(maxFileSize)) {
      this._options.uploadMaxFileSize = maxFileSize;
      this._setSecurityController();
      this.refresh();
    }
  }

  _setProvider(fileProvider): void {
    this._fileProvider = this._createFileProvider(fileProvider);
    this._resetState();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateProvider(fileProvider, currentPathKeys?: string[]): DeferredObj<any> {
    if (!isDefined(currentPathKeys)) {
      return this._updateProviderOnly(fileProvider);
    }

    return when(
      this._getDirectoryByPathParts(
        this._rootDirectoryInfo,
        currentPathKeys,
        true,
      ),
    )
      .then((newDirectory) => {
        if (newDirectory !== this._rootDirectoryInfo) {
          this._resetCurrentDirectory();
        }
        this._setProvider(fileProvider);
      })
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      .then(() => this.setCurrentPathByKeys(currentPathKeys));
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _updateProviderOnly(fileProvider): DeferredObj<any> {
    this._resetCurrentDirectory();
    this._setProvider(fileProvider);
    return when(this.refresh());
  }

  _createFileProvider(fileProvider): FileSystemProviderBase {
    if (!fileProvider) {
      // eslint-disable-next-line no-param-reassign
      fileProvider = [];
    }

    if (Array.isArray(fileProvider)) {
      return new ObjectFileSystemProvider({ data: fileProvider });
    }

    if (fileProvider instanceof FileSystemProviderBase) {
      return fileProvider;
    }

    switch (fileProvider.type) {
      case 'remote':
        return new RemoteFileSystemProvider(fileProvider);
      case 'custom':
        return new CustomFileSystemProvider(fileProvider);
      default:
        break;
    }

    return new ObjectFileSystemProvider(fileProvider);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  setCurrentPath(path?: string) {
    const pathParts = getPathParts(path);
    const rawPath = pathCombine(...pathParts);
    if (this.getCurrentDirectory().fileItem.relativeName === rawPath) {
      // @ts-expect-error ts-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return new Deferred().resolve().promise();
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._setCurrentDirectoryByPathParts(pathParts);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  setCurrentPathByKeys(pathKeys?: string[]) {
    if (equalByValue(this.getCurrentDirectory().fileItem.pathKeys, pathKeys)) {
      // @ts-expect-error ts-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return new Deferred().resolve().promise();
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._setCurrentDirectoryByPathParts(pathKeys, true);
  }

  getCurrentPath(): string {
    let currentPath = '';
    let directory = this.getCurrentDirectory();
    while (directory && !directory.fileItem.isRoot()) {
      const escapedName = getEscapedFileName(directory.fileItem.name);
      currentPath = pathCombine(escapedName, currentPath);
      directory = directory.parentDirectory;
    }
    return currentPath;
  }

  getCurrentPathKeys(): string[] {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.getCurrentDirectory().fileItem.pathKeys;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getCurrentDirectory() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._currentDirectoryInfo;
  }

  setCurrentDirectory(directoryInfo, checkActuality?): void {
    if (!directoryInfo) {
      return;
    }

    if (checkActuality) {
      // eslint-disable-next-line no-param-reassign
      directoryInfo = this._getActualDirectoryInfo(directoryInfo);
    }

    if (
      this._currentDirectoryInfo
      && this._currentDirectoryInfo === directoryInfo
    ) {
      this._raisePathPotentiallyChanged();
      return;
    }

    const requireRaiseSelectedDirectory = this._currentDirectoryInfo.fileItem.key
      !== directoryInfo.fileItem.key;
    this._currentDirectoryInfo = directoryInfo;

    if (requireRaiseSelectedDirectory && this._isInitialized) {
      if (!this._dataLoading) {
        this._raiseDataLoading(OPERATIONS.NAVIGATION);
      }
      this._raiseSelectedDirectoryChanged(directoryInfo);
    }
  }

  _resetCurrentDirectory(): void {
    this._currentDirectoryInfo = this._rootDirectoryInfo;
  }

  getCurrentItems(onlyFiles): DeferredObj<unknown> {
    return this._dataLoadingDeferred
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      ? this._dataLoadingDeferred.then(() => this._getCurrentItemsInternal(onlyFiles))
      : this._getCurrentItemsInternal(onlyFiles);
  }

  _getCurrentItemsInternal(onlyFiles): DeferredObj<unknown> {
    const currentDirectory = this.getCurrentDirectory();
    const getItemsPromise = this.getDirectoryContents(currentDirectory);
    return getItemsPromise.then((items) => {
      const separatedItems = this._separateItemsByType(items);
      currentDirectory.fileItem.hasSubDirectories = !!separatedItems.folders.length;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return onlyFiles ? separatedItems.files : items;
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getDirectories(parentDirectoryInfo, skipNavigationOnError?) {
    return this.getDirectoryContents(
      parentDirectoryInfo,
      skipNavigationOnError,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    ).then((itemInfos) => itemInfos.filter((info) => info.fileItem.isDirectory));
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _separateItemsByType(itemInfos) {
    const folders = [];
    const files = [];
    itemInfos.forEach((info) => (info.fileItem.isDirectory
      // @ts-expect-error ts-error
      ? folders.push(info)
      // @ts-expect-error ts-error
      : files.push(info)));
    return { folders, files };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getDirectoryContents(parentDirectoryInfo, skipNavigationOnError?): DeferredObj<any> {
    if (!parentDirectoryInfo) {
      // @ts-expect-error ts-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return new Deferred().resolve([this._rootDirectoryInfo]).promise();
    }

    if (parentDirectoryInfo.itemsLoaded) {
      // @ts-expect-error ts-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return new Deferred().resolve(parentDirectoryInfo.items).promise();
    }
    if (
      this._singleOperationLockId
      && parentDirectoryInfo.itemsSingleLoadErrorId === this._singleOperationLockId
    ) {
      this._changeDirectoryOnError(
        parentDirectoryInfo,
        skipNavigationOnError,
        true,
      );
      // @ts-expect-error ts-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return new Deferred().reject().promise();
    }

    const dirKey = parentDirectoryInfo.getInternalKey();
    let loadItemsDeferred = this._loadedItems[dirKey];

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    if (loadItemsDeferred) {
      return loadItemsDeferred;
    }

    loadItemsDeferred = this._getFileItems(
      parentDirectoryInfo,
      skipNavigationOnError,
    ).then(
      (fileItems) => {
        // eslint-disable-next-line no-param-reassign
        fileItems = fileItems || [];
        parentDirectoryInfo.items = fileItems.map(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          (fileItem) => (fileItem.isDirectory
            && this._createDirectoryInfo(fileItem, parentDirectoryInfo))
            || this._createFileInfo(fileItem, parentDirectoryInfo),
        );
        parentDirectoryInfo.itemsLoaded = true;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return parentDirectoryInfo.items;
      },
      () => {
        if (
          this._singleOperationLockId
          && parentDirectoryInfo.itemsSingleLoadErrorId !== this._singleOperationLockId
        ) {
          parentDirectoryInfo.itemsSingleLoadErrorId = this._singleOperationLockId;
        }
        return [];
      },
    );

    this._loadedItems[dirKey] = loadItemsDeferred;
    loadItemsDeferred.always((): void => {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete this._loadedItems[dirKey];
    });

    return loadItemsDeferred;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _getFileItems(parentDirectoryInfo, skipNavigationOnError): DeferredObj<any> {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let loadItemsDeferred;
    try {
      loadItemsDeferred = this._fileProvider?.getItems(
        parentDirectoryInfo.fileItem,
      );
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this._handleItemLoadError(
        parentDirectoryInfo,
        error as ErrorInfo,
        skipNavigationOnError,
      );
    }
    return when(loadItemsDeferred).then(
      (fileItems) => this._securityController?.getAllowedItems(fileItems),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      (errorInfo) => this._handleItemLoadError(
        parentDirectoryInfo,
        errorInfo,
        skipNavigationOnError,
      ),
    );
  }

  createDirectory(parentDirectoryInfo, name): DeferredObj<unknown> {
    const parentDirItem = parentDirectoryInfo.fileItem;
    const tempDirInfo = this._createDirInfoByName(name, parentDirectoryInfo);
    const actionInfo = this._createEditActionInfo(
      'create',
      tempDirInfo,
      parentDirectoryInfo,
    );
    return this._processEditAction(
      actionInfo,
      (args): void => {
        args.parentDirectory = parentDirItem;
        args.name = name;
        this._editingEvents?.onDirectoryCreating?.(args);
      },
      // @ts-expect-error ts-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      () => this._fileProvider?.createDirectory(parentDirItem, name).done((info) => {
        if (!parentDirItem.isRoot()) {
          parentDirItem.hasSubDirectories = true;
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return info;
      }),
      (): void => {
        const args = {
          parentDirectory: parentDirItem,
          name,
        };
        this._editingEvents?.onDirectoryCreated?.(args);
      },
      (): void => this._resetDirectoryState(parentDirectoryInfo, true),
    );
  }

  renameItem(fileItemInfo, name): DeferredObj<unknown> {
    const sourceItem = fileItemInfo.fileItem.createClone();
    const actionInfo = this._createEditActionInfo(
      'rename',
      fileItemInfo,
      fileItemInfo.parentDirectory,
      { itemNewName: name },
    );
    return this._processEditAction(
      actionInfo,
      (args, itemInfo): void => {
        if (!itemInfo.fileItem.isDirectory) {
          this._securityController?.validateExtension(name);
        }
        args.item = sourceItem;
        args.newName = name;
        this._editingEvents?.onItemRenaming?.(args);
      },
      (item) => this._fileProvider?.renameItem(item, name),
      (): void => {
        const args = {
          sourceItem,
          itemName: name,
        };
        this._editingEvents?.onItemRenamed?.(args);
      },
      (): void => {
        const parentDirectory = this._getActualDirectoryInfo(
          fileItemInfo.parentDirectory,
        );
        this._resetDirectoryState(parentDirectory);
        this.setCurrentDirectory(parentDirectory);
      },
    );
  }

  moveItems(itemInfos, destinationDirectory): DeferredObj<unknown> {
    const actionInfo = this._createEditActionInfo(
      'move',
      itemInfos,
      destinationDirectory,
    );
    return this._processEditAction(
      actionInfo,
      (args, itemInfo): void => {
        args.item = itemInfo.fileItem;
        args.destinationDirectory = destinationDirectory.fileItem;
        this._editingEvents?.onItemMoving?.(args);
      },
      (item) => this._fileProvider?.moveItems([item], destinationDirectory.fileItem),
      (itemInfo): void => {
        const args = {
          sourceItem: itemInfo.fileItem,
          parentDirectory: destinationDirectory.fileItem,
          itemName: itemInfo.fileItem.name,
          itemPath: pathCombine(
            destinationDirectory.fileItem.path,
            itemInfo.fileItem.name,
          ),
        };
        this._editingEvents?.onItemMoved?.(args);
      },
      (needChangeCurrentDirectory): void => {
        itemInfos.forEach((itemInfo): void => this._resetDirectoryState(
          itemInfo.parentDirectory,
          true,
        ));
        if (needChangeCurrentDirectory) {
          this._resetDirectoryState(destinationDirectory);
          this.setCurrentPathByKeys(destinationDirectory.fileItem.pathKeys);
          destinationDirectory.expanded = true;
        }
      },
    );
  }

  copyItems(itemInfos, destinationDirectory): DeferredObj<unknown> {
    const actionInfo = this._createEditActionInfo(
      'copy',
      itemInfos,
      destinationDirectory,
    );
    return this._processEditAction(
      actionInfo,
      (args, itemInfo): void => {
        args.item = itemInfo.fileItem;
        args.destinationDirectory = destinationDirectory.fileItem;
        this._editingEvents?.onItemCopying?.(args);
      },
      (item) => this._fileProvider?.copyItems([item], destinationDirectory.fileItem),
      (itemInfo): void => {
        const args = {
          sourceItem: itemInfo.fileItem,
          parentDirectory: destinationDirectory.fileItem,
          itemName: itemInfo.fileItem.name,
          itemPath: pathCombine(
            destinationDirectory.fileItem.path,
            itemInfo.fileItem.name,
          ),
        };
        this._editingEvents?.onItemCopied?.(args);
      },
      (needChangeCurrentDirectory): void => {
        if (needChangeCurrentDirectory) {
          // eslint-disable-next-line no-param-reassign
          destinationDirectory = this._getActualDirectoryInfo(destinationDirectory);
          this._resetDirectoryState(destinationDirectory);
          this.setCurrentDirectory(destinationDirectory);
          destinationDirectory.expanded = true;
        }
      },
    );
  }

  deleteItems(itemInfos): DeferredObj<unknown> {
    const directory = itemInfos.length > 0 ? itemInfos[0].parentDirectory : null;
    const actionInfo = this._createEditActionInfo(
      'delete',
      itemInfos,
      directory,
    );
    return this._processEditAction(
      actionInfo,
      (args, itemInfo) => {
        args.item = itemInfo.fileItem;
        this._editingEvents?.onItemDeleting?.(args);
      },
      (item) => this._fileProvider?.deleteItems([item]),
      (itemInfo) => this._editingEvents?.onItemDeleted?.({ item: itemInfo.fileItem }),
      () => {
        itemInfos.forEach((itemInfo): void => {
          const parentDir = this._getActualDirectoryInfo(
            itemInfo.parentDirectory,
          );
          this._resetDirectoryState(parentDir);
          this.setCurrentDirectory(parentDir);
        });
      },
    );
  }

  processUploadSession(sessionInfo, uploadDirectoryInfo): DeferredObj<unknown> {
    const itemInfos = this._getItemInfosForUploaderFiles(
      sessionInfo.files,
      uploadDirectoryInfo,
    );
    const actionInfo = this._createEditActionInfo(
      'upload',
      itemInfos,
      uploadDirectoryInfo,
      { sessionInfo },
    );
    return this._processEditAction(
      actionInfo,
      (): void => {},
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      (_, index) => sessionInfo.deferreds[index],
      (): void => {},
      (): void => this._resetDirectoryState(uploadDirectoryInfo, true),
    );
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  uploadFileChunk(fileData, chunksInfo, destinationDirectory) {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let startDeferred;

    if (chunksInfo.chunkIndex === 0) {
      this._securityController?.validateMaxFileSize(fileData.size);
      this._securityController?.validateExtension(fileData.name);

      startDeferred = this._processBeforeItemEditAction((args): void => {
        args.fileData = fileData;
        args.destinationDirectory = destinationDirectory;
        this._editingEvents?.onFileUploading?.(args);
      });
    } else {
      // @ts-expect-error ts-error
      startDeferred = new Deferred().resolve().promise();
    }

    let result = startDeferred?.then(() => this._fileProvider?.uploadFileChunk(
      fileData,
      chunksInfo,
      destinationDirectory,
    ));

    if (chunksInfo.chunkIndex === chunksInfo.chunkCount - 1) {
      result = result.done((): void => {
        const args = {
          fileData,
          parentDirectory: destinationDirectory,
        };
        this._editingEvents?.onFileUploaded?.(args);
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  abortFileUpload(fileData, chunksInfo, destinationDirectory) {
    return when(
      this._fileProvider?.abortFileUpload(
        fileData,
        chunksInfo,
        destinationDirectory,
      ),
    );
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getFileUploadChunkSize() {
    const chunkSize = this._options.uploadChunkSize;
    if (chunkSize && chunkSize > 0) {
      return chunkSize;
    }
    return this._fileProvider?.getFileUploadChunkSize();
  }

  downloadItems(itemInfos): DeferredObj<unknown> {
    const deferreds = itemInfos.map((itemInfo) => this._processBeforeItemEditAction((
      args,
    ): void => {
      args.item = itemInfo.fileItem;
      this._editingEvents?.onItemDownloading?.(args);
    }, itemInfo));

    return when(...deferreds).then(
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      (): DeferredObj<unknown> => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        const items = itemInfos.map((i) => i.fileItem);
        return when(
          this._getItemActionResult(this._fileProvider?.downloadItems(items)),
        ).then(
          (): void => {},
          (errorInfo): void => {
            this._raiseDownloadItemsError(
              itemInfos,
              itemInfos[0].parentDirectory,
              errorInfo,
            );
          },
        );
      },
      (errorInfo: ErrorInfo): void => {
        this._raiseDownloadItemsError(
          itemInfos,
          itemInfos[0].parentDirectory,
          errorInfo,
        );
      },
    );
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getItemContent(itemInfos) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const items = itemInfos.map((i) => i.fileItem);
    return when(this._fileProvider?.getItemsContent(items));
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _handleItemLoadError(parentDirectoryInfo, errorInfo: ErrorInfo, skipNavigationOnError) {
    // eslint-disable-next-line no-param-reassign
    parentDirectoryInfo = this._getActualDirectoryInfo(parentDirectoryInfo);
    this._raiseGetItemsError(parentDirectoryInfo, errorInfo);
    this._changeDirectoryOnError(parentDirectoryInfo, skipNavigationOnError);
    // @ts-expect-error ts-error
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return new Deferred().reject().promise();
  }

  _raiseGetItemsError(parentDirectoryInfo, errorInfo: ErrorInfo): void {
    const actionInfo = this._createEditActionInfo(
      'getItems',
      parentDirectoryInfo,
      parentDirectoryInfo,
    );
    this._raiseEditActionStarting(actionInfo);
    this._raiseEditActionResultAcquired(actionInfo);
    this._raiseEditActionError(actionInfo, {
      errorCode: errorInfo.errorCode,
      errorText: errorInfo.errorText,
      fileItem: parentDirectoryInfo.fileItem,
      index: 0,
    });
  }

  _raiseDownloadItemsError(targetFileInfos, directory, errorInfo: ErrorInfo): void {
    const actionInfo = this._createEditActionInfo(
      'download',
      targetFileInfos,
      directory,
    );
    const itemsLength = targetFileInfos.length;
    actionInfo.singleRequest = itemsLength === 1;
    this._raiseEditActionStarting(actionInfo);
    this._raiseEditActionResultAcquired(actionInfo);
    for (let index = 0; index < itemsLength - 1; index += 1) {
      this._raiseEditActionItemError(actionInfo, {
        errorCode: errorInfo.errorCode,
        errorText: errorInfo.errorText,
        fileItem: targetFileInfos[index].fileItem,
        index,
      });
    }
    this._raiseEditActionError(actionInfo, {
      errorCode: errorInfo.errorCode,
      errorText: errorInfo.errorText,
      fileItem: targetFileInfos[itemsLength - 1].fileItem,
      index: itemsLength - 1,
    });
  }

  _changeDirectoryOnError(
    dirInfo,
    skipNavigationOnError?,
    isActualDirectoryRequired?,
  ): void {
    if (isActualDirectoryRequired) {
      // eslint-disable-next-line no-param-reassign
      dirInfo = this._getActualDirectoryInfo(dirInfo);
    }
    this._resetDirectoryState(dirInfo);
    dirInfo.expanded = false;
    if (!skipNavigationOnError) {
      this.setCurrentDirectory(dirInfo.parentDirectory);
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getItemActionResult(actionResult) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return Array.isArray(actionResult) ? actionResult[0] : actionResult;
  }

  _processEditAction(
    actionInfo,
    beforeAction,
    action,
    afterAction,
    completeAction,
  ): DeferredObj<unknown> {
    let isAnyOperationSuccessful = false;
    this._raiseEditActionStarting(actionInfo);

    const actionResult = actionInfo.itemInfos.map((
      itemInfo,
      itemIndex,
    ) => this._processBeforeItemEditAction(beforeAction, itemInfo).then(
      () => {
        const itemActionResult = this._getItemActionResult(
          action(itemInfo.fileItem, itemIndex),
        );
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return itemActionResult.done(() => afterAction(itemInfo));
      },
    ));

    actionInfo.singleRequest = actionResult.length === 1;

    this._raiseEditActionResultAcquired(actionInfo);

    return whenSome(
      actionResult,
      (info): void => {
        isAnyOperationSuccessful = true;
        this._raiseCompleteEditActionItem(actionInfo, info);
      },
      (errorInfo): void => this._raiseEditActionItemError(actionInfo, errorInfo),
    ).then(() => {
      completeAction(isAnyOperationSuccessful);
      this._raiseCompleteEditAction(actionInfo);
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _createEditActionInfo(name: string, targetItemInfos, directory, customData?) {
    // eslint-disable-next-line no-param-reassign
    targetItemInfos = Array.isArray(targetItemInfos)
      ? targetItemInfos
      : [targetItemInfos];
    // eslint-disable-next-line no-param-reassign
    customData = customData || {};

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const items = targetItemInfos.map((itemInfo) => itemInfo.fileItem);
    return {
      name,
      itemInfos: targetItemInfos,
      items,
      directory,
      customData,
      singleRequest: true,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _processBeforeItemEditAction(action, itemInfo?): DeferredObj<any> {
    // @ts-expect-error ts-error
    const deferred = new Deferred();
    const args = this._createBeforeActionArgs();

    try {
      action(args, itemInfo);
    } catch (errorInfo) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return deferred.reject(errorInfo).promise();
    }

    if (!args.cancel) {
      deferred.resolve();
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-boolean-literal-compare
    } else if (args.cancel === true) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return deferred.reject({
        errorText: args.errorText,
        errorCode: args.errorCode,
      });
    } else if (isPromise(args.cancel)) {
      when(args.cancel).then((res): void => {
        if (res === true) {
          deferred.reject();
          // @ts-expect-error ts-error
        } else if (isObject(res) && res.cancel === true) {
          deferred.reject({
            // @ts-expect-error ts-error
            errorText: res.errorText,
            // @ts-expect-error ts-error
            errorCode: res.errorCode,
          });
        }
        deferred.resolve();
      }, deferred.resolve);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return deferred.promise();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _createBeforeActionArgs() {
    return {
      errorCode: undefined,
      errorText: '',
      cancel: false,
    };
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getItemInfosForUploaderFiles(files, parentDirectoryInfo) {
    const pathInfo = this._getPathInfo(parentDirectoryInfo);
    const result = [];
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < files.length; i += 1) {
      const file = files[i];
      const item = new FileSystemItem(pathInfo, file.name, false);
      const itemInfo = this._createFileInfo(item, parentDirectoryInfo);
      // @ts-expect-error ts-error
      result.push(itemInfo);
    }
    return result;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  refresh() {
    if (this._lockRefresh) {
      return this._refreshDeferred;
    }

    this._lockRefresh = true;

    // eslint-disable-next-line @stylistic/max-len
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,no-return-assign,@stylistic/max-len
    return this._executeDataLoad(() => (this._refreshDeferred = this._refreshInternal()), OPERATIONS.REFRESH);
  }

  startSingleLoad(): void {
    this._singleOperationLockId = new Guid().toString();
  }

  endSingleLoad(): void {
    delete this._singleOperationLockId;
  }

  _refreshInternal(): DeferredObj<void> {
    const cachedRootInfo = {
      items: this._rootDirectoryInfo.items,
    };
    const selectedKeyParts = this._getDirectoryPathKeyParts(
      this.getCurrentDirectory(),
    );

    this._resetDirectoryState(this._rootDirectoryInfo);

    return this._loadItemsRecursive(
      this._rootDirectoryInfo,
      cachedRootInfo,
    ).then((): void => {
      const dirInfo = this._findDirectoryByPathKeyParts(selectedKeyParts);
      this.setCurrentDirectory(dirInfo);

      delete this._lockRefresh;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _loadItemsRecursive(directoryInfo, cachedDirectoryInfo): DeferredObj<any> {
    return this.getDirectories(directoryInfo).then(
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      (dirInfos): DeferredObj<unknown> => {
        const itemDeferreds = [];
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < dirInfos.length; i += 1) {
          const cachedItem = cachedDirectoryInfo.items.find(
            (cache): boolean => dirInfos[i].fileItem.key === cache.fileItem.key,
          );
          // eslint-disable-next-line no-continue
          if (!cachedItem) continue;

          dirInfos[i].expanded = cachedItem.expanded;
          if (dirInfos[i].expanded) {
            itemDeferreds.push(
              // @ts-expect-error ts-error
              this._loadItemsRecursive(dirInfos[i], cachedItem),
            );
          }
        }
        return whenSome(itemDeferreds);
      },
      (): null => null,
    );
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _setCurrentDirectoryByPathParts(pathParts, useKeys?) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._executeDataLoad(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      () => this._setCurrentDirectoryByPathPartsInternal(pathParts, useKeys),
      OPERATIONS.NAVIGATION,
    );
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _setCurrentDirectoryByPathPartsInternal(pathParts, useKeys?) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._getDirectoryByPathParts(
      this._rootDirectoryInfo,
      pathParts,
      useKeys,
    ).then(
      (directoryInfo): void => {
        for (
          let info = directoryInfo.parentDirectory;
          info;
          info = info.parentDirectory
        ) {
          info.expanded = true;
        }
        this.setCurrentDirectory(directoryInfo);
      },
      (): void => {
        this._raisePathPotentiallyChanged();
      },
    );
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _executeDataLoad(action, operation) {
    if (this._dataLoadingDeferred) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this._dataLoadingDeferred.then(() => this._executeDataLoad(action, operation));
    }
    this._dataLoading = true;
    // @ts-expect-error ts-error
    this._dataLoadingDeferred = new Deferred();

    if (this._isInitialized) {
      this._raiseDataLoading(operation);
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return action().always((): void => {
      const tempDeferred = this._dataLoadingDeferred;
      this._dataLoadingDeferred = null;
      this._dataLoading = false;
      tempDeferred?.resolve();
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getDirectoryByPathParts(parentDirectoryInfo, pathParts, useKeys?) {
    if (pathParts.length < 1) {
      // @ts-expect-error ts-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return new Deferred().resolve(parentDirectoryInfo).promise();
    }

    const fieldName = useKeys ? 'key' : 'name';
    return this.getDirectories(parentDirectoryInfo).then((dirInfos) => {
      const subDirInfo = dirInfos.find(
        (d): boolean => d.fileItem[fieldName] === pathParts[0],
      );
      if (!subDirInfo) {
        // @ts-expect-error ts-error
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return new Deferred().reject().promise();
      }
      const restPathParts = [...pathParts].splice(1);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this._getDirectoryByPathParts(subDirInfo, restPathParts, useKeys);
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getDirectoryPathKeyParts(directoryInfo) {
    const pathParts = [];
    while (directoryInfo?.parentDirectory) {
      // @ts-expect-error ts-error
      pathParts.unshift(directoryInfo.fileItem.key);
      // eslint-disable-next-line no-param-reassign
      directoryInfo = directoryInfo.parentDirectory;
    }
    return pathParts;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _findDirectoryByPathKeyParts(keyParts) {
    let selectedDirInfo = this._rootDirectoryInfo;
    if (keyParts.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return selectedDirInfo;
    }

    let i = 0;
    let newSelectedDir = selectedDirInfo;
    while (newSelectedDir && i < keyParts.length) {
      newSelectedDir = selectedDirInfo.items.find(
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        (info): boolean => info.fileItem.key === keyParts[i],
      );
      if (newSelectedDir) {
        selectedDirInfo = newSelectedDir;
      }
      i += 1;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return selectedDirInfo;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getActualDirectoryInfo(directoryInfo) {
    const keys = this._getDirectoryPathKeyParts(directoryInfo);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._findDirectoryByPathKeyParts(keys);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _createDirInfoByName(name, parentDirectoryInfo) {
    const dirPathInfo = this._getPathInfo(parentDirectoryInfo);
    const fileItem = new FileSystemItem(dirPathInfo, name, true);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._createDirectoryInfo(fileItem, parentDirectoryInfo);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _createDirectoryInfo(fileItem, parentDirectoryInfo) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return extend(this._createFileInfo(fileItem, parentDirectoryInfo), {
      icon: 'folder',
      expanded: fileItem.isRoot(),
      items: [],
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _createFileInfo(fileItem, parentDirectoryInfo) {
    return {
      fileItem,
      parentDirectory: parentDirectoryInfo,
      icon: this._getFileItemDefaultIcon(fileItem),
      getInternalKey(): string {
        return `FIK_${this.fileItem.key}`;
      },
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      getDisplayName() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return this.displayName || this.fileItem.name;
      },
    };
  }

  _resetDirectoryState(directoryInfo, isActualDirectoryRequired?): void {
    if (isActualDirectoryRequired) {
      // eslint-disable-next-line no-param-reassign
      directoryInfo = this._getActualDirectoryInfo(directoryInfo);
    }
    directoryInfo.itemsLoaded = false;
    directoryInfo.items = [];
  }

  _getFileItemDefaultIcon(fileItem): string {
    if (fileItem.isDirectory) {
      return 'folder';
    }

    const extension = fileItem.getFileExtension();
    const icon = this._defaultIconMap[extension];
    return icon || 'doc';
  }

  _createDefaultIconMap(): Record<string, string> {
    const result = {
      '.txt': 'txtfile',
      '.rtf': 'rtffile',
      '.doc': 'docfile',
      '.docx': 'docxfile',
      '.xls': 'xlsfile',
      '.xlsx': 'xlsxfile',
      '.ppt': 'pptfile',
      '.pptx': 'pptxfile',
      '.pdf': 'pdffile',
    };

    ['.png', '.gif', '.jpg', '.jpeg', '.ico', '.bmp'].forEach((extension: string): void => {
      result[extension] = 'image';
    });

    return result;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _createRootDirectoryInfo(text) {
    const rootDirectory = new FileSystemItem(null, '', true);

    const result = this._createDirectoryInfo(rootDirectory, null);
    result.displayName = text || DEFAULT_ROOT_FILE_SYSTEM_ITEM_NAME;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result;
  }

  setRootText(rootText): void {
    this._rootDirectoryInfo.displayName = rootText || DEFAULT_ROOT_FILE_SYSTEM_ITEM_NAME;
  }

  _raiseInitialized(): void {
    this._tryCallAction('onInitialized', { controller: this });
  }

  _raiseDataLoading(operation): void {
    this._tryCallAction('onDataLoading', { operation });
  }

  _raiseSelectedDirectoryChanged(directoryInfo): void {
    this._tryCallAction('onSelectedDirectoryChanged', {
      selectedDirectoryInfo: directoryInfo,
    });
  }

  _raiseEditActionStarting(actionInfo): void {
    this._tryCallAction('onEditActionStarting', actionInfo);
  }

  _raiseEditActionResultAcquired(actionInfo): void {
    this._tryCallAction('onEditActionResultAcquired', actionInfo);
  }

  _raiseEditActionError(actionInfo, errorInfo): void {
    this._tryCallAction('onEditActionError', actionInfo, errorInfo);
  }

  _raiseEditActionItemError(actionInfo, errorInfo): void {
    this._tryCallAction('onEditActionItemError', actionInfo, errorInfo);
  }

  _raiseCompleteEditActionItem(actionInfo, info): void {
    this._tryCallAction('onCompleteEditActionItem', actionInfo, info);
  }

  _raiseCompleteEditAction(actionInfo): void {
    this._tryCallAction('onCompleteEditAction', actionInfo);
  }

  _raisePathPotentiallyChanged(): void {
    this._tryCallAction('onPathPotentiallyChanged');
  }

  _tryCallAction(actionName: string, ...rest): void {
    if (this._isInitialized && this._options[actionName]) {
      this._options[actionName](...rest);
    }
  }

  _resetState(): void {
    this._selectedDirectory = null;
    this._rootDirectoryInfo.items = [];
    this._rootDirectoryInfo.itemsLoaded = false;
    this._loadedItems = {};
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getPathInfo(directoryInfo) {
    const pathInfo = [];
    for (
      let dirInfo = directoryInfo;
      dirInfo && !dirInfo.fileItem.isRoot();
      dirInfo = dirInfo.parentDirectory
    ) {
      // @ts-expect-error ts-error
      pathInfo.unshift({
        key: dirInfo.fileItem.key,
        name: dirInfo.fileItem.name,
      });
    }
    return pathInfo;
  }

  on(eventName: string, eventHandler): void {
    const finalEventName = `on${eventName}`;
    this._options[finalEventName] = eventHandler;
  }

  get _editingEvents(): FileManagerActions['editing'] | undefined {
    return this._options.editingEvents;
  }
}
