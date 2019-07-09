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

    test("get folders", function(assert) {
        let folders = this.provider.getFolders();
        assert.equal(folders.length, 2);
        assert.equal(folders[0].name, "F1");
        assert.ok(folders[0].hasSubDirs);
        assert.equal(folders[1].name, "F2");
        assert.notOk(folders[1].hasSubDirs);

        folders = this.provider.getFolders("F1");
        assert.equal(3, folders.length);
        assert.equal(folders[0].name, "F1.1");
        assert.notOk(folders[0].hasSubDirs);
        assert.equal(folders[1].name, "F1.2");
        assert.notOk(folders[1].hasSubDirs);
        assert.equal(folders[2].name, "F1.3");
        assert.ok(folders[2].hasSubDirs);
    });

    test("get files", function(assert) {
        let files = this.provider.getFiles();
        assert.equal(files.length, 0);

        files = this.provider.getFiles("F1/F1.2");
        assert.equal(files.length, 1);
        assert.equal(files[0].name, "File1.2.txt");
    });

    test("move folder", function(assert) {
        let folders = this.provider.getFolders();
        this.provider.moveItems([ folders[0] ], folders[1]);

        folders = this.provider.getFolders();
        assert.equal(folders.length, 1);
        assert.ok(folders[0].hasSubDirs);
    });

    test("throw error when try moving folder with incorrect parameters", function(assert) {
        let errorCount = 0;
        let lastErrorId = -1;
        let folders = this.provider.getFolders();

        try {
            this.provider.moveItems([ folders[0] ], folders[0]);
        } catch(e) {
            errorCount++;
            lastErrorId = e.errorId;
        }
        assert.equal(folders[0].name, "F1");
        assert.equal(errorCount, 1);
        assert.equal(lastErrorId, ErrorCode.Other);

        let subFolders = this.provider.getFolders("F1");
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
        let folders = this.provider.getFolders();

        try {
            this.provider.copyItems([ folders[0] ], folders[0]);
        } catch(e) {
            errorCount++;
            lastErrorId = e.errorId;
        }
        assert.equal(folders[0].name, "F1");
        assert.equal(errorCount, 1);
        assert.equal(lastErrorId, ErrorCode.Other);

        let subFolders = this.provider.getFolders("F1");
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

});
