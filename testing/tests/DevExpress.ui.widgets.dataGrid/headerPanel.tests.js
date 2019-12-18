QUnit.testStart(function() {
    var markup =
'<div>\
    <div id="container"  class="dx-datagrid"></div>\
</div>';

    $('#qunit-fixture').html(markup);
});


import 'common.css!';

import 'ui/data_grid/ui.data_grid';

import $ from 'jquery';
import { setupDataGridModules, MockDataController, MockColumnsController } from '../../helpers/dataGridMocks.js';
import devices from 'core/devices';
import typeUtils from 'core/utils/type';

QUnit.module('Header panel', {
    beforeEach: function() {
        this.columns = [{ caption: 'Column 1', visible: true }, { caption: 'Column 2', visible: true }];

        setupDataGridModules(this, ['data', 'columns', 'headerPanel', 'grouping', 'search', 'editorFactory', 'sorting'], {
            initViews: true,
            controllers: {
                columns: new MockColumnsController(this.columns),
                data: new MockDataController({
                    pageCount: 1,
                    pageIndex: 0,
                    rows: [{ values: ['', ''] }],
                    component: this
                })
            }
        });

        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
        this.dispose();
    }
});

QUnit.test('Draw searchPanel', function(assert) {
    // arrange
    var headerPanel = this.headerPanel,
        testElement = $('#container'),
        headerPanelElement,
        searchPanel;

    this.options.searchPanel = {
        visible: true,
        width: 160
    };
    // act

    headerPanel.render(testElement);

    // assert
    headerPanelElement = testElement.find('.dx-datagrid-header-panel');

    assert.ok(headerPanelElement.length);
    assert.ok(headerPanelElement.children().hasClass('dx-toolbar'), 'header panel contain dxToolbar');

    var input = testElement.find('input');

    searchPanel = testElement.find('.dx-datagrid-search-panel');
    assert.strictEqual(input.length, 1);
    assert.ok(searchPanel.length === 1);
    assert.equal(searchPanel.outerWidth(), 160, 'search panel width');
});

QUnit.test('Change search text', function(assert) {
    // arrange
    var headerPanel = this.headerPanel,
        testElement = $('#container'),
        input;

    this.options.searchPanel = {
        visible: true,
        width: 160
    };

    // act
    headerPanel.render(testElement);
    input = testElement.find('input');

    // assert
    assert.equal(input.val(), '');

    // act
    this.searchByText('Test');

    headerPanel.render();
    input = testElement.find('input');

    // assert
    assert.equal(input.val(), 'Test');
});

QUnit.test('Draw groupPanel without grouping', function(assert) {
    // arrange
    var headerPanel = this.headerPanel,
        testElement = $('#container'),
        headerPanelElement,
        groupPanel;

    this.options.groupPanel = {
        visible: true,
        emptyPanelText: 'Test',
        allowColumnDragging: true
    };

    // act
    headerPanel.render(testElement);
    headerPanel.resize();

    // assert
    headerPanelElement = testElement.find('.dx-datagrid-header-panel');
    assert.ok(headerPanelElement.length);
    groupPanel = headerPanelElement.find('.dx-datagrid-group-panel');
    assert.ok(groupPanel.length);
    assert.equal(groupPanel.length, 1);
    assert.ok(groupPanel.css('maxWidth'), 'Group panel has an max width');
    assert.equal(groupPanel.find('.dx-group-panel-message').text(), 'Test');
});

QUnit.test('Render groupPanel with visible="auto"', function(assert) {
    // arrange
    var headerPanel = this.headerPanel,
        testElement = $('#container'),
        headerPanelElement,
        groupPanel,
        countOfRenderedElements = devices.current().deviceType === 'desktop' ? 1 : 0;

    this.options.groupPanel = {
        visible: 'auto',
        emptyPanelText: 'Test',
        allowColumnDragging: true
    };

    // act
    headerPanel.render(testElement);
    headerPanel.resize();

    // assert
    headerPanelElement = testElement.find('.dx-datagrid-header-panel');
    assert.equal(headerPanelElement.length, countOfRenderedElements, 'Render on desktop only');

    groupPanel = headerPanelElement.find('.dx-datagrid-group-panel');
    assert.equal(groupPanel.length, countOfRenderedElements, 'Render on desktop only');
});

