import 'generic_light.css!';

import 'ui/data_grid';

import $ from 'jquery';
import { setupDataGridModules, MockDataController, MockColumnsController } from '../../helpers/dataGridMocks.js';
import devices from '__internal/core/m_devices';
import typeUtils from 'core/utils/type';

QUnit.testStart(function() {
    const markup =
        `<div>
            <div id="container"  class="dx-datagrid"></div>
        </div>`;

    $('#qunit-fixture').html(markup);
});

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
}, () => {

    QUnit.test('Draw searchPanel', function(assert) {
        // arrange
        const headerPanel = this.headerPanel;
        const testElement = $('#container');

        this.options.searchPanel = {
            visible: true,
            width: 160
        };
        // act

        headerPanel.render(testElement);

        // assert
        const headerPanelElement = testElement.find('.dx-datagrid-header-panel');

        assert.ok(headerPanelElement.length);
        assert.ok(headerPanelElement.children().hasClass('dx-toolbar'), 'header panel contain dxToolbar');

        const input = testElement.find('input');

        const searchPanel = testElement.find('.dx-datagrid-search-panel');
        assert.strictEqual(input.length, 1);
        assert.strictEqual(searchPanel.length, 1);
        assert.equal(searchPanel.outerWidth(), 160, 'search panel width');
    });

    QUnit.test('Change search text', function(assert) {
        // arrange
        const headerPanel = this.headerPanel;
        const testElement = $('#container');
        let input;

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
        const headerPanel = this.headerPanel;
        const testElement = $('#container');

        this.options.groupPanel = {
            visible: true,
            emptyPanelText: 'Test',
            allowColumnDragging: true
        };

        // act
        headerPanel.render(testElement);
        headerPanel.resize();

        // assert
        const headerPanelElement = testElement.find('.dx-datagrid-header-panel');
        assert.ok(headerPanelElement.length);
        const groupPanel = headerPanelElement.find('.dx-datagrid-group-panel');
        assert.ok(groupPanel.length);
        assert.equal(groupPanel.length, 1);
        assert.ok(groupPanel.css('maxWidth'), 'Group panel has an max width');
        assert.equal(groupPanel.find('.dx-group-panel-message').text(), 'Test');
    });

    QUnit.test('Render groupPanel with visible="auto"', function(assert) {
        // arrange
        const headerPanel = this.headerPanel;
        const testElement = $('#container');
        const countOfRenderedElements = devices.current().deviceType === 'desktop' ? 1 : 0;

        this.options.groupPanel = {
            visible: 'auto',
            emptyPanelText: 'Test',
            allowColumnDragging: true
        };

        // act
        headerPanel.render(testElement);
        headerPanel.resize();

        // assert
        const headerPanelElement = testElement.find('.dx-datagrid-header-panel');
        assert.equal(headerPanelElement.length, countOfRenderedElements, 'Render on desktop only');

        const groupPanel = headerPanelElement.find('.dx-datagrid-group-panel');
        assert.equal(groupPanel.length, countOfRenderedElements, 'Render on desktop only');
    });

    QUnit.test('Bounding rect of groupPanel when panel is not visible', function(assert) {
        // arrange
        const headerPanel = this.headerPanel;
        const testElement = $('#container');

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
        const headerPanel = this.headerPanel;
        const testElement = $('#container');

        this.options.groupPanel = {
            visible: true,
            emptyPanelText: 'Test',
            allowColumnDragging: true
        };

        // act
        headerPanel.render(testElement);
        headerPanel.resize();

        // assert
        const boundingRect = headerPanel.getBoundingRect();
        const isBoundingCorrect = typeUtils.isObject(boundingRect) && typeUtils.isDefined(boundingRect.top) && typeUtils.isDefined(boundingRect.bottom);
        assert.ok(isBoundingCorrect, 'Bounding rect return object with "top" and "bottom" properties when grouping zone is visible');
    });

    QUnit.test('Group items with cssClass', function(assert) {
        // arrange
        const headerPanel = this.headerPanel;
        const testElement = $('#container');

        this.options.groupPanel = {
            visible: true
        };

        $.extend(this.columns[0], { cssClass: 'customCssClass', groupIndex: 0 });
        $.extend(this.columns[1], { groupIndex: 1 });

        // act
        headerPanel.render(testElement);
        headerPanel.resize();

        // assert
        const headerPanelElement = testElement.find('.dx-datagrid-header-panel');
        assert.ok(headerPanelElement.length);
        const groupPanel = headerPanelElement.find('.dx-datagrid-group-panel');
        assert.equal(groupPanel.length, 1);
        assert.ok(groupPanel.find('.dx-group-panel-item').first().hasClass('customCssClass'), 'has class customCssClass');
        assert.ok(!groupPanel.find('.dx-group-panel-item').last().hasClass('customCssClass'), 'not has class customCssClass');
    });

    QUnit.test('Draw groupPanel with grouping', function(assert) {
        // arrange

        const headerPanel = this.headerPanel;
        const testElement = $('#container');

        $.extend(this.columns[0], { groupIndex: 0, allowSorting: true });

        this.options.groupPanel = {
            visible: true
        };

        // act
        headerPanel.render(testElement);
        headerPanel.resize();

        // assert
        const headerPanelElement = testElement.find('.dx-datagrid-header-panel');
        assert.ok(headerPanelElement.length);
        const groupPanel = headerPanelElement.find('.dx-datagrid-group-panel');
        assert.ok(groupPanel.length);
        assert.equal(groupPanel.length, 1);
        const groupPanelItem = groupPanel.find('.dx-group-panel-item');
        assert.ok(groupPanelItem.length);
        assert.equal(groupPanelItem.find('.dx-column-indicators').css('float'), 'none', 'column indicators in group panel has no float style');

        const columns = this.columnsController.getVisibleColumns();
        assert.equal(groupPanelItem.text(), columns[0].caption);
        assert.ok(groupPanelItem.find('.dx-sort').length);
    });

    QUnit.test('Group panel with sorting, check alignment', function(assert) {
        // arrange
        const headerPanel = this.headerPanel;
        const testElement = $('#container');

        $.extend(this.columns[0], { groupIndex: 0, allowSorting: true, caption: 'test' });

        this.options.groupPanel = {
            visible: true
        };

        // act
        headerPanel.render(testElement);

        // assert
        const $groupPanelItemChildren = testElement.find('.dx-group-panel-item').contents();

        assert.equal($groupPanelItemChildren.length, 2, 'group panel item have 2 items');
        assert.ok($groupPanelItemChildren.eq(1).hasClass('dx-column-indicators'), 'indicators are after text in group panel');
    });

    QUnit.test('Group panel with sorting, height after change font size', function(assert) {
        // arrange
        const headerPanel = this.headerPanel;
        const testElement = $('#container');

        $.extend(this.columns[0], { groupIndex: 0, allowSorting: true });

        this.options.groupPanel = {
            visible: true
        };

        headerPanel.render(testElement);

        const groupHeader = testElement.find('.dx-datagrid-group-panel');
        const oldHeight = groupHeader.height();

        // act
        groupHeader.css('font-size', '10px');

        headerPanel.resize();

        // assert
        assert.ok(oldHeight > groupHeader.height(), 'sort indicator height changed');
    });

    QUnit.test('Draw header panel with group panel and search panel', function(assert) {
        // arrange
        const headerPanel = this.headerPanel;
        const testElement = $('#container');

        this.options.groupPanel = {
            visible: true
        };
        this.options.searchPanel = {
            visible: true
        };

        // act
        headerPanel.render(testElement);

        // assert
        const headerPanelElement = testElement.find('.dx-datagrid-header-panel');
        assert.ok(headerPanelElement.length);
        assert.equal(headerPanelElement.outerWidth(), testElement.outerWidth());
        const groupPanel = headerPanelElement.find('.dx-datagrid-group-panel');
        assert.ok(groupPanel.length);
        const searchPanel = headerPanelElement.find('.dx-datagrid-search-panel');
        assert.ok(searchPanel.length);
    });

    QUnit.test('Not draw header panel without group panel and search panel', function(assert) {
        // arrange
        const headerPanel = this.headerPanel;
        const testElement = $('#container');

        // act
        headerPanel.render(testElement);

        // assert
        assert.ok(!testElement.find('.dx-datagrid-header-panel').is(':visible'));
    });

    QUnit.test('Enter text in searchPanel', function(assert) {
        // arrange
        const headerPanel = this.headerPanel;
        const testElement = $('#container');

        this.options.searchPanel = {
            visible: true
        };

        // act
        headerPanel.render(testElement);

        // assert
        const searchPanel = testElement.find('.dx-datagrid-search-panel');
        assert.strictEqual(searchPanel.length, 1);
        searchPanel.dxTextBox('instance').option('value', '123');
        assert.equal(this.option('searchPanel.text'), '123');
    });

    QUnit.test('Draw searchPanel custom width', function(assert) {
        // arrange
        const headerPanel = this.headerPanel;
        const testElement = $('#container');

        this.options.searchPanel = {
            visible: true,
            width: 213
        };

        // act
        headerPanel.render(testElement);

        // assert
        const input = testElement.find('input');
        const searchPanel = testElement.find('.dx-datagrid-search-panel');
        assert.strictEqual(input.length, 1);
        assert.strictEqual(searchPanel.length, 1);
        assert.equal(searchPanel.outerWidth(), 213, 'default search panel width');
    });

    // T947070
    QUnit.test('Toolbar must have aria-label', function(assert) {
        // arrange
        const headerPanel = this.headerPanel;
        const testElement = $('#container');

        this.options.searchPanel = {
            visible: true
        };

        // act
        headerPanel.render(testElement);

        // assert
        const $toolbar = testElement.find('.dx-toolbar');
        assert.equal($toolbar.attr('aria-label'), 'Data grid toolbar', 'aria-label');
    });

    QUnit.test('Hide search panel', function(assert) {
        // arrange
        const headerPanel = this.headerPanel;
        const container = $('#container');

        this.options.searchPanel = {
            visible: true
        };

        headerPanel.render(container);

        const $headerPanel = container.find('.dx-datagrid-header-panel');
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
        const headerPanel = that.headerPanel;
        const container = $('#container');

        that.options.searchPanel = {
            visible: true
        };

        headerPanel.render(container);

        const searchInput = container.find('.dx-texteditor');
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
        const headerPanel = this.headerPanel;
        const testElement = $('#container');

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
        const headerPanel = this.headerPanel;
        const testElement = $('#container');

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
        const headerPanel = this.headerPanel;
        const testElement = $('#container');

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
        const headerPanel = this.headerPanel;
        const testElement = $('#container');

        this.options.groupPanel = {
            visible: true,
            allowColumnDragging: false
        };

        // act
        headerPanel.render(testElement);

        // assert
        assert.ok(!testElement.find('.dx-group-panel-message').length);
    });
});

