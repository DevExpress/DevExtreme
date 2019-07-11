const { test } = QUnit;

import FileItemsController from "ui/file_manager/file_items_controller";

const moduleConfig = {

    beforeEach: function() {
        this.data = [
            { name: "F1", isDirectory: true },
            { name: "F2", isDirectory: true },
            { name: "File1" }
        ];
        this.controller = new FileItemsController({
            fileProvider: this.data
        });
    }

};

QUnit.module("FileItemsController tests", moduleConfig, () => {

    test("raise current directory change event", function(assert) {
        let counter = 0;
        const controller = new FileItemsController({
            fileProvider: this.data,
            onSelectedDirectoryChanged: () => { counter++; }
        });

        const rootDir = this.controller.getCurrentDirectory();
        assert.equal(counter, 0);

        const done = assert.async();
        controller
            .getDirectories(rootDir)
            .done(directories => {
                controller.setCurrentDirectory(directories[0]);
                assert.ok(controller.getCurrentDirectory().fileItem.equals(directories[0].fileItem));
                assert.equal(counter, 1);

                controller.setCurrentDirectory(directories[0]);
                assert.ok(controller.getCurrentDirectory().fileItem.equals(directories[0].fileItem));
                assert.equal(counter, 1);
                done();
            });
    });

    test("get directory contents", function(assert) {
        const done = assert.async();
        const selectedDir = this.controller.getCurrentDirectory();

        this.controller
            .getDirectoryContents(selectedDir)
            .done(items => {
                assert.equal(items.length, 3);
                assert.equal(items[0].fileItem.name, "F1");
                assert.equal(items[1].fileItem.name, "F2");
                assert.equal(items[2].fileItem.name, "File1");
                done();
            });

        this.controller
            .getDirectories(selectedDir)
            .done(directories => {
                assert.equal(directories.length, 2);
                assert.equal(directories[0].fileItem.name, "F1");
                assert.equal(directories[1].fileItem.name, "F2");
            });

        this.controller
            .getFiles(selectedDir)
            .done(files => {
                assert.equal(files.length, 1);
                assert.equal(files[0].fileItem.name, "File1");
            });
    });

    test("create new directory", function(assert) {
        const done = assert.async();
        const selectedDir = this.controller.getCurrentDirectory();
        const that = this;

        this.controller
            .getDirectories(selectedDir)
            .then(() => {
                assert.ok(selectedDir.itemsLoaded);
                assert.ok(selectedDir.items.length > 0);
                return that.controller.createDirectory(selectedDir, "New");
            })
            .then(() => {
                assert.notOk(selectedDir.itemsLoaded);
                assert.notOk(selectedDir.items.length > 0);
                return that.controller.getDirectories(selectedDir);
            })
            .then(directories => {
                assert.equal(directories[2].fileItem.name, "New");
                done();
            });
    });

    test("rename file item", function(assert) {
        const done = assert.async();
        const currentDir = this.controller.getCurrentDirectory();
        const that = this;
        this.controller
            .getDirectories(currentDir)
            .then(directories => {
                return that.controller.renameItem(directories[0], "New");
            })
            .then(() => {
                assert.notOk(currentDir.itemsLoaded);
                assert.equal(currentDir.items.length, 0);
                return that.controller.getDirectories(currentDir);
            })
            .then(directories => {
                assert.equal(directories[0].fileItem.name, "New");
                done();
            });
    });

    test("move file items", function(assert) {
        const that = this;
        const done = assert.async();
        const rootDir = this.controller.getCurrentDirectory();
        this.controller
            .getDirectories(rootDir)
            .then(directories => {
                return that.controller.moveItems([ directories[0] ], directories[1]);
            })
            .then(() => {
                assert.notOk(rootDir.itemsLoaded);
                assert.equal(rootDir.items.length, 0);
                return that.controller.getDirectories(rootDir);
            })
            .then(directories => {
                assert.equal(directories.length, 1);
                assert.equal(directories[0].fileItem.name, "F2");
                return that.controller.getDirectories(directories[0]);
            })
            .then(directories => {
                assert.equal(directories.length, 1);
                assert.equal(directories[0].fileItem.name, "F1");
                done();
            });
    });

    test("copy file items", function(assert) {
        const that = this;
        const done = assert.async();
        const rootDir = this.controller.getCurrentDirectory();
        this.controller
            .getDirectories(rootDir)
            .then(directories => {
                that.controller.copyItems([ directories[0] ], directories[1]);
                return directories[1];
            })
            .then(dirF2 => {
                assert.ok(rootDir.itemsLoaded);
                assert.equal(rootDir.items.length, 3);
                return that.controller.getDirectories(dirF2);
            })
            .then(directories => {
                assert.equal(directories.length, 1);
                assert.equal(directories[0].fileItem.name, "F1");
                assert.ok(directories[0].parentDirectory.expanded);
                done();
            });
    });

    test("delete file items", function(assert) {
        const that = this;
        const done = assert.async();
        const currentDir = this.controller.getCurrentDirectory();
        this.controller
            .getDirectoryContents(currentDir)
            .then(itemInfos => {
                return that.controller.deleteItems([ itemInfos[1], itemInfos[2] ]);
            })
            .then(() => {
                assert.notOk(currentDir.itemsLoaded);
                assert.equal(currentDir.items.length, 0);
                return that.controller.getDirectoryContents(currentDir);
            })
            .then(itemInfos => {
                assert.equal(itemInfos.length, 1);
                assert.equal(itemInfos[0].fileItem.name, "F1");
                done();
            });
    });

    test("get current path", function(assert) {
        const done = assert.async();
        const controller = new FileItemsController({
            fileProvider: [
                {
                    name: "F1",
                    isDirectory: true,
                    items: [
                        { name: "F1.1", isDirectory: true }
                    ]
                }
            ]
        });

        const rootDir = this.controller.getCurrentDirectory();
        controller
            .getDirectoryContents(rootDir)
            .then(directories => controller.getDirectories(directories[0]))
            .then(directories => {
                controller.getDirectories(directories[0]);
                return directories[0];
            })
            .then(parentDirectory => {
                controller.setCurrentDirectory(parentDirectory);
                assert.equal(controller.getCurrentPath(), "F1/F1.1");
                done();
            });
    });

});
