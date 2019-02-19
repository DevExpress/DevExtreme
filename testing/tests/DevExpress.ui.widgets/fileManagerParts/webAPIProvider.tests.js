import "ui/file_manager";
import FileManagerItem from "ui/file_manager/ui.file_manager.items";
import WebAPIFileProvider from "ui/file_manager/ui.file_manager.file_provider.webapi";
import ajaxMock from "../../../helpers/ajaxMock.js";

const { test } = QUnit;

const createFileManagerItem = (parentPath, name, lastWriteTimeString, length) => {
    var result = new FileManagerItem(parentPath, name);
    result.lastWriteTime = lastWriteTimeString; // TODO make conversion to 'Date' type
    result.length = length;
    return result;
};

const FOLDER_COUNT = 3;

const itemData = [
    { id: "Root\\Files\\Documents", name: "Documents", lastWriteTime: "2019-02-14T07:44:15.4265625Z", isFolder: true, size: 0 },
    { id: "Root\\Files\\Images", name: "Images", lastWriteTime: "2019-02-14T07:44:15.4885105Z", isFolder: true, size: 0 },
    { id: "Root\\Files\\Music", name: "Music", lastWriteTime: "2019-02-14T07:44:15.4964648Z", isFolder: true, size: 0 },
    { id: "Root\\Files\\Description.rtf", name: "Description.rtf", lastWriteTime: "2017-02-09T09:38:46.3772529Z", isFolder: false, size: 1 },
    { id: "Root\\Files\\Article.txt", name: "Article.txt", lastWriteTime: "2017-02-09T09:38:46.3772529Z", isFolder: false, size: 1 }
];

const fileManagerItems = [
    createFileManagerItem("Root/Files", "Documents", "2019-02-14T07:44:15.4265625Z", 0),
    createFileManagerItem("Root/Files", "Images", "2019-02-14T07:44:15.4885105Z", 0),
    createFileManagerItem("Root/Files", "Music", "2019-02-14T07:44:15.4964648Z", 0),
    createFileManagerItem("Root/Files", "Description.rtf", "2017-02-09T09:38:46.3772529Z", 1),
    createFileManagerItem("Root/Files", "Article.txt", "2017-02-09T09:38:46.3772529Z", 1)
];

const fileManagerFolders = fileManagerItems.slice(0, FOLDER_COUNT);
const fileManagerFiles = fileManagerItems.slice(FOLDER_COUNT);

const moduleConfig = {

    beforeEach: () => {
        this.options = {
            loadUrl: "/api/get",
            createFolderUrl: "/api/createfolder",
            renameUrl: "/api/rename",
            deleteUrl: "/api/delete",
            moveUrl: "/api/move",
            copyUrl: "/api/copy",
            downloadUrl: "/api/download"
        };

        this.provider = new WebAPIFileProvider(this.options);
    },

    afterEach: () => {
        ajaxMock.clear();
    }

};

QUnit.module("Web API Provider", moduleConfig, () => {

    test("get folders test", (assert) => {
        var done = assert.async();

        ajaxMock.setup({
            url: this.options.loadUrl + "?parentId=Root%2FFiles",
            responseText: itemData
        });

        this.provider.getFolders("Root/Files")
            .done(folders => {
                assert.deepEqual(folders, fileManagerFolders, "folders received");
                done();
            });
    });

    test("get files test", (assert) => {
        var done = assert.async();

        ajaxMock.setup({
            url: this.options.loadUrl + "?parentId=Root%2FFiles",
            responseText: itemData
        });

        this.provider.getFiles("Root/Files")
            .done(files => {
                assert.deepEqual(files, fileManagerFiles, "files received");
                done();
            });
    });

});
