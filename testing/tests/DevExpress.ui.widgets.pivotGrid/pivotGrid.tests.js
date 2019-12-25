QUnit.testStart(function() {
    var markup =
'<style>\
    table {table-layout: fixed;}/*T428108*/\
    .dx-scrollable-content {\
        padding: 0 !important;\
    }\
</style>\
<div id="pivotGrid"></div>\
<div class="dx-pivotgrid">\
    <div id="pivotArea" class="dx-pivotgrid-area-data dx-pivotgrid-vertical-headers" />\
</div>';

    $('#qunit-fixture').html(markup);
});

import 'common.css!';
import 'generic_light.css!';

import 'ui/pivot_grid/ui.pivot_grid';

import $ from 'jquery';
import pointerMock from '../../helpers/pointerMock.js';
import pivotGridDataController from 'ui/pivot_grid/ui.pivot_grid.data_controller';
import dataArea from 'ui/pivot_grid/ui.pivot_grid.data_area';
import headersArea from 'ui/pivot_grid/ui.pivot_grid.headers_area';
import pivotGridUtils from 'ui/pivot_grid/ui.pivot_grid.utils';
import { getRealElementWidth } from 'ui/pivot_grid/ui.pivot_grid.area_item';
import PivotGridDataSource from 'ui/pivot_grid/data_source';
import domUtils from 'core/utils/dom';
import { isRenderer } from 'core/utils/type';
import config from 'core/config';
import dateLocalization from 'localization/date';
import devices from 'core/devices';
import browser from 'core/utils/browser';
import dataUtils from 'core/element_data';
import { getSize } from 'core/utils/size';

function sumArray(array) {
    var sum = 0;
    for(var i = 0; i < array.length; i++) {
        sum += array[i];
    }

    return sum;
}

function getScrollBarWidth() {
    var container = $('<div>').css({
        position: 'absolute',
        visibility: 'hidden',
        top: -1000,
        left: -1000,
        width: 100,
        height: 100
    }).appendTo('body');

    var content = $('<p>').css({
        width: '100%',
        height: 200
    }).appendTo(container);

    container.dxScrollable({ useNative: true });

    var scrollBarWidth = container.width() - content.width();

    container.remove();

    return scrollBarWidth;
}

var moduleConfig = {
    beforeEach: function() {
        var rowItems = [{
                value: 'C1', index: 2,
                children: [{ value: 'P1', index: 0 }, { value: 'P2 Test Test Test Test Test', index: 1 }]
            }, {
                value: 'C2', index: 5,
                children: [{ value: 'P3', index: 3 }, { value: 'P4', index: 4 }]
            }],
            columnItems = [{
                value: '2010', index: 2,
                children: [{ value: '1', index: 0 }, { value: '2', index: 1 }]
            }, {
                value: '2012', index: 5,
                children: [{ value: '2', index: 3 }, { value: '3', index: 4 }]
            }],
            cellSet = [
                [[1, 0.1], [8, 0.8], [15, 0.15], [22, 0.22], [29, 0.29], [36, 0.36], [43, 0.43]],
                [[2, 0.2], [9, 0.9], [16, 0.16], [23, 0.23], [30, 0.3], [37, 0.37], [44, 0.44]],
                [[3, 0.3], [10, 0.1], [170000000, 0.17], [24, 0.24], [31, 0.31], [38, 0.38], [45, 0.45]],
                [[4, 0.4], [11, 0.11], [18, 0.18], [25, 0.25], [32, 0.32], [39, 0.39], [46, 0.46]],
                [[5, 0.5], [12, 0.12], [19, 0.19], [26, 0.26], [33, 0.33], [40, 0.4], [47, 0.47]],
                [[6, 0.6], [13, 0.13], [20, 0.2], [27, 0.27], [34, 0.34], [41, 0.41], [48, 0.48]],
                [[7, 0.7], [14, 0.14], [21, 0.21], [28, 0.28], [35, 0.35], [42, 0.42], [49, 0.49]]
            ];

        this.testOptions = {
            dataSource: {
                rows: rowItems,
                columns: columnItems,
                values: cellSet,
                fields: [
                    { area: 'row', areaIndex: 0 },
                    { area: 'row', areaIndex: 1 },
                    { format: 'decimal', area: 'column', areaIndex: 0 },
                    { format: { format: 'quarter', dateType: 'full' }, area: 'column', areaIndex: 1 },
                    { caption: 'Sum1', format: 'currency', area: 'data', areaIndex: 0 },
                    { caption: 'Sum2', format: 'percent', area: 'data', areaIndex: 1 }
                ]
            }
        };
    }
};

var createPivotGrid = function(options, assert) {
    var pivotGrid,
        pivotGridElement = $('#pivotGrid').dxPivotGrid(options);

    assert.ok(pivotGridElement);
    pivotGrid = pivotGridElement.dxPivotGrid('instance');
    return pivotGrid;
};

QUnit.module('dxPivotGrid', {
    beforeEach: function() {
        moduleConfig.beforeEach.apply(this, arguments);
        this.dataSource = {
            fields: [
                { area: 'row' },
                { format: 'decimal', area: 'column' }, {
                    format: function(value) {
                        return dateLocalization.format(new Date(2000, Number(value) * 3 - 1), 'quarter');
                    }, area: 'column'
                },
                { caption: 'Sum1', format: 'currency', area: 'data' }, { caption: 'Sum2', format: 'percent', area: 'data' }
            ],
            rows: [
                { value: 'A', index: 0 },
                { value: 'B', index: 1 }
            ],
            columns: [{
                value: '2010', index: 2,
                children: [
                    { value: '1', index: 0 },
                    { value: '2', index: 1 }
                ]
            }, {
                value: '2012', index: 3
            }],
            values: [
                [[1, 0.1], [8, 0.8], [15, 0.15], [36, 0.36], [43, 0.43]],
                [[2, 0.2], [9, 0.9], [16, 0.16], [37, 0.37], [44, 0.44]],
                [[3, 0.3], [10, 0.1], [17, 0.17], [38, 0.38], [45, 0.45]]
            ]
        };
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
        this.dataSource = {};
    }
});

QUnit.test('Empty options', function(assert) {
    var pivotGrid = createPivotGrid({}, assert);
    assert.ok(pivotGrid);
    assert.strictEqual(pivotGrid.isReady(), true);
});

QUnit.test('No options', function(assert) {
    var pivotGrid = createPivotGrid(undefined, assert);
    assert.ok(pivotGrid);
});

QUnit.test('No data', function(assert) {
    var contentReadyCallback = sinon.stub(),
        pivotGrid = createPivotGrid({
            onContentReady: contentReadyCallback
        }, assert);
    assert.ok(pivotGrid);

    var $noDataElement = pivotGrid.$element().find('.dx-pivotgrid-nodata');

    assert.equal($noDataElement.length, 1);
    assert.ok($noDataElement.is(':visible'));
    assert.equal($noDataElement.text(), 'No data');
    assert.ok(contentReadyCallback.calledOnce, 'contentReadyCallback called once');
});

QUnit.test('Empty store', function(assert) {
    var testOptions = $.extend(this.testOptions, {
            showColumnGrandTotals: false,
            showRowGrandTotals: false,
            fieldChooser: { enabled: false },
            dataSource: {
                fields: [
                    { dataField: 'field1', area: 'row' },
                    { dataField: 'field2', area: 'column' },
                    { dataField: 'field3', area: 'data' }],
                store: []
            }
        }),
        pivotGrid = createPivotGrid(testOptions, assert);
    this.clock.tick();

    var $columnCell = pivotGrid.$element().find('.dx-area-column-cell'),
        $rowCell = pivotGrid.$element().find('.dx-area-row-cell');

    assert.equal($columnCell.find('span')[0].innerHTML, '&nbsp;');
    assert.equal($rowCell.find('span')[0].innerHTML, '&nbsp;');
});

QUnit.test('No data when pivot grid rendered to invisible container', function(assert) {
    var $pivotGridElement = $('#pivotGrid').hide().height('200px'),
        pivotGrid = createPivotGrid({
            height: 200,
            dataSource: [{ sum: 100 }],
        }, assert);

    // act
    $pivotGridElement.show();

    domUtils.triggerShownEvent($pivotGridElement);
    this.clock.tick();

    var $noDataElement = $(pivotGrid.$element().find('.dx-pivotgrid-nodata')),
        dataAreaCell = $('.dx-area-data-cell'),
        dataAreaCellOffset = dataAreaCell.offset(),
        noDataElementOffset = $noDataElement.offset();

    assert.ok($noDataElement.is(':visible'));
    assert.roughEqual(noDataElementOffset.top - dataAreaCellOffset.top, (dataAreaCellOffset.top + dataAreaCell.outerHeight()) - (noDataElementOffset.top + $noDataElement.height()), 2.5, 'no data element position');
});

QUnit.test('Not render pivot grid to invisible container', function(assert) {
    // arrange
    var onContentReadyCallback = sinon.stub();
    this.testOptions.onContentReady = onContentReadyCallback;
    this.testOptions.scrolling = { mode: 'virtual' };
    this.testOptions.height = 300;

    // act
    $('#pivotGrid').hide();
    createPivotGrid(this.testOptions, assert);

    // assert
    assert.equal(onContentReadyCallback.callCount, 1, 'contentReady calls');
});

QUnit.test('Create PivotGrid with Data', function(assert) {
    var onContentReadyCallback = sinon.stub(),
        pivotGrid,
        $noDataElement;

    this.testOptions.onContentReady = onContentReadyCallback;

    pivotGrid = createPivotGrid(this.testOptions, assert);

    $noDataElement = $(pivotGrid.$element().find('.dx-pivotgrid-nodata'));

    assert.equal($noDataElement.length, 1);
    assert.ok(!$noDataElement.is(':visible'));
    assert.equal($noDataElement.text(), '');

    assert.ok(pivotGrid._loadPanel, 'loadPanel exists');
    assert.ok(!pivotGrid._loadPanel.option('visible'), 'loadPanel is not visible');
    assert.strictEqual(pivotGrid.$element().css('overflow'), 'hidden', 'element overflow property should be hidden');

    assert.ok(onContentReadyCallback.calledOnce, 'contentReady calls');
    assert.strictEqual(pivotGrid.$element().find('thead.dx-pivotgrid-horizontal-headers').length, 1);
    assert.strictEqual(pivotGrid.$element().find('tbody.dx-pivotgrid-vertical-headers').length, 1);
});

QUnit.test('Hide overflowed content if load panel is disabled', function(assert) {
    this.testOptions.loadPanel = { enabled: false };

    var pivotGrid = createPivotGrid(this.testOptions, assert);

    assert.strictEqual(pivotGrid.$element().css('overflow'), 'hidden', 'element overflow property should be hidden');
});

QUnit.test('Loading DataSource', function(assert) {
    var onContentReadyCallback = sinon.stub(),
        pivotGrid,
        $noDataElement;

    // act
    pivotGrid = createPivotGrid({
        height: 200,
        dataSource: [{ sum: 100 }],
        fields: [{ dataField: 'sum', summaryType: 'sum', area: 'data' }],
        onContentReady: onContentReadyCallback
    }, assert);

    $noDataElement = $(pivotGrid.$element().find('.dx-pivotgrid-nodata'));

    assert.equal($noDataElement.length, 1);
    assert.ok(!$noDataElement.is(':visible'));
    assert.equal($noDataElement.text(), '');

    assert.ok(pivotGrid._loadPanel, 'loadPanel exists');
    assert.ok(pivotGrid._loadPanel.option('visible'), 'loadPanel should be visible');
    assert.strictEqual(pivotGrid.$element().css('overflow'), 'visible', 'element overflow property should be \'visible\'');

    assert.strictEqual(pivotGrid.isReady(), false);
    assert.ok(!onContentReadyCallback.called, 'contentReady should not be called');

    var loadIndicatorElement = pivotGrid._loadPanel.$content(),
        dataAreaGroupElement = pivotGrid._dataArea.groupElement(),
        loadIndicatorElementOffset = loadIndicatorElement.offset(),
        dataAreaGroupElementOffset = dataAreaGroupElement.offset();

    assert.roughEqual(loadIndicatorElementOffset.top - dataAreaGroupElementOffset.top, (dataAreaGroupElementOffset.top + dataAreaGroupElement.height()) - (loadIndicatorElementOffset.top + loadIndicatorElement.outerHeight()), 2.1, 'loading element position');

    // act
    this.clock.tick();

    assert.ok(onContentReadyCallback.calledOnce, 'contentReady should be called once');
    assert.ok(!pivotGrid._loadPanel.option('visible'), 'loadPanel should not be visible');
    assert.strictEqual(pivotGrid.isReady(), true);
    assert.deepEqual(pivotGrid._loadPanel.option('container'), pivotGrid.$element());
});

QUnit.test('Loading DataSource longer 1000 ms', function(assert) {
    var onContentReadyCallback = sinon.stub(),
        pivotGrid,
        progresses = [],
        loadingChangedArgs = [];

    // act

    var d = $.Deferred();

    pivotGrid = createPivotGrid({
        height: 200,
        dataSource: {
            onLoadingChanged: function(isLoading) {
                loadingChangedArgs.push(isLoading);
            },
            onProgressChanged: function(progress) {
                progresses.push(progress);
            },
            load: function() {
                return d;
            }
        },
        fields: [{ dataField: 'sum', summaryType: 'sum', area: 'data' }],
        onContentReady: onContentReadyCallback
    }, assert);

    assert.ok(pivotGrid._loadPanel, 'loadPanel exists');
    assert.ok(pivotGrid._loadPanel.option('visible'), 'loadPanel should be visible');

    assert.strictEqual(pivotGrid.isReady(), false);
    assert.ok(!onContentReadyCallback.called, 'contentReady should not be called');

    var loadPanelOption = pivotGrid._loadPanel.option;

    var loadMessages = [];

    pivotGrid._loadPanel.option = function(name, value) {
        if(name === 'message' && value) {
            if(loadPanelOption.call(this, 'message') !== value) {
                loadMessages.push(value);
            }
        }
        return loadPanelOption.apply(this, arguments);
    };

    this.clock.tick(1000);

    d.resolve([{ sum: 100 }]);

    // act
    this.clock.tick();

    assert.deepEqual(loadMessages, ['80%', 'Loading...', '85%', '87%', '90%', '95%', '97%', '100%']);
    assert.deepEqual(progresses, [1]);
    assert.deepEqual(loadingChangedArgs, [true, false, true, false]); // T514201

    assert.ok(onContentReadyCallback.calledOnce, 'contentReady should be called once');
    assert.ok(!pivotGrid._loadPanel.option('visible'), 'loadPanel should not be visible');
    assert.ok(!pivotGrid.$element().hasClass('dx-overflow-hidden'), 'element overflow property should be \'hidden\'');
    assert.strictEqual(pivotGrid.isReady(), true);
});

QUnit.test('EncodeHTML option is enabled by default', function(assert) {
    var pivotGrid = createPivotGrid(undefined, assert);
    assert.ok(pivotGrid.option('encodeHtml'));
});

QUnit.test('collapse column item', function(assert) {
    var expandValueChangingArgs;

    var pivotGrid = createPivotGrid({
        dataSource: this.dataSource,
        onExpandValueChanging: function(args) {
            expandValueChangingArgs = $.extend({}, args);
        }
    }, assert);
    assert.ok(pivotGrid);

    assert.strictEqual($('#pivotGrid').find('.dx-pivotgrid-collapsed').length, 1);
    var $expandedSpan = $('#pivotGrid').find('.dx-pivotgrid-expanded');
    assert.strictEqual($expandedSpan.length, 1);

    // act
    $($expandedSpan).trigger('dxclick');

    this.clock.tick();

    // assert
    assert.strictEqual($('#pivotGrid').find('.dx-pivotgrid-expanded').length, 0);
    assert.strictEqual($('#pivotGrid').find('.dx-pivotgrid-collapsed').length, 2);
    assert.deepEqual(expandValueChangingArgs, {
        area: 'column',
        path: ['2010'],
        expanded: false
    });
});

QUnit.test('expand column item', function(assert) {
    var expandValueChangingArgs;
    var pivotGrid = createPivotGrid({
        dataSource: this.dataSource,
        onExpandValueChanging: function(args) {
            expandValueChangingArgs = $.extend({}, args);
        }
    }, assert);
    assert.ok(pivotGrid);

    var $collapsedSpan = $('#pivotGrid').find('.dx-pivotgrid-collapsed');
    assert.strictEqual($collapsedSpan.length, 1);

    // act
    $($collapsedSpan).trigger('dxclick');

    this.clock.tick();


    // assert
    assert.deepEqual(expandValueChangingArgs, {
        area: 'column',
        path: ['2012'],
        expanded: true,
        needExpandData: true
    });
});

QUnit.test('onCellClick prevents expansion', function(assert) {
    var expandValueChangingArgs;
    var pivotGrid = createPivotGrid({
        dataSource: this.dataSource,
        onExpandValueChanging: function(args) {
            expandValueChangingArgs = $.extend({}, args);
        },
        onCellClick: function(args) {
            args.cancel = true;
        }
    }, assert);
    assert.ok(pivotGrid);

    var $collapsedSpan = $('#pivotGrid').find('.dx-pivotgrid-collapsed');
    assert.strictEqual($collapsedSpan.length, 1);

    // act
    $($collapsedSpan).trigger('dxclick');

    this.clock.tick();

    // assert
    assert.strictEqual(expandValueChangingArgs, undefined);
});

QUnit.test('T248253. DataSource changed', function(assert) {
    var expandValueChangingArgs;
    var pivotGrid = createPivotGrid($.extend(this.testOptions, {
        onExpandValueChanging: function(args) {
            expandValueChangingArgs = $.extend({}, args);
        }
    }), assert);

    pivotGrid.option({
        dataSource: this.dataSource
    });


    var $collapsedSpan = $('#pivotGrid').find('.dx-pivotgrid-collapsed');
    assert.strictEqual($collapsedSpan.length, 1);

    // act
    $($collapsedSpan).trigger('dxclick');

    this.clock.tick();


    // assert
    assert.deepEqual(expandValueChangingArgs, {
        area: 'column',
        path: ['2012'],
        expanded: true,
        needExpandData: true
    });
});

QUnit.test('onCellClick event', function(assert) {
    var cellClickArgs = [];

    var pivotGrid = createPivotGrid({
            dataSource: this.dataSource,
            fieldPanel: {
                showRowFields: true,
                visible: true
            },
            onCellClick: function(e) {
                cellClickArgs.push(e);
            }
        }, assert),

        clickHandler = sinon.stub();

    pivotGrid.on('cellClick', clickHandler);

    var $dataArea = $('#pivotGrid').find('.dx-pivotgrid-area-data'),
        $fieldsArea = $('#pivotGrid').find('.dx-pivotgrid-fields-area');

    this.clock.tick();
    // act
    $($dataArea.find('tr').eq(1).find('td').eq(3)).trigger('dxclick');
    $($dataArea.find('tr').eq(2).find('td').eq(4)).trigger('dxclick');
    $($fieldsArea.find('td').eq(1)).trigger('dxclick');

    // assert
    assert.equal(cellClickArgs.length, 2, 'onCellClick call count');
    assert.deepEqual(cellClickArgs[0].cell, {
        columnType: 'D',
        columnPath: ['2010', '2'],
        rowPath: ['B'],
        rowType: 'D',
        dataIndex: 1,
        dataType: undefined,
        format: 'percent',
        text: '90%',
        value: 0.9
    }, 'first cell click arguments');
    assert.deepEqual(cellClickArgs[1].cell, {
        columnPath: ['2010'],
        columnType: 'T',
        rowPath: [],
        rowType: 'GT',
        dataIndex: 0,
        dataType: undefined,
        format: 'currency',
        text: '$17',
        value: 17
    }, 'second cell click arguments');

    assert.strictEqual(cellClickArgs[0].component, pivotGrid);
    assert.ok(cellClickArgs[0].event instanceof $.Event);
    assert.strictEqual(clickHandler.callCount, 2);

});

QUnit.test('onCellClick event after resize', function(assert) {
    var cellClickArgs = [];

    var pivotGrid = createPivotGrid({
        dataSource: this.dataSource,
        onCellClick: function(e) {
            cellClickArgs.push(e);
        }
    }, assert);
    this.clock.tick();

    // act
    pivotGrid.resize();

    var $dataArea = $('#pivotGrid').find('.dx-pivotgrid-area-data');

    $($dataArea.find('tr').eq(1).find('td').eq(3)).trigger('dxclick');
    $($dataArea.find('tr').eq(2).find('td').eq(4)).trigger('dxclick');

    // assert
    assert.equal(cellClickArgs.length, 2, 'onCellClick call count');
    assert.deepEqual(cellClickArgs[0].cell, {
        columnType: 'D',
        columnPath: ['2010', '2'],
        rowPath: ['B'],
        rowType: 'D',
        dataIndex: 1,
        dataType: undefined,
        format: 'percent',
        text: '90%',
        value: 0.9
    }, 'first cell click arguments');
    assert.deepEqual(cellClickArgs[1].cell, {
        columnPath: ['2010'],
        columnType: 'T',
        rowPath: [],
        rowType: 'GT',
        dataIndex: 0,
        dataType: undefined,
        format: 'currency',
        text: '$17',
        value: 17
    }, 'second cell click arguments');
});

QUnit.test('show field chooser popup on field chooser button click', function(assert) {
    var pivotGrid = createPivotGrid({
        dataSource: {
            rows: [],
            columns: [],
            values: []
        }
    }, assert);

    assert.ok(!$('.dx-fieldchooser-popup').is(':visible'), 'fieldChooser popup is not visible');

    this.clock.tick();

    var $fieldChooserButton = $('#pivotGrid').find('.dx-pivotgrid-field-chooser-button');
    assert.strictEqual($fieldChooserButton.length, 1, 'fieldChooser button is rendered');

    // act
    $($fieldChooserButton).trigger('dxclick');
    this.clock.tick(500);
    // assert
    assert.ok($('.dx-fieldchooser-popup').is(':visible'), 'fieldChooser popup is visible');
    assert.strictEqual(dataUtils.data($('.dx-fieldchooser-popup')[0], 'dxPopup').option('showCloseButton'), true);
    assert.strictEqual(pivotGrid.getFieldChooserPopup(), dataUtils.data($('.dx-fieldchooser-popup')[0], 'dxPopup'));
    assert.strictEqual($fieldChooserButton.dxButton('option', 'hint'), 'Show Field Chooser');
    // T249095
    assert.strictEqual(dataUtils.data($('.dx-fieldchooser-popup')[0], 'dxPopup').option('minHeight'), 250);
    assert.strictEqual(dataUtils.data($('.dx-fieldchooser-popup')[0], 'dxPopup').option('minWidth'), 250);

    assert.strictEqual($('.dx-pivotgrid-toolbar').find('.dx-button').length, 1);
    assert.strictEqual($('.dx-pivotgrid-toolbar').parent()[0], pivotGrid.$element().find('.dx-area-description-cell')[0]);
    assert.ok(!pivotGrid.$element().find('.dx-area-description-cell').hasClass('dx-pivotgrid-background'));
});

QUnit.test('FieldPanel inherits visible option', function(assert) {
    // arrange, act
    var pivotGrid = createPivotGrid({
            dataSource: {
                rows: [],
                columns: [],
                values: []
            },
            fieldPanel: {
                visible: true
            },
            visible: false
        }, assert),
        fieldPanelInstance = pivotGrid.$element().dxPivotGridFieldChooserBase('instance');

    this.clock.tick();

    // assert
    assert.notOk(fieldPanelInstance.option('visible'), 'fieldPanel in invisible');
    assert.ok(pivotGrid.$element().hasClass('dx-state-invisible'), 'pivot grid saves invisible styles');
});

QUnit.test('create field chooser with search', function(assert) {
    var pivotGrid = createPivotGrid({
            dataSource: {
                rows: [],
                columns: [],
                values: []
            },
            fieldChooser: {
                allowSearch: true,
                searchTimeout: 300
            }
        }, assert),
        fieldChooserPopup = pivotGrid.getFieldChooserPopup();

    this.clock.tick();

    // act
    fieldChooserPopup.show();
    this.clock.tick(500);


    var fieldChooser = fieldChooserPopup.$content().data('dxPivotGridFieldChooser'),
        treeViewInstance = fieldChooserPopup.$content().find('.dx-treeview').dxTreeView('instance');

    // assert
    assert.ok(fieldChooser.option('allowSearch'), 'fieldChooser with search');
    assert.ok(treeViewInstance.option('searchEnabled'), 'treeview with search');
    assert.equal(treeViewInstance.option('searchTimeout'), 300, 'searchTimeout is assigned');
});

QUnit.test('clear selection and filtering in field chooser treeview on popup hidding', function(assert) {
    this.dataSource.fields[0].displayFolder = 'Folder';
    var pivotGrid = createPivotGrid({
            dataSource: this.dataSource,
            fieldChooser: {
                allowSearch: true,
            }
        }, assert),
        fieldChooserPopup = pivotGrid.getFieldChooserPopup();

    this.clock.tick();

    // act
    fieldChooserPopup.show();
    this.clock.tick(500);

    var fieldChooser = fieldChooserPopup.$content().data('dxPivotGridFieldChooser'),
        resetTreeView = sinon.spy(fieldChooser, 'resetTreeView');

    fieldChooserPopup.hide();
    this.clock.tick(500);

    // assert
    assert.ok(resetTreeView.calledOnce, 'resetTreeView was called');
});

// T752355
QUnit.test('add field to column area in field chooser when enabled state storing', function(assert) {
    var pivotGrid = createPivotGrid({
        fieldChooser: {
            applyChangesMode: 'onDemand',
            enabled: true
        },
        stateStoring: {
            enabled: true,
            type: 'custom',
            customLoad: function() {
                return $.Deferred().resolve({
                    fields: [{ dataField: 'field2', area: 'column' }]
                });
            }
        },
        dataSource: [{
            field1: '',
            field2: ''
        }]
    }, assert);

    this.clock.tick();

    // act, assert
    pivotGrid.getFieldChooserPopup().show();
    this.clock.tick(500);

    function normalizeField(field) {
        return { area: field.area, areaIndex: field.areaIndex, dataField: field.dataField };
    }

    assert.equal($('.dx-checkbox-checked').length, 1, 'one checked checkbox');

    assert.deepEqual(pivotGrid.getDataSource().state().fields.map(normalizeField), [{
        'area': undefined,
        'areaIndex': undefined,
        'dataField': 'field1'
    }, {
        'area': 'column',
        'areaIndex': 0,
        'dataField': 'field2'
    }], 'field\'s state when one field is in column area');

    $('.dx-checkbox').eq(0).trigger('dxclick');
    assert.equal($('.dx-checkbox-checked').length, 2, 'two checked checkboxes');

    $('.dx-button').eq(2).trigger('dxclick');
    this.clock.tick(500);

    assert.deepEqual(pivotGrid.getDataSource().state().fields.map(normalizeField), [{
        'area': 'column',
        'areaIndex': 1,
        'dataField': 'field1'
    }, {
        'area': 'column',
        'areaIndex': 0,
        'dataField': 'field2'
    }], 'field\'s state when two fields are in column area');
});

QUnit.test('Field panel headerFilter with search', function(assert) {
    createPivotGrid({
        dataSource: this.dataSource,
        allowFiltering: true,
        headerFilter: {
            allowSearch: true,
            searchTimeout: 300
        },
        fieldPanel: {
            visible: true
        }
    }, assert);

    this.clock.tick();

    $('#pivotGrid').find('.dx-header-filter').first().trigger('dxclick');
    this.clock.tick(500);

    // assert
    assert.ok($('.dx-header-filter-menu').find('.dx-list-search').length, 'headerFilter has searchBox');
    assert.equal($('.dx-header-filter-menu').find('.dx-list').dxList('instance').option('searchTimeout'), 300, 'search timeout is assinged');
});