QUnit.test('Bounding rect of groupPanel when panel is not visible', function(assert) {
    // arrange
    var headerPanel = this.headerPanel,
        testElement = $('#container');

    this.options.groupPanel = {
        visible: false,
        emptyPanelText: 'Test',
        allowColumnDragging: true
    };

    // act
    headerPanel.render(testElement);
    headerPanel.resize();

    // assert
    assert.equal(headerPanel.getBoundingRect(), null, 'Bounding rect is null when it has no grouping zone');
});

QUnit.test('Bounding rect of groupPanel', function(assert) {
    // arrange
    var headerPanel = this.headerPanel,
        testElement = $('#container'),
        boundingRect,
        isBoundingCorrect;

    this.options.groupPanel = {
        visible: true,
        emptyPanelText: 'Test',
        allowColumnDragging: true
    };

    // act
    headerPanel.render(testElement);
    headerPanel.resize();

    // assert
    boundingRect = headerPanel.getBoundingRect();
    isBoundingCorrect = typeUtils.isObject(boundingRect) && typeUtils.isDefined(boundingRect.top) && typeUtils.isDefined(boundingRect.bottom);
    assert.ok(isBoundingCorrect, 'Bounding rect return object with "top" and "bottom" properties when grouping zone is visible');
});

QUnit.test('Group items with cssClass', function(assert) {
    // arrange
    var headerPanel = this.headerPanel,
        testElement = $('#container'),
        headerPanelElement,
        groupPanel;

    this.options.groupPanel = {
        visible: true
    };

    $.extend(this.columns[0], { cssClass: 'customCssClass', groupIndex: 0 });
    $.extend(this.columns[1], { groupIndex: 1 });

    // act
    headerPanel.render(testElement);
    headerPanel.resize();

    // assert
    headerPanelElement = testElement.find('.dx-datagrid-header-panel');
    assert.ok(headerPanelElement.length);
    groupPanel = headerPanelElement.find('.dx-datagrid-group-panel');
    assert.equal(groupPanel.length, 1);
    assert.ok(groupPanel.find('.dx-group-panel-item').first().hasClass('customCssClass'), 'has class customCssClass');
    assert.ok(!groupPanel.find('.dx-group-panel-item').last().hasClass('customCssClass'), 'not has class customCssClass');
});

QUnit.test('Draw groupPanel with grouping', function(assert) {
    // arrange

    var headerPanel = this.headerPanel,
        testElement = $('#container'),
        headerPanelElement,
        groupPanel,
        groupPanelItem,
        columns;

    $.extend(this.columns[0], { groupIndex: 0, allowSorting: true });

    this.options.groupPanel = {
        visible: true
    };

    // act
    headerPanel.render(testElement);
    headerPanel.resize();

    // assert
    headerPanelElement = testElement.find('.dx-datagrid-header-panel');
    assert.ok(headerPanelElement.length);
    groupPanel = headerPanelElement.find('.dx-datagrid-group-panel');
    assert.ok(groupPanel.length);
    assert.equal(groupPanel.length, 1);
    groupPanelItem = groupPanel.find('.dx-group-panel-item');
    assert.ok(groupPanelItem.length);
    assert.equal(groupPanelItem.find('.dx-column-indicators').css('float'), 'none', 'column indicators in group panel has no float style');

    columns = this.columnsController.getVisibleColumns();
    assert.equal(groupPanelItem.text(), columns[0].caption);
    assert.ok(groupPanelItem.find('.dx-sort').length);
});

QUnit.test('Group panel with sorting, check alignment', function(assert) {
    // arrange
    var headerPanel = this.headerPanel,
        testElement = $('#container');

    $.extend(this.columns[0], { groupIndex: 0, allowSorting: true, caption: 'test' });

    this.options.groupPanel = {
        visible: true
    };

    // act
    headerPanel.render(testElement);

    // assert
    var $groupPanelItemChildren = testElement.find('.dx-group-panel-item').contents();

    assert.equal($groupPanelItemChildren.length, 2, 'group panel item have 2 items');
    assert.ok($groupPanelItemChildren.eq(1).hasClass('dx-column-indicators'), 'indicators are after text in group panel');
});

