const { test } = QUnit;

import "ui/file_manager";
import ArrayFileProvider from "ui/file_manager/file_provider/array";

const moduleConfig = {

    beforeEach: function() {
        this.options = {
            data: [
                {
                    name: "F1",
                    isFolder: true,
                    items: [
                        {
                            name: "F1.1",
                            isFolder: true
                        },
                        {
                            name: "F1.2",
                            isFolder: true,
                            items: [
                                {
                                    name: "File1.2.txt"
                                }
                            ]
                        },
                        {
                            name: "F1.3",
                            isFolder: true,
                            items: [
                                {
                                    name: "F1.3.1",
                                    isFolder: true
                                }
                            ]
                        }
                    ]
                },
                {
                    name: "F2",
                    isFolder: true
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

});
