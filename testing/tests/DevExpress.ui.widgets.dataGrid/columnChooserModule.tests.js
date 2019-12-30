import 'common.css!';
import 'generic_light.css!';
import 'ui/data_grid/ui.data_grid';

import $ from 'jquery';
import typeUtils from 'core/utils/type';
import devices from 'core/devices';
import themes from 'ui/themes';
import dataGridMocks from '../../helpers/dataGridMocks.js';
import publicComponentUtils from 'core/utils/public_component';
import messageLocalization from 'localization/message';
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
                height: 350
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
});

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
    let boundingRect;
    let isBoundingCorrect;

    this.setTestElement(testElement);

    // act
    this.columnChooserView.showColumnChooser();
    this.clock.tick(1000);

    // assert
    boundingRect = this.columnChooserView.getBoundingRect();
    isBoundingCorrect = typeUtils.isObject(boundingRect) && typeUtils.isDefined(boundingRect.top) && typeUtils.isDefined(boundingRect.bottom)
        && typeUtils.isDefined(boundingRect.right) && typeUtils.isDefined(boundingRect.left);

    assert.ok(isBoundingCorrect, 'Bounding rect return object with "top", "bottom", "left" and "right" properties when column chooser is visible');
});

QUnit.test('Draw column chooser (dragAndDrop mode)', function(assert) {
    // arrange
    const testElement = $('#container');
    let $overlayWrapper;

    this.options.columnChooser.emptyPanelText = 'Test';
    this.setTestElement(testElement);

    // act
    this.renderColumnChooser();
    this.columnChooserView._popupContainer.option('visible', true);
    this.clock.tick();
    $overlayWrapper = this.columnChooserView._popupContainer._wrapper();

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
    let $overlayWrapper;

    this.options.columnChooser.mode = 'select';
    this.setTestElement(testElement);

    // act
    this.renderColumnChooser();
    this.columnChooserView._popupContainer.option('visible', true);
    this.clock.tick();
    $overlayWrapper = this.columnChooserView._popupContainer._wrapper();

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
    let columnChooser;

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
    columnChooser = $('body').children('.dx-datagrid-column-chooser');
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
    let $columnChooser;
    let items;
    let treeView;

    this.options.columnChooser.mode = 'select';
    $.extend(this.columns, [{ caption: 'Column 1', index: 0, visible: true }, { caption: 'Column 2', index: 1, visible: false, showInColumnChooser: true }, { caption: 'Column 3', index: 2, visible: false, showInColumnChooser: false }, { caption: 'Column 4', index: 3, visible: true }]);
    this.setTestElement(testElement);

    // act
    this.renderColumnChooser();

    columnChooserView._popupContainer.option('visible', true);

    // assert
    $columnChooser = $('body').children('.dx-datagrid-column-chooser');
    treeView = $columnChooser.find('.dx-treeview').dxTreeView('instance');

    items = treeView.option('items');
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
    let $columnChooser;
    let items;
    let treeView;
    let $checkBoxElements;

    this.options.columnChooser.mode = 'select';
    $.extend(this.columns, [{ caption: 'Column 1', index: 0, visible: true, allowHiding: false }, { caption: 'Column 2', index: 1, visible: false }]);
    this.setTestElement(testElement);

    // act
    this.renderColumnChooser();

    columnChooserView._popupContainer.option('visible', true);

    // assert
    $columnChooser = $('body').children('.dx-datagrid-column-chooser');
    treeView = $columnChooser.find('.dx-treeview').dxTreeView('instance');

    items = treeView.option('items');
    $checkBoxElements = columnChooserView._popupContainer.$content().find('.dx-checkbox');

    assert.ok($columnChooser.length, 'have wrapper column chooser');
    assert.ok(treeView, 'column chooser has dxTreeView');
    assert.equal(items.length, 2, 'treeView has 2 items');

    assert.ok(items[0].selected, '1st item selected');
    assert.notOk(items[0].disabled, '1st item enabled');
    assert.ok($checkBoxElements.eq(0).hasClass('dx-state-disabled'), '1st item\'s checkbox disabled');

    assert.notOk(items[1].selected, '2nd item not selected');
    assert.notOk(items[1].disabled, '2st item enabled');
    assert.notOk($checkBoxElements.eq(1).hasClass('dx-state-disabled'), '2nd item\'s checkbox enabled');
});