QUnit.test('Group panel with sorting, height after change font size', function(assert) {
    // arrange
    var headerPanel = this.headerPanel,
        testElement = $('#container');

    $.extend(this.columns[0], { groupIndex: 0, allowSorting: true });

    this.options.groupPanel = {
        visible: true
    };

    headerPanel.render(testElement);

    var oldHeight = testElement.find('.dx-datagrid-group-panel').height();

    // act
    testElement.css('font-size', '10px');

    headerPanel.resize();

    // assert
    assert.ok(oldHeight > testElement.find('.dx-datagrid-group-panel').height(), 'sort indicator height changed');
});

QUnit.test('Draw header panel with group panel and search panel', function(assert) {
    // arrange
    var headerPanel = this.headerPanel,
        testElement = $('#container'),
        headerPanelElement,
        groupPanel,
        searchPanel;

    this.options.groupPanel = {
        visible: true
    };
    this.options.searchPanel = {
        visible: true
    };

    // act
    headerPanel.render(testElement);

    // assert
    headerPanelElement = testElement.find('.dx-datagrid-header-panel');
    assert.ok(headerPanelElement.length);
    assert.equal(headerPanelElement.outerWidth(), testElement.outerWidth());
    groupPanel = headerPanelElement.find('.dx-datagrid-group-panel');
    assert.ok(groupPanel.length);
    searchPanel = headerPanelElement.find('.dx-datagrid-search-panel');
    assert.ok(searchPanel.length);
});

QUnit.test('Not draw header panel without group panel and search panel', function(assert) {
    // arrange
    var headerPanel = this.headerPanel,
        testElement = $('#container');

    // act
    headerPanel.render(testElement);

    // assert
    assert.ok(!testElement.find('.dx-datagrid-header-panel').is(':visible'));
});

QUnit.test('Enter text in searchPanel', function(assert) {
    // arrange
    var headerPanel = this.headerPanel,
        testElement = $('#container'),
        searchPanel;

    this.options.searchPanel = {
        visible: true
    };

    // act
    headerPanel.render(testElement);

    // assert
    searchPanel = testElement.find('.dx-datagrid-search-panel');
    assert.ok(searchPanel.length === 1);
    searchPanel.dxTextBox('instance').option('value', '123');
    assert.equal(this.option('searchPanel.text'), '123');
});

QUnit.test('Draw searchPanel custom width', function(assert) {
    // arrange
    var headerPanel = this.headerPanel,
        testElement = $('#container'),
        searchPanel;

    this.options.searchPanel = {
        visible: true,
        width: 213
    };

    // act
    headerPanel.render(testElement);

    // assert
    var input = testElement.find('input');
    searchPanel = testElement.find('.dx-datagrid-search-panel');
    assert.strictEqual(input.length, 1);
    assert.ok(searchPanel.length === 1);
    assert.equal(searchPanel.outerWidth(), 213, 'default search panel width');
});

QUnit.test('Hide search panel', function(assert) {
    // arrange
    var headerPanel = this.headerPanel,
        container = $('#container'),
        $headerPanel;

    this.options.searchPanel = {
        visible: true
    };

    headerPanel.render(container);

    $headerPanel = container.find('.dx-datagrid-header-panel');
    assert.strictEqual($headerPanel.css('display'), 'block', 'header panel visible');

    // act
    this.options.searchPanel = {
        visible: false
    };

    headerPanel.render();

    // assert
    assert.strictEqual($headerPanel.css('display'), 'none', 'header panel hidden');
});

function updateSearchTextTest(assert, that, eventToTrigger) {
    // arrange
    var headerPanel = that.headerPanel,
        container = $('#container');

    that.options.searchPanel = {
        visible: true
    };

    headerPanel.render(container);

    var searchInput = container.find('.dx-texteditor');
    assert.equal(searchInput.length, 1);

    // act
    searchInput.find('input').val('910');
    searchInput.find('input').trigger(eventToTrigger);

    that.clock.tick(600);

    // assert
    assert.equal(that.option('searchPanel.text'), undefined);

    // act
    that.clock.tick(100);

    // assert
    assert.equal(that.option('searchPanel.text'), '910');
}

QUnit.test('update search text with timeout and keyup event', function(assert) {
    updateSearchTextTest(assert, this, 'keyup');
});

// T751914
QUnit.test('update search text with timeout and input event', function(assert) {
    updateSearchTextTest(assert, this, 'input');
});