QUnit.test('create toolbar buttons in applyChangesMode onDemand case', function(assert) {
    var pivotGrid = createPivotGrid({
            dataSource: this.dataSource,
            fieldChooser: {
                applyChangesMode: 'onDemand'
            }
        }, assert),
        fieldChooserPopup = pivotGrid.getFieldChooserPopup();

    this.clock.tick();

    // act
    fieldChooserPopup.show();
    this.clock.tick(500);
    // assert
    assert.equal($(fieldChooserPopup._$bottom).find('.dx-toolbar-button').length, 2, '2 buttons in toolbar');
});

QUnit.test('apply changes in fieldchooser on button click in onDemand mode', function(assert) {
    this.dataSource.fields[0].dataField = 'field1';

    var pivotGrid = createPivotGrid({
            dataSource: this.dataSource,
            allowSorting: true,
            fieldChooser: {
                applyChangesMode: 'onDemand'
            }
        }, assert),
        fieldChooserPopup = pivotGrid.getFieldChooserPopup();

    this.clock.tick();

    // act
    fieldChooserPopup.show();
    this.clock.tick(500);

    var sortIcon = $(fieldChooserPopup.content()).find('.dx-sort').eq(0);
    sortIcon.trigger('dxclick');
    this.clock.tick(500);

    assert.notEqual(pivotGrid.getDataSource().state().fields[0].sortOrder, 'desc', 'ds state is not changed yet');

    var applyButton = $(fieldChooserPopup._$bottom).find('.dx-button').eq(0);
    applyButton.trigger('dxclick');
    this.clock.tick(500);

    assert.equal(pivotGrid.getDataSource().state().fields[0].sortOrder, 'desc', 'ds state is changed');
});

QUnit.test('cancel changes on fieldchooser hidding in onDemand mode', function(assert) {
    this.dataSource.fields[0].dataField = 'field1';

    var pivotGrid = createPivotGrid({
            dataSource: this.dataSource,
            allowSorting: true,
            fieldChooser: {
                applyChangesMode: 'onDemand'
            }
        }, assert),
        fieldChooserPopup = pivotGrid.getFieldChooserPopup();

    this.clock.tick();

    // act
    fieldChooserPopup.show();
    this.clock.tick(500);

    var sortIcon = $(fieldChooserPopup.content()).find('.dx-sort').eq(0);
    sortIcon.trigger('dxclick');
    this.clock.tick(500);

    assert.notEqual(pivotGrid.getDataSource().state().fields[0].sortOrder, 'desc', 'ds state is not changed yet');

    fieldChooserPopup.hide();
    this.clock.tick(500);

    assert.notEqual(pivotGrid.getDataSource().state().fields[0].sortOrder, 'desc', 'ds state is not changed yet');
});

QUnit.test('Field panel should be updated on change headerFilter at runtime', function(assert) {
    var pivotGrid = createPivotGrid({
        dataSource: this.dataSource,
        allowFiltering: true,
        headerFilter: {
            allowSearch: true,
        },
        fieldPanel: {
            visible: true
        }
    }, assert);

    this.clock.tick();

    $('#pivotGrid').find('.dx-header-filter').first().trigger('dxclick');
    this.clock.tick(500);

    // assert
    assert.ok($('.dx-header-filter-menu').find('.dx-list-search').length, 'headerFilter has searchBox');

    // act
    pivotGrid.option('headerFilter.allowSearch', false);

    $('#pivotGrid').find('.dx-header-filter').first().trigger('dxclick');
    this.clock.tick(500);

    // assert
    assert.notOk($('.dx-header-filter-menu').find('.dx-list-search').length, 'headerFilter hasn\'t searchBox');
});

QUnit.test('Field chooser should be updated on change headerFilter at runtime', function(assert) {
    var pivotGrid = createPivotGrid({
            dataSource: this.dataSource,
            allowFiltering: true,
            headerFilter: {
                allowSearch: true,
            },
            fieldChooser: {
                enabled: true
            }
        }, assert),
        fieldChooserPopup = pivotGrid.getFieldChooserPopup();

    this.clock.tick();

    fieldChooserPopup.show();
    this.clock.tick(500);

    $(fieldChooserPopup.content()).find('.dx-header-filter').first().trigger('dxclick');
    this.clock.tick(500);

    // assert
    assert.ok($('.dx-header-filter-menu').find('.dx-list-search').length, 'headerFilter has searchBox');

    // act
    pivotGrid.option('headerFilter.allowSearch', false);

    $(fieldChooserPopup.content()).find('.dx-header-filter').first().trigger('dxclick');
    this.clock.tick(500);

    // assert
    assert.notOk($('.dx-header-filter-menu').find('.dx-list-search').length, 'headerFilter hasn\'t searchBox');
});

QUnit.test('Field panel inherits encodeHtml option', function(assert) {
    createPivotGrid({
        dataSource: {
            fields: [{ dataField: 'field1', area: 'column' }],
            store: [{ field1: 'test <test>' }]
        },
        allowFiltering: true,
        encodeHtml: true,
        fieldPanel: {
            visible: true
        }
    }, assert);

    this.clock.tick();

    // act
    $('#pivotGrid').find('.dx-header-filter').first().trigger('dxclick');
    this.clock.tick(500);

    // assert
    assert.equal($('.dx-header-filter-menu').find('.dx-list-item').text(), 'test <test>', 'encoded');
});

QUnit.test('Field chooser inherits encodeHtml option', function(assert) {
    var pivotGrid = createPivotGrid({
            dataSource: {
                fields: [{ dataField: 'field1', area: 'column' }],
                store: [{ field1: 'test <test>' }]
            },
            allowFiltering: true,
            encodeHtml: true,
            fieldChooser: {
                enabled: true
            }
        }, assert),
        fieldChooserPopup = pivotGrid.getFieldChooserPopup();

    this.clock.tick();

    // act
    fieldChooserPopup.show();
    this.clock.tick(500);

    $(fieldChooserPopup.content()).find('.dx-header-filter').first().trigger('dxclick');
    this.clock.tick(500);

    // assert
    assert.equal($('.dx-header-filter-menu').find('.dx-list-item').text(), 'test <test>', 'encoded');
});

QUnit.test('fieldChooser layout change at runtime should not hide popup', function(assert) {
    var pivotGrid = createPivotGrid({
            dataSource: {
                rows: [],
                columns: [],
                values: []
            },
            fieldChooser: {
                width: 300,
                layout: 2
            }
        }, assert),
        fieldChooserPopup = pivotGrid.getFieldChooserPopup();

    this.clock.tick();

    fieldChooserPopup.show();
    this.clock.tick(500);
    // act
    pivotGrid.option('fieldChooser', { layout: 1, width: 900 });
    // assert
    assert.ok(fieldChooserPopup.option('visible'), 'fieldChooser popup is visible');
    assert.strictEqual(fieldChooserPopup.option('width'), 900);
    assert.strictEqual(fieldChooserPopup.$content().dxPivotGridFieldChooser('instance').option('layout'), 1);
});

QUnit.test('Dragging between PivotGrid and FieldChooser', function(assert) {
    var pivotGrid = createPivotGrid({
        showDataFields: true,
        dataSource: {
            rows: [],
            columns: [],
            values: []
        }
    }, assert);

    var $pivotGrid = $('#pivotGrid');

    var dataSource = pivotGrid.getDataSource();

    var $fieldChooser1 = $('<div>').insertAfter($pivotGrid).dxPivotGridFieldChooser({
        dataSource: dataSource
    });

    var $fieldChooser2 = $('<div>').insertAfter($pivotGrid).dxPivotGridFieldChooser({
        dataSource: new PivotGridDataSource({ store: { type: 'array', data: [] } })
    });

    assert.strictEqual($pivotGrid.dxSortableOld('option', 'groupFilter').call($pivotGrid.find('.dx-area-fields').get(0)), true);
    assert.strictEqual($pivotGrid.dxSortableOld('option', 'groupFilter').call($fieldChooser1.find('.dx-area-fields').get(0)), true);
    assert.strictEqual($pivotGrid.dxSortableOld('option', 'groupFilter').call($fieldChooser2.find('.dx-area-fields').get(0)), false);

    assert.strictEqual($fieldChooser1.dxSortableOld('option', 'groupFilter').call($pivotGrid.find('.dx-area-fields').get(0)), true);
    assert.strictEqual($fieldChooser1.dxSortableOld('option', 'groupFilter').call($fieldChooser1.find('.dx-area-fields').get(0)), true);
    assert.strictEqual($fieldChooser1.dxSortableOld('option', 'groupFilter').call($fieldChooser2.find('.dx-area-fields').get(0)), false);

    assert.strictEqual($fieldChooser2.dxSortableOld('option', 'groupFilter').call($pivotGrid.find('.dx-area-fields').get(0)), false);
    assert.strictEqual($fieldChooser2.dxSortableOld('option', 'groupFilter').call($fieldChooser1.find('.dx-area-fields').get(0)), false);
    assert.strictEqual($fieldChooser2.dxSortableOld('option', 'groupFilter').call($fieldChooser2.find('.dx-area-fields').get(0)), true);
});

QUnit.test('export to excel on export click', function(assert) {
    var pivotGrid = createPivotGrid({
        dataSource: {
            rows: [],
            columns: [],
            values: []
        }
    }, assert);

    pivotGrid.exportToExcel = sinon.spy();

    this.clock.tick();

    var $exportButton = $('#pivotGrid').find('.dx-pivotgrid-export-button');
    assert.equal($exportButton.length, 0, 'no export button');

    // act
    pivotGrid.option('export.enabled', true);
    this.clock.tick();

    // assert
    $exportButton = $('#pivotGrid').find('.dx-pivotgrid-export-button');
    assert.equal($exportButton.length, 1, 'export button exists');

    // act
    $($exportButton).trigger('dxclick');

    // assert
    assert.equal(pivotGrid.exportToExcel.callCount, 1, 'exportToExcel method called one');
    assert.strictEqual($exportButton.dxButton('option', 'hint'), 'Export to Excel file');

});

QUnit.test('T257099. Hide fieldChooser popup on dataSource changed', function(assert) {
    var pivotGrid = createPivotGrid({
        dataSource: {
            rows: [],
            columns: [],
            values: []
        }
    }, assert);

    pivotGrid.getFieldChooserPopup().show();
    this.clock.tick();
    assert.ok($('.dx-fieldchooser-popup').is(':visible'), 'fieldChooser popup is visible');
    // act
    pivotGrid.option('dataSource', this.testOptions.dataSource);
    this.clock.tick(500);
    // assert
    assert.ok(!$('.dx-fieldchooser-popup').is(':visible'), 'fieldChooser popup is not visible after change dataSource');
    assert.strictEqual(pivotGrid.getFieldChooserPopup().$content().dxPivotGridFieldChooser('option', 'dataSource'), pivotGrid.getDataSource(), 'dataSource changed');

});

QUnit.test('not show field chooser popup on description area click when fieldChooser disabled', function(assert) {
    createPivotGrid({
        fieldChooser: {
            enabled: false
        },
        dataSource: {
            rows: [],
            columns: [],
            values: []
        }
    }, assert);

    assert.ok(!$('.dx-fieldchooser-popup').is(':visible'), 'fieldChooser popup is not visible');

    var $descriptionCell = $('#pivotGrid').find('td').first();

    this.clock.tick();
    // act
    $($descriptionCell).trigger('dxclick');

    // assert
    assert.ok(!$('.dx-fieldchooser-popup').is(':visible'), 'fieldChooser popup is not visible');
});

// T248731
QUnit.test('resize field chooser popup', function(assert) {
    var pivotGrid = createPivotGrid({
        dataSource: {
            rows: [],
            columns: [],
            values: []
        }
    }, assert);

    this.clock.tick();
    // act
    pivotGrid.getFieldChooserPopup().show();
    this.clock.tick(500);

    // assert
    var $fieldChooserPopup = $('.dx-fieldchooser-popup');
    assert.ok($fieldChooserPopup.is(':visible'), 'fieldChooser popup is visible');

    // act
    var $handle = $fieldChooserPopup.find('.dx-resizable-handle-corner-bottom-right'),
        pointer = pointerMock($handle).start(),
        $fieldChooser = $fieldChooserPopup.find('.dx-pivotgridfieldchooser'),
        fieldChooserHeight = $fieldChooser.outerHeight(true),
        fieldChooserWidth = $fieldChooser.outerWidth(true),
        $fieldChooserContainer = $fieldChooserPopup.find('.dx-pivotgridfieldchooser-container'),
        fieldChooserContainerHeight = $fieldChooserContainer.height();

    pointer.dragStart().drag(10, 15);

    // assert
    assert.equal($handle.length, 1, 'resizable handle exists');
    assert.equal($fieldChooser.length, 1, 'pivotgridfieldchooser exists');
    assert.equal($fieldChooser.outerWidth(true), fieldChooserWidth + 10, 'width of fieldChooser was changed');
    assert.equal($fieldChooser.outerHeight(true), fieldChooserHeight + 15, 'height of fieldChooser was changed');
    assert.ok($fieldChooserContainer.height() > fieldChooserContainerHeight, 'height of fieldChooser container was changed');
});

QUnit.test('rtlEnabled assign for all children widgets', function(assert) {
    var pivotGrid = createPivotGrid({
        rtlEnabled: true
    }, assert);

    // act
    this.clock.tick();

    pivotGrid.getFieldChooserPopup().show();

    this.clock.tick(500);

    // assert
    var $widgets = $('.dx-widget');

    $.each($widgets, function() {
        var $widget = $(this),
            componentNames = dataUtils.data($widget[0], 'dxComponents');

        $.each(componentNames, function(index, componentName) {
            if(componentName.indexOf('dxPrivateComponent') === -1 && componentName !== 'dxToolbarBase') {
                assert.ok(dataUtils.data($widget[0], componentName).option('rtlEnabled'), 'rtlEnabled for ' + componentName + ' assigned');
            }
        });
    });

    assert.ok(pivotGrid.$element().hasClass('dx-rtl'), 'dx-rtl class added to PivotGrid element');
});

QUnit.test('changing rtlEnabled for all children widgets', function(assert) {
    var pivotGrid = createPivotGrid({
        rtlEnabled: true
    }, assert);

    this.clock.tick();

    pivotGrid._fieldChooserPopup.show();

    this.clock.tick(500);

    // act
    pivotGrid.option('rtlEnabled', false);

    pivotGrid._fieldChooserPopup.show();

    this.clock.tick(500);

    // assert
    var $widgets = $('.dx-widget');

    $.each($widgets, function() {
        var $widget = $(this),
            componentNames = dataUtils.data($widget[0], 'dxComponents');

        $.each(componentNames, function(index, componentName) {
            if(componentName !== 'dxCheckBox' && componentName !== 'dxButton') {
                assert.ok(!dataUtils.data($widget[0], componentName).option('rtlEnabled'), 'rtlEnabled disabled for ' + componentName);
            }
        });
    });

    assert.ok(!pivotGrid.$element().hasClass('dx-rtl'), 'dx-rtl class removed from PivotGrid element');
});

QUnit.test('onCellPrepared event', function(assert) {
    var cellPreparedArgs = { length: 0 };

    // act
    var pivotGrid = createPivotGrid({
        dataSource: this.dataSource,
        onCellPrepared: function(e) {
            if(e.columnIndex === 0 && e.rowIndex === 1) {
                cellPreparedArgs[e.area] = e;
                cellPreparedArgs.length++;
            }
        }
    }, assert);

    // assert
    assert.equal(cellPreparedArgs.length, 3, 'cellPreparedArgs count');

    assert.equal(isRenderer(cellPreparedArgs.row.cellElement), !!config().useJQuery, 'row area cellElement');
    assert.strictEqual($(cellPreparedArgs.row.cellElement).text(), 'B', 'row area cellElement');
    assert.strictEqual(cellPreparedArgs.row.element, pivotGrid.element(), 'element');
    assert.strictEqual(cellPreparedArgs.row.component, pivotGrid, 'component');
    delete cellPreparedArgs.row.cellElement;
    delete cellPreparedArgs.row.element;
    delete cellPreparedArgs.row.component;
    assert.deepEqual(cellPreparedArgs.row, {
        area: 'row',
        rowIndex: 1,
        columnIndex: 0,
        cell: {
            dataSourceIndex: 1,
            isLast: true,
            type: 'D',
            path: ['B'],
            text: 'B'
        }
    }, 'row area cell prepared args');

    assert.strictEqual($(cellPreparedArgs.column.cellElement).text(), 'Q1', 'column area cellElement');
    delete cellPreparedArgs.column.cellElement;
    delete cellPreparedArgs.column.cellElement;
    delete cellPreparedArgs.column.element;
    delete cellPreparedArgs.column.component;
    assert.deepEqual(cellPreparedArgs.column, {
        area: 'column',
        rowIndex: 1,
        columnIndex: 0,
        cell: {
            colspan: 2,
            dataSourceIndex: 0,
            type: 'D',
            path: ['2010', '1'],
            text: 'Q1'
        }
    }, 'column area cell prepared args');

    assert.strictEqual($(cellPreparedArgs.data.cellElement).text(), '$2', 'data area cellElement');
    delete cellPreparedArgs.data.cellElement;
    delete cellPreparedArgs.data.cellElement;
    delete cellPreparedArgs.data.element;
    delete cellPreparedArgs.data.component;
    assert.deepEqual(cellPreparedArgs.data, {
        area: 'data',
        rowIndex: 1,
        columnIndex: 0,
        cell: {
            dataIndex: 0,
            dataType: undefined,
            format: 'currency',
            columnPath: ['2010', '1'],
            rowPath: ['B'],
            columnType: 'D',
            rowType: 'D',
            text: '$2',
            value: 2
        }
    }, 'data area cell prepared args');

});

QUnit.test('subscribe to onCellPrepared event', function(assert) {
    var cellPreparedArgs = { length: 0 };

    // act
    var pivotGrid = createPivotGrid({
        dataSource: this.dataSource
    }, assert);

    pivotGrid.on('cellPrepared', function(e) {
        if(e.columnIndex === 0 && e.rowIndex === 1) {
            cellPreparedArgs[e.area] = e;
            cellPreparedArgs.length++;
        }
    });

    pivotGrid.repaint();

    // assert
    assert.equal(cellPreparedArgs.length, 3, 'cellPreparedArgs count');

    assert.strictEqual($(cellPreparedArgs.row.cellElement).text(), 'B', 'row area cellElement');
    assert.strictEqual(cellPreparedArgs.row.element, pivotGrid.element(), 'element');
    assert.strictEqual(cellPreparedArgs.row.component, pivotGrid, 'component');
    delete cellPreparedArgs.row.cellElement;
    delete cellPreparedArgs.row.element;
    delete cellPreparedArgs.row.component;
    assert.deepEqual(cellPreparedArgs.row, {
        area: 'row',
        rowIndex: 1,
        columnIndex: 0,
        cell: {
            dataSourceIndex: 1,
            isLast: true,
            type: 'D',
            path: ['B'],
            text: 'B'
        }
    }, 'row area cell prepared args');

    assert.strictEqual($(cellPreparedArgs.column.cellElement).text(), 'Q1', 'column area cellElement');
    delete cellPreparedArgs.column.cellElement;
    delete cellPreparedArgs.column.cellElement;
    delete cellPreparedArgs.column.element;
    delete cellPreparedArgs.column.component;
    assert.deepEqual(cellPreparedArgs.column, {
        area: 'column',
        rowIndex: 1,
        columnIndex: 0,
        cell: {
            colspan: 2,
            dataSourceIndex: 0,
            type: 'D',
            path: ['2010', '1'],
            text: 'Q1'
        }
    }, 'column area cell prepared args');

    assert.strictEqual($(cellPreparedArgs.data.cellElement).text(), '$2', 'data area cellElement');
    delete cellPreparedArgs.data.cellElement;
    delete cellPreparedArgs.data.cellElement;
    delete cellPreparedArgs.data.element;
    delete cellPreparedArgs.data.component;
    assert.deepEqual(cellPreparedArgs.data, {
        area: 'data',
        rowIndex: 1,
        columnIndex: 0,
        cell: {
            dataIndex: 0,
            dataType: undefined,
            format: 'currency',
            columnPath: ['2010', '1'],
            rowPath: ['B'],
            columnType: 'D',
            rowType: 'D',
            text: '$2',
            value: 2
        }
    }, 'data area cell prepared args');

});

QUnit.test('onCellPrepared event cellElement must be attached to dom and have correct styles', function(assert) {
    var isCellPreparedCalled = false;

    // act
    createPivotGrid({
        dataSource: this.dataSource,
        onCellPrepared: function(e) {
            if(e.cell.text === '2010') {
                assert.equal($(e.cellElement).closest(document).length, 1, 'cellElement is attached to dom');
                assert.equal($(e.cellElement).css('textAlign'), 'left', 'cellElement text-align');
                isCellPreparedCalled = true;
            }
        }
    }, assert);

    // assert
    assert.ok(isCellPreparedCalled, 'cellPrepared called');
});

QUnit.test('onCellPrepared event should change in runtime', function(assert) {
    // act
    var oldHandler = sinon.stub(),
        newHandler = sinon.stub(),

        pivotGrid = createPivotGrid({
            dataSource: {
                fields: [
                    { area: 'row' },
                    { format: 'decimal', area: 'column' },
                    { caption: 'Sum1', format: 'currency', area: 'data' }
                ],
                rows: [
                    { value: 'A', index: 0 },
                    { value: 'B', index: 1 }
                ],
                columns: [
                    { value: '2010', index: 2 },
                    { value: '2012', index: 3 }
                ],
                values: [
                    [[1, 0.1], [8, 0.8], [15, 0.15], [36, 0.36], [43, 0.43]],
                    [[2, 0.2], [9, 0.9], [16, 0.16], [37, 0.37], [44, 0.44]]
                ]
            },
            onCellPrepared: oldHandler
        }, assert);

    pivotGrid.on('cellPrepared', function() { });

    // assert
    oldHandler.reset();
    pivotGrid.option('onCellPrepared', newHandler);

    pivotGrid.repaint();

    assert.ok(!oldHandler.callCount);
    assert.strictEqual(newHandler.callCount, 15);
});

QUnit.test('contextMenu', function(assert) {
    var contextMenuArgs = [],
        testItemClicked;

    var pivotGrid = createPivotGrid({
        dataSource: this.dataSource
    }, assert);

    pivotGrid.on('contextMenuPreparing', function(e) {
        contextMenuArgs.push(e);
        e.items.push({ text: 'Test', onItemClick: function() { testItemClicked = true; } });
    });

    var $dataArea = $('#pivotGrid').find('.dx-pivotgrid-area-data');

    this.clock.tick();

    // act
    $($dataArea.find('tr').eq(1).find('td').eq(3)).trigger('dxcontextmenu');

    // assert
    assert.equal(contextMenuArgs.length, 1, 'onCellClick call count');
    assert.deepEqual(contextMenuArgs[0].cell, {
        columnType: 'D',
        columnPath: ['2010', '2'],
        rowPath: ['B'],
        rowType: 'D',
        dataIndex: 1,
        dataType: undefined,
        format: 'percent',
        text: '90%',
        value: 0.9
    }, 'first cell contextmenu cell arguments');

    assert.equal(contextMenuArgs[0].items.length, 2, 'first cell contextmenu items count');
    assert.equal(contextMenuArgs[0].items[0].text, 'Show Field Chooser', 'first context menu item text');
    assert.equal(contextMenuArgs[0].items[1].text, 'Test', 'second context menu item text');

    var $menuItems = $('.dx-pivotgrid.dx-context-menu .dx-menu-item');
    assert.equal($menuItems.length, 2, 'context menu items count');

    // act
    $($menuItems.eq(1)).trigger('dxclick');

    // assert
    assert.ok(testItemClicked, 'Test item clicked');
});

// T753856
QUnit.test('contextMenu in field chooser', function(assert) {
    var contextMenuPreparing = sinon.spy(),
        pivotGrid = createPivotGrid({
            dataSource: {
                fields: [{
                    dataField: 'id',
                    area: 'row'
                }],
                store: [{
                    'id': 1
                }]
            },
            fieldChooser: {
                enabled: true
            },
            onContextMenuPreparing: contextMenuPreparing
        }, assert);

    this.clock.tick();

    // act
    pivotGrid.getFieldChooserPopup().show();

    this.clock.tick(500);

    $('.dx-area').eq(1).find('.dx-area-field-content').eq(0).trigger('dxcontextmenu');

    // assert
    assert.equal(contextMenuPreparing.callCount, 1, 'contextMenuPreparing event fired only once');

    var args = contextMenuPreparing.getCall(0).args[0];
    assert.strictEqual(args.component.NAME, 'dxPivotGrid', 'handler was called by dxPivotGrid component');
    assert.deepEqual(args.field, args.component.getDataSource().field(0), 'field');
});

QUnit.test('contextMenu on Total node when rowHeaderLayout is \'tree\'', function(assert) {
    this.dataSource.rows[0].children = [{ value: 'P1', index: 0 }, { value: 'P2', index: 1 }];
    this.dataSource.fields.push({ area: 'row' });

    var pivotGrid = createPivotGrid({
            dataSource: this.dataSource,
            allowExpandAll: true,
            rowHeaderLayout: 'tree'
        }, assert),

        contextMenuPreparing = sinon.stub();

    pivotGrid.on('contextMenuPreparing', contextMenuPreparing);

    this.clock.tick();

    // acts
    $('.dx-pivotgrid-vertical-headers .dx-pivotgrid-expanded').trigger('dxcontextmenu');
    $('.dx-pivotgrid-vertical-headers .dx-pivotgrid-collapsed').trigger('dxcontextmenu');

    $('.dx-pivotgrid-horizontal-headers .dx-pivotgrid-expanded').trigger('dxcontextmenu');
    $('.dx-pivotgrid-horizontal-headers .dx-pivotgrid-collapsed').trigger('dxcontextmenu');

    $('.dx-pivotgrid-vertical-headers .dx-white-space-column').trigger('dxcontextmenu');
    $('.dx-pivotgrid-vertical-headers .dx-grandtotal').trigger('dxcontextmenu');

    // assert
    assert.strictEqual(contextMenuPreparing.callCount, 6);
    assert.strictEqual(contextMenuPreparing.getCall(0).args[0].items[0].text, 'Expand All');
    assert.strictEqual(contextMenuPreparing.getCall(1).args[0].items[0].text, 'Expand All');
    assert.strictEqual(contextMenuPreparing.getCall(2).args[0].items[0].text, 'Expand All');
    assert.strictEqual(contextMenuPreparing.getCall(3).args[0].items[0].text, 'Expand All');
    assert.strictEqual(contextMenuPreparing.getCall(4).args[0].items[0].text, 'Expand All');
    assert.strictEqual(contextMenuPreparing.getCall(5).args[0].items[0].text, 'Show Field Chooser');
});

QUnit.test('contextMenu on header node when allowExpandedAll is false', function(assert) {
    this.dataSource.rows[0].children = [{ value: 'P1', index: 0 }, { value: 'P2', index: 1 }];
    this.dataSource.fields.push({ area: 'row' });

    var pivotGrid = createPivotGrid({
            dataSource: this.dataSource,
            rowHeaderLayout: 'tree',
            allowExpandAll: false
        }, assert),

        contextMenuPreparing = sinon.stub();

    pivotGrid.on('contextMenuPreparing', contextMenuPreparing);

    this.clock.tick();

    // acts
    $('.dx-pivotgrid-vertical-headers .dx-pivotgrid-expanded').trigger('dxcontextmenu');

    // assert
    assert.strictEqual(contextMenuPreparing.callCount, 1);
    assert.strictEqual(contextMenuPreparing.getCall(0).args[0].items.length, 1);
    assert.strictEqual(contextMenuPreparing.getCall(0).args[0].items[0].text, 'Show Field Chooser');
});

