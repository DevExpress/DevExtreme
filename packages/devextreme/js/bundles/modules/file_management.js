/* eslint-disable import/no-commonjs */
import DevExpress from './core';
import {
    FileSystemError,
    FileSystemItem,
    ObjectFileSystemProvider,
    RemoteFileSystemProvider,
    CustomFileSystemProvider,
} from '../../common/file_management';

module.exports = DevExpress.fileManagement = DevExpress.fileManagement || {};

DevExpress.fileManagement.FileSystemError = FileSystemError;
DevExpress.fileManagement.FileSystemItem = FileSystemItem;
DevExpress.fileManagement.ObjectFileSystemProvider = ObjectFileSystemProvider;
DevExpress.fileManagement.RemoteFileSystemProvider = RemoteFileSystemProvider;
DevExpress.fileManagement.CustomFileSystemProvider = CustomFileSystemProvider;
