const { test } = QUnit;
import $ from 'jquery';
import 'ui/file_manager';
import fx from 'common/core/animation/fx';
import windowUtils from 'core/utils/window';
import { FileManagerWrapper, createTestFileSystem, Consts, isDesktopDevice } from '../../../helpers/fileManagerHelpers.js';
import 'generic_light.css!';

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

const prepareFileManager = (context, isPure, options) => {
    const config = $.extend(true, isPure ? {} : getDefaultConfig(), options || {});
    context.$element = $('#fileManager').dxFileManager(config);
    context.clock.tick(400);
    context.wrapper = new FileManagerWrapper(context.$element.dxFileManager());
    context.clock.tick(400);
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
        prepareFileManager(this, true);
        assert.ok(this.$element.hasClass(Consts.WIDGET_CLASS), 'element has a widget-specific class');

        const progressDrawer = this.$element.find(`.${Consts.NOTIFICATION_DRAWER_CLASS}`);
        const progressPanel = progressDrawer.find(`.${Consts.DRAWER_PANEL_CONTENT_CLASS} .${Consts.PROGRESS_PANEL_CLASS}`);

        assert.strictEqual(progressDrawer.length, 1, 'notification drawer is rendered');
        assert.strictEqual(progressPanel.length, 1, 'progress panel is rendered');
        assert.strictEqual(progressPanel.find(`.${Consts.SCROLLABLE_ClASS}`).length, 1, 'progress panel has scrollView');

        const progressPanelContainer = progressPanel.find(`.${Consts.PROGRESS_PANEL_CONTAINER_CLASS}`);

        assert.strictEqual(progressPanelContainer.length, 1, 'progress panel container is in touch');
        assert.strictEqual(progressPanelContainer.children().length, 2, 'progress panel container has two children');
        assert.ok(progressPanelContainer.children().eq(0).hasClass(Consts.PROGRESS_PANEL_TITLE_CLASS), 'progress panel has title');
        assert.ok(progressPanelContainer.children().eq(1).hasClass(Consts.PROGRESS_PANEL_INFOS_CONTAINER_CLASS), 'progress panel has content');

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

    test('details view render', function(assert) {
        prepareFileManager(this, false, {
            itemView: {
                mode: 'details'
            }
        });

        const $headers = this.wrapper.getDetailsColumnsHeaders();

        let indexOffset = 0;
        if(isDesktopDevice()) {
            assert.strictEqual($headers.length, 6, 'column headres number is correct');
            assert.ok($headers.eq(0).hasClass('dx-command-select'), 'selection header is rendered');
            indexOffset = 1;
        } else {
            assert.strictEqual($headers.length, 5, 'column headres number is correct');
        }
        assert.ok($headers.eq(indexOffset).hasClass('dx-filemanager-details-item-is-directory'), 'thumbnail header is rendered');
        assert.strictEqual($headers.eq(indexOffset + 1).text(), 'Name', 'name header is rendered');
        assert.strictEqual($headers.eq(indexOffset + 2).text(), 'Date Modified', 'modified header is rendered');
        assert.strictEqual($headers.eq(indexOffset + 3).text(), 'File Size', 'size header is rendered');
        assert.ok($headers.eq(indexOffset + 4).hasClass('dx-command-adaptive'), 'adaptivity header is rendered');

    });

    test('details view must has ScrollView', function(assert) {
        prepareFileManager(this, false, {
            itemView: {
                mode: 'details'
            }
        });

        if(!windowUtils.hasWindow()) {
            assert.ok(true, 'only if there is a window');
            return;
        }

        assert.ok(this.wrapper.getDetailsViewScrollable().length);
    });

    test('thumbnails view items render', function(assert) {
        prepareFileManager(this);

        const $item = this.wrapper.findThumbnailsItem('Folder 1');
        const $itemContent = $item.children(`.${Consts.THUMBNAILS_ITEM_CONTENT_CLASS}`);

        assert.strictEqual($itemContent.length, 1, 'item has content');
        assert.strictEqual($itemContent.children().length, 3, 'item content has three subitems');

        assert.ok($itemContent.children().eq(0).hasClass('dx-icon-folder'), 'item has icon');
        assert.ok($itemContent.children().eq(0).hasClass(Consts.THUMBNAILS_ITEM_THUMBNAIL_CLASS), 'item icon has specific class');
        assert.ok($itemContent.children().eq(1).hasClass(Consts.THUMBNAILS_ITEM_SPACER_CLASS), 'item has spacer');
        assert.ok($itemContent.children().eq(2).hasClass(Consts.THUMBNAILS_ITEM_NAME_CLASS), 'item name');
    });

    test('thumbnails view must has ScrollView', function(assert) {
        prepareFileManager(this);
        assert.ok(this.wrapper.getThumbnailsViewScrollable().length);
    });

    test('customize thumbnail', function(assert) {
        let counter = 0;

        prepareFileManager(this, false, {
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

        prepareFileManager(this, false, {
            fileSystemProvider: fileSystem,
            itemView: {
                mode: 'details'
            },
            width: 600
        });

        const $node = this.wrapper.getFolderNode(2);
        const $text = $node.find('.dx-filemanager-dirs-tree-item-text');
        const $button = $node.find('.dx-filemanager-file-actions-button');
        let textBottom = 0;
        if(!windowUtils.hasWindow()) {
            textBottom = $text[0].offsetTop + $text[0].clientHeight;
        } else {
            textBottom = $text.position().top + $text.height();
        }
        const buttonTop = $button[0].offsetTop;
        assert.ok(buttonTop < textBottom, 'text and button on the same line');
    });

});
