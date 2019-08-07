const { test } = QUnit;

import "ui/file_manager";
import ArrayFileProvider from "ui/file_manager/file_provider/array";
import { ErrorCode } from "ui/file_manager/ui.file_manager.common";

const moduleConfig = {

    beforeEach: function() {
        this.options = {
            data: [
                {
                    name: "F1",
                    isDirectory: true,
                    items: [
                        {
                            name: "F1.1",
                            isDirectory: true
                        },
                        {
                            name: "F1.2",
                            isDirectory: true,
                            items: [
                                {
                                    name: "File1.2.txt"
                                }
                            ]
                        },
                        {
                            name: "F1.3",
                            isDirectory: true,
                            items: [
                                {
                                    name: "F1.3.1",
                                    isDirectory: true
                                }
                            ]
                        }
                    ]
                },
                {
                    name: "F2",
                    isDirectory: true
                }
            ]
        };

        this.provider = new ArrayFileProvider(this.options);
    },
};

QUnit.module("Array File Provider", moduleConfig, () => {

    test("get directory file items", function(assert) {
        let items = this.provider.getItems();
        assert.equal(items.length, 2);
        assert.equal(items[0].name, "F1");
        assert.ok(items[0].hasSubDirs);
        assert.equal(items[1].name, "F2");
        assert.notOk(items[1].hasSubDirs);

        items = this.provider.getItems("F1");
        assert.equal(3, items.length);
        assert.equal(items[0].name, "F1.1");
        assert.notOk(items[0].hasSubDirs);
        assert.equal(items[1].name, "F1.2");
        assert.notOk(items[1].hasSubDirs);
        assert.equal(items[2].name, "F1.3");
        assert.ok(items[2].hasSubDirs);

        items = this.provider.getItems("F1/F1.2");
        assert.equal(items.length, 1);
        assert.equal(items[0].name, "File1.2.txt");
    });

    test("move directory", function(assert) {
        let items = this.provider.getItems();
        this.provider.moveItems([ items[0] ], items[1]);

        items = this.provider.getItems();
        assert.equal(items.length, 1);
        assert.ok(items[0].hasSubDirs);
    });

    test("throw error when try moving folder with incorrect parameters", function(assert) {
        let errorCount = 0;
        let lastErrorId = -1;
        let items = this.provider.getItems();

        try {
            this.provider.moveItems([ items[0] ], items[0]);
        } catch(e) {
            errorCount++;
            lastErrorId = e.errorId;
        }
        assert.equal(items[0].name, "F1");
        assert.equal(errorCount, 1);
        assert.equal(lastErrorId, ErrorCode.Other);

        let subFolders = this.provider.getItems("F1");
        try {
            this.provider.moveItems([ subFolders[0] ], subFolders[0]);
        } catch(e) {
            errorCount++;
            lastErrorId = e.errorId;
        }
        assert.equal(subFolders[0].name, "F1.1");
        assert.equal(errorCount, 2);
        assert.equal(lastErrorId, ErrorCode.Other);
    });

    test("throw error when try copying folder with incorrect parameters", function(assert) {
        let errorCount = 0;
        let lastErrorId = -1;
        let folders = this.provider.getItems();

        try {
            this.provider.copyItems([ folders[0] ], folders[0]);
        } catch(e) {
            errorCount++;
            lastErrorId = e.errorId;
        }
        assert.equal(folders[0].name, "F1");
        assert.equal(errorCount, 1);
        assert.equal(lastErrorId, ErrorCode.Other);

        let subFolders = this.provider.getItems("F1");
        try {
            this.provider.copyItems([ subFolders[0] ], subFolders[0]);
        } catch(e) {
            errorCount++;
            lastErrorId = e.errorId;
        }
        assert.equal(subFolders[0].name, "F1.1");
        assert.equal(errorCount, 2);
        assert.equal(lastErrorId, ErrorCode.Other);
    });

    test("create new folder with existing name", function(assert) {
        this.provider.createFolder(null, "F1");

        const dirs = this.provider.getItems();
        assert.equal(dirs[0].name, "F1");
        assert.equal(dirs[0].key, "F1");
        assert.equal(dirs[1].name, "F2");
        assert.equal(dirs[1].key, "F2");
        assert.equal(dirs[2].name, "F1");
        assert.notEqual(dirs[2].key, "F1");
        assert.ok(dirs[2].key.length > 1);
    });

    test("rename file item with existing name", function(assert) {
        const fileItems = this.provider.getItems();
        this.provider.renameItem(fileItems[0], "F2");

        assert.equal(fileItems[0].name, "F2");
        assert.notEqual(fileItems[0].key, fileItems[1].key);

        assert.equal(fileItems[1].name, "F2");
        assert.equal(fileItems[1].key, "F2");
    });

});