QUnit.test('Hide column chooser when is visible true', function(assert) {
    // arrange
    const testElement = $('#container');
    let columnChooser;
    this.setTestElement(testElement);

    this.renderColumnChooser();

    // assert
    assert.ok(testElement.find('.dx-datagrid-column-chooser').length, 'has column chooser');
    assert.ok(!$('body').children('.dx-datagrid-column-chooser').length, 'doesn\'t have wrapper column chooser');

    // act
    this.columnChooserView._popupContainer.option('visible', true);

    // assert
    columnChooser = $('body').children('.dx-datagrid-column-chooser');
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
    let $columnChooser;
    let $treeViewItem;

    this.options.columnChooser.mode = 'select';
    $.extend(this.columns, [{ caption: 'Column 1', index: 0, visible: true }, { caption: 'Column 2', index: 1, visible: false, showInColumnChooser: true }, { caption: 'Column 3', index: 2, visible: false, showInColumnChooser: false }, { caption: 'Column 4', index: 3, visible: true }]);
    this.setTestElement(testElement);

    this.renderColumnChooser();

    // act
    this.columnChooserView._popupContainer.option('visible', true);

    $columnChooser = $('body').children('.dx-datagrid-column-chooser');
    $treeViewItem = $columnChooser.find('.dx-checkbox').first();

    // act
    $($treeViewItem).trigger('dxclick');
    this.clock.tick(500);

    // assert
    assert.deepEqual(this.columns[0], { caption: 'Column 1', index: 0, visible: false }, 'First column is hidden now');
});

QUnit.test('Prevent hiding the last column via column chooser when select mode is using', function(assert) {
    // arrange
    const testElement = $('#container');
    let $columnChooser;
    let $treeViewItem;

    this.options.columnChooser.mode = 'select';
    $.extend(this.columns, [{ caption: 'Column 1', index: 0, visible: true }]);
    this.setTestElement(testElement);

    this.renderColumnChooser();

    // act
    this.columnChooserView._popupContainer.option('visible', true);

    $columnChooser = $('body').children('.dx-datagrid-column-chooser');
    $treeViewItem = $columnChooser.find('.dx-checkbox').first();

    // act
    $($treeViewItem).trigger('dxclick');
    this.clock.tick(500);

    // assert
    assert.deepEqual(this.columns[0], { caption: 'Column 1', index: 0, visible: true }, 'First column is stay visible');
    assert.ok($columnChooser.find('.dx-checkbox').first().hasClass('dx-checkbox-checked'), 'The treeview\'s checkbox is stay checked');
});

QUnit.test('Show column via column chooser (select mode)', function(assert) {
    // arrange
    const testElement = $('#container');
    let $columnChooser;
    let $treeViewItem;

    this.options.columnChooser.mode = 'select';
    $.extend(this.columns, [{ caption: 'Column 1', index: 0, visible: false }, { caption: 'Column 2', index: 1, visible: false, showInColumnChooser: true }, { caption: 'Column 3', index: 2, visible: false, showInColumnChooser: false }, { caption: 'Column 4', index: 3, visible: true }]);
    this.setTestElement(testElement);

    this.renderColumnChooser();

    // act
    this.columnChooserView._popupContainer.option('visible', true);

    $columnChooser = $('body').children('.dx-datagrid-column-chooser');
    $treeViewItem = $columnChooser.find('.dx-checkbox').first();

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

    // T102389
    assert.ok($toolbarButtons.eq(0).hasClass('dx-edit-button'), 'first element is edit (insert) button');
});

QUnit.test('Show column chooser by pressing the button', function(assert) {
    // arrange
    const testElement = $('#container');
    let columnChooser;
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
    columnChooser = $('body').children('.dx-datagrid-column-chooser');
    assert.ok(columnChooser.length, 'have wrapper column chooser');
    assert.ok(columnChooser.find('.dx-overlay-content').first().is(':visible'), 'visible column chooser');
});

QUnit.test('Get column elements', function(assert) {
    // arrange
    const testElement = $('#container');
    const columnChooserView = this.columnChooserView;
    let columnChooser;
    let columnHiddenElements;

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
    columnChooser = $('body').children('.dx-datagrid-column-chooser');
    assert.ok(columnChooser.length, 'have wrapper column chooser');
    assert.ok(columnChooser.find('.dx-overlay-content').first().is(':visible'), 'visible column chooser');

    // act
    columnHiddenElements = columnChooserView.getColumnElements();

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
    let boundingRect;
    this.setTestElement(testElement);

    this.columnChooserView.showColumnChooser();
    this.clock.tick(1000);

    // act
    boundingRect = columnChooserView.getBoundingRect();

    // assert
    assert.equal(boundingRect.right - boundingRect.left, this.options.columnChooser.width, 'width columnChooser');
    assert.equal(boundingRect.bottom - boundingRect.top, this.options.columnChooser.height, 'height columnChooser');
});