// T117339
QUnit.test('Not allow dragging when no visible group panel', function(assert) {
    // arrange
    var headerPanel = this.headerPanel,
        testElement = $('#container');

    this.options.groupPanel = {
        visible: false,
        allowColumnDragging: false
    };

    headerPanel.render(testElement);

    // act, assert
    assert.ok(!headerPanel.allowDragging({ allowGrouping: true }), 'not allow dragging');
});

// T117339
QUnit.test('Not allow dragging when allowGrouping in column false', function(assert) {
    // arrange
    var headerPanel = this.headerPanel,
        testElement = $('#container');

    this.options.groupPanel = {
        visible: true,
        allowColumnDragging: true
    };

    headerPanel.render(testElement);

    // act, assert
    assert.ok(!headerPanel.allowDragging({ allowGrouping: false }), 'not allow dragging');
});

// T117339
QUnit.test('Allow dragging when visible group panel', function(assert) {
    // arrange
    var headerPanel = this.headerPanel,
        testElement = $('#container');

    this.options.groupPanel = {
        visible: true,
        allowColumnDragging: true
    };

    headerPanel.render(testElement);

    // act, assert
    assert.ok(headerPanel.allowDragging({ allowGrouping: true }), 'allow dragging');
});

QUnit.test('EmptyPanelText is displayed when allowColumnDragging is false', function(assert) {
    // arrange
    var headerPanel = this.headerPanel,
        testElement = $('#container');

    this.options.groupPanel = {
        visible: true,
        allowColumnDragging: false
    };

    // act
    headerPanel.render(testElement);

    // assert
    assert.ok(!testElement.find('.dx-group-panel-message').length);
});

QUnit.module('Draw buttons in header panel', {
    beforeEach: function() {
        setupDataGridModules(this, ['columns', 'data', 'headerPanel', 'editing', 'editorFactory', 'columnChooser'], {
            initViews: true,
            controllers: {
                columns: new MockColumnsController([]),
                data: new MockDataController({ items: [] })
            }
        });

        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
        this.dispose();
    }
});

QUnit.test('Draw add row button', function(assert) {
    // arrange
    var addRowButton,
        headerPanel = this.headerPanel,
        testElement = $('#container');

    this.options.editing = {
        allowAdding: true,
        texts: {
            addRow: 'Add row'
        }
    };

    // act
    headerPanel.render(testElement);
    addRowButton = testElement.find('.dx-datagrid-addrow-button');

    // assert
    assert.equal(addRowButton.length, 1, 'has add row button');
    assert.strictEqual(addRowButton.attr('title'), 'Add row', 'title button');
});

QUnit.test('Draw cancel and save buttons', function(assert) {
    // arrange
    var cancelButton,
        saveButton,
        headerPanel = this.headerPanel,
        testElement = $('#container');

    this.options.editing = {
        allowUpdating: true,
        mode: 'batch',
        texts: {
            cancelAllChanges: 'Cancel',
            saveAllChanges: 'Save'
        }
    };

    // act
    headerPanel.render(testElement);
    cancelButton = testElement.find('.dx-datagrid-cancel-button');
    saveButton = testElement.find('.dx-datagrid-save-button');

    // assert
    // cancel button
    assert.equal(cancelButton.length, 1, 'has cancel button');
    assert.ok(cancelButton.hasClass('dx-state-disabled'), 'disabled state is set to button');
    assert.strictEqual(cancelButton.attr('title'), 'Cancel', 'title button');
    // save button
    assert.equal(saveButton.length, 1, 'has save button');
    assert.strictEqual(saveButton.attr('title'), 'Save', 'title button');
});

QUnit.test('Draw show column chooser button', function(assert) {
    // arrange
    var showColumnChooserButton,
        headerPanel = this.headerPanel,
        testElement = $('#container');

    this.options.columnChooser = {
        enabled: true,
        title: 'Column chooser'
    };

    // act
    headerPanel.render(testElement);
    showColumnChooserButton = testElement.find('.dx-datagrid-column-chooser-button');

    // assert
    assert.equal(showColumnChooserButton.length, 1, 'has show column chooser button');
    assert.strictEqual(showColumnChooserButton.attr('title'), 'Column chooser', 'title button');
});