QUnit.test('Context menu when click on field chooser', function(assert) {
    var contextMenuArgs = [],
        pivotGrid = createPivotGrid({
            dataSource: this.dataSource,
            fieldPanel: {
                showRowFields: true,
                showFilterFields: true,
                visible: true
            },
            onContextMenuPreparing: function(e) {
                contextMenuArgs.push(e);
            }
        }, assert),
        $fieldsArea = $('#pivotGrid').find('.dx-pivotgrid-fields-area'),
        $dataFields = $fieldsArea.eq(1),
        $filterFields = $fieldsArea.eq(0);

    // act
    $($filterFields.children().eq(0)).trigger('dxcontextmenu');
    $($dataFields.find('td').eq(0).children()).trigger('dxcontextmenu');

    // assert
    assert.equal(contextMenuArgs.length, 2, 'onContextMenuPreparing call count');
    assert.ok(!contextMenuArgs[0].field, 'no fields in filter');
    assert.equal(contextMenuArgs[1].field, pivotGrid.getDataSource().field('Sum1'), 'first field in column');
});

QUnit.test('Context menu when no data', function(assert) {
    var contextMenuArgs = [],
        $dataArea;

    createPivotGrid({
        onContextMenuPreparing: function(e) {
            contextMenuArgs.push(e);
        }
    }, assert);

    this.clock.tick();
    $dataArea = $('#pivotGrid').find('.dx-pivotgrid-area-data');
    // act
    $($dataArea.children().eq(0)).trigger('dxcontextmenu');

    // assert
    assert.equal(contextMenuArgs.length, 1, 'onCellClick call count');
    assert.equal(contextMenuArgs[0].items.length, 1, 'first cell contextmenu items count');
    assert.equal(contextMenuArgs[0].items[0].text, 'Show Field Chooser', 'first context menu item text');
});

// T278129
QUnit.test('Context menu when click target no pivot table', function(assert) {
    var pivotGrid = createPivotGrid({
            onContextMenuPreparing: sinon.stub,
        }, assert),
        $target;

    $target = $('#pivotGrid').find('.dx-widget.dx-pivotgrid');

    // act
    $($target).trigger('dxcontextmenu');

    // assert
    assert.ok(!pivotGrid.option('onContextMenuPreparing').called, 'should not be context menu');
});

QUnit.test('collapse All items', function(assert) {
    var contextMenuArgs = [],
        pivotGrid = createPivotGrid({

            dataSource: {
                fields: [
                    { format: 'decimal', area: 'column', allowExpandAll: true, expanded: true, index: 0 },
                    { dataField: 'd', area: 'row' },
                    { format: { format: 'quarter', dateType: 'full' }, area: 'column', index: 1 },
                    { caption: 'Sum1', format: 'currency', area: 'data', index: 2 }
                ],
                rows: [
                    { value: 'A', index: 0 },
                    { value: 'B', index: 1 }
                ],
                columns: [{
                    value: '2010', index: 2,
                    children: [
                        { value: '1', index: 0 },
                        { value: '2', index: 1 }
                    ]
                }, {
                    value: '2012', index: 3
                }],
                values: [
                    [[1, 0.1], [8, 0.8], [15, 0.15], [36, 0.36], [43, 0.43]],
                    [[2, 0.2], [9, 0.9], [16, 0.16], [37, 0.37], [44, 0.44]],
                    [[3, 0.3], [10, 0.1], [17, 0.17], [38, 0.38], [45, 0.45]]
                ]
            },
            onContextMenuPreparing: function(e) {
                contextMenuArgs.push(e);
            }
        }, assert),
        dataSource = pivotGrid.getDataSource();

    sinon.spy(dataSource, 'load');
    sinon.spy(dataSource, 'collapseAll');

    // act
    $('#pivotGrid').find('.dx-pivotgrid-horizontal-headers .dx-pivotgrid-collapsed').trigger('dxcontextmenu');
    contextMenuArgs[0].items[1].onItemClick();
    // assert
    assert.ok(!dataSource.load.called);
    assert.deepEqual(dataSource.collapseAll.lastCall.args, [0], 'collapseLevel args');
});

QUnit.test('change allowExpandAll, allowFiltering, allowSorting, allowSortingBySummary at runtime', function(assert) {
    var pivotGrid = createPivotGrid({
        allowExpandAll: true,
        allowFiltering: true,
        allowSorting: true,
        allowSortingBySummary: true,
        dataSource: {
            fields: [
                {
                    format: 'decimal', area: 'column', allowExpandAll: true,
                    allowFiltering: true,
                    allowSorting: true,
                    allowSortingBySummary: true,
                    expanded: true, index: 0
                },
                { dataField: 'd', area: 'row' },
                { format: { format: 'quarter', dateType: 'full' }, area: 'column', index: 1 },
                { caption: 'Sum1', format: 'currency', area: 'data', index: 2 }
            ],
            rows: [
                { value: 'A', index: 0 },
                { value: 'B', index: 1 }
            ],
            columns: [{
                value: '2010', index: 2,
                children: [
                    { value: '1', index: 0 },
                    { value: '2', index: 1 }
                ]
            }, {
                value: '2012', index: 3
            }],
            values: [
                [[1, 0.1], [8, 0.8], [15, 0.15], [36, 0.36], [43, 0.43]],
                [[2, 0.2], [9, 0.9], [16, 0.16], [37, 0.37], [44, 0.44]],
                [[3, 0.3], [10, 0.1], [17, 0.17], [38, 0.38], [45, 0.45]]
            ]
        }
    }, assert);
    // act
    pivotGrid.option('allowExpandAll', false);
    pivotGrid.option('allowFiltering', false);
    pivotGrid.option('allowSorting', false);
    pivotGrid.option('allowSortingBySummary', false);

    // assert
    assert.strictEqual(pivotGrid.getDataSource().field(0).allowExpandAll, true);
    assert.strictEqual(pivotGrid.getDataSource().field(1).allowExpandAll, false);

    assert.strictEqual(pivotGrid.getDataSource().field(0).allowFiltering, true);
    assert.strictEqual(pivotGrid.getDataSource().field(1).allowFiltering, false);

    assert.strictEqual(pivotGrid.getDataSource().field(0).allowSorting, true);
    assert.strictEqual(pivotGrid.getDataSource().field(1).allowSorting, false);

    assert.strictEqual(pivotGrid.getDataSource().field(0).allowSortingBySummary, true);
    assert.strictEqual(pivotGrid.getDataSource().field(1).allowSortingBySummary, false);
});

QUnit.test('Sorting by Summary context menu with zero value', function(assert) {
    var contextMenuArgs = [],
        dataSourceInstance = new PivotGridDataSource({
            fields: [
                { dataField: 'field1', area: 'row' },
                { dataField: 'field2', area: 'data', summaryType: 'sum' }
            ],
            store: [
                { field1: 'e1', field2: 0.0 },
                { field1: 'e2', field2: -4.0 },
                { field1: 'e3', field2: 1.0 },
            ]
        });

    createPivotGrid({
        onContextMenuPreparing: function(e) {
            contextMenuArgs.push(e);
        },
        allowSortingBySummary: true,
        dataSource: dataSourceInstance
    }, assert);

    this.clock.tick(500);

    // act
    $('#pivotGrid').find('.dx-pivotgrid-horizontal-headers td').last().trigger('dxcontextmenu');
    contextMenuArgs[0].items[0].onItemClick();
    this.clock.tick(500);

    var $rows = $('#pivotGrid').find('tbody.dx-pivotgrid-vertical-headers').children();

    assert.equal($rows.eq(0).text(), 'e3');
    assert.equal($rows.eq(1).text(), 'e1');
    assert.equal($rows.eq(2).text(), 'e2');
});

QUnit.test('Sorting by Summary should not be allowd if paginate is true', function(assert) {
    var contextMenuArgs = [],
        dataSourceInstance = new PivotGridDataSource({
            fields: [
                { dataField: 'field1', area: 'row' },
                { dataField: 'field2', area: 'data', summaryType: 'sum' }
            ],
            store: [
                { field1: 'e1', field2: 0.0 },
                { field1: 'e2', field2: -4.0 },
                { field1: 'e3', field2: 1.0 },
            ]
        });

    createPivotGrid({
        onContextMenuPreparing: function(e) {
            contextMenuArgs.push(e);
        },
        allowSortingBySummary: true,
        dataSource: dataSourceInstance
    }, assert);

    dataSourceInstance.paginate = function() {
        return true;
    };

    this.clock.tick(500);

    // act
    $('#pivotGrid').find('.dx-pivotgrid-horizontal-headers td').last().trigger('dxcontextmenu');

    assert.deepEqual(contextMenuArgs[0].items.map(function(i) { return i.text; }), ['Show Field Chooser'], 'context menu items');
});

// T833006
QUnit.test('load dataSource after PivotGrid dispose', function(assert) {
    var dataSource = new PivotGridDataSource({
        store: []
    });

    var pivotGrid = createPivotGrid({}, assert);

    pivotGrid.option('dataSource', dataSource);
    this.clock.tick();

    var isLoaded = false;

    // act
    pivotGrid.dispose();
    dataSource.load().done(function() {
        isLoaded = true;
    });
    this.clock.tick();

    // assert
    assert.ok(isLoaded, 'data source is loaded');
});

QUnit.test('Sorting by Summary context menu', function(assert) {
    var contextMenuArgs = [],
        pivotGrid = createPivotGrid({
            fieldChooser: {
                enabled: false
            },
            allowSortingBySummary: true,
            dataSource: {
                fields: [
                    { format: 'decimal', area: 'column', expanded: true },

                    { format: { format: 'quarter', dateType: 'full' }, area: 'column' },
                    { dataField: 'Product', area: 'row', index: 2 },
                    { dataField: 'sum1', caption: 'Sum1', format: 'currency', area: 'data' }
                ],
                rows: [
                    { value: 'A', index: 0 },
                    { value: 'B', index: 1 }
                ],
                columns: [{
                    value: '2010', index: 2,
                    children: [
                        { value: '1', index: 0 },
                        { value: '2', index: 1 }
                    ]
                }, {
                    value: '2012', index: 3
                }],
                values: [
                    [[1, 0.1], [8, 0.8], [15, 0.15], [36, 0.36], [43, 0.43]],
                    [[2, 0.2], [9, 0.9], [16, 0.16], [37, 0.37], [44, 0.44]],
                    [[3, 0.3], [10, 0.1], [17, 0.17], [38, 0.38], [45, 0.45]]
                ]
            }
        }, assert);

    pivotGrid.option('onContextMenuPreparing', function(e) {
        contextMenuArgs.push(e);
    });

    var dataSource = pivotGrid.getDataSource();

    sinon.spy(dataSource, 'field');
    sinon.spy(dataSource, 'load');

    // act
    $('#pivotGrid').find('.dx-pivotgrid-horizontal-headers td').last().trigger('dxcontextmenu');

    // assert
    assert.equal(contextMenuArgs[0].items.length, 1);
    assert.equal(contextMenuArgs[0].items[0].text, 'Sort "Product" by This Column');
    assert.equal(contextMenuArgs[0].items[0].icon, 'none');

    // act
    contextMenuArgs[0].items[0].onItemClick();

    // assert
    assert.ok(dataSource.load.calledOnce);
    assert.ok(dataSource.field.calledOnce);
    assert.deepEqual(dataSource.field.lastCall.args, [2, {
        sortBySummaryField: 'Sum1',
        sortBySummaryPath: ['2010', '2'],
        sortOrder: 'desc'
    }], 'field args');

    // act
    contextMenuArgs[0].items[0].onItemClick();

    // assert
    assert.deepEqual(dataSource.field.lastCall.args, [2, {
        sortBySummaryField: 'Sum1',
        sortBySummaryPath: ['2010', '2'],
        sortOrder: 'asc'
    }], 'field args');
});

// T644193
QUnit.test('Sorting by Summary context menu if several fields with same caption', function(assert) {
    var contextMenuArgs = [],
        pivotGrid = createPivotGrid({
            fieldChooser: {
                enabled: false
            },
            allowSortingBySummary: true,
            showColumnGrandTotals: false,
            dataSource: {
                fields: [
                    { format: 'decimal', area: 'column', expanded: true },

                    { format: { format: 'quarter', dateType: 'full' }, area: 'column' },
                    { dataField: 'Product', area: 'row', index: 2 },
                    { dataField: 'sum1', caption: 'Sum', format: 'currency', area: 'data', name: 'Sum1' },
                    { dataField: 'sum1', caption: 'Sum', format: 'currency', area: 'data', name: 'Sum2' },
                ],
                rows: [
                    { value: 'A', index: 0 },
                    { value: 'B', index: 1 }
                ],
                columns: [{
                    value: '2010', index: 2,
                    children: [
                        { value: '1', index: 0 },
                        { value: '2', index: 1 }
                    ]
                }, {
                    value: '2012', index: 3
                }],
                values: [
                    [[1, 0.1], [8, 0.8], [15, 0.15], [36, 0.36], [43, 0.43]],
                    [[2, 0.2], [9, 0.9], [16, 0.16], [37, 0.37], [44, 0.44]],
                    [[3, 0.3], [10, 0.1], [17, 0.17], [38, 0.38], [45, 0.45]]
                ]
            }
        }, assert);

    pivotGrid.option('onContextMenuPreparing', function(e) {
        contextMenuArgs.push(e);
    });

    var dataSource = pivotGrid.getDataSource();

    sinon.spy(dataSource, 'field');
    sinon.spy(dataSource, 'load');

    // act
    $('#pivotGrid').find('.dx-pivotgrid-horizontal-headers td').last().trigger('dxcontextmenu');

    // assert
    assert.equal(contextMenuArgs[0].items.length, 1);
    assert.equal(contextMenuArgs[0].items[0].text, 'Sort "Product" by This Column');
    assert.equal(contextMenuArgs[0].items[0].icon, 'none');

    // act
    contextMenuArgs[0].items[0].onItemClick();

    // assert
    assert.ok(dataSource.load.calledOnce);
    assert.ok(dataSource.field.calledOnce);
    assert.deepEqual(dataSource.field.lastCall.args, [2, {
        sortBySummaryField: 'Sum2',
        sortBySummaryPath: ['2012'],
        sortOrder: 'desc'
    }], 'field args');
});

QUnit.test('Sorting by Summary context menu when sorting defined', function(assert) {
    var contextMenuArgs = [],
        pivotGrid = createPivotGrid({
            fieldChooser: {
                enabled: false
            },
            allowSortingBySummary: true,

            dataSource: {
                fields: [
                    { format: 'decimal', area: 'column', expanded: true },
                    { format: { format: 'quarter', dateType: 'full' }, area: 'column' },
                    { dataField: 'Product', area: 'row', sortBySummaryField: 'sum1', sortBySummaryPath: ['2010', '2'] },
                    { caption: 'Sum1', format: 'currency', area: 'data', dataField: 'sum1' }
                ],
                rows: [
                    { value: 'A', index: 0 },
                    { value: 'B', index: 1 }
                ],
                columns: [{
                    value: '2010', index: 2,
                    children: [
                        { value: '1', index: 0 },
                        { value: '2', index: 1 }
                    ]
                }, {
                    value: '2012', index: 3
                }],
                values: [
                    [[1, 0.1], [8, 0.8], [15, 0.15], [36, 0.36], [43, 0.43]],
                    [[2, 0.2], [9, 0.9], [16, 0.16], [37, 0.37], [44, 0.44]],
                    [[3, 0.3], [10, 0.1], [17, 0.17], [38, 0.38], [45, 0.45]]
                ]
            },
            onContextMenuPreparing: function(e) {
                contextMenuArgs.push(e);
            }
        }, assert);

    var dataSource = pivotGrid.getDataSource();

    sinon.spy(dataSource, 'field');
    sinon.spy(dataSource, 'load');

    // act
    var $cell = $('#pivotGrid').find('.dx-pivotgrid-horizontal-headers tr').last().children().eq(1);
    $($cell).trigger('dxcontextmenu');

    // assert
    assert.equal($cell.find('.dx-icon-sorted').length, 1, 'sorted icon applied');
    assert.equal($('#pivotGrid').find('.dx-icon-sorted').length, 1, 'only one sorted icon applied');
    assert.equal(contextMenuArgs[0].items.length, 2);
    assert.equal(contextMenuArgs[0].items[0].text, 'Sort "Product" by This Column');
    assert.equal(contextMenuArgs[0].items[0].icon, 'sortuptext');

    assert.equal(contextMenuArgs[0].items[1].text, 'Remove All Sorting');
    assert.equal(contextMenuArgs[0].items[1].icon, 'none');

    // act
    contextMenuArgs[0].items[1].onItemClick();

    // assert
    assert.ok(dataSource.load.calledOnce);
    assert.ok(dataSource.field.calledOnce);
    assert.deepEqual(dataSource.field.lastCall.args, [2, {
        sortBySummaryField: undefined,
        sortBySummaryPath: undefined,
        sortOrder: undefined
    }], 'field args');
});

QUnit.test('Render to invisible container', function(assert) {
    this.testOptions.scrolling = {
        useNative: true
    };

    var $pivotGridElement = $('#pivotGrid')
            .hide()
            .width(2000)
            .height('200px'),
        pivotGrid = createPivotGrid(this.testOptions, assert);

    $pivotGridElement.show();

    domUtils.triggerShownEvent($pivotGridElement);

    assert.ok(pivotGrid._rowsArea.hasScroll(), 'has vertical scroll');
    assert.ok(!pivotGrid._columnsArea.hasScroll(), 'has no horizontal scroll');
    assert.equal(pivotGrid.__scrollBarWidth, getScrollBarWidth());
});

QUnit.test('Sorting by Summary context menu when sorting defined for grand total', function(assert) {
    var contextMenuArgs = [],
        pivotGrid = createPivotGrid({
            fieldChooser: {
                enabled: false
            },
            allowSortingBySummary: true,

            dataSource: {
                fields: [
                    { format: 'decimal', area: 'column', expanded: true },
                    { format: { format: 'quarter', dateType: 'full' }, area: 'column' },
                    { dataField: 'Product', area: 'row', sortBySummaryField: 'sum1' },
                    { caption: 'Sum1', format: 'currency', area: 'data', dataField: 'sum1' }
                ],
                rows: [
                    { value: 'A', index: 0 },
                    { value: 'B', index: 1 }
                ],
                columns: [{
                    value: '2010', index: 2,
                    children: [
                        { value: '1', index: 0 },
                        { value: '2', index: 1 }
                    ]
                }, {
                    value: '2012', index: 3
                }],
                values: [
                    [[1, 0.1], [8, 0.8], [15, 0.15], [36, 0.36], [43, 0.43]],
                    [[2, 0.2], [9, 0.9], [16, 0.16], [37, 0.37], [44, 0.44]],
                    [[3, 0.3], [10, 0.1], [17, 0.17], [38, 0.38], [45, 0.45]]
                ]
            },
            onContextMenuPreparing: function(e) {
                contextMenuArgs.push(e);
            }
        }, assert);

    var dataSource = pivotGrid.getDataSource();

    sinon.spy(dataSource, 'field');
    sinon.spy(dataSource, 'load');

    // act
    var $cell = $('#pivotGrid').find('.dx-pivotgrid-horizontal-headers tr').first().children().last();
    $($cell).trigger('dxcontextmenu');

    // assert
    assert.equal($cell.find('.dx-icon-sorted').length, 1, 'sorted icon applied');
    assert.equal($('#pivotGrid').find('.dx-icon-sorted').length, 1, 'only one sorted icon applied');
    assert.equal(contextMenuArgs[0].items.length, 2);
    assert.equal(contextMenuArgs[0].items[0].text, 'Sort "Product" by This Column');
    assert.equal(contextMenuArgs[0].items[0].icon, 'sortuptext');

    assert.equal(contextMenuArgs[0].items[1].text, 'Remove All Sorting');
    assert.equal(contextMenuArgs[0].items[1].icon, 'none');
});

QUnit.test('Sorting by Summary context menu when several data fields for columns', function(assert) {
    var contextMenuArgs = [],
        pivotGrid = createPivotGrid({
            fieldChooser: {
                enabled: false
            },
            allowSortingBySummary: true,

            dataSource: {
                fields: [
                    { format: 'decimal', area: 'column', expanded: true },

                    { format: { format: 'quarter', dateType: 'full' }, area: 'column' },
                    { dataField: 'Category', area: 'row' },
                    { dataField: 'Product', area: 'row' },
                    { dataField: 'sum1', caption: 'Sum1', area: 'data' },
                    { dataField: 'sum2', caption: 'Sum2', area: 'data' }
                ],
                rows: [
                    { value: 'A', index: 0 },
                    { value: 'B', index: 1 }
                ],
                columns: [{
                    value: '2010', index: 2,
                    children: [
                        { value: '1', index: 0 },
                        { value: '2', index: 1 }
                    ]
                }, {
                    value: '2012', index: 3
                }],
                values: [
                    [[1, 0.1], [8, 0.8], [15, 0.15], [36, 0.36], [43, 0.43]],
                    [[2, 0.2], [9, 0.9], [16, 0.16], [37, 0.37], [44, 0.44]],
                    [[3, 0.3], [10, 0.1], [17, 0.17], [38, 0.38], [45, 0.45]]
                ]
            },
            onContextMenuPreparing: function(e) {
                contextMenuArgs.push(e);
            }
        }, assert);

    var dataSource = pivotGrid.getDataSource();

    sinon.spy(dataSource, 'field');
    sinon.spy(dataSource, 'load');

    // act
    $('#pivotGrid').find('.dx-pivotgrid-horizontal-headers td').last().trigger('dxcontextmenu');

    // assert
    assert.equal(contextMenuArgs[0].items.length, 2);
    assert.equal(contextMenuArgs[0].items[0].text, 'Sort "Category" by This Column');
    assert.equal(contextMenuArgs[0].items[0].icon, 'none');
    assert.equal(contextMenuArgs[0].items[1].text, 'Sort "Product" by This Column');
    assert.equal(contextMenuArgs[0].items[1].icon, 'none');
});

QUnit.test('Sorting by Summary context menu when sorting defined and several data fields for columns', function(assert) {
    var contextMenuArgs = [],
        pivotGrid = createPivotGrid({
            fieldChooser: {
                enabled: false
            },
            allowSortingBySummary: true,

            dataSource: {
                fields: [
                    { format: 'decimal', area: 'column', expanded: true },

                    { format: { format: 'quarter', dateType: 'full' }, area: 'column' },
                    { dataField: 'Category', area: 'row' },
                    { dataField: 'Product', area: 'row', sortBySummaryPath: ['2010', '2'], sortBySummaryField: 'sum2', sortOrder: 'desc' },
                    { dataField: 'sum1', caption: 'Sum1', area: 'data' },
                    { dataField: 'sum2', caption: 'Sum2', area: 'data' }
                ],
                rows: [
                    { value: 'A', index: 0 },
                    { value: 'B', index: 1 }
                ],
                columns: [{
                    value: '2010', index: 2,
                    children: [
                        { value: '1', index: 0 },
                        { value: '2', index: 1 }
                    ]
                }, {
                    value: '2012', index: 3
                }],
                values: [
                    [[1, 0.1], [8, 0.8], [15, 0.15], [36, 0.36], [43, 0.43]],
                    [[2, 0.2], [9, 0.9], [16, 0.16], [37, 0.37], [44, 0.44]],
                    [[3, 0.3], [10, 0.1], [17, 0.17], [38, 0.38], [45, 0.45]]
                ]
            },
            onContextMenuPreparing: function(e) {
                contextMenuArgs.push(e);
            }
        }, assert);

    var dataSource = pivotGrid.getDataSource();

    sinon.spy(dataSource, 'field');
    sinon.spy(dataSource, 'load');

    // act
    $('#pivotGrid').find('.dx-pivotgrid-horizontal-headers tr').last().children().eq(3).trigger('dxcontextmenu');

    // assert
    assert.equal(contextMenuArgs[0].items.length, 3);
    assert.equal(contextMenuArgs[0].items[0].text, 'Sort "Category" by This Column');
    assert.equal(contextMenuArgs[0].items[0].icon, 'none');
    assert.equal(contextMenuArgs[0].items[1].text, 'Sort "Product" by This Column');
    assert.equal(contextMenuArgs[0].items[1].icon, 'sortdowntext');
    assert.equal(contextMenuArgs[0].items[2].text, 'Remove All Sorting');
    assert.equal(contextMenuArgs[0].items[2].icon, 'none');
});

QUnit.test('Sorting by Summary context menu when sorting defined and several data fields for rows', function(assert) {
    var contextMenuArgs = [],
        pivotGrid = createPivotGrid({
            fieldChooser: {
                enabled: false
            },
            allowSortingBySummary: true,

            dataSource: {
                fields: [
                    { format: 'decimal', area: 'row', expanded: true },

                    { format: { format: 'quarter', dateType: 'full' }, area: 'row' },
                    { dataField: 'Category', area: 'column' },
                    { dataField: 'Product', area: 'column', sortBySummaryField: 'sum2', sortBySummaryPath: ['2010', '2'] },
                    { dataField: 'sum1', caption: 'Sum1', area: 'data' },
                    { dataField: 'sum2', caption: 'Sum2', area: 'data' }
                ],
                columns: [
                    { value: 'A', index: 0 },
                    { value: 'B', index: 1 }
                ],
                rows: [{
                    value: '2010', index: 2,
                    children: [
                        { value: '1', index: 0 },
                        { value: '2', index: 1 }
                    ]
                }, {
                    value: '2012', index: 3
                }],
                values: []
            },
            onContextMenuPreparing: function(e) {
                contextMenuArgs.push(e);
            }
        }, assert);

    var dataSource = pivotGrid.getDataSource();

    sinon.spy(dataSource, 'field');
    sinon.spy(dataSource, 'load');

    // act
    $('#pivotGrid').find('.dx-pivotgrid-vertical-headers tr').eq(1).children().last().trigger('dxcontextmenu');

    // assert
    assert.equal(contextMenuArgs[0].items.length, 5);
    assert.equal(contextMenuArgs[0].items[0].text, 'Sort "Category - Sum1" by This Row');
    assert.equal(contextMenuArgs[0].items[0].icon, 'none');
    assert.equal(contextMenuArgs[0].items[1].text, 'Sort "Category - Sum2" by This Row');
    assert.equal(contextMenuArgs[0].items[1].icon, 'none');
    assert.equal(contextMenuArgs[0].items[2].text, 'Sort "Product - Sum1" by This Row');
    assert.equal(contextMenuArgs[0].items[2].icon, 'none');
    assert.equal(contextMenuArgs[0].items[3].text, 'Sort "Product - Sum2" by This Row');
    assert.equal(contextMenuArgs[0].items[3].icon, 'sortuptext');
    assert.equal(contextMenuArgs[0].items[4].text, 'Remove All Sorting');
    assert.equal(contextMenuArgs[0].items[4].icon, 'none');
});

QUnit.test('expand All items', function(assert) {
    var contextMenuArgs = [],
        pivotGrid = createPivotGrid({
            dataSource: {
                fields: [
                    { format: 'decimal', area: 'column', allowExpandAll: true, expanded: false, index: 0 },
                    { dataField: 'd', area: 'row' },
                    { format: { format: 'quarter', dateType: 'full' }, area: 'column', index: 1 },
                    { caption: 'Sum1', format: 'currency', area: 'data', index: 2 }
                ],
                rows: [
                    { value: 'A', index: 0 },
                    { value: 'B', index: 1 }
                ],
                columns: [{
                    value: '2010', index: 2,
                    children: [
                        { value: '1', index: 0 },
                        { value: '2', index: 1 }
                    ]
                }, {
                    value: '2012', index: 3
                }],
                values: [
                    [[1, 0.1], [8, 0.8], [15, 0.15], [36, 0.36], [43, 0.43]],
                    [[2, 0.2], [9, 0.9], [16, 0.16], [37, 0.37], [44, 0.44]],
                    [[3, 0.3], [10, 0.1], [17, 0.17], [38, 0.38], [45, 0.45]]
                ]
            },
            onContextMenuPreparing: function(e) {
                contextMenuArgs.push(e);
            }
        }, assert),
        dataSource = pivotGrid.getDataSource();

    sinon.spy(dataSource, 'expandAll');

    // act
    $('#pivotGrid').find('.dx-pivotgrid-horizontal-headers .dx-pivotgrid-collapsed').trigger('dxcontextmenu');

    contextMenuArgs[0].items[0].onItemClick();
    // assert

    assert.deepEqual(dataSource.expandAll.lastCall.args, [0], 'collapseLevel args');
});

