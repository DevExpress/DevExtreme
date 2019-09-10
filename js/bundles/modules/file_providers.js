import DevExpress from "./core";
import WebApiFileProvider from "../../ui/file_manager/file_provider/webapi";
import OneDriveFileProvider from "../../ui/file_manager/file_provider/onedrive";

module.exports = DevExpress.fileProviders = DevExpress.fileProviders || {};

DevExpress.fileProviders.WebApi = WebApiFileProvider;
DevExpress.fileProviders.OneDrive = OneDriveFileProvider;
