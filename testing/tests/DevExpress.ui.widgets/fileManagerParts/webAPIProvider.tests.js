import "ui/file_manager";
import { FileManagerItem } from "ui/file_manager/file_provider/file_provider";

import WebApiFileProvider from "ui/file_manager/file_provider/file_provider.webapi";
import ajaxMock from "../../../helpers/ajaxMock.js";
import { when } from "core/utils/deferred";

const { test } = QUnit;

const createFileManagerItem = (parentPath, name, isFolder, lastWriteTimeString, length) => {
    const result = new FileManagerItem(parentPath, name, isFolder);
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
    createFileManagerItem("Root/Files", "Documents", true, "2019-02-14T07:44:15.4265625Z", 0),
    createFileManagerItem("Root/Files", "Images", true, "2019-02-14T07:44:15.4885105Z", 0),
    createFileManagerItem("Root/Files", "Music", true, "2019-02-14T07:44:15.4964648Z", 0),
    createFileManagerItem("Root/Files", "Description.rtf", false, "2017-02-09T09:38:46.3772529Z", 1),
    createFileManagerItem("Root/Files", "Article.txt", false, "2017-02-09T09:38:46.3772529Z", 1)
];

const fileManagerFolders = fileManagerItems.slice(0, FOLDER_COUNT);
const fileManagerFiles = fileManagerItems.slice(FOLDER_COUNT);

const moduleConfig = {

    beforeEach: () => {
        this.options = {
            endpointUrl: "/api/endpoint"
        };

        this.provider = new WebApiFileProvider(this.options);
    },

    afterEach: () => {
        ajaxMock.clear();
    }

};

QUnit.module("Web API Provider", moduleConfig, () => {

    test("get folders test", (assert) => {
        const done = assert.async();

        ajaxMock.setup({
            url: this.options.endpointUrl + "?command=GetDirContent&arguments=%7B%22parentId%22%3A%22Root%2FFiles%22%7D",
            responseText: {
                result: itemData,
                success: true
            }
        });

        this.provider.getFolders("Root/Files")
            .done(folders => {
                assert.deepEqual(folders, fileManagerFolders, "folders received");
                done();
            });
    });

    test("get files test", (assert) => {
        const done = assert.async();

        ajaxMock.setup({
            url: this.options.endpointUrl + "?command=GetDirContent&arguments=%7B%22parentId%22%3A%22Root%2FFiles%22%7D",
            responseText: {
                success: true,
                result: itemData
            }
        });

        this.provider.getFiles("Root/Files")
            .done(files => {
                assert.deepEqual(files, fileManagerFiles, "files received");
                done();
            });
    });

    test("create folder test", (assert) => {
        const done = assert.async();

        ajaxMock.setup({
            url: this.options.endpointUrl + "?command=CreateDir&arguments=%7B%22parentId%22%3A%22Root%2FFiles%2FDocuments%22%2C%22name%22%3A%22Test%201%22%7D",
            responseText: {
                success: true
            }
        });

        const parentFolder = new FileManagerItem("Root/Files", "Documents");
        this.provider.createFolder(parentFolder, "Test 1")
            .done(result => {
                assert.ok(result.success, "folder created");
                done();
            });
    });

    test("rename item test", (assert) => {
        const done = assert.async();

        ajaxMock.setup({
            url: this.options.endpointUrl + "?command=Rename&arguments=%7B%22id%22%3A%22Root%2FFiles%2FDocuments%22%2C%22name%22%3A%22Test%201%22%7D",
            responseText: {
                success: true
            }
        });

        const item = new FileManagerItem("Root/Files", "Documents");
        this.provider.renameItem(item, "Test 1")
            .done(result => {
                assert.ok(result.success, "item renamed");
                done();
            });
    });

    test("delete item test", (assert) => {
        const done = assert.async();

        ajaxMock.setup({
            url: this.options.endpointUrl + "?command=Remove&arguments=%7B%22id%22%3A%22Root%2FFiles%2FDocuments%22%7D",
            responseText: {
                success: true
            }
        });

        const item = new FileManagerItem("Root/Files", "Documents");
        const deferreds = this.provider.deleteItems([ item ]);
        when.apply(null, deferreds)
            .done(result => {
                assert.ok(result.success, "item deleted");
                done();
            });
    });

    test("move item test", (assert) => {
        const done = assert.async();

        ajaxMock.setup({
            url: this.options.endpointUrl + "?command=Move&arguments=%7B%22sourceId%22%3A%22Root%2FFiles%2FDocuments%22%2C%22destinationId%22%3A%22Root%2FFiles%2FImages%2FDocuments%22%7D",
            responseText: {
                success: true
            }
        });

        const item = new FileManagerItem("Root/Files", "Documents");
        const destinationFolder = new FileManagerItem("Root/Files", "Images");
        const deferreds = this.provider.moveItems([ item ], destinationFolder);
        when.apply(null, deferreds)
            .done(result => {
                assert.ok(result.success, "item moved");
                done();
            });
    });

    test("copy item test", (assert) => {
        const done = assert.async();

        ajaxMock.setup({
            url: this.options.endpointUrl + "?command=Copy&arguments=%7B%22sourceId%22%3A%22Root%2FFiles%2FDocuments%22%2C%22destinationId%22%3A%22Root%2FFiles%2FImages%22%7D",
            responseText: {
                success: true
            }
        });

        const item = new FileManagerItem("Root/Files", "Documents");
        const destinationFolder = new FileManagerItem("Root/Files", "Images");
        const deferreds = this.provider.copyItems([ item ], destinationFolder);
        when.apply(null, deferreds)
            .done(result => {
                assert.ok(result.success, "item copied");
                done();
            });
    });

});
