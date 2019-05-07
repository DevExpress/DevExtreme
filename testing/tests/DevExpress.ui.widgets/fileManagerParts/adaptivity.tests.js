import $ from "jquery";
import renderer from "core/renderer";
import resizeCallbacks from "core/utils/resize_callbacks";
import "ui/file_manager";
import fx from "animation/fx";
import { FileManagerWrapper, createTestFileSystem } from "../../../helpers/fileManagerHelpers.js";

const { test } = QUnit;

const moduleConfig = {

    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        fx.off = true;

        this.currentWidth = 400;
        this.currentHeight = 300;

        this.originalWidth = renderer.fn.width;
        this.originalHeight = renderer.fn.height;

        renderer.fn.width = function() {
            return this.currentWidth;
        }.bind(this);

        renderer.fn.height = function() {
            return this.currentHeight;
        }.bind(this);

        this.$element = $("#fileManager")
            .css("width", 350)
            .dxFileManager({
                fileProvider: createTestFileSystem(),
                permissions: {
                    create: true,
                    copy: true,
                    move: true,
                    remove: true,
                    rename: true,
                    upload: true
                }
            });

        this.wrapper = new FileManagerWrapper(this.$element);

        this.clock.tick(400);
    },

    afterEach: function() {
        this.clock.tick(5000);

        this.clock.restore();
        fx.off = false;

        renderer.fn.width = this.originalWidth;
        renderer.fn.height = this.originalHeight;
    }

};

QUnit.module("Adaptivity", moduleConfig, () => {

    test("show dirs button visible on small screen", function(assert) {
        let $showDirsButton = this.wrapper.getToolbar().find(".dx-icon-menu:visible");
        assert.equal($showDirsButton.length, 1, "show dirs panel button visible");

        let folders = this.wrapper.getFolderNodes().filter(":visible");
        assert.ok(folders.length > 3, "dirs tree visible");

        this.currentWidth = 900;
        this.currentHeight = 800;

        resizeCallbacks.fire();
        this.clock.tick(400);

        $showDirsButton = this.wrapper.getToolbar().find(".dx-icon-menu:visible");
        assert.equal($showDirsButton.length, 0, "show dirs panel button hidden");

        folders = this.wrapper.getFolderNodes().filter(":visible");
        assert.ok(folders.length > 3, "dirs tree visible");
    });

});