QUnit.test('Get bounding rect when column chooser not visible', function(assert) {
    // arrange
    const testElement = $('#container');
    const columnChooserView = this.columnChooserView;
    let boundingRect;

    this.setTestElement(testElement);

    this.renderColumnChooser();

    // act
    boundingRect = columnChooserView.getBoundingRect();

    // assert
    assert.equal(boundingRect, null, 'boundingRect null');
});

QUnit.test('Get bounding rect when column chooser not enabled', function(assert) {
    // arrange
    const testElement = $('#container');
    const columnChooserView = this.columnChooserView;
    let boundingRect;

    this.setTestElement(testElement);

    this.options.columnChooser = {
        enabled: false
    };

    this.renderColumnChooser();

    // act
    boundingRect = columnChooserView.getBoundingRect();

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
    let columnChooserContainer;

    // act
    this.setTestElement(testElement);
    this.renderColumnChooser();

    // assert
    columnChooserContainer = this.columnChooserView._popupContainer;
    assert.ok(columnChooserContainer.option('dragEnabled'), 'Column chooser is draggable');
});

QUnit.test('Enable search', function(assert) {
    const testElement = $('#container');
    let $overlayWrapper;
    let treeView;

    this.setTestElement(testElement);

    this.options.columnChooser.allowSearch = true;
    this.options.columnChooser.searchTimeout = 300;

    // act
    this.renderColumnChooser();
    this.columnChooserView._popupContainer.option('visible', true);
    this.clock.tick();
    $overlayWrapper = this.columnChooserView._popupContainer._wrapper();

    // assert
    treeView = $overlayWrapper.find('.dx-treeview').dxTreeView('instance');
    assert.ok(treeView.option('searchEnabled'));
    assert.equal(treeView.option('searchTimeout'), 300, 'search timeout is assigned');
});

