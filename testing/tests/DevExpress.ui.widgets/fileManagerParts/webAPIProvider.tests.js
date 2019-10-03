import "ui/file_manager";
import { FileManagerItem } from "ui/file_manager/file_provider/file_provider";

import WebApiFileProvider from "ui/file_manager/file_provider/webapi";
import ajaxMock from "../../../helpers/ajaxMock.js";
import { when } from "core/utils/deferred";
import { deserializeDate } from "core/utils/date_serialization";

const { test } = QUnit;

const createFileManagerItem = (parentPath, dataObj) => {
    let item = new FileManagerItem(parentPath, dataObj.name, dataObj.isDirectory);
    item.dateModified = deserializeDate(dataObj.dateModified);
    item.size = dataObj.size;
    item.dataItem = dataObj;
    if(dataObj.isDirectory) {
        item.hasSubDirs = true;
    }
    return item;
};

const FOLDER_COUNT = 3;

const itemData = [
    { id: "Root\\Files\\Documents", name: "Documents", dateModified: "2019-02-14T07:44:15.4265625Z", isDirectory: true, size: 0 },
    { id: "Root\\Files\\Images", name: "Images", dateModified: "2019-02-14T07:44:15.4885105Z", isDirectory: true, size: 0 },
    { id: "Root\\Files\\Music", name: "Music", dateModified: "2019-02-14T07:44:15.4964648Z", isDirectory: true, size: 0 },
    { id: "Root\\Files\\Description.rtf", name: "Description.rtf", dateModified: "2017-02-09T09:38:46.3772529Z", isDirectory: false, size: 1 },
    { id: "Root\\Files\\Article.txt", name: "Article.txt", dateModified: "2017-02-09T09:38:46.3772529Z", isDirectory: false, size: 1 }
];

const fileManagerItems = [
    createFileManagerItem("Root/Files", itemData[0]),
    createFileManagerItem("Root/Files", itemData[1]),
    createFileManagerItem("Root/Files", itemData[2]),
    createFileManagerItem("Root/Files", itemData[3]),
    createFileManagerItem("Root/Files", itemData[4])
];

const fileManagerFolders = fileManagerItems.slice(0, FOLDER_COUNT);
const fileManagerFiles = fileManagerItems.slice(FOLDER_COUNT);

const moduleConfig = {

    beforeEach: function() {
        this.options = {
            endpointUrl: "/api/endpoint"
        };

        this.provider = new WebApiFileProvider(this.options);
    },

    afterEach: function() {
        ajaxMock.clear();
    }

};

QUnit.module("Web API Provider", moduleConfig, () => {

    test("get folders test", function(assert) {
        const done = assert.async();

        ajaxMock.setup({
            url: this.options.endpointUrl + "?command=GetDirContents&arguments=%7B%22parentId%22%3A%22Root%2FFiles%22%7D",
            responseText: {
                result: itemData,
                success: true
            },
            callback: request => assert.equal(request.method, "GET")
        });

        this.provider.getFolders("Root/Files")
            .done(folders => {
                assert.deepEqual(folders, fileManagerFolders, "folders received");
                done();
            });
    });

    test("get files test", function(assert) {
        const done = assert.async();

        ajaxMock.setup({
            url: this.options.endpointUrl + "?command=GetDirContents&arguments=%7B%22parentId%22%3A%22Root%2FFiles%22%7D",
            responseText: {
                success: true,
                result: itemData
            },
            callback: request => assert.equal(request.method, "GET")
        });

        this.provider.getFiles("Root/Files")
            .done(files => {
                assert.deepEqual(files, fileManagerFiles, "files received");
                done();
            });
    });

    test("create folder test", function(assert) {
        const done = assert.async();

        ajaxMock.setup({
            url: this.options.endpointUrl + "?command=CreateDir&arguments=%7B%22parentId%22%3A%22Root%2FFiles%2FDocuments%22%2C%22name%22%3A%22Test%201%22%7D",
            responseText: {
                success: true
            },
            callback: request => assert.equal(request.method, "POST")
        });

        const parentFolder = new FileManagerItem("Root/Files", "Documents");
        this.provider.createFolder(parentFolder, "Test 1")
            .done(result => {
                assert.ok(result.success, "folder created");
                done();
            });
    });

    test("rename item test", function(assert) {
        const done = assert.async();

        ajaxMock.setup({
            url: this.options.endpointUrl + "?command=Rename&arguments=%7B%22id%22%3A%22Root%2FFiles%2FDocuments%22%2C%22name%22%3A%22Test%201%22%7D",
            responseText: {
                success: true
            },
            callback: request => assert.equal(request.method, "POST")
        });

        const item = new FileManagerItem("Root/Files", "Documents");
        this.provider.renameItem(item, "Test 1")
            .done(result => {
                assert.ok(result.success, "item renamed");
                done();
            });
    });

    test("delete item test", function(assert) {
        const done = assert.async();

        ajaxMock.setup({
            url: this.options.endpointUrl + "?command=Remove&arguments=%7B%22id%22%3A%22Root%2FFiles%2FDocuments%22%7D",
            responseText: {
                success: true
            },
            callback: request => assert.equal(request.method, "POST")
        });

        const item = new FileManagerItem("Root/Files", "Documents");
        const deferreds = this.provider.deleteItems([ item ]);
        when.apply(null, deferreds)
            .done(result => {
                assert.ok(result.success, "item deleted");
                done();
            });
    });

    test("move item test", function(assert) {
        const done = assert.async();

        ajaxMock.setup({
            url: this.options.endpointUrl + "?command=Move&arguments=%7B%22sourceId%22%3A%22Root%2FFiles%2FDocuments%22%2C%22destinationId%22%3A%22Root%2FFiles%2FImages%2FDocuments%22%7D",
            responseText: {
                success: true
            },
            callback: request => assert.equal(request.method, "POST")
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

    test("copy item test", function(assert) {
        const done = assert.async();

        ajaxMock.setup({
            url: this.options.endpointUrl + "?command=Copy&arguments=%7B%22sourceId%22%3A%22Root%2FFiles%2FDocuments%22%2C%22destinationId%22%3A%22Root%2FFiles%2FImages%2FDocuments%22%7D",
            responseText: {
                success: true
            },
            callback: request => assert.equal(request.method, "POST")
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

    test("generation end point", function(assert) {
        let provider = new WebApiFileProvider({
            endpointUrl: "myEndpoint"
        });
        assert.ok(provider._getEndpointUrl("myCommand", { }).indexOf("myEndpoint?command=myCommand") !== -1);

        provider = new WebApiFileProvider({
            endpointUrl: "myEndpoint?param1=value"
        });
        assert.ok(provider._getEndpointUrl("myCommand", { }).indexOf("myEndpoint?param1=value&command=myCommand") !== -1);
    });

});
