import { FileProvider, FileManagerRootItem } from "./file_provider/file_provider";
import ArrayFileProvider from "./file_provider/array";
import AjaxFileProvider from "./file_provider/ajax";
import OneDriveFileProvider from "./file_provider/onedrive";
import WebApiFileProvider from "./file_provider/webapi";
import { pathCombine } from "./ui.file_manager.utils";

import { Deferred, when } from "../../core/utils/deferred";
import { extend } from "../../core/utils/extend";

export default class FileItemsController {

    constructor(options) {
        const rootDirectory = this._createRootDirectory(options.rootText);
        this._rootDirectoryInfo = this._createDirectoryInfo(rootDirectory, null);

        this._currentDirectoryInfo = this._rootDirectoryInfo;

        this.setProvider(options.fileProvider);
        this._onSelectedDirectoryChanged = options && options.onSelectedDirectoryChanged;

        this._loadedItems = {};
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

        if(typeof fileProvider === "string") {
            return new AjaxFileProvider({ url: fileProvider });
        }

        if(fileProvider instanceof FileProvider) {
            return fileProvider;
        }

        if(fileProvider.type) {
            switch(fileProvider.type) {
                case "webapi":
                    return new WebApiFileProvider(fileProvider);
                case "onedrive":
                    return new OneDriveFileProvider(fileProvider);
            }
        }

        return new ArrayFileProvider(fileProvider);
    }

    getCurrentPath() {
        let currentPath = "";
        let directory = this.getCurrentDirectory();
        while(directory && !directory.fileItem.isRoot) {
            currentPath = pathCombine(directory.fileItem.name, currentPath);
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

        if(this._currentDirectoryInfo && this._currentDirectoryInfo.fileItem.equals(directoryInfo.fileItem)) {
            return;
        }

        this._currentDirectoryInfo = directoryInfo;
        this._raiseSelectedDirectoryChanged(directoryInfo);
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

        const providerDirKey = parentDirectoryInfo.fileItem.isRoot ? "" : parentDirectoryInfo.fileItem.key;
        loadItemsDeferred = when(this._fileProvider.getItems(providerDirKey))
            .then(fileItems => {
                parentDirectoryInfo.items = [ ];
                for(let i = 0; i < fileItems.length; i++) {
                    const fileItem = fileItems[i];
                    const info = fileItem.isDirectory && this._createDirectoryInfo(fileItem, parentDirectoryInfo) || this._createFileInfo(fileItem, parentDirectoryInfo);
                    parentDirectoryInfo.items.push(info);
                }
                parentDirectoryInfo.itemsLoaded = true;
                return parentDirectoryInfo.items;
            });

        const that = this;
        this._loadedItems[dirKey] = loadItemsDeferred;
        loadItemsDeferred.then(() => {
            delete that._loadedItems[dirKey];
        });

        return loadItemsDeferred;
    }

    createDirectory(parentDirectoryInfo, name) {
        const that = this;
        return when(this._fileProvider.createFolder(parentDirectoryInfo.fileItem, name))
            .done(() => that._resetDirectoryState(parentDirectoryInfo));
    }

    renameItem(fileItemInfo, name) {
        const that = this;
        return when(this._fileProvider.renameItem(fileItemInfo.fileItem, name))
            .done(() => {
                that._resetDirectoryState(fileItemInfo.parentDirectory);
                that.setCurrentDirectory(fileItemInfo.parentDirectory);
            });
    }

    moveItems(itemInfos, destinationDirectory) {
        const that = this;
        const items = itemInfos.map(i => i.fileItem);
        return when(this._fileProvider.moveItems(items, destinationDirectory.fileItem))
            .done(() => {
                for(let i = 0; i < itemInfos.length; i++) {
                    that._resetDirectoryState(itemInfos[i].parentDirectory);
                }
                that._resetDirectoryState(destinationDirectory);
                that.setCurrentDirectory(destinationDirectory);
            });
    }

    copyItems(itemInfos, destinationDirectory) {
        const that = this;
        const items = itemInfos.map(i => i.fileItem);
        return when(this._fileProvider.copyItems(items, destinationDirectory.fileItem))
            .done(() => {
                that._resetDirectoryState(destinationDirectory);
                that.setCurrentDirectory(destinationDirectory);
                destinationDirectory.expanded = true;
            });
    }

    deleteItems(itemInfos) {
        const that = this;
        const items = itemInfos.map(i => i.fileItem);
        return when(this._fileProvider.deleteItems(items))
            .done(() => {
                for(let i = 0; i < itemInfos.length; i++) {
                    const parentDir = itemInfos[i].parentDirectory;
                    that._resetDirectoryState(parentDir);
                    that.setCurrentDirectory(parentDir);
                }
            });
    }

    _createDirectoryInfo(fileItem, parentDirectoryInfo) {
        return extend(this._createFileInfo(fileItem, parentDirectoryInfo), {
            icon: "folder",
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
            return "folder";
        }

        const extension = fileItem.getExtension();
        switch(extension) {
            case ".txt":
                return "doc"; // TODO change icon
            case ".rtf":
            case ".doc":
            case ".docx":
            case ".odt":
                return "doc";
            case ".xls":
            case ".xlsx":
            case ".ods":
                return "exportxlsx";
            case ".ppt":
            case ".pptx":
            case ".odp":
                return "doc"; // TODO change icon
            case ".pdf":
                return "exportpdf";
            case ".png":
            case ".gif":
            case ".jpg":
            case ".jpeg":
            case ".ico":
            case ".bmp":
                return "image";
            default:
                return "doc"; // TODO change icon
        }
    }

    _createRootDirectory(text) {
        let root = new FileManagerRootItem();
        if(text) {
            root.name = text;
        }
        return root;
    }

    _raiseSelectedDirectoryChanged(directoryInfo) {
        const e = { selectedDirectoryInfo: directoryInfo };
        this._onSelectedDirectoryChanged && this._onSelectedDirectoryChanged(e);
    }

    _resetState() {
        this._selectedDirectory = null;
        this._rootDirectoryInfo.items = [ ];
        this._loadedItems = { };
    }

}