QUnit.test('Test aria-label in search-box input (T829760)', function(assert) {
    const searchBoxWrapper = new TreeViewSearchBoxWrapper('.dx-datagrid-column-chooser');

    this.setTestElement($('#container'));

    this.options.columnChooser.allowSearch = true;

    // act
    this.renderColumnChooser();
    this.columnChooserView._popupContainer.option('visible', true);
    this.clock.tick();

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


QUnit.test('Add non touch class when column chooser is shown on win phone', function(assert) {
    // arrange
    const testElement = $('#container');

    this.setTestElement(testElement);

    this.columnChooserView._isWinDevice = function() {
        return true;
    };

    this.renderColumnChooser();

    this.clock.tick(1000);
    this.columnChooserController.renderShowColumnChooserButton(testElement);
    testElement.find('.dx-datagrid-column-chooser-button').trigger('dxclick'); // show

    assert.ok($(document.body).hasClass('dx-datagrid-notouch-action'), 'no touch css class');
});

// QUnit.test("Use simulated scrolling on win phone", function(assert) {
//    // arrange
//    var testElement = $("#container");
//
//    this.setTestElement(testElement);
//
//    this.columnChooserView._isWinDevice = function() {
//        return true;
//    };
//
//    this.renderColumnChooser();
//
//    this.clock.tick(1000);
//    this.columnChooserController.renderShowColumnChooserButton(testElement);
//    testElement.find(".dx-datagrid-column-chooser-button").trigger("dxclick"); // show
//
//    var treeView = $(".dx-datagrid-column-chooser-list").first().dxTreeView("instance");
//
//    assert.ok(!treeView.option("useNativeScrolling"), "use simulated scrolling");
// });
//
// QUnit.test("Use simulated scrolling is not force enabled on not win phone", function(assert) {
//    // arrange
//    var testElement = $("#container"),
//        supportNativeScrolling = supportUtils.nativeScrolling;
//
//    supportUtils.nativeScrolling = true;
//    this.columnChooserView._isWinDevice = function() {
//        return false;
//    };
//
//    this.setTestElement(testElement);
//
//    this.renderColumnChooser();
//
//    this.clock.tick(1000);
//    this.columnChooserController.renderShowColumnChooserButton(testElement);
//    testElement.find(".dx-datagrid-column-chooser-button").trigger("dxclick"); // show
//
//    var treeView = $(".dx-datagrid-column-chooser-list").first().dxTreeView("instance");
//
//    assert.equal(treeView.option("useNativeScrolling"), true, "use native scrolling");
//    supportUtils.nativeScrolling = supportNativeScrolling;
// });

QUnit.test('Non touch class is not added when column chooser is shown on not win phone', function(assert) {
    // arrange
    $(document.body).removeClass('dx-datagrid-notouch-action');

    const testElement = $('#container');

    this.setTestElement(testElement);

    this.columnChooserView._isWinDevice = function() {
        return false;
    };

    this.renderColumnChooser();

    this.clock.tick(1000);
    this.columnChooserController.renderShowColumnChooserButton(testElement);
    testElement.find('.dx-datagrid-column-chooser-button').trigger('dxclick'); // show

    assert.ok(!$(document.body).hasClass('dx-datagrid-notouch-action'), 'no touch css class');
});

QUnit.test('Remove non touch class when column chooser is hidden on win phone', function(assert) {
    // arrange
    const testElement = $('#container');
    let columnChooser;

    this.setTestElement(testElement);

    this.columnChooserView._isWinDevice = function() {
        return true;
    };

    this.renderColumnChooser();

    this.clock.tick(1000);
    this.columnChooserController.renderShowColumnChooserButton(testElement);
    testElement.find('.dx-datagrid-column-chooser-button').trigger('dxclick'); // show

    columnChooser = $('body').children('.dx-datagrid-column-chooser');
    columnChooser.find('.dx-closebutton').first().trigger('dxclick'); // hide
    this.clock.tick(500);

    // act
    assert.notOk($(document.body).hasClass('dx-datagrid-notouch-action'), 'no touch css class');
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

        // assert
        assert.equal(columnIndex, 0, 'column index');
        assert.strictEqual(optionName, 'visible', 'option name is \'visible\'');
        assert.ok(!value, 'value of the option');
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

QUnit.test('CheckBox mode - update treeview when changed the column option is showInColumnChooser', function(assert) {
    // arrange
    const $testElement = $('#container');
    let callRenderColumnChooser;
    const columnChooserView = this.columnChooserView;

    this.options.columnChooser.mode = 'select';
    $.extend(this.columns, [{ caption: 'Column 1', index: 0, visible: true, showInColumnChooser: true }, { caption: 'Column 2', index: 1, visible: true, showInColumnChooser: true }]);
    this.setTestElement($testElement);

    this.renderColumnChooser();
    columnChooserView._popupContainer.option('visible', true);
    columnChooserView._renderTreeView = function() {
        callRenderColumnChooser = true;
    };

    // act
    columnChooserView._columnsController.columnsChanged.fire({ optionNames: { showInColumnChooser: true } });

    // assert
    assert.ok(callRenderColumnChooser, 'not update treeview');
});

QUnit.test('CheckBox mode - column chooser with hidden band column', function(assert) {
    // arrange
    const $testElement = $('#container');
    let $checkBoxElements;
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
    $checkBoxElements = columnChooserView._popupContainer.$content().find('.dx-checkbox');
    assert.equal($checkBoxElements.length, 3, 'count checkbox');
    assert.ok(!$checkBoxElements.eq(0).hasClass('dx-checkbox-checked'), 'checkbox isn\'t checked');
    assert.ok($checkBoxElements.eq(1).hasClass('dx-checkbox-checked'), 'checkbox is checked');
    assert.ok(!$checkBoxElements.eq(2).hasClass('dx-checkbox-checked'), 'checkbox is checked');
});

QUnit.test('CheckBox mode - check hidden band column', function(assert) {
    // arrange
    const that = this;
    const $testElement = $('#container');
    let $checkBoxElements;
    const columnChooserView = this.columnChooserView;

    this.options.columnChooser.mode = 'select';
    $.extend(this.columns, [{ caption: 'Band Column', index: 0, visible: false, showInColumnChooser: true }, { caption: 'Column 1', index: 1, visible: true, showInColumnChooser: true, ownerBand: 0 }, { caption: 'Column 2', index: 2, visible: false, showInColumnChooser: true, ownerBand: 0 }]);
    this.setTestElement($testElement);

    columnChooserView._columnsController.isParentColumnVisible = function(columnIndex) {
        return that.columns[0].visible;
    };

    // act
    this.renderColumnChooser();
    columnChooserView._popupContainer.option('visible', true);

    $(columnChooserView._popupContainer.$content().find('.dx-checkbox').first()).trigger('dxclick');


    // assert
    $checkBoxElements = columnChooserView._popupContainer.$content().find('.dx-checkbox');
    assert.equal($checkBoxElements.length, 3, 'count checkbox');
    assert.ok($checkBoxElements.eq(0).hasClass('dx-checkbox-checked'), 'checkbox is checked');
    assert.ok($checkBoxElements.eq(1).hasClass('dx-checkbox-checked'), 'checkbox is checked');
    assert.ok(!$checkBoxElements.eq(2).hasClass('dx-checkbox-checked'), 'checkbox isn\'t checked');
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
    assert.ok(!this.columnChooserView._columnChooserList.getNodes()[0].selected, 'first item is not selected');
    assert.strictEqual(this.columnChooserView._renderTreeView.callCount, 1, 'treeview is not rerendered'); // T726413

    this.columnChooserView.hideColumnChooser();
});

['select', 'dragAndDrop'].forEach(mode => {
    const modeName = (mode === 'select' ? 'CheckBox' : 'T739323: DragAndDrop');
    QUnit.test(modeName + ' mode - scroll position after selecting an last item', function(assert) {
        // arrange
        let $columnChooser;
        let $lastItemElement;
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

        $columnChooser = $('body').children('.dx-datagrid-column-chooser');
        $lastItemElement = $columnChooser.find('.dx-treeview-item').last();
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
QUnit.test('CheckBox mode - update treeview when changing the column options', function(assert) {
    // arrange
    const $testElement = $('#container');

    this.options.columnChooser.mode = 'select';
    $.extend(this.columns, [{ caption: 'Column 1', index: 0, visible: true }, { caption: 'Column 2', index: 1, visible: true }]);
    this.setTestElement($testElement);

    this.showColumnChooser();
    this.clock.tick(1000);

    sinon.spy(this.columnChooserView, '_renderTreeView');

    // act
    this.columnsController.columnsChanged.fire({ optionNames: { all: true }, changeTypes: { columns: true } });

    // assert
    assert.strictEqual(this.columnChooserView._renderTreeView.callCount, 1, 'update treeview');
});


// T571469
QUnit.test('Filter value should be reset after disabled search', function(assert) {
    // arrange
    const $testElement = $('#container');
    let popupInstance;
    let treeViewInstance;

    $.extend(this.columns, [
        { caption: 'Column 1', index: 0, visible: false },
        { caption: 'Column 2', index: 1, visible: false }
    ]);
    this.options.columnChooser.allowSearch = true;
    this.setTestElement($testElement);
    this.renderColumnChooser();

    popupInstance = this.columnChooserView._popupContainer;
    popupInstance.option('visible', true);
    this.clock.tick();

    // assert
    assert.strictEqual($(popupInstance.content()).find('.dx-column-chooser-item').length, 2, 'hidden column count');

    // arrange
    treeViewInstance = this.columnChooserView._columnChooserList;
    treeViewInstance.option('searchValue', 'test');

    // assert
    assert.strictEqual($(popupInstance.content()).find('.dx-column-chooser-item').length, 0, 'hidden column count');

    // act
    this.options.columnChooser.allowSearch = false;
    this.columnChooserView.optionChanged({ name: 'columnChooser' });

    // assert
    assert.strictEqual($(popupInstance.content()).find('.dx-column-chooser-item').length, 2, 'hidden column count');
});

// T595315
QUnit.test('Change width and height after first rendering', function(assert) {
    // arrange
    let popupInstance;
    const $testElement = $('#container');

    this.setTestElement($testElement);
    this.renderColumnChooser();
    popupInstance = this.columnChooserView._popupContainer;

    // asert
    assert.strictEqual(popupInstance.option('width'), 300, 'default width');
    assert.strictEqual(popupInstance.option('height'), 350, 'default height');

    // act
    this.options.columnChooser.width = 500;
    this.options.columnChooser.height = 600;
    this.columnChooserView.optionChanged({ name: 'columnChooser' });

    // asert
    assert.strictEqual(popupInstance.option('width'), 500, 'changed width');
    assert.strictEqual(popupInstance.option('height'), 600, 'changed height');
});
