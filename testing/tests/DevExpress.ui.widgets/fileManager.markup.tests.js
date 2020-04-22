import $ from 'jquery';
import 'ui/file_manager';
import 'common.css!';
import { FileManagerWrapper, createTestFileSystem, Consts } from '../../helpers/fileManagerHelpers.js';

QUnit.testStart(function() {
    const markup =
        '<div id="fileManager"></div>';

    $('#qunit-fixture').html(markup);
});

const moduleConfig = {
    beforeEach: function() {
        this.items = createTestFileSystem();
        this.$element = $('#fileManager').dxFileManager();
        this.wrapper = new FileManagerWrapper(this.$element);
    },
    afterEach: function() {
        this.$element.remove();
    }
};

QUnit.module('rendering', moduleConfig, () => {
    QUnit.test('base elements should be rendered correctly', function(assert) {
        assert.ok(this.$element.hasClass(Consts.WIDGET_CLASS), 'element has a widget-specific class');

        const progressDrawer = this.wrapper.getProgressDrawer();
        assert.strictEqual(progressDrawer.length, 1, 'notification drawer is rendered');
        assert.strictEqual(progressDrawer.find(`.${Consts.DRAWER_PANEL_CONTENT_CLASS} > .${Consts.PROGRESS_PANEL_CLASS}`).length, 1, 'progress panel is rendered');

        const widgetWrapper = progressDrawer.find(`.${Consts.DRAWER_CONTENT_CLASS} > .${Consts.WIDGET_WRAPPER_CLASS}`);
        assert.strictEqual(widgetWrapper.length, 1, 'widget wrapper is rendered');
        assert.ok(widgetWrapper.children(`.${Consts.TOOLBAR_CLASS}`).hasClass(Consts.GENERAL_TOOLBAR_CLASS), 'general toolbar is rendered');
        assert.strictEqual(widgetWrapper.find(`.${Consts.CONTAINER_CLASS}`).length, 1, 'widget container is rendered');

        const dirPanel = widgetWrapper.find(`.${Consts.CONTAINER_CLASS} .${Consts.DRAWER_PANEL_CONTENT_CLASS} > .${Consts.DIRS_PANEL_CLASS}`);
        const splitterWrapper = widgetWrapper.find(`.${Consts.CONTAINER_CLASS} .${Consts.DRAWER_PANEL_CONTENT_CLASS} > .${Consts.SPLITTER_WRAPPER_CLASS}`);
        const itemsView = widgetWrapper.find(`.${Consts.CONTAINER_CLASS} .${Consts.DRAWER_CONTENT_CLASS} .${Consts.ITEMS_VIEW_CLASS}`);
        assert.strictEqual(dirPanel.length, 1, 'folders view is rendered');
        assert.strictEqual(splitterWrapper.length, 1, 'splitter wrapper is rendered');
        assert.strictEqual(splitterWrapper.find(`.${Consts.SPLITTER_CLASS}`).length, 1, 'splitter is rendered');
        assert.strictEqual(itemsView.length, 1, 'items view is rendered');
    });

});
