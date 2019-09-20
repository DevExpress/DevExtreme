import DevExpress from "./core";
import WebApiFileProvider from "../../ui/file_manager/file_provider/webapi";
import CustomFileProvider from "../../ui/file_manager/file_provider/custom";

module.exports = DevExpress.fileProviders = DevExpress.fileProviders || {};

DevExpress.fileProviders.WebApi = WebApiFileProvider;
DevExpress.fileProviders.Custom = CustomFileProvider;
