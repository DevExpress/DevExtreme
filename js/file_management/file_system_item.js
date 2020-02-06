import { isString } from '../core/utils/type';
import { pathCombine, getFileExtension, getPathParts, getName, PATH_SEPARATOR } from './utils';

class FileSystemItem {
    constructor() {
        const ctor = isString(arguments[0]) ? this._publicCtor : this._internalCtor;
        ctor.apply(this, arguments);
    }

    _internalCtor(pathInfo, name, isDirectory) {
        this.name = name;

        this.pathInfo = pathInfo && [...pathInfo] || [];
        this.parentPath = this._getPathByPathInfo(this.pathInfo);
        this.key = this.relativeName = pathCombine(this.parentPath, name);

        this.path = pathCombine(this.parentPath, name);
        this.pathKeys = this.pathInfo.map(({ key }) => key);
        this.pathKeys.push(this.key);

        this._initialize(isDirectory);
    }

    _publicCtor(path, isDirectory, pathKeys) {
        this.path = path || '';
        this.pathKeys = pathKeys || [];

        const pathInfo = [];

        const parts = getPathParts(path, true);
        for(let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            const pathInfoPart = {
                key: this.pathKeys[i] || part,
                name: getName(part)
            };
            pathInfo.push(pathInfoPart);
        }

        this.pathInfo = pathInfo;

        this.relativeName = path;
        this.name = getName(path);
        this.key = this.pathKeys.length ? this.pathKeys[this.pathKeys.length - 1] : path;
        this.parentPath = parts.length > 1 ? parts[parts.length - 2] : '';

        this._initialize(isDirectory);
    }

    _initialize(isDirectory) {
        this.isDirectory = isDirectory || false;
        this.isRoot = false;

        this.size = 0;
        this.dateModified = new Date();

        this.thumbnail = '';
        this.tooltipText = '';
    }

    getFullPathInfo() {
        const pathInfo = [...this.pathInfo];
        !this.isRoot && pathInfo.push({
            key: this.key,
            name: this.name
        });
        return pathInfo;
    }

    getExtension() {
        return this.isDirectory ? '' : getFileExtension(this.name);
    }

    equals(item) {
        return item && this.key === item.key;
    }

    createClone() {
        const result = new FileSystemItem(this.pathInfo, this.name, this.isDirectory);
        result.key = this.key;
        result.size = this.size;
        result.dateModified = this.dateModified;
        result.thumbnail = this.thumbnail;
        result.tooltipText = this.tooltipText;
        result.hasSubDirs = this.hasSubDirs;
        result.dataItem = this.dataItem;
        return result;
    }

    _getPathByPathInfo(pathInfo) {
        return pathInfo
            .map(info => info.name)
            .join(PATH_SEPARATOR);
    }
}

class FileSystemRootItem extends FileSystemItem {
    constructor() {
        super(null, 'Files', true);
        this.key = '__dxfmroot_394CED1B-58CF-4925-A5F8-042BC0822B31_51558CB8-C170-4655-A9E0-C454ED8EA2C1';
        this.relativeName = '';
        this.isRoot = true;
    }
}

module.exports = FileSystemItem;
module.exports.FileSystemRootItem = FileSystemRootItem;
