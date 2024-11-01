import $ from 'jquery';
import dataUtils from 'core/element_data';
import { addShadowDomStyles } from 'core/utils/shadow_dom.js';

import 'generic_light.css!';
import 'ui/data_grid';

import browser from 'core/utils/browser';
import { ColumnsView } from '__internal/grids/grid_core/views/m_columns_view';
import fx from 'common/core/animation/fx';
import dataGridMocks from '../../helpers/dataGridMocks.js';

const MockColumnsController = dataGridMocks.MockColumnsController;
const setupDataGridModules = dataGridMocks.setupDataGridModules;

QUnit.testStart(function() {
    const markup = '<div><div id="container" class="dx-datagrid"></div></div>';
    $('#qunit-fixture').html(markup);

    addShadowDomStyles($('#qunit-fixture'));
});

QUnit.module('API methods', {
    beforeEach: function() {
        const that = this;
        that.widths = [100, 200, 50, 50, 200];

        that.columns = [{ caption: 'Column 1', width: that.widths[0] },
            { caption: 'Column 2', width: that.widths[1] },
            { caption: 'Column 3', width: that.widths[2] },
            { caption: 'Column 4', width: that.widths[3] },
            { caption: 'Column 5', width: that.widths[4] }];

        setupDataGridModules(that, [], {
            initViews: true,
            controllers: {
                columns: new MockColumnsController(that.columns)
            },
            views: {
                columnsView: new ColumnsView(that)
            }
        });

        that.columnsView._tableElement = $('<table />').addClass('dx-datagrid-table').addClass('dx-datagrid-table-fixed')
            .append(that.columnsView._createColGroup(that.columns), [
                $('<tbody><tr><td><div><table><row><td></td></row></table></div></td><td></td><td></td><td></td><td></td></tr></tbody>')
            ]);

        that.columnsView._$element = $('<div/>').addClass('dx-datagrid-content').append(that.columnsView._tableElement);
        that.columnsView._$element.appendTo($('#container').width('600'));
    }
}, () => {

    QUnit.test('Apply options', function(assert) {
        // arrange
        // act
        this.options.showColumnHeaders = true;

        // assert
        assert.ok(this.columnsView.option('showColumnHeaders'));
    });

    QUnit.test('Get column widths', function(assert) {
        // act, assert
        assert.deepEqual(this.columnsView.getColumnWidths(), this.widths);
    });

    // T208053
    QUnit.test('Get column widths during css animation', function(assert) {
        const done = assert.async();

        const that = this;

        // act
        fx.animate($('#container'), {
            type: 'pop',
            duration: 50,
            complete: function() {
                done();
            }
        });

        // assert
        assert.deepEqual(that.columnsView.getColumnWidths(), that.widths);
    });

    QUnit.test('Get column widths with group row', function(assert) {
        // arrange
        this.columnsView.element().find('table').prepend($('<tr class = "dx-group-row"><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr>'));

        // act, assert
        assert.deepEqual(this.columnsView.getColumnWidths(), this.widths);
    });

    // T308596
    QUnit.test('Get column widths with detail row (editForm)', function(assert) {
        // arrange
        this.columnsView.element().find('table').prepend($('<tr class="dx-master-detail-row"><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr>'));

        // act, assert
        assert.deepEqual(this.columnsView.getColumnWidths(), this.widths);
    });

    QUnit.test('Get column widths with error row (editForm) (T1058684)', function(assert) {
        // arrange
        this.columnsView.element().find('table').prepend($('<tr class="dx-error-row"><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr>'));

        // act, assert
        assert.deepEqual(this.columnsView.getColumnWidths(), this.widths);
    });

    QUnit.test('Set column widths', function(assert) {
        // arrange
        const that = this;
        const newWidths = [250, 100, 50, 50, 150];

        // act
        that.columnsView.setColumnWidths({ widths: newWidths });

        // assert
        assert.deepEqual(that.columnsView.getColumnWidths(), newWidths);
    });

    QUnit.test('Create table by default', function(assert) {
    // act
        const $table = this.columnsView._createTable();

        // assert
        assert.ok($table.hasClass('dx-datagrid-table-fixed'), 'is contains data grid table class');
    });

    // T198380, T809552
    QUnit.test('Create table with thead in safari', function(assert) {
        // arrange
        const oldSafari = browser.safari;
        try {
            browser.safari = true;
            // act
            const $table = this.columnsView._createTable(this.columns);
            const $thead = $table.children('thead');

            // assert
            assert.ok($thead.length, 'table contains thead element');
            assert.equal($thead.html().toLowerCase(), '<tr></tr>', 'thead contains empty tr');
        } finally {
            browser.safari = oldSafari;
        }
    });

    QUnit.test('Create table by columnWidth auto', function(assert) {
        // arrange
        this.options.columnAutoWidth = true;

        // act
        const $table = this.columnsView._createTable();

        // assert
        assert.ok($table.hasClass('dx-datagrid-table-fixed'), 'is contains data grid table class');
    });

    // S173138
    QUnit.test('Set title attribute when cell text is trimmed', function(assert) {
        // arrange
        const that = this;
        const $container = $('#container').width(200);

        that.option('cellHintEnabled', true);
        that.columns.length = 0;
        that.columns.push({ caption: 'Column 1', width: 100 });
        that.columns.push({ caption: 'Column 2', width: 100 });

        const $table = $(that.columnsView._createTable()).append(
            $(`
                <tr class="dx-row">
                    <td>Test</td>
                    <td>Test Test Test Test Test</td>
                </tr>
            `)
        );

        $container.html(
            $('<div class="dx-datagrid-rowsview dx-datagrid-nowrap" />').append($table)
        );

        // act
        const firstCellElement = $table.find('td').first();
        firstCellElement.trigger('mousemove');

        // assert
        assert.strictEqual(firstCellElement.attr('title'), undefined, 'not has attribute title in first cell');

        // act
        const lastCellElement = $table.find('td').last();
        lastCellElement.trigger('mousemove');

        // assert
        assert.strictEqual(lastCellElement.attr('title'), 'Test Test Test Test Test', 'has attribute title in last cell');
    });

    // S173138
    QUnit.test('Not set title attribute when cell text is trimmed with cellHintEnabled false', function(assert) {
        // arrange
        const that = this;
        const $container = $('#container').width(200);

        that.option('cellHintEnabled', false);
        that.columns.length = 0;
        that.columns.push({ caption: 'Column 1', width: 100 });
        that.columns.push({ caption: 'Column 2', width: 100 });

        const $table = $(that.columnsView._createTable());

        $container.html(
            $('<div class="dx-datagrid-rowsview dx-datagrid-nowrap" />').append(
                $table.append(
                    that.columnsView._createColGroup(that.columns),
                    $(`
                        <tr class = "dx-row">
                            <td>Test</td>
                            <td>Test Test Test Test Test</td>
                        </tr>
                    `)
                )
            )
        );

        // act
        const firstCellElement = $table.find('td').first();
        firstCellElement.trigger('mousemove');

        // assert
        assert.strictEqual(firstCellElement.attr('title'), undefined, 'not has attribute title in first cell');

        // act
        const lastCellElement = $table.find('td').last();
        lastCellElement.trigger('mousemove');

        // assert
        assert.strictEqual(lastCellElement.attr('title'), undefined, 'not has attribute title in last cell');
    });

    // T180556
    QUnit.test('Not set title attribute when cell text is trimmed and cellTemplate defined', function(assert) {
        // arrange
        const that = this;
        const $container = $('#container').width(200);

        that.option('cellHintEnabled', true);
        that.columns.length = 0;
        that.columns.push({ caption: 'Column 1', width: 100 });
        that.columns.push({ caption: 'Column 2', width: 100, cellTemplate: function() { } });

        const $table = $(that.columnsView._createTable());
        $container.html($('<div class = \'dx-datagrid-rowsview dx-datagrid-nowrap\' />').append($table.append(that.columnsView._createColGroup(that.columns), $('<tr class = "dx-row dx-data-row"><td>Test Test Test Test Test</td><td>Test Test Test Test Test</td></tr>'))));

        // act
        const firstCellElement = $table.find('td').first();
        firstCellElement.trigger('mousemove');

        // assert
        assert.strictEqual(firstCellElement.attr('title'), 'Test Test Test Test Test', 'has attribute title in first cell');

        // act
        const lastCellElement = $table.find('td').last();
        lastCellElement.trigger('mousemove');

        // assert
        assert.strictEqual(lastCellElement.attr('title'), undefined, 'not has attribute title in last cell');
    });

    // T356806
    QUnit.test('Not set title attribute when group cell text is trimmed and groupCellTemplate defined', function(assert) {
        // arrange
        const that = this;
        const $container = $('#container').width(100);

        that.option('cellHintEnabled', true);
        that.columns.length = 0;
        that.columns.push({ caption: 'Column 1', width: 50, groupIndex: 0 });
        that.columns.push({ caption: 'Column 2', width: 50, groupIndex: 1, groupCellTemplate: function() { } });
        that.columns.push({ caption: 'Column 3', width: 50 });

        const $table = $(that.columnsView._createTable());
        $container.html($('<div class = \'dx-datagrid-rowsview dx-datagrid-nowrap\' />').append($table.append(that.columnsView._createColGroup(that.columns),
            $('<tr class = "dx-row dx-group-row"><td class="dx-datagrid-group-space"></td><td colspan="2">Test Test Test Test Test</td></tr>'),
            $('<tr class = "dx-row dx-group-row"><td class="dx-datagrid-group-space"></td><td class="dx-datagrid-group-space"></td><td>Test Test Test Test Test</td></tr>')
        )));

        dataUtils.data($table.find('tr').get(0), 'options', { cells: [{}, { column: that.columns[0] }] });
        dataUtils.data($table.find('tr').get(1), 'options', { cells: [{}, {}, { column: that.columns[1] }] });

        // act
        const firstCellElement = $table.find('tr').eq(0).find('td').last();
        firstCellElement.trigger('mousemove');

        // assert
        assert.strictEqual(firstCellElement.attr('title'), 'Test Test Test Test Test', 'has attribute title in first group cell');

        // act
        const lastCellElement = $table.find('tr').eq(1).find('td').last();
        lastCellElement.trigger('mousemove');

        // assert
        assert.strictEqual(lastCellElement.attr('title'), undefined, 'not has attribute title in last group cell');
    });


    // T268245
    QUnit.test('Not set title attribute when cell text is trimmed and headerCellTemplate defined', function(assert) {
        // arrange
        const that = this;
        const $container = $('#container').width(200);

        that.option('cellHintEnabled', true);
        that.columns.length = 0;
        that.columns.push({ caption: 'Column 1', width: 100 });
        that.columns.push({ caption: 'Column 2', width: 100, headerCellTemplate: function() { } });

        const $table = $(that.columnsView._createTable());
        $container.html($('<div class = \'dx-datagrid-headers dx-datagrid-nowrap\' />').append($table.append(that.columnsView._createColGroup(that.columns), $('<tr class = "dx-row dx-header-row"><td>Test Test Test Test Test</td><td>Test Test Test Test Test</td></tr>'))));

        // act
        const firstCellElement = $table.find('td').first();
        firstCellElement.trigger('mousemove');

        // assert
        assert.strictEqual(firstCellElement.attr('title'), 'Test Test Test Test Test', 'has attribute title in first cell');

        // act
        const lastCellElement = $table.find('td').last();
        lastCellElement.trigger('mousemove');

        // assert
        assert.strictEqual(lastCellElement.attr('title'), undefined, 'not has attribute title in last cell');
    });

    // T222924
    QUnit.test('Not set title attribute when cell text is trimmed and user title defined', function(assert) {
        // arrange
        const that = this;
        const $container = $('#container').width(200);

        that.option('cellHintEnabled', true);
        that.columns.length = 0;
        that.columns.push({ caption: 'Column 1', width: 100 });
        that.columns.push({ caption: 'Column 2', width: 100 });

        const $table = $(that.columnsView._createTable());
        $container.html($('<div class = \'dx-datagrid-rowsview dx-datagrid-nowrap\' />').append($table.append(that.columnsView._createColGroup(that.columns), $('<tr class = "dx-row dx-data-row"><td><div title="User Title">Test Test Test Test Test</div></td><td><div>Test Test Test Test Test</div></td></tr>'))));

        // act
        const firstCellElement = $table.find('td').first();
        firstCellElement.children().trigger('mousemove');

        // assert
        assert.strictEqual(firstCellElement.attr('title'), undefined, 'not has attribute title in first cell');
        assert.strictEqual(firstCellElement.children().attr('title'), 'User Title', 'user title on div in first cell');

        // act
        const lastCellElement = $table.find('td').last();
        lastCellElement.children().trigger('mousemove');

        // assert
        assert.strictEqual(lastCellElement.attr('title'), undefined, 'not has attribute title in last cell');
        assert.strictEqual(lastCellElement.children().attr('title'), 'Test Test Test Test Test', 'has attribute title on div in last cell');
    });

    // S173138
    QUnit.test('Set title attribute when cell text is trimmed in dx-datagrid-text-content container', function(assert) {
        // arrange
        const that = this;
        const $container = $('#container').width(200);

        that.option('cellHintEnabled', true);
        that.columns.length = 0;
        that.columns.push({ caption: 'Column 1', width: 100 });
        that.columns.push({ caption: 'Column 2', width: 100 });

        const $table = $(that.columnsView._createTable());
        $container.html($('<div class = \'dx-datagrid-headers dx-datagrid-nowrap\' />').append($table.append(that.columnsView._createColGroup(that.columns), $('<tr class = "dx-row"><td><div class="dx-datagrid-text-content">Test</div></td><td><div class="dx-datagrid-text-content">Test Test Test Test Test</div></td></tr>'))));

        // act
        const firstCellElement = $table.find('div').first();
        firstCellElement.trigger('mousemove');

        // assert
        assert.strictEqual(firstCellElement.attr('title'), undefined, 'not has attribute title in first cell');

        // act
        const lastCellElement = $table.find('div').last();
        lastCellElement.trigger('mousemove');

        // assert
        assert.strictEqual(lastCellElement.attr('title'), 'Test Test Test Test Test', 'has attribute title in last cell');
    });

    // S173138
    QUnit.test('Not set title attribute when cell text is trimmed in dx-datagrid-text-content container with cellHintEnabled false', function(assert) {
        // arrange
        const that = this;
        const $container = $('#container').width(200);

        that.option('cellHintEnabled', false);
        that.columns.length = 0;
        that.columns.push({ caption: 'Column 1', width: 100 });
        that.columns.push({ caption: 'Column 2', width: 100 });

        const $table = $(that.columnsView._createTable());
        $container.html($('<div class = \'dx-datagrid-headers dx-datagrid-nowrap\' />').append($table.append(that.columnsView._createColGroup(that.columns), $('<tr class = "dx-row"><td><div class="dx-datagrid-text-content">Test</div></td><td><div class="dx-datagrid-text-content">Test Test Test Test Test</div></td></tr>'))));

        // act
        const firstCellElement = $table.find('div').first();
        firstCellElement.trigger('mousemove');

        // assert
        assert.strictEqual(firstCellElement.attr('title'), undefined, 'not has attribute title in first cell');

        // act
        const lastCellElement = $table.find('div').last();
        lastCellElement.trigger('mousemove');

        // assert
        assert.strictEqual(lastCellElement.attr('title'), undefined, 'not has attribute title in last cell');
    });

    // T1117557
    QUnit.test('Not set title attribute when cell is editing', function(assert) {
        // arrange
        const that = this;
        const $container = $('#container').width(200);

        that.option('cellHintEnabled', true);

        that.columns.length = 0;
        that.columns.push({ caption: 'Column 2', width: 100, showEditorAlways: true });

        const $table = $(that.columnsView._createTable());
        $container.html($('<div class = \'dx-datagrid-headers dx-datagrid-nowrap\' />').append($table.append(that.columnsView._createColGroup(that.columns), $('<tr class = "dx-row"><td><div class="dx-datagrid-text-content">Test Test Test Test Test</div></td></tr>'))));

        // act
        const firstCellElement = $table.find('td').first();
        firstCellElement.trigger('mousemove');

        // assert
        assert.strictEqual(firstCellElement.attr('title'), undefined, 'not has attribute title in cell');
    });

    QUnit.test('Invalidate instead of render for options', function(assert) {
        // arrange
        let renderCounter = 0;
        this.columnsView.render($('#container'));
        this.columnsView.renderCompleted.add(function() {
            renderCounter++;
        });

        // act
        this.columnsView.component.isReady = function() {
            return true;
        };
        this.columnsView.beginUpdate();
        this.columnsView.optionChanged({ name: 'cellHintEnabled' });
        this.columnsView.optionChanged({ name: 'onCellPrepared' });
        this.columnsView.optionChanged({ name: 'onRowPrepared' });
        this.columnsView.optionChanged({ name: 'onCellHoverChanged' });
        this.columnsView.endUpdate();

        // assert
        assert.equal(renderCounter, 1, 'count of rendering');
    });

    QUnit.test('Invalidate when data is loading', function(assert) {
        // arrange
        let renderCounter = 0;
        this.columnsView.render($('#container'));
        this.columnsView.renderCompleted.add(function() {
            renderCounter++;
        });

        // act
        this.columnsView.component.isReady = function() {
            return false;
        };
        this.columnsView.beginUpdate();
        this.columnsView.optionChanged({ name: 'cellHintEnabled' });
        this.columnsView.optionChanged({ name: 'onCellPrepared' });
        this.columnsView.optionChanged({ name: 'onRowPrepared' });
        this.columnsView.optionChanged({ name: 'onCellHoverChanged' });
        this.columnsView.endUpdate();

        // assert
        assert.equal(renderCounter, 0, 'count of rendering');
    });

    QUnit.test('Require resize of render for options', function(assert) {
        // arrange
        this.columnsView.render($('#container'));

        // act
        this.columnsView.component.isReady = function() {
            return true;
        };
        this.columnsView.beginUpdate();
        this.columnsView.optionChanged({ name: 'cellHintEnabled' });
        this.columnsView.optionChanged({ name: 'onCellPrepared' });
        this.columnsView.optionChanged({ name: 'onRowPrepared' });
        this.columnsView.optionChanged({ name: 'onCellHoverChanged' });
        this.columnsView.endUpdate();

        // assert
        assert.ok(this.columnsView.component._requireResize);
    });

    QUnit.test('Options of template have the \'component\'', function(assert) {
        // arrange
        const that = this;
        let callRenderTemplate;
        const template = {
            allowRenderToDetachedContainer: true,
            render: function($container, options) {
                callRenderTemplate = true;

                // assert
                assert.deepEqual(options.component, that, 'component');
            }
        };

        // act
        that.columnsView.renderTemplate($('#container'), template, {});

        // assert
        assert.ok(callRenderTemplate, 'call render of template');
    });

    // T616759
    QUnit.test('The title attribute should not be set for content inside detail row', function(assert) {
        // arrange
        const $container = $('#container').width(200);

        this.option('cellHintEnabled', true);
        const $table = $(this.columnsView._createTable());

        $container.html(
            $('<div class="dx-datagrid-rowsview dx-datagrid-nowrap" />').append(
                $table.append(
                    this.columnsView._createColGroup(this.columns),
                    `<tr class="dx-row dx-master-detail-row">
                        <td>
                            <div id="content">
                                <div>Test</div>
                            </div>
                        </td>
                    </tr>`
                )
            )
        );

        $container.find('#content').css('overflow', 'hidden');

        $container.find('#content > div').css({
            width: '600px',
            height: '30px'
        });

        // act
        $('#content').trigger('mousemove');

        // assert
        assert.strictEqual($('#content').attr('title'), undefined, 'not has attribute title');
    });

    QUnit.test('waitAsyncTemplates with async templates', function(assert) {
        // arrange
        const deferred = $.Deferred();

        this.options.renderAsync = false;
        this.options.templatesRenderAsynchronously = true;
        this.columnsView._templateDeferreds.add(deferred);

        // assert
        assert.strictEqual(this.columnsView.waitAsyncTemplates().state(), 'pending', 'promise state');

        // act
        this.columnsView._templateDeferreds.delete(deferred);
        deferred.resolve();

        // assert
        assert.strictEqual(this.columnsView.waitAsyncTemplates().state(), 'resolved', 'promise state');
    });

    QUnit.test('waitAsyncTemplates with dynamic addition of async templates', function(assert) {
        // arrange
        const deferreds = [$.Deferred(), $.Deferred()];

        this.options.renderAsync = false;
        this.options.templatesRenderAsynchronously = true;
        this.columnsView._templateDeferreds.add(deferreds[0]);

        // assert
        const promise1 = this.columnsView.waitAsyncTemplates();
        assert.strictEqual(promise1.state(), 'pending', 'promise1 is pending');

        // arrange
        this.columnsView._templateDeferreds.add(deferreds[1]);

        // act
        this.columnsView._templateDeferreds.delete(deferreds[0]);
        deferreds[0].resolve();

        // assert
        const promise2 = this.columnsView.waitAsyncTemplates();
        assert.strictEqual(promise1.state(), 'pending', 'promise1 is pending');
        assert.strictEqual(promise2.state(), 'pending', 'promise2 is pending');

        // act
        this.columnsView._templateDeferreds.delete(deferreds[1]);
        deferreds[1].resolve();

        // assert
        assert.strictEqual(promise1.state(), 'resolved', 'promise1 is resolved');
        assert.strictEqual(promise2.state(), 'resolved', 'promise2 is resolved');
    });

    QUnit.test('getCellElements', function(assert) {
        // act
        const $row1 = this.columnsView.getCellElements(0);
        const $row2 = this.columnsView.getCellElements(-1);

        // assert
        assert.notEqual($row1, undefined);
        assert.strictEqual($row2, undefined);
    });
});
