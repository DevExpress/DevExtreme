import DevExpress from "./core";
import WebApiFileProvider from "../../ui/file_manager/file_provider/webapi";

module.exports = DevExpress.fileProviders = DevExpress.fileProviders || {};

DevExpress.fileProviders.WebApi = WebApiFileProvider;
