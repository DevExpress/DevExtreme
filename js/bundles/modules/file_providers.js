import DevExpress from "./core";

module.exports = DevExpress.FileProviders = DevExpress.FileProviders || {};

DevExpress.FileProviders.WebAPI = require("../../file_provider/file_provider.webapi");
DevExpress.FileProviders.OneDrive = require("../../file_provider/file_provider.onedrive");
