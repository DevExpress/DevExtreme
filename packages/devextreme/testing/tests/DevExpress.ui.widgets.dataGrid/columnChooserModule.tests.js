import 'generic_light.css!';
import 'ui/data_grid';

import $ from 'jquery';
import typeUtils from 'core/utils/type';
import supportUtils from 'core/utils/support';
import devices from '__internal/core/m_devices';
import themes from 'ui/themes';
import dataGridMocks from '../../helpers/dataGridMocks.js';
import publicComponentUtils from 'core/utils/public_component';
import messageLocalization from 'common/core/localization/message';
import { TreeViewSearchBoxWrapper } from '../../helpers/wrappers/searchBoxWrappers.js';

const device = devices.real();

QUnit.testStart(function() {
    const markup =
        '<div id="container" class="dx-datagrid"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('Column chooser', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        this.columns = [];
        this.options = {
            columnChooser: {
                enabled: true,
                width: 300,
                height: 350,
                search: {
                    enabled: false,
                    editorOptions: {},
                    timeout: 500
                },
                selection: {
                    allowSelectAll: false,
                    recursive: false,
                    selectItemByClick: false,
                }
            }
        };

        dataGridMocks.setupDataGridModules(this, ['columns', 'data', 'columnChooser', 'headerPanel', 'editing'], {
            initViews: true,
            controllers: {
                columns: new dataGridMocks.MockColumnsController(this.columns),
                data: new dataGridMocks.MockDataController({ items: [] })
            }
        });

        this.setTestElement = function($rootElement) {
            const $element = $('<div />').appendTo($rootElement);
            this.columnChooserView._$element = $element;
            this.columnChooserView._$parent = $rootElement;
        };

        this.renderColumnChooser = function() {
            this.columnChooserView.showColumnChooser();
            this.columnChooserView.hideColumnChooser();
            this.clock.tick(1000);
        };

        this.columnChooserView._$element = $('#container');
    },
    afterEach: function() {
        this.clock.restore();
        this.columnChooserView.hideColumnChooser();
    }
}, () => {

    QUnit.test('Bounding rect of groupPanel when panel is not visible', function(assert) {
        // arrange
        const testElement = $('#container');
        this.setTestElement(testElement);

        // act
        this.renderColumnChooser();

        // assert
        assert.equal(this.columnChooserView.getBoundingRect(), null, 'Bounding rect is null when column chooser is not visible');
    });

    QUnit.test('Bounding rect of groupPanel', function(assert) {
        // arrange
        const testElement = $('#container');

        this.setTestElement(testElement);

        // act
        this.columnChooserView.showColumnChooser();
        this.clock.tick(1000);

        // assert
        const boundingRect = this.columnChooserView.getBoundingRect();
        const isBoundingCorrect = typeUtils.isObject(boundingRect) && typeUtils.isDefined(boundingRect.top) && typeUtils.isDefined(boundingRect.bottom)
        && typeUtils.isDefined(boundingRect.right) && typeUtils.isDefined(boundingRect.left);

        assert.ok(isBoundingCorrect, 'Bounding rect return object with "top", "bottom", "left" and "right" properties when column chooser is visible');
    });

    QUnit.test('Draw column chooser (dragAndDrop mode)', function(assert) {
        // arrange
        const testElement = $('#container');

        this.options.columnChooser.emptyPanelText = 'Test';
        this.setTestElement(testElement);

        // act
        this.renderColumnChooser();
        this.columnChooserView._popupContainer.option('visible', true);
        this.clock.tick(10);
        const $overlayWrapper = this.columnChooserView._popupContainer.$wrapper();

        // assert
        assert.ok($overlayWrapper.hasClass('dx-datagrid-column-chooser'), 'has column chooser');
        assert.ok($overlayWrapper.hasClass('dx-datagrid-column-chooser-mode-drag'), 'has dragAndDrop mode class');
        assert.ok(!$overlayWrapper.hasClass('dx-datagrid-column-chooser-mode-select'), 'hasn\'t select mode class');
        assert.ok($overlayWrapper.find('.dx-empty-message').length, 'has message');
        assert.strictEqual($overlayWrapper.find('.dx-empty-message').text(), 'Test', 'text message');
    });

    QUnit.test('Draw column chooser (select mode)', function(assert) {
        // arrange
        const testElement = $('#container');

        this.options.columnChooser.mode = 'select';
        this.setTestElement(testElement);

        // act
        this.renderColumnChooser();
        this.columnChooserView._popupContainer.option('visible', true);
        this.clock.tick(10);
        const $overlayWrapper = this.columnChooserView._popupContainer.$wrapper();

        // assert
        assert.ok($overlayWrapper.hasClass('dx-datagrid-column-chooser'), 'has column chooser');
        assert.ok(!$overlayWrapper.hasClass('dx-datagrid-column-chooser-mode-drag'), 'hasn\'t dragAndDrop mode class');
        assert.ok($overlayWrapper.hasClass('dx-datagrid-column-chooser-mode-select'), 'has select mode class');
        assert.ok($overlayWrapper.find('.dx-treeview').length, 'has treeview in column chooser');
        assert.ok(!$overlayWrapper.find('.dx-column-chooser-message').length, 'hasn\'t message');
    });

    QUnit.test('Draw column chooser with hidden columns (dragAndDrop mode)', function(assert) {
        // arrange
        const testElement = $('#container');
        const columnChooserView = this.columnChooserView;

        $.extend(this.columns, [{ caption: 'Column 1', visible: true }, { caption: 'Column 2', visible: false, showInColumnChooser: true }, { caption: 'Column 3', visible: false, showInColumnChooser: false }]);
        this.setTestElement(testElement);

        // act
        this.renderColumnChooser();

        // assert
        assert.ok(testElement.find('.dx-datagrid-column-chooser'), 'has column chooser');
        assert.ok(!$('body').children('.dx-datagrid-column-chooser').length, 'doesn\'t have wrapper column chooser');

        // act
        columnChooserView._popupContainer.option('visible', true);

        // assert
        const columnChooser = $('body').children('.dx-datagrid-column-chooser');
        assert.ok(columnChooser.length, 'have wrapper column chooser');
        assert.ok(columnChooser.find('.dx-overlay-content').first().is(':visible'), 'visible column chooser');
        assert.ok(columnChooser.find('.dx-popup-content').length, 'has popup content');
        assert.equal(columnChooser.find('.dx-popup-content').first().find('.dx-column-chooser-item').length, 1, 'count items');
        assert.strictEqual(columnChooser.find('.dx-popup-content').first().find('.dx-column-chooser-item').first().text(), 'Column 2', 'text item 1');
    });

    QUnit.test('Draw column chooser with hidden columns (select mode)', function(assert) {
        // arrange
        const testElement = $('#container');
        const columnChooserView = this.columnChooserView;

        this.options.columnChooser.mode = 'select';
        $.extend(this.columns, [{ caption: 'Column 1', index: 0, visible: true }, { caption: 'Column 2', index: 1, visible: false, showInColumnChooser: true }, { caption: 'Column 3', index: 2, visible: false, showInColumnChooser: false }, { caption: 'Column 4', index: 3, visible: true }]);
        this.setTestElement(testElement);

        // act
        this.renderColumnChooser();

        columnChooserView._popupContainer.option('visible', true);

        // assert
        const $columnChooser = $('body').children('.dx-datagrid-column-chooser');
        const treeView = $columnChooser.find('.dx-treeview').dxTreeView('instance');

        const items = treeView.option('items');
        assert.ok($columnChooser.length, 'have wrapper column chooser');
        assert.ok(treeView, 'column chooser has dxTreeView');
        assert.equal(items.length, 3, 'treeView has 3 items');
        assert.ok(items[0].selected, 'selected first item');
        assert.ok(!items[1].selected, 'selected second item');
        assert.ok(items[2].selected, 'selected third item');
    });

    QUnit.test('Draw column chooser with columns.allowHiding == false (select mode)', function(assert) {
        // arrange
        const testElement = $('#container');
        const columnChooserView = this.columnChooserView;

        this.options.columnChooser.mode = 'select';
        $.extend(this.columns, [{ caption: 'Column 1', index: 0, visible: true, allowHiding: false }, { caption: 'Column 2', index: 1, visible: false }]);
        this.setTestElement(testElement);

        // act
        this.renderColumnChooser();

        columnChooserView._popupContainer.option('visible', true);

        // assert
        const $columnChooser = $('body').children('.dx-datagrid-column-chooser');
        const treeView = $columnChooser.find('.dx-treeview').dxTreeView('instance');

        const items = treeView.option('items');
        const $checkBoxElements = columnChooserView._popupContainer.$content().find('.dx-checkbox');

        assert.ok($columnChooser.length, 'have wrapper column chooser');
        assert.ok(treeView, 'column chooser has dxTreeView');
        assert.equal(items.length, 2, 'treeView has 2 items');

        assert.ok(items[0].selected, '1st item selected');
        assert.ok(items[0].disabled, '1st item is disabled');
        assert.ok($checkBoxElements.eq(0).hasClass('dx-state-disabled'), '1st item\'s checkbox disabled');

        assert.notOk(items[1].selected, '2nd item not selected');
        assert.notOk(items[1].disabled, '2st item enabled');
        assert.notOk($checkBoxElements.eq(1).hasClass('dx-state-disabled'), '2nd item\'s checkbox enabled');
    });

    QUnit.test('Hide column chooser when is visible true', function(assert) {
        // arrange
        const testElement = $('#container');
        this.setTestElement(testElement);

        this.renderColumnChooser();

        // assert
        assert.ok(testElement.find('.dx-datagrid-column-chooser').length, 'has column chooser');
        assert.ok(!$('body').children('.dx-datagrid-column-chooser').length, 'doesn\'t have wrapper column chooser');

        // act
        this.columnChooserView._popupContainer.option('visible', true);

        // assert
        const columnChooser = $('body').children('.dx-datagrid-column-chooser');
        assert.ok(columnChooser.length, 'have wrapper column chooser');
        assert.ok(columnChooser.find('.dx-overlay-content').first().is(':visible'), 'visible column chooser');

        // act
        columnChooser.find('.dx-closebutton').first().trigger('dxclick'); // hide
        this.clock.tick(500);

        // assert
        assert.ok(!$('body').children('.dx-datagrid-column-chooser').length, 'doesn\'t have wrapper column chooser');
    });

    QUnit.test('Hide column via column chooser (select mode)', function(assert) {
        // arrange
        const testElement = $('#container');

        this.options.columnChooser.mode = 'select';
        $.extend(this.columns, [{ caption: 'Column 1', index: 0, visible: true }, { caption: 'Column 2', index: 1, visible: false, showInColumnChooser: true }, { caption: 'Column 3', index: 2, visible: false, showInColumnChooser: false }, { caption: 'Column 4', index: 3, visible: true }]);
        this.setTestElement(testElement);

        this.renderColumnChooser();

        // act
        this.columnChooserView._popupContainer.option('visible', true);

        const $columnChooser = $('body').children('.dx-datagrid-column-chooser');
        const $treeViewItem = $columnChooser.find('.dx-checkbox').first();

        // act
        $($treeViewItem).trigger('dxclick');
        this.clock.tick(500);

        // assert
        assert.deepEqual(this.columns[0], { caption: 'Column 1', index: 0, visible: false }, 'First column is hidden now');
    });

    QUnit.test('Show column via column chooser (select mode)', function(assert) {
        // arrange
        const testElement = $('#container');

        this.options.columnChooser.mode = 'select';
        $.extend(this.columns, [{ caption: 'Column 1', index: 0, visible: false }, { caption: 'Column 2', index: 1, visible: false, showInColumnChooser: true }, { caption: 'Column 3', index: 2, visible: false, showInColumnChooser: false }, { caption: 'Column 4', index: 3, visible: true }]);
        this.setTestElement(testElement);

        this.renderColumnChooser();

        // act
        this.columnChooserView._popupContainer.option('visible', true);

        const $columnChooser = $('body').children('.dx-datagrid-column-chooser');
        const $treeViewItem = $columnChooser.find('.dx-checkbox').first();

        // act
        $($treeViewItem).trigger('dxclick');
        this.clock.tick(500);

        // assert
        assert.deepEqual(this.columns[0], { caption: 'Column 1', index: 0, visible: true }, 'First column is hidden now');
    });

    QUnit.test('Rendering show column chooser button in headerPanel', function(assert) {
        // arrange
        const testElement = $('#container');
        this.setTestElement(testElement);

        this.options.editing = { allowAdding: true };
        // this.columnChooserView.render(testElement);

        // act
        this.renderColumnChooser();
        this.headerPanel.render(testElement);
        this.clock.tick(1000);

        // assert
        assert.ok(testElement.find('.dx-datagrid-column-chooser').length, 'has column chooser');
        assert.ok(!$('body').children('.dx-datagrid-column-chooser').length, 'doesn\'t have wrapper column chooser');

        const $toolbarButtons = testElement.find('.dx-datagrid-toolbar-button');

        assert.equal($toolbarButtons.length, 2, 'there are 2 buttons in toolbar');
        assert.ok($toolbarButtons.eq(1).hasClass('dx-datagrid-column-chooser-button'), 'second button is column chooser');

        // T1109671
        assert.equal($toolbarButtons.eq(1).attr('aria-haspopup'), 'dialog', 'column chooser button has aria-haspopup="dialog" attribute');

        // T102389
        assert.ok($toolbarButtons.eq(0).hasClass('dx-edit-button'), 'first element is edit (insert) button');
    });

    QUnit.test('Show column chooser by pressing the button', function(assert) {
        // arrange
        const testElement = $('#container');
        this.setTestElement(testElement);

        this.renderColumnChooser();

        this.clock.tick(1000);
        this.columnChooserController.renderShowColumnChooserButton(testElement);

        // assert
        assert.ok(testElement.find('.dx-datagrid-column-chooser-button').length, 'has column chooser button');
        assert.ok(testElement.find('.dx-datagrid-column-chooser').length, 'has column chooser');
        assert.ok(!$('body').children('.dx-datagrid-column-chooser').length, 'doesn\'t have wrapper column chooser');

        // act
        testElement.find('.dx-datagrid-column-chooser-button').trigger('dxclick'); // show

        // assert
        const columnChooser = $('body').children('.dx-datagrid-column-chooser');
        assert.ok(columnChooser.length, 'have wrapper column chooser');
        assert.ok(columnChooser.find('.dx-overlay-content').first().is(':visible'), 'visible column chooser');
    });

    QUnit.test('Get column elements', function(assert) {
        // arrange
        const testElement = $('#container');
        const columnChooserView = this.columnChooserView;

        $.extend(this.columns, [
            { caption: 'Column 1', visible: true, index: 0 },
            { caption: 'Column 2', visible: false, showInColumnChooser: true, index: 1 },
            { caption: 'Column 3', visible: false, showInColumnChooser: true, index: 2 }
        ]);
        this.setTestElement(testElement);

        this.renderColumnChooser();

        // assert
        assert.ok(testElement.find('.dx-datagrid-column-chooser'.length), 'has column chooser');
        assert.ok(!$('body').children('.dx-datagrid-column-chooser').length, 'doesn\'t have wrapper column chooser');

        columnChooserView._popupContainer.option('visible', true);

        // assert
        const columnChooser = $('body').children('.dx-datagrid-column-chooser');
        assert.ok(columnChooser.length, 'have wrapper column chooser');
        assert.ok(columnChooser.find('.dx-overlay-content').first().is(':visible'), 'visible column chooser');

        // act
        const columnHiddenElements = columnChooserView.getColumnElements();

        // assert
        assert.equal(columnHiddenElements.length, 2, 'count hidden elements');
        assert.strictEqual(columnHiddenElements.eq(0).text(), 'Column 2', 'text hidden element 1');
        assert.strictEqual(columnHiddenElements.eq(1).text(), 'Column 3', 'text hidden element 2');
    });

    // B255428
    QUnit.test('Get bounding rect', function(assert) {
        // arrange
        const testElement = $('#container');
        const columnChooserView = this.columnChooserView;
        this.setTestElement(testElement);

        this.columnChooserView.showColumnChooser();
        this.clock.tick(1000);

        // act
        const boundingRect = columnChooserView.getBoundingRect();

        // assert
        assert.equal(boundingRect.right - boundingRect.left, this.options.columnChooser.width, 'width columnChooser');
        assert.equal(boundingRect.bottom - boundingRect.top, this.options.columnChooser.height, 'height columnChooser');
    });

    QUnit.test('Get bounding rect when column chooser not visible', function(assert) {
        // arrange
        const testElement = $('#container');
        const columnChooserView = this.columnChooserView;

        this.setTestElement(testElement);

        this.renderColumnChooser();

        // act
        const boundingRect = columnChooserView.getBoundingRect();

        // assert
        assert.equal(boundingRect, null, 'boundingRect null');
    });

    QUnit.test('Get bounding rect when column chooser not enabled', function(assert) {
        // arrange
        const testElement = $('#container');
        const columnChooserView = this.columnChooserView;

        this.setTestElement(testElement);

        this.options.columnChooser = {
            enabled: false
        };

        this.renderColumnChooser();

        // act
        const boundingRect = columnChooserView.getBoundingRect();

        // assert
        assert.equal(boundingRect, null, 'boundingRect null');
    });

    QUnit.test('rtlEnabled option set class to an overlay content', function(assert) {
        const testElement = $('#container');

        this.setTestElement(testElement);

        this.options.rtlEnabled = true;

        this._createComponent = function(element, name, config) {
            config.rtlEnabled = true;

            name = typeof name === 'string' ? name : publicComponentUtils.name(name);
            const $element = $(element)[name](config || {});
            return $element[name]('instance');
        };

        this.columnChooserView.showColumnChooser();
        this.columnChooserView.hideColumnChooser();

        this.clock.tick(1000);

        assert.ok(testElement.find('.dx-popup-content').first().hasClass('dx-rtl'), 'popup content has dx-rtl class when \'rtlEnabled\' option is true');
    });

    QUnit.test('Redraw column chooser with rtlEnabled (changed options)', function(assert) {
        // arrange
        const testElement = $('#container');
        const columnChooserView = this.columnChooserView;

        this.setTestElement(testElement);

        this.options.rtlEnabled = false;

        // act
        this.renderColumnChooser();

        assert.ok(!testElement.find('.dx-overlay-content').first().hasClass('dx-rtl'), 'overlay content hasn\'t dx-rtl class');

        this.options.rtlEnabled = true;

        columnChooserView._initializePopupContainer();
        this.renderColumnChooser();
        assert.ok(testElement.find('.dx-overlay-content').first().hasClass('dx-rtl'), 'overlay content has dx-rtl class when \'rtlEnabled\' option is true');
    });

    QUnit.test('Column chooser is draggable', function(assert) {
        // arrange
        const testElement = $('#container');

        // act
        this.setTestElement(testElement);
        this.renderColumnChooser();

        // assert
        const columnChooserContainer = this.columnChooserView._popupContainer;
        assert.ok(columnChooserContainer.option('dragEnabled'), 'Column chooser is draggable');
    });

    QUnit.test('Enable search', function(assert) {
        const testElement = $('#container');

        this.setTestElement(testElement);

        this.options.columnChooser.search.enabled = true;
        this.options.columnChooser.search.timeout = 300;

        // act
        this.renderColumnChooser();
        this.columnChooserView._popupContainer.option('visible', true);
        this.clock.tick(10);
        const $overlayWrapper = this.columnChooserView._popupContainer.$wrapper();

        // assert
        const treeView = $overlayWrapper.find('.dx-treeview').dxTreeView('instance');
        assert.ok(treeView.option('searchEnabled'));
        assert.equal(treeView.option('searchTimeout'), 300, 'search timeout is assigned');
    });

    QUnit.test('Test aria-label in search-box input (T829760)', function(assert) {
        const searchBoxWrapper = new TreeViewSearchBoxWrapper('.dx-datagrid-column-chooser');

        this.setTestElement($('#container'));

        this.options.columnChooser.search.enabled = true;

        // act
        this.renderColumnChooser();
        this.columnChooserView._popupContainer.option('visible', true);
        this.clock.tick(10);

        // assert
        assert.strictEqual(searchBoxWrapper.getEditorInput().attr('aria-label'), messageLocalization.format('Search'), 'Search box input aria-label attribute');
    });

    if(device.deviceType === 'desktop') {
        QUnit.test('Close and cancel buttons for generic theme', function(assert) {
            // arrange
            const testElement = $('#container');
            const columnChooserView = this.columnChooserView;

            this.setTestElement(testElement);

            // act
            this.renderColumnChooser();
            columnChooserView._popupContainer.toggle(true);

            // assert
            assert.ok($('.dx-closebutton').length, 'closebutton is shown');
            assert.ok(!$('.dx-button-text').length, 'cancel button is hidden');
        });
    }

    QUnit.test('Close and cancel buttons for mobile theme', function(assert) {
        // arrange
        const testElement = $('#container');
        const origIsGeneric = themes.isGeneric;
        const columnChooserView = this.columnChooserView;

        this.setTestElement(testElement);

        themes.isGeneric = function() { return false; };

        // act
        this.renderColumnChooser();
        columnChooserView._popupContainer.toggle(true);

        // assert
        assert.ok(!$('.dx-closebutton').length, 'close button is hidden');
        assert.ok($('.dx-button-text').length, 'cancel button is shown');
        themes.isGeneric = origIsGeneric;
    });


    QUnit.test('Close and cancel buttons for material theme', function(assert) {
        // arrange
        const testElement = $('#container');
        const origIsMaterial = themes.isMaterial;
        const columnChooserView = this.columnChooserView;

        this.setTestElement(testElement);

        themes.isMaterial = function() { return true; };

        // act
        this.renderColumnChooser();
        columnChooserView._popupContainer.toggle(true);

        // assert
        assert.ok($('.dx-closebutton').length, 'close button is shown');
        assert.ok(!$('.dx-button-text').length, 'cancel button is hidden');

        themes.isMaterial = origIsMaterial;
    });

    QUnit.test('Show column chooser via api method when it is disabled_T102451', function(assert) {
        // arrange
        const testElement = $('#container');
        const columnChooserView = this.columnChooserView;

        this.setTestElement(testElement);

        this.options.columnChooser = {
            enabled: false
        };

        this.renderColumnChooser();

        // act
        columnChooserView.showColumnChooser();

        // assert
        assert.ok(columnChooserView._popupContainer);
        assert.ok(columnChooserView._isPopupContainerShown, 'Column chooser is shown');
    });

    QUnit.test('Popup window is not initialized when enabled is false_T102451', function(assert) {
        // arrange
        const testElement = $('#container');
        const columnChooserView = this.columnChooserView;

        this.setTestElement(testElement);

        this.options.columnChooser = {
            enabled: false
        };

        columnChooserView.render(testElement);

        // assert
        assert.ok(!columnChooserView._popupContainer);
        assert.ok(!columnChooserView._isPopupContainerShown);
    });

    // T117339
    QUnit.test('Not allow dragging when no visible column chooser', function(assert) {
        // arrange
        const testElement = $('#container');
        const columnChooserView = this.columnChooserView;

        this.setTestElement(testElement);

        this.renderColumnChooser();

        // act, assert
        assert.ok(!columnChooserView.allowDragging({ allowHiding: true }), 'not allow dragging');
    });

    // T117339
    QUnit.test('Not allow dragging when allowHiding in column false', function(assert) {
        // arrange
        const testElement = $('#container');
        const columnChooserView = this.columnChooserView;

        this.setTestElement(testElement);

        this.renderColumnChooser();

        columnChooserView._popupContainer.option('visible', true);

        // act, assert
        assert.ok(!columnChooserView.allowDragging({ allowHiding: false }), 'not allow dragging');
    });

    // T117339
    QUnit.test('Allow dragging when visible column chooser', function(assert) {
        // arrange
        const testElement = $('#container');
        const columnChooserView = this.columnChooserView;

        this.setTestElement(testElement);

        this.renderColumnChooser();

        columnChooserView._popupContainer.option('visible', true);

        // act, assert
        assert.ok(columnChooserView.allowDragging({ allowHiding: true }), 'allow dragging');
    });

    QUnit.test('Allow dragging with visible band column', function(assert) {
        // arrange
        const $testElement = $('#container');
        const columnChooserView = this.columnChooserView;

        this.setTestElement($testElement);

        this.renderColumnChooser();

        columnChooserView._popupContainer.option('visible', true);

        // act, assert
        assert.ok(columnChooserView.allowDragging({ allowHiding: true, visible: false }, 'columnChooser'), 'allow dragging');
    });

    QUnit.test('Not allow dragging with hidden band column', function(assert) {
        // arrange
        const $testElement = $('#container');
        const columnChooserView = this.columnChooserView;

        this.setTestElement($testElement);

        this.renderColumnChooser();

        columnChooserView._columnsController.isParentColumnVisible = function() {
            return false;
        };
        columnChooserView._popupContainer.option('visible', true);

        // act, assert
        assert.ok(!columnChooserView.allowDragging({ allowHiding: true, visible: false }, 'columnChooser'), 'not allow dragging');
    });

    QUnit.test('CheckBox mode - not update treeview when selected items', function(assert) {
        // arrange
        const $testElement = $('#container');
        let callRenderColumnChooser;
        const columnChooserView = this.columnChooserView;

        this.options.columnChooser.mode = 'select';
        $.extend(this.columns, [{ caption: 'Column 1', index: 0, visible: true, showInColumnChooser: true }, { caption: 'Column 2', index: 1, visible: true, showInColumnChooser: true }]);
        this.setTestElement($testElement);

        this.renderColumnChooser();
        columnChooserView._columnsController.columnOption = function(columnIndex, optionName, value) {
            if(!typeUtils.isDefined(value)) {
                return;
            }

            assert.strictEqual(optionName, 'visible', 'option name is \'visible\'');

            // assert
            if(columnIndex === 0) {
                assert.notOk(value, 'first column is hidden');
            } else {
                assert.ok(value, 'second column is visible');
            }

            this.columnsChanged.fire({ optionNames: {}, changeTypes: {} });
        };
        columnChooserView._popupContainer.option('visible', true);
        columnChooserView._renderColumnChooserList = function() {
            callRenderColumnChooser = true;
        };

        // act
        $('body').children('.dx-datagrid-column-chooser').find('.dx-checkbox').first().trigger('dxclick');
        this.clock.tick(500);

        // assert
        assert.ok(!callRenderColumnChooser, 'not update treeview');
    });

    QUnit.test('CheckBox mode - update treeview items when changed the column option is showInColumnChooser', function(assert) {
        // arrange
        const $testElement = $('#container');
        let callRenderColumnChooser;
        const columnChooserView = this.columnChooserView;

        this.options.columnChooser.mode = 'select';
        $.extend(this.columns, [{ caption: 'Column 1', index: 0, visible: true, showInColumnChooser: false }, { caption: 'Column 2', index: 1, visible: true, showInColumnChooser: true }]);
        this.setTestElement($testElement);

        this.renderColumnChooser();
        columnChooserView._popupContainer.option('visible', true);
        columnChooserView._updateItems = function() {
            callRenderColumnChooser = true;
        };

        // act
        columnChooserView._columnsController.columnsChanged.fire({ columnIndices: [0], optionNames: { showInColumnChooser: true } });

        // assert
        assert.ok(callRenderColumnChooser, 'update treeview items');
    });

    QUnit.test('CheckBox mode - column chooser with hidden band column', function(assert) {
        // arrange
        const $testElement = $('#container');
        const columnChooserView = this.columnChooserView;

        this.options.columnChooser.mode = 'select';
        $.extend(this.columns, [{ caption: 'Band Column', index: 0, visible: false, showInColumnChooser: true }, { caption: 'Column 1', index: 1, visible: true, showInColumnChooser: true, ownerBand: 0 }, { caption: 'Column 2', index: 2, visible: false, showInColumnChooser: true, ownerBand: 0 }]);
        this.setTestElement($testElement);

        columnChooserView._columnsController.isParentColumnVisible = function() {
            return false;
        };

        // act
        this.renderColumnChooser();
        columnChooserView._popupContainer.option('visible', true);

        // assert
        const $checkBoxElements = columnChooserView._popupContainer.$content().find('.dx-checkbox');
        assert.equal($checkBoxElements.length, 3, 'count checkbox');
        assert.ok(!$checkBoxElements.eq(0).hasClass('dx-checkbox-checked'), 'checkbox isn\'t checked');
        assert.ok($checkBoxElements.eq(1).hasClass('dx-checkbox-checked'), 'checkbox is checked');
        assert.ok(!$checkBoxElements.eq(2).hasClass('dx-checkbox-checked'), 'checkbox is checked');
    });

    QUnit.test('CheckBox mode - check hidden band column', function(assert) {
        // arrange
        const $testElement = $('#container');
        const columnChooserView = this.columnChooserView;

        this.options.columnChooser.mode = 'select';
        $.extend(this.columns, [
            { caption: 'Band Column', index: 0, visible: false, showInColumnChooser: true },
            { caption: 'Column 1', index: 1, visible: true, showInColumnChooser: true, ownerBand: 0 },
            { caption: 'Column 2', index: 2, visible: false, showInColumnChooser: true, ownerBand: 0 }
        ]);
        this.setTestElement($testElement);

        // act
        this.renderColumnChooser();

        columnChooserView._popupContainer.option('visible', true);

        $(columnChooserView._popupContainer.$content().find('.dx-checkbox').first()).trigger('dxclick');

        // assert
        const $checkBoxElements = columnChooserView._popupContainer.$content().find('.dx-checkbox');
        assert.equal($checkBoxElements.length, 3, 'count checkbox');
        assert.ok($checkBoxElements.eq(0).hasClass('dx-checkbox-checked'), 'checkbox is checked');
        assert.ok($checkBoxElements.eq(1).hasClass('dx-checkbox-checked'), 'checkbox is checked');
        assert.notOk($checkBoxElements.eq(2).hasClass('dx-checkbox-checked'), 'checkbox isn\'t checked');
    });

    QUnit.test('CheckBox mode - Update a selection state when column visibility is changed via API', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.options.columnChooser.mode = 'select';
        $.extend(this.columns, [{ caption: 'Column 1', index: 0, visible: true, showInColumnChooser: true }, { caption: 'Column 2', index: 1, visible: true, showInColumnChooser: true }]);
        this.setTestElement($testElement);

        sinon.spy(this.columnChooserView, '_renderTreeView');

        // act
        this.columnChooserView.showColumnChooser();
        this.clock.tick(1000);

        assert.strictEqual(this.columnChooserView._renderTreeView.callCount, 1, 'treeview is rendered');


        this.columnsController.columnOption(0, 'visible', false);
        this.columnsController.columnsChanged.fire({
            columnIndex: 0,
            optionNames: {
                visible: true,
                length: 1
            }
        });

        // assert
        const $checkboxes = $('.dx-datagrid-column-chooser-list').find('.dx-treeview-item-with-checkbox');

        assert.equal($checkboxes.eq(0).attr('aria-selected'), 'false', 'first checkbox is not selected'); // T868198
        assert.equal($checkboxes.eq(1).attr('aria-selected'), 'true', 'second checkbox is selected');

        assert.ok(!this.columnChooserView._columnChooserList.getNodes()[0].selected, 'first item is not selected');
        assert.strictEqual(this.columnChooserView._renderTreeView.callCount, 1, 'treeview is not rerendered'); // T726413

        this.columnChooserView.hideColumnChooser();
    });

    // T880276
    QUnit.test('Column chooser should not scroll up after item selection', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.options.columnChooser.mode = 'select';

        const columns = [];
        for(let i = 0; i < 20; i++) {
            columns.push({ caption: `Column ${i + 1}`, index: i, visible: true, showInColumnChooser: true });
        }

        $.extend(this.columns, columns);
        this.setTestElement($testElement);

        sinon.spy(this.columnChooserView, '_renderTreeView');

        // act
        this.columnChooserView.showColumnChooser();
        this.clock.tick(1000);

        // assert
        assert.strictEqual(this.columnChooserView._renderTreeView.callCount, 1, 'treeview is rendered');

        // act
        const $scrollable = $('.dx-datagrid-column-chooser-mode-select').find('.dx-scrollable-container');
        $scrollable.scrollTop(360);

        this.columnsController.columnOption(0, 'visible', false);
        this.columnsController.columnsChanged.fire({
            columnIndex: 0,
            optionNames: {
                visible: true,
                length: 1
            }
        });

        // assert
        const $checkboxes = $('.dx-datagrid-column-chooser-list').find('.dx-treeview-item-with-checkbox');

        assert.equal($checkboxes.eq(0).attr('aria-selected'), 'false', 'first checkbox is not selected'); // T868198

        assert.equal($scrollable.scrollTop(), 360, 'scrollTop');

        this.columnChooserView.hideColumnChooser();
    });

    ['select', 'dragAndDrop'].forEach(mode => {
        const modeName = (mode === 'select' ? 'CheckBox' : 'T739323: DragAndDrop');
        QUnit.test(modeName + ' mode - scroll position after selecting an last item', function(assert) {
            // arrange
            let scrollableInstance;
            const $testElement = $('#container');

            this.options.columnChooser.mode = mode;
            this.options.columnChooser.height = 200;
            this.columns.push(
                { caption: 'Column 1', index: 0, visible: false, showInColumnChooser: true },
                { caption: 'Column 2', index: 1, visible: false, showInColumnChooser: true },
                { caption: 'Column 3', index: 2, visible: false, showInColumnChooser: true },
                { caption: 'Column 4', index: 3, visible: false, showInColumnChooser: true },
                { caption: 'Column 5', index: 4, visible: false, showInColumnChooser: true },
                { caption: 'Column 6', index: 5, visible: false, showInColumnChooser: true },
                { caption: 'Column 7', index: 6, visible: false, showInColumnChooser: true },
                { caption: 'Column 8', index: 7, visible: false, showInColumnChooser: true }
            );

            this.setTestElement($testElement);
            this.columnChooserView.showColumnChooser();
            this.clock.tick(1000);

            const $columnChooser = $('body').children('.dx-datagrid-column-chooser');
            const $lastItemElement = $columnChooser.find('.dx-treeview-item').last();
            scrollableInstance = $columnChooser.find('.dx-scrollable').dxScrollable('instance');
            scrollableInstance.scrollToElement($lastItemElement);

            // act
            this.columnsController.columnOption(7, 'visible', true);
            this.columnChooserView.render($testElement, 'full');

            // assert
            scrollableInstance = $columnChooser.find('.dx-scrollable').dxScrollable('instance');
            assert.ok(scrollableInstance.scrollTop() > 0, 'scroll position');
        });
    });


    // T535738
    QUnit.test('CheckBox mode - update treeview items when changing the column options', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.options.columnChooser.mode = 'select';
        $.extend(this.columns, [{ caption: 'Column 1', index: 0, visible: true }, { caption: 'Column 2', index: 1, visible: true }]);
        this.setTestElement($testElement);

        this.showColumnChooser();
        this.clock.tick(1000);

        sinon.spy(this.columnChooserView, '_updateItems');

        // act
        this.columnsController.columnsChanged.fire({ optionNames: { all: true }, columnIndices: [0, 1], changeTypes: { columns: true } });

        // assert
        assert.strictEqual(this.columnChooserView._updateItems.callCount, 1, 'update treeview item');
    });


    // T571469
    QUnit.test('Filter value should be reset after disabled search', function(assert) {
        // arrange
        const $testElement = $('#container');

        $.extend(this.columns, [
            { caption: 'Column 1', index: 0, visible: false },
            { caption: 'Column 2', index: 1, visible: false }
        ]);
        this.options.columnChooser.search.enabled = true;
        this.setTestElement($testElement);
        this.renderColumnChooser();

        const popupInstance = this.columnChooserView._popupContainer;
        popupInstance.option('visible', true);
        this.clock.tick(10);

        // assert
        assert.strictEqual($(popupInstance.content()).find('.dx-column-chooser-item').length, 2, 'hidden column count');

        // arrange
        const treeViewInstance = this.columnChooserView._columnChooserList;
        treeViewInstance.option('searchValue', 'test');

        // assert
        assert.strictEqual($(popupInstance.content()).find('.dx-column-chooser-item').length, 0, 'hidden column count');

        // act
        this.option('columnChooser.search.enabled', false);

        // assert
        assert.strictEqual($(popupInstance.content()).find('.dx-column-chooser-item').length, 2, 'hidden column count');
    });

    // T595315
    QUnit.test('Change width and height after first rendering', function(assert) {
        // arrange
        const $testElement = $('#container');

        this.setTestElement($testElement);
        this.renderColumnChooser();
        const popupInstance = this.columnChooserView._popupContainer;

        // asert
        assert.strictEqual(popupInstance.option('width'), 300, 'default width');
        assert.strictEqual(popupInstance.option('height'), 350, 'default height');

        // act
        this.option('columnChooser.width', 500);
        this.option('columnChooser.height', 600);

        // asert
        assert.strictEqual(popupInstance.option('width'), 500, 'changed width');
        assert.strictEqual(popupInstance.option('height'), 600, 'changed height');
    });

    // T907091
    [true, false].forEach(useBeginEndUpdate => {
        QUnit.test(`ColumnChooser's item captions should be updated if column captions were changed (${useBeginEndUpdate ? 'with' : 'without'} optimization)`, function(assert) {
            // arrange
            const $testElement = $('#container');

            this.options.columnChooser.mode = 'select';
            $.extend(this.columns, [
                { caption: 'Column 1', index: 0, visible: true, showInColumnChooser: true },
                { caption: 'Column 2', index: 1, visible: true, showInColumnChooser: true }
            ]);
            this.setTestElement($testElement);

            sinon.spy(this.columnChooserView, '_renderTreeView');

            // act
            this.columnChooserView.showColumnChooser();
            this.clock.tick(1000);

            // assert
            assert.strictEqual(this.columnChooserView._renderTreeView.callCount, 1, 'treeview is rendered');

            // arrange
            sinon.spy(this.columnChooserView, '_updateItems');

            // act
            const optionNames = {
                caption: true,
                length: 1
            };

            if(useBeginEndUpdate) {
                this.beginUpdate();
                for(let i = 0; i < 2; i++) {
                    this.columnsController.columnOption(i, 'caption', 'new caption');
                }
                this.endUpdate();
                this.columnsController.columnsChanged.fire({
                    optionNames,
                    columnIndices: [0, 1]
                });
            } else {
                for(let i = 0; i < 2; i++) {
                    this.columnsController.columnOption(i, 'caption', 'new caption');
                    this.columnsController.columnsChanged.fire({
                        optionNames,
                        columnIndex: i
                    });
                }
            }

            // assert
            const $treeViewItems = $('.dx-treeview-item');

            assert.strictEqual(this.columnChooserView._renderTreeView.callCount, 1, 'treeview rendered only one time');
            assert.strictEqual(this.columnChooserView._updateItems.callCount, useBeginEndUpdate ? 1 : 2, 'treeview items update count');
            assert.equal($treeViewItems.eq(0).text(), 'new caption', 'caption was changed');
            assert.equal($treeViewItems.eq(1).text(), 'new caption', 'caption was changed');

            this.columnChooserView.hideColumnChooser();
        });
    });

    ['showInColumnChooser', 'caption', 'allowHiding', 'visible', 'cssClass', 'ownerBand'].forEach(optionName => {
        QUnit.test(`ColumnChooser should update items when column option '${optionName}' was changed`, function(assert) {
            // arrange
            const $testElement = $('#container');

            this.options.columnChooser.mode = 'select';
            $.extend(this.columns, [{ caption: 'Column 1', index: 0, visible: true, showInColumnChooser: true }]);

            this.setTestElement($testElement);

            // act
            this.columnChooserView.showColumnChooser();

            // arrange
            sinon.spy(this.columnChooserView, '_updateItemsSelection');
            sinon.spy(this.columnChooserView, '_updateItems');

            // act
            this.columnsController.columnsChanged.fire({
                columnIndex: 0,
                optionNames: { [optionName]: true, length: 1 },
            });

            assert.strictEqual(this.columnChooserView._updateItemsSelection.callCount, 1, 'update selection state');
            assert.strictEqual(this.columnChooserView._updateItems.callCount, optionName === 'visible' ? 0 : 1, 'treeview items update count');

            this.columnChooserView.hideColumnChooser();
        });
    });

    QUnit.test('ColumnChooser should not update items if column was hidden via chooser', function(assert) {
        // arrange
        const $testElement = $('#container');
        $.extend(this.columns, [
            { caption: 'Column 1', index: 0, visible: true, showInColumnChooser: true },
        ]);
        this.options.columnChooser.mode = 'select';

        this.setTestElement($testElement);

        // act
        this.columnChooserView.showColumnChooser();

        // arrange
        let updateItemSelectionCalled = false;
        let updateItemsCalled = false;

        this.columnChooserView._updateItemSelection = () => updateItemSelectionCalled = true;
        this.columnChooserView._updateItems = () => updateItemsCalled = true;

        this.columnChooserView._columnsController.columnOption = function(columnIndex, optionName, value) {
            if(optionName === 'visible' && !typeUtils.isDefined(value)) {
                return;
            }

            this.columnsChanged.fire({ columnIndex, optionNames: { visible: true } });
        };

        // act
        const treeView = $('.dx-treeview').dxTreeView('instance');

        treeView.unselectItem(0);

        this.clock.tick(500);

        assert.notOk(updateItemSelectionCalled, 'updateItemSelection called');
        assert.notOk(updateItemsCalled, 'updateItems called');

        this.columnChooserView.hideColumnChooser();
    });
});

