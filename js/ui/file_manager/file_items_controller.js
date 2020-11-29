import FileSystemProviderBase from '../../file_management/provider_base';
import FileSystemItem from '../../file_management/file_system_item';
import ObjectFileSystemProvider from '../../file_management/object_provider';
import RemoteFileSystemProvider from '../../file_management/remote_provider';
import CustomFileSystemProvider from '../../file_management/custom_provider';
import ErrorCode from '../../file_management/errors';
import { pathCombine, getEscapedFileName, getPathParts, getFileExtension } from '../../file_management/utils';
import { whenSome } from './ui.file_manager.common';

import { Deferred, when } from '../../core/utils/deferred';
import { find } from '../../core/utils/array';
import { extend } from '../../core/utils/extend';
import { equalByValue } from '../../core/utils/common';

const DEFAULT_ROOT_FILE_SYSTEM_ITEM_NAME = 'Files';

export default class FileItemsController {

    constructor(options) {
        options = options || {};
        this._options = extend({ }, options);

        this._isInitialized = false;
        this._dataLoading = false;
        this._dataLoadingDeferred = null;

        this._rootDirectoryInfo = this._createRootDirectoryInfo(options.rootText);
        this._currentDirectoryInfo = this._rootDirectoryInfo;

        this._defaultIconMap = this._createDefaultIconMap();

        this._securityController = new FileSecurityController({
            allowedFileExtensions: this._options.allowedFileExtensions,
            maxFileSize: this._options.uploadMaxFileSize
        });

        this._setProvider(options.fileProvider);
        this._initialize();
    }

    _setProvider(fileProvider) {
        this._fileProvider = this._createFileProvider(fileProvider);
        this._resetState();
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
            return;
        }

