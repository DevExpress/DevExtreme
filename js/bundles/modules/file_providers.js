import DevExpress from "./core";
import WebAPIFileProvider from "../../ui/file_manager/file_provider/file_provider.webapi";
import OneDriveFileProvider from "../../ui/file_manager/file_provider/file_provider.onedrive";

module.exports = DevExpress.FileProviders = DevExpress.FileProviders || {};

DevExpress.FileProviders.WebAPI = WebAPIFileProvider;
DevExpress.FileProviders.OneDrive = OneDriveFileProvider;