QUnit.test('Draw hidden show column chooser button', function(assert) {
    // arrange
    var headerPanel = this.headerPanel,
        testElement = $('#container').width(10);

    this.options.columnChooser = {
        enabled: true,
        title: 'Column chooser'
    };

    headerPanel._appendColumnChooserItem = function() {
        return [
            {
                widget: 'dxButton',
                options: {
                    text: 'Column chooser',
                    icon: 'back',
                    width: 50
                },
                showText: 'inMenu',
                location: 'after',
                name: 'columnChooser',
                locateInMenu: 'auto'
            }
        ];
    };

    // act
    headerPanel.render(testElement);

    var $columnChooserButton = testElement.find('.dx-toolbar .dx-toolbar-item:visible'),
        $toolbarMenuButton = $('.dx-toolbar .dx-dropdownmenu:visible');

    // assert
    assert.equal($toolbarMenuButton.length, 1, 'has shown toolbar menu button');
    assert.equal($columnChooserButton.length, 0, 'column chooser button is invisible');
});

QUnit.test('Add button via the onToolbarPreparing option', function(assert) {
    // arrange
    var $customButtonElement,
        callCountToolbarPreparing = 0,
        headerPanel = this.headerPanel,
        $testElement = $('#container');

    this.options.onToolbarPreparing = function(e) {
        // assert
        assert.equal(e.toolbarOptions.items.length, 0, 'count item');

        callCountToolbarPreparing++;

        e.toolbarOptions.items.push({
            widget: 'dxButton',
            options: {
                text: 'Custom button',
                icon: 'back',
                width: 50
            },
            location: 'after',
            locateInMenu: 'auto'
        });
    };

    // act
    headerPanel.init();
    headerPanel.render($testElement);
    $customButtonElement = $testElement.find('.dx-toolbar .dx-item');

    // assert
    assert.equal(callCountToolbarPreparing, 1, 'call count toolbar preparing');
    assert.equal($customButtonElement.length, 1, 'count button');
    assert.equal($customButtonElement.text(), 'Custom button', 'text of the custom button');
});

QUnit.test('Add button via the onToolbarPreparing option when there is column chooser button', function(assert) {
    // arrange
    var $customButtonElements,
        headerPanel = this.headerPanel,
        $testElement = $('#container');

    this.options.columnChooser = {
        enabled: true,
        title: 'Column chooser'
    };

    this.options.onToolbarPreparing = function(e) {
        // assert
        assert.equal(e.toolbarOptions.items.length, 1, 'count item');
        assert.equal(e.toolbarOptions.items[0].name, 'columnChooserButton', 'has column chooser button');

        e.toolbarOptions.items.push({
            template: function(data, index, container) {
                $('<div/>')
                    .addClass('custom-button')
                    .dxButton({
                        text: 'Custom Button',
                        width: 50
                    })
                    .appendTo(container);
            },
            location: 'before',
            locateInMenu: 'auto'
        });
    };

    // act
    headerPanel.init();
    headerPanel.render($testElement);
    $customButtonElements = $testElement.find('.dx-toolbar .dx-item .dx-button');

    // assert
    assert.equal($customButtonElements.length, 2, 'count button');
    assert.ok($customButtonElements.eq(0).hasClass('custom-button'), 'has custom button');
    assert.ok($customButtonElements.eq(1).hasClass('dx-datagrid-column-chooser-button'), 'has column chooser button');
});

QUnit.test('onToolbarPreparing - setting handler to the click event for column chooser button', function(assert) {
    // arrange
    var callCountClick = 0,
        $columnChooserButton,
        headerPanel = this.headerPanel,
        $testElement = $('#container');

    this.options.columnChooser = {
        enabled: true,
        title: 'Column chooser'
    };

    this.options.onToolbarPreparing = function(e) {
        // assert
        assert.equal(e.toolbarOptions.items[0].name, 'columnChooserButton', 'has column chooser button');

        e.toolbarOptions.items[0].options.onClick = function() {
            callCountClick++;
        };
    };

    headerPanel.init();
    headerPanel.render($testElement);

    // assert
    $columnChooserButton = $testElement.find('.dx-toolbar .dx-item .dx-button');
    assert.equal(callCountClick, 0, 'call count click');
    assert.equal($columnChooserButton.length, 1, 'count button');
    assert.ok($columnChooserButton.eq(0).hasClass('dx-datagrid-column-chooser-button'), 'has column chooser button');

    // act
    $columnChooserButton.trigger('dxclick');

    // assert
    assert.equal(callCountClick, 1, 'call count click');
});
