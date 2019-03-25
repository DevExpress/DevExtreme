import { each } from "../core/utils/iterator";

const PATH_SEPARATOR = "/";
const DEFAULT_FILE_UPLOAD_CHUNK_SIZE = 200000;

class FileProvider {

    getFolders(path) {
        return this.getItems(path, "folder");
    }

    getFiles(path) {
        return this.getItems(path, "file");
    }

    getItems(path, itemType) {
        return [];
    }

    renameItem(item, name) {
    }

    createFolder(parentFolder, name) {
    }

    deleteItems(items) {
    }

    moveItems(items, destinationFolder) {
    }

    copyItems(items, destinationFolder) {
    }

    initiateFileUpload(uploadInfo) {
    }

    uploadFileChunk(uploadInfo, chunk) {
    }

    finalizeFileUpload(uploadInfo) {
    }

    abortFileUpload(uploadInfo) {
    }

    getFileUploadChunkSize() {
        return DEFAULT_FILE_UPLOAD_CHUNK_SIZE;
    }

    _getItemsByType(path, folders) {
        return this.getItems(path).filter(item => item.isFolder === folders);
    }

}

class FileManagerItem {
    constructor(parentPath, name, isFolder) {
        this.parentPath = parentPath;
        this.name = name;
        this.relativeName = getFileUtils().pathCombine(this.parentPath, name);
        this.isFolder = isFolder || false;

        this.length = 0;
        this.lastWriteTime = new Date();

        this.thumbnail = "";
        this.tooltipText = "";
    }

    getExtension() {
        return this.isFolder ? "" : getFileUtils().getFileExtension(this.name);
    }

    createClone() {
        const result = new FileManagerItem(this.parentPath, this.name, this.isFolder);
        result.length = this.length;
        result.lastWriteTime = this.lastWriteTime;
        result.thumbnail = this.thumbnail;
        result.tooltipText = this.tooltipText;
        return result;
    }
}

class FileUtils {

    constructor(pathSeparator) {
        this.pathSeparator = pathSeparator || PATH_SEPARATOR;
    }

    getFileExtension(path) {
        const index = path.lastIndexOf(".");
        return index !== -1 ? path.substr(index) : "";
    }

    getName(path) {
        const index = path.lastIndexOf(this.pathSeparator);
        return index !== -1 ? path.substr(index + this.pathSeparator.length) : path;
    }

    getParentPath(path) {
        const index = path.lastIndexOf(this.pathSeparator);
        return index !== -1 ? path.substr(0, index) : "";
    }

    getPathParts(path) {
        return path.split(this.pathSeparator);
    }

    pathCombine() {
        let result = "";

        each(arguments, (_, arg) => {
            if(arg) {
                if(result) {
                    result += this.pathSeparator;
                }

                result += arg;
            }
        });

        return result;
    }

}

let fileUtils = null;

const getFileUtils = () => {
    if(!fileUtils) {
        fileUtils = new FileUtils();
    }
    return fileUtils;
};

module.exports.FileProvider = FileProvider;
module.exports.FileManagerItem = FileManagerItem;
module.exports.FileUtils = FileUtils;
module.exports.getFileUtils = getFileUtils;