QUnit.module('Draw buttons in header panel', {
    beforeEach: function() {
        setupDataGridModules(this, ['columns', 'data', 'headerPanel', 'editing', 'editingCellBased', 'editorFactory', 'columnChooser'], {
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
}, () => {

    QUnit.test('Draw add row button', function(assert) {
        // arrange
        const headerPanel = this.headerPanel;
        const testElement = $('#container');

        this.options.editing = {
            allowAdding: true,
            texts: {
                addRow: 'Add row'
            }
        };

        // act
        headerPanel.render(testElement);
        const addRowButton = testElement.find('.dx-datagrid-addrow-button');

        // assert
        assert.equal(addRowButton.length, 1, 'has add row button');
        assert.strictEqual(addRowButton.attr('title'), 'Add row', 'title button');
    });

    QUnit.test('Draw cancel and save buttons', function(assert) {
        // arrange
        const headerPanel = this.headerPanel;
        const testElement = $('#container');

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
        const cancelButton = testElement.find('.dx-datagrid-cancel-button');
        const saveButton = testElement.find('.dx-datagrid-save-button');

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
        const headerPanel = this.headerPanel;
        const testElement = $('#container');

        this.options.columnChooser = {
            enabled: true,
            title: 'Column chooser'
        };

        // act
        headerPanel.render(testElement);
        const showColumnChooserButton = testElement.find('.dx-datagrid-column-chooser-button');

        // assert
        assert.equal(showColumnChooserButton.length, 1, 'has show column chooser button');
        assert.strictEqual(showColumnChooserButton.attr('title'), 'Column chooser', 'title button');
    });

    QUnit.test('Draw hidden show column chooser button', function(assert) {
        // arrange
        const headerPanel = this.headerPanel;
        const testElement = $('#container').width(10);

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
                    name: 'columnChooserButton',
                    locateInMenu: 'auto'
                }
            ];
        };

        // act
        headerPanel.render(testElement);

        const $columnChooserButton = testElement.find('.dx-toolbar .dx-toolbar-item:visible');
        const $toolbarMenuButton = $('.dx-toolbar .dx-dropdownmenu').filter(':visible');

        // assert
        assert.equal($toolbarMenuButton.length, 1, 'has shown toolbar menu button');
        assert.equal($columnChooserButton.length, 0, 'column chooser button is invisible');
    });

    QUnit.test('Add button via the onToolbarPreparing option', function(assert) {
        // arrange
        let callCountToolbarPreparing = 0;
        const headerPanel = this.headerPanel;
        const $testElement = $('#container');

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
        const $customButtonElement = $testElement.find('.dx-toolbar .dx-item');

        // assert
        assert.equal(callCountToolbarPreparing, 1, 'call count toolbar preparing');
        assert.equal($customButtonElement.length, 1, 'count button');
        assert.equal($customButtonElement.text(), 'Custom button', 'text of the custom button');
    });

    QUnit.test('Add button via the onToolbarPreparing option when there is column chooser button', function(assert) {
        // arrange
        const headerPanel = this.headerPanel;
        const $testElement = $('#container');

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
        const $customButtonElements = $testElement.find('.dx-toolbar .dx-item .dx-button');

        // assert
        assert.equal($customButtonElements.length, 2, 'count button');
        assert.ok($customButtonElements.eq(0).hasClass('custom-button'), 'has custom button');
        assert.ok($customButtonElements.eq(1).hasClass('dx-datagrid-column-chooser-button'), 'has column chooser button');
    });

    QUnit.test('onToolbarPreparing - setting handler to the click event for column chooser button', function(assert) {
        // arrange
        let callCountClick = 0;
        const headerPanel = this.headerPanel;
        const $testElement = $('#container');

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
        const $columnChooserButton = $testElement.find('.dx-toolbar .dx-item .dx-button');
        assert.equal(callCountClick, 0, 'call count click');
        assert.equal($columnChooserButton.length, 1, 'count button');
        assert.ok($columnChooserButton.eq(0).hasClass('dx-datagrid-column-chooser-button'), 'has column chooser button');

        // act
        $columnChooserButton.trigger('dxclick');

        // assert
        assert.equal(callCountClick, 1, 'call count click');
    });

    QUnit.test('Add custom button via toolbar.items option', function(assert) {
        // arrange
        const headerPanel = this.headerPanel;
        const $testElement = $('#container');

        this.options.toolbar = {
            items: [
                {
                    widget: 'dxButton',
                    options: {
                        text: 'Custom button',
                        icon: 'back',
                        width: 50
                    },
                    location: 'after',
                    locateInMenu: 'auto'
                }
            ]
        };

        // act
        headerPanel.init();
        headerPanel.render($testElement);
        const $button = $testElement.find('.dx-toolbar .dx-item');

        // assert
        assert.equal($button.length, 1, 'button count');
        assert.equal($button.text(), 'Custom button', 'text of the custom button');
    });

    QUnit.test('Change default button settings via toolbar.items option', function(assert) {
        // arrange
        const headerPanel = this.headerPanel;
        const $testElement = $('#container');

        this.options.columnChooser = {
            enabled: true,
            title: 'Column chooser'
        };

        this.options.editing = {
            allowAdding: true
        };

        this.options.toolbar = {
            items: [
                {
                    name: 'columnChooserButton',
                    location: 'before'
                },
                {
                    name: 'addRowButton',
                    location: 'before'
                }
            ]
        };

        // act
        headerPanel.init();
        headerPanel.render($testElement);
        const $buttonsBefore = $testElement.find('.dx-toolbar-before .dx-item .dx-button');

        // assert
        assert.equal($buttonsBefore.length, 2, 'count button');
        assert.ok($buttonsBefore.eq(0).hasClass('dx-datagrid-column-chooser-button'), 'has column chooser button');
        assert.ok($buttonsBefore.eq(1).hasClass('dx-datagrid-addrow-button'), 'has add button');
    });

    QUnit.test('toolbar.item[].location should be \'after\' by default', function(assert) {
        // arrange
        const headerPanel = this.headerPanel;
        const $testElement = $('#container');

        this.options.toolbar = {
            items: [
                {
                    widget: 'dxButton',
                    options: { text: 'Custom button' },
                }
            ]
        };

        // act
        headerPanel.init();
        headerPanel.render($testElement);
        const $button = $testElement.find('.dx-toolbar .dx-toolbar-after .dx-item');

        // assert
        assert.equal($button.length, 1, 'button location is after');
    });

    QUnit.test('toolbar.item[].location should be \'center\' by default if added via onToolbarPrepared', function(assert) {
        // arrange
        const headerPanel = this.headerPanel;
        const $testElement = $('#container');

        this.options.onToolbarPreparing = function(e) {
            e.toolbarOptions.items.push({
                widget: 'dxButton',
                options: { text: 'Custom button' },
            });
        };

        headerPanel.init();
        headerPanel.render($testElement);
        const $button = $testElement.find('.dx-toolbar .dx-toolbar-center .dx-item');

        // assert
        assert.equal($button.length, 1, 'button location is center');
    });

    // T1043654
    QUnit.test('The default buttons should be hidden when they are specified in the toolbar.items option', function(assert) {
        // arrange
        const headerPanel = this.headerPanel;
        const $testElement = $('#container');

        this.options.toolbar = {
            items: ['addRowButton', 'applyFilterButton', 'columnChooserButton', 'exportButton', 'groupPanel', 'revertButton', 'saveButton', 'searchPanel']
        };

        // act
        headerPanel.init();
        headerPanel.render($testElement);
        const $toolbarItemElements = $testElement.find('.dx-toolbar-item');

        // assert
        assert.strictEqual($toolbarItemElements.length, 8, 'count button');
        $.each($toolbarItemElements, (_, toolbarItemElement) => {
            assert.ok($(toolbarItemElement).hasClass('dx-state-invisible'), 'button is hidden');
        });
    });

    // T1043654
    QUnit.test('The default buttons should be hidden when they are specified in the toolbar.items option using name', function(assert) {
        // arrange
        const headerPanel = this.headerPanel;
        const $testElement = $('#container');

        this.options.toolbar = {
            items: ['addRowButton', 'applyFilterButton', 'columnChooserButton', 'exportButton', 'groupPanel', 'revertButton', 'saveButton', 'searchPanel']
                .map(name => ({ name }))
        };

        // act
        headerPanel.init();
        headerPanel.render($testElement);
        const $toolbarItemElements = $testElement.find('.dx-toolbar-item');

        // assert
        assert.strictEqual($toolbarItemElements.length, 8, 'count button');
        $.each($toolbarItemElements, (_, toolbarItemElement) => {
            assert.ok($(toolbarItemElement).hasClass('dx-state-invisible'), 'button is hidden');
        });

        // T1085151
        this.options.toolbar.items.forEach(item => {
            assert.strictEqual(item.visible, undefined, 'visible option should not be changed in user props');
        });
    });

    QUnit.test('Toolbar item with custom name should be visible', function(assert) {
        // arrange
        const headerPanel = this.headerPanel;
        const $testElement = $('#container');

        this.options.toolbar = {
            items: [{
                name: 'myItem',
                cssClass: 'my-item',
                widget: 'dxButton',
                options: {
                    text: 'My Button'
                }
            }]
        };

        // act
        headerPanel.init();
        headerPanel.render($testElement);
        const $customToolbarItem = $testElement.find('.my-item');

        // assert
        assert.strictEqual($customToolbarItem.length, 1, 'item is rendered');
        assert.ok($customToolbarItem.is(':visible'), 'item is visible');
    });
});
