import "ui/file_manager";
import { FileManagerItem } from "ui/file_manager/file_provider/file_provider";

import RemoteFileProvider from "ui/file_manager/file_provider/remote";
import ajaxMock from "../../../helpers/ajaxMock.js";
import { createSampleFileItems } from "../../../helpers/fileManagerHelpers.js";
import { when } from "core/utils/deferred";

const { test } = QUnit;

const { filesPathInfo, itemData, fileManagerItems } = createSampleFileItems();

const moduleConfig = {

    beforeEach: function() {
        this.options = {
            endpointUrl: "/api/endpoint"
        };

        this.provider = new RemoteFileProvider(this.options);
    },

    afterEach: function() {
        ajaxMock.clear();
    }

};

QUnit.module("Remote Provider", moduleConfig, () => {

    test("get directory file items", function(assert) {
        const done = assert.async();

        ajaxMock.setup({
            url: this.options.endpointUrl + "?command=GetDirContents&arguments=%7B%22pathInfo%22%3A%5B%7B%22key%22%3A%22Root%22%2C%22name%22%3A%22Root%22%7D%2C%7B%22key%22%3A%22Root%2FFiles%22%2C%22name%22%3A%22Files%22%7D%5D%7D",
            responseText: {
                result: itemData,
                success: true
            },
            callback: request => assert.equal(request.method, "GET")
        });

        const pathInfo = [
            { key: "Root", name: "Root" },
            { key: "Root/Files", name: "Files" }
        ];

        this.provider.getItems(pathInfo)
            .done(folders => {
                assert.deepEqual(folders, fileManagerItems, "folders received");
                done();
            });
    });

    test("create directory", function(assert) {
        const done = assert.async();

        ajaxMock.setup({
            url: this.options.endpointUrl + "?command=CreateDir&arguments=%7B%22pathInfo%22%3A%5B%7B%22key%22%3A%22Root%22%2C%22name%22%3A%22Root%22%7D%2C%7B%22key%22%3A%22Root%2FFiles%22%2C%22name%22%3A%22Files%22%7D%2C%7B%22key%22%3A%22Root%2FFiles%2FDocuments%22%2C%22name%22%3A%22Documents%22%7D%5D%2C%22name%22%3A%22Test%201%22%7D",
            responseText: {
                success: true
            },
            callback: request => assert.equal(request.method, "POST")
        });

        const parentFolder = new FileManagerItem(filesPathInfo, "Documents");
        this.provider.createFolder(parentFolder, "Test 1")
            .done(result => {
                assert.ok(result.success, "folder created");
                done();
            });
    });

    test("rename item test", function(assert) {
        const done = assert.async();

        ajaxMock.setup({
            url: this.options.endpointUrl + "?command=Rename&arguments=%7B%22pathInfo%22%3A%5B%7B%22key%22%3A%22Root%22%2C%22name%22%3A%22Root%22%7D%2C%7B%22key%22%3A%22Root%2FFiles%22%2C%22name%22%3A%22Files%22%7D%2C%7B%22key%22%3A%22Root%2FFiles%2FDocuments%22%2C%22name%22%3A%22Documents%22%7D%5D%2C%22name%22%3A%22Test%201%22%7D",
            responseText: {
                success: true
            },
            callback: request => assert.equal(request.method, "POST")
        });

        const item = new FileManagerItem(filesPathInfo, "Documents");
        this.provider.renameItem(item, "Test 1")
            .done(result => {
                assert.ok(result.success, "item renamed");
                done();
            });
    });

    test("delete item test", function(assert) {
        const done = assert.async();

        ajaxMock.setup({
            url: this.options.endpointUrl + "?command=Remove&arguments=%7B%22pathInfo%22%3A%5B%7B%22key%22%3A%22Root%22%2C%22name%22%3A%22Root%22%7D%2C%7B%22key%22%3A%22Root%2FFiles%22%2C%22name%22%3A%22Files%22%7D%2C%7B%22key%22%3A%22Root%2FFiles%2FDocuments%22%2C%22name%22%3A%22Documents%22%7D%5D%7D",
            responseText: {
                success: true
            },
            callback: request => assert.equal(request.method, "POST")
        });

        const item = new FileManagerItem(filesPathInfo, "Documents");
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
            url: this.options.endpointUrl + "?command=Move&arguments=%7B%22sourcePathInfo%22%3A%5B%7B%22key%22%3A%22Root%22%2C%22name%22%3A%22Root%22%7D%2C%7B%22key%22%3A%22Root%2FFiles%22%2C%22name%22%3A%22Files%22%7D%2C%7B%22key%22%3A%22Root%2FFiles%2FDocuments%22%2C%22name%22%3A%22Documents%22%7D%5D%2C%22destinationPathInfo%22%3A%5B%7B%22key%22%3A%22Root%22%2C%22name%22%3A%22Root%22%7D%2C%7B%22key%22%3A%22Root%2FFiles%22%2C%22name%22%3A%22Files%22%7D%2C%7B%22key%22%3A%22Root%2FFiles%2FImages%22%2C%22name%22%3A%22Images%22%7D%5D%7D",
            responseText: {
                success: true
            },
            callback: request => assert.equal(request.method, "POST")
        });

        const item = new FileManagerItem(filesPathInfo, "Documents");
        const destinationFolder = new FileManagerItem(filesPathInfo, "Images");
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
            url: this.options.endpointUrl + "?command=Copy&arguments=%7B%22sourcePathInfo%22%3A%5B%7B%22key%22%3A%22Root%22%2C%22name%22%3A%22Root%22%7D%2C%7B%22key%22%3A%22Root%2FFiles%22%2C%22name%22%3A%22Files%22%7D%2C%7B%22key%22%3A%22Root%2FFiles%2FDocuments%22%2C%22name%22%3A%22Documents%22%7D%5D%2C%22destinationPathInfo%22%3A%5B%7B%22key%22%3A%22Root%22%2C%22name%22%3A%22Root%22%7D%2C%7B%22key%22%3A%22Root%2FFiles%22%2C%22name%22%3A%22Files%22%7D%2C%7B%22key%22%3A%22Root%2FFiles%2FImages%22%2C%22name%22%3A%22Images%22%7D%5D%7D",
            responseText: {
                success: true
            },
            callback: request => assert.equal(request.method, "POST")
        });

        const item = new FileManagerItem(filesPathInfo, "Documents");
        const destinationFolder = new FileManagerItem(filesPathInfo, "Images");
        const deferreds = this.provider.copyItems([ item ], destinationFolder);
        when.apply(null, deferreds)
            .done(result => {
                assert.ok(result.success, "item copied");
                done();
            });
    });

    test("get items content test", function(assert) {
        const done = assert.async();

        ajaxMock.setup({
            url: this.options.endpointUrl,
            responseText: new ArrayBuffer(5),
            callback: request => {
                assert.strictEqual(request.method, "POST");
                assert.strictEqual(request.responseType, "arraybuffer");
            }
        });

        const item = new FileManagerItem(filesPathInfo, "Article.txt");
        this.provider.getItemsContent([ item ])
            .done(result => {
                assert.strictEqual(result.byteLength, 5, "item content acquired");
                done();
            });
    });

    test("generation end point", function(assert) {
        let provider = new RemoteFileProvider({
            endpointUrl: "myEndpoint"
        });
        assert.ok(provider._getEndpointUrl("myCommand", { }).indexOf("myEndpoint?command=myCommand") !== -1);

        provider = new RemoteFileProvider({
            endpointUrl: "myEndpoint?param1=value"
        });
        assert.ok(provider._getEndpointUrl("myCommand", { }).indexOf("myEndpoint?param1=value&command=myCommand") !== -1);
    });

});