QUnit.test('expand All should not be allowed if paginate true', function(assert) {
    var contextMenuArgs = [];

    var pivotGrid = createPivotGrid({
        dataSource: {
            fields: [
                { format: 'decimal', area: 'column', allowExpandAll: true, expanded: false, index: 0 },
                { dataField: 'd', area: 'row' },
                { format: { format: 'quarter', dateType: 'full' }, area: 'column', index: 1 },
                { caption: 'Sum1', format: 'currency', area: 'data', index: 2 }
            ],
            rows: [
                { value: 'A', index: 0 },
                { value: 'B', index: 1 }
            ],
            columns: [{
                value: '2010', index: 2,
                children: [
                    { value: '1', index: 0 },
                    { value: '2', index: 1 }
                ]
            }, {
                value: '2012', index: 3
            }],
            values: [
                [[1, 0.1], [8, 0.8], [15, 0.15], [36, 0.36], [43, 0.43]],
                [[2, 0.2], [9, 0.9], [16, 0.16], [37, 0.37], [44, 0.44]],
                [[3, 0.3], [10, 0.1], [17, 0.17], [38, 0.38], [45, 0.45]]
            ]
        },
        onContextMenuPreparing: function(e) {
            contextMenuArgs.push(e);
        }
    }, assert);

    pivotGrid.getDataSource().paginate = function() {
        return true;
    };

    // act
    $('#pivotGrid').find('.dx-pivotgrid-horizontal-headers .dx-pivotgrid-collapsed').trigger('dxcontextmenu');

    // assert
    assert.deepEqual(contextMenuArgs[0].items.map(function(item) { return item.text; }), ['Show Field Chooser'], 'context menu items');
});

QUnit.test('expand All items for field in group', function(assert) {
    var contextMenuArgs = [],
        pivotGrid = createPivotGrid({
            dataSource: {
                fields: [
                    { groupName: 'Date', area: 'column', allowExpandAll: true, index: 0 },
                    { groupName: 'Date', format: 'decimal', allowExpandAll: true, index: 1, groupIndex: 0 },
                    { dataField: 'd', area: 'row' },
                    { groupName: 'Date', format: { format: 'quarter', dateType: 'full' }, allowExpandAll: true, index: 2, groupIndex: 1 },
                    { caption: 'Sum1', format: 'currency', area: 'data', index: 3 }
                ],
                rows: [
                    { value: 'A', index: 0 },
                    { value: 'B', index: 1 }
                ],
                columns: [{
                    value: '2010', index: 2,
                    children: [
                        { value: '1', index: 0 },
                        { value: '2', index: 1 }
                    ]
                }, {
                    value: '2012', index: 3
                }],
                values: [
                    [[1, 0.1], [8, 0.8], [15, 0.15], [36, 0.36], [43, 0.43]],
                    [[2, 0.2], [9, 0.9], [16, 0.16], [37, 0.37], [44, 0.44]],
                    [[3, 0.3], [10, 0.1], [17, 0.17], [38, 0.38], [45, 0.45]]
                ]
            },
            onContextMenuPreparing: function(e) {
                contextMenuArgs.push(e);
            }
        }, assert),
        dataSource = pivotGrid.getDataSource();

    sinon.spy(dataSource, 'expandAll');

    // act
    $('#pivotGrid').find('.dx-pivotgrid-horizontal-headers .dx-pivotgrid-collapsed').trigger('dxcontextmenu');

    contextMenuArgs[0].items[0].onItemClick();
    // assert
    assert.deepEqual(dataSource.expandAll.lastCall.args, [1], 'collapseLevel args');
});

QUnit.test('pivot grid render', function(assert) {
    // assert, act
    var pivotGrid = createPivotGrid({}, assert),
        mainTable,
        rows,
        testElement = $('#pivotGrid');

    // act
    mainTable = testElement.find('table')[0];
    rows = mainTable.rows;

    // assert
    assert.ok(mainTable, 'pivotGrid container is rendered');
    assert.equal(rows.length, 4, 'rows count');
    assert.equal($(rows[0]).children().length, 1, 'row 0 cells count');
    assert.equal($(rows[1]).children().length, 2, 'row 1 cells count');
    assert.equal($(rows[2]).children().length, 2, 'row 2 cells count');
    assert.equal($(rows[3]).children().length, 2, 'row 3 cells count');
    assert.equal(testElement.find('.dx-pivotgrid-area').length, 3, 'areas count');
    assert.ok($(mainTable).hasClass('dx-word-wrap'));

    assert.strictEqual(pivotGrid.$element().css('overflow'), 'hidden');
    // T428108
    assert.strictEqual($(mainTable).css('tableLayout'), 'auto', 'table-layout css property on pivotGrid table element');
});

QUnit.test('disable word wrapping', function(assert) {
    // assert, act
    createPivotGrid({
        wordWrapEnabled: false
    }, assert);

    var mainTable,
        testElement = $('#pivotGrid');

    mainTable = testElement.find('table')[0];

    // assert
    assert.ok(!$(mainTable).hasClass('dx-word-wrap'));
});

QUnit.test('disable word wrapping at runtime', function(assert) {
    // assert, act
    var pivotGrid = createPivotGrid({
        wordWrapEnabled: true
    }, assert);

    var testElement = $('#pivotGrid'),
        mainTable = testElement.find('table')[0];

    // act
    pivotGrid.option('wordWrapEnabled', false);
    // assert
    assert.ok(!$(mainTable).hasClass('dx-word-wrap'));
});

QUnit.test('disable rowHeaderLayout at runtime', function(assert) {
    // assert, act
    var pivotGrid = createPivotGrid({
        rowHeaderLayout: 'tree'
    }, assert);

    var testElement = $('#pivotGrid'),
        mainTable = testElement.find('table')[0];

    // act
    pivotGrid.option('rowHeaderLayout', 'standard');
    // assert
    assert.ok(!$(mainTable).find('.dx-area-row-cell').hasClass('dx-area-tree-view'));
});

QUnit.test('enable rowHeaderLayout at runtime', function(assert) {
    // assert, act
    var pivotGrid = createPivotGrid({
        rowHeaderLayout: 'standard'
    }, assert);

    var testElement = $('#pivotGrid'),
        mainTable = testElement.find('table')[0];

    // act
    pivotGrid.option('rowHeaderLayout', 'tree');
    // assert
    assert.ok($(mainTable).find('.dx-area-row-cell').hasClass('dx-area-tree-view'));
});

QUnit.test('resize when columns stretched to less width', function(assert) {
    // assert, act
    var $pivotGridElement = $('#pivotGrid').width(1200),
        pivotGrid = createPivotGrid(this.testOptions, assert);

    // act
    $pivotGridElement.width(1100);
    pivotGrid.resize();

    // assert
    assert.ok(pivotGrid, 'pivotGrid container is rendered');
    assert.ok(!pivotGrid._columnsArea.hasScroll(), 'no horizontal scroll after resize');
});

QUnit.test('no scroll after drawing data', function(assert) {
    var pivotGrid = createPivotGrid({
            width: 400,

            dataSource: {
                rows: [],
                columns: [],
                values: []
            }
        }, assert),

        dataScrollable = pivotGrid._dataArea.groupElement().dxScrollable('instance');

    sinon.spy(dataScrollable, 'update');
    sinon.spy(dataScrollable, 'scrollTo');

    // act
    pivotGrid.option({
        dataSource: {
            fields: [
                { area: 'row' },
                { area: 'column' }, { area: 'column' },
                { caption: 'Sum1', area: 'data' }
            ],
            rows: [
                { value: 'Accessories_1', index: 0 },
                { value: 'Clothing', index: 1 }
            ],
            columns: [{
                value: 'CY 2010', index: 0
            }, {
                value: 'CY 2012', index: 1
            }, {
                value: 'CY 2013', index: 2
            }, {
                value: 'CY 2014', index: 3
            }],
            values: [
                [[null], [null], [15], [36], [43], [100]],
                [[962], [2625], [16], [37], [44], [200]],
                [[962], [2625], [1753], [11753], [11753]]
            ]
        }
    });

    // assert
    assert.ok(pivotGrid, 'pivotGrid container is rendered');
    assert.ok(!pivotGrid._columnsArea.hasScroll(), 'no horizontal scroll');
    // T290303
    assert.ok(dataScrollable.update.called);
});

QUnit.test('pivot grid has full height', function(assert) {
    var pivotGrid = createPivotGrid({
            height: 150,
            fieldChooser: {
                enabled: false
            },
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum1', area: 'data' }
                ],
                rows: [
                    { value: 'Accessories_1', index: 0 },
                    { value: 'Clothing', index: 1 },
                    { value: 'Clothing3', index: 2 },
                    { value: 'Clothing4', index: 3 },
                    { value: 'Clothing5', index: 4 },
                    { value: 'Clothing6', index: 5 }
                ],
                columns: [{
                    value: 'CY 2010', index: 0
                }, {
                    value: 'CY 2012', index: 1
                }, {
                    value: 'CY 2013', index: 2
                }, {
                    value: 'CY 2014', index: 3
                }],
                values: [
                    [[null], [null], [15], [36], [43], [100]],
                    [[962], [2625], [16], [37], [44], [200]],
                    [[962], [2625], [1753], [11753], [11753]]
                ]
            }
        }, assert),
        tableElement = pivotGrid.$element().find('table').first();
    // assert
    assert.strictEqual(Math.round(tableElement.height()), 150);
});

QUnit.test('T317921: dxPivotGrid - Scrollbar overlaps the last column when the document height slightly exceeds the window height. Without columns scroll', function(assert) {
    var $pivotGridElement = $('#pivotGrid'),
        $parentElement = $('<div>').css({
            height: 400,
            overflow: 'auto'
        }).appendTo($('#pivotGrid').parent()),
        pivot,
        tableElement;

    $pivotGridElement.appendTo($parentElement);

    pivot = createPivotGrid(this.testOptions, assert);

    tableElement = $pivotGridElement.find('table').first();

    assert.strictEqual(tableElement.width(), $pivotGridElement.width()),
    assert.ok((pivot._dataArea.groupWidth() + pivot._rowsArea.groupWidth()) <= $pivotGridElement.width());
});

QUnit.test('resize when height changed to no scroll', function(assert) {
    this.testOptions.scrolling = {
        useNative: false,
        bounceEnabled: false
    };

    var $pivotGridElement = $('#pivotGrid').height(200),
        pivotGrid = createPivotGrid(this.testOptions, assert);

    assert.ok(pivotGrid._rowsArea.hasScroll(), 'has vertical scroll');
    assert.equal(pivotGrid.$element().find('.dx-area-data-cell').css('borderBottomWidth'), '0px', 'data area border bottom width');
    assert.equal(pivotGrid.$element().find('.dx-area-row-cell').css('borderBottomWidth'), '0px', 'row area border bottom width');

    var scrollable = pivotGrid._dataArea.groupElement().dxScrollable('instance');

    scrollable.scrollTo(10);

    // act
    $pivotGridElement.height(1000);
    pivotGrid.resize();

    // assert
    assert.ok(pivotGrid, 'pivotGrid container is rendered');
    assert.ok(!pivotGrid._rowsArea.hasScroll(), 'no has vertical scroll after resize');

    assert.ok(parseFloat(pivotGrid.$element().find('.dx-area-data-cell').css('borderBottomWidth')) > 0, 'data area border bottom width');
    assert.ok(parseFloat(pivotGrid.$element().find('.dx-area-row-cell').css('borderBottomWidth')) > 0, 'row area border bottom width');

    assert.equal(pivotGrid._dataArea.groupElement().dxScrollable('scrollHeight'), pivotGrid._dataArea.groupElement().dxScrollable('clientHeight'), 'client height equal scroll height');

    assert.strictEqual(pivotGrid._dataArea.groupElement().dxScrollable('scrollTop'), 0);
    assert.strictEqual(pivotGrid._rowsArea.groupElement().dxScrollable('scrollTop'), 0);
});


QUnit.test('page scrolling after tapping inside PivotGrid. T418829', function(assert) {
    var pivotGrid = createPivotGrid(this.testOptions, assert);

    assert.expect(2);

    $(document).on('dxpointermove', assertFunction);

    // act
    pointerMock(pivotGrid._dataArea.groupElement())
        .start()
        .down()
        .move(-10, -1)
        .move(-20, -1)
        .up();

    function assertFunction(e) {
        assert.ok(!e.isDefaultPrevented(), 'event should be not prevented to scroll');
        $(document).off('dxpointermove', assertFunction);
    }
});

QUnit.test('resize when height is set to scroll', function(assert) {
    var pivotGrid = createPivotGrid(this.testOptions, assert);

    assert.ok(!pivotGrid.hasScroll('row'), 'has vertical scroll');

    // act
    pivotGrid.option('height', 200);

    // assert
    assert.ok(pivotGrid.hasScroll('row'), 'has vertical scroll after resize');
});

QUnit.test('Resize. reset height', function(assert) {
    var pivotGrid = createPivotGrid($.extend(this.testOptions, {
        height: 200
    }), assert);

    assert.ok(pivotGrid.hasScroll('row'), 'has vertical scroll');

    // act
    pivotGrid.option('height', 'auto');

    // assert
    assert.ok(!pivotGrid.hasScroll('row'), 'has vertical scroll after resize');
});

QUnit.test('resize when width changed to no scroll', function(assert) {
    var $pivotGridElement = $('#pivotGrid').width(150),
        pivotGrid = createPivotGrid(this.testOptions, assert);

    var scrollable = pivotGrid._dataArea.groupElement().dxScrollable('instance');

    scrollable.option({
        useNative: false,
        bounceEnabled: false
    });

    scrollable.scrollTo(10);

    // act
    assert.ok(pivotGrid._columnsArea.hasScroll(), 'no has vertical scroll after resize');

    $pivotGridElement.width(2000);
    pivotGrid.resize();

    // assert
    assert.ok(pivotGrid, 'pivotGrid container is rendered');
    assert.ok(!pivotGrid._columnsArea.hasScroll(), 'no has vertical scroll after resize');

    assert.strictEqual(pivotGrid._dataArea.groupElement().dxScrollable('scrollLeft'), 0);
    assert.strictEqual(pivotGrid._columnsArea.groupElement().dxScrollable('scrollLeft'), 0);
});

if(!devices.real().ios) {
    QUnit.test('bottom border and not vertical scroll when big height', function(assert) {
        // act
        $('#pivotGrid').height(1000);
        var pivotGrid = createPivotGrid(this.testOptions, assert);

        // assert
        assert.ok(!pivotGrid._rowsArea.hasScroll(), 'has vertical scroll');
        assert.ok(parseFloat(pivotGrid.$element().find('.dx-area-data-cell').css('borderBottomWidth')) > 0, 'data area border bottom width');
        assert.ok(parseFloat(pivotGrid.$element().find('.dx-area-row-cell').css('borderBottomWidth')) > 0, 'row area border bottom width');
        assert.equal(pivotGrid._dataArea.groupElement().dxScrollable('scrollHeight'), pivotGrid._dataArea.groupElement().dxScrollable('clientHeight'), 'client height equal scroll height');
    });
}

QUnit.test('no bottom border if vertical scroll when small height', function(assert) {
    // act
    $('#pivotGrid').height(200);
    this.testOptions.scrolling = {
        useNative: true
    };
    var pivotGrid = createPivotGrid(this.testOptions, assert);

    // assert
    assert.ok(pivotGrid._rowsArea.hasScroll(), 'has vertical scroll');
    assert.equal(parseFloat(pivotGrid.$element().find('.dx-area-data-cell').css('borderBottomWidth')), 0, 'data area border bottom width');
    assert.equal(parseFloat(pivotGrid.$element().find('.dx-area-row-cell').css('borderBottomWidth')), 0, 'row area border bottom width');
});

QUnit.test('bottom border if horizontal scroll', function(assert) {
    // act
    $('#pivotGrid').width(300);
    this.testOptions.scrolling = {
        useNative: true
    };
    var pivotGrid = createPivotGrid(this.testOptions, assert);

    // assert
    assert.ok(!pivotGrid._rowsArea.hasScroll(), 'has vertical scroll');
    assert.ok(pivotGrid._columnsArea.hasScroll(), 'has horizontal scroll');
    assert.ok(parseFloat(pivotGrid.$element().find('.dx-area-data-cell').css('borderBottomWidth')) > 0, 'data area border bottom width');
    assert.ok(parseFloat(pivotGrid.$element().find('.dx-area-row-cell').css('borderBottomWidth')) > 0, 'row area border bottom width when no scrollbar width');
});

QUnit.test('mergeArraysByMaxValue', function(assert) {
    var array1 = [10, 12, 35, 7],
        array2 = [8, 12, 39, 5];

    assert.deepEqual(pivotGridUtils.mergeArraysByMaxValue(array1, array2), [10, 12, 39, 7], 'result array');
});

QUnit.test('Synchronize areas', function(assert) {
    // arrange, act
    var testElement = $('#pivotGrid'),
        pivotGrid,
        colsElement,
        rows,
        dataAreaElement;

    testElement.width(800);
    testElement.height(300);
    pivotGrid = createPivotGrid(this.testOptions, assert);
    this.clock.tick();
    dataAreaElement = testElement.find('.dx-pivotgrid-area-data table');
    rows = dataAreaElement[0].rows;
    colsElement = dataAreaElement.find('col');

    // assert
    assert.equal(rows.length, 7, 'data area rows count');
    assert.roughEqual(parseFloat(rows[0].style.height), pivotGrid._testResultHeights[0], 0.1, 'data area 1 row height');
    assert.roughEqual(parseFloat(rows[1].style.height), pivotGrid._testResultHeights[1], 0.1, 'data area 2 row height');
    assert.roughEqual(parseFloat(rows[2].style.height), pivotGrid._testResultHeights[2], 0.1, 'data area 3 row height');
    assert.roughEqual(parseFloat(rows[3].style.height), pivotGrid._testResultHeights[3], 0.1, 'data area 4 row height');
    assert.roughEqual(parseFloat(rows[4].style.height), pivotGrid._testResultHeights[4], 0.1, 'data area 5 row height');
    assert.roughEqual(parseFloat(rows[5].style.height), pivotGrid._testResultHeights[5], 0.1, 'data area 6 row height');
    assert.roughEqual(parseFloat(rows[6].style.height), pivotGrid._testResultHeights[6], 0.1, 'data area 7 row height');

    assert.equal(colsElement.length, 14, 'data area columns count');
    assert.roughEqual(parseFloat(colsElement[0].style.width), pivotGrid._testResultWidths[0], 0.1, 'data area 1 col width');
    assert.roughEqual(parseFloat(colsElement[1].style.width), pivotGrid._testResultWidths[1], 0.1, 'data area 2 col width');
    assert.roughEqual(parseFloat(colsElement[2].style.width), pivotGrid._testResultWidths[2], 0.1, 'data area 3 col width');
    assert.roughEqual(parseFloat(colsElement[3].style.width), pivotGrid._testResultWidths[3], 0.1, 'data area 4 col width');
    assert.roughEqual(parseFloat(colsElement[4].style.width), pivotGrid._testResultWidths[4], 0.1, 'data area 5 col width');
    assert.roughEqual(parseFloat(colsElement[5].style.width), pivotGrid._testResultWidths[5], 0.1, 'data area 6 col width');
    assert.roughEqual(parseFloat(colsElement[6].style.width), pivotGrid._testResultWidths[6], 0.1, 'data area 7 col width');
    assert.roughEqual(parseFloat(colsElement[7].style.width), pivotGrid._testResultWidths[7], 0.1, 'data area 8 col width');
    assert.roughEqual(parseFloat(colsElement[8].style.width), pivotGrid._testResultWidths[8], 0.1, 'data area 9 col width');
    assert.roughEqual(parseFloat(colsElement[9].style.width), pivotGrid._testResultWidths[9], 0.1, 'data area 10 col width');
    assert.roughEqual(parseFloat(colsElement[10].style.width), pivotGrid._testResultWidths[10], 0.1, 'data area 11 col width');
    assert.roughEqual(parseFloat(colsElement[11].style.width), pivotGrid._testResultWidths[11], 0.1, 'data area 12 col width');
    assert.roughEqual(parseFloat(colsElement[12].style.width), pivotGrid._testResultWidths[12], 0.1, 'data area 13 col width');
    assert.roughEqual(parseFloat(colsElement[13].style.width), pivotGrid._testResultWidths[13], 0.1, 'data area 14 col width');
});

QUnit.test('getScrollPath for columns', function(assert) {
    var done = assert.async();

    $('#pivotGrid').empty();
    $('#pivotGrid').width(100);
    var pivotGrid = createPivotGrid({
        dataSource: this.dataSource
    }, assert);
    this.clock.tick();
    assert.ok(pivotGrid);
    var columnWidths = pivotGrid._columnsArea.getColumnsWidth();

    // act
    var scrollable = pivotGrid._dataArea.groupElement().dxScrollable('instance');

    var scrollAction = function(e) {
        var scrollPath = pivotGrid.getScrollPath('column');
        // assert
        assert.ok(pivotGrid.hasScroll('column'));
        assert.deepEqual(scrollPath, ['2010']);
        scrollable.off('scroll', scrollAction);
        done();
    };
    scrollable.on('scroll', scrollAction);

    scrollable.scrollTo(columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3] + 10);
});

QUnit.test('getScrollPath after initialization', function(assert) {
    $('#pivotGrid').empty();
    $('#pivotGrid').width(100);
    var pivotGrid = createPivotGrid({
        dataSource: this.dataSource
    }, assert);
    this.clock.tick();
    assert.ok(pivotGrid);

    // assert
    assert.deepEqual(pivotGrid.getScrollPath('column'), ['2010', '1']);
    assert.deepEqual(pivotGrid.getScrollPath('row'), ['A']);
});

QUnit.test('Scrolling when virtual scrolling is enabled', function(assert) {
    var done = assert.async(),
        assertFunction;

    $('#pivotGrid').empty();
    $('#pivotGrid').width(100);
    $('#pivotGrid').height(150);
    var pivotGrid = createPivotGrid({
        fieldChooser: {
            enabled: false
        },
        scrolling: {
            mode: 'virtual',
            timeout: 0
        },
        dataSource: this.dataSource
    }, assert);
    this.clock.tick();
    assert.ok(pivotGrid);

    var scrollable = pivotGrid._dataArea.groupElement().dxScrollable('instance'),
        setViewportPosition = sinon.spy(pivotGrid._dataController, 'setViewportPosition'),
        updateWindowScrollPosition = sinon.spy(pivotGrid._dataController, 'updateWindowScrollPosition');

    var scrollFunction = function(e) {
        assertFunction();
    };
    scrollable.on('scroll', scrollFunction);

    assertFunction = function() {
        assert.deepEqual(setViewportPosition.lastCall.args, [10, 0]);
    };
    // act1
    scrollable.scrollTo({ left: 10 });

    assertFunction = function() {
        assert.deepEqual(setViewportPosition.lastCall.args, [10, 1]);
        assert.strictEqual(updateWindowScrollPosition.lastCall.args[0], 1);
        scrollable.off('scroll', scrollFunction);
        done();
    };
    // act2
    scrollable.scrollTo({ left: 10, top: 1 });
});

// T810822
QUnit.test('hasScroll should return true if scrolling is virtual and data is empty', function(assert) {
    $('#pivotGrid').empty();
    $('#pivotGrid').width(100);
    $('#pivotGrid').height(150);

    this.dataSource.values = [];

    var pivotGrid = createPivotGrid({
        fieldChooser: {
            enabled: false
        },
        scrolling: {
            mode: 'virtual',
            timeout: 0
        },
        dataSource: this.dataSource
    }, assert);

    this.clock.tick();

    assert.ok(pivotGrid._columnsArea.hasScroll(), 'columns area scroll');
    assert.ok(pivotGrid._rowsArea.hasScroll(), 'rows area scroll');
});

// T518512
QUnit.test('render should be called once after expand item if virtual scrolling enabled', function(assert) {
    $('#pivotGrid').empty();
    $('#pivotGrid').width(100);
    $('#pivotGrid').height(150);

    var array = [];
    for(var i = 0; i < 30; i++) {
        array.push({ id: i, row: i + 1, column: i + 1, data: 1 });
    }

    var pivotGrid = createPivotGrid({
        fieldChooser: {
            enabled: false
        },
        scrolling: {
            mode: 'virtual',
            timeout: 0
        },
        dataSource: {
            store: array,
            fields: [
                { dataField: 'column', area: 'column' },
                { dataField: 'row', area: 'row' },
                { dataField: 'id', area: 'row' },
                { dataField: 'data', area: 'data' }
            ]
        }
    }, assert);

    this.clock.tick();

    var contentReadyCallCount = 0;

    pivotGrid.on('contentReady', function() {
        contentReadyCallCount++;
    });

    // act
    pivotGrid.getDataSource().expandHeaderItem('row', [1]);
    pivotGrid.getDataSource().load();
    this.clock.tick();

    // assert
    assert.equal(contentReadyCallCount, 1);
});

// T529461
QUnit.test('Initial horizontal scroll position when rtl is enabled', function(assert) {
    $('#pivotGrid').empty();
    $('#pivotGrid').width(100);
    $('#pivotGrid').height(150);
    var pivotGrid = createPivotGrid({
        rtlEnabled: true,
        fieldChooser: {
            enabled: false
        },
        dataSource: this.dataSource
    }, assert);
    this.clock.tick();

    // assert
    var dataAreaScrollable = pivotGrid._dataArea._getScrollable();
    var columnAreaScrollable = pivotGrid._columnsArea._getScrollable();
    assert.ok(dataAreaScrollable.scrollLeft() > 0, 'scrollLeft is not zero');
    assert.ok(columnAreaScrollable.scrollLeft() > 0, 'scrollLeft is not zero');
    assert.roughEqual(dataAreaScrollable.scrollLeft() + dataAreaScrollable._container().width(), dataAreaScrollable.$content().width(), 1, 'scrollLeft is in max right position');
    assert.roughEqual(columnAreaScrollable.scrollLeft() + columnAreaScrollable._container().width(), columnAreaScrollable.$content().width(), 1, 'scrollLeft is in max right position');
});

// T529461
QUnit.test('Initial horizontal scroll position when rtl is enabled and scrolling mode is virtual', function(assert) {
    $('#pivotGrid').empty();
    $('#pivotGrid').width(100);
    $('#pivotGrid').height(150);
    var pivotGrid = createPivotGrid({
        rtlEnabled: true,
        fieldChooser: {
            enabled: false
        },
        scrolling: {
            mode: 'virtual',
            timeout: 0
        },
        dataSource: this.dataSource
    }, assert);
    this.clock.tick();
    assert.ok(pivotGrid);

    // assert
    var dataAreaScrollable = pivotGrid._dataArea._getScrollable();
    var columnAreaScrollable = pivotGrid._columnsArea._getScrollable();
    var dataAreaFakeTable = pivotGrid.$element().find('.dx-pivotgrid-area-data .dx-pivot-grid-fake-table');
    var columnAreaFakeTable = pivotGrid.$element().find('.dx-pivotgrid-horizontal-headers .dx-pivot-grid-fake-table');
    var dataAreaContentTable = pivotGrid.$element().find('.dx-pivotgrid-area-data .dx-scrollable-content > table');
    var columnAreaContentTable = pivotGrid.$element().find('.dx-pivotgrid-horizontal-headers .dx-scrollable-content > table');
    assert.ok(dataAreaScrollable.scrollLeft() > 0, 'scrollLeft is not zero');
    assert.ok(columnAreaScrollable.scrollLeft() > 0, 'scrollLeft is not zero');
    assert.roughEqual(dataAreaScrollable.scrollLeft() + dataAreaScrollable._container().width(), dataAreaScrollable.$content().width(), 1, 'scrollLeft is in max right position');
    assert.roughEqual(columnAreaScrollable.scrollLeft() + columnAreaScrollable._container().width(), columnAreaScrollable.$content().width(), 1, 'scrollLeft is in max right position');
    assert.equal(dataAreaFakeTable.css('right'), '0px');
    assert.equal(columnAreaFakeTable.css('right'), '0px');
    assert.equal(dataAreaContentTable.css('right'), '0px');
    assert.equal(columnAreaContentTable.css('right'), '0px');
    assert.equal(dataAreaFakeTable.css('left'), 'auto');
    assert.equal(columnAreaFakeTable.css('left'), 'auto');
    assert.equal(dataAreaContentTable[0].style.left, '');
    assert.equal(columnAreaContentTable[0].style.left, '');
});

