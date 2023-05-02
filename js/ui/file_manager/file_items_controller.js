import FileSystemProviderBase from '../../file_management/provider_base';
import FileSystemItem from '../../file_management/file_system_item';
import ObjectFileSystemProvider from '../../file_management/object_provider';
import RemoteFileSystemProvider from '../../file_management/remote_provider';
import CustomFileSystemProvider from '../../file_management/custom_provider';
import FileSystemError from '../../file_management/error';
import ErrorCode from '../../file_management/error_codes';
import { pathCombine, getEscapedFileName, getPathParts, getFileExtension } from '../../file_management/utils';
import { whenSome } from './ui.file_manager.common';

import { Deferred, when } from '../../core/utils/deferred';
import { extend } from '../../core/utils/extend';
import { equalByValue } from '../../core/utils/common';
import { isDefined, isObject, isPromise } from '../../core/utils/type';
import Guid from '../../core/guid';

const DEFAULT_ROOT_FILE_SYSTEM_ITEM_NAME = 'Files';

export const OPERATIONS = {
    NAVIGATION: 'navigation',
    REFRESH: 'refresh'
};

export class FileItemsController {

    constructor(options) {
        options = options || {};
        this._options = extend({ }, options);

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

    _initialize() {
        const result = this._options.currentPathKeys && this._options.currentPathKeys.length
            ? this.setCurrentPathByKeys(this._options.currentPathKeys)
            : this.setCurrentPath(this._options.currentPath);

        const completeInitialization = () => {
            this._isInitialized = true;
            this._raiseInitialized();
        };

        if(result) {
            when(result).always(completeInitialization);
        } else {
            completeInitialization();
        }
    }

    _setSecurityController() {
        this._securityController = new FileSecurityController({
            allowedFileExtensions: this._options.allowedFileExtensions,
            maxFileSize: this._options.uploadMaxFileSize
        });
        this._resetState();
    }

    setAllowedFileExtensions(allowedFileExtensions) {
        if(isDefined(allowedFileExtensions)) {
            this._options.allowedFileExtensions = allowedFileExtensions;
        }
        this._setSecurityController();
        this.refresh();
    }

    setUploadOptions({ maxFileSize, chunkSize }) {
        if(isDefined(chunkSize)) {
            this._options.uploadChunkSize = chunkSize;
        }
        if(isDefined(maxFileSize)) {
            this._options.uploadMaxFileSize = maxFileSize;
            this._setSecurityController();
            this.refresh();
        }
    }

    _setProvider(fileProvider) {
        this._fileProvider = this._createFileProvider(fileProvider);
        this._resetState();
    }

    updateProvider(fileProvider, currentPathKeys) {
        if(!isDefined(currentPathKeys)) {
            return this._updateProviderOnly(fileProvider);
        }

        return when(this._getDirectoryByPathParts(this._rootDirectoryInfo, currentPathKeys, true))
            .then(newDirectory => {
                if(newDirectory !== this._rootDirectoryInfo) {
                    this._resetCurrentDirectory();
                }
                this._setProvider(fileProvider);
            })
            .then(() => this.setCurrentPathByKeys(currentPathKeys));
    }

    _updateProviderOnly(fileProvider) {
        this._resetCurrentDirectory();
        this._setProvider(fileProvider);
        return when(this.refresh());
    }

    _createFileProvider(fileProvider) {
        if(!fileProvider) {
            fileProvider = [];
        }

        if(Array.isArray(fileProvider)) {
            return new ObjectFileSystemProvider({ data: fileProvider });
        }

        if(fileProvider instanceof FileSystemProviderBase) {
            return fileProvider;
        }

        switch(fileProvider.type) {
            case 'remote':
                return new RemoteFileSystemProvider(fileProvider);
            case 'custom':
                return new CustomFileSystemProvider(fileProvider);
        }

        return new ObjectFileSystemProvider(fileProvider);
    }

    setCurrentPath(path) {
        const pathParts = getPathParts(path);
        const rawPath = pathCombine(...pathParts);
        if(this.getCurrentDirectory().fileItem.relativeName === rawPath) {
            return new Deferred().resolve().promise();
        }

        return this._setCurrentDirectoryByPathParts(pathParts);
    }

    setCurrentPathByKeys(pathKeys) {
        if(equalByValue(this.getCurrentDirectory().fileItem.pathKeys, pathKeys)) {
            return new Deferred().resolve().promise();
        }

        return this._setCurrentDirectoryByPathParts(pathKeys, true);
    }

    getCurrentPath() {
        let currentPath = '';
        let directory = this.getCurrentDirectory();
        while(directory && !directory.fileItem.isRoot()) {
            const escapedName = getEscapedFileName(directory.fileItem.name);
            currentPath = pathCombine(escapedName, currentPath);
            directory = directory.parentDirectory;
        }
        return currentPath;
    }

    getCurrentPathKeys() {
        return this.getCurrentDirectory().fileItem.pathKeys;
    }

    getCurrentDirectory() {
        return this._currentDirectoryInfo;
    }

    setCurrentDirectory(directoryInfo, checkActuality) {
        if(!directoryInfo) {
            return;
        }

        if(checkActuality) {
            directoryInfo = this._getActualDirectoryInfo(directoryInfo);
        }

        if(this._currentDirectoryInfo && this._currentDirectoryInfo === directoryInfo) {
            this._raisePathPotentiallyChanged();
            return;
        }

        const requireRaiseSelectedDirectory = this._currentDirectoryInfo.fileItem.key !== directoryInfo.fileItem.key;
        this._currentDirectoryInfo = directoryInfo;

        if(requireRaiseSelectedDirectory && this._isInitialized) {
            if(!this._dataLoading) {
                this._raiseDataLoading(OPERATIONS.NAVIGATION);
            }
            this._raiseSelectedDirectoryChanged(directoryInfo);
        }
    }

    _resetCurrentDirectory() {
        this._currentDirectoryInfo = this._rootDirectoryInfo;
    }

    getCurrentItems(onlyFiles) {
        return this._dataLoadingDeferred
            ? this._dataLoadingDeferred.then(() => this._getCurrentItemsInternal(onlyFiles))
            : this._getCurrentItemsInternal(onlyFiles);
    }

    _getCurrentItemsInternal(onlyFiles) {
        const currentDirectory = this.getCurrentDirectory();
        const getItemsPromise = this.getDirectoryContents(currentDirectory);
        return getItemsPromise.then(items => {
            const separatedItems = this._separateItemsByType(items);
            currentDirectory.fileItem.hasSubDirectories = !!separatedItems.folders.length;
            return onlyFiles ? separatedItems.files : items;
        });
    }

    getDirectories(parentDirectoryInfo, skipNavigationOnError) {
        return this.getDirectoryContents(parentDirectoryInfo, skipNavigationOnError)
            .then(itemInfos => itemInfos.filter(info => info.fileItem.isDirectory));
    }

    _separateItemsByType(itemInfos) {
        const folders = [];
        const files = [];
        itemInfos.forEach(info => info.fileItem.isDirectory ? folders.push(info) : files.push(info));
        return { folders, files };
    }

    getDirectoryContents(parentDirectoryInfo, skipNavigationOnError) {
        if(!parentDirectoryInfo) {
            return new Deferred()
                .resolve([ this._rootDirectoryInfo ])
                .promise();
        }

        if(parentDirectoryInfo.itemsLoaded) {
            return new Deferred()
                .resolve(parentDirectoryInfo.items)
                .promise();
        }
        if(this._singleOperationLockId && parentDirectoryInfo.itemsSingleLoadErrorId === this._singleOperationLockId) {
            this._changeDirectoryOnError(parentDirectoryInfo, skipNavigationOnError, true);
            return new Deferred().reject().promise();
        }

        const dirKey = parentDirectoryInfo.getInternalKey();
        let loadItemsDeferred = this._loadedItems[dirKey];

        if(loadItemsDeferred) {
            return loadItemsDeferred;
        }

        loadItemsDeferred = this._getFileItems(parentDirectoryInfo, skipNavigationOnError)
            .then(fileItems => {
                fileItems = fileItems || [];
                parentDirectoryInfo.items = fileItems.map(fileItem =>
                    fileItem.isDirectory && this._createDirectoryInfo(fileItem, parentDirectoryInfo) || this._createFileInfo(fileItem, parentDirectoryInfo)
                );
                parentDirectoryInfo.itemsLoaded = true;
                return parentDirectoryInfo.items;
            }, () => {
                if(this._singleOperationLockId && parentDirectoryInfo.itemsSingleLoadErrorId !== this._singleOperationLockId) {
                    parentDirectoryInfo.itemsSingleLoadErrorId = this._singleOperationLockId;
                }
                return [];
            });

        this._loadedItems[dirKey] = loadItemsDeferred;
        loadItemsDeferred.always(() => {
            delete this._loadedItems[dirKey];
        });

        return loadItemsDeferred;
    }

    _getFileItems(parentDirectoryInfo, skipNavigationOnError) {
        let loadItemsDeferred = null;
        try {
            loadItemsDeferred = this._fileProvider.getItems(parentDirectoryInfo.fileItem);
        } catch(error) {
            return this._handleItemLoadError(parentDirectoryInfo, error, skipNavigationOnError);
        }
        return when(loadItemsDeferred)
            .then(
                fileItems => this._securityController.getAllowedItems(fileItems),
                errorInfo => this._handleItemLoadError(parentDirectoryInfo, errorInfo, skipNavigationOnError));
    }

    createDirectory(parentDirectoryInfo, name) {
        const parentDirItem = parentDirectoryInfo.fileItem;
        const tempDirInfo = this._createDirInfoByName(name, parentDirectoryInfo);
        const actionInfo = this._createEditActionInfo('create', tempDirInfo, parentDirectoryInfo);
        return this._processEditAction(actionInfo,
            args => {
                args.parentDirectory = parentDirItem;
                args.name = name;
                this._editingEvents.onDirectoryCreating(args);
            },
            () => this._fileProvider.createDirectory(parentDirItem, name)
                .done(info => {
                    if(!parentDirItem.isRoot()) {
                        parentDirItem.hasSubDirectories = true;
                    }
                    return info;
                }),
            () => {
                const args = {
                    parentDirectory: parentDirItem,
                    name
                };
                this._editingEvents.onDirectoryCreated(args);
            },
            () => this._resetDirectoryState(parentDirectoryInfo, true));
    }

    renameItem(fileItemInfo, name) {
        const sourceItem = fileItemInfo.fileItem.createClone();
        const actionInfo = this._createEditActionInfo('rename', fileItemInfo, fileItemInfo.parentDirectory, { itemNewName: name });
        return this._processEditAction(actionInfo,
            (args, itemInfo) => {
                if(!itemInfo.fileItem.isDirectory) {
                    this._securityController.validateExtension(name);
                }
                args.item = sourceItem;
                args.newName = name;
                this._editingEvents.onItemRenaming(args);
            },
            item => this._fileProvider.renameItem(item, name),
            () => {
                const args = {
                    sourceItem,
                    itemName: name
                };
                this._editingEvents.onItemRenamed(args);
            },
            () => {
                const parentDirectory = this._getActualDirectoryInfo(fileItemInfo.parentDirectory);
                this._resetDirectoryState(parentDirectory);
                this.setCurrentDirectory(parentDirectory);
            });
    }

    moveItems(itemInfos, destinationDirectory) {
        const actionInfo = this._createEditActionInfo('move', itemInfos, destinationDirectory);
        return this._processEditAction(actionInfo,
            (args, itemInfo) => {
                args.item = itemInfo.fileItem;
                args.destinationDirectory = destinationDirectory.fileItem;
                this._editingEvents.onItemMoving(args);
            },
            item => this._fileProvider.moveItems([ item ], destinationDirectory.fileItem),
            itemInfo => {
                const args = {
                    sourceItem: itemInfo.fileItem,
                    parentDirectory: destinationDirectory.fileItem,
                    itemName: itemInfo.fileItem.name,
                    itemPath: pathCombine(destinationDirectory.fileItem.path, itemInfo.fileItem.name)
                };
                this._editingEvents.onItemMoved(args);
            },
            needChangeCurrentDirectory => {
                itemInfos.forEach(itemInfo => this._resetDirectoryState(itemInfo.parentDirectory, true));
                if(needChangeCurrentDirectory) {
                    this._resetDirectoryState(destinationDirectory);
                    this.setCurrentPathByKeys(destinationDirectory.fileItem.pathKeys);
                    destinationDirectory.expanded = true;
                }
            });
    }

    copyItems(itemInfos, destinationDirectory) {
        const actionInfo = this._createEditActionInfo('copy', itemInfos, destinationDirectory);
        return this._processEditAction(actionInfo,
            (args, itemInfo) => {
                args.item = itemInfo.fileItem;
                args.destinationDirectory = destinationDirectory.fileItem;
                this._editingEvents.onItemCopying(args);
            },
            item => this._fileProvider.copyItems([ item ], destinationDirectory.fileItem),
            itemInfo => {
                const args = {
                    sourceItem: itemInfo.fileItem,
                    parentDirectory: destinationDirectory.fileItem,
                    itemName: itemInfo.fileItem.name,
                    itemPath: pathCombine(destinationDirectory.fileItem.path, itemInfo.fileItem.name)
                };
                this._editingEvents.onItemCopied(args);
            },
            needChangeCurrentDirectory => {
                if(needChangeCurrentDirectory) {
                    destinationDirectory = this._getActualDirectoryInfo(destinationDirectory);
                    this._resetDirectoryState(destinationDirectory);
                    this.setCurrentDirectory(destinationDirectory);
                    destinationDirectory.expanded = true;
                }
            });
    }

    deleteItems(itemInfos) {
        const directory = itemInfos.length > 0 ? itemInfos[0].parentDirectory : null;
        const actionInfo = this._createEditActionInfo('delete', itemInfos, directory);
        return this._processEditAction(actionInfo,
            (args, itemInfo) => {
                args.item = itemInfo.fileItem;
                this._editingEvents.onItemDeleting(args);
            },
            item => this._fileProvider.deleteItems([ item ]),
            itemInfo => this._editingEvents.onItemDeleted({ item: itemInfo.fileItem }),
            () => {
                itemInfos.forEach(itemInfo => {
                    const parentDir = this._getActualDirectoryInfo(itemInfo.parentDirectory);
                    this._resetDirectoryState(parentDir);
                    this.setCurrentDirectory(parentDir);
                });
            });
    }

    processUploadSession(sessionInfo, uploadDirectoryInfo) {
        const itemInfos = this._getItemInfosForUploaderFiles(sessionInfo.files, uploadDirectoryInfo);
        const actionInfo = this._createEditActionInfo('upload', itemInfos, uploadDirectoryInfo, { sessionInfo });
        return this._processEditAction(actionInfo,
            () => { },
            (_, index) => sessionInfo.deferreds[index],
            () => { },
            () => this._resetDirectoryState(uploadDirectoryInfo, true));
    }

    uploadFileChunk(fileData, chunksInfo, destinationDirectory) {
        let startDeferred = null;

        if(chunksInfo.chunkIndex === 0) {
            this._securityController.validateMaxFileSize(fileData.size);
            this._securityController.validateExtension(fileData.name);

            startDeferred = this._processBeforeItemEditAction(args => {
                args.fileData = fileData;
                args.destinationDirectory = destinationDirectory;
                this._editingEvents.onFileUploading(args);
            });
        } else {
            startDeferred = new Deferred().resolve().promise();
        }

        let result = startDeferred.then(() => this._fileProvider.uploadFileChunk(fileData, chunksInfo, destinationDirectory));

        if(chunksInfo.chunkIndex === chunksInfo.chunkCount - 1) {
            result = result.done(() => {
                const args = {
                    fileData,
                    parentDirectory: destinationDirectory
                };
                this._editingEvents.onFileUploaded(args);
            });
        }

        return result;
    }

    abortFileUpload(fileData, chunksInfo, destinationDirectory) {
        return when(this._fileProvider.abortFileUpload(fileData, chunksInfo, destinationDirectory));
    }

    getFileUploadChunkSize() {
        const chunkSize = this._options.uploadChunkSize;
        if(chunkSize && chunkSize > 0) {
            return chunkSize;
        }
        return this._fileProvider.getFileUploadChunkSize();
    }

    downloadItems(itemInfos) {
        const deferreds = itemInfos.map(itemInfo => {
            return this._processBeforeItemEditAction(
                args => {
                    args.item = itemInfo.fileItem;
                    this._editingEvents.onItemDownloading(args);
                },
                itemInfo
            );
        });

        return when(...deferreds)
            .then(() => {
                const items = itemInfos.map(i => i.fileItem);
                return when(this._getItemActionResult(this._fileProvider.downloadItems(items)))
                    .then(() => { },
                        errorInfo => {
                            this._raiseDownloadItemsError(itemInfos, itemInfos[0].parentDirectory, errorInfo);
                        });
            },
            errorInfo => {
                this._raiseDownloadItemsError(itemInfos, itemInfos[0].parentDirectory, errorInfo);
            });
    }

    getItemContent(itemInfos) {
        const items = itemInfos.map(i => i.fileItem);
        return when(this._fileProvider.getItemsContent(items));
    }

    _handleItemLoadError(parentDirectoryInfo, errorInfo, skipNavigationOnError) {
        parentDirectoryInfo = this._getActualDirectoryInfo(parentDirectoryInfo);
        this._raiseGetItemsError(parentDirectoryInfo, errorInfo);
        this._changeDirectoryOnError(parentDirectoryInfo, skipNavigationOnError);
        return new Deferred().reject().promise();
    }

    _raiseGetItemsError(parentDirectoryInfo, errorInfo) {
        const actionInfo = this._createEditActionInfo('getItems', parentDirectoryInfo, parentDirectoryInfo);
        this._raiseEditActionStarting(actionInfo);
        this._raiseEditActionResultAcquired(actionInfo);
        this._raiseEditActionError(actionInfo, {
            errorCode: errorInfo.errorCode,
            errorText: errorInfo.errorText,
            fileItem: parentDirectoryInfo.fileItem,
            index: 0
        });
    }

    _raiseDownloadItemsError(targetFileInfos, directory, errorInfo) {
        const actionInfo = this._createEditActionInfo('download', targetFileInfos, directory);
        const itemsLength = targetFileInfos.length;
        actionInfo.singleRequest = itemsLength === 1;
        this._raiseEditActionStarting(actionInfo);
        this._raiseEditActionResultAcquired(actionInfo);
        for(let index = 0; index < itemsLength - 1; index++) {
            this._raiseEditActionItemError(actionInfo, {
                errorCode: errorInfo.errorCode,
                errorText: errorInfo.errorText,
                fileItem: targetFileInfos[index].fileItem,
                index
            });
        }
        this._raiseEditActionError(actionInfo, {
            errorCode: errorInfo.errorCode,
            errorText: errorInfo.errorText,
            fileItem: targetFileInfos[itemsLength - 1].fileItem,
            index: itemsLength - 1
        });
    }

    _changeDirectoryOnError(dirInfo, skipNavigationOnError, isActualDirectoryRequired) {
        if(isActualDirectoryRequired) {
            dirInfo = this._getActualDirectoryInfo(dirInfo);
        }
        this._resetDirectoryState(dirInfo);
        dirInfo.expanded = false;
        if(!skipNavigationOnError) {
            this.setCurrentDirectory(dirInfo.parentDirectory);
        }
    }

    _getItemActionResult(actionResult) {
        return Array.isArray(actionResult) ? actionResult[0] : actionResult;
    }

    _processEditAction(actionInfo, beforeAction, action, afterAction, completeAction) {
        let isAnyOperationSuccessful = false;
        this._raiseEditActionStarting(actionInfo);

        const actionResult = actionInfo.itemInfos.map((itemInfo, itemIndex) => {
            return this._processBeforeItemEditAction(beforeAction, itemInfo)
                .then(() => {
                    const itemActionResult = this._getItemActionResult(action(itemInfo.fileItem, itemIndex));
                    return itemActionResult.done(() => afterAction(itemInfo));
                });
        });

        actionInfo.singleRequest = actionResult.length === 1;

        this._raiseEditActionResultAcquired(actionInfo);

        return whenSome(
            actionResult,
            info => {
                isAnyOperationSuccessful = true;
                this._raiseCompleteEditActionItem(actionInfo, info);
            },
            errorInfo => this._raiseEditActionItemError(actionInfo, errorInfo)
        ).then(() => {
            completeAction(isAnyOperationSuccessful);
            this._raiseCompleteEditAction(actionInfo);
        });
    }

    _createEditActionInfo(name, targetItemInfos, directory, customData) {
        targetItemInfos = Array.isArray(targetItemInfos) ? targetItemInfos : [ targetItemInfos ];
        customData = customData || { };

        const items = targetItemInfos.map(itemInfo => itemInfo.fileItem);
        return { name, itemInfos: targetItemInfos, items, directory, customData, singleRequest: true };
    }

    _processBeforeItemEditAction(action, itemInfo) {
        const deferred = new Deferred();
        const args = this._createBeforeActionArgs();

        try {
            action(args, itemInfo);
        } catch(errorInfo) {
            return deferred.reject(errorInfo).promise();
        }

        if(!args.cancel) {
            deferred.resolve();
        } else if(args.cancel === true) {
            return deferred.reject({
                errorText: args.errorText,
                errorCode: args.errorCode
            });
        } else if(isPromise(args.cancel)) {
            when(args.cancel)
                .then(res => {
                    if(res === true) {
                        deferred.reject();
                    } else if(isObject(res) && res.cancel === true) {
                        deferred.reject({
                            errorText: res.errorText,
                            errorCode: res.errorCode
                        });
                    }
                    deferred.resolve();
                },
                deferred.resolve);
        }

        return deferred.promise();
    }

    _createBeforeActionArgs() {
        return {
            errorCode: undefined,
            errorText: '',
            cancel: false
        };
    }

    _getItemInfosForUploaderFiles(files, parentDirectoryInfo) {
        const pathInfo = this._getPathInfo(parentDirectoryInfo);
        const result = [];
        for(let i = 0; i < files.length; i++) {
            const file = files[i];
            const item = new FileSystemItem(pathInfo, file.name, false);
            const itemInfo = this._createFileInfo(item, parentDirectoryInfo);
            result.push(itemInfo);
        }
        return result;
    }

    refresh() {
        if(this._lockRefresh) {
            return this._refreshDeferred;
        }

        this._lockRefresh = true;

        return this._executeDataLoad(() => {
            return this._refreshDeferred = this._refreshInternal();
        }, OPERATIONS.REFRESH);
    }

    startSingleLoad() {
        this._singleOperationLockId = new Guid().toString();
    }

    endSingleLoad() {
        delete this._singleOperationLockId;
    }

    _refreshInternal() {
        const cachedRootInfo = {
            items: this._rootDirectoryInfo.items
        };
        const selectedKeyParts = this._getDirectoryPathKeyParts(this.getCurrentDirectory());

        this._resetDirectoryState(this._rootDirectoryInfo);

        return this._loadItemsRecursive(this._rootDirectoryInfo, cachedRootInfo)
            .then(() => {
                const dirInfo = this._findDirectoryByPathKeyParts(selectedKeyParts);
                this.setCurrentDirectory(dirInfo);

                delete this._lockRefresh;
            });
    }

    _loadItemsRecursive(directoryInfo, cachedDirectoryInfo) {
        return this.getDirectories(directoryInfo)
            .then(dirInfos => {
                const itemDeferreds = [ ];
                for(let i = 0; i < dirInfos.length; i++) {
                    const cachedItem = cachedDirectoryInfo.items.find(cache => dirInfos[i].fileItem.key === cache.fileItem.key);
                    if(!cachedItem) continue;

                    dirInfos[i].expanded = cachedItem.expanded;
                    if(dirInfos[i].expanded) {
                        itemDeferreds.push(this._loadItemsRecursive(dirInfos[i], cachedItem));
                    }
                }
                return whenSome(itemDeferreds);
            },
            () => null);
    }

    _setCurrentDirectoryByPathParts(pathParts, useKeys) {
        return this._executeDataLoad(() => this._setCurrentDirectoryByPathPartsInternal(pathParts, useKeys), OPERATIONS.NAVIGATION);
    }

    _setCurrentDirectoryByPathPartsInternal(pathParts, useKeys) {
        return this._getDirectoryByPathParts(this._rootDirectoryInfo, pathParts, useKeys)
            .then(directoryInfo => {
                for(let info = directoryInfo.parentDirectory; info; info = info.parentDirectory) {
                    info.expanded = true;
                }
                this.setCurrentDirectory(directoryInfo);
            }, () => {
                this._raisePathPotentiallyChanged();
            });
    }

    _executeDataLoad(action, operation) {
        if(this._dataLoadingDeferred) {
            return this._dataLoadingDeferred.then(() => this._executeDataLoad(action, operation));
        }
        this._dataLoading = true;
        this._dataLoadingDeferred = new Deferred();

        if(this._isInitialized) {
            this._raiseDataLoading(operation);
        }

        return action().always(() => {
            const tempDeferred = this._dataLoadingDeferred;
            this._dataLoadingDeferred = null;
            this._dataLoading = false;
            tempDeferred.resolve();
        });
    }

    _getDirectoryByPathParts(parentDirectoryInfo, pathParts, useKeys) {
        if(pathParts.length < 1) {
            return new Deferred()
                .resolve(parentDirectoryInfo)
                .promise();
        }

        const fieldName = useKeys ? 'key' : 'name';
        return this.getDirectories(parentDirectoryInfo)
            .then(dirInfos => {
                const subDirInfo = dirInfos.find(d => d.fileItem[fieldName] === pathParts[0]);
                if(!subDirInfo) {
                    return new Deferred().reject().promise();
                }
                const restPathParts = [...pathParts].splice(1);
                return this._getDirectoryByPathParts(subDirInfo, restPathParts, useKeys);
            });
    }

    _getDirectoryPathKeyParts(directoryInfo) {
        const pathParts = [];
        while(directoryInfo && directoryInfo.parentDirectory) {
            pathParts.unshift(directoryInfo.fileItem.key);
            directoryInfo = directoryInfo.parentDirectory;
        }
        return pathParts;
    }

    _findDirectoryByPathKeyParts(keyParts) {
        let selectedDirInfo = this._rootDirectoryInfo;
        if(keyParts.length === 0) {
            return selectedDirInfo;
        }

        let i = 0;
        let newSelectedDir = selectedDirInfo;
        while(newSelectedDir && i < keyParts.length) {
            newSelectedDir = selectedDirInfo.items.find(info => info.fileItem.key === keyParts[i]);
            if(newSelectedDir) {
                selectedDirInfo = newSelectedDir;
            }
            i++;
        }

        return selectedDirInfo;
    }

    _getActualDirectoryInfo(directoryInfo) {
        const keys = this._getDirectoryPathKeyParts(directoryInfo);
        return this._findDirectoryByPathKeyParts(keys);
    }

    _createDirInfoByName(name, parentDirectoryInfo) {
        const dirPathInfo = this._getPathInfo(parentDirectoryInfo);
        const fileItem = new FileSystemItem(dirPathInfo, name, true);
        return this._createDirectoryInfo(fileItem, parentDirectoryInfo);
    }

    _createDirectoryInfo(fileItem, parentDirectoryInfo) {
        return extend(this._createFileInfo(fileItem, parentDirectoryInfo), {
            icon: 'folder',
            expanded: fileItem.isRoot(),
            items: [ ]
        });
    }

    _createFileInfo(fileItem, parentDirectoryInfo) {
        return {
            fileItem,
            parentDirectory: parentDirectoryInfo,
            icon: this._getFileItemDefaultIcon(fileItem),
            getInternalKey() {
                return `FIK_${this.fileItem.key}`;
            },
            getDisplayName() {
                return this.displayName || this.fileItem.name;
            }
        };
    }

    _resetDirectoryState(directoryInfo, isActualDirectoryRequired) {
        if(isActualDirectoryRequired) {
            directoryInfo = this._getActualDirectoryInfo(directoryInfo);
        }
        directoryInfo.itemsLoaded = false;
        directoryInfo.items = [ ];
    }

    _getFileItemDefaultIcon(fileItem) {
        if(fileItem.isDirectory) {
            return 'folder';
        }

        const extension = fileItem.getFileExtension();
        const icon = this._defaultIconMap[extension];
        return icon || 'doc';
    }

    _createDefaultIconMap() {
        const result = {
            '.txt': 'txtfile',
            '.rtf': 'rtffile',
            '.doc': 'docfile',
            '.docx': 'docxfile',
            '.xls': 'xlsfile',
            '.xlsx': 'xlsxfile',
            '.ppt': 'pptfile',
            '.pptx': 'pptxfile',
            '.pdf': 'pdffile'
        };

        ['.png', '.gif', '.jpg', '.jpeg', '.ico', '.bmp'].forEach(extension => {
            result[extension] = 'image';
        });

        return result;
    }

    _createRootDirectoryInfo(text) {
        const rootDirectory = new FileSystemItem(null, '', true);

        const result = this._createDirectoryInfo(rootDirectory, null);
        result.displayName = text || DEFAULT_ROOT_FILE_SYSTEM_ITEM_NAME;
        return result;
    }

    setRootText(rootText) {
        this._rootDirectoryInfo.displayName = rootText || DEFAULT_ROOT_FILE_SYSTEM_ITEM_NAME;
    }

    _raiseInitialized() {
        this._tryCallAction('onInitialized', { controller: this });
    }

    _raiseDataLoading(operation) {
        this._tryCallAction('onDataLoading', { operation });
    }

    _raiseSelectedDirectoryChanged(directoryInfo) {
        this._tryCallAction('onSelectedDirectoryChanged', { selectedDirectoryInfo: directoryInfo });
    }

    _raiseEditActionStarting(actionInfo) {
        this._tryCallAction('onEditActionStarting', actionInfo);
    }

    _raiseEditActionResultAcquired(actionInfo) {
        this._tryCallAction('onEditActionResultAcquired', actionInfo);
    }

    _raiseEditActionError(actionInfo, errorInfo) {
        this._tryCallAction('onEditActionError', actionInfo, errorInfo);
    }

    _raiseEditActionItemError(actionInfo, errorInfo) {
        this._tryCallAction('onEditActionItemError', actionInfo, errorInfo);
    }

    _raiseCompleteEditActionItem(actionInfo, info) {
        this._tryCallAction('onCompleteEditActionItem', actionInfo, info);
    }

    _raiseCompleteEditAction(actionInfo) {
        this._tryCallAction('onCompleteEditAction', actionInfo);
    }

    _raisePathPotentiallyChanged() {
        this._tryCallAction('onPathPotentiallyChanged');
    }

    _tryCallAction(actionName) {
        const args = Array.prototype.slice.call(arguments, 1);
        if(this._isInitialized && this._options[actionName]) {
            this._options[actionName](...args);
        }
    }

    _resetState() {
        this._selectedDirectory = null;
        this._rootDirectoryInfo.items = [ ];
        this._rootDirectoryInfo.itemsLoaded = false;
        this._loadedItems = { };
    }

    _getPathInfo(directoryInfo) {
        const pathInfo = [ ];
        for(let dirInfo = directoryInfo; dirInfo && !dirInfo.fileItem.isRoot(); dirInfo = dirInfo.parentDirectory) {
            pathInfo.unshift({
                key: dirInfo.fileItem.key,
                name: dirInfo.fileItem.name
            });
        }
        return pathInfo;
    }

    on(eventName, eventHandler) {
        const finalEventName = `on${eventName}`;
        this._options[finalEventName] = eventHandler;
    }

    get _editingEvents() {
        return this._options.editingEvents;
    }
}

class FileSecurityController {

    constructor(options) {
        const defaultOptions = {
            allowedFileExtensions: [],
            maxFileSize: 0
        };

        this._options = extend(defaultOptions, options);

        this._extensionsMap = {};
        this._allowedFileExtensions.forEach(extension => {
            this._extensionsMap[extension.toUpperCase()] = true;
        });
    }

    getAllowedItems(items) {
        if(this._allowedFileExtensions.length === 0) {
            return items;
        }
        return items.filter(item => item.isDirectory || this._isValidExtension(item.name));
    }

    validateExtension(name) {
        if(!this._isValidExtension(name)) {
            throw new FileSystemError(ErrorCode.WrongFileExtension, null);
        }
    }

    validateMaxFileSize(size) {
        if(this._maxFileSize && size > this._maxFileSize) {
            throw new FileSystemError(ErrorCode.MaxFileSizeExceeded, null);
        }
    }

    _isValidExtension(name) {
        if(this._allowedFileExtensions.length === 0) {
            return true;
        }
        const extension = getFileExtension(name).toUpperCase();
        return this._extensionsMap[extension];
    }

    get _allowedFileExtensions() {
        return this._options.allowedFileExtensions;
    }

    get _maxFileSize() {
        return this._options.maxFileSize;
    }

}
