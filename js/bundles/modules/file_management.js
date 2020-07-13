/* eslint-disable import/no-commonjs */
import DevExpress from './core';
import FileSystemItem from '../../file_management/file_system_item';
import ObjectFileSystemProvider from '../../file_management/object_provider';
import RemoteFileSystemProvider from '../../file_management/remote_provider';
import CustomFileSystemProvider from '../../file_management/custom_provider';

module.exports = DevExpress.fileManagement = DevExpress.fileManagement || {};

DevExpress.fileManagement.FileSystemItem = FileSystemItem;
DevExpress.fileManagement.ObjectFileSystemProvider = ObjectFileSystemProvider;
DevExpress.fileManagement.RemoteFileSystemProvider = RemoteFileSystemProvider;
DevExpress.fileManagement.CustomFileSystemProvider = CustomFileSystemProvider;