QUnit.test('Horizontal scroll position after scroll when rtl is enabled', function(assert) {
    var done = assert.async();

    $('#pivotGrid').empty();
    $('#pivotGrid').width(100);
    $('#pivotGrid').height(150);
    var pivotGrid = createPivotGrid({
        rtlEnabled: true,
        fieldChooser: {
            enabled: false
        },
        scrolling: {
            mode: 'virtual',
            timeout: 0
        },
        dataSource: this.dataSource
    }, assert);
    this.clock.tick();
    assert.ok(pivotGrid);

    var dataAreaScrollable = pivotGrid._dataArea._getScrollable();
    var columnAreaScrollable = pivotGrid._columnsArea._getScrollable();

    var scrollAssert = function() {
        dataAreaScrollable.off('scroll', scrollAssert);

        // assert
        assert.roughEqual(pivotGrid._scrollLeft, 10, 1, '_scrollLeft variable store inverted value');
        assert.ok(dataAreaScrollable.scrollLeft() > 0, 'scrollLeft is not zero');
        assert.ok(columnAreaScrollable.scrollLeft() > 0, 'scrollLeft is not zero');
        assert.roughEqual(dataAreaScrollable.scrollLeft() + 10 + dataAreaScrollable._container().width(), dataAreaScrollable.$content().width(), 1, 'scrollLeft is in max right position');
        assert.roughEqual(columnAreaScrollable.scrollLeft() + 10 + columnAreaScrollable._container().width(), columnAreaScrollable.$content().width(), 1, 'scrollLeft is in max right position');

        done();
    };

    dataAreaScrollable.on('scroll', scrollAssert);

    // act
    dataAreaScrollable.scrollBy({ left: -10 });
});


QUnit.test('Fix horizontal scroll position after scroll when rtl is enabled', function(assert) {
    var done = assert.async();

    var pivotGrid = createPivotGrid({
        rtlEnabled: true,
        width: 500,
        height: 150,
        fieldChooser: {
            enabled: false
        },
        scrolling: {
            useNative: false
        },
        dataSource: this.dataSource
    }, assert);
    this.clock.tick();

    var dataAreaScrollable = pivotGrid._dataArea._getScrollable();

    var assertFunction = function(e) {
        if(e.scrollOffset.top === 10) {
            assert.equal(dataAreaScrollable.scrollLeft(), 100);
            dataAreaScrollable.off('scroll', assertFunction);
            done();
        }
    };

    var scrollAssert = function() {
        dataAreaScrollable.off('scroll', scrollAssert);
        dataAreaScrollable.on('scroll', assertFunction);

        // act
        dataAreaScrollable.scrollTo({ top: 10 });
        assert.equal(dataAreaScrollable.scrollLeft(), 100);
    };

    dataAreaScrollable.on('scroll', scrollAssert);

    dataAreaScrollable.scrollTo({ left: 100 });
});

QUnit.test('Virtual scrolling if height is not defined', function(assert) {
    var pivotGrid = createPivotGrid({
            width: 120,
            fieldChooser: {
                enabled: false
            },
            scrolling: {
                mode: 'virtual'
            },
            dataSource: this.dataSource

        }, assert),
        done = assert.async();

    pivotGrid._dataController.scrollChanged.fire({
        left: 5,
        top: 7
    });

    var scrollable = pivotGrid._dataArea.groupElement().dxScrollable('instance'),
        setViewportPosition = sinon.spy(pivotGrid._dataController, 'setViewportPosition'),
        updateWindowScrollPosition = sinon.spy(pivotGrid._dataController, 'updateWindowScrollPosition');

    scrollable.on('scroll', assertFunction);

    // act2
    scrollable.scrollTo({ left: 10, top: 1 });
    // assert

    function assertFunction() {
        assert.deepEqual(setViewportPosition.lastCall.args, [10, 7]);

        assert.strictEqual(updateWindowScrollPosition.lastCall.args[0], 7, 'external scroll position is set');
        scrollable.off('scroll', assertFunction);
        done();
    }
});

QUnit.test('T243287. Scroll position after updateDimensions', function(assert) {
    $('#pivotGrid').empty();
    $('#pivotGrid').width(100);
    var done = assert.async(),
        pivotGrid = createPivotGrid({
            dataSource: this.dataSource
        }, assert);
    this.clock.tick();

    var columnWidths = pivotGrid._columnsArea.getColumnsWidth(),
        scrollable = pivotGrid._dataArea.groupElement().dxScrollable('instance');

    var scrollAction = function(e) {
        var columnsScrollPosition = pivotGrid._columnsArea.groupElement().dxScrollable('instance').scrollLeft(),
            dataScrollPosition = scrollable.scrollLeft();
        // act
        pivotGrid.updateDimensions();
        // assert
        assert.strictEqual(pivotGrid._columnsArea.groupElement().dxScrollable('instance').scrollLeft(), columnsScrollPosition, 'columns scroll position');
        assert.roughEqual(scrollable.scrollLeft(), dataScrollPosition, 0.5, 'data scroll position');
        assert.ok(dataScrollPosition > 0);
        assert.ok(columnsScrollPosition > 0);
        scrollable.off('scroll', scrollAction);
        done();
    };

    scrollable.on('scroll', scrollAction);

    scrollable.scrollTo(columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3] + 10);
});

QUnit.test('T245599. Scroll row area', function(assert) {
    var done = assert.async();
    $('#pivotGrid').height(150).width(800);
    var pivotGrid = createPivotGrid({
        fieldChooser: {
            enabled: false
        },
        dataSource: this.dataSource
    }, assert);
    this.clock.tick();
    assert.ok(pivotGrid);
    var columnHeights = pivotGrid._rowsArea.getRowsHeight();

    var scrollable = pivotGrid._dataArea.groupElement().dxScrollable('instance'),
        rowScrollable = pivotGrid._rowsArea.groupElement().dxScrollable('instance');

    scrollable.on('scroll', assertFunction);

    rowScrollable.scrollTo(columnHeights[0] + 5);

    rowScrollable.option('useSimulatedScrollbar', true); // T317655
    rowScrollable.option('useNative', false);

    function assertFunction() {
        var scrollPath = pivotGrid.getScrollPath('row');
        assert.deepEqual(scrollPath, ['B']);
        assert.ok(pivotGrid.hasScroll('row'));
        scrollable.off('scroll', assertFunction);
        done();
    }
});

QUnit.test('T245599. Scroll columnArea area', function(assert) {
    var done = assert.async();
    $('#pivotGrid').height(150).width(300);
    var pivotGrid = createPivotGrid({
        fieldChooser: {
            enabled: false
        },
        dataSource: this.dataSource
    }, assert);
    this.clock.tick();
    assert.ok(pivotGrid);
    var columnWidth = pivotGrid._columnsArea.getColumnsWidth();

    var scrollable = pivotGrid._dataArea.groupElement().dxScrollable('instance'),
        columnScrollable = pivotGrid._columnsArea.groupElement().dxScrollable('instance');

    scrollable.on('scroll', assertFunction);

    columnScrollable.scrollTo(columnWidth[0] + columnWidth[1] + 5);

    columnScrollable.option('useSimulatedScrollbar', true); // T317655
    columnScrollable.option('useNative', false);

    function assertFunction() {
        var scrollPath = pivotGrid.getScrollPath('column');
        assert.ok(pivotGrid.hasScroll('column'));
        assert.deepEqual(scrollPath, ['2010', '2']);
        scrollable.off('scroll', assertFunction);
        done();
    }
});

QUnit.test('getScrollPath for rows', function(assert) {
    var done = assert.async();
    $('#pivotGrid').height(150).width(800);
    var pivotGrid = createPivotGrid({

        dataSource: this.dataSource
    }, assert);
    this.clock.tick();
    assert.ok(pivotGrid);
    var columnHeights = pivotGrid._rowsArea.getRowsHeight();

    var scrollable = pivotGrid._dataArea.groupElement().dxScrollable('instance');

    scrollable.on('scroll', assertFunction);

    // act
    scrollable.scrollTo(columnHeights[0] + 5);

    function assertFunction() {
        var scrollPath = pivotGrid.getScrollPath('row');
        // assert
        assert.ok(pivotGrid.hasScroll('row'));
        assert.deepEqual(scrollPath, ['B']);
        scrollable.off('scroll', assertFunction);
        done();
    }

});

QUnit.test('Custom localize grandTotal and total text', function(assert) {
    createPivotGrid({
        texts: {
            grandTotal: 'Гранд тотал',
            total: 'Это мой {0} Тотал'
        },
        dataSource: this.dataSource
    }, assert);

    function getText(elements, index) {
        return $(elements[index]).text();
    }

    assert.equal(getText($('.dx-pivotgrid-horizontal-headers .dx-total'), 0), 'Это мой 2010 Тотал', 'total');
    assert.equal(getText($('.dx-pivotgrid-horizontal-headers .dx-grandtotal'), 0), 'Гранд тотал', 'grand total');
    assert.equal(getText($('.dx-pivotgrid-vertical-headers .dx-grandtotal'), 0), 'Гранд тотал', 'grand total');
});

QUnit.test('dxPivotGrid with vertical scroll and minimum width without horizontal scroller (columns stretch to less)', function(assert) {
    var createPivotGridOptions = function(options) {
        var rowItems = [
            {
                value: 'C1', index: 2,
                children: [{ value: 'P1', index: 0 }, { value: 'P2', index: 1 }]
            }, {
                value: 'C2', index: 5,
                children: [{ value: 'P3', index: 3 }, { value: 'P4', index: 4 }]
            }];

        var columnItems = [
            {
                value: '2010', index: 2,
                children: [
                    { value: '1', index: 0 },
                    { value: '2', index: 1 }
                ]
            }, {
                value: '2012', index: 5,
                children: [
                    { value: '2', index: 3 },
                    { value: '3', index: 4 }
                ]
            }];


        var cellSet = [
            [[100000000, 0.1], [8, 0.8], [15, 0.15], [22, 0.22], [29, 0.29], [36, 0.36], [43, 0.43]],
            [[2, 0.2], [9, 0.9], [16, 0.16], [23, 0.23], [30, 0.3], [37, 0.37], [44, 0.44]],
            [[3, 0.3], [10, 0.1], [17, 0.17], [24, 0.24], [31, 0.31], [38, 0.38], [45, 0.45]],
            [[4, 0.4], [11, 0.11], [18, 0.18], [25, 0.25], [32, 0.32], [39, 0.39], [46, 0.46]],
            [[5, 0.5], [12, 0.12], [19, 0.19], [26, 0.26], [33, 0.33], [40, 0.4], [47, 0.47]],
            [[6, 0.6], [13, 0.13], [20, 0.2], [27, 0.27], [34, 0.34], [41, 0.41], [48, 0.48]],
            [[7, 0.7], [14, 0.14], [21, 0.21], [28, 0.28], [35, 0.35], [42, 0.42], [49, 0.49]]];

        var pivotGridOptions = $.extend(true, {
            dataSource: {
                fields: [
                    { area: 'row' }, { area: 'row' },
                    { format: 'decimal', area: 'column' }, { format: { format: 'quarter', dateType: 'full' }, area: 'column' },
                    { caption: 'Sum1', format: 'currency', area: 'data' }, { caption: 'Sum2', format: 'percent', area: 'data' }
                ],
                rows: rowItems,
                columns: columnItems,
                values: cellSet
            }
        }, options);

        return pivotGridOptions;
    };

    var pivotGrid = createPivotGrid(createPivotGridOptions({ width: 1005, height: 250 }), assert);

    this.clock.tick();
    // assert
    assert.ok(pivotGrid);
    var columnsArea = pivotGrid._columnsArea;
    assert.ok(!columnsArea.hasScroll(), 'no columnAreaScroll');
    assert.ok(columnsArea._groupWidth);


    var columnsWidth = sumArray(columnsArea.getColumnsWidth());

    assert.roughEqual(columnsArea.groupWidth(), columnsWidth, 0.2, 'stretched');

    var table = pivotGrid.$element().find('table').first();

    assert.strictEqual(table.width(), 1005, 'table width');
});

QUnit.test('Stretch columns when scrolling has size', function(assert) {
    var createPivotGridOptions = function(options) {
        var rowItems = [
            {
                value: 'C1', index: 2,
                children: [{ value: 'P1', index: 0 }, { value: 'P2', index: 1 }]
            }, {
                value: 'C2', index: 5,
                children: [{ value: 'P3', index: 3 }, { value: 'P4', index: 4 }]
            }];

        var columnItems = [
            {
                value: '2010', index: 2,
                children: [
                    { value: '1', index: 0 },
                    { value: '2', index: 1 }
                ]
            }, {
                value: '2012', index: 5,
                children: [
                    { value: '2', index: 3 },
                    { value: '3', index: 4 }
                ]
            }];


        var cellSet = [
            [[100000000, 0.1], [8, 0.8], [15, 0.15], [22, 0.22], [29, 0.29], [36, 0.36], [43, 0.43]],
            [[2, 0.2], [9, 0.9], [16, 0.16], [23, 0.23], [30, 0.3], [37, 0.37], [44, 0.44]],
            [[3, 0.3], [10, 0.1], [17, 0.17], [24, 0.24], [31, 0.31], [38, 0.38], [45, 0.45]],
            [[4, 0.4], [11, 0.11], [18, 0.18], [25, 0.25], [32, 0.32], [39, 0.39], [46, 0.46]],
            [[5, 0.5], [12, 0.12], [19, 0.19], [26, 0.26], [33, 0.33], [40, 0.4], [47, 0.47]],
            [[6, 0.6], [13, 0.13], [20, 0.2], [27, 0.27], [34, 0.34], [41, 0.41], [48, 0.48]],
            [[7, 0.7], [14, 0.14], [21, 0.21], [28, 0.28], [35, 0.35], [42, 0.42], [49, 0.49]]];

        var pivotGridOptions = $.extend(true, {
            scrolling: {
                useNative: true
            },
            dataSource: {
                fields: [
                    { area: 'row' }, { area: 'row' },
                    { format: 'decimal', area: 'column' }, { format: { format: 'quarter', dateType: 'full' }, area: 'column' },
                    { caption: 'Sum1', format: 'currency', area: 'data' }, { caption: 'Sum2', format: 'percent', area: 'data' }
                ],
                rows: rowItems,
                columns: columnItems,
                values: cellSet
            }
        }, options);

        return pivotGridOptions;
    };

    var pivotGrid = createPivotGrid(createPivotGridOptions({ width: 1005, height: 250 }), assert);

    this.clock.tick();

    // assert
    assert.ok(pivotGrid);
    var columnsArea = pivotGrid._columnsArea;

    assert.ok(!columnsArea.hasScroll(), 'no columnAreaScroll');
    assert.ok(columnsArea._groupWidth);
    assert.ok(pivotGrid._rowsArea.hasScroll());

    var columnsWidth = sumArray(columnsArea.getColumnsWidth());

    assert.roughEqual(columnsArea.groupWidth(), columnsWidth, 0.2, 'stretched');

    var table = pivotGrid.$element().find('table').first();

    assert.strictEqual(table.width(), 1005, 'table width');
});


// T651805
QUnit.test('Stretch columns when scrolling has size and horizontal scrollbar may cause vertical scrollbar', function(assert) {
    var pivotGrid = createPivotGrid({
        scrolling: {
            useNative: true
        },
        width: 500,
        dataSource: {
            fields: [
                { area: 'row' }, { area: 'row' },
                { format: 'decimal', area: 'column' }, { format: { format: 'quarter', dateType: 'full' }, area: 'column' },
                { caption: 'Sum1', format: 'currency', area: 'data' }, { caption: 'Sum2', format: 'percent', area: 'data' }
            ],
            rows: [
                {
                    value: 'C1', index: 1
                }],
            columns: [
                {
                    value: '2010', index: 2,
                    children: [
                        { value: '1', index: 0 },
                        { value: '2', index: 1 }
                    ]
                }, {
                    value: '2012', index: 5,
                    children: [
                        { value: '2', index: 3 },
                        { value: '3', index: 4 }
                    ]
                }],
            values: [
                [[10, 0.1], [8, 0.8], [15, 0.15], [22, 0.22], [29, 0.29], [36, 0.36], [43, 0.43]],
                [[7, 0.7], [14, 0.14], [21, 0.21], [28, 0.28], [35, 0.35], [42, 0.42], [49, 0.49]]
            ]
        }
    }, assert);

    this.clock.tick();
    // assert
    assert.ok(pivotGrid);
    var columnsArea = pivotGrid._columnsArea;
    assert.ok(!pivotGrid._rowsArea.hasScroll());
    assert.ok(columnsArea.hasScroll());
    assert.roughEqual($(columnsArea._getScrollable().content()).parent().get(0).clientWidth, $(pivotGrid._dataArea._getScrollable().content()).parent().get(0).clientWidth, 0.2, 'stretched');
});

QUnit.test('Stretch columns when scrolling has size. Virtual scrolling', function(assert) {
    var createPivotGridOptions = function(options) {
        var rowItems = [
            {
                value: 'C1', index: 2,
                children: [{ value: 'P1', index: 0 }, { value: 'P2', index: 1 }]
            }, {
                value: 'C2', index: 5,
                children: [{ value: 'P3', index: 3 }, { value: 'P4', index: 4 }]
            }];

        var columnItems = [
            {
                value: '2010', index: 2,
                children: [
                    { value: '1', index: 0 },
                    { value: '2', index: 1 }
                ]
            }, {
                value: '2012', index: 5,
                children: [
                    { value: '2', index: 3 },
                    { value: '3', index: 4 }
                ]
            }];


        var cellSet = [
            [[100000000, 0.1], [8, 0.8], [15, 0.15], [22, 0.22], [29, 0.29], [36, 0.36], [43, 0.43]],
            [[2, 0.2], [9, 0.9], [16, 0.16], [23, 0.23], [30, 0.3], [37, 0.37], [44, 0.44]],
            [[3, 0.3], [10, 0.1], [17, 0.17], [24, 0.24], [31, 0.31], [38, 0.38], [45, 0.45]],
            [[4, 0.4], [11, 0.11], [18, 0.18], [25, 0.25], [32, 0.32], [39, 0.39], [46, 0.46]],
            [[5, 0.5], [12, 0.12], [19, 0.19], [26, 0.26], [33, 0.33], [40, 0.4], [47, 0.47]],
            [[6, 0.6], [13, 0.13], [20, 0.2], [27, 0.27], [34, 0.34], [41, 0.41], [48, 0.48]],
            [[7, 0.7], [14, 0.14], [21, 0.21], [28, 0.28], [35, 0.35], [42, 0.42], [49, 0.49]]];

        var pivotGridOptions = $.extend(true, {
            scrolling: {
                useNative: true,
                mode: 'virtual'
            },
            dataSource: {
                fields: [
                    { area: 'row' }, { area: 'row' },
                    { format: 'decimal', area: 'column' }, { format: { format: 'quarter', dateType: 'full' }, area: 'column' },
                    { caption: 'Sum1', format: 'currency', area: 'data' }, { caption: 'Sum2', format: 'percent', area: 'data' }
                ],
                rows: rowItems,
                columns: columnItems,
                values: cellSet
            }
        }, options);

        return pivotGridOptions;
    };

    var pivotGrid = createPivotGrid(createPivotGridOptions({ width: 1005, height: 250 }), assert);

    this.clock.tick();

    // assert
    var columnsArea = pivotGrid._columnsArea;
    assert.ok(!columnsArea.hasScroll(), 'no columnAreaScroll');
    assert.ok(pivotGrid._rowsArea.hasScroll());
});

QUnit.test('No size reservation for scrolling when changed size to no scroll', function(assert) {
    var createPivotGridOptions = function(options) {
        var rowItems = [
            {
                value: 'C1', index: 2,
                children: [{ value: 'P1', index: 0 }, { value: 'P2', index: 1 }]
            }, {
                value: 'C2', index: 5,
                children: [{ value: 'P3', index: 3 }, { value: 'P4', index: 4 }]
            }];

        var columnItems = [
            {
                value: '2010', index: 2,
                children: [
                    { value: '1', index: 0 },
                    { value: '2', index: 1 }
                ]
            }, {
                value: '2012', index: 5,
                children: [
                    { value: '2', index: 3 },
                    { value: '3', index: 4 }
                ]
            }];


        var cellSet = [
            [[100000000, 0.1], [8, 0.8], [15, 0.15], [22, 0.22], [29, 0.29], [36, 0.36], [43, 0.43]],
            [[2, 0.2], [9, 0.9], [16, 0.16], [23, 0.23], [30, 0.3], [37, 0.37], [44, 0.44]],
            [[3, 0.3], [10, 0.1], [17, 0.17], [24, 0.24], [31, 0.31], [38, 0.38], [45, 0.45]],
            [[4, 0.4], [11, 0.11], [18, 0.18], [25, 0.25], [32, 0.32], [39, 0.39], [46, 0.46]],
            [[5, 0.5], [12, 0.12], [19, 0.19], [26, 0.26], [33, 0.33], [40, 0.4], [47, 0.47]],
            [[6, 0.6], [13, 0.13], [20, 0.2], [27, 0.27], [34, 0.34], [41, 0.41], [48, 0.48]],
            [[7, 0.7], [14, 0.14], [21, 0.21], [28, 0.28], [35, 0.35], [42, 0.42], [49, 0.49]]];

        var pivotGridOptions = $.extend(true, {
            scrolling: {
                useNative: true
            },
            dataSource: {
                fields: [
                    { area: 'row' }, { area: 'row' },
                    { format: 'decimal', area: 'column' }, { format: { format: 'quarter', dateType: 'full' }, area: 'column' },
                    { caption: 'Sum1', format: 'currency', area: 'data' }, { caption: 'Sum2', format: 'percent', area: 'data' }
                ],
                rows: rowItems,
                columns: columnItems,
                values: cellSet
            }
        }, options);

        return pivotGridOptions;
    };

    var pivotGrid = createPivotGrid(createPivotGridOptions({ width: 1050, height: 250 }), assert);

    this.clock.tick();

    $('#pivotGrid').css({ height: 1000 });
    pivotGrid.updateDimensions();
    this.clock.tick();

    // assert
    assert.ok(pivotGrid);
    var columnsArea = pivotGrid._columnsArea;
    assert.ok(!columnsArea.hasScroll(), 'no columnAreaScroll');
    assert.ok(columnsArea._groupWidth);
    assert.ok(!pivotGrid._rowsArea.hasScroll());

    var columnsWidth = sumArray(columnsArea.getColumnsWidth());

    assert.roughEqual(columnsArea.groupWidth(), columnsWidth, 0.2, 'stretched');

    var table = pivotGrid.$element().find('table').first();

    assert.strictEqual(table.width(), 1050, 'table width');
});

