import DevExpress from './core';
import RemoteFileProvider from '../../ui/file_manager/file_provider/remote';
import CustomFileProvider from '../../ui/file_manager/file_provider/custom';

module.exports = DevExpress.fileProviders = DevExpress.fileProviders || {};

DevExpress.fileProviders.Remote = RemoteFileProvider;
DevExpress.fileProviders.Custom = CustomFileProvider;
