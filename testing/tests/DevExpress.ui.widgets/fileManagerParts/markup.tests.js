const { test } = QUnit;
import $ from 'jquery';
import 'ui/file_manager';
import fx from 'animation/fx';
import { FileManagerWrapper, createTestFileSystem, Consts } from '../../../helpers/fileManagerHelpers.js';
import 'common.css!';

const getDefaultConfig = () => {
    return {
        fileSystemProvider: createTestFileSystem(),
        itemView: {
            mode: 'thumbnails'
        },
        permissions: {
            create: true,
            copy: true,
            move: true,
            delete: true,
            rename: true,
            upload: true
        }
    };
};


QUnit.testStart(function() {
    const markup =
        '<div id="fileManager"></div>';

    $('#qunit-fixture').html(markup);
});

const moduleConfig = {

    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        fx.off = true;

        this.prepareFileManager = (isPure, options) => {
            const config = $.extend(true, isPure ? {} : getDefaultConfig(), options || {});
            this.$element = $('#fileManager').dxFileManager(config);
            this.wrapper = new FileManagerWrapper(this.$element.dxFileManager());
            this.clock.tick(400);
        };
    },

    afterEach: function() {
        this.clock.tick(5000);

        this.clock.restore();
        this.$element.remove();
        fx.off = false;
    }

};

QUnit.module('Markup rendering', moduleConfig, () => {

    test('default render state', function(assert) {
        this.prepareFileManager(true);

        assert.ok(this.$element.hasClass(Consts.WIDGET_CLASS), 'element has a widget-specific class');

        const progressDrawer = this.wrapper.getProgressDrawer();

        assert.strictEqual(progressDrawer.length, 1, 'notification drawer is rendered');
        assert.strictEqual(progressDrawer.find(`.${Consts.DRAWER_PANEL_CONTENT_CLASS} > .${Consts.PROGRESS_PANEL_CLASS}`).length, 1, 'progress panel is rendered');

        const widgetWrapper = progressDrawer.find(`.${Consts.DRAWER_CONTENT_CLASS} > .${Consts.NOTIFICATION_DRAWER_PANEL_CLASS} > .${Consts.WIDGET_WRAPPER_CLASS}`);

        assert.strictEqual(widgetWrapper.length, 1, 'widget wrapper is rendered');
        assert.ok(widgetWrapper.children(`.${Consts.TOOLBAR_CLASS}`).hasClass(Consts.GENERAL_TOOLBAR_CLASS), 'general toolbar is rendered');
        assert.strictEqual(widgetWrapper.find(`.${Consts.CONTAINER_CLASS}`).length, 1, 'widget container is rendered');

        const dirsPanel = widgetWrapper.find(`.${Consts.CONTAINER_CLASS}\
             .${Consts.DRAWER_PANEL_CONTENT_CLASS} > .${Consts.DIRS_PANEL_CLASS}`);
        const splitterWrapper = widgetWrapper.find(`.${Consts.CONTAINER_CLASS}\
             .${Consts.DRAWER_PANEL_CONTENT_CLASS} > .${Consts.SPLITTER_WRAPPER_CLASS}`);
        const itemsPanel = widgetWrapper.find(`.${Consts.CONTAINER_CLASS}\
             .${Consts.DRAWER_CONTENT_CLASS} > .${Consts.ADAPTIVITY_DRAWER_PANEL_CLASS} > .${Consts.ITEMS_PANEL_CLASS}`);

        assert.strictEqual(dirsPanel.length, 1, 'folders panel is rendered');

        assert.strictEqual(splitterWrapper.length, 1, 'splitter wrapper is rendered');
        assert.strictEqual(splitterWrapper.find(`.${Consts.SPLITTER_CLASS}`).length, 1, 'splitter is rendered');

        assert.strictEqual(itemsPanel.length, 1, 'items panel is rendered');
        assert.ok(itemsPanel.find(`.${Consts.ITEMS_VIEW_CLASS}`).hasClass(Consts.DETAILS_VIEW_CLASS), 'item view is in details mode');

        const rootFolder = dirsPanel.find(`.${Consts.DIRS_TREE_CLASS} .${Consts.FOLDERS_TREE_VIEW_ITEM_CLASS}`);

        assert.strictEqual(rootFolder.length, 1, 'has only root folder');
        assert.strictEqual(rootFolder.text(), 'Files', 'root folder has correct default text');
    });

    test('customize thumbnail', function(assert) {
        let counter = 0;

        this.prepareFileManager(false, {
            customizeThumbnail: item => {
                if(item.isDirectory) {
                    return '';
                }
                counter++;
                return 'image';
            }
        });

        assert.equal(counter, 3, 'function called');
        assert.equal(this.wrapper.getCustomThumbnails().length, counter, 'custom thumbnails rendered');
    });

    test('elipsis rendered', function(assert) {
        const fileSystem = createTestFileSystem();
        fileSystem[1].name = 'Folder 2 test 11111111 testtesttestest 22222 test test 1111111 test 1 222222';

        this.prepareFileManager(false, {
            fileSystemProvider: fileSystem,
            itemView: {
                mode: 'details'
            },
            width: 600
        });

        const $node = this.wrapper.getFolderNode(2);
        const $text = $node.find('.dx-filemanager-dirs-tree-item-text');
        const $button = $node.find('.dx-filemanager-file-actions-button');
        const textBottom = $text[0].offsetTop + $text[0].clientHeight;
        const buttonTop = $button[0].offsetTop;
        assert.ok(buttonTop < textBottom, 'text and button on the same line');
    });

    test('active area switches on itemView and dirsPanel click', function(assert) {
        this.prepareFileManager();
        const dirsPanel = this.wrapper.getDirsPanel();
        const itemsView = this.wrapper.getItemsView();

        assert.notOk(dirsPanel.hasClass(Consts.INACTIVE_AREA_CLASS), 'dirsPanel is active');
        assert.ok(itemsView.hasClass(Consts.INACTIVE_AREA_CLASS), 'itemsView is inactive');

        itemsView.trigger('click');
        this.clock.tick(400);

        assert.ok(dirsPanel.hasClass(Consts.INACTIVE_AREA_CLASS), 'dirsPanel is inactive');
        assert.notOk(itemsView.hasClass(Consts.INACTIVE_AREA_CLASS), 'itemsView is active');

        this.wrapper.getDirsTree().trigger('click');
        this.clock.tick(400);

        assert.notOk(dirsPanel.hasClass(Consts.INACTIVE_AREA_CLASS), 'dirsPanel is active');
        assert.ok(itemsView.hasClass(Consts.INACTIVE_AREA_CLASS), 'itemsView is inactive');
    });

});
