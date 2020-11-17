import $ from 'jquery';
import renderer from 'core/renderer';
import resizeCallbacks from 'core/utils/resize_callbacks';
import 'ui/file_manager';
import fx from 'animation/fx';
import { FileManagerWrapper, createTestFileSystem, Consts } from '../../../helpers/fileManagerHelpers.js';

const { test } = QUnit;

const moduleConfig = {

    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        fx.off = true;

        const that = this;

        this.currentWidth = 400;
        this.currentHeight = 300;

        this.originalWidth = renderer.fn.width;
        this.originalHeight = renderer.fn.height;

        renderer.fn.width = function() {
            if(this[0] && this[0] instanceof Window) {
                return that.currentWidth;
            }
            return that.originalWidth.apply(renderer.fn, arguments);
        };

        renderer.fn.height = function() {
            if(this[0] && this[0] instanceof Window) {
                return that.currentHeight;
            }
            return that.originalHeight.apply(renderer.fn, arguments);
        };

        this.$element = $('#fileManager')
            .css('width', 350)
            .dxFileManager({
                fileSystemProvider: createTestFileSystem(),
                permissions: {
                    create: true,
                    copy: true,
                    move: true,
                    delete: true,
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

QUnit.module('Adaptivity', moduleConfig, () => {

    test('show dirs button visible on small screen', function(assert) {
        let $showDirsButton = this.wrapper.getToolbar().find('.dx-icon-menu:visible');
        assert.equal($showDirsButton.length, 1, 'show dirs panel button visible');

        let folders = this.wrapper.getFolderNodes().filter(':visible');
        assert.ok(folders.length > 3, 'dirs tree visible');

        this.currentWidth = 900;
        this.currentHeight = 800;

        resizeCallbacks.fire();
        this.clock.tick(400);

        $showDirsButton = this.wrapper.getToolbar().find('.dx-icon-menu:visible');
        assert.equal($showDirsButton.length, 0, 'show dirs panel button hidden');

        folders = this.wrapper.getFolderNodes().filter(':visible');
        assert.ok(folders.length > 3, 'dirs tree visible');
    });

    test('dialog size corrent on different window size', function(assert) {
        this.wrapper.getToolbarButton('Copy').trigger('dxclick');
        this.clock.tick(400);

        const $dialog = $('.dx-filemanager-dialog-folder-chooser:visible');
        assert.equal($dialog.length, 1, 'dialog is shown');

        const dialogWidth = $dialog.get(0).offsetWidth;
        const dialogHeight = $dialog.get(0).offsetHeight;

        this.currentWidth = 100;
        this.currentHeight = 100;

        resizeCallbacks.fire();
        this.clock.tick(400);

        assert.ok($dialog.get(0).offsetWidth <= dialogWidth, 'dialog width decreased');
        assert.ok($dialog.get(0).offsetHeight <= dialogHeight, 'dialog height decreased');
    });

    test('splitter should be disabled on small screens', function(assert) {
        $('#fileManager').css('width', '100%');
        this.wrapper.getInstance().repaint();

        assert.ok(this.wrapper.getSplitter().length, 'Splitter was rendered');
        assert.notOk(this.wrapper.isSplitterActive(), 'Splitter is disabled');

        this.currentWidth = 900;
        resizeCallbacks.fire();
        this.clock.tick(400);
        assert.ok(this.wrapper.isSplitterActive(), 'Splitter is active');

        const oldTreeViewWidth = this.wrapper.getDrawerPanelContent().get(0).clientWidth;
        this.wrapper.moveSplitter(100);
        assert.equal(this.wrapper.getDrawerPanelContent().get(0).clientWidth, oldTreeViewWidth + 100, 'Left panel has correct size');
    });

    test('progressPanel should change its mode on small screens', function(assert) {
        const originalWidth = renderer.fn.width;
        renderer.fn.width = () => 1200;
        $('#fileManager').css('width', '100%');
        this.wrapper.getInstance().repaint();

        assert.ok(this.wrapper.getProgressDrawer().hasClass(Consts.DRAWER_MODE_SHRINK));

        renderer.fn.width = () => 999;
        this.wrapper.getInstance().repaint();

        assert.ok(this.wrapper.getProgressDrawer().hasClass(Consts.DRAWER_MODE_OVERLAP));

        renderer.fn.width = originalWidth;
    });

    test('dirs panel must complete its expand on small screens', function(assert) {
        this.wrapper.getToolbarNavigationPaneToggleButton().trigger('dxclick');
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getDrawerPanelContent().css('margin-left'), '0px', 'Dirs panel has correct left margin');
    });

});
