import { isString } from '@js/core/utils/type';
import {
  getEscapedFileName, getFileExtension, getName, getPathParts, PATH_SEPARATOR, pathCombine,
} from '@ts/file_management/utils';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Key = any;

export interface PathInfo {
  key: Key;
  name: string;
}

class FileSystemItem {
  name!: string;

  pathInfo?: PathInfo[];

  parentPath?: string;

  relativeName?: string;

  key?: Key;

  path?: string;

  pathKeys?: Key[];

  isDirectory?: boolean;

  size?: number;

  dateModified?: Date;

  thumbnail?: string;

  tooltipText?: string;

  hasSubDirectories?: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataItem?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(...args: any[]) {
    if (isString(args[0])) {
      this._publicCtor(args[0], args[1], args[2]);
    } else {
      this._internalCtor(args[0], args[1], args[2], args[3]);
    }
  }

  _internalCtor(pathInfo: PathInfo[], name: string, isDirectory?: boolean, key?: Key): void {
    this.name = name || '';

    this.pathInfo = pathInfo ? [...pathInfo] : [];
    this.parentPath = this._getPathByPathInfo(this.pathInfo);
    this.relativeName = pathCombine(this.parentPath, name);
    this.key = key || this._getPathByPathInfo(this.getFullPathInfo(), true);

    this.path = pathCombine(this.parentPath, name);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    this.pathKeys = this.pathInfo.map((info: PathInfo) => info.key);
    if (!this.isRoot()) {
      this.pathKeys.push(this.key);
    }

    this._initialize(isDirectory);
  }

  _publicCtor(path: string, isDirectory?: boolean, pathKeys?: Key[]): void {
    this.path = path || '';
    this.pathKeys = pathKeys ?? [];

    const pathInfo: PathInfo[] = [];

    const parts = getPathParts(path, true);
    for (let i = 0; i < parts.length - 1; i += 1) {
      const part = parts[i];
      const pathInfoPart = {
        key: this.pathKeys[i] || part,
        name: getName(part),
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

  _initialize(isDirectory?: boolean): void {
    this.isDirectory = !!isDirectory;

    this.size = 0;
    this.dateModified = new Date();

    this.thumbnail = '';
    this.tooltipText = '';
  }

  getFullPathInfo(): PathInfo[] {
    const pathInfo = [...this.pathInfo ?? []];

    if (!this.isRoot()) {
      pathInfo.push({
        key: this.key,
        name: this.name,
      });
    }

    return pathInfo;
  }

  isRoot(): boolean {
    return this.path === '';
  }

  getFileExtension(): string {
    return this.isDirectory ? '' : getFileExtension(this.name);
  }

  equals(item: FileSystemItem): boolean {
    return item && this.key === item.key;
  }

  createClone(): FileSystemItem {
    const result = new FileSystemItem(this.pathInfo, this.name, this.isDirectory, this.key);
    result.key = this.key;
    result.size = this.size;
    result.dateModified = this.dateModified;
    result.thumbnail = this.thumbnail;
    result.tooltipText = this.tooltipText;
    result.hasSubDirectories = this.hasSubDirectories;
    result.dataItem = this.dataItem;
    return result;
  }

  _getPathByPathInfo(pathInfo: PathInfo[], escape?: boolean): string {
    return pathInfo
      .map((info) => (escape ? getEscapedFileName(info.name) : info.name))
      .join(PATH_SEPARATOR);
  }
}

export default FileSystemItem;
