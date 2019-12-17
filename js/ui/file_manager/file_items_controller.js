import { FileProvider, FileManagerItem, FileManagerRootItem } from './file_provider/file_provider';
import ArrayFileProvider from './file_provider/array';
import AjaxFileProvider from './file_provider/ajax';
import RemoteFileProvider from './file_provider/remote';
import CustomFileProvider from './file_provider/custom';
import { pathCombine, getEscapedFileName, getPathParts, getFileExtension } from './ui.file_manager.utils';
import whenSome, { ErrorCode } from './ui.file_manager.common';

import { Deferred, when } from '../../core/utils/deferred';
import { find } from '../../core/utils/array';
import { extend } from '../../core/utils/extend';

export default class FileItemsController {

    constructor(options) {
        options = options || {};
        this._options = extend({ }, options);

        const rootDirectory = this._createRootDirectory(options.rootText);
        this._rootDirectoryInfo = this._createDirectoryInfo(rootDirectory, null);

        this._currentDirectoryInfo = this._rootDirectoryInfo;

        this._defaultIconMap = this._createDefaultIconMap();

        this._securityController = new FileSecurityController({
            allowedFileExtensions: this._options.allowedFileExtensions,
            maxFileSize: this._options.maxUploadFileSize
        });

        this.setProvider(options.fileProvider);
        this._onSelectedDirectoryChanged = options && options.onSelectedDirectoryChanged;

        this._loadedItems = {};

        this.setCurrentPath(options.currentPath);
    }

    setProvider(fileProvider) {
        this._fileProvider = this._createFileProvider(fileProvider);
        this._resetState();
    }

    _createFileProvider(fileProvider) {
        if(!fileProvider) {
            fileProvider = [];
        }

        if(Array.isArray(fileProvider)) {
            return new ArrayFileProvider({ data: fileProvider });
        }

        if(typeof fileProvider === 'string') {
            return new AjaxFileProvider({ url: fileProvider });
        }

        if(fileProvider instanceof FileProvider) {
            return fileProvider;
        }

        switch(fileProvider.type) {
            case 'remote':
                return new RemoteFileProvider(fileProvider);
            case 'custom':
                return new CustomFileProvider(fileProvider);
        }

        return new ArrayFileProvider(fileProvider);
    }

    setCurrentPath(path) {
        const pathParts = getPathParts(path);
        const rawPath = pathCombine(...pathParts);
        if(this.getCurrentDirectory().fileItem.relativeName === rawPath) {
            return;
        }

        return this._getDirectoryByPathParts(this._rootDirectoryInfo, pathParts)
            .then(directoryInfo => {
                for(let info = directoryInfo.parentDirectory; info; info = info.parentDirectory) {
                    info.expanded = true;
                }
                this.setCurrentDirectory(directoryInfo);
            });
    }

