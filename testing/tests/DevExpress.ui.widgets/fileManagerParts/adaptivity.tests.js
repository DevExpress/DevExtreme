import $ from 'jquery';
import resizeCallbacks from 'core/utils/resize_callbacks';
import 'ui/file_manager';
import fx from 'animation/fx';
import { FileManagerWrapper, createTestFileSystem, Consts } from '../../../helpers/fileManagerHelpers.js';
import { implementationsMap, getOuterWidth } from 'core/utils/size';

const { test } = QUnit;

const moduleConfig = {

    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        fx.off = true;

        const that = this;

        this.currentWidth = 400;
        this.currentHeight = 300;

        this.originalWidth = implementationsMap.getWidth;
        this.originalHeight = implementationsMap.getHeight;

        implementationsMap.getWidth = function() {
            const arg = arguments[0];
            if(arg && arg[0] && arg[0] instanceof Window) {
                return that.currentWidth;
            }
            return that.originalWidth.apply(implementationsMap, arguments);
        };

        implementationsMap.getHeight = function() {
            const arg = arguments[0];
            if(arg && arg[0] && arg[0] instanceof Window) {
                return that.currentHeight;
            }
            return that.originalHeight.apply(implementationsMap, arguments);
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

        implementationsMap.getWidth = this.originalWidth;
        implementationsMap.getHeight = this.originalHeight;
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
        this.wrapper.getRowNameCellInDetailsView(1).trigger('dxhold');
        this.clock.tick(400);
        this.wrapper.getToolbarButton('Copy to').trigger('dxclick');
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
        this.wrapper.getDialogButton('Cancel').trigger('dxclick');
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

        const oldTreeViewWidth = this.wrapper.getNavPaneDrawerPanelContent().get(0).clientWidth;
        this.wrapper.moveSplitter(100);
        assert.equal(this.wrapper.getNavPaneDrawerPanelContent().get(0).clientWidth, oldTreeViewWidth + 100, 'Left panel has correct size');
    });

    test('progressPanel should change its mode on small screens', function(assert) {
        const originalWidth = implementationsMap.getWidth;
        implementationsMap.getWidth = () => 1200;
        $('#fileManager').css('width', '100%');
        this.wrapper.getInstance().repaint();

        assert.ok(this.wrapper.getProgressDrawer().hasClass(Consts.DRAWER_MODE_SHRINK));

        implementationsMap.getWidth = () => 999;
        this.wrapper.getInstance().repaint();

        assert.ok(this.wrapper.getProgressDrawer().hasClass(Consts.DRAWER_MODE_OVERLAP));

        implementationsMap.getWidth = originalWidth;
    });

    test('dirs panel must complete its expand on small screens', function(assert) {
        this.wrapper.getToolbarNavigationPaneToggleButton().trigger('dxclick');
        this.clock.tick(400);

        assert.strictEqual(this.wrapper.getNavPaneDrawerPanelContent().css('margin-left'), '0px', 'Dirs panel has correct left margin');
    });

    test('splitter should follow left pane edge on other elements width change', function(assert) {
        this.wrapper.getInstance().option('width', '100%');
        this.clock.tick(400);

        this.wrapper.moveSplitter(50);
        this.clock.tick(400);

        this.currentWidth = 900;
        resizeCallbacks.fire();
        this.clock.tick(400);

        this.wrapper.getInstance().option('width', '50%');
        this.clock.tick(400);

        const contentPane = this.wrapper.getNavPaneDrawerPanelContent();
        assert.roughEqual(this.wrapper.getSplitterPosition(), getOuterWidth(contentPane), 0.3, 'Splitter is on the correct position');
    });

});