QUnit.test('B253995 - dxPivotGrid height is wrong when rows area has text wrapped to another line', function(assert) {
    var columnItems = [
        {
            value: '2010', index: 7,
            children: [
                { value: '10001', index: 0 },
                { value: '10002', index: 1 },
                { value: '10003', index: 2 },
                { value: '10004', index: 3 },
                { value: '10005', index: 4 },
                { value: '10006', index: 5 },
                { value: '10007', index: 6 }
            ]
        },
        { value: '2012', index: 8 },
        { value: '2012', index: 9 },
        { value: '2012', index: 10 },
        { value: '2012', index: 11 },
        { value: '2012', index: 12 }
    ];


    var cellSet = [
        [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
        [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 100],
        [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 100],
        [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 100],
        [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 100],
        [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 100],
        [300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 100]
    ];

    var pivotGridOptions = {
        fieldChooser: {
            enabled: false
        },
        width: 500,
        height: 250,
        dataSource: {
            fields: [
                { area: 'row' },
                { format: 'decimal', area: 'column' }, { format: 'decimal', area: 'column' },
                { caption: 'Sum1', format: 'currency', area: 'data' }
            ],
            rows: [{ value: 'A 111111 222222', index: 0 }, { value: 'B 1111111 11111', index: 1 }, { value: 'C 111111 111111', index: 2 }, { value: 'D 111111 111111', index: 3 }, { value: 'E 11111 1111111', index: 4 }, { value: 'F 1111111 11111', index: 5 }],
            columns: columnItems,
            values: cellSet
        }
    };

    var pivotGrid = createPivotGrid(pivotGridOptions, assert);
    this.clock.tick();
    // assert
    assert.ok(pivotGrid);
    var getRealHeight = function(element) {
        return window.getComputedStyle ? parseFloat(window.getComputedStyle(element).height) : element.clientHeight;
    };
    assert.ok(Math.abs(getRealHeight(pivotGrid.$element().children()[0]) - 250) <= 1);

    var tableElement = pivotGrid.$element().find('table').first();
    assert.strictEqual(tableElement.outerWidth(), 500);
    assert.strictEqual(Math.round(tableElement.outerHeight()), 250);
});

QUnit.test('T510943. Row area width is higher than a container\'s width', function(assert) {
    this.dataSource.fields[0].dataField = 'Big big big big big big big big title';
    var pivotGrid = createPivotGrid({
        dataSource: this.dataSource,
        fieldPanel: {
            visible: true
        },
        width: 150
    }, assert);

    this.clock.tick();
    // assert
    var dataArea = pivotGrid._dataArea;
    assert.strictEqual(parseFloat(dataArea.groupElement()[0].style.width).toFixed(2), dataArea.tableElement().width().toFixed(2));
});

QUnit.test('PivotGrid table width should be correct if width is small and fieldPanel is visible', function(assert) {
    var pivotGrid = createPivotGrid({
        fieldPanel: {
            visible: true
        },
        height: 300,
        width: 300,
        dataSource: {
            fields: [{
                dataField: 'Product_Sale_Price',
                summaryType: 'count',
                area: 'data'
            }],
            store: [{}]
        }
    }, assert);

    this.clock.tick();

    // assert
    assert.strictEqual($(pivotGrid.element()).find('table').first().width(), 300);
});

QUnit.test('Pivot grid with border', function(assert) {
    var columnItems = [
        {
            value: '2010', index: 7,
            children: [
                { value: '10001', index: 0 },
                { value: '10002', index: 1 },
                { value: '10003', index: 2 },
                { value: '10004', index: 3 },
                { value: '10005', index: 4 },
                { value: '10006', index: 5 },
                { value: '10007', index: 6 }
            ]
        },
        { value: '2012', index: 8 },
        { value: '2012', index: 9 },
        { value: '2012', index: 10 },
        { value: '2012', index: 11 },
        { value: '2012', index: 12 }
    ];


    var cellSet = [
        [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
        [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 100],
        [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 100],
        [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 100],
        [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 100],
        [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 100],
        [300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 100]
    ];

    var pivotGridOptions = {
        fieldChooser: {
            enabled: false
        },
        width: 500,
        showBorders: true,
        height: 250,
        dataSource: {
            fields: [
                { area: 'row' },
                { format: 'decimal', area: 'column' }, { format: 'decimal', area: 'column' },
                { caption: 'Sum1', format: 'currency', area: 'data' }
            ],
            rows: [{ value: 'A 111111 222222', index: 0 }, { value: 'B 1111111 11111', index: 1 }, { value: 'C 111111 111111', index: 2 }, { value: 'D 111111 111111', index: 3 }, { value: 'E 11111 1111111', index: 4 }, { value: 'F 1111111 11111', index: 5 }],
            columns: columnItems,
            values: cellSet
        }
    };

    var pivotGrid = createPivotGrid(pivotGridOptions, assert);
    this.clock.tick();
    // assert
    assert.ok(pivotGrid);
    var getRealHeight = function(element) {
        return window.getComputedStyle ? parseFloat(window.getComputedStyle(element).height) : element.clientHeight;
    };


    var tableElement = pivotGrid.$element().find('table').first();
    assert.strictEqual(tableElement.outerWidth(), 500);
    assert.ok(Math.abs(getRealHeight(pivotGrid.$element().children()[0]) - 250) <= 1);
    assert.ok(tableElement.hasClass('dx-pivotgrid-border'));
});

QUnit.test('Enable borders at runtime', function(assert) {
    var columnItems = [
        {
            value: '2010', index: 7,
            children: [
                { value: '10001', index: 0 },
                { value: '10002', index: 1 },
                { value: '10003', index: 2 },
                { value: '10004', index: 3 },
                { value: '10005', index: 4 },
                { value: '10006', index: 5 },
                { value: '10007', index: 6 }
            ]
        },
        { value: '2012', index: 8 },
        { value: '2012', index: 9 },
        { value: '2012', index: 10 },
        { value: '2012', index: 11 },
        { value: '2012', index: 12 }
    ];


    var cellSet = [
        [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
        [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 100],
        [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 100],
        [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 100],
        [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 100],
        [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 100],
        [300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 100]
    ];

    var pivotGridOptions = {
        fieldChooser: {
            enabled: false
        },
        width: 500,
        height: 250,
        dataSource: {
            fields: [
                { area: 'row' },
                { format: 'decimal', area: 'column' }, { format: 'decimal', area: 'column' },
                { caption: 'Sum1', format: 'currency', area: 'data' }
            ],
            rows: [{ value: 'A 111111 222222', index: 0 }, { value: 'B 1111111 11111', index: 1 }, { value: 'C 111111 111111', index: 2 }, { value: 'D 111111 111111', index: 3 }, { value: 'E 11111 1111111', index: 4 }, { value: 'F 1111111 11111', index: 5 }],
            columns: columnItems,
            values: cellSet
        }
    };

    var pivotGrid = createPivotGrid(pivotGridOptions, assert);
    this.clock.tick();

    // act
    pivotGrid.option('showBorders', true);

    // assert
    assert.ok(pivotGrid);
    var getRealHeight = function(element) {
        return window.getComputedStyle ? parseFloat(window.getComputedStyle(element).height) : element.clientHeight;
    };


    var tableElement = pivotGrid.$element().find('table').first();
    assert.strictEqual(tableElement.outerWidth(), 500);
    assert.ok(Math.abs(getRealHeight(pivotGrid.$element().children()[0]) - 250) <= 1);
    assert.ok(tableElement.hasClass('dx-pivotgrid-border'));
});

QUnit.test('DataController - scrollChanged event', function(assert) {
    var widget = createPivotGrid({
            dataSource: this.testOptions.dataSource,
            width: 200,
            height: 300,
            scrolling: {
                useNative: false
            }
        }, assert),
        dataController = widget._dataController,
        dataAreaScrollable = widget._dataArea.groupElement().dxScrollable('instance');

    dataController.scrollChanged.fire({
        left: 15,
        top: 10
    });

    widget.updateDimensions();

    this.clock.tick();

    assert.strictEqual(dataAreaScrollable.scrollTop(), 10);
    assert.strictEqual(dataAreaScrollable.scrollLeft(), 15);
});

// T518378
QUnit.test('Column area should be visible after change scrolling.mode to virtual', function(assert) {
    var widget = createPivotGrid({
        fieldChooser: {
            enabled: false
        },
        scrolling: {
            mode: 'standard'
        },
        dataSource: {
            fields: [{ area: 'row' }, { area: 'data' }],
            rows: [{ index: 0, value: 'Row 1' }],
            values: [
                [[1]],
                [[2]]
            ]
        }
    }, assert);

    widget.option({
        scrolling: {
            mode: 'virtual'
        }
    });

    assert.ok(widget.$element().find('.dx-area-column-cell').height() > 0, 'column area is visible');
});

QUnit.module('Field Panel', {
    beforeEach: function() {
        moduleConfig.beforeEach.apply(this, arguments);

        $.extend(true, this.testOptions, {
            fieldPanel: {
                visible: true
            },
            allowFiltering: true,
            allowSorting: true,
            fieldChooser: {
                enabled: false
            },
            dataSource: {
                fields: [
                    { area: 'row', areaIndex: 0, caption: 'Row Field 1' },
                    { area: 'row', areaIndex: 1, caption: 'Row' },

                    { format: 'decimal', area: 'column', areaIndex: 0, caption: 'Column1' },
                    { area: 'filter', areaIndex: 1, caption: 'Filter 1' },
                    { area: 'filter', areaIndex: 1, caption: 'Filter 2' },
                    { format: { format: 'quarter', dateType: 'full' }, area: 'column', areaIndex: 1, caption: 'Column1' },
                    { caption: 'Sum1', format: 'currency', area: 'data', areaIndex: 0 },
                    { caption: 'Sum2', format: 'percent', area: 'data', areaIndex: 1 }
                ]
            }
        });

    }
});

QUnit.test('pivot grid has correct size', function(assert) {
    var pivotGrid = createPivotGrid($.extend(true, this.testOptions, {
            height: 250,
            width: 1200,
            fieldPanel: {
                allowFieldDragging: false
            }
        }), assert),

        tableElement = pivotGrid.$element().find('table').first();

    // assert
    assert.ok(250 - tableElement.outerHeight() <= 1 && 250 - tableElement.outerHeight() >= 0, 'height');
    assert.strictEqual(tableElement.width(), 1200, 'width');
    assert.ok(!pivotGrid.hasScroll('column'), 'stretch to all width');
    assert.ok(pivotGrid.hasScroll('row'));

    var rowFieldsAreaColumnWidth = pivotGrid._rowFields.getColumnsWidth(),
        rowAreaColumnWidth = pivotGrid._rowsArea.getColumnsWidth(),
        baseFieldChooser = pivotGrid.$element().dxPivotGridFieldChooserBase('instance');

    assert.ok(baseFieldChooser, 'BaseFieldChooser is initialized');
    assert.strictEqual(baseFieldChooser.option('dataSource'), pivotGrid.getDataSource(), 'DataSource is passed to baseFieldChooser');
    assert.strictEqual(baseFieldChooser.option('allowFieldDragging'), false, 'allowFieldDragging is passed to fieldChooser');

    assert.deepEqual(rowFieldsAreaColumnWidth, rowAreaColumnWidth, 'rowArea and rowsFields width are synchronized');

    assert.strictEqual($('.dx-pivotgrid-toolbar').parent()[0], pivotGrid.$element().find('.dx-filter-header')[0]);
    assert.ok(pivotGrid.$element().find('.dx-area-description-cell').hasClass('dx-pivotgrid-background'), 'description with background');
    assert.strictEqual(pivotGrid.$element().find('.dx-area-description-cell').parent().hasClass('dx-ie'), !!browser.msie);
    assert.ok(pivotGrid.$element().find('.dx-filter-header').hasClass('dx-bottom-border'));
    assert.ok(pivotGrid.$element().find('.dx-column-header').hasClass('dx-bottom-border'));
});

QUnit.test('Column and Filter Headers', function(assert) {
    var pivotGrid = createPivotGrid($.extend(true, this.testOptions, {
        }), assert),

        tableElement = pivotGrid.$element().find('table').first();

    // assert
    var columnFieldTextElements = tableElement.find('.dx-column-header').find('.dx-area-field-content'),
        filterFieldTextElements = tableElement.find('.dx-column-header').find('.dx-area-field-content');

    assert.strictEqual(columnFieldTextElements.length, 2);
    assert.strictEqual(columnFieldTextElements[0].offsetWidth, columnFieldTextElements[0].scrollWidth, 'first column field');
    assert.strictEqual(columnFieldTextElements[1].offsetWidth, columnFieldTextElements[1].scrollWidth, 'second column field');

    assert.strictEqual(filterFieldTextElements.length, 2);
    assert.strictEqual(filterFieldTextElements[0].offsetWidth, filterFieldTextElements[0].scrollWidth, 'first column field');
    assert.strictEqual(filterFieldTextElements[1].offsetWidth, filterFieldTextElements[1].scrollWidth, 'second column field');

});

QUnit.test('Synchronize rowsFields and row headers', function(assert) {
    this.testOptions.dataSource.fields.push({ area: 'row', caption: 'Row Field 3' });

    var pivotGrid = createPivotGrid(this.testOptions, assert);

    function getColumnWidth($table) {
        var $cols = $table.find('col'),
            result = [];
        $.each($cols, function(_, col) {
            result.push(parseInt(col.style.width, 10));
        });

        return result;
    }

    // assert
    var rowFieldsAreaColumnWidth = getColumnWidth(pivotGrid._rowFields.tableElement()),
        rowAreaColumnWidth = getColumnWidth(pivotGrid._rowsArea.tableElement());

    assert.strictEqual(rowAreaColumnWidth.length, 3, 'rows area has two columns');
    assert.strictEqual(rowFieldsAreaColumnWidth.length, 3, 'rows area has two columns');

    assert.roughEqual(sumArray(rowAreaColumnWidth), sumArray(rowFieldsAreaColumnWidth), 1);
});

QUnit.test('synchronize rowsFields and row headers when rowHeaderLayout is tree', function(assert) {
    this.testOptions.dataSource.fields.push({ area: 'row', caption: 'Row Field 3' });

    this.testOptions.rowHeaderLayout = 'tree';

    var pivotGrid = createPivotGrid(this.testOptions, assert);

    // assert
    var rowFieldsAreaColumnWidth = pivotGrid._rowFields.getColumnsWidth(),
        rowAreaColumnWidth = pivotGrid._rowsArea.getColumnsWidth();

    assert.strictEqual(rowAreaColumnWidth.length, 2, 'rows area has two columns');
    assert.strictEqual(rowFieldsAreaColumnWidth.length, 3, 'rows area has two columns');

    assert.roughEqual(sumArray(rowAreaColumnWidth), sumArray(rowFieldsAreaColumnWidth), 2);
    assert.ok(rowFieldsAreaColumnWidth[0] - rowAreaColumnWidth[0] > 100);
});

QUnit.test('pivot grid has correct height. rowsFields Area > column area', function(assert) {
    var pivotGrid = createPivotGrid($.extend(this.testOptions, {
            height: 150,
            fieldChooser: {
                enabled: false
            },
            dataSource: {
                fields: [
                    { area: 'row' },
                    { area: 'column' }, { area: 'column' },
                    { caption: 'Sum1', area: 'data' }
                ],
                rows: [
                    { value: 'Accessories_1', index: 0 },
                    { value: 'Clothing', index: 1 },
                    { value: 'Clothing3', index: 2 },
                    { value: 'Clothing4', index: 3 },
                    { value: 'Clothing5', index: 4 },
                    { value: 'Clothing6', index: 5 }
                ],
                columns: [{
                    value: 'CY 2010', index: 0
                }, {
                    value: 'CY 2012', index: 1
                }, {
                    value: 'CY 2013', index: 2
                }, {
                    value: 'CY 2014', index: 3
                }],
                values: [
                    [[null], [null], [15], [36], [43], [100]],
                    [[962], [2625], [16], [37], [44], [200]],
                    [[962], [2625], [1753], [11753], [11753]]
                ]
            }
        }), assert),
        tableElement = pivotGrid.$element().find('table').first();
    // assert
    assert.ok(150 - tableElement.height() <= 1, 'height');
});

QUnit.test('Hide field headers at runtime', function(assert) {
    var pivotGrid = createPivotGrid($.extend(true, this.testOptions, {
            fieldPanel: {
                showDataFields: false,
                showRowFields: false,
            },
            fieldChooser: {
                enabled: true
            },
            'export': {
                enabled: true
            },
            width: 1200,
            height: 250
        }), assert),
        tableElement = pivotGrid.$element().find('table').first();

    pivotGrid.option({
        fieldPanel: {
            showDataFields: true,
            showColumnFields: false,
            showFilterFields: false,
            showRowFields: true
        }
    });

    // assert
    assert.ok(250 - tableElement.outerHeight() <= 1 && 250 - tableElement.outerHeight() >= 0, 'height');
    assert.strictEqual(tableElement.width(), 1200, 'width');
    assert.ok(!pivotGrid.hasScroll('column'), 'stretch to all width');
    assert.ok(pivotGrid.hasScroll('row'));

    var rowFieldsAreaColumnWidth = pivotGrid._rowFields.getColumnsWidth(),
        rowAreaColumnWidth = pivotGrid._rowsArea.getColumnsWidth();
    assert.deepEqual(rowFieldsAreaColumnWidth, rowAreaColumnWidth, 'rowArea and rowsFields width are synchronized');

    assert.ok(!tableElement.find('.dx-column-header .dx-pivotgrid-fields-area').is(':visible'), 'column fields area');
    assert.ok(!tableElement.find('.dx-filter-header .dx-pivotgrid-fields-area').is(':visible'), 'filter fields area');

    assert.ok(tableElement.find('.dx-area-description-cell .dx-pivotgrid-fields-area').is(':visible'), 'row fields area');
    assert.ok(tableElement.find('.dx-data-header .dx-pivotgrid-fields-area').is(':visible'), 'data fields area');

    assert.strictEqual($('.dx-pivotgrid-toolbar').length, 1);
    assert.strictEqual($('.dx-pivotgrid-toolbar').find('.dx-button').length, 2);
    assert.strictEqual($('.dx-pivotgrid-toolbar').parent()[0], pivotGrid.$element().find('.dx-column-header')[0]);
    assert.ok(pivotGrid.$element().find('.dx-area-description-cell').hasClass('dx-pivotgrid-background'), 'description with background');
    assert.ok(!pivotGrid.$element().find('.dx-filter-header').hasClass('dx-bottom-border'));
    assert.ok(pivotGrid.$element().find('.dx-column-header').hasClass('dx-bottom-border'));
});

QUnit.test('Data and column headers not visible', function(assert) {
    var pivotGrid = createPivotGrid($.extend(true, this.testOptions, {
        fieldPanel: {
            showDataFields: false,
            showColumnFields: false
        },
        fieldChooser: {
            enabled: true
        },
        'export': {
            enabled: true
        },
        width: 1200,
        height: 250
    }), assert);

    // assert
    assert.ok(pivotGrid.$element().find('.dx-filter-header').hasClass('dx-bottom-border'));
    assert.ok(!pivotGrid.$element().find('.dx-column-header').hasClass('dx-bottom-border'));
});

QUnit.test('show borders', function(assert) {
    var pivotGrid = createPivotGrid($.extend(this.testOptions, {
            width: 1200,
            height: 250,
            showBorders: true
        }), assert),
        tableElement = pivotGrid.$element().find('table').first();

    // assert
    assert.ok(250 - tableElement.outerHeight() <= 1 && 250 - tableElement.outerHeight() >= 0, 'height');
    assert.strictEqual(tableElement.outerWidth(), 1200, 'width');
    assert.ok(!pivotGrid.hasScroll('column'), 'stretch to all width');
    assert.ok(pivotGrid.hasScroll('row'));

    var rowFieldsAreaColumnWidth = pivotGrid._rowFields.getColumnsWidth(),
        rowAreaColumnWidth = pivotGrid._rowsArea.getColumnsWidth();
    assert.deepEqual(rowFieldsAreaColumnWidth, rowAreaColumnWidth, 'rowArea and rowsFields width are synchronized');
});

QUnit.test('Fields are draggable', function(assert) {
    var pivotGrid = createPivotGrid($.extend(true, this.testOptions, {
            fieldPanel: {
                allowFieldDragging: true
            }
        }), assert),
        field = pivotGrid.$element().find('.dx-area-field').first();

    pointerMock(field)
        .start()
        .down()
        .move(-10, -1)
        .move(-20, -1);

    assert.strictEqual($('.dx-drag').length, 1);
});

QUnit.module('Tests with real timer', {});

QUnit.test('Do not re-render continuously when virtual scrolling enabled', function(assert) {
    function getRandomStore() {
        function getRandomElement(dim, n) {
            return dim + '_' + Math.floor((Math.random() * n) + 1);
        }

        function getRandomValue() {
            return Math.floor((Math.random() * 1000) + 1);
        }

        var store = [];

        for(var i = 0; i < 1000; i++) {
            store.push({
                d1: getRandomElement('d1', 5000),
                d2: getRandomElement('d2', 8),
                d3: getRandomElement('d3', 8),

                v1: getRandomValue()
            });
        }
        return store;
    }

    var done = assert.async(),
        pivotGrid = createPivotGrid({
            dataSource: {
                fields: [
                    { dataField: 'd1', area: 'row' },
                    { dataField: 'd2', area: 'column', expanded: true },
                    { dataField: 'd3', area: 'column' },
                    { dataField: 'v1', area: 'data', summaryType: 'sum', dataType: 'number' }
                ],
                store: getRandomStore(),
            },
            height: 600,
            width: 1000,
            scrolling: {
                mode: 'virtual',
                renderingThreshold: 1,
                timeout: 1,
            }
        }, assert);

    pivotGrid.on('contentReady', function(e) {
        e.component.off('contentReady');
        pivotGrid._dataArea.scrollTo({ x: 600, y: 4000 });

        var contentReadyCount = 0;

        e.component.on('contentReady', function() {
            contentReadyCount++;
            if(contentReadyCount > 0) {
                assert.equal(contentReadyCount, 1);
                done();
            }

            if(contentReadyCount > 2) {
                pivotGrid.element().remove();
                assert.ok(false, 'infinite rendering loop');
            }
        });
    });

});


QUnit.module('Tests with stubs', {
    beforeEach: function() {
        var that = this,
            HorizontalHeadersArea = headersArea.HorizontalHeadersArea,
            VerticalHeadersArea = headersArea.VerticalHeadersArea,
            DataArea = dataArea.DataArea,
            DataController = pivotGridDataController.DataController;

        that.horizontalArea = sinon.createStubInstance(HorizontalHeadersArea);
        that.horizontalArea.tableElement.returns($('<div>'));
        that.horizontalArea.groupElement.returns($('<div>'));
        that.horizontalArea.element.returns($('<div>'));
        that.horizontalArea.on.returns(that.horizontalArea);
        that.horizontalArea.off.returns(that.horizontalArea);

        sinon.stub(headersArea, 'HorizontalHeadersArea', function() {
            return that.horizontalArea;
        });

        that.verticalArea = sinon.createStubInstance(VerticalHeadersArea);
        that.verticalArea.tableElement.returns($('<div>'));
        that.verticalArea.groupElement.returns($('<div>'));
        that.verticalArea.element.returns($('<div>'));
        that.verticalArea.getColumnsWidth.returns([100]);
        that.verticalArea.getRowsHeight.returns([]);
        that.verticalArea.on.returns(that.verticalArea);
        that.verticalArea.off.returns(that.verticalArea);

        sinon.stub(headersArea, 'VerticalHeadersArea', function() {
            return that.verticalArea;
        });

        that.dataArea = sinon.createStubInstance(DataArea);
        that.dataArea.headElement.returns($('<div>').height(30).width(100));
        that.dataArea.tableElement.returns($('<div>').width(200).height(100));
        that.dataArea.element.returns($('<div>'));
        that.dataArea.groupElement.returns($('<div>'));
        that.dataArea.getRowsHeight.returns([]);
        that.dataArea.getData.returns([]);
        that.dataArea.on.returns(that.dataArea);
        that.dataArea.off.returns(that.dataArea);

        sinon.stub(dataArea, 'DataArea', function() {
            return that.dataArea;
        });

        var createMockDataSource = function(options) {
            $.each(options.fields || [], function(index, field) {
                field.index = index;
            });

            var stubDataSource = {
                getAreaFields: function(area) {
                    return options[area + 'Fields'] || [];
                },
                field: sinon.stub(),
                getFieldValues: function(index) {
                    return $.Deferred().resolve(options.fieldValues[index]);
                },
                fields: function() {
                    return options.fields;
                },
                state: function() {
                    return {
                        fields: options.fields
                    };
                },
                load: sinon.stub(),
                on: sinon.stub(),
                off: sinon.stub()
            };

            return stubDataSource;
        };

        that.dataController = sinon.createStubInstance(DataController);
        that.dataController.getCellsInfo.returns([]);
        that.dataController.getColumnsInfo.returns([]);
        that.dataController.getRowsInfo.returns([]);

        sinon.stub(pivotGridDataController, 'DataController', function(options) {
            var dataController = that.dataController,
                dataSource = createMockDataSource(options.dataSource);

            dataController.changed = $.Callbacks();
            dataController.loadingChanged = $.Callbacks();
            dataController.progressChanged = $.Callbacks();
            dataController.expandValueChanging = $.Callbacks();
            dataController.dataSourceChanged = $.Callbacks();

            dataController.scrollChanged = $.Callbacks();

            dataController.getDataSource.returns(dataSource);

            return dataController;
        });

        moduleConfig.beforeEach.apply(this, arguments);
    },
    afterEach: function() {
        headersArea.HorizontalHeadersArea.restore();
        headersArea.VerticalHeadersArea.restore();
        dataArea.DataArea.restore();
        pivotGridDataController.DataController.restore();
    }
});

QUnit.test('Rows height calculation', function(assert) {
    this.dataArea.getRowsHeight.returns([43, 23, 34, 22, 88, 10]);
    this.verticalArea.getRowsHeight.returns([30, 28, 70, 30]);

    this.dataController.getColumnsInfo.returns([{}, {}]);
    // arrange
    createPivotGrid({
        dataSource: {
            fields: [{ area: 'column' }, { area: 'column' }],
            columns: [
                {
                    value: 1,
                    index: 1,
                    children: [{
                        value: 11,
                        index: 2
                    }]
                }
            ]
        }
    }, assert);

    // assert
    assert.deepEqual(this.verticalArea.setRowsHeight.lastCall.args[0], [34, 28, 88, 30]);
    assert.deepEqual(this.dataArea.setRowsHeight.lastCall.args[0], [34, 28, 88, 30]);
});

QUnit.test('Rows height calculation when no data', function(assert) {
    this.dataArea.getRowsHeight.returns([43, 23]);
    this.verticalArea.getRowsHeight.returns([30, 28, 70, 30]);

    this.dataController.getColumnsInfo.returns([{}]);

    // arrange
    createPivotGrid(this.testOptions, assert);

    // assert
    assert.deepEqual(this.verticalArea.setRowsHeight.lastCall.args[0], [30, 28, 70, 30]);
    assert.deepEqual(this.dataArea.setRowsHeight.lastCall.args[0], [30, 28, 70, 30]);
});

QUnit.test('Rows height calculation when no data and many header rows', function(assert) {
    this.dataArea.getRowsHeight.returns([43, 23, 34]);
    this.verticalArea.getRowsHeight.returns([30, 28]);

    this.dataController.getColumnsInfo.returns([{}, {}, {}, {}, {}]);

    // arrange
    createPivotGrid({
        dataSource: {
            fields: [{ area: 'column' }, { area: 'column' }, { area: 'column' }],
            columns: [
                {
                    value: 1,
                    index: 1,
                    children: [{
                        value: 11,
                        index: 2,
                        children: [{
                            value: 111,
                            index: 3
                        }]
                    }]
                }
            ]
        }
    }, assert);

    // assert
    assert.deepEqual(this.verticalArea.setRowsHeight.lastCall.args[0], [30, 28]);
    assert.deepEqual(this.dataArea.setRowsHeight.lastCall.args[0], [30, 28]);
});

QUnit.test('columns area row height calculation when description area is big', function(assert) {
    this.dataArea.getRowsHeight.returns([20, 8, 34, 22, 88, 10]);
    this.verticalArea.getRowsHeight.returns([30, 28, 70, 30]);

    this.dataController.getColumnsInfo.returns([{}, {}]);
    // arrange
    var pivot = createPivotGrid({
            fieldChooser: {
                enabled: false
            },
            dataSource: {
                fields: [{ area: 'column' }, { area: 'column' }],
                columns: [
                    {
                        value: 1,
                        index: 1,
                        children: [{
                            value: 11,
                            index: 2
                        }]
                    }
                ]
            }
        }, assert),

        tableElement = pivot.$element().find('table').first(),
        descriptionCell = tableElement.find('.dx-area-description-cell');

    descriptionCell.height(80);

    var delta = (getSize(descriptionCell[0], 'height', {
        paddings: true,
        borders: true,
        margins: true
    }) - 28) / 2;

    // act
    pivot.updateDimensions();

    // assert

    assert.deepEqual(this.horizontalArea.setRowsHeight.lastCall.args[0], [20 + delta, 8 + delta]);

    assert.deepEqual(this.verticalArea.setRowsHeight.lastCall.args[0], [34, 28, 88, 30]);
    assert.deepEqual(this.dataArea.setRowsHeight.lastCall.args[0], [34, 28, 88, 30]);
});

QUnit.test('columns area row height calculation when description area is small', function(assert) {
    this.dataArea.getRowsHeight.returns([20, 8, 34, 22, 88, 10]);
    this.verticalArea.getRowsHeight.returns([30, 28, 70, 30]);

    this.dataController.getColumnsInfo.returns([{}, {}]);
    // arrange
    var pivot = createPivotGrid({
            fieldChooser: {
                enabled: false
            },
            dataSource: {
                fields: [{ area: 'column' }, { area: 'column' }],
                columns: [
                    {
                        value: 1,
                        index: 1,
                        children: [{
                            value: 11,
                            index: 2
                        }]
                    }
                ]
            }
        }, assert),

        tableElement = pivot.$element().find('table').first();
    tableElement.find('.dx-area-description-cell').height(25);

    // act
    pivot.updateDimensions();
    // assert
    assert.ok(!this.horizontalArea.setRowsHeight.called);
    assert.deepEqual(this.verticalArea.setRowsHeight.lastCall.args[0], [34, 28, 88, 30]);
    assert.deepEqual(this.dataArea.setRowsHeight.lastCall.args[0], [34, 28, 88, 30]);
});

QUnit.test('Virtual Scrolling', function(assert) {
    this.dataArea.getColumnsWidth.returns([20, 40, 60, 20]);
    this.dataArea.getRowsHeight.returns([43, 23, 34]);
    this.verticalArea.getRowsHeight.returns([30, 28]);

    this.horizontalArea.groupElement().height(25);

    this.dataController.calculateVirtualContentParams.returns({
        width: 2000,
        height: 1000,
        contentLeft: 30,
        contentTop: 15
    }).reset();

    var pivotGrid = createPivotGrid({
        dataSource: this.testOptions.dataSource,
        height: 300,
        scrolling: {
            mode: 'virtual'
        }
    }, assert);

    assert.ok(this.dataArea.reset.calledOnce);
    assert.ok(this.horizontalArea.reset.calledOnce);
    assert.ok(this.verticalArea.reset.calledOnce);

    assert.deepEqual(this.dataArea.setVirtualContentParams.lastCall.args, [{
        height: 1000,
        width: 2000,
        left: 30,
        top: 15
    }]);
    assert.deepEqual(this.verticalArea.setVirtualContentParams.lastCall.args, [{
        height: 1000,
        top: 15,
        width: 100
    }]);
    assert.deepEqual(this.horizontalArea.setVirtualContentParams.lastCall.args, [{
        height: 25,
        width: 2000,
        left: 30
    }]);

    assert.strictEqual(this.dataController.calculateVirtualContentParams.callCount, 1);

    assert.deepEqual(this.dataController.calculateVirtualContentParams.lastCall.args[0], {
        columnCount: 4,
        itemHeights: [43, 28],
        itemWidths: [20, 40, 60, 20],
        rowCount: 2,
        viewportHeight: 71,
        viewportWidth: 899,
        virtualColumnWidth: 100,
        virtualRowHeight: 50
    });

    assert.ok(this.dataArea.processScroll.calledAfter(this.horizontalArea.setVirtualContentParams));
    assert.deepEqual(this.dataArea.processScroll.lastCall.args[0], pivotGrid.__scrollBarUseNative);
    assert.strictEqual(this.dataArea.groupHeight.lastCall.args[0], 71);
    assert.strictEqual(this.verticalArea.groupHeight.lastCall.args[0], 71);
    assert.ok(!this.dataController.subscribeToWindowScrollEvents.called);

});

QUnit.test('Virtual Scrolling. Widget height is not defined', function(assert) {
    this.dataArea.getColumnsWidth.returns([20, 40, 60, 20]);
    this.dataArea.getRowsHeight.returns([43, 23, 34]);
    this.verticalArea.getRowsHeight.returns([30, 28]);

    this.horizontalArea.groupElement().height(25);

    this.dataController.calculateVirtualContentParams.returns({
        width: 2000,
        height: 1000,
        contentLeft: 30,
        contentTop: 15
    }).reset();

    var pivotGrid = createPivotGrid({
        dataSource: this.testOptions.dataSource,
        scrolling: {
            mode: 'virtual'
        }
    }, assert);

    assert.ok(this.dataArea.reset.calledOnce);
    assert.ok(this.horizontalArea.reset.calledOnce);
    assert.ok(this.verticalArea.reset.calledOnce);

    assert.deepEqual(this.dataArea.setVirtualContentParams.lastCall.args, [{
        height: 1000,
        width: 2000,
        left: 30,
        top: 15
    }]);
    assert.deepEqual(this.verticalArea.setVirtualContentParams.lastCall.args, [{
        height: 1000,
        top: 15,
        width: 100
    }]);
    assert.deepEqual(this.horizontalArea.setVirtualContentParams.lastCall.args, [{
        height: 25,
        width: 2000,
        left: 30
    }]);

    assert.strictEqual(this.dataController.calculateVirtualContentParams.callCount, 1);

    assert.deepEqual(this.dataController.calculateVirtualContentParams.lastCall.args[0], {
        columnCount: 4,
        itemHeights: [43, 28],
        itemWidths: [20, 40, 60, 20],
        rowCount: 2,
        viewportHeight: $(window).outerHeight(),
        viewportWidth: 899,
        virtualColumnWidth: 100,
        virtualRowHeight: 50
    });

    assert.ok(this.dataArea.processScroll.calledAfter(this.horizontalArea.setVirtualContentParams));
    assert.deepEqual(this.dataArea.processScroll.lastCall.args[0], pivotGrid.__scrollBarUseNative);

    assert.strictEqual(this.dataArea.groupHeight.lastCall.args[0], 'auto');
    assert.strictEqual(this.verticalArea.groupHeight.lastCall.args[0], 'auto');

    assert.ok(this.dataController.subscribeToWindowScrollEvents.called);
    assert.strictEqual(this.dataController.subscribeToWindowScrollEvents.lastCall.args[0], this.dataArea.groupElement());
});

QUnit.test('DataController creation', function(assert) {
    var texts = {
        collapseAll: 'CollapseAll',
        expandAll: 'ExpandAll',
        grandTotal: 'GrandTotal',
        exportToExcel: 'Export to Excel file',
        noData: 'NoData',
        dataNotAvailable: 'Error',
        removeAllSorting: 'RemoveAllSorting',
        showFieldChooser: 'ShowFieldChooser',
        sortColumnBySummary: 'SortColumnBySummary',
        sortRowBySummary: 'SortRowBySummary',
        total: 'Total',
        'columnFieldArea': 'Drop Column Fields Here',
        'dataFieldArea': 'Drop Data Fields Here',
        'filterFieldArea': 'Drop Filter Fields Here',
        'rowFieldArea': 'Drop Row Fields Here'
    };

    createPivotGrid({
        dataSource: this.testOptions.dataSource,
        showColumnGrandTotals: 'customShowColumnGrandTotals',
        showColumnTotals: 'customShowColumnTotals',
        showRowGrandTotals: 'customShowRowGrandTotals',
        showRowTotals: 'customShowRowGrandTotals',
        showTotalsPrior: 'customShowTotalOnTop',
        hideEmptySummaryCells: 'hideEmptySummaryCellsValue',
        texts: texts,
        dataFieldArea: 'row',
        rowHeaderLayout: 'tree'
    }, assert);

    assert.ok(pivotGridDataController.DataController.calledWithNew);
    assert.ok(pivotGridDataController.DataController.calledOnce);

    var dataControllerOptions = pivotGridDataController.DataController.lastCall.args[0];

    assert.deepEqual(dataControllerOptions.dataSource, this.testOptions.dataSource);
    assert.deepEqual(dataControllerOptions.texts, texts);

    assert.strictEqual(dataControllerOptions.showColumnGrandTotals, 'customShowColumnGrandTotals');
    assert.strictEqual(dataControllerOptions.showColumnTotals, 'customShowColumnTotals');
    assert.strictEqual(dataControllerOptions.showRowGrandTotals, 'customShowRowGrandTotals');
    assert.strictEqual(dataControllerOptions.showRowTotals, 'customShowRowGrandTotals');
    assert.strictEqual(dataControllerOptions.showTotalsPrior, 'customShowTotalOnTop');
    assert.strictEqual(dataControllerOptions.hideEmptySummaryCells, 'hideEmptySummaryCellsValue');
    assert.strictEqual(dataControllerOptions.dataFieldArea, 'row');
    assert.strictEqual(dataControllerOptions.rowHeaderLayout, 'tree');
});

QUnit.test('Change DataController options', function(assert) {
    var texts = {
            collapseAll: 'CollapseAll',
            expandAll: 'ExpandAll',
            grandTotal: 'GrandTotal',
            noData: 'NoData',
            removeAllSorting: 'RemoveAllSorting',
            showFieldChooser: 'ShowFieldChooser',
            sortColumnBySummary: 'SortColumnBySummary',
            sortRowBySummary: 'SortRowBySummary',
            total: 'Total'
        },
        widget = createPivotGrid({
            dataSource: this.testOptions.dataSource,
            showColumnGrandTotals: 'customShowColumnGrandTotals',
            showColumnTotals: 'customShowColumnTotals',
            showRowGrandTotals: 'customShowRowGrandTotals',
            showRowTotals: 'customShowRowGrandTotals',
            showTotalsPrior: 'customShowTotalOnTop',
            rowHeaderLayout: 'standard',
            texts: texts
        }, assert);

    $.each(['texts',
        'showColumnGrandTotals',
        'showColumnTotals',
        'showRowGrandTotals',
        'showRowTotals',
        'showTotalsPrior',
        'hideEmptySummaryCells',
        'rowHeaderLayout'
    ], function(index, optionName) {
        widget.option(optionName, index);
    });

    assert.ok(pivotGridDataController.DataController.calledWithNew);
    assert.ok(pivotGridDataController.DataController.calledOnce);

    var dataController = pivotGridDataController.DataController.lastCall.returnValue,
        dataControllerOptions = dataController.updateViewOptions.lastCall.args[0];

    assert.strictEqual(dataController.updateViewOptions.callCount, 8);

    assert.deepEqual(dataControllerOptions.dataSource, this.testOptions.dataSource);
    assert.deepEqual(dataControllerOptions.texts, 0);

    assert.strictEqual(dataControllerOptions.showColumnGrandTotals, 1);
    assert.strictEqual(dataControllerOptions.showColumnTotals, 2);
    assert.strictEqual(dataControllerOptions.showRowGrandTotals, 3);
    assert.strictEqual(dataControllerOptions.showRowTotals, 4);
    assert.strictEqual(dataControllerOptions.showTotalsPrior, 5);
    assert.strictEqual(dataControllerOptions.hideEmptySummaryCells, 6);
    assert.strictEqual(dataControllerOptions.rowHeaderLayout, 7);
});


QUnit.module('headersArea', {
    beforeEach: function() {
        this.headers = [
            [{ text: 'A', colspan: 2, expanded: true, type: 'D', path: ['A'] }, { text: 'Grand total', rowspan: 2, index: 2, type: 'GT' }],
            [{ text: '1', index: 0, type: 'D', expanded: false, path: ['1'] }, { text: '2', index: 1, type: 'D' }]
        ];
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
});

function getStubComponent(options) {
    options = options || {};
    return {
        option: function() {
            return options[arguments[0]];
        },
        _defaultActionArgs: function() {
            return {};
        },
        _eventsStrategy: {
            hasEvent: function() {
                return false;
            }
        },
    };
}

function createHeadersArea(dataSource, isVertical, componentOptions) {
    var component = getStubComponent(componentOptions);
    if(!isVertical) {
        return new headersArea.HorizontalHeadersArea(component);
    } else {
        return new headersArea.VerticalHeadersArea(component);
    }
}

// B235127
QUnit.test('getColumnWidths', function(assert) {
    // arrange
    var headersArea = createHeadersArea(),
        testElement = $('#pivotArea'),
        table,
        rows;

    headersArea.render(testElement, [
        [{ text: '1' }, { text: '12', rowspan: 2 }, { text: '123', colspan: 2 }],
        [{ text: '1234' }, { text: '12345' }, { text: '123456' }]
    ]);
    table = testElement.find('table');
    rows = table[0].rows;
    // act
    var columnWidths = headersArea.getColumnsWidth();

    // assert
    assert.equal(columnWidths.length, 4);
    assert.equal(columnWidths[0], getRealElementWidth(rows[1].cells[0]));
    assert.equal(columnWidths[1], getRealElementWidth(rows[0].cells[1]));
    assert.equal(columnWidths[2], getRealElementWidth(rows[1].cells[1]));
    assert.equal(columnWidths[3], getRealElementWidth(rows[1].cells[2]));
});

QUnit.test('Headers area render', function(assert) {
    // arrange
    var headersArea = createHeadersArea(),
        testElement = $('#pivotArea'),
        table,
        rows;

    // act
    headersArea.render(testElement, this.headers);
    table = testElement.find('table');
    rows = table[0].rows;

    // assert
    assert.ok(table.length === 1, 'tables count');
    assert.ok(rows.length === 2, 'rows count');
    assert.ok(rows[0].cells.length === 2, 'row1 cells count');
    assert.ok(rows[1].cells.length === 2, 'row2 cells count');

    assert.equal($(rows[0].cells[0]).text(), 'A', 'cell 1 - text');
    assert.equal($(rows[0].cells[0]).attr('colspan'), '2', 'cell 1 - colspan attribute');

    assert.equal($(rows[0].cells[1]).text(), 'Grand total', 'cell 2 - text');
    assert.equal($(rows[0].cells[1]).attr('rowspan'), '2', 'cell 2 - rowspan attribute');
    assert.ok($(rows[0].cells[1]).hasClass('dx-grandtotal'), 'cell 2 - grand total style');

    assert.equal($(rows[1].cells[0]).text(), '1', 'cell 3 - text');

    assert.equal($(rows[1].cells[1]).text(), '2', 'cell 3 - text');
});

QUnit.test('Headers area render. Wordwrapping in cell', function(assert) {
    // arrange
    var headersArea = createHeadersArea(),
        testElement = $('#pivotArea'),
        table,
        rows;

    // act
    headersArea.render(testElement, [
        [{ text: 'A', colspan: 2, expanded: true, type: 'D', path: ['A'] }, { text: 'Grand total', rowspan: 2, index: 2, type: 'GT', wordWrapEnabled: false }],
        [{ text: '1', index: 0, type: 'D', expanded: false, path: ['1'], wordWrapEnabled: true }, { text: '2', index: 1, type: 'D' }]
    ]);
    table = testElement.find('table');
    rows = table[0].rows;

    // assert
    assert.equal($(rows[0].cells[1]).find('span').get(0).style.whiteSpace, 'nowrap', 'cell 2 (GrandTotal)');
    assert.equal($(rows[1].cells[0]).find('span').get(1).style.whiteSpace, 'normal', 'cell 3 (1)');
    assert.equal($(rows[1].cells[1]).find('span').get(0).style.whiteSpace, '', 'cell 4 (2)');
});

QUnit.test('apply cell width', function(assert) {
    // arrange
    var headersArea = createHeadersArea(),
        testElement = $('#pivotArea'),
        table,
        rows;

    this.headers[0][0].width = 700;

    // act
    headersArea.render(testElement, this.headers);
    table = testElement.find('table');
    rows = table[0].rows;
    // assert
    assert.equal($(rows[0].cells[0]).css('min-width'), '700px', 'cell 1 - has correct width');
});

QUnit.test('Headers area rerender', function(assert) {
    // arrange
    var headersArea = createHeadersArea(),
        testElement = $('#pivotArea'),
        tableElement;

    // act
    headersArea.render(testElement, this.headers);
    tableElement = testElement.find('table');

    // assert
    assert.ok(tableElement.length === 1, '1 render - headers element count');
    assert.ok(tableElement[0].rows.length === 2, '1 render - rows count');
    assert.ok(tableElement[0].rows[0].cells.length === 2, '1 render - row1 cells count');
    assert.ok(tableElement[0].rows[1].cells.length === 2, '1 render - row1 cells count');

    // act
    headersArea.render(testElement, this.headers);
    tableElement = testElement.find('table');

    // assert
    assert.ok(tableElement.length === 1, '1 render - headers element count');
    assert.ok(tableElement[0].rows.length === 2, '1 render - rows count');
    assert.ok(tableElement[0].rows[0].cells.length === 2, '1 render - row1 cells count');
    assert.ok(tableElement[0].rows[1].cells.length === 2, '1 render - row1 cells count');
});

QUnit.test('Apply css classes by horizontal orientation', function(assert) {
    // arrange
    var headersArea = createHeadersArea(),
        testElement = $('#pivotArea');

    // act
    headersArea.render(testElement, this.headers);

    // assert
    assert.equal(testElement.find('div.dx-pivotgrid-horizontal-headers').length, 1, 'horizontal headers');
});

// B232782
QUnit.test('Apply borders right style for last cells', function(assert) {
    // arrange
    var headersArea = createHeadersArea(),
        testElement = $('#pivotGrid'),
        rows;

    function getLastCellText(row) {
        var childNodes = row.cells[row.cells.length - 1].childNodes;
        return $(childNodes[childNodes.length - 1]).text();
    }
    function getLastCellRightBorderWidth(row) {
        return row.cells[row.cells.length - 1].style.borderRightWidth;
    }

    // act
    headersArea.render(testElement, [
        [{ text: 'A', colspan: 2, expanded: true, type: 'D' }, { text: 'Grand total', rowspan: 2, type: 'GT' }],
        [{ text: '1', rowspan: 2, type: 'D', expanded: false }, { text: '2', colspan: 2, type: 'D', expanded: true }],
        [{ text: '21', type: 'D' }, { text: '22', type: 'D' }]
    ]);

    rows = testElement.find('table')[0].rows;

    // assert
    assert.equal(getLastCellText(rows[0]), 'Grand total', '1 row last cell - text');
    assert.equal(getLastCellRightBorderWidth(rows[0]), '0px', '1 row last cell - border right');

    assert.equal(getLastCellText(rows[1]), '2', '2 row last cell - text');
    assert.equal(getLastCellRightBorderWidth(rows[1]), '0px', '2 row last cell - border right');

    assert.equal(getLastCellText(rows[2]), '22', '3 row last cell - text');
    assert.equal(getLastCellRightBorderWidth(rows[2]), '0px', '3 row last cell - border right');
});

QUnit.test('Set border bottom width to zero for all cells in a last row', function(assert) {
    // arrange
    var headersArea = createHeadersArea(),
        testElement = $('#pivotArea'),
        rows;

    // act
    headersArea.render(testElement, [
        [{ text: 'A', colspan: 2, expanded: true, type: 'D' }, { text: 'Grand total', rowspan: 2, type: 'GT' }],
        [{ text: '1', rowspan: 2, type: 'D', expanded: false }, { text: '2', colspan: 2, type: 'D', expanded: true }],
        [{ text: '21', type: 'D' }, { text: '22', type: 'D' }]
    ]);
    rows = testElement.find('tr');

    // assert
    assert.equal($(rows[1].cells[0]).text(), '1', 'row 1 cell 0 text');
    assert.equal($(rows[1].cells[0]).css('borderBottomWidth'), '0px', 'row 1 cell 0 border-bottom-width style');
    assert.equal($(rows[2].cells[0]).text(), '21', 'row 2 cell 0 text');
    assert.equal($(rows[2].cells[0]).css('borderBottomWidth'), '0px', 'row 2 cell 0 border-bottom-width style');
    assert.equal($(rows[2].cells[1]).text(), '22', 'row 2 cell 1 text');
    assert.equal($(rows[2].cells[1]).css('borderBottomWidth'), '0px', 'row 2 cell 1 border-bottom-width style');
});

QUnit.test('Add the verticalScroll css style when pivot grid has a vertical scrollbar', function(assert) {
    // arrange
    var headersArea = createHeadersArea(),
        testElement = $('#pivotArea');

    // act
    headersArea.render(testElement, [
        [{ text: 'A', colspan: 2, expanded: true, type: 'D' }, { text: 'Grand total', rowspan: 2, type: 'GT' }],
        [{ text: '1', rowspan: 2, type: 'D', expanded: false }, { text: '2', colspan: 2, type: 'D', expanded: true }],
        [{ text: '21', type: 'D' }, { text: '22', type: 'D' }]
    ]);
    headersArea.processScrollBarSpacing(17);

    // assert
    assert.ok(headersArea._groupElement.hasClass('dx-vertical-scroll'), 'style for vertical scrollbar');
    assert.strictEqual(headersArea.tableElement().siblings().length, 0);
});

QUnit.test('Remove the verticalScroll css style when pivot grid has no a vertical scrollbar more', function(assert) {
    // arrange
    var headersArea = createHeadersArea(),
        testElement = $('#pivotArea');

    // act
    headersArea.render(testElement, [
        [{ text: 'A', colspan: 2, expanded: true, type: 'D' }, { text: 'Grand total', rowspan: 2, type: 'GT' }],
        [{ text: '1', rowspan: 2, type: 'D', expanded: false }, { text: '2', colspan: 2, type: 'D', expanded: true }],
        [{ text: '21', type: 'D' }, { text: '22', type: 'D' }]
    ]);
    headersArea.processScrollBarSpacing(17);
    headersArea.processScrollBarSpacing(0);

    // assert
    assert.ok(!headersArea._groupElement.hasClass('dx-vertical-scroll'), 'style for vertical scrollbar');
});

QUnit.test('Default float alignment of a group element with scroll spacing', function(assert) {
    // arrange
    var headersArea = createHeadersArea(),
        testElement = $('#pivotArea');

    // act
    headersArea.render(testElement, [
        [{ text: 'A', colspan: 2, expanded: true, type: 'D' }, { text: 'Grand total', rowspan: 2, type: 'GT' }],
        [{ text: '1', rowspan: 2, type: 'D', expanded: false }, { text: '2', colspan: 2, type: 'D', expanded: true }],
        [{ text: '21', type: 'D' }, { text: '22', type: 'D' }]
    ]);
    headersArea.processScrollBarSpacing(17);

    // assert
    assert.equal(headersArea._groupElement.css('float'), 'left', 'Align by the left');
});

QUnit.test('Set correct float alignment of a group element when pivot grid render with RTL layout and scroll spacing', function(assert) {
    // arrange
    var headersArea = createHeadersArea(null, false, { rtlEnabled: true }),
        testElement = $('#pivotArea');

    // act
    headersArea.render(testElement, [
        [{ text: 'A', colspan: 2, expanded: true, type: 'D' }, { text: 'Grand total', rowspan: 2, type: 'GT' }],
        [{ text: '1', rowspan: 2, type: 'D', expanded: false }, { text: '2', colspan: 2, type: 'D', expanded: true }],
        [{ text: '21', type: 'D' }, { text: '22', type: 'D' }]
    ]);
    headersArea.processScrollBarSpacing(17);

    // assert
    assert.equal(headersArea._groupElement.css('float'), 'right', 'Align by the right');
});

QUnit.test('EncodeHtml is enabled', function(assert) {
    // arrange
    var headersArea = createHeadersArea(null, false, {
            encodeHtml: true
        }),
        $cells,
        testElement = $('#pivotArea');

    // act
    headersArea.render(testElement, [
        [{ text: '<b>A</b>', colspan: 2, expanded: true, type: 'D' }, { text: 'Grand total', rowspan: 2, type: 'GT' }],
        [{ text: '1', rowspan: 2, type: 'D', expanded: false }, { text: '<h1>2</h1>', colspan: 2, type: 'D', expanded: true }],
        [{ text: '21', type: 'D' }, { text: '22', type: 'D' }]
    ]);

    // assert
    $cells = testElement.find('td');
    assert.equal(testElement.find('b').length, 0, 'bold tegs count');
    assert.equal($cells.eq(0).children().eq(1).text(), '<b>A</b>', 'cell 0 text');
    assert.equal(testElement.find('h1').length, 0, 'header 1 tegs count');
    assert.equal($cells.eq(3).children().eq(1).text(), '<h1>2</h1>', 'cell 3 text');
});

QUnit.test('EncodeHtml is disabled', function(assert) {
    // arrange
    var headersArea = createHeadersArea(),
        testElement = $('#pivotArea');

    // act
    headersArea.render(testElement, [
        [{ text: '<b>A</b>', colspan: 2, expanded: true, type: 'D' }, { text: 'Grand total', rowspan: 2, type: 'GT' }],
        [{ text: '1', rowspan: 2, type: 'D', expanded: false }, { text: '<h1>2</h1>', colspan: 2, type: 'D', expanded: true }],
        [{ text: '21', type: 'D' }, { text: '22', type: 'D' }]
    ]);

    // assert
    assert.equal(testElement.find('b').length, 1, 'bold tegs count');
    assert.equal(testElement.find('b').text(), 'A', 'bold teg text');
    assert.equal(testElement.find('h1').length, 1, 'header 1 tegs count');
    assert.equal(testElement.find('h1').text(), '2', 'header teg text');
});

QUnit.test('Render when virtual scrolling is enabled', function(assert) {
    // arrange
    var area = createHeadersArea(undefined, undefined, {
            'scrolling.mode': 'virtual'
        }),
        testElement = $('#pivotArea');
    // act
    area.render(testElement, []);
    // assert
    assert.strictEqual(area.tableElement().siblings().length, 1);
    var virtualContent = area.tableElement().next();
    assert.ok(!virtualContent.is(':visible'));
});

QUnit.test('get scroll path with virtual scrolling. Horizontal', function(assert) {
    // arrange
    var area = createHeadersArea(undefined, false, {
            'scrolling.mode': 'virtual'
        }),
        testElement = $('#pivotGrid').addClass('dx-pivotgrid').addClass('dx-virtual-mode');

    area.render(testElement, [
        [{ text: '<b>A</b>', colspan: 2, expanded: true, type: 'D' }, { text: 'Grand total', rowspan: 2, type: 'GT', path: ['Grand Total'] }],
        [{ text: '1', rowspan: 2, type: 'D', expanded: false }, { text: '<h1>2</h1>', colspan: 2, type: 'D', expanded: true }],
        [{ text: '21', type: 'D' }, { text: '22', type: 'D' }]
    ]);

    area.setVirtualContentParams({
        left: 350,
        top: 100,
        width: 500,
        height: 250
    });

    var columnWidths = area.getColumnsWidth();

    // act
    var path = area.getScrollPath(350 + columnWidths[0] + columnWidths[1] + 3);
    // assert
    assert.deepEqual(path, ['Grand Total']);
});

QUnit.test('get scroll path with virtual scrolling. Vertical', function(assert) {
    // arrange
    var area = createHeadersArea(undefined, true, {
            'scrolling.mode': 'virtual'
        }),
        testElement = $('#pivotGrid').addClass('dx-pivotgrid').addClass('dx-virtual-mode');

    area.render(testElement, [
        [{ text: 'A', rowspan: 2, expanded: true, type: 'D' }],
        [{ text: '1', rowspan: 2, type: 'D', expanded: false }, { text: '2', colspan: 2, type: 'D', expanded: true }],
        [{ text: '21', colspan: 2, type: 'D' }, { text: '22', type: 'D', path: ['22'] }],
        [{ text: 'Grand total', type: 'GT', path: ['Grand Total'], colspan: 3 }]
    ]);

    area.setVirtualContentParams({
        left: 10,
        top: 500,
        width: 500,
        height: 250
    });

    var columnHeights = area.getRowsHeight();

    // act
    var path = area.getScrollPath(500 + columnHeights[0] + columnHeights[1] + 3);
    // assert
    assert.deepEqual(path, ['22']);
});

QUnit.test('setVirtualContentParams. Horizontal headers', function(assert) {
    // arrange
    var area = createHeadersArea(undefined, false, {
            'scrolling.mode': 'virtual'
        }),
        testElement = $('#pivotGrid').addClass('dx-pivotgrid').addClass('dx-virtual-mode');

    area.render(testElement, []);
    // act
    area.setVirtualContentParams({
        left: 10,
        top: 100,
        width: 500,
        height: 250
    });
    // assert
    var virtualContent = area.tableElement().prev();

    assert.strictEqual(area.tableElement().css('position'), 'absolute');
    assert.strictEqual(area.tableElement().css('left'), '10px');
    assert.strictEqual(area.tableElement().css('top'), '0px');

    assert.strictEqual(virtualContent.css('display'), 'block');
    assert.strictEqual(virtualContent.css('width'), '500px');
    assert.strictEqual(virtualContent.css('height'), '250px');
});

QUnit.test('setVirtualContentParams. Horizontal headers. Disabled virtual mode', function(assert) {
    // arrange
    var area = createHeadersArea(undefined, false, {
            'scrolling.mode': 'virtual'
        }),
        testElement = $('#pivotGrid').addClass('dx-pivotgrid').addClass('dx-virtual-mode');

    area.render(testElement, []);
    // act
    area.setVirtualContentParams({
        left: 10,
        top: 100,
        width: 500,
        height: 250
    });

    area.disableVirtualMode();

    // assert
    var virtualContent = area.tableElement().prev();

    assert.strictEqual(area.tableElement().css('position'), 'static');

    assert.strictEqual(virtualContent.css('display'), 'none');
    assert.strictEqual(virtualContent.css('width'), '500px');
    assert.strictEqual(virtualContent.css('height'), '250px');
});

QUnit.test('scrollTo with virtual scrolling', function(assert) {
    var testElement = $('#pivotGrid').addClass('dx-pivotgrid'),
        area = createHeadersArea(undefined, undefined, {
            'scrolling.mode': 'virtual'
        });

    area.render(testElement, this.headers);

    area.setVirtualContentParams({
        left: 1000,
        width: 3000,
        height: 300
    });

    area.groupWidth(200);
    area.setColumnsWidth([100, 120, 300]);

    area.processScroll();

    function assertFakeTable(scrollPos, expectedOffset, expectedVisibility) {
        area.scrollTo(scrollPos);
        var fakeTable = $('#pivotGrid').find('.dx-virtual-content > table').first();

        assert.strictEqual(fakeTable.css('left'), expectedOffset + 'px', 'fake table offset when scroll position is ' + scrollPos);
        assert.strictEqual(fakeTable.is(':visible'), expectedVisibility, 'fake table visibility when scroll position is ' + scrollPos);
    }

    // scroll to right
    assertFakeTable(1000, 1000, false);
    assertFakeTable(1000 + 321, 1000, false);
    assertFakeTable(1000 + 322, 1000 + 520, true);
    assertFakeTable(1000 + 520, 1000 + 520, true);
    assertFakeTable(1000 + 520 + 520 / 2, 1000 + 780, true);
    assertFakeTable(1000, 1000, false);

    // scroll to left
    assertFakeTable(1000 - 1, 1000 - 520, true);
    assertFakeTable(1000 - 322, 1000 - 520, true);
    assertFakeTable(1000 - 520, 220, true);
    assertFakeTable(1000 - (520 + 520 / 2), -40, true);
    assertFakeTable(0, -40, true);
});


QUnit.module('Vertical headers', {
    beforeEach: function() {
        this.data = [
            [{ text: 'A', rowspan: 7, expanded: true, type: 'D', path: ['A'] }, { text: 'P1', rowspan: 4, expanded: true, type: 'D' }, { text: 'P11', rowspan: 2, expanded: true, type: 'D' }, { text: 'P11.1111111111111111', type: 'D' }],
            [{ text: 'P11.222222222222222222222', type: 'D' }],
            [{ text: 'P11 Total', colspan: 2, type: 'T' }],
            [{ text: 'P12', colspan: 2, expanded: false, type: 'T', path: ['P12'] }]
        ];
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test('Apply css class by vertical orientation', function(assert) {
    // arrange
    var headersArea = createHeadersArea(null, true),
        testElement = $('#pivotArea');

    // act
    headersArea.render(testElement, this.data);

    // assert
    assert.equal(testElement.find('div.dx-pivotgrid-vertical-headers').length, 1, 'vertical headers');
});

QUnit.test('Expand border when expanded items count is one', function(assert) {
    // arrange
    var headersArea = createHeadersArea(null, true),
        testElement = $('#pivotArea');

    // act
    headersArea.render(testElement, [
        [{ text: 'A', colspan: 2, expanded: false, type: 'D', path: ['A'] }],
        [{ text: 'B', type: 'D', expanded: true }, { text: 'B1', type: 'D' }]
    ]);

    // assert
    assert.equal(testElement.find('div.dx-pivotgrid-vertical-headers').length, 1, 'vertical headers');
    assert.ok(!testElement.find('tr').eq(0).hasClass('dx-expand-border'), 'not expanded row not has expand border class');
    assert.ok(testElement.find('tr').eq(1).hasClass('dx-expand-border'), 'expanded row has expand border class');
});

QUnit.test('Render sorted cell', function(assert) {
    // arrange
    var headersArea = createHeadersArea(null, true),
        testElement = $('#pivotArea');

    // act
    headersArea.render(testElement, [
        [{ text: 'A', colspan: 2, expanded: false, type: 'D', path: ['A'], sorted: true }],
        [{ text: 'B', type: 'D', expanded: true }, { text: 'B1', type: 'D' }]
    ]);

    // assert
    assert.ok(testElement.find('tr').eq(0).children(0).hasClass('dx-pivotgrid-sorted'));
    assert.strictEqual(testElement.find('tr').eq(0).children(0).find('.dx-icon-sorted').length, 1);
    assert.ok(!testElement.find('tr').eq(1).children(1).hasClass('dx-pivotgrid-sorted'));
});

QUnit.test('setVirtualContentParams. Vertical headers', function(assert) {
    // arrange
    var area = createHeadersArea(undefined, true, {
            'scrolling.mode': 'virtual'
        }),
        testElement = $('#pivotGrid').addClass('dx-pivotgrid').addClass('dx-virtual-mode');

    area.render(testElement, []);
    // act
    area.setVirtualContentParams({
        left: 10,
        top: 100,
        width: 500,
        height: 250
    });
    // assert
    var virtualContent = area.tableElement().prev();

    assert.strictEqual(area.tableElement().css('position'), 'absolute');
    assert.strictEqual(area.tableElement().css('left'), '0px');
    assert.strictEqual(area.tableElement().css('top'), '100px');

    assert.strictEqual(virtualContent.css('display'), 'block');
    assert.strictEqual(virtualContent.css('width'), '500px');
    assert.strictEqual(virtualContent.css('height'), '250px');
});

QUnit.test('scrollTo with virtual scrolling', function(assert) {
    var testElement = $('#pivotGrid').addClass('dx-pivotgrid'),
        area = createHeadersArea(undefined, true, {
            'scrolling.mode': 'virtual'
        });

    area.render(testElement, this.data);

    area.setVirtualContentParams({
        top: 1000,
        width: 300,
        height: 3000
    });

    area.groupHeight(300);
    area.setRowsHeight([100, 120, 300]);

    area.processScroll(true);

    function assertFakeTable(scrollPos, expectedOffset, expectedVisibility) {
        area.scrollTo(scrollPos);
        var fakeTable = $('#pivotGrid').find('.dx-virtual-content > table').first();

        assert.strictEqual(fakeTable.css('top'), expectedOffset + 'px', 'fake table offset when scroll position is ' + scrollPos);
        assert.strictEqual(fakeTable.is(':visible'), expectedVisibility, 'fake table visibility when scroll position is ' + scrollPos);
    }

    // scroll to down
    assertFakeTable(1000, 1000, false);
    assertFakeTable(1000 + 321, 1520, true);
    assertFakeTable(1000 + 322, 1000 + 520, true);
    assertFakeTable(1000 + 520, 1000 + 520, true);
    assertFakeTable(1000 + 520 + 520 / 2, 1000 + 780, true);

    // scroll to up
    assertFakeTable(1000, 1000, false);
    assertFakeTable(1000 - 1, 1000 - 520, true);
    assertFakeTable(1000 - 322, 1000 - 520, true);
    assertFakeTable(1000 - 520, 220, true);
    assertFakeTable(1000 - (520 + 520 / 2), -40, true);
    assertFakeTable(0, -40, true);
});

QUnit.test('subscribe to scroll events', function(assert) {
    var testElement = $('#pivotGrid').addClass('dx-pivotgrid'),
        area = createHeadersArea(undefined, true, {

        }),
        scrollHandler = sinon.stub();

    area.render(testElement, this.data);

    area.groupHeight(300);
    area.setRowsHeight([100, 120, 300]);

    area.processScroll();


    area.on('scroll', scrollHandler);

    area.scrollTo(10);

    // Assert
    assert.strictEqual(scrollHandler.callCount, 1);
    assert.strictEqual(scrollHandler.lastCall.args[0].scrollOffset.top, 10);
});

QUnit.test('unsubscribe to scroll events', function(assert) {
    var testElement = $('#pivotGrid').addClass('dx-pivotgrid'),
        area = createHeadersArea(undefined, true, {

        }),
        scrollHandler = sinon.stub();

    area.render(testElement, this.data);

    area.groupHeight(300);
    area.setRowsHeight([100, 120, 300]);

    area.processScroll();

    area.on('scroll', scrollHandler);
    area.off('scroll', scrollHandler);

    area.scrollTo(10);

    // Assert
    assert.strictEqual(scrollHandler.callCount, 0);
});

QUnit.test('Set column width', function(assert) {
    // arrange
    var headersArea = createHeadersArea(null, true);

    headersArea.render($('#pivotArea'), this.data);

    function setColumnWidth(widthArray) {
        headersArea.setColumnsWidth(widthArray);

        return headersArea.getColumnsWidth();
    }

    assert.deepEqual(setColumnWidth([40, 50, 30, 60]), [40, 50, 30, 60]);
    assert.deepEqual(setColumnWidth([40, 50, 30]), [40, 50, 30, 0]);
    assert.deepEqual(setColumnWidth([40, 50, 30, 60, 80]), [40, 50, 30, 140]);
});

QUnit.test('Set column width in container with transform', function(assert) {
    // arrange
    var headersArea = createHeadersArea(null, true);

    $('#pivotArea').css({ 'transform': 'scale(0.5, 0.5)' });

    headersArea.render($('#pivotArea'), this.data);

    function setColumnWidth(widthArray) {
        headersArea.setColumnsWidth(widthArray);
        return headersArea.getColumnsWidth();
    }

    assert.deepEqual(setColumnWidth([40, 50, 30, 60]), [40, 50, 30, 60]);
});

QUnit.test('Set row height in container with transform', function(assert) {
    // arrange
    var headersArea = createHeadersArea(null, true);

    $('#pivotArea').css({ 'transform': 'scale(0.5, 0.5)' });

    headersArea.render($('#pivotArea'), this.data);

    function setRowsHeight(widthArray) {
        headersArea.setRowsHeight(widthArray);
        return headersArea.getRowsHeight();
    }

    assert.deepEqual(setRowsHeight([40, 50, 60, 70]), [40, 50, 60, 70]);
});

// T696415
QUnit.test('Set column width with floating point', function(assert) {
    // arrange
    var headersArea = createHeadersArea(null, true);

    headersArea.render($('#pivotArea'), this.data);

    headersArea.groupWidth(100);
    headersArea.setColumnsWidth([40, 50, 30, 60.29]);

    assert.equal(headersArea.tableElement().width(), 40 + 50 + 30 + 61, 'table width is correct');
});

QUnit.test('Update colspans. when new columns count greater than headers area have', function(assert) {
    // arrange
    var headersArea = createHeadersArea(null, true);

    headersArea.render($('#pivotArea'), this.data);

    headersArea.updateColspans(10);

    var $lastCells = headersArea.tableElement().find('.dx-last-cell');

    assert.strictEqual($lastCells.length, 4);
    assert.strictEqual($lastCells.get(0).colSpan, 7);
    assert.strictEqual($lastCells.get(1).colSpan, 7);

    assert.strictEqual($lastCells.get(2).colSpan, 8);
    assert.strictEqual($lastCells.get(3).colSpan, 8);
});

QUnit.test('Update colspans. when new columns count less than headers area have', function(assert) {
    // arrange
    var headersArea = createHeadersArea(null, true);

    headersArea.render($('#pivotArea'), this.data);

    headersArea.updateColspans(4);

    var $lastCells = headersArea.tableElement().find('.dx-last-cell');

    assert.strictEqual($lastCells.length, 4);
    assert.strictEqual($lastCells.get(0).colSpan, 1);
    assert.strictEqual($lastCells.get(1).colSpan, 1);

    assert.strictEqual($lastCells.get(2).colSpan, 2);
    assert.strictEqual($lastCells.get(3).colSpan, 2);
});

QUnit.module('Data area');

function createDataArea(componentOptions) {
    return new dataArea.DataArea(getStubComponent(componentOptions));
}

QUnit.test('Render', function(assert) {
    function getText(cell) {
        return $(cell).text();
    }

    // arrange
    var dataArea = createDataArea(),
        rows,
        table,
        testElement = $('#pivotArea');

    // act
    dataArea.render(testElement, [
        [
            { columnType: 'D', rowType: 'D', text: '1' },
            { columnType: 'D', rowType: 'D', text: '2' },
            { columnType: 'T', rowType: 'D', text: '3' },
            { columnType: 'GT', rowType: 'D', text: '6' }
        ],
        [
            { columnType: 'D', rowType: 'D', text: '2' },
            { columnType: 'D', rowType: 'D', text: '3' },
            { columnType: 'T', rowType: 'D', text: '4' },
            { columnType: 'GT', rowType: 'D', text: '9' }
        ]
    ]);
    table = testElement.find('table');
    rows = table[0].rows;

    // assert
    assert.equal(table.length, 1, 'data area table is rendered');
    assert.equal(rows.length, 2, 'rows count');
    assert.equal(rows[0].cells.length, 4, '1 row  cells count');
    assert.equal(getText(rows[0].cells[0]), '1', '1 row 1 cell');
    assert.equal(getText(rows[0].cells[1]), '2', '1 row 2 cell');
    assert.equal(getText(rows[0].cells[2]), '3', '1 row 3 cell');
    assert.equal(getText(rows[0].cells[3]), '6', '1 row 4 cell');

    assert.equal(rows[1].cells.length, 4, '2 row cells count');
    assert.equal(getText(rows[1].cells[0]), '2', '2 row 1 cell');
    assert.equal(getText(rows[1].cells[1]), '3', '2 row 2 cell');
    assert.equal(getText(rows[1].cells[2]), '4', '2 row 3 cell');
    assert.equal(getText(rows[1].cells[3]), '9', '2 row 4 cell');
    assert.strictEqual(dataArea.groupElement().css('position'), 'relative');
});

QUnit.test('Render when data area is not empty', function(assert) {
    // arrange
    var dataArea = createDataArea(),
        rows,
        table,
        testElement = $('#pivotArea'),
        data = [
            [
                { columnType: 'D', rowType: 'D', text: '1' },
                { columnType: 'D', rowType: 'D', text: '2' },
                { columnType: 'T', rowType: 'D', text: '3' },
                { columnType: 'GT', rowType: 'D', text: '6' }
            ],
            [
                { columnType: 'D', rowType: 'D', text: '2' },
                { columnType: 'D', rowType: 'D', text: '3' },
                { columnType: 'T', rowType: 'D', text: '4' },
                { columnType: 'GT', rowType: 'D', text: '9' }
            ]
        ];

    // act
    dataArea.render(testElement, data);
    table = testElement.find('table');
    rows = table[0].rows;

    // assert
    assert.equal(table.length, 1, 'data area table is rendered');
    assert.equal(rows.length, 2, 'rows count');

    // act
    dataArea.render(testElement, data);
    table = testElement.find('table');
    rows = table[0].rows;

    // assert
    assert.equal(table.length, 1, 'data area table is rendered');
    assert.equal(rows.length, 2, 'rows count');
});

QUnit.test('EncodeHtml is enabled', function(assert) {
    // arrange
    var dataArea = createDataArea({
            encodeHtml: true
        }),
        testElement = $('#pivotArea'),
        $cells,
        data = [
            [
                { columnType: 'D', rowType: 'D', text: '<b>1</b>' },
                { columnType: 'D', rowType: 'D', text: '2' },
                { columnType: 'T', rowType: 'D', text: '3' },
                { columnType: 'GT', rowType: 'D', text: '6' }
            ],
            [
                { columnType: 'D', rowType: 'D', text: '2' },
                { columnType: 'D', rowType: 'D', text: '<h1>3</h1>' },
                { columnType: 'T', rowType: 'D', text: '4' },
                { columnType: 'GT', rowType: 'D', text: '9' }
            ]
        ];

    // act
    dataArea.render(testElement, data);

    // assert
    $cells = testElement.find('td');
    assert.equal(testElement.find('b').length, 0, 'bold tegs count');
    assert.equal($cells.eq(0).text(), '<b>1</b>', 'cell 0 text');
    assert.equal(testElement.find('h1').length, 0, 'header 1 tegs count');
    assert.equal($cells.eq(5).text(), '<h1>3</h1>', 'cell 3 text');
});

QUnit.test('EncodeHtml is disabled', function(assert) {
    var dataArea = createDataArea(),
        testElement = $('#pivotArea'),
        data = [
            [
                { columnType: 'D', rowType: 'D', text: '<b>1</b>' },
                { columnType: 'D', rowType: 'D', text: '2' },
                { columnType: 'T', rowType: 'D', text: '3' },
                { columnType: 'GT', rowType: 'D', text: '6' }
            ],
            [
                { columnType: 'D', rowType: 'D', text: '2' },
                { columnType: 'D', rowType: 'D', text: '<h1>3</h1>' },
                { columnType: 'T', rowType: 'D', text: '4' },
                { columnType: 'GT', rowType: 'D', text: '9' }
            ]
        ];

    // act
    dataArea.render(testElement, data);

    // assert
    assert.equal(testElement.find('b').length, 1, 'bold tegs count');
    assert.equal(testElement.find('b').text(), '1', 'bold teg text');
    assert.equal(testElement.find('h1').length, 1, 'header 1 tegs count');
    assert.equal(testElement.find('h1').text(), '3', 'header teg text');
});

QUnit.test('setVirtualContentParams.', function(assert) {
    // arrange
    var area = createDataArea({
            'scrolling.mode': 'virtual'
        }),
        testElement = $('#pivotGrid').addClass('dx-pivotgrid').addClass('dx-virtual-mode');

    area.render(testElement, []);
    // act
    area.setVirtualContentParams({
        left: 10,
        top: 100,
        width: 500,
        height: 250
    });
    area.processScroll();
    // assert
    var virtualContent = area.tableElement().prev();

    assert.strictEqual(area.tableElement().css('position'), 'absolute');
    assert.strictEqual(area.tableElement().css('left'), '10px');
    assert.strictEqual(area.tableElement().css('top'), '100px');

    assert.strictEqual(virtualContent.css('display'), 'block');
    assert.strictEqual(virtualContent.css('width'), '500px');
    assert.strictEqual(virtualContent.css('height'), '250px');
    assert.strictEqual(area._getScrollable().$content().css('height'), '250px');
});

// T465337
QUnit.test('Reset with virtual scrolling', function(assert) {
    // arrange
    var area = createDataArea({
            'scrolling.mode': 'virtual'
        }),
        testElement = $('#pivotGrid')
            .addClass('dx-pivotgrid')
            .addClass('dx-virtual-mode');

    area.render(testElement, []);
    area.setVirtualContentParams({
        left: 10,
        top: 100,
        width: 500,
        height: 250
    });
    area.processScroll();
    // act
    area.reset();
    // assert
    assert.strictEqual(area._getScrollable().$content().get(0).style.height, 'auto');
});

QUnit.test('scrollTo with virtual scrolling. Horizontal scrolling', function(assert) {
    var clock = sinon.useFakeTimers(),
        testElement = $('#pivotGrid').addClass('dx-pivotgrid'),
        area = createDataArea({
            'scrolling.mode': 'virtual'
        });

    area.render(testElement, [
        [
            { columnType: 'D', rowType: 'D', text: '1' },
            { columnType: 'D', rowType: 'D', text: '2' },
            { columnType: 'T', rowType: 'D', text: '3' }
        ],
        [
            { columnType: 'D', rowType: 'D', text: '2' },
            { columnType: 'D', rowType: 'D', text: '3' },
            { columnType: 'T', rowType: 'D', text: '4' }
        ],
        [
            { columnType: 'D', rowType: 'GT', text: '10' },
            { columnType: 'D', rowType: 'GT', text: '11' },
            { columnType: 'T', rowType: 'GT', text: '12' }
        ]
    ]);

    area.setVirtualContentParams({
        left: 1000,
        top: 0,
        width: 3000,
        height: 4000
    });

    area.groupWidth(200);
    area.groupHeight(200);

    area.setColumnsWidth([100, 120, 300]);
    area.setRowsHeight([100, 120, 300]);

    area.processScroll(false);

    function assertFakeTable(scrollPos, expectedOffset, expectedVisibility) {
        area.scrollTo({ x: scrollPos, y: 0 });
        var fakeTable = $('#pivotGrid').find('.dx-virtual-content > table').first();

        assert.strictEqual(fakeTable.css('left'), expectedOffset + 'px', 'fake table offset when scroll position is ' + scrollPos);
        assert.strictEqual(fakeTable.css('top'), 0 + 'px', 'fake table top offset when scroll position is ' + scrollPos);
        assert.strictEqual(fakeTable.is(':visible'), expectedVisibility, 'fake table visibility when scroll position is ' + scrollPos);
    }

    // scroll to right
    assertFakeTable(1000, 1000, false);
    assertFakeTable(1000 + 321, 1000, false);
    assertFakeTable(1000 + 322, 1000 + 520, true);
    assertFakeTable(1000 + 520, 1000 + 520, true);
    assertFakeTable(1000 + 520 + 520 / 2, 1000 + 780, true);
    assertFakeTable(1000, 1000, false);

    // scroll to left
    assertFakeTable(1000, 1000, false);
    assertFakeTable(1000 - 1, 1000 - 520, true);
    assertFakeTable(1000 - 322, 1000 - 520, true);
    assertFakeTable(1000 - 520, 220, true);
    assertFakeTable(1000 - (520 + 520 / 2), -40, true);
    assertFakeTable(0, -40, true);


    clock.restore();
});

QUnit.test('scrollTo with virtual scrolling. Horizontal scrolling. Big numbers', function(assert) {
    var clock = sinon.useFakeTimers(),
        testElement = $('#pivotGrid').addClass('dx-pivotgrid'),
        area = createDataArea({
            'scrolling.mode': 'virtual'
        });

    area.render(testElement, [
        [
            { columnType: 'D', rowType: 'D', text: '1' },
            { columnType: 'D', rowType: 'D', text: '2' },
            { columnType: 'T', rowType: 'D', text: '3' }
        ],
        [
            { columnType: 'D', rowType: 'D', text: '2' },
            { columnType: 'D', rowType: 'D', text: '3' },
            { columnType: 'T', rowType: 'D', text: '4' }
        ],
        [
            { columnType: 'D', rowType: 'GT', text: '10' },
            { columnType: 'D', rowType: 'GT', text: '11' },
            { columnType: 'T', rowType: 'GT', text: '12' }
        ]
    ]);

    area.setVirtualContentParams({
        left: 1000000,
        top: 0,
        width: 3000000,
        height: 4000000
    });

    area.groupWidth(200);
    area.groupHeight(200);

    area.setColumnsWidth([100, 120, 300]);
    area.setRowsHeight([100, 120, 300]);

    area.processScroll(false);

    function assertFakeTable(scrollPos, expectedOffset, expectedVisibility) {
        area.scrollTo({ x: scrollPos, y: 0 });
        var fakeTable = $('#pivotGrid').find('.dx-virtual-content > table').first();

        assert.strictEqual(parseFloat(fakeTable[0].style.left), expectedOffset, 'fake table offset when scroll position is ' + scrollPos);
        assert.strictEqual(parseFloat(fakeTable[0].style.top), 0, 'fake table top offset when scroll position is ' + scrollPos);
        assert.strictEqual(fakeTable.is(':visible'), expectedVisibility, 'fake table visibility when scroll position is ' + scrollPos);
    }

    // scroll to right
    assertFakeTable(1000000, 1000000, false);
    assertFakeTable(1000000 + 321, 1000000, false);
    assertFakeTable(1000000 + 322, 1000000 + 520, true);
    assertFakeTable(1000000 + 520, 1000000 + 520, true);
    assertFakeTable(1000000 + 520 + 520 / 2, 1000000 + 780, true);
    assertFakeTable(1000000, 1000000, false);

    // scroll to left
    assertFakeTable(1000000, 1000000, false);
    assertFakeTable(1000000 - 1, 1000000 - 520, true);
    assertFakeTable(1000000 - 322, 1000000 - 520, true);
    assertFakeTable(1000000 - 520, 999220, true);
    assertFakeTable(1000000 - (520 + 520 / 2), 998960, true);
    assertFakeTable(0, -220, true);

    clock.restore();
});

QUnit.test('scrollTo with virtual scrolling. Vertical scrolling', function(assert) {
    var clock = sinon.useFakeTimers(),
        testElement = $('#pivotGrid').addClass('dx-pivotgrid'),
        area = createDataArea({
            'scrolling.mode': 'virtual'
        });

    area.render(testElement, [
        [
            { columnType: 'D', rowType: 'D', text: '1' },
            { columnType: 'D', rowType: 'D', text: '2' },
            { columnType: 'T', rowType: 'D', text: '3' },
            { columnType: 'GT', rowType: 'D', text: '6' }
        ],
        [
            { columnType: 'D', rowType: 'D', text: '2' },
            { columnType: 'D', rowType: 'D', text: '3' },
            { columnType: 'T', rowType: 'D', text: '4' },
            { columnType: 'GT', rowType: 'D', text: '9' }
        ],
        [
            { columnType: 'D', rowType: 'GT', text: '10' },
            { columnType: 'D', rowType: 'GT', text: '11' },
            { columnType: 'T', rowType: 'GT', text: '12' },
            { columnType: 'GT', rowType: 'GT', text: '13' }
        ]
    ]);

    area.setVirtualContentParams({
        left: 0,
        top: 1000,
        width: 3000,
        height: 4000
    });

    area.groupWidth(200);
    area.groupHeight(200);

    area.setColumnsWidth([100, 120, 300]);
    area.setRowsHeight([100, 120, 300]);

    area.processScroll(false);

    function assertFakeTable(scrollPos, expectedOffset, expectedVisibility) {
        area.scrollTo({ x: 0, y: scrollPos });
        var fakeTable = $('#pivotGrid').find('.dx-virtual-content > table').first();

        assert.strictEqual(fakeTable.css('top'), expectedOffset + 'px', 'fake table offset when scroll position is ' + scrollPos);
        assert.strictEqual(fakeTable.css('left'), 0 + 'px', 'fake table offset left when scroll position is ' + scrollPos);
        assert.strictEqual(fakeTable.is(':visible'), expectedVisibility, 'fake table visibility when scroll position is ' + scrollPos);
    }

    // scroll to down
    assertFakeTable(1000, 1000, false);
    assertFakeTable(1000 + 321, 1000, false);
    assertFakeTable(1000 + 322, 1000 + 520, true);
    assertFakeTable(1000 + 520, 1000 + 520, true);
    assertFakeTable(1000 + 520 + 520 / 2, 1000 + 780, true);
    assertFakeTable(1000, 1000, false);

    // scroll to up
    assertFakeTable(1000, 1000, false);
    assertFakeTable(1000 - 1, 1000 - 520, true);
    assertFakeTable(1000 - 322, 1000 - 520, true);
    assertFakeTable(1000 - 520, 220, true);
    assertFakeTable(1000 - (520 + 520 / 2), -40, true);
    assertFakeTable(0, -40, true);

    clock.restore();
});

QUnit.test('scrollTo with virtual scrolling. Vertical scrolling. Big numbers', function(assert) {
    var clock = sinon.useFakeTimers(),
        testElement = $('#pivotGrid').addClass('dx-pivotgrid'),
        area = createDataArea({
            'scrolling.mode': 'virtual'
        });

    area.render(testElement, [
        [
            { columnType: 'D', rowType: 'D', text: '1' },
            { columnType: 'D', rowType: 'D', text: '2' },
            { columnType: 'T', rowType: 'D', text: '3' },
            { columnType: 'GT', rowType: 'D', text: '6' }
        ],
        [
            { columnType: 'D', rowType: 'D', text: '2' },
            { columnType: 'D', rowType: 'D', text: '3' },
            { columnType: 'T', rowType: 'D', text: '4' },
            { columnType: 'GT', rowType: 'D', text: '9' }
        ],
        [
            { columnType: 'D', rowType: 'GT', text: '10' },
            { columnType: 'D', rowType: 'GT', text: '11' },
            { columnType: 'T', rowType: 'GT', text: '12' },
            { columnType: 'GT', rowType: 'GT', text: '13' }
        ]
    ]);

    area.setVirtualContentParams({
        left: 0,
        top: 1000000,
        width: 3000000,
        height: 4000000
    });

    area.groupWidth(200);
    area.groupHeight(200);

    area.setColumnsWidth([100, 120, 300]);
    area.setRowsHeight([100, 120, 300]);

    area.processScroll(0, true, true, false);

    function assertFakeTable(scrollPos, expectedOffset, expectedVisibility) {
        area.scrollTo({ x: 0, y: scrollPos });
        var fakeTable = $('#pivotGrid').find('.dx-virtual-content > table').first();

        assert.strictEqual(parseFloat(fakeTable[0].style.top), expectedOffset, 'fake table offset when scroll position is ' + scrollPos);
        assert.strictEqual(parseFloat(fakeTable[0].style.left), 0, 'fake table offset left when scroll position is ' + scrollPos);
        assert.strictEqual(fakeTable.is(':visible'), expectedVisibility, 'fake table visibility when scroll position is ' + scrollPos);
    }

    // scroll to down
    assertFakeTable(1000000, 1000000, false);
    assertFakeTable(1000000 + 321, 1000000, false);
    assertFakeTable(1000000 + 322, 1000000 + 520, true);
    assertFakeTable(1000000 + 520, 1000000 + 520, true);
    assertFakeTable(1000000 + 520 + 520 / 2, 1000000 + 780, true);
    assertFakeTable(1000000, 1000000, false);

    // scroll to up
    assertFakeTable(1000000, 1000000, false);
    assertFakeTable(1000000 - 1, 1000000 - 520, true);
    assertFakeTable(1000000 - 322, 1000000 - 520, true);
    assertFakeTable(1000000 - 520, 999220, true);
    assertFakeTable(1000000 - (520 + 520 / 2), 998960, true);
    assertFakeTable(0, -220, true);

    clock.restore();
});