    getCurrentPath() {
        let currentPath = '';
        let directory = this.getCurrentDirectory();
        while(directory && !directory.fileItem.isRoot) {
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
        requireRaiseSelectedDirectory && this._raiseSelectedDirectoryChanged(directoryInfo);
    }

    getDirectories(parentDirectoryInfo) {
        return this.getDirectoryContents(parentDirectoryInfo)
            .then(itemInfos => itemInfos.filter(info => info.fileItem.isDirectory));
    }

    getFiles(parentDirectoryInfo) {
        return this.getDirectoryContents(parentDirectoryInfo)
            .then(itemInfos => itemInfos.filter(info => !info.fileItem.isDirectory));
    }

    getDirectoryContents(parentDirectoryInfo) {
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

        const dirKey = parentDirectoryInfo.fileItem.key;
        let loadItemsDeferred = this._loadedItems[dirKey];
        if(loadItemsDeferred) {
            return loadItemsDeferred;
        }

        const pathInfo = this._getPathInfo(parentDirectoryInfo);
        loadItemsDeferred = this._getFileItems(pathInfo)
            .then(fileItems => {
                parentDirectoryInfo.items = fileItems.map(fileItem =>
                    fileItem.isDirectory && this._createDirectoryInfo(fileItem, parentDirectoryInfo) || this._createFileInfo(fileItem, parentDirectoryInfo)
                );
                parentDirectoryInfo.itemsLoaded = true;
                return parentDirectoryInfo.items;
            });

        this._loadedItems[dirKey] = loadItemsDeferred;
        loadItemsDeferred.then(() => {
            delete this._loadedItems[dirKey];
        });

        return loadItemsDeferred;
    }

    _getFileItems(pathInfo) {
        return when(this._fileProvider.getItems(pathInfo))
            .then(fileItems => this._securityController.getAllowedItems(fileItems));
    }

    createDirectory(parentDirectoryInfo, name) {
        const actionInfo = this._createEditActionInfo('create', parentDirectoryInfo, parentDirectoryInfo);
        return this._processEditAction(actionInfo,
            () => this._fileProvider.createFolder(parentDirectoryInfo.fileItem, name),
            () => this._resetDirectoryState(parentDirectoryInfo));
    }

    renameItem(fileItemInfo, name) {
        const actionInfo = this._createEditActionInfo('rename', fileItemInfo, fileItemInfo.parentDirectory);
        return this._processEditAction(actionInfo,
            () => {
                if(!fileItemInfo.fileItem.isDirectory) {
                    this._securityController.validateExtension(name);
                }
                return this._fileProvider.renameItem(fileItemInfo.fileItem, name);
            },
            () => {
                this._resetDirectoryState(fileItemInfo.parentDirectory);
                this.setCurrentDirectory(fileItemInfo.parentDirectory);
            });
    }

    moveItems(itemInfos, destinationDirectory) {
        const items = itemInfos.map(i => i.fileItem);
        const actionInfo = this._createEditActionInfo('move', itemInfos, destinationDirectory);
        return this._processEditAction(actionInfo,
            () => this._fileProvider.moveItems(items, destinationDirectory.fileItem),
            () => {
                itemInfos.forEach(itemInfo => this._resetDirectoryState(itemInfo.parentDirectory));
                this._resetDirectoryState(destinationDirectory);
                this.setCurrentDirectory(destinationDirectory);
            });
    }

    copyItems(itemInfos, destinationDirectory) {
        const items = itemInfos.map(i => i.fileItem);
        const actionInfo = this._createEditActionInfo('copy', itemInfos, destinationDirectory);
        return this._processEditAction(actionInfo,
            () => this._fileProvider.copyItems(items, destinationDirectory.fileItem),
            () => {
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
                    const parentDir = itemInfo.parentDirectory;
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
            () => this._resetDirectoryState(uploadDirectoryInfo));
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
        return this._fileProvider.getFileUploadChunkSize();
    }

    downloadItems(itemInfos) {
        const items = itemInfos.map(i => i.fileItem);
        this._fileProvider.downloadItems(items);
    }

    getItemContent(itemInfos) {
        const items = itemInfos.map(i => i.fileItem);
        return when(this._fileProvider.getItemContent(items));
    }

    _processEditAction(actionInfo, action, completeAction) {
        let actionResult = null;

        this._raiseEditActionStarting(actionInfo);

        try {
            actionResult = action();
        } catch(error) {
            this._raiseEditActionError(actionInfo, error);
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
            info => this._raiseEditActionItemError(actionInfo, info)
        ).then(() => {
            completeAction();
            this._raiseCompleteEditAction(actionInfo);
        });
    }

    _createEditActionInfo(name, itemInfos, directory, customData) {
        itemInfos = Array.isArray(itemInfos) ? itemInfos : [ itemInfos ];
        customData = customData || { };

        const items = itemInfos.map(itemInfo => itemInfo.fileItem);
        return { name, itemInfos, items, directory, customData, singleRequest: true };
    }

    _getItemInfosForUploaderFiles(files, parentDirectoryInfo) {
        const pathInfo = this._getPathInfo(parentDirectoryInfo);
        const result = [];
        for(let i = 0; i < files.length; i++) {
            const file = files[i];
            const item = new FileManagerItem(pathInfo, file.name, false);
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

        const cachedRootInfo = {
            items: this._rootDirectoryInfo.items
        };
        const selectedKeyParts = this._getDirectoryPathKeyParts(this.getCurrentDirectory());

        this._resetDirectoryState(this._rootDirectoryInfo);

        this.setCurrentDirectory(null);
        return this._refreshDeferred = this._loadItemsRecursive(this._rootDirectoryInfo, cachedRootInfo)
            .then(() => {
                const dirInfo = this._findSelectedDirectoryByPathKeyParts(selectedKeyParts);
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

    _getDirectoryByPathParts(parentDirectoryInfo, pathParts) {
        if(pathParts.length < 1) {
            return new Deferred()
                .resolve(parentDirectoryInfo)
                .promise();
        }

        return this.getDirectories(parentDirectoryInfo)
            .then(dirInfos => {
                const subDirInfo = find(dirInfos, d => d.fileItem.name === pathParts[0]);
                if(!subDirInfo) {
                    return new Deferred().reject().promise();
                }
                return this._getDirectoryByPathParts(subDirInfo, pathParts.splice(1));
            });
    }

    _getDirectoryPathKeyParts(directoryInfo) {
        let pathParts = [ directoryInfo.fileItem.key ];
        while(directoryInfo && directoryInfo.parentDirectory) {
            pathParts.unshift(directoryInfo.parentDirectory.fileItem.key);
            directoryInfo = directoryInfo.parentDirectory;
        }
        return pathParts;
    }

    _findSelectedDirectoryByPathKeyParts(keyParts) {
        let selectedDirInfo = this._rootDirectoryInfo;
        if(keyParts.length < 2 || keyParts[0] !== this._rootDirectoryInfo.fileItem.key) {
            return selectedDirInfo;
        }

        let i = 1;
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

    _createDirectoryInfo(fileItem, parentDirectoryInfo) {
        return extend(this._createFileInfo(fileItem, parentDirectoryInfo), {
            icon: 'folder',
            expanded: fileItem.isRoot,
            items: [ ]
        });
    }

    _createFileInfo(fileItem, parentDirectoryInfo) {
        return {
            fileItem,
            parentDirectory: parentDirectoryInfo,
            icon: this._getFileItemDefaultIcon(fileItem)
        };
    }

    _resetDirectoryState(directoryInfo) {
        directoryInfo.itemsLoaded = false;
        directoryInfo.items = [ ];
    }

    _getFileItemDefaultIcon(fileItem) {
        if(fileItem.isDirectory) {
            return 'folder';
        }

        const extension = fileItem.getExtension();
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

    _createRootDirectory(text) {
        let root = new FileManagerRootItem();
        root.name = text || '';
        return root;
    }

    _raiseSelectedDirectoryChanged(directoryInfo) {
        const e = { selectedDirectoryInfo: directoryInfo };
        this._onSelectedDirectoryChanged && this._onSelectedDirectoryChanged(e);
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

    _raiseEditActionError(actionInfo, error) {
        if(this._options.onEditActionError) {
            this._options.onEditActionError(actionInfo, error);
        }
    }

    _raiseEditActionItemError(actionInfo, info) {
        if(this._options.onEditActionItemError) {
            this._options.onEditActionItemError(actionInfo, info);
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
        for(let dirInfo = directoryInfo; dirInfo && !dirInfo.fileItem.isRoot; dirInfo = dirInfo.parentDirectory) {
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
            this._extensionsMap[extension] = true;
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

        const extension = getFileExtension(name).toLowerCase();
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
