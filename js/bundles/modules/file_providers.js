import DevExpress from './core';
import WebApiFileProvider from '../../ui/file_manager/file_provider/webapi';
import OneDriveFileProvider from '../../ui/file_manager/file_provider/onedrive';

module.exports = DevExpress.FileProviders = DevExpress.FileProviders || {};

DevExpress.FileProviders.WebApi = WebApiFileProvider;
DevExpress.FileProviders.OneDrive = OneDriveFileProvider;