        return this._setCurrentDirectoryByPathParts(pathParts);
    }

    setCurrentPathByKeys(pathKeys) {
        if(equalByValue(this.getCurrentDirectory().fileItem.pathKeys, pathKeys, 0, true)) {
            return;
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

    getCurrentDirectory() {
        return this._currentDirectoryInfo;
    }

    setCurrentDirectory(directoryInfo) {
        if(!directoryInfo) {
            return;
        }

        if(this._currentDirectoryInfo && this._currentDirectoryInfo === directoryInfo) {
            return;
        }

        const requireRaiseSelectedDirectory = this._currentDirectoryInfo.fileItem.key !== directoryInfo.fileItem.key;
        this._currentDirectoryInfo = directoryInfo;

        if(requireRaiseSelectedDirectory && this._isInitialized) {
            if(!this._dataLoading) {
                this._raiseDataLoading('navigation');
            }
            this._raiseSelectedDirectoryChanged(directoryInfo);
        }
    }

    getCurrentItems(onlyFiles) {
        return this._dataLoadingDeferred
            ? this._dataLoadingDeferred.then(() => this._getCurrentItemsInternal(onlyFiles))
            : this._getCurrentItemsInternal(onlyFiles);
    }

    _getCurrentItemsInternal(onlyFiles) {
        const currentDirectory = this.getCurrentDirectory();
        return onlyFiles ? this.getFiles(currentDirectory) : this.getDirectoryContents(currentDirectory);
    }

    getDirectories(parentDirectoryInfo, skipNavigationOnError) {
        return this.getDirectoryContents(parentDirectoryInfo, skipNavigationOnError)
            .then(itemInfos => itemInfos.filter(info => info.fileItem.isDirectory));
    }

    getFiles(parentDirectoryInfo) {
        return this.getDirectoryContents(parentDirectoryInfo)
            .then(itemInfos => itemInfos.filter(info => !info.fileItem.isDirectory));
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
        const tempDirInfo = this._createDirInfoByName(name, parentDirectoryInfo);
        const actionInfo = this._createEditActionInfo('create', tempDirInfo, parentDirectoryInfo);
        return this._processEditAction(actionInfo,
            () => this._fileProvider.createDirectory(parentDirectoryInfo.fileItem, name),
            () => this._resetDirectoryState(parentDirectoryInfo, true));
    }

    renameItem(fileItemInfo, name) {
        const actionInfo = this._createEditActionInfo('rename', fileItemInfo, fileItemInfo.parentDirectory, { itemNewName: name });
        return this._processEditAction(actionInfo,
            () => {
                if(!fileItemInfo.fileItem.isDirectory) {
                    this._securityController.validateExtension(name);
                }
                return this._fileProvider.renameItem(fileItemInfo.fileItem, name);
            },
            () => {
                const parentDirectory = this._getActualDirectoryInfo(fileItemInfo.parentDirectory);
                this._resetDirectoryState(parentDirectory);
                this.setCurrentDirectory(parentDirectory);
            });
    }

    moveItems(itemInfos, destinationDirectory) {
        const items = itemInfos.map(i => i.fileItem);
        const actionInfo = this._createEditActionInfo('move', itemInfos, destinationDirectory);
        return this._processEditAction(actionInfo,
            () => this._fileProvider.moveItems(items, destinationDirectory.fileItem),
            () => {
                destinationDirectory = this._getActualDirectoryInfo(destinationDirectory);
                itemInfos.forEach(itemInfo => this._resetDirectoryState(itemInfo.parentDirectory, true));
                this._resetDirectoryState(destinationDirectory);
                this.setCurrentDirectory(destinationDirectory);
                destinationDirectory.expanded = true;
            });
    }

    copyItems(itemInfos, destinationDirectory) {
        const items = itemInfos.map(i => i.fileItem);
        const actionInfo = this._createEditActionInfo('copy', itemInfos, destinationDirectory);
        return this._processEditAction(actionInfo,
            () => this._fileProvider.copyItems(items, destinationDirectory.fileItem),
            () => {
                destinationDirectory = this._getActualDirectoryInfo(destinationDirectory);
                this._resetDirectoryState(destinationDirectory);
                this.setCurrentDirectory(destinationDirectory);
                destinationDirectory.expanded = true;
            });
    }

    deleteItems(itemInfos) {
        const items = itemInfos.map(i => i.fileItem);
        const directory = itemInfos.length > 0 ? itemInfos[0].parentDirectory : null;
        const actionInfo = this._createEditActionInfo('delete', itemInfos, directory);
        return this._processEditAction(actionInfo,
            () => this._fileProvider.deleteItems(items),
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
            () => sessionInfo.deferreds,
            () => this._resetDirectoryState(uploadDirectoryInfo, true));
    }

    uploadFileChunk(fileData, chunksInfo, destinationDirectory) {
        this._securityController.validateMaxFileSize(fileData.size);
        this._securityController.validateExtension(fileData.name);
        return when(this._fileProvider.uploadFileChunk(fileData, chunksInfo, destinationDirectory));
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
        const items = itemInfos.map(i => i.fileItem);
        this._fileProvider.downloadItems(items);
    }

    getItemContent(itemInfos) {
        const items = itemInfos.map(i => i.fileItem);
        return when(this._fileProvider.getItemsContent(items));
    }

    _handleItemLoadError(parentDirectoryInfo, errorInfo, skipNavigationOnError) {
        parentDirectoryInfo = this._getActualDirectoryInfo(parentDirectoryInfo);
        const actionInfo = this._createEditActionInfo('getItems', parentDirectoryInfo, parentDirectoryInfo);
        this._raiseEditActionStarting(actionInfo);
        this._raiseEditActionResultAcquired(actionInfo);
        this._raiseEditActionError(actionInfo, {
            errorId: errorInfo.errorId,
            fileItem: parentDirectoryInfo.fileItem,
            index: 0
        });
        this._resetDirectoryState(parentDirectoryInfo);
        parentDirectoryInfo.expanded = false;
        if(!skipNavigationOnError) {
            this.setCurrentDirectory(parentDirectoryInfo.parentDirectory);
        }

        return new Deferred().reject().promise();
    }

    _processEditAction(actionInfo, action, completeAction) {
        let actionResult = null;

        this._raiseEditActionStarting(actionInfo);

        try {
            actionResult = action();
        } catch(errorInfo) {
            this._raiseEditActionError(actionInfo, errorInfo);
            return new Deferred().reject().promise();
        }

        if(!Array.isArray(actionResult)) {
            actionResult = [ actionResult ];
        } else if(actionResult.length > 1) {
            actionInfo.singleRequest = false;
        }

        this._raiseEditActionResultAcquired(actionInfo);

        return whenSome(
            actionResult,
            info => this._raiseCompleteEditActionItem(actionInfo, info),
            errorInfo => this._raiseEditActionItemError(actionInfo, errorInfo)
        ).then(() => {
            completeAction();
            this._raiseCompleteEditAction(actionInfo);
        });
    }

    _createEditActionInfo(name, targetItemInfos, directory, customData) {
        targetItemInfos = Array.isArray(targetItemInfos) ? targetItemInfos : [ targetItemInfos ];
        customData = customData || { };

        const items = targetItemInfos.map(itemInfo => itemInfo.fileItem);
        return { name, itemInfos: targetItemInfos, items, directory, customData, singleRequest: true };
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
        }, 'refresh');
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
                    const cachedItem = find(cachedDirectoryInfo.items, cache => dirInfos[i].fileItem.key === cache.fileItem.key);
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

    _setCurrentDirectoryByPathParts(pathParts, useKeys) {
        return this._executeDataLoad(() => this._setCurrentDirectoryByPathPartsInternal(pathParts, useKeys), 'navigation');
    }

    _setCurrentDirectoryByPathPartsInternal(pathParts, useKeys) {
        return this._getDirectoryByPathParts(this._rootDirectoryInfo, pathParts, useKeys)
            .then(directoryInfo => {
                for(let info = directoryInfo.parentDirectory; info; info = info.parentDirectory) {
                    info.expanded = true;
                }
                this.setCurrentDirectory(directoryInfo);
            });
    }

    _executeDataLoad(action, operation) {
        this._dataLoading = true;
        this._dataLoadingDeferred = new Deferred();

        if(this._isInitialized) {
            this._raiseDataLoading(operation);
        }

        return action().always(() => {
            this._dataLoadingDeferred.resolve();
            this._dataLoadingDeferred = null;
            this._dataLoading = false;
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
                const subDirInfo = find(dirInfos, d => d.fileItem[fieldName] === pathParts[0]);
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
            newSelectedDir = find(selectedDirInfo.items, info => info.fileItem.key === keyParts[i]);
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

    _raiseInitialized() {
        const e = { controller: this };
        if(this._options.onInitialized) {
            this._options.onInitialized(e);
        }
    }

    _raiseDataLoading(operation) {
        if(this._options.onDataLoading) {
            this._options.onDataLoading({ operation });
        }
    }

    _raiseSelectedDirectoryChanged(directoryInfo) {
        const e = { selectedDirectoryInfo: directoryInfo };
        if(this._options.onSelectedDirectoryChanged) {
            this._options.onSelectedDirectoryChanged(e);
        }
    }

    _raiseEditActionStarting(actionInfo) {
        if(this._options.onEditActionStarting) {
            this._options.onEditActionStarting(actionInfo);
        }
    }

    _raiseEditActionResultAcquired(actionInfo) {
        if(this._options.onEditActionResultAcquired) {
            this._options.onEditActionResultAcquired(actionInfo);
        }
    }

    _raiseEditActionError(actionInfo, errorInfo) {
        if(this._options.onEditActionError) {
            this._options.onEditActionError(actionInfo, errorInfo);
        }
    }

    _raiseEditActionItemError(actionInfo, errorInfo) {
        if(this._options.onEditActionItemError) {
            this._options.onEditActionItemError(actionInfo, errorInfo);
        }
    }

    _raiseCompleteEditActionItem(actionInfo, info) {
        if(this._options.onCompleteEditActionItem) {
            this._options.onCompleteEditActionItem(actionInfo, info);
        }
    }

    _raiseCompleteEditAction(actionInfo) {
        if(this._options.onCompleteEditAction) {
            this._options.onCompleteEditAction(actionInfo);
        }
    }

    _resetState() {
        this._selectedDirectory = null;
        this._rootDirectoryInfo.items = [ ];
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
            this._throwError(ErrorCode.WrongFileExtension);
        }
    }

    validateMaxFileSize(size) {
        if(this._maxFileSize && size > this._maxFileSize) {
            this._throwError(ErrorCode.MaxFileSizeExceeded);
        }
    }

    _isValidExtension(name) {
        if(this._allowedFileExtensions.length === 0) {
            return true;
        }
        const extension = getFileExtension(name).toUpperCase();
        return this._extensionsMap[extension];
    }

    _throwError(errorId) {
        throw { errorId };
    }

    get _allowedFileExtensions() {
        return this._options.allowedFileExtensions;
    }

    get _maxFileSize() {
        return this._options.maxFileSize;
    }

}
