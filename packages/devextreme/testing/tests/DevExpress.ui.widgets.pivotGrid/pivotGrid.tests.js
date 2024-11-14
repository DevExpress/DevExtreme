QUnit.testStart(function() {
    const markup =
'<style nonce="qunit-test">\
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
    addShadowDomStyles($('#qunit-fixture'));
});

import fx from 'common/core/animation/fx';
import eventsEngine from 'common/core/events/core/events_engine';
import config from 'core/config';
import devices from '__internal/core/m_devices';
import dataUtils from 'core/element_data';
import {
    setHeight,
    getOuterHeight,
    getHeight,
    getOuterWidth,
    getWidth,
} from 'core/utils/size';
import { isRenderer } from 'core/utils/type';
import { addShadowDomStyles } from 'core/utils/shadow_dom';
import { triggerShownEvent } from 'common/core/events/visibility_change';
import 'generic_light.css!';
import $ from 'jquery';
import dateLocalization from 'common/core/localization/date';
import { PivotGridDataSource } from '__internal/grids/pivot_grid/data_source/m_data_source';
import 'ui/pivot_grid/ui.pivot_grid';
import { getRealElementWidth } from '__internal/grids/pivot_grid/area_item/m_area_item';
import DataAreaModule from '__internal/grids/pivot_grid/data_area/m_data_area';
import DataControllerModule from '__internal/grids/pivot_grid/data_controller/m_data_controller';
import HeadersAreaModule from '__internal/grids/pivot_grid/headers_area/m_headers_area';
import pivotGridUtils, { getScrollbarWidth } from '__internal/grids/pivot_grid/m_widget_utils';
import Scrollable from 'ui/scroll_view/ui.scrollable';

import pointerMock from '../../helpers/pointerMock.js';

const isRenovatedScrollable = !!Scrollable.IS_RENOVATED_WIDGET;

const DATA_AREA_CELL_CLASS = 'dx-area-data-cell';

function sumArray(array) {
    let sum = 0;
    for(let i = 0; i < array.length; i++) {
        sum += array[i];
    }

    return sum;
}

const moduleConfig = {
    beforeEach: function() {
        const rowItems = [{
            value: 'C1', index: 2,
            children: [{ value: 'P1', index: 0 }, { value: 'P2 Test Test Test Test Test', index: 1 }]
        }, {
            value: 'C2', index: 5,
            children: [{ value: 'P3', index: 3 }, { value: 'P4', index: 4 }]
        }];
        const columnItems = [{
            value: '2010', index: 2,
            children: [{ value: '1', index: 0 }, { value: '2', index: 1 }]
        }, {
            value: '2012', index: 5,
            children: [{ value: '2', index: 3 }, { value: '3', index: 4 }]
        }];
        const cellSet = [
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

const createPivotGrid = function(options) {
    const pivotGridElement = $('#pivotGrid').dxPivotGrid(options);
    return pivotGridElement.dxPivotGrid('instance');
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
}, () => {

    QUnit.test('Empty options', function(assert) {
        const pivotGrid = createPivotGrid({});
        assert.ok(pivotGrid);
        assert.strictEqual(pivotGrid.isReady(), true);
    });

    QUnit.test('No options', function(assert) {
        const pivotGrid = createPivotGrid(undefined);
        assert.ok(pivotGrid);
    });

    QUnit.test('No data', function(assert) {
        const contentReadyCallback = sinon.stub();
        const pivotGrid = createPivotGrid({
            onContentReady: contentReadyCallback
        });
        assert.ok(pivotGrid);

        const $noDataElement = pivotGrid.$element().find('.dx-pivotgrid-nodata');

        assert.equal($noDataElement.length, 1);
        assert.ok($noDataElement.is(':visible'));
        assert.equal($noDataElement.text(), 'No data');
        assert.ok(contentReadyCallback.calledOnce, 'contentReadyCallback called once');
    });

    QUnit.test('Empty store', function(assert) {
        const testOptions = $.extend(this.testOptions, {
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
        });
        const pivotGrid = createPivotGrid(testOptions);
        this.clock.tick(10);

        const $columnCell = pivotGrid.$element().find('.dx-area-column-cell');
        const $rowCell = pivotGrid.$element().find('.dx-area-row-cell');

        assert.equal($columnCell.find('span')[0].innerHTML, '&nbsp;');
        assert.equal($rowCell.find('span')[0].innerHTML, '&nbsp;');
    });

    QUnit.test('No data when pivot grid rendered to invisible container', function(assert) {
        const $pivotGridElement = $('#pivotGrid').hide().height('200px');
        const pivotGrid = createPivotGrid({
            height: 200,
            dataSource: [{ sum: 100 }],
        });

        $pivotGridElement.show();

        triggerShownEvent($pivotGridElement);
        this.clock.tick(10);

        const $noDataElement = $(pivotGrid.$element().find('.dx-pivotgrid-nodata'));
        const dataAreaCell = $(`.${DATA_AREA_CELL_CLASS}`);
        const dataAreaCellOffset = dataAreaCell.offset();
        const noDataElementOffset = $noDataElement.offset();

        assert.ok($noDataElement.is(':visible'));
        assert.roughEqual(noDataElementOffset.top - dataAreaCellOffset.top, (dataAreaCellOffset.top + getOuterHeight(dataAreaCell)) - (noDataElementOffset.top + getHeight($noDataElement)), 2.5, 'no data element position');
    });

    QUnit.test('Not render pivot grid to invisible container', function(assert) {
        const onContentReadyCallback = sinon.stub();
        this.testOptions.onContentReady = onContentReadyCallback;
        this.testOptions.scrolling = { mode: 'virtual' };
        this.testOptions.height = 300;

        $('#pivotGrid').hide();
        createPivotGrid(this.testOptions);

        assert.equal(onContentReadyCallback.callCount, 1, 'contentReady calls');
    });

    QUnit.test('Create PivotGrid with Data', function(assert) {
        const onContentReadyCallback = sinon.stub();

        this.testOptions.onContentReady = onContentReadyCallback;

        const pivotGrid = createPivotGrid(this.testOptions);

        const $noDataElement = $(pivotGrid.$element().find('.dx-pivotgrid-nodata'));

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

        const pivotGrid = createPivotGrid(this.testOptions);

        assert.strictEqual(pivotGrid.$element().css('overflow'), 'hidden', 'element overflow property should be hidden');
    });

    QUnit.test('Loading DataSource', function(assert) {
        const onContentReadyCallback = sinon.stub();

        const pivotGrid = createPivotGrid({
            height: 200,
            dataSource: [{ sum: 100 }],
            fields: [{ dataField: 'sum', summaryType: 'sum', area: 'data' }],
            onContentReady: onContentReadyCallback
        });

        const $noDataElement = $(pivotGrid.$element().find('.dx-pivotgrid-nodata'));

        assert.equal($noDataElement.length, 1);
        assert.ok(!$noDataElement.is(':visible'));
        assert.equal($noDataElement.text(), '');

        assert.ok(pivotGrid._loadPanel, 'loadPanel exists');
        assert.ok(pivotGrid._loadPanel.option('visible'), 'loadPanel should be visible');
        assert.strictEqual(pivotGrid.$element().css('overflow'), 'visible', 'element overflow property should be \'visible\'');

        assert.strictEqual(pivotGrid.isReady(), false);
        assert.ok(!onContentReadyCallback.called, 'contentReady should not be called');

        const loadIndicatorElement = pivotGrid._loadPanel.$content();
        const dataAreaGroupElement = pivotGrid._dataArea.groupElement();
        const loadIndicatorElementOffset = loadIndicatorElement.offset();
        const dataAreaGroupElementOffset = dataAreaGroupElement.offset();

        assert.roughEqual(loadIndicatorElementOffset.top - dataAreaGroupElementOffset.top, (dataAreaGroupElementOffset.top + getHeight(dataAreaGroupElement)) - (loadIndicatorElementOffset.top + getOuterHeight(loadIndicatorElement)), 2.1, 'loading element position');

        this.clock.tick(10);

        assert.ok(onContentReadyCallback.calledOnce, 'contentReady should be called once');
        assert.ok(!pivotGrid._loadPanel.option('visible'), 'loadPanel should not be visible');
        assert.strictEqual(pivotGrid.isReady(), true);
        assert.deepEqual(pivotGrid._loadPanel.option('container'), pivotGrid.$element());
    });

    QUnit.test('Loading DataSource longer 1000 ms', function(assert) {
        const onContentReadyCallback = sinon.stub();
        const progresses = [];
        const loadingChangedArgs = [];

        const d = $.Deferred();

        const pivotGrid = createPivotGrid({
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
        });

        assert.ok(pivotGrid._loadPanel, 'loadPanel exists');
        assert.ok(pivotGrid._loadPanel.option('visible'), 'loadPanel should be visible');

        assert.strictEqual(pivotGrid.isReady(), false);
        assert.ok(!onContentReadyCallback.called, 'contentReady should not be called');

        const loadPanelOption = pivotGrid._loadPanel.option;

        const loadMessages = [];

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

        this.clock.tick(10);

        assert.deepEqual(loadMessages, ['80%', 'Loading...', '85%', '87%', '90%', '95%', '97%', '100%']);
        assert.deepEqual(progresses, [1]);
        assert.deepEqual(loadingChangedArgs, [true, false, true, false]); // T514201

        assert.ok(onContentReadyCallback.calledOnce, 'contentReady should be called once');
        assert.ok(!pivotGrid._loadPanel.option('visible'), 'loadPanel should not be visible');
        assert.ok(!pivotGrid.$element().hasClass('dx-overflow-hidden'), 'element overflow property should be \'hidden\'');
        assert.strictEqual(pivotGrid.isReady(), true);
    });

    QUnit.test('EncodeHTML option is enabled by default', function(assert) {
        const pivotGrid = createPivotGrid(undefined);
        assert.ok(pivotGrid.option('encodeHtml'));
    });

    QUnit.test('collapse column item', function(assert) {
        let expandValueChangingArgs;

        const pivotGrid = createPivotGrid({
            dataSource: this.dataSource,
            onExpandValueChanging: function(args) {
                expandValueChangingArgs = $.extend({}, args);
            }
        });
        assert.ok(pivotGrid);

        assert.strictEqual($('#pivotGrid').find('.dx-pivotgrid-collapsed').length, 1);
        const $expandedSpan = $('#pivotGrid').find('.dx-pivotgrid-expanded');
        assert.strictEqual($expandedSpan.length, 1);

        $($expandedSpan).trigger('dxclick');

        this.clock.tick(10);

        assert.strictEqual($('#pivotGrid').find('.dx-pivotgrid-expanded').length, 0);
        assert.strictEqual($('#pivotGrid').find('.dx-pivotgrid-collapsed').length, 2);
        assert.deepEqual(expandValueChangingArgs, {
            area: 'column',
            path: ['2010'],
            expanded: false
        });
    });

    QUnit.test('expand column item', function(assert) {
        let expandValueChangingArgs;
        const pivotGrid = createPivotGrid({
            dataSource: this.dataSource,
            onExpandValueChanging: function(args) {
                expandValueChangingArgs = $.extend({}, args);
            }
        });
        assert.ok(pivotGrid);

        const $collapsedSpan = $('#pivotGrid').find('.dx-pivotgrid-collapsed');
        assert.strictEqual($collapsedSpan.length, 1);

        $($collapsedSpan).trigger('dxclick');

        this.clock.tick(10);

        assert.deepEqual(expandValueChangingArgs, {
            area: 'column',
            path: ['2012'],
            expanded: true,
            needExpandData: true
        });
    });

    QUnit.test('onCellClick prevents expansion', function(assert) {
        let expandValueChangingArgs;
        const pivotGrid = createPivotGrid({
            dataSource: this.dataSource,
            onExpandValueChanging: function(args) {
                expandValueChangingArgs = $.extend({}, args);
            },
            onCellClick: function(args) {
                args.cancel = true;
            }
        });
        assert.ok(pivotGrid);

        const $collapsedSpan = $('#pivotGrid').find('.dx-pivotgrid-collapsed');
        assert.strictEqual($collapsedSpan.length, 1);

        $($collapsedSpan).trigger('dxclick');

        this.clock.tick(10);

        assert.strictEqual(expandValueChangingArgs, undefined);
    });

    QUnit.test('T248253. DataSource changed', function(assert) {
        let expandValueChangingArgs;
        const pivotGrid = createPivotGrid($.extend(this.testOptions, {
            onExpandValueChanging: function(args) {
                expandValueChangingArgs = $.extend({}, args);
            }
        }));

        pivotGrid.option({
            dataSource: this.dataSource
        });


        const $collapsedSpan = $('#pivotGrid').find('.dx-pivotgrid-collapsed');
        assert.strictEqual($collapsedSpan.length, 1);

        $($collapsedSpan).trigger('dxclick');

        this.clock.tick(10);

        assert.deepEqual(expandValueChangingArgs, {
            area: 'column',
            path: ['2012'],
            expanded: true,
            needExpandData: true
        });
    });

    QUnit.test('onCellClick event', function(assert) {
        const cellClickArgs = [];

        const pivotGrid = createPivotGrid({
            dataSource: this.dataSource,
            fieldPanel: {
                showRowFields: true,
                visible: true
            },
            onCellClick: function(e) {
                cellClickArgs.push(e);
            }
        });

        const clickHandler = sinon.stub();

        pivotGrid.on('cellClick', clickHandler);

        const $dataArea = $('#pivotGrid').find('.dx-pivotgrid-area-data');
        const $fieldsArea = $('#pivotGrid').find('.dx-pivotgrid-fields-area');

        this.clock.tick(10);

        $($dataArea.find('tr').eq(1).find('td').eq(3)).trigger('dxclick');
        $($dataArea.find('tr').eq(2).find('td').eq(4)).trigger('dxclick');
        $($fieldsArea.find('td').eq(1)).trigger('dxclick');

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
        const cellClickArgs = [];

        const pivotGrid = createPivotGrid({
            dataSource: this.dataSource,
            onCellClick: function(e) {
                cellClickArgs.push(e);
            }
        });
        this.clock.tick(10);

        pivotGrid.resize();

        const $dataArea = $('#pivotGrid').find('.dx-pivotgrid-area-data');

        $($dataArea.find('tr').eq(1).find('td').eq(3)).trigger('dxclick');
        $($dataArea.find('tr').eq(2).find('td').eq(4)).trigger('dxclick');

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
        const pivotGrid = createPivotGrid({
            dataSource: {
                rows: [],
                columns: [],
                values: []
            }
        });

        assert.ok(!$('.dx-fieldchooser-popup').is(':visible'), 'fieldChooser popup is not visible');

        this.clock.tick(10);

        const $fieldChooserButton = $('#pivotGrid').find('.dx-pivotgrid-field-chooser-button');
        assert.strictEqual($fieldChooserButton.length, 1, 'fieldChooser button is rendered');

        $($fieldChooserButton).trigger('dxclick');
        this.clock.tick(500);

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
        const pivotGrid = createPivotGrid({
            dataSource: {
                rows: [],
                columns: [],
                values: []
            },
            fieldPanel: {
                visible: true
            },
            visible: false
        });
        const fieldPanelInstance = pivotGrid.$element().dxPivotGridFieldChooserBase('instance');

        this.clock.tick(10);

        assert.notOk(fieldPanelInstance.option('visible'), 'fieldPanel in invisible');
        assert.ok(pivotGrid.$element().hasClass('dx-state-invisible'), 'pivot grid saves invisible styles');
    });

    QUnit.test('create field chooser with search', function(assert) {
        const pivotGrid = createPivotGrid({
            dataSource: {
                rows: [],
                columns: [],
                values: []
            },
            fieldChooser: {
                allowSearch: true,
                searchTimeout: 300
            }
        });
        const fieldChooserPopup = pivotGrid.getFieldChooserPopup();

        this.clock.tick(10);

        fieldChooserPopup.show();
        this.clock.tick(500);

        const fieldChooser = fieldChooserPopup.$content().data('dxPivotGridFieldChooser');
        const treeViewInstance = fieldChooserPopup.$content().find('.dx-treeview').dxTreeView('instance');

        assert.ok(fieldChooser.option('allowSearch'), 'fieldChooser with search');
        assert.ok(treeViewInstance.option('searchEnabled'), 'treeview with search');
        assert.equal(treeViewInstance.option('searchTimeout'), 300, 'searchTimeout is assigned');
    });

    QUnit.test('clear selection and filtering in field chooser treeview on popup hidding', function(assert) {
        this.dataSource.fields[0].displayFolder = 'Folder';
        const pivotGrid = createPivotGrid({
            dataSource: this.dataSource,
            fieldChooser: {
                allowSearch: true,
            }
        });
        const fieldChooserPopup = pivotGrid.getFieldChooserPopup();

        this.clock.tick(10);

        fieldChooserPopup.show();
        this.clock.tick(500);

        const fieldChooser = fieldChooserPopup.$content().data('dxPivotGridFieldChooser');
        const resetTreeView = sinon.spy(fieldChooser, 'resetTreeView');

        fieldChooserPopup.hide();
        this.clock.tick(500);

        assert.ok(resetTreeView.calledOnce, 'resetTreeView was called');
    });

    // T752355
    QUnit.test('add field to column area in field chooser when enabled state storing', function(assert) {
        const pivotGrid = createPivotGrid({
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
        });

        this.clock.tick(10);

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

        $('.dx-button').filter(':contains("OK")').trigger('dxclick');
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
                search: {
                    enabled: true,
                    timeout: 300
                }
            },
            fieldPanel: {
                visible: true
            }
        });

        this.clock.tick(10);

        $('#pivotGrid').find('.dx-header-filter').first().trigger('dxclick');
        this.clock.tick(500);

        assert.ok($('.dx-header-filter-menu').find('.dx-list-search').length, 'headerFilter has searchBox');
        assert.equal($('.dx-header-filter-menu').find('.dx-list').dxList('instance').option('searchTimeout'), 300, 'search timeout is assinged');
    });

    QUnit.test('create toolbar buttons in applyChangesMode onDemand case', function(assert) {
        const pivotGrid = createPivotGrid({
            dataSource: this.dataSource,
            fieldChooser: {
                applyChangesMode: 'onDemand'
            }
        });
        const fieldChooserPopup = pivotGrid.getFieldChooserPopup();

        this.clock.tick(10);

        fieldChooserPopup.show();
        this.clock.tick(500);

        assert.equal($(fieldChooserPopup._$bottom).find('.dx-toolbar-button').length, 2, '2 buttons in toolbar');
    });

    QUnit.test('apply changes in fieldchooser on button click in onDemand mode', function(assert) {
        this.dataSource.fields[0].dataField = 'field1';

        const pivotGrid = createPivotGrid({
            dataSource: this.dataSource,
            allowSorting: true,
            fieldChooser: {
                applyChangesMode: 'onDemand'
            }
        });
        const fieldChooserPopup = pivotGrid.getFieldChooserPopup();

        this.clock.tick(10);

        fieldChooserPopup.show();
        this.clock.tick(500);

        const sortIcon = $(fieldChooserPopup.content()).find('.dx-sort').eq(0);
        sortIcon.trigger('dxclick');
        this.clock.tick(500);

        assert.notEqual(pivotGrid.getDataSource().state().fields[0].sortOrder, 'desc', 'ds state is not changed yet');

        const applyButton = $(fieldChooserPopup._$bottom).find('.dx-button').eq(0);
        applyButton.trigger('dxclick');
        this.clock.tick(500);

        assert.equal(pivotGrid.getDataSource().state().fields[0].sortOrder, 'desc', 'ds state is changed');
    });

    QUnit.test('cancel changes on fieldchooser hidding in onDemand mode', function(assert) {
        this.dataSource.fields[0].dataField = 'field1';

        const pivotGrid = createPivotGrid({
            dataSource: this.dataSource,
            allowSorting: true,
            fieldChooser: {
                applyChangesMode: 'onDemand'
            }
        });
        const fieldChooserPopup = pivotGrid.getFieldChooserPopup();

        this.clock.tick(10);

        fieldChooserPopup.show();
        this.clock.tick(500);

        const sortIcon = $(fieldChooserPopup.content()).find('.dx-sort').eq(0);
        sortIcon.trigger('dxclick');
        this.clock.tick(500);

        assert.notEqual(pivotGrid.getDataSource().state().fields[0].sortOrder, 'desc', 'ds state is not changed yet');

        fieldChooserPopup.hide();
        this.clock.tick(500);

        assert.notEqual(pivotGrid.getDataSource().state().fields[0].sortOrder, 'desc', 'ds state is not changed yet');
    });

    QUnit.test('Field panel should be updated on change headerFilter at runtime', function(assert) {
        const pivotGrid = createPivotGrid({
            dataSource: this.dataSource,
            allowFiltering: true,
            headerFilter: {
                search: {
                    enabled: true
                }
            },
            fieldPanel: {
                visible: true
            }
        });

        this.clock.tick(10);

        $('#pivotGrid').find('.dx-header-filter').first().trigger('dxclick');
        this.clock.tick(500);

        assert.ok($('.dx-header-filter-menu').find('.dx-list-search').length, 'headerFilter has searchBox');

        pivotGrid.option('headerFilter.search.enabled', false);

        $('#pivotGrid').find('.dx-header-filter').first().trigger('dxclick');
        this.clock.tick(500);

        assert.notOk($('.dx-header-filter-menu').find('.dx-list-search').length, 'headerFilter hasn\'t searchBox');
    });

    QUnit.test('Field chooser should be updated on change headerFilter at runtime', function(assert) {
        const pivotGrid = createPivotGrid({
            dataSource: this.dataSource,
            allowFiltering: true,
            headerFilter: {
                search: {
                    enabled: true
                }
            },
            fieldChooser: {
                enabled: true
            }
        });
        const fieldChooserPopup = pivotGrid.getFieldChooserPopup();

        this.clock.tick(10);

        fieldChooserPopup.show();
        this.clock.tick(500);

        $(fieldChooserPopup.content()).find('.dx-header-filter').first().trigger('dxclick');
        this.clock.tick(500);

        assert.ok($('.dx-header-filter-menu').find('.dx-list-search').length, 'headerFilter has searchBox');

        pivotGrid.option('headerFilter.search.enabled', false);

        $(fieldChooserPopup.content()).find('.dx-header-filter').first().trigger('dxclick');
        this.clock.tick(500);

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
        });

        this.clock.tick(10);

        $('#pivotGrid').find('.dx-header-filter').first().trigger('dxclick');
        this.clock.tick(500);

        assert.equal($('.dx-header-filter-menu').find('.dx-list-item').text(), 'test <test>', 'encoded');
    });

    QUnit.test('Field chooser inherits encodeHtml option', function(assert) {
        const pivotGrid = createPivotGrid({
            dataSource: {
                fields: [{ dataField: 'field1', area: 'column' }],
                store: [{ field1: 'test <test>' }]
            },
            allowFiltering: true,
            encodeHtml: true,
            fieldChooser: {
                enabled: true
            }
        });
        const fieldChooserPopup = pivotGrid.getFieldChooserPopup();

        this.clock.tick(10);

        fieldChooserPopup.show();
        this.clock.tick(500);

        $(fieldChooserPopup.content()).find('.dx-header-filter').first().trigger('dxclick');
        this.clock.tick(500);

        assert.equal($('.dx-header-filter-menu').find('.dx-list-item').text(), 'test <test>', 'encoded');
    });

    QUnit.test('fieldChooser layout change at runtime should not hide popup', function(assert) {
        const pivotGrid = createPivotGrid({
            dataSource: {
                rows: [],
                columns: [],
                values: []
            },
            fieldChooser: {
                width: 300,
                layout: 2
            }
        });
        const fieldChooserPopup = pivotGrid.getFieldChooserPopup();

        this.clock.tick(10);

        fieldChooserPopup.show();
        this.clock.tick(500);

        pivotGrid.option('fieldChooser', { layout: 1, width: 900 });

        assert.ok(fieldChooserPopup.option('visible'), 'fieldChooser popup is visible');
        assert.strictEqual(fieldChooserPopup.option('width'), 900);
        assert.strictEqual(fieldChooserPopup.$content().dxPivotGridFieldChooser('instance').option('layout'), 1);
    });

    QUnit.test('Dragging between PivotGrid and FieldChooser', function(assert) {
        const pivotGrid = createPivotGrid({
            showDataFields: true,
            dataSource: {
                rows: [],
                columns: [],
                values: []
            }
        });

        const $pivotGrid = $('#pivotGrid');

        const dataSource = pivotGrid.getDataSource();

        const $fieldChooser1 = $('<div>').insertAfter($pivotGrid).dxPivotGridFieldChooser({
            dataSource: dataSource
        });

        const $fieldChooser2 = $('<div>').insertAfter($pivotGrid).dxPivotGridFieldChooser({
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
        const pivotGrid = createPivotGrid({
            dataSource: {
                rows: [],
                columns: [],
                values: []
            }
        });

        pivotGrid.exportTo = sinon.spy();

        this.clock.tick(10);

        let $exportButton = $('#pivotGrid').find('.dx-pivotgrid-export-button');
        assert.equal($exportButton.length, 0, 'no export button');

        pivotGrid.option('export.enabled', true);
        this.clock.tick(10);

        $exportButton = $('#pivotGrid').find('.dx-pivotgrid-export-button');
        assert.equal($exportButton.length, 1, 'export button exists');

        $($exportButton).trigger('dxclick');

        assert.equal(pivotGrid.exportTo.callCount, 1, 'exportToExcel method called one');
        assert.strictEqual($exportButton.dxButton('option', 'hint'), 'Export to Excel file');

    });

    QUnit.test('T257099. Hide fieldChooser popup on dataSource changed', function(assert) {
        const pivotGrid = createPivotGrid({
            dataSource: {
                rows: [],
                columns: [],
                values: []
            }
        });

        pivotGrid.getFieldChooserPopup().show();
        this.clock.tick(10);
        assert.ok($('.dx-fieldchooser-popup').is(':visible'), 'fieldChooser popup is visible');

        pivotGrid.option('dataSource', this.testOptions.dataSource);
        this.clock.tick(500);

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
        });

        assert.ok(!$('.dx-fieldchooser-popup').is(':visible'), 'fieldChooser popup is not visible');

        const $descriptionCell = $('#pivotGrid').find('td').first();

        this.clock.tick(10);

        $($descriptionCell).trigger('dxclick');

        assert.ok(!$('.dx-fieldchooser-popup').is(':visible'), 'fieldChooser popup is not visible');
    });

    // T248731
    QUnit.test('resize field chooser popup', function(assert) {
        const pivotGrid = createPivotGrid({
            dataSource: {
                rows: [],
                columns: [],
                values: []
            }
        });

        this.clock.tick(10);

        pivotGrid.getFieldChooserPopup().show();
        this.clock.tick(500);

        const $fieldChooserPopup = $('.dx-fieldchooser-popup').dxPopup('instance').$wrapper();
        assert.ok($fieldChooserPopup.is(':visible'), 'fieldChooser popup is visible');

        const $handle = $fieldChooserPopup.find('.dx-resizable-handle-corner-bottom-right');
        const pointer = pointerMock($handle).start();
        const $fieldChooser = $fieldChooserPopup.find('.dx-pivotgridfieldchooser');
        const fieldChooserHeight = getOuterHeight($fieldChooser, true);
        const fieldChooserWidth = getOuterWidth($fieldChooser, true);
        const $fieldChooserContainer = $fieldChooserPopup.find('.dx-pivotgridfieldchooser-container');
        const fieldChooserContainerHeight = getHeight($fieldChooserContainer);

        pointer.dragStart().drag(10, 15);

        assert.equal($handle.length, 1, 'resizable handle exists');
        assert.equal($fieldChooser.length, 1, 'pivotgridfieldchooser exists');
        assert.equal(getOuterWidth($fieldChooser, true), fieldChooserWidth + 10, 'width of fieldChooser was changed');
        assert.equal(getOuterHeight($fieldChooser, true), fieldChooserHeight + 15, 'height of fieldChooser was changed');
        assert.ok(getHeight($fieldChooserContainer) > fieldChooserContainerHeight, 'height of fieldChooser container was changed');
    });

    QUnit.test('rtlEnabled assign for all children widgets', function(assert) {
        const pivotGrid = createPivotGrid({
            rtlEnabled: true
        });

        this.clock.tick(10);

        pivotGrid.getFieldChooserPopup().show();

        this.clock.tick(500);

        const $widgets = $('.dx-widget');

        $.each($widgets, function() {
            const $widget = $(this);
            const componentNames = dataUtils.data($widget[0], 'dxComponents');

            $.each(componentNames, function(index, componentName) {
                if(componentName.indexOf('dxPrivateComponent') === -1 && componentName !== 'dxToolbarBase') {
                    assert.ok(dataUtils.data($widget[0], componentName).option('rtlEnabled'), 'rtlEnabled for ' + componentName + ' assigned');
                }
            });
        });

        assert.ok(pivotGrid.$element().hasClass('dx-rtl'), 'dx-rtl class added to PivotGrid element');
    });

    QUnit.test('changing rtlEnabled for all children widgets', function(assert) {
        const pivotGrid = createPivotGrid({
            rtlEnabled: true
        });

        this.clock.tick(10);

        pivotGrid._fieldChooserPopup.show();

        this.clock.tick(500);

        pivotGrid.option('rtlEnabled', false);

        pivotGrid._fieldChooserPopup.show();

        this.clock.tick(500);

        const $widgets = $('.dx-widget');

        $.each($widgets, function() {
            const $widget = $(this);
            const componentNames = dataUtils.data($widget[0], 'dxComponents');

            $.each(componentNames, function(index, componentName) {
                if(componentName !== 'dxCheckBox' && componentName !== 'dxButton') {
                    assert.ok(!dataUtils.data($widget[0], componentName).option('rtlEnabled'), 'rtlEnabled disabled for ' + componentName);
                }
            });
        });

        assert.ok(!pivotGrid.$element().hasClass('dx-rtl'), 'dx-rtl class removed from PivotGrid element');
    });

    [true, false].forEach((useNativeScrolling) => {
        [true, false].forEach((rtlEnabled) => {
            QUnit.test(`aria data with scrollable in rtl mode, scrolling: { useNative: ${useNativeScrolling}}, rtlEnabled: ${rtlEnabled}`, function(assert) {
                const pivotGrid = createPivotGrid({
                    scrolling: {
                        useNative: useNativeScrolling,
                    },
                    rtlEnabled
                });

                const $scrollable = pivotGrid.$element().find('.dx-pivotgrid-area-data');
                const $headersAreaScrollable = pivotGrid.$element().find('.dx-scrollable.dx-pivotgrid-horizontal-headers');
                const $rowsAreaScrollable = pivotGrid.$element().find('.dx-scrollable.dx-pivotgrid-vertical-headers');

                assert.strictEqual($scrollable.hasClass('dx-rtl'), rtlEnabled);
                assert.strictEqual($headersAreaScrollable.hasClass('dx-rtl'), isRenovatedScrollable && rtlEnabled);
                assert.strictEqual($rowsAreaScrollable.hasClass('dx-rtl'), false);

                pivotGrid.option('rtlEnabled', !rtlEnabled);

                assert.strictEqual($scrollable.hasClass('dx-rtl'), !rtlEnabled);
                assert.strictEqual($headersAreaScrollable.hasClass('dx-rtl'), isRenovatedScrollable && !rtlEnabled);
                assert.strictEqual($rowsAreaScrollable.hasClass('dx-rtl'), false);
            });
        });
    });

    QUnit.test('onCellPrepared event', function(assert) {
        const cellPreparedArgs = { length: 0 };

        const pivotGrid = createPivotGrid({
            dataSource: this.dataSource,
            onCellPrepared: function(e) {
                if(e.columnIndex === 0 && e.rowIndex === 1) {
                    cellPreparedArgs[e.area] = e;
                    cellPreparedArgs.length++;
                }
            }
        });

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
        const cellPreparedArgs = { length: 0 };

        const pivotGrid = createPivotGrid({
            dataSource: this.dataSource
        });

        pivotGrid.on('cellPrepared', function(e) {
            if(e.columnIndex === 0 && e.rowIndex === 1) {
                cellPreparedArgs[e.area] = e;
                cellPreparedArgs.length++;
            }
        });

        pivotGrid.repaint();

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
        let isCellPreparedCalled = false;

        createPivotGrid({
            dataSource: this.dataSource,
            onCellPrepared: function(e) {
                if(e.cell.text === '2010') {
                    assert.equal($(e.cellElement).closest($('#qunit-fixture').get(0)).length, 1, 'cellElement is attached to dom');
                    assert.equal($(e.cellElement).css('textAlign'), 'left', 'cellElement text-align');
                    isCellPreparedCalled = true;
                }
            }
        });

        assert.ok(isCellPreparedCalled, 'cellPrepared called');
    });

    QUnit.test('onCellPrepared event should change in runtime', function(assert) {
        const oldHandler = sinon.stub();
        const newHandler = sinon.stub();

        const pivotGrid = createPivotGrid({
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
        });

        pivotGrid.on('cellPrepared', function() { });

        oldHandler.reset();
        pivotGrid.option('onCellPrepared', newHandler);

        pivotGrid.repaint();

        assert.ok(!oldHandler.callCount);
        assert.strictEqual(newHandler.callCount, 15);
    });

    QUnit.test('contextMenu', function(assert) {
        const contextMenuArgs = [];
        let testItemClicked;

        const pivotGrid = createPivotGrid({
            dataSource: this.dataSource
        });

        pivotGrid.on('contextMenuPreparing', function(e) {
            contextMenuArgs.push(e);
            e.items.push({ text: 'Test', onItemClick: function() { testItemClicked = true; } });
        });

        const $dataArea = $('#pivotGrid').find('.dx-pivotgrid-area-data');

        this.clock.tick(10);

        $($dataArea.find('tr').eq(1).find('td').eq(3)).trigger('dxcontextmenu');

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

        const $menuItems = $('.dx-pivotgrid.dx-context-menu .dx-menu-item');
        assert.equal($menuItems.length, 2, 'context menu items count');

        $($menuItems.eq(1)).trigger('dxclick');

        assert.ok(testItemClicked, 'Test item clicked');
    });

    // T753856
    QUnit.test('contextMenu in field chooser', function(assert) {
        const contextMenuPreparing = sinon.spy();
        const pivotGrid = createPivotGrid({
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
        });

        this.clock.tick(10);

        pivotGrid.getFieldChooserPopup().show();

        this.clock.tick(500);

        $('.dx-area').eq(1).find('.dx-area-field-content').eq(0).trigger('dxcontextmenu');

        assert.equal(contextMenuPreparing.callCount, 1, 'contextMenuPreparing event fired only once');

        const args = contextMenuPreparing.getCall(0).args[0];
        assert.strictEqual(args.component.NAME, 'dxPivotGrid', 'handler was called by dxPivotGrid component');
        assert.deepEqual(args.field, args.component.getDataSource().field(0), 'field');
    });

    QUnit.test('contextMenu on Total node when rowHeaderLayout is \'tree\'', function(assert) {
        this.dataSource.rows[0].children = [{ value: 'P1', index: 0 }, { value: 'P2', index: 1 }];
        this.dataSource.fields.push({ area: 'row' });

        const pivotGrid = createPivotGrid({
            dataSource: this.dataSource,
            allowExpandAll: true,
            rowHeaderLayout: 'tree'
        });

        const contextMenuPreparing = sinon.stub();

        pivotGrid.on('contextMenuPreparing', contextMenuPreparing);

        this.clock.tick(10);

        $('.dx-pivotgrid-vertical-headers .dx-pivotgrid-expanded').trigger('dxcontextmenu');
        $('.dx-pivotgrid-vertical-headers .dx-pivotgrid-collapsed').trigger('dxcontextmenu');

        $('.dx-pivotgrid-horizontal-headers .dx-pivotgrid-expanded').trigger('dxcontextmenu');
        $('.dx-pivotgrid-horizontal-headers .dx-pivotgrid-collapsed').trigger('dxcontextmenu');

        $('.dx-pivotgrid-vertical-headers .dx-white-space-column').trigger('dxcontextmenu');
        $('.dx-pivotgrid-vertical-headers .dx-grandtotal').trigger('dxcontextmenu');

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

        const pivotGrid = createPivotGrid({
            dataSource: this.dataSource,
            rowHeaderLayout: 'tree',
            allowExpandAll: false
        });

        const contextMenuPreparing = sinon.stub();

        pivotGrid.on('contextMenuPreparing', contextMenuPreparing);

        this.clock.tick(10);

        $('.dx-pivotgrid-vertical-headers .dx-pivotgrid-expanded').trigger('dxcontextmenu');

        assert.strictEqual(contextMenuPreparing.callCount, 1);
        assert.strictEqual(contextMenuPreparing.getCall(0).args[0].items.length, 1);
        assert.strictEqual(contextMenuPreparing.getCall(0).args[0].items[0].text, 'Show Field Chooser');
    });

    QUnit.test('Context menu when click on field chooser', function(assert) {
        const contextMenuArgs = [];
        const pivotGrid = createPivotGrid({
            dataSource: this.dataSource,
            fieldPanel: {
                showRowFields: true,
                showFilterFields: true,
                visible: true
            },
            onContextMenuPreparing: function(e) {
                contextMenuArgs.push(e);
            }
        });
        const $fieldsArea = $('#pivotGrid').find('.dx-pivotgrid-fields-area');
        const $dataFields = $fieldsArea.eq(1);
        const $filterFields = $fieldsArea.eq(0);

        $($filterFields.children().eq(0)).trigger('dxcontextmenu');
        $($dataFields.find('td').eq(0).children()).trigger('dxcontextmenu');

        assert.equal(contextMenuArgs.length, 2, 'onContextMenuPreparing call count');
        assert.ok(!contextMenuArgs[0].field, 'no fields in filter');
        assert.equal(contextMenuArgs[1].field, pivotGrid.getDataSource().field('Sum1'), 'first field in column');
    });

    QUnit.test('Context menu when no data', function(assert) {
        const contextMenuArgs = [];

        createPivotGrid({
            onContextMenuPreparing: function(e) {
                contextMenuArgs.push(e);
            }
        });

        this.clock.tick(10);
        const $dataArea = $('#pivotGrid').find('.dx-pivotgrid-area-data');

        $($dataArea.children().eq(0)).trigger('dxcontextmenu');

        assert.equal(contextMenuArgs.length, 1, 'onCellClick call count');
        assert.equal(contextMenuArgs[0].items.length, 1, 'first cell contextmenu items count');
        assert.equal(contextMenuArgs[0].items[0].text, 'Show Field Chooser', 'first context menu item text');
    });

    // T278129
    QUnit.test('Context menu when click target no pivot table', function(assert) {
        const pivotGrid = createPivotGrid({
            onContextMenuPreparing: sinon.stub,
        });

        const $target = $('#pivotGrid').find('.dx-widget.dx-pivotgrid');

        $($target).trigger('dxcontextmenu');

        assert.ok(!pivotGrid.option('onContextMenuPreparing').called, 'should not be context menu');
    });

    QUnit.test('collapse All items', function(assert) {
        const contextMenuArgs = [];
        const pivotGrid = createPivotGrid({

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
        });
        const dataSource = pivotGrid.getDataSource();

        sinon.spy(dataSource, 'load');
        sinon.spy(dataSource, 'collapseAll');

        $('#pivotGrid').find('.dx-pivotgrid-horizontal-headers .dx-pivotgrid-collapsed').trigger('dxcontextmenu');
        contextMenuArgs[0].items[1].onItemClick();

        assert.ok(!dataSource.load.called);
        assert.deepEqual(dataSource.collapseAll.lastCall.args, [0], 'collapseLevel args');
    });

    QUnit.test('change allowExpandAll, allowFiltering, allowSorting, allowSortingBySummary at runtime', function(assert) {
        const pivotGrid = createPivotGrid({
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
        });

        pivotGrid.option('allowExpandAll', false);
        pivotGrid.option('allowFiltering', false);
        pivotGrid.option('allowSorting', false);
        pivotGrid.option('allowSortingBySummary', false);

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
        const contextMenuArgs = [];
        const dataSourceInstance = new PivotGridDataSource({
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
        });

        this.clock.tick(500);

        $('#pivotGrid').find('.dx-pivotgrid-horizontal-headers td').last().trigger('dxcontextmenu');
        contextMenuArgs[0].items[0].onItemClick();
        this.clock.tick(500);

        const $rows = $('#pivotGrid').find('tbody.dx-pivotgrid-vertical-headers').children();

        assert.equal($rows.eq(0).text(), 'e3');
        assert.equal($rows.eq(1).text(), 'e1');
        assert.equal($rows.eq(2).text(), 'e2');
    });

    QUnit.test('Sorting by Summary should not be allowd if paginate is true', function(assert) {
        const contextMenuArgs = [];
        const dataSourceInstance = new PivotGridDataSource({
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
        });

        dataSourceInstance.paginate = function() {
            return true;
        };

        this.clock.tick(500);

        $('#pivotGrid').find('.dx-pivotgrid-horizontal-headers td').last().trigger('dxcontextmenu');

        assert.deepEqual(contextMenuArgs[0].items.map(function(i) { return i.text; }), ['Show Field Chooser'], 'context menu items');
    });

    // T833006
    QUnit.test('load dataSource after PivotGrid dispose', function(assert) {
        const dataSource = new PivotGridDataSource({
            store: []
        });

        const pivotGrid = createPivotGrid({});

        pivotGrid.option('dataSource', dataSource);
        this.clock.tick(10);

        let isLoaded = false;

        pivotGrid.dispose();
        dataSource.load().done(function() {
            isLoaded = true;
        });
        this.clock.tick(10);

        assert.ok(isLoaded, 'data source is loaded');
    });

    QUnit.test('Sorting by Summary context menu', function(assert) {
        const contextMenuArgs = [];
        const pivotGrid = createPivotGrid({
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
        });

        pivotGrid.option('onContextMenuPreparing', function(e) {
            contextMenuArgs.push(e);
        });

        const dataSource = pivotGrid.getDataSource();

        sinon.spy(dataSource, 'field');
        sinon.spy(dataSource, 'load');

        $('#pivotGrid').find('.dx-pivotgrid-horizontal-headers td').last().trigger('dxcontextmenu');

        assert.equal(contextMenuArgs[0].items.length, 1);
        assert.equal(contextMenuArgs[0].items[0].text, 'Sort "Product" by This Column');
        assert.equal(contextMenuArgs[0].items[0].icon, 'none');

        contextMenuArgs[0].items[0].onItemClick();

        assert.ok(dataSource.load.calledOnce);
        assert.ok(dataSource.field.calledOnce);
        assert.deepEqual(dataSource.field.lastCall.args, [2, {
            sortBySummaryField: 'Sum1',
            sortBySummaryPath: ['2010', '2'],
            sortOrder: 'desc'
        }], 'field args');

        contextMenuArgs[0].items[0].onItemClick();

        assert.deepEqual(dataSource.field.lastCall.args, [2, {
            sortBySummaryField: 'Sum1',
            sortBySummaryPath: ['2010', '2'],
            sortOrder: 'asc'
        }], 'field args');
    });

    // T644193
    QUnit.test('Sorting by Summary context menu if several fields with same caption', function(assert) {
        const contextMenuArgs = [];
        const pivotGrid = createPivotGrid({
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
        });

        pivotGrid.option('onContextMenuPreparing', function(e) {
            contextMenuArgs.push(e);
        });

        const dataSource = pivotGrid.getDataSource();

        sinon.spy(dataSource, 'field');
        sinon.spy(dataSource, 'load');

        $('#pivotGrid').find('.dx-pivotgrid-horizontal-headers td').last().trigger('dxcontextmenu');

        assert.equal(contextMenuArgs[0].items.length, 1);
        assert.equal(contextMenuArgs[0].items[0].text, 'Sort "Product" by This Column');
        assert.equal(contextMenuArgs[0].items[0].icon, 'none');

        contextMenuArgs[0].items[0].onItemClick();

        assert.ok(dataSource.load.calledOnce);
        assert.ok(dataSource.field.calledOnce);
        assert.deepEqual(dataSource.field.lastCall.args, [2, {
            sortBySummaryField: 'Sum2',
            sortBySummaryPath: ['2012'],
            sortOrder: 'desc'
        }], 'field args');
    });

    QUnit.test('Sorting by Summary context menu when sorting defined', function(assert) {
        const contextMenuArgs = [];
        const pivotGrid = createPivotGrid({
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
        });

        const dataSource = pivotGrid.getDataSource();

        sinon.spy(dataSource, 'field');
        sinon.spy(dataSource, 'load');

        const $cell = $('#pivotGrid').find('.dx-pivotgrid-horizontal-headers tr').last().children().eq(1);
        $($cell).trigger('dxcontextmenu');

        assert.equal($cell.find('.dx-icon-sorted').length, 1, 'sorted icon applied');
        assert.equal($('#pivotGrid').find('.dx-icon-sorted').length, 1, 'only one sorted icon applied');
        assert.equal(contextMenuArgs[0].items.length, 2);
        assert.equal(contextMenuArgs[0].items[0].text, 'Sort "Product" by This Column');
        assert.equal(contextMenuArgs[0].items[0].icon, 'sortuptext');

        assert.equal(contextMenuArgs[0].items[1].text, 'Remove All Sorting');
        assert.equal(contextMenuArgs[0].items[1].icon, 'none');

        contextMenuArgs[0].items[1].onItemClick();

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

        const $pivotGridElement = $('#pivotGrid').wrap()
            .hide()
            .width(2000)
            .height('200px');
        const pivotGrid = createPivotGrid(this.testOptions);

        $pivotGridElement.show();

        triggerShownEvent($pivotGridElement);

        assert.ok(pivotGrid._rowsArea.hasScroll(), 'has vertical scroll');
        assert.ok(!pivotGrid._columnsArea.hasScroll(), 'has no horizontal scroll');

        const dataAreaContainerElement = $(pivotGrid._dataArea._getScrollable().container()).get(0);

        assert.equal(pivotGrid.__scrollBarWidth, getScrollbarWidth(dataAreaContainerElement));
    });

    QUnit.test('Sorting by Summary context menu when sorting defined for grand total', function(assert) {
        const contextMenuArgs = [];
        const pivotGrid = createPivotGrid({
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
        });

        const dataSource = pivotGrid.getDataSource();

        sinon.spy(dataSource, 'field');
        sinon.spy(dataSource, 'load');

        const $cell = $('#pivotGrid').find('.dx-pivotgrid-horizontal-headers tr').first().children().last();
        $($cell).trigger('dxcontextmenu');

        assert.equal($cell.find('.dx-icon-sorted').length, 1, 'sorted icon applied');
        assert.equal($('#pivotGrid').find('.dx-icon-sorted').length, 1, 'only one sorted icon applied');
        assert.equal(contextMenuArgs[0].items.length, 2);
        assert.equal(contextMenuArgs[0].items[0].text, 'Sort "Product" by This Column');
        assert.equal(contextMenuArgs[0].items[0].icon, 'sortuptext');

        assert.equal(contextMenuArgs[0].items[1].text, 'Remove All Sorting');
        assert.equal(contextMenuArgs[0].items[1].icon, 'none');
    });

    QUnit.test('Sorting by Summary context menu when several data fields for columns', function(assert) {
        const contextMenuArgs = [];
        const pivotGrid = createPivotGrid({
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
        });

        const dataSource = pivotGrid.getDataSource();

        sinon.spy(dataSource, 'field');
        sinon.spy(dataSource, 'load');

        $('#pivotGrid').find('.dx-pivotgrid-horizontal-headers td').last().trigger('dxcontextmenu');

        assert.equal(contextMenuArgs[0].items.length, 2);
        assert.equal(contextMenuArgs[0].items[0].text, 'Sort "Category" by This Column');
        assert.equal(contextMenuArgs[0].items[0].icon, 'none');
        assert.equal(contextMenuArgs[0].items[1].text, 'Sort "Product" by This Column');
        assert.equal(contextMenuArgs[0].items[1].icon, 'none');
    });

    QUnit.test('Sorting by Summary context menu when sorting defined and several data fields for columns', function(assert) {
        const contextMenuArgs = [];
        const pivotGrid = createPivotGrid({
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
        });

        const dataSource = pivotGrid.getDataSource();

        sinon.spy(dataSource, 'field');
        sinon.spy(dataSource, 'load');

        $('#pivotGrid').find('.dx-pivotgrid-horizontal-headers tr').last().children().eq(3).trigger('dxcontextmenu');

        assert.equal(contextMenuArgs[0].items.length, 3);
        assert.equal(contextMenuArgs[0].items[0].text, 'Sort "Category" by This Column');
        assert.equal(contextMenuArgs[0].items[0].icon, 'none');
        assert.equal(contextMenuArgs[0].items[1].text, 'Sort "Product" by This Column');
        assert.equal(contextMenuArgs[0].items[1].icon, 'sortdowntext');
        assert.equal(contextMenuArgs[0].items[2].text, 'Remove All Sorting');
        assert.equal(contextMenuArgs[0].items[2].icon, 'none');
    });

    QUnit.test('Sorting by Summary context menu when sorting defined and several data fields for rows', function(assert) {
        const contextMenuArgs = [];
        const pivotGrid = createPivotGrid({
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
        });

        const dataSource = pivotGrid.getDataSource();

        sinon.spy(dataSource, 'field');
        sinon.spy(dataSource, 'load');

        $('#pivotGrid').find('.dx-pivotgrid-vertical-headers tr').eq(1).children().last().trigger('dxcontextmenu');

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
        const contextMenuArgs = [];
        const pivotGrid = createPivotGrid({
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
        });
        const dataSource = pivotGrid.getDataSource();

        sinon.spy(dataSource, 'expandAll');

        $('#pivotGrid').find('.dx-pivotgrid-horizontal-headers .dx-pivotgrid-collapsed').trigger('dxcontextmenu');

        contextMenuArgs[0].items[0].onItemClick();

        assert.deepEqual(dataSource.expandAll.lastCall.args, [0], 'collapseLevel args');
    });

    QUnit.test('expand All should not be allowed if paginate true', function(assert) {
        const contextMenuArgs = [];

        const pivotGrid = createPivotGrid({
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
        });

        pivotGrid.getDataSource().paginate = function() {
            return true;
        };

        $('#pivotGrid').find('.dx-pivotgrid-horizontal-headers .dx-pivotgrid-collapsed').trigger('dxcontextmenu');

        assert.deepEqual(contextMenuArgs[0].items.map(function(item) { return item.text; }), ['Show Field Chooser'], 'context menu items');
    });

    QUnit.test('expand All items for field in group', function(assert) {
        const contextMenuArgs = [];
        const pivotGrid = createPivotGrid({
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
        });
        const dataSource = pivotGrid.getDataSource();

        sinon.spy(dataSource, 'expandAll');

        $('#pivotGrid').find('.dx-pivotgrid-horizontal-headers .dx-pivotgrid-collapsed').trigger('dxcontextmenu');

        contextMenuArgs[0].items[0].onItemClick();

        assert.deepEqual(dataSource.expandAll.lastCall.args, [1], 'collapseLevel args');
    });

    QUnit.test('pivot grid render', function(assert) {
        const pivotGrid = createPivotGrid({});
        const testElement = $('#pivotGrid');

        const mainTable = testElement.find('table')[0];
        const rows = mainTable.rows;

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
        createPivotGrid({
            wordWrapEnabled: false
        });

        const testElement = $('#pivotGrid');

        const mainTable = testElement.find('table')[0];

        assert.ok(!$(mainTable).hasClass('dx-word-wrap'));
    });

    QUnit.test('disable word wrapping at runtime', function(assert) {
        const pivotGrid = createPivotGrid({
            wordWrapEnabled: true
        });

        const testElement = $('#pivotGrid');
        const mainTable = testElement.find('table')[0];

        pivotGrid.option('wordWrapEnabled', false);

        assert.ok(!$(mainTable).hasClass('dx-word-wrap'));
    });

    QUnit.test('disable rowHeaderLayout at runtime', function(assert) {
        const pivotGrid = createPivotGrid({
            rowHeaderLayout: 'tree'
        });

        const testElement = $('#pivotGrid');
        const mainTable = testElement.find('table')[0];

        pivotGrid.option('rowHeaderLayout', 'standard');

        assert.ok(!$(mainTable).find('.dx-area-row-cell').hasClass('dx-area-tree-view'));
    });

    QUnit.test('enable rowHeaderLayout at runtime', function(assert) {
        const pivotGrid = createPivotGrid({
            rowHeaderLayout: 'standard'
        });

        const testElement = $('#pivotGrid');
        const mainTable = testElement.find('table')[0];

        pivotGrid.option('rowHeaderLayout', 'tree');

        assert.ok($(mainTable).find('.dx-area-row-cell').hasClass('dx-area-tree-view'));
    });

    QUnit.test('resize when columns stretched to less width', function(assert) {
        const $pivotGridElement = $('#pivotGrid').width(1200);
        const pivotGrid = createPivotGrid(this.testOptions);

        $pivotGridElement.width(1100);
        pivotGrid.resize();

        assert.ok(pivotGrid, 'pivotGrid container is rendered');
        assert.ok(!pivotGrid._columnsArea.hasScroll(), 'no horizontal scroll after resize');
    });

    QUnit.test('no scroll after drawing data', function(assert) {
        const pivotGrid = createPivotGrid({
            width: 400,

            dataSource: {
                rows: [],
                columns: [],
                values: []
            }
        });

        const dataScrollable = pivotGrid._dataArea.groupElement().dxScrollable('instance');

        sinon.spy(dataScrollable, 'update');
        sinon.spy(dataScrollable, 'scrollTo');

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
                    value: '10', index: 0
                }, {
                    value: '12', index: 1
                }, {
                    value: '13', index: 2
                }, {
                    value: '14', index: 3
                }],
                values: [
                    [[null], [null], [15], [36], [43], [100]],
                    [[962], [2625], [16], [37], [44], [200]],
                    [[962], [2625], [1753], [11753], [11753]]
                ]
            }
        });

        assert.ok(pivotGrid, 'pivotGrid container is rendered');
        assert.ok(!pivotGrid._columnsArea.hasScroll(), 'no horizontal scroll');
        // T290303
        assert.ok(dataScrollable.update.called);
    });

    QUnit.test('pivot grid has full height', function(assert) {
        const pivotGrid = createPivotGrid({
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
        });
        const tableElement = pivotGrid.$element().find('table').first();

        assert.strictEqual(Math.round(getHeight(tableElement)), 150);
    });

    QUnit.test('T317921: dxPivotGrid - Scrollbar overlaps the last column when the document height slightly exceeds the window height. Without columns scroll', function(assert) {
        const $pivotGridElement = $('#pivotGrid');
        const $parentElement = $('<div>').css({
            height: 400,
            overflow: 'auto'
        }).appendTo($('#pivotGrid').parent());

        $pivotGridElement.appendTo($parentElement);

        const pivotGrid = createPivotGrid(this.testOptions);

        const tableElement = $pivotGridElement.find('table').first();

        const dataAreaWidth = getWidth(pivotGrid.$element().find('.dx-pivotgrid-area-data'));
        const rowsAreaWidth = getWidth(
            pivotGrid.$element().find('.dx-pivotgrid-vertical-headers.dx-pivotgrid-area')
        );

        assert.strictEqual(getWidth(tableElement), getWidth($pivotGridElement)),
        assert.ok((dataAreaWidth + rowsAreaWidth) <= getWidth($pivotGridElement));
    });

    QUnit.test('resize when height changed to no scroll', function(assert) {
        this.testOptions.scrolling = {
            useNative: false,
            bounceEnabled: false
        };

        const $pivotGridElement = $('#pivotGrid').height(200);
        const pivotGrid = createPivotGrid(this.testOptions);

        assert.ok(pivotGrid._rowsArea.hasScroll(), 'has vertical scroll');
        assert.equal(pivotGrid.$element().find(`.${DATA_AREA_CELL_CLASS}`).css('borderBottomWidth'), '0px', 'data area border bottom width');
        assert.equal(pivotGrid.$element().find('.dx-area-row-cell').css('borderBottomWidth'), '0px', 'row area border bottom width');

        const scrollable = pivotGrid._dataArea.groupElement().dxScrollable('instance');

        scrollable.scrollTo(10);

        $pivotGridElement.height(1000);
        pivotGrid.resize();

        assert.ok(pivotGrid, 'pivotGrid container is rendered');
        assert.ok(!pivotGrid._rowsArea.hasScroll(), 'no has vertical scroll after resize');

        assert.ok(parseFloat(pivotGrid.$element().find(`.${DATA_AREA_CELL_CLASS}`).css('borderBottomWidth')) > 0, 'data area border bottom width');
        assert.ok(parseFloat(pivotGrid.$element().find('.dx-area-row-cell').css('borderBottomWidth')) > 0, 'row area border bottom width');

        assert.equal(pivotGrid._dataArea.groupElement().dxScrollable('scrollHeight'), pivotGrid._dataArea.groupElement().dxScrollable('clientHeight'), 'client height equal scroll height');

        assert.strictEqual(pivotGrid._dataArea.groupElement().dxScrollable('scrollTop'), 0);
        assert.strictEqual(pivotGrid._rowsArea.groupElement().dxScrollable('scrollTop'), 0);
    });


    QUnit.test('page scrolling after tapping inside PivotGrid. T418829', function(assert) {
        const pivotGrid = createPivotGrid(this.testOptions);

        assert.expect(1);

        $(document).on('dxpointermove', assertFunction);

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
        const pivotGrid = createPivotGrid(this.testOptions);

        assert.ok(!pivotGrid.hasScroll('row'), 'has vertical scroll');

        pivotGrid.option('height', 200);

        assert.ok(pivotGrid.hasScroll('row'), 'has vertical scroll after resize');
    });

    QUnit.test('Pivot should have scroll after container height was changed', function(assert) {
        const $container = $('<div>');
        const $pivotGrid = $('<div>');
        $container.append($pivotGrid).appendTo('#qunit-fixture');

        $pivotGrid.dxPivotGrid($.extend(this.testOptions, {
            height: '50%'
        }));

        const pivotGrid = $pivotGrid.dxPivotGrid('instance');

        assert.ok(!pivotGrid.hasScroll('row'), 'has vertical scroll');

        $container.css('height', 400);
        pivotGrid.updateDimensions();

        assert.ok(pivotGrid.hasScroll('row'), 'has vertical scroll after resize');
    });

    QUnit.test('Resize. reset height', function(assert) {
        const pivotGrid = createPivotGrid($.extend(this.testOptions, {
            height: 200
        }));

        assert.ok(pivotGrid.hasScroll('row'), 'has vertical scroll');

        pivotGrid.option('height', 'auto');

        assert.ok(!pivotGrid.hasScroll('row'), 'has vertical scroll after resize');
    });

    QUnit.test('resize when width changed to no scroll', function(assert) {
        const $pivotGridElement = $('#pivotGrid').width(150);
        const pivotGrid = createPivotGrid(this.testOptions);

        const scrollable = pivotGrid._dataArea.groupElement().dxScrollable('instance');

        scrollable.option({
            useNative: false,
            bounceEnabled: false
        });

        scrollable.scrollTo(10);

        assert.ok(pivotGrid._columnsArea.hasScroll(), 'no has vertical scroll after resize');

        $pivotGridElement.width(2000);
        pivotGrid.resize();

        assert.ok(pivotGrid, 'pivotGrid container is rendered');
        assert.ok(!pivotGrid._columnsArea.hasScroll(), 'no has vertical scroll after resize');

        assert.strictEqual(pivotGrid._dataArea.groupElement().dxScrollable('scrollLeft'), 0);
        assert.strictEqual(pivotGrid._columnsArea.groupElement().dxScrollable('scrollLeft'), 0);
    });

    if(!devices.real().ios) {
        QUnit.test('bottom border and not vertical scroll when big height', function(assert) {
            $('#pivotGrid').height(1000);
            const pivotGrid = createPivotGrid(this.testOptions);

            assert.ok(!pivotGrid._rowsArea.hasScroll(), 'has vertical scroll');
            assert.ok(parseFloat(pivotGrid.$element().find(`.${DATA_AREA_CELL_CLASS}`).css('borderBottomWidth')) > 0, 'data area border bottom width');
            assert.ok(parseFloat(pivotGrid.$element().find('.dx-area-row-cell').css('borderBottomWidth')) > 0, 'row area border bottom width');
            assert.equal(pivotGrid._dataArea.groupElement().dxScrollable('scrollHeight'), pivotGrid._dataArea.groupElement().dxScrollable('clientHeight'), 'client height equal scroll height');
        });
    }

    QUnit.test('no bottom border if vertical scroll when small height', function(assert) {
        $('#pivotGrid').height(200);
        this.testOptions.scrolling = {
            useNative: true
        };
        const pivotGrid = createPivotGrid(this.testOptions);

        assert.ok(pivotGrid._rowsArea.hasScroll(), 'has vertical scroll');
        assert.equal(parseFloat(pivotGrid.$element().find(`.${DATA_AREA_CELL_CLASS}`).css('borderBottomWidth')), 0, 'data area border bottom width');
        assert.equal(parseFloat(pivotGrid.$element().find('.dx-area-row-cell').css('borderBottomWidth')), 0, 'row area border bottom width');
    });

    QUnit.test('bottom border if horizontal scroll', function(assert) {
        $('#pivotGrid').width(300);
        this.testOptions.scrolling = {
            useNative: true
        };
        const pivotGrid = createPivotGrid(this.testOptions);

        assert.ok(!pivotGrid._rowsArea.hasScroll(), 'has vertical scroll');
        assert.ok(pivotGrid._columnsArea.hasScroll(), 'has horizontal scroll');
        assert.ok(parseFloat(pivotGrid.$element().find(`.${DATA_AREA_CELL_CLASS}`).css('borderBottomWidth')) > 0, 'data area border bottom width');
        assert.ok(parseFloat(pivotGrid.$element().find('.dx-area-row-cell').css('borderBottomWidth')) > 0, 'row area border bottom width when no scrollbar width');
    });

    QUnit.test('Group height should take into account horizontal scrollbar height', function(assert) {
        $('#pivotGrid').width(300).height(900);
        this.testOptions.scrolling = {
            useNative: false
        };
        const pivotGrid = createPivotGrid(this.testOptions);
        const dataAreaHeight = getHeight(pivotGrid.$element().find('.dx-pivotgrid-area-data'));

        pivotGrid.option({
            scrolling: {
                useNative: true
            }
        });
        assert.roughEqual(getHeight(pivotGrid.$element().find('.dx-pivotgrid-area-data')), dataAreaHeight + pivotGrid.__scrollBarWidth, 1);
    });

    QUnit.test('mergeArraysByMaxValue', function(assert) {
        const array1 = [10, 12, 35, 7];
        const array2 = [8, 12, 39, 5];

        assert.deepEqual(pivotGridUtils.mergeArraysByMaxValue(array1, array2), [10, 12, 39, 7], 'result array');
    });

    QUnit.test('Synchronize areas', function(assert) {
        const testElement = $('#pivotGrid');

        testElement.width(800);
        testElement.height(300);
        const pivotGrid = createPivotGrid(this.testOptions);
        this.clock.tick(10);
        const dataAreaElement = testElement.find('.dx-pivotgrid-area-data table');
        const rows = dataAreaElement[0].rows;
        const colsElement = dataAreaElement.find('col');

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
        const done = assert.async();

        $('#pivotGrid').empty();
        $('#pivotGrid').width(100);
        const pivotGrid = createPivotGrid({
            dataSource: this.dataSource
        });
        this.clock.tick(10);
        assert.ok(pivotGrid);
        const columnWidths = pivotGrid._columnsArea.getColumnsWidth();

        const scrollable = pivotGrid._dataArea.groupElement().dxScrollable('instance');

        const scrollAction = function(e) {
            const scrollPath = pivotGrid.getScrollPath('column');

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
        const pivotGrid = createPivotGrid({
            dataSource: this.dataSource
        });
        this.clock.tick(10);
        assert.ok(pivotGrid);

        assert.deepEqual(pivotGrid.getScrollPath('column'), ['2010', '1']);
        assert.deepEqual(pivotGrid.getScrollPath('row'), ['A']);
    });

    QUnit.test('Scrolling when virtual scrolling is enabled', function(assert) {
        const done = assert.async();
        let assertFunction;

        $('#pivotGrid').empty();
        $('#pivotGrid').width(100);
        $('#pivotGrid').height(150);
        const pivotGrid = createPivotGrid({
            fieldChooser: {
                enabled: false
            },
            scrolling: {
                mode: 'virtual',
                timeout: 0
            },
            dataSource: this.dataSource
        });
        this.clock.tick(10);
        assert.ok(pivotGrid);

        const scrollable = pivotGrid._dataArea.groupElement().dxScrollable('instance');
        const setViewportPosition = sinon.spy(pivotGrid._dataController, 'setViewportPosition');
        const updateWindowScrollPosition = sinon.spy(pivotGrid._dataController, 'updateWindowScrollPosition');

        const scrollFunction = function(e) {
            assertFunction();
        };
        scrollable.on('scroll', scrollFunction);

        assertFunction = function() {
            assert.deepEqual(setViewportPosition.lastCall.args, [10, 0]);
        };

        scrollable.scrollTo({ left: 10 });

        assertFunction = function() {
            assert.deepEqual(setViewportPosition.lastCall.args, [10, 1]);
            assert.strictEqual(updateWindowScrollPosition.lastCall.args[0], 1);
            scrollable.off('scroll', scrollFunction);
            done();
        };

        scrollable.scrollTo({ left: 10, top: 1 });
    });

    // T810822
    QUnit.test('hasScroll should return true if scrolling is virtual and data is empty', function(assert) {
        $('#pivotGrid').empty();
        $('#pivotGrid').width(100);
        $('#pivotGrid').height(150);

        this.dataSource.values = [];

        const pivotGrid = createPivotGrid({
            fieldChooser: {
                enabled: false
            },
            scrolling: {
                mode: 'virtual',
                timeout: 0
            },
            dataSource: this.dataSource
        });

        this.clock.tick(10);

        assert.ok(pivotGrid._columnsArea.hasScroll(), 'columns area scroll');
        assert.ok(pivotGrid._rowsArea.hasScroll(), 'rows area scroll');
    });

    // T518512;
    QUnit.test('render should be called once after expand item if virtual scrolling enabled', function(assert) {
        $('#pivotGrid').empty();
        $('#pivotGrid').width(100);
        $('#pivotGrid').height(150);

        const array = [];
        for(let i = 0; i < 30; i++) {
            array.push({ id: i, row: i + 1, column: i + 1, data: 1 });
        }

        const pivotGrid = createPivotGrid({
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
        });

        this.clock.tick(10);

        let contentReadyCallCount = 0;

        pivotGrid.on('contentReady', function() {
            contentReadyCallCount++;
        });

        pivotGrid.getDataSource().expandHeaderItem('row', [1]);
        pivotGrid.getDataSource().load();
        this.clock.tick(10);

        assert.equal(contentReadyCallCount, 1);
    });

    // T529461;
    QUnit.test('Initial horizontal scroll position when rtl is enabled', function(assert) {
        $('#pivotGrid').empty();
        $('#pivotGrid').width(100);
        $('#pivotGrid').height(150);
        const pivotGrid = createPivotGrid({
            rtlEnabled: true,
            fieldChooser: {
                enabled: false
            },
            dataSource: this.dataSource
        });
        this.clock.tick(10);

        const dataAreaScrollable = pivotGrid._dataArea._getScrollable();
        const columnAreaScrollable = pivotGrid._columnsArea._getScrollable();
        assert.ok(dataAreaScrollable.scrollLeft() > 0, 'scrollLeft is not zero');
        assert.ok(columnAreaScrollable.scrollLeft() > 0, 'scrollLeft is not zero');

        const dataAreaContainerElement = $(dataAreaScrollable.container()).get(0);
        assert.roughEqual(dataAreaScrollable.scrollLeft(), dataAreaContainerElement.scrollWidth - dataAreaContainerElement.clientWidth, 1, 'scrollLeft is in max right position');
        assert.roughEqual(columnAreaScrollable.scrollLeft() + getWidth($(columnAreaScrollable.container())), getWidth($(columnAreaScrollable.content())), 2.01, 'scrollLeft is in max right position');
    });

    // T529461;
    QUnit.test('Initial horizontal scroll position when rtl is enabled and scrolling mode is virtual', function(assert) {
        $('#pivotGrid').empty();
        $('#pivotGrid').width(100);
        $('#pivotGrid').height(150);
        const pivotGrid = createPivotGrid({
            rtlEnabled: true,
            fieldChooser: {
                enabled: false
            },
            scrolling: {
                mode: 'virtual',
                timeout: 0
            },
            dataSource: this.dataSource
        });
        this.clock.tick(10);
        assert.ok(pivotGrid);

        const dataAreaScrollable = pivotGrid._dataArea._getScrollable();
        const columnAreaScrollable = pivotGrid._columnsArea._getScrollable();
        const dataAreaFakeTable = pivotGrid.$element().find('.dx-pivotgrid-area-data .dx-pivot-grid-fake-table');
        const columnAreaFakeTable = pivotGrid.$element().find('.dx-pivotgrid-horizontal-headers .dx-pivot-grid-fake-table');
        const dataAreaContentTable = pivotGrid.$element().find('.dx-pivotgrid-area-data .dx-scrollable-content > table');
        const columnAreaContentTable = pivotGrid.$element().find('.dx-pivotgrid-horizontal-headers .dx-scrollable-content > table');
        assert.ok(dataAreaScrollable.scrollLeft() > 0, 'scrollLeft is not zero');
        assert.ok(columnAreaScrollable.scrollLeft() > 0, 'scrollLeft is not zero');

        const dataAreaContainerElement = $(dataAreaScrollable.container()).get(0);
        assert.roughEqual(dataAreaScrollable.scrollLeft(), dataAreaContainerElement.scrollWidth - dataAreaContainerElement.clientWidth, 1, 'scrollLeft is in max right position');
        assert.roughEqual(columnAreaScrollable.scrollLeft() + getWidth($(columnAreaScrollable.container())), getWidth($(columnAreaScrollable.content())), 2.01, 'scrollLeft is in max right position');
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
        const done = assert.async();

        $('#pivotGrid').empty();
        $('#pivotGrid').width(100);
        $('#pivotGrid').height(150);
        const pivotGrid = createPivotGrid({
            rtlEnabled: true,
            fieldChooser: {
                enabled: false
            },
            scrolling: {
                mode: 'virtual',
                timeout: 0
            },
            dataSource: this.dataSource
        });
        this.clock.tick(10);
        assert.ok(pivotGrid);

        const dataAreaScrollable = pivotGrid._dataArea._getScrollable();
        const columnAreaScrollable = pivotGrid._columnsArea._getScrollable();

        const scrollAssert = function() {
            dataAreaScrollable.off('scroll', scrollAssert);

            assert.roughEqual(pivotGrid._scrollLeft, 10, 1, '_scrollLeft variable store inverted value');
            assert.ok(dataAreaScrollable.scrollLeft() > 0, 'scrollLeft is not zero');
            assert.ok(columnAreaScrollable.scrollLeft() > 0, 'scrollLeft is not zero');

            const dataAreaContainerElement = $(dataAreaScrollable.container()).get(0);
            assert.roughEqual(dataAreaScrollable.scrollLeft() + 10, dataAreaContainerElement.scrollWidth - dataAreaContainerElement.clientWidth, 1, 'scrollLeft is in max right position');
            assert.roughEqual(columnAreaScrollable.scrollLeft() + 10 + getWidth($(columnAreaScrollable.container())), getWidth($(columnAreaScrollable.content())), 2.01, 'scrollLeft is in max right position');

            done();
        };

        dataAreaScrollable.on('scroll', scrollAssert);
        dataAreaScrollable.scrollBy({ left: -10 });
    });


    QUnit.test('Fix horizontal scroll position after scroll when rtl is enabled', function(assert) {
        const done = assert.async();

        const pivotGrid = createPivotGrid({
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
        });
        this.clock.tick(10);

        const dataAreaScrollable = pivotGrid._dataArea._getScrollable();

        const assertFunction = function(e) {
            if(e.scrollOffset.top === 10) {
                assert.equal(dataAreaScrollable.scrollLeft(), 100);
                dataAreaScrollable.off('scroll', assertFunction);
                done();
            }
        };

        const scrollAssert = function() {
            dataAreaScrollable.off('scroll', scrollAssert);
            dataAreaScrollable.on('scroll', assertFunction);

            dataAreaScrollable.scrollTo({ top: 10 });
            assert.equal(dataAreaScrollable.scrollLeft(), 100);
        };

        dataAreaScrollable.on('scroll', scrollAssert);

        dataAreaScrollable.scrollTo({ left: 100 });
    });

    QUnit.test('Virtual scrolling if height is not defined', function(assert) {
        const pivotGrid = createPivotGrid({
            width: 120,
            fieldChooser: {
                enabled: false
            },
            scrolling: {
                mode: 'virtual'
            },
            dataSource: this.dataSource

        });
        const done = assert.async();

        pivotGrid._dataController.scrollChanged.fire({
            left: 5,
            top: 7
        });

        const scrollable = pivotGrid._dataArea.groupElement().dxScrollable('instance');
        const setViewportPosition = sinon.spy(pivotGrid._dataController, 'setViewportPosition');
        const updateWindowScrollPosition = sinon.spy(pivotGrid._dataController, 'updateWindowScrollPosition');

        function assertFunction() {
            assert.deepEqual(setViewportPosition.lastCall.args, [10, 7]);

            assert.strictEqual(updateWindowScrollPosition.lastCall.args[0], 7, 'external scroll position is set');
            scrollable.off('scroll', assertFunction);
            done();
        }

        scrollable.on('scroll', assertFunction);
        scrollable.scrollTo({ left: 10, top: 1 });
    });

    QUnit.test('T243287. Scroll position after updateDimensions', function(assert) {
        $('#pivotGrid').empty();
        $('#pivotGrid').width(100);
        const done = assert.async();
        const pivotGrid = createPivotGrid({
            dataSource: this.dataSource
        });
        this.clock.tick(10);

        const columnWidths = pivotGrid._columnsArea.getColumnsWidth();
        const scrollable = pivotGrid._dataArea.groupElement().dxScrollable('instance');

        const scrollAction = function(e) {
            const columnsScrollPosition = pivotGrid._columnsArea.groupElement().dxScrollable('instance').scrollLeft();
            const dataScrollPosition = scrollable.scrollLeft();

            pivotGrid.updateDimensions();

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
        const done = assert.async();
        $('#pivotGrid').height(150).width(800);
        const pivotGrid = createPivotGrid({
            fieldChooser: {
                enabled: false
            },
            dataSource: this.dataSource
        });
        this.clock.tick(10);
        assert.ok(pivotGrid);
        const columnHeights = pivotGrid._rowsArea.getRowsHeight();

        const scrollable = pivotGrid._dataArea.groupElement().dxScrollable('instance');
        const rowScrollable = pivotGrid._rowsArea.groupElement().dxScrollable('instance');

        scrollable.on('scroll', assertFunction);

        rowScrollable.scrollTo(columnHeights[0] + 5);

        rowScrollable.option('useSimulatedScrollbar', true); // T317655
        rowScrollable.option('useNative', false);

        function assertFunction() {
            const scrollPath = pivotGrid.getScrollPath('row');
            assert.deepEqual(scrollPath, ['B']);
            assert.ok(pivotGrid.hasScroll('row'));
            scrollable.off('scroll', assertFunction);
            done();
        }
    });

    QUnit.test('T245599. Scroll columnArea area', function(assert) {
        const done = assert.async();
        $('#pivotGrid').height(150).width(300);
        const pivotGrid = createPivotGrid({
            fieldChooser: {
                enabled: false
            },
            dataSource: this.dataSource
        });
        this.clock.tick(10);
        assert.ok(pivotGrid);
        const columnWidth = pivotGrid._columnsArea.getColumnsWidth();

        const scrollable = pivotGrid._dataArea.groupElement().dxScrollable('instance');
        const columnScrollable = pivotGrid._columnsArea.groupElement().dxScrollable('instance');

        scrollable.on('scroll', assertFunction);

        columnScrollable.scrollTo(columnWidth[0] + columnWidth[1] + 5);

        columnScrollable.option('useSimulatedScrollbar', true); // T317655
        columnScrollable.option('useNative', false);

        function assertFunction() {
            const scrollPath = pivotGrid.getScrollPath('column');
            assert.ok(pivotGrid.hasScroll('column'));
            assert.deepEqual(scrollPath, ['2010', '2']);
            scrollable.off('scroll', assertFunction);
            done();
        }
    });

    ['standard', 'virtual'].forEach(scrollMode => {
        [true, false].forEach(useNative => {
            [40, 80].forEach(scrollDistance => {
                QUnit.test(`Container.visibility= false -> Container.visibility= true -> dataArea.trigger(scrollTop), useNative=${useNative}, scrollMode=${scrollMode}, scrollDistance = ${scrollDistance} (T907207)`, function(assert) {
                    $('#pivotGrid').wrap($('<div id="wrapper"></div>').css('display', 'none'));

                    const grid = $('#pivotGrid').dxPivotGrid({
                        width: 500,
                        height: 100,
                        scrolling: {
                            mode: scrollMode,
                            useNative: useNative
                        },
                        dataSource: {
                            fields: [
                                { area: 'row', dataField: 'row1' },
                                { area: 'column', dataField: 'col1' },
                                { area: 'data', summaryType: 'count', dataType: 'number' },
                            ],
                            store: [
                                { row1: 'r1', col1: 'c1' },
                                { row1: 'r2', col1: 'c1' },
                                { row1: 'r3', col1: 'c1' },
                                { row1: 'r4', col1: 'c1' },
                                { row1: 'r5', col1: 'c1' }
                            ]
                        }
                    }).dxPivotGrid('instance');
                    this.clock.tick(10);

                    $('#wrapper').css('display', 'block');
                    grid.updateDimensions();

                    const eventArgs = { scrollOffset: { top: scrollDistance, left: 0 } };
                    grid._dataArea.element()
                        .find('.dx-scrollable').dxScrollable('instance')
                        ._eventsStrategy.fireEvent('scroll', [eventArgs]);

                    const $rowsElement = grid._rowsArea.element();
                    const containerTop = $rowsElement.find('.dx-scrollable-container').get(0).getBoundingClientRect().top;
                    const contentTop = $rowsElement.find('.dx-scrollable-content').get(0).getBoundingClientRect().top;

                    assert.equal(containerTop - contentTop, scrollDistance);
                });
            });
        });
    });

    QUnit.test('getScrollPath for rows', function(assert) {
        const done = assert.async();
        $('#pivotGrid').height(150).width(800);
        const pivotGrid = createPivotGrid({

            dataSource: this.dataSource
        });
        this.clock.tick(10);
        assert.ok(pivotGrid);
        const columnHeights = pivotGrid._rowsArea.getRowsHeight();

        const scrollable = pivotGrid._dataArea.groupElement().dxScrollable('instance');

        scrollable.on('scroll', assertFunction);

        scrollable.scrollTo(columnHeights[0] + 5);

        function assertFunction() {
            const scrollPath = pivotGrid.getScrollPath('row');

            assert.ok(pivotGrid.hasScroll('row'));
            assert.deepEqual(scrollPath, ['B']);
            scrollable.off('scroll', assertFunction);
            done();
        }
    });

    QUnit.test('Custom localize grandTotal and total text', function(assert) {
        createPivotGrid({
            texts: {
                grandTotal: 'Custom Grand Total',
                total: 'Custom {0} Total'
            },
            dataSource: this.dataSource
        });

        function getText(elements, index) {
            return $(elements[index]).text();
        }

        assert.equal(getText($('.dx-pivotgrid-horizontal-headers .dx-total'), 0), 'Custom 2010 Total', 'total');
        assert.equal(getText($('.dx-pivotgrid-horizontal-headers .dx-grandtotal'), 0), 'Custom Grand Total', 'grand total');
        assert.equal(getText($('.dx-pivotgrid-vertical-headers .dx-grandtotal'), 0), 'Custom Grand Total', 'grand total');
    });

    QUnit.test('dxPivotGrid with vertical scroll and minimum width without horizontal scroller (columns stretch to less)', function(assert) {
        const createPivotGridOptions = function(options) {
            const rowItems = [
                {
                    value: 'C1', index: 2,
                    children: [{ value: 'P1', index: 0 }, { value: 'P2', index: 1 }]
                }, {
                    value: 'C2', index: 5,
                    children: [{ value: 'P3', index: 3 }, { value: 'P4', index: 4 }]
                }];

            const columnItems = [
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


            const cellSet = [
                [[100000000, 0.1], [8, 0.8], [15, 0.15], [22, 0.22], [29, 0.29], [36, 0.36], [43, 0.43]],
                [[2, 0.2], [9, 0.9], [16, 0.16], [23, 0.23], [30, 0.3], [37, 0.37], [44, 0.44]],
                [[3, 0.3], [10, 0.1], [17, 0.17], [24, 0.24], [31, 0.31], [38, 0.38], [45, 0.45]],
                [[4, 0.4], [11, 0.11], [18, 0.18], [25, 0.25], [32, 0.32], [39, 0.39], [46, 0.46]],
                [[5, 0.5], [12, 0.12], [19, 0.19], [26, 0.26], [33, 0.33], [40, 0.4], [47, 0.47]],
                [[6, 0.6], [13, 0.13], [20, 0.2], [27, 0.27], [34, 0.34], [41, 0.41], [48, 0.48]],
                [[7, 0.7], [14, 0.14], [21, 0.21], [28, 0.28], [35, 0.35], [42, 0.42], [49, 0.49]]];

            const pivotGridOptions = $.extend(true, {
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

        const pivotGrid = createPivotGrid(createPivotGridOptions({ width: 1005, height: 250 }));

        this.clock.tick(10);

        assert.ok(pivotGrid);
        const columnsArea = pivotGrid._columnsArea;
        assert.ok(!columnsArea.hasScroll(), 'no columnAreaScroll');
        assert.ok(columnsArea.getGroupWidth());


        const columnsWidth = sumArray(columnsArea.getColumnsWidth());
        const columnsAreaWidth = getWidth(
            pivotGrid.$element().find('.dx-pivotgrid-horizontal-headers.dx-pivotgrid-area')
        );

        assert.roughEqual(columnsAreaWidth, columnsWidth, 0.2, 'stretched');

        const table = pivotGrid.$element().find('table').first();

        assert.strictEqual(getWidth(table), 1005, 'table width');
    });

    QUnit.test('Stretch columns when scrolling has size', function(assert) {
        const createPivotGridOptions = function(options) {
            const rowItems = [
                {
                    value: 'C1', index: 2,
                    children: [{ value: 'P1', index: 0 }, { value: 'P2', index: 1 }]
                }, {
                    value: 'C2', index: 5,
                    children: [{ value: 'P3', index: 3 }, { value: 'P4', index: 4 }]
                }];

            const columnItems = [
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


            const cellSet = [
                [[100000000, 0.1], [8, 0.8], [15, 0.15], [22, 0.22], [29, 0.29], [36, 0.36], [43, 0.43]],
                [[2, 0.2], [9, 0.9], [16, 0.16], [23, 0.23], [30, 0.3], [37, 0.37], [44, 0.44]],
                [[3, 0.3], [10, 0.1], [17, 0.17], [24, 0.24], [31, 0.31], [38, 0.38], [45, 0.45]],
                [[4, 0.4], [11, 0.11], [18, 0.18], [25, 0.25], [32, 0.32], [39, 0.39], [46, 0.46]],
                [[5, 0.5], [12, 0.12], [19, 0.19], [26, 0.26], [33, 0.33], [40, 0.4], [47, 0.47]],
                [[6, 0.6], [13, 0.13], [20, 0.2], [27, 0.27], [34, 0.34], [41, 0.41], [48, 0.48]],
                [[7, 0.7], [14, 0.14], [21, 0.21], [28, 0.28], [35, 0.35], [42, 0.42], [49, 0.49]]];

            const pivotGridOptions = $.extend(true, {
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

        const pivotGrid = createPivotGrid(createPivotGridOptions({ width: 1020, height: 250 }));

        this.clock.tick(10);

        assert.ok(pivotGrid);
        const columnsArea = pivotGrid._columnsArea;

        assert.ok(!columnsArea.hasScroll(), 'no columnAreaScroll');
        assert.ok(columnsArea.getGroupWidth());
        assert.ok(pivotGrid._rowsArea.hasScroll());

        const columnsWidth = sumArray(columnsArea.getColumnsWidth());
        const columnsAreaWidth = getWidth(
            pivotGrid.$element().find('.dx-pivotgrid-horizontal-headers.dx-pivotgrid-area')
        );

        assert.roughEqual(columnsAreaWidth, columnsWidth, 0.2, 'stretched');

        const table = pivotGrid.$element().find('table').first();

        assert.strictEqual(getWidth(table), 1020, 'table width');
    });


    // T651805
    QUnit.test('Stretch columns when scrolling has size and horizontal scrollbar may cause vertical scrollbar', function(assert) {
        const pivotGrid = createPivotGrid({
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
        });

        this.clock.tick(10);
        assert.ok(pivotGrid);
        const columnsArea = pivotGrid._columnsArea;
        assert.ok(!pivotGrid._rowsArea.hasScroll());
        assert.ok(columnsArea.hasScroll());
        assert.roughEqual($(columnsArea._getScrollable().content()).parent().get(0).clientWidth, $(pivotGrid._dataArea._getScrollable().content()).parent().get(0).clientWidth, 0.2, 'stretched');
    });

    QUnit.test('Stretch columns when scrolling has size. Virtual scrolling', function(assert) {
        const createPivotGridOptions = function(options) {
            const rowItems = [
                {
                    value: 'C1', index: 2,
                    children: [{ value: 'P1', index: 0 }, { value: 'P2', index: 1 }]
                }, {
                    value: 'C2', index: 5,
                    children: [{ value: 'P3', index: 3 }, { value: 'P4', index: 4 }]
                }];

            const columnItems = [
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


            const cellSet = [
                [[100000000, 0.1], [8, 0.8], [15, 0.15], [22, 0.22], [29, 0.29], [36, 0.36], [43, 0.43]],
                [[2, 0.2], [9, 0.9], [16, 0.16], [23, 0.23], [30, 0.3], [37, 0.37], [44, 0.44]],
                [[3, 0.3], [10, 0.1], [17, 0.17], [24, 0.24], [31, 0.31], [38, 0.38], [45, 0.45]],
                [[4, 0.4], [11, 0.11], [18, 0.18], [25, 0.25], [32, 0.32], [39, 0.39], [46, 0.46]],
                [[5, 0.5], [12, 0.12], [19, 0.19], [26, 0.26], [33, 0.33], [40, 0.4], [47, 0.47]],
                [[6, 0.6], [13, 0.13], [20, 0.2], [27, 0.27], [34, 0.34], [41, 0.41], [48, 0.48]],
                [[7, 0.7], [14, 0.14], [21, 0.21], [28, 0.28], [35, 0.35], [42, 0.42], [49, 0.49]]];

            const pivotGridOptions = $.extend(true, {
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

        const pivotGrid = createPivotGrid(createPivotGridOptions({ width: 1020, height: 250 }));

        this.clock.tick(10);

        const columnsArea = pivotGrid._columnsArea;
        assert.ok(!columnsArea.hasScroll(), 'no columnAreaScroll');
        assert.ok(pivotGrid._rowsArea.hasScroll());
    });

    QUnit.test('No size reservation for scrolling when changed size to no scroll', function(assert) {
        const createPivotGridOptions = function(options) {
            const rowItems = [
                {
                    value: 'C1', index: 2,
                    children: [{ value: 'P1', index: 0 }, { value: 'P2', index: 1 }]
                }, {
                    value: 'C2', index: 5,
                    children: [{ value: 'P3', index: 3 }, { value: 'P4', index: 4 }]
                }];

            const columnItems = [
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


            const cellSet = [
                [[100000000, 0.1], [8, 0.8], [15, 0.15], [22, 0.22], [29, 0.29], [36, 0.36], [43, 0.43]],
                [[2, 0.2], [9, 0.9], [16, 0.16], [23, 0.23], [30, 0.3], [37, 0.37], [44, 0.44]],
                [[3, 0.3], [10, 0.1], [17, 0.17], [24, 0.24], [31, 0.31], [38, 0.38], [45, 0.45]],
                [[4, 0.4], [11, 0.11], [18, 0.18], [25, 0.25], [32, 0.32], [39, 0.39], [46, 0.46]],
                [[5, 0.5], [12, 0.12], [19, 0.19], [26, 0.26], [33, 0.33], [40, 0.4], [47, 0.47]],
                [[6, 0.6], [13, 0.13], [20, 0.2], [27, 0.27], [34, 0.34], [41, 0.41], [48, 0.48]],
                [[7, 0.7], [14, 0.14], [21, 0.21], [28, 0.28], [35, 0.35], [42, 0.42], [49, 0.49]]];

            const pivotGridOptions = $.extend(true, {
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

        const pivotGrid = createPivotGrid(createPivotGridOptions({ width: 1050, height: 250 }));

        this.clock.tick(10);

        $('#pivotGrid').css({ height: 1000 });
        pivotGrid.updateDimensions();
        this.clock.tick(10);

        assert.ok(pivotGrid);
        const columnsArea = pivotGrid._columnsArea;
        assert.ok(!columnsArea.hasScroll(), 'no columnAreaScroll');
        assert.ok(columnsArea.getGroupWidth());
        assert.ok(!pivotGrid._rowsArea.hasScroll());

        const columnsWidth = sumArray(columnsArea.getColumnsWidth());
        const columnsAreaWidth = getWidth(
            pivotGrid.$element().find('.dx-pivotgrid-horizontal-headers.dx-pivotgrid-area')
        );

        assert.roughEqual(columnsAreaWidth, columnsWidth, 0.2, 'stretched');

        const table = pivotGrid.$element().find('table').first();

        assert.strictEqual(getWidth(table), 1050, 'table width');
    });

    QUnit.test('B253995 - dxPivotGrid height is wrong when rows area has text wrapped to another line', function(assert) {
        const columnItems = [
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


        const cellSet = [
            [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
            [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 100],
            [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 100],
            [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 100],
            [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 100],
            [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 100],
            [300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 100]
        ];

        const pivotGridOptions = {
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

        const pivotGrid = createPivotGrid(pivotGridOptions);
        this.clock.tick(10);
        assert.ok(pivotGrid);
        const getRealHeight = function(element) {
            return window.getComputedStyle ? parseFloat(window.getComputedStyle(element).height) : element.clientHeight;
        };
        assert.ok(Math.abs(getRealHeight(pivotGrid.$element().children()[0]) - 250) <= 1);

        const tableElement = pivotGrid.$element().find('table').first();
        assert.strictEqual(getOuterWidth(tableElement), 500);
        assert.strictEqual(Math.round(getOuterHeight(tableElement)), 250);
    });

    QUnit.test('T510943. Row area width is higher than a container\'s width', function(assert) {
        this.dataSource.fields[0].dataField = 'Big big big big big big big big title';
        const pivotGrid = createPivotGrid({
            dataSource: this.dataSource,
            fieldPanel: {
                visible: true
            },
            width: 150
        });

        this.clock.tick(10);
        const dataArea = pivotGrid._dataArea;
        assert.strictEqual(parseFloat(dataArea.groupElement()[0].style.width).toFixed(2), getWidth(dataArea.tableElement()).toFixed(2));
    });

    QUnit.test('PivotGrid table width should be correct if width is small and fieldPanel is visible', function(assert) {
        const pivotGrid = createPivotGrid({
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
        });

        this.clock.tick(10);

        assert.strictEqual(getWidth($(pivotGrid.element()).find('table').first()), 300);
    });

    QUnit.test('Pivot grid with border', function(assert) {
        const columnItems = [
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


        const cellSet = [
            [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
            [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 100],
            [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 100],
            [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 100],
            [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 100],
            [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 100],
            [300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 100]
        ];

        const pivotGridOptions = {
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

        const pivotGrid = createPivotGrid(pivotGridOptions);
        this.clock.tick(10);

        assert.ok(pivotGrid);
        const getRealHeight = function(element) {
            return window.getComputedStyle ? parseFloat(window.getComputedStyle(element).height) : element.clientHeight;
        };


        const tableElement = pivotGrid.$element().find('table').first();
        assert.strictEqual(getOuterWidth(tableElement), 500);
        assert.ok(Math.abs(getRealHeight(pivotGrid.$element().children()[0]) - 250) <= 1);
        assert.ok(tableElement.hasClass('dx-pivotgrid-border'));
    });

    QUnit.test('Enable borders at runtime', function(assert) {
        const columnItems = [
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


        const cellSet = [
            [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
            [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 100],
            [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 100],
            [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 100],
            [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 100],
            [200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 100],
            [300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 300, 100]
        ];

        const pivotGridOptions = {
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

        const pivotGrid = createPivotGrid(pivotGridOptions);
        this.clock.tick(10);

        pivotGrid.option('showBorders', true);

        assert.ok(pivotGrid);
        const getRealHeight = function(element) {
            return window.getComputedStyle ? parseFloat(window.getComputedStyle(element).height) : element.clientHeight;
        };


        const tableElement = pivotGrid.$element().find('table').first();
        assert.strictEqual(getOuterWidth(tableElement), 500);
        assert.ok(Math.abs(getRealHeight(pivotGrid.$element().children()[0]) - 250) <= 1);
        assert.ok(tableElement.hasClass('dx-pivotgrid-border'));
    });

    QUnit.test('DataController - scrollChanged event', function(assert) {
        const widget = createPivotGrid({
            dataSource: this.testOptions.dataSource,
            width: 200,
            height: 300,
            scrolling: {
                useNative: false
            }
        });
        const dataController = widget._dataController;
        const dataAreaScrollable = widget._dataArea.groupElement().dxScrollable('instance');

        dataController.scrollChanged.fire({
            left: 15,
            top: 10
        });

        widget.updateDimensions();

        this.clock.tick(10);

        assert.strictEqual(dataAreaScrollable.scrollTop(), 10);
        assert.strictEqual(dataAreaScrollable.scrollLeft(), 15);
    });

    // T518378
    QUnit.test('Column area should be visible after change scrolling.mode to virtual', function(assert) {
        const widget = createPivotGrid({
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
        });

        widget.option({
            scrolling: {
                mode: 'virtual'
            }
        });

        assert.ok(getHeight(widget.$element().find('.dx-area-column-cell')) > 0, 'column area is visible');
    });

    // T845487
    QUnit.test('Header cell text should be rendered on the same line with expand icon', function(assert) {
        const pivotGrid = createPivotGrid({
            dataSource: {
                fields: [{
                    dataField: 'field1',
                    area: 'row'
                }, {
                    dataField: 'field2',
                    area: 'row'
                }],
                store: [{
                    field1: 'BigBigBigBigBigWord'
                }]
            }
        }, assert);
        this.clock.tick(10);

        assert.ok(pivotGrid);

        const $headerCellElements = $('#pivotGrid').find('td.dx-pivotgrid-collapsed').eq(0).children();
        assert.strictEqual($headerCellElements.length, 2, 'two header cell elements');

        const expandIconRect = $headerCellElements[0].getBoundingClientRect();
        const textRect = $headerCellElements[1].getBoundingClientRect();

        assert.ok(textRect.top < expandIconRect.bottom, 'elements are on the same line');
        assert.strictEqual(textRect.left, expandIconRect.right, 'text is after expand icon');
    });

    // T878428
    QUnit.test('Sort icon should be correctly positioned when header text was wrapped to the next line', function(assert) {
        const getHeaderElement = () => {
            return $('#pivotGrid').find('.dx-pivotgrid-horizontal-headers td').eq(0);
        };

        createPivotGrid({
            dataSource: {
                fields: [
                    { dataField: 'city', area: 'row' },
                    { dataField: 'price', area: 'data' },
                    { dataField: 'country', area: 'column' }
                ],
                store: [{
                    country: 'United Kingdom',
                    city: 'London'
                }]
            },
            allowSortingBySummary: true,
            width: 200
        }, assert);
        this.clock.tick(10);

        getHeaderElement().trigger('dxcontextmenu');
        $('.dx-context-menu.dx-pivotgrid').find('.dx-menu-item').eq(0).trigger('dxclick');
        this.clock.tick(10);

        const $header = getHeaderElement();
        assert.ok($header.hasClass('dx-pivotgrid-sorted'));
        assert.notEqual($header.find('span').css('display'), 'inline-flex', 'no inline-flex');

        const $sortIcon = $header.find('.dx-icon-sorted');
        const sortIconRect = $sortIcon.get(0).getBoundingClientRect();
        const headerIconRect = $header.get(0).getBoundingClientRect();

        assert.ok(sortIconRect.top > headerIconRect.top, 'top');
        assert.ok(sortIconRect.bottom < headerIconRect.bottom, 'bottom');
        assert.ok(sortIconRect.left > headerIconRect.left, 'left');
        assert.ok(sortIconRect.right < headerIconRect.right, 'right');
    });

    // T889965
    QUnit.test('Summary field text should not be NaN if the only field value is null', function(assert) {
        const customizeTextSpy = sinon.spy(() => 'custom text');

        createPivotGrid({
            dataSource: {
                fields: [
                    { dataField: 'field', area: 'data', summaryType: 'avg', customizeText: customizeTextSpy }
                ],
                store: [{
                    field: NaN
                }]
            },
        }, assert);
        this.clock.tick(10);

        assert.equal(customizeTextSpy.callCount, 1, 'customizeText call count');

        const args = customizeTextSpy.args[0][0];
        // because assert.equal(NaN, NaN) will fail
        const isValueNaN = args.value === args.value;
        const grandTotalText = $('.dx-pivotgrid-area.dx-pivotgrid-area-data').find('.dx-grandtotal').text();

        assert.notOk(isValueNaN, 'grand total value is NaN');
        assert.equal(args.valueText, '', 'grand total valueText');
        assert.equal(grandTotalText, 'custom text', 'grand total field text');
    });
});


QUnit.module('T984139, T1010175', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {
    ['row', 'column'].forEach((area) => {
        [false, true].forEach((useNative) => {

            function getHeaderCellByText($area, text) {
                return $area.find('table:not(.dx-pivot-grid-fake-table) td')
                    .filter((_, el) => { return el.innerText.trim() === text; })
                    .get(0);
            }

            function getArea(pivotGrid, area) {
                const $element = pivotGrid.$element();
                return area === 'row'
                    ? $element.find('.dx-pivotgrid-vertical-headers')
                    : $element.find('.dx-pivotgrid-horizontal-headers');
            }

            function getVerticalOffset(pivotGrid, fromCellText, toCellText) {
                const $rowsHeaderArea = getArea(pivotGrid, 'row');
                const fromCellRect = getHeaderCellByText($rowsHeaderArea, fromCellText).getBoundingClientRect();
                const toCellRect = getHeaderCellByText($rowsHeaderArea, toCellText).getBoundingClientRect();

                return toCellRect.y - fromCellRect.y - 1;
            }

            function getHorizontalOffset(pivotGrid, fromCellText, toCellText) {
                const $columnsHeaderArea = getArea(pivotGrid, 'column');
                const fromCellRect = getHeaderCellByText($columnsHeaderArea, fromCellText).getBoundingClientRect();
                const toCellRect = getHeaderCellByText($columnsHeaderArea, toCellText).getBoundingClientRect();

                return toCellRect.x - fromCellRect.x - 1;
            }

            function checkLeftTopVisibleHeaderCellTexts(pivotGrid, expectedRowHeaderCellText, expectedColHeaderCellText, errorMessageDetails) {
                const $rowsHeaderArea = getArea(pivotGrid, 'row');
                const $columnsHeaderArea = getArea(pivotGrid, 'column');

                const rowsAreaRect = $rowsHeaderArea.get(0).getBoundingClientRect();
                const columnsAreaRect = $columnsHeaderArea.get(0).getBoundingClientRect();

                const expectedRowCellRect = getHeaderCellByText($rowsHeaderArea, expectedRowHeaderCellText).getBoundingClientRect();
                const expectedColumnCellRect = getHeaderCellByText($columnsHeaderArea, expectedColHeaderCellText).getBoundingClientRect();

                QUnit.assert.roughEqual(rowsAreaRect.top, expectedRowCellRect.top, 2, `expected row position ${errorMessageDetails}`);
                // the rendered widget in native mode does not take into account the width of the dataArea scrollbar for the test Render -> scrollTo() -> filter -> clearFilter
                // however, on the test page everything works as expected
                QUnit.assert.roughEqual(columnsAreaRect.left, expectedColumnCellRect.left, isRenovatedScrollable ? 12 : 2, `expected column position ${errorMessageDetails}`);
            }

            function triggerScrollEvent(scrollable) {
                $(scrollable.container()).trigger('scroll');
            }

            function filterPivotGrid(pivotGrid, filterValue, area) {
                const ds = pivotGrid.getDataSource();
                const fieldIndex = area === 'row' ? 1 : 0;
                const fields = ds.fields();
                fields[fieldIndex].filterValues = filterValue;
                ds.fields(fields);
                ds.load();
            }

            QUnit.test(`Render. UseNative: ${useNative}, expandDimension: ${area}`, function(assert) {
                const store = [];
                for(let i = 0; i < 200; i++) {
                    store.push({ row: i + 1, column: i + 1, subField: 1, data: 1 });
                }

                const pivotGrid = createPivotGrid({
                    width: 1000,
                    height: 1000,
                    scrolling: { mode: 'virtual', useNative },
                    dataSource: {
                        store: store,
                        fields: [
                            { dataField: 'column', area: 'column' },
                            { dataField: 'row', area: 'row' },
                            { dataField: 'subField', area: area },
                            { dataField: 'data', area: 'data' }
                        ]
                    }
                });

                this.clock.tick(100);
                checkLeftTopVisibleHeaderCellTexts(pivotGrid, '1', '1', 'after initialization');
            });

            QUnit.test(`Render -> scrollTo(). UseNative: ${useNative}, expandDimension: ${area}`, function(assert) {
                const store = [];
                for(let i = 0; i < 200; i++) {
                    store.push({ row: i + 1, column: i + 1, subField: 1, data: 1 });
                }

                const pivotGrid = createPivotGrid({
                    width: 1000,
                    height: 1000,
                    scrolling: { mode: 'virtual', useNative },
                    dataSource: {
                        store: store,
                        fields: [
                            { dataField: 'column', area: 'column' },
                            { dataField: 'row', area: 'row' },
                            { dataField: 'subField', area: area },
                            { dataField: 'data', area: 'data' }
                        ]
                    }
                });
                this.clock.tick(100);

                const scrollable = pivotGrid._dataArea._getScrollable();
                scrollable.scrollTo({
                    left: getHorizontalOffset(pivotGrid, '1', '60'),
                    top: getVerticalOffset(pivotGrid, '1', '60')
                });
                useNative && triggerScrollEvent(scrollable, this.clock);
                this.clock.tick(100);

                const expectedRowHeaderCellText = '60';
                const expectedColHeaderCellText = '60';
                checkLeftTopVisibleHeaderCellTexts(pivotGrid, expectedRowHeaderCellText, expectedColHeaderCellText, 'after scrolling');
            });

            QUnit.test(`Render -> scrollTo() -> expandHeader. UseNative: ${useNative}, expandDimension: ${area}`, function(assert) {
                const store = [];
                for(let i = 0; i < 200; i++) {
                    store.push({ row: i + 1, column: i + 1, subField: 1, data: 1 });
                }

                const pivotGrid = createPivotGrid({
                    width: 1000,
                    height: 1000,
                    scrolling: { mode: 'virtual', useNative },
                    dataSource: {
                        store: store,
                        fields: [
                            { dataField: 'column', area: 'column' },
                            { dataField: 'row', area: 'row' },
                            { dataField: 'subField', area: area },
                            { dataField: 'data', area: 'data' }
                        ]
                    }
                });

                this.clock.tick(100);

                const scrollable = pivotGrid._dataArea.groupElement().dxScrollable('instance');
                scrollable.scrollTo({
                    left: getHorizontalOffset(pivotGrid, '1', '60'),
                    top: getVerticalOffset(pivotGrid, '1', '60')
                });
                useNative && triggerScrollEvent(scrollable, this.clock);
                this.clock.tick(100);

                const pathToExpand = [65];
                pivotGrid.getDataSource().expandHeaderItem(area, pathToExpand);
                useNative && triggerScrollEvent(scrollable, this.clock);
                this.clock.tick(100);
                const expectedRowHeaderCellText = '60';
                const expectedColHeaderCellText = '60';
                checkLeftTopVisibleHeaderCellTexts(pivotGrid, expectedRowHeaderCellText, expectedColHeaderCellText, 'after expanding');

                const getExpandedCells = () => pivotGrid.$element().find('.dx-pivotgrid-expanded');
                assert.strictEqual(getExpandedCells().length, 2);
            });

            QUnit.test(`Render -> scrollTo() -> expandHeader -> collapseHeader. UseNative: ${useNative}, expandDimension: ${area}`, function(assert) {
                const store = [];
                for(let i = 0; i < 200; i++) {
                    store.push({ row: i + 1, column: i + 1, subField: 1, data: 1 });
                }

                const pivotGrid = createPivotGrid({
                    width: 1000,
                    height: 1000,
                    scrolling: { mode: 'virtual', useNative },
                    dataSource: {
                        store: store,
                        fields: [
                            { dataField: 'column', area: 'column' },
                            { dataField: 'row', area: 'row' },
                            { dataField: 'subField', area: area },
                            { dataField: 'data', area: 'data' }
                        ]
                    }
                });
                this.clock.tick(100);

                const scrollable = pivotGrid._dataArea.groupElement().dxScrollable('instance');
                scrollable.scrollTo({
                    left: getHorizontalOffset(pivotGrid, '1', '60'),
                    top: getVerticalOffset(pivotGrid, '1', '60')
                });
                useNative && triggerScrollEvent(scrollable, this.clock);
                this.clock.tick(100);

                const pathToExpand = [65];
                pivotGrid.getDataSource().expandHeaderItem(area, pathToExpand);
                useNative && triggerScrollEvent(scrollable, this.clock);
                this.clock.tick(100);

                pivotGrid.getDataSource().collapseHeaderItem(area, pathToExpand);
                useNative && triggerScrollEvent(scrollable, this.clock);
                this.clock.tick(100);

                const expectedRowHeaderCellText = '60';
                const expectedColHeaderCellText = '60';
                checkLeftTopVisibleHeaderCellTexts(pivotGrid, expectedRowHeaderCellText, expectedColHeaderCellText, 'after collapsing');
                const getExpandedCells = () => pivotGrid.$element().find('.dx-pivotgrid-expanded');
                assert.strictEqual(getExpandedCells().length, 0);
            });

            QUnit.test(`Render -> scrollTo() -> subField.visible=false. UseNative: ${useNative}, expandDimension: ${area}`, function(assert) {
                const store = [];
                for(let i = 0; i < 200; i++) {
                    store.push({ row: i + 1, column: i + 1, subField: 1, data: 1 });
                }

                const pivotGrid = createPivotGrid({
                    width: 1000,
                    height: 1000,
                    scrolling: { mode: 'virtual', useNative },
                    dataSource: {
                        store: store,
                        fields: [
                            { dataField: 'column', area: 'column' },
                            { dataField: 'row', area: 'row' },
                            { dataField: 'subField', area: area },
                            { dataField: 'subField2', area: area },
                            { dataField: 'data', area: 'data' }
                        ]
                    }
                });
                this.clock.tick(100);

                const scrollable = pivotGrid._dataArea.groupElement().dxScrollable('instance');
                scrollable.scrollTo({
                    left: getHorizontalOffset(pivotGrid, '1', '60'),
                    top: getVerticalOffset(pivotGrid, '1', '60')
                });
                useNative && triggerScrollEvent(scrollable, this.clock);
                this.clock.tick(100);

                const dataSource = pivotGrid.getDataSource();
                dataSource.field('subField', { visible: false });
                dataSource.load();
                useNative && triggerScrollEvent(scrollable, this.clock);
                this.clock.tick(100);

                const expectedRowHeaderCellText = '60';
                const expectedColHeaderCellText = '60';
                checkLeftTopVisibleHeaderCellTexts(pivotGrid, expectedRowHeaderCellText, expectedColHeaderCellText, 'after changing visible to a false value');
            });

            QUnit.test(`Render -> scrollTo() -> subField.visible=false -> subField.visible=true. UseNative: ${useNative}, expandDimension: ${area}`, function(assert) {
                const store = [];
                for(let i = 0; i < 200; i++) {
                    store.push({ row: i + 1, column: i + 1, subField: 1, data: 1 });
                }

                const pivotGrid = createPivotGrid({
                    width: 1000,
                    height: 1000,
                    scrolling: { mode: 'virtual', useNative },
                    dataSource: {
                        store: store,
                        fields: [
                            { dataField: 'column', area: 'column' },
                            { dataField: 'row', area: 'row' },
                            { dataField: 'subField', area: area },
                            { dataField: 'subField2', area: area },
                            { dataField: 'data', area: 'data' }
                        ]
                    }
                });
                this.clock.tick(100);

                const scrollable = pivotGrid._dataArea.groupElement().dxScrollable('instance');
                scrollable.scrollTo({
                    left: getHorizontalOffset(pivotGrid, '1', '60'),
                    top: getVerticalOffset(pivotGrid, '1', '60')
                });
                useNative && triggerScrollEvent(scrollable, this.clock);
                this.clock.tick(100);

                const dataSource = pivotGrid.getDataSource();
                dataSource.field('subField', { visible: false });
                dataSource.load();
                useNative && triggerScrollEvent(scrollable, this.clock);
                this.clock.tick(100);

                dataSource.field('subField', { visible: true });
                dataSource.load();
                useNative && triggerScrollEvent(scrollable, this.clock);
                this.clock.tick(100);
                const expectedRowHeaderCellText = '60';
                const expectedColHeaderCellText = '60';
                checkLeftTopVisibleHeaderCellTexts(pivotGrid, expectedRowHeaderCellText, expectedColHeaderCellText, 'after changing visible to a true value');
            });

            QUnit.test(`Render -> scrollTo() -> filter. UseNative: ${useNative}, expandDimension: ${area}`, function(assert) {
                const store = [];
                for(let i = 0; i < 200; i++) {
                    store.push({ row: i + 1, column: i + 1, subField: 1, data: 1 });
                }

                const pivotGrid = createPivotGrid({
                    width: 1000,
                    height: 1000,
                    scrolling: { mode: 'virtual', useNative },
                    dataSource: {
                        store: store,
                        fields: [
                            { dataField: 'column', area: 'column' },
                            { dataField: 'row', area: 'row' },
                            { dataField: 'subField', area: area },
                            { dataField: 'data', area: 'data' }
                        ]
                    }
                });
                this.clock.tick(100);

                const scrollable = pivotGrid._dataArea.groupElement().dxScrollable('instance');
                scrollable.scrollTo({
                    left: getHorizontalOffset(pivotGrid, '1', '60'),
                    top: getVerticalOffset(pivotGrid, '1', '60')
                });
                useNative && triggerScrollEvent(scrollable, this.clock);
                this.clock.tick(100);

                filterPivotGrid(pivotGrid, [11], area);
                this.clock.tick(100);
                checkLeftTopVisibleHeaderCellTexts(pivotGrid, '11', '11', 'after filtering');
            });

            QUnit.test(`Render -> scrollTo() -> filter -> clearFilter. UseNative: ${useNative}, expandDimension: ${area}`, function(assert) {
                const store = [];
                for(let i = 0; i < 200; i++) {
                    store.push({ row: i + 1, column: i + 1, subField: 1, data: 1 });
                }

                const pivotGrid = createPivotGrid({
                    width: 1000,
                    height: 1000,
                    scrolling: { mode: 'virtual', useNative },
                    dataSource: {
                        store: store,
                        fields: [
                            { dataField: 'column', area: 'column' },
                            { dataField: 'row', area: 'row' },
                            { dataField: 'subField', area: area },
                            { dataField: 'data', area: 'data' }
                        ]
                    }
                });
                this.clock.tick(100);

                const scrollable = pivotGrid._dataArea.groupElement().dxScrollable('instance');
                scrollable.scrollTo({
                    left: getHorizontalOffset(pivotGrid, '1', '60'),
                    top: getVerticalOffset(pivotGrid, '1', '60')
                });
                useNative && triggerScrollEvent(scrollable, this.clock);
                this.clock.tick(100);

                const expectedRowHeaderCellText = '60';
                const expectedColHeaderCellText = '60';

                filterPivotGrid(pivotGrid, [11], area);
                this.clock.tick(100);

                filterPivotGrid(pivotGrid, [], area);
                this.clock.tick(100);
                checkLeftTopVisibleHeaderCellTexts(pivotGrid, expectedRowHeaderCellText, expectedColHeaderCellText, 'after clearing filter');
            });
        });
    });
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
}, () => {

    QUnit.test('pivot grid has correct size', function(assert) {
        const pivotGrid = createPivotGrid($.extend(true, this.testOptions, {
            height: 250,
            width: 1200,
            fieldPanel: {
                allowFieldDragging: false
            }
        }));

        const tableElement = pivotGrid.$element().find('table').first();

        assert.ok(250 - getOuterHeight(tableElement) <= 1 && 250 - getOuterHeight(tableElement) >= 0, 'height');
        assert.strictEqual(getWidth(tableElement), 1200, 'width');
        assert.ok(!pivotGrid.hasScroll('column'), 'stretch to all width');
        assert.ok(pivotGrid.hasScroll('row'));

        const rowFieldsAreaColumnWidth = pivotGrid._rowFields.getColumnsWidth();
        const rowAreaColumnWidth = pivotGrid._rowsArea.getColumnsWidth();
        const baseFieldChooser = pivotGrid.$element().dxPivotGridFieldChooserBase('instance');

        assert.ok(baseFieldChooser, 'BaseFieldChooser is initialized');
        assert.strictEqual(baseFieldChooser.option('dataSource'), pivotGrid.getDataSource(), 'DataSource is passed to baseFieldChooser');
        assert.strictEqual(baseFieldChooser.option('allowFieldDragging'), false, 'allowFieldDragging is passed to fieldChooser');

        assert.deepEqual(rowFieldsAreaColumnWidth, rowAreaColumnWidth, 'rowArea and rowsFields width are synchronized');

        assert.strictEqual($('.dx-pivotgrid-toolbar').parent()[0], pivotGrid.$element().find('.dx-filter-header')[0]);
        assert.ok(pivotGrid.$element().find('.dx-area-description-cell').hasClass('dx-pivotgrid-background'), 'description with background');
        assert.ok(pivotGrid.$element().find('.dx-filter-header').hasClass('dx-bottom-border'));
        assert.ok(pivotGrid.$element().find('.dx-column-header').hasClass('dx-bottom-border'));
    });

    QUnit.test('Column and Filter Headers', function(assert) {
        const pivotGrid = createPivotGrid($.extend(true, this.testOptions, {
        }));

        const tableElement = pivotGrid.$element().find('table').first();

        const columnFieldTextElements = tableElement.find('.dx-column-header').find('.dx-area-field-content');
        const filterFieldTextElements = tableElement.find('.dx-column-header').find('.dx-area-field-content');

        assert.strictEqual(columnFieldTextElements.length, 2);
        assert.strictEqual(columnFieldTextElements[0].offsetWidth, columnFieldTextElements[0].scrollWidth, 'first column field');
        assert.strictEqual(columnFieldTextElements[1].offsetWidth, columnFieldTextElements[1].scrollWidth, 'second column field');

        assert.strictEqual(filterFieldTextElements.length, 2);
        assert.strictEqual(filterFieldTextElements[0].offsetWidth, filterFieldTextElements[0].scrollWidth, 'first column field');
        assert.strictEqual(filterFieldTextElements[1].offsetWidth, filterFieldTextElements[1].scrollWidth, 'second column field');

    });

    QUnit.test('Synchronize rowsFields and row headers', function(assert) {
        this.testOptions.dataSource.fields.push({ area: 'row', caption: 'Row Field 3' });

        const pivotGrid = createPivotGrid(this.testOptions);

        function getColumnWidth($table) {
            const $cols = $table.find('col');
            const result = [];
            $.each($cols, function(_, col) {
                result.push(parseInt(col.style.width, 10));
            });

            return result;
        }

        const rowFieldsAreaColumnWidth = getColumnWidth(pivotGrid._rowFields.tableElement());
        const rowAreaColumnWidth = getColumnWidth(pivotGrid._rowsArea.tableElement());

        assert.strictEqual(rowAreaColumnWidth.length, 3, 'rows area has two columns');
        assert.strictEqual(rowFieldsAreaColumnWidth.length, 3, 'rows area has two columns');

        assert.roughEqual(sumArray(rowAreaColumnWidth), sumArray(rowFieldsAreaColumnWidth), 1);
    });

    QUnit.test('synchronize rowsFields and row headers when rowHeaderLayout is tree', function(assert) {
        this.testOptions.dataSource.fields.push({ area: 'row', caption: 'Row Field 3' });

        this.testOptions.rowHeaderLayout = 'tree';

        const pivotGrid = createPivotGrid(this.testOptions);

        const rowFieldsAreaColumnWidth = pivotGrid._rowFields.getColumnsWidth();
        const rowAreaColumnWidth = pivotGrid._rowsArea.getColumnsWidth();

        assert.strictEqual(rowAreaColumnWidth.length, 2, 'rows area has two columns');
        assert.strictEqual(rowFieldsAreaColumnWidth.length, 3, 'rows area has two columns');

        assert.roughEqual(sumArray(rowAreaColumnWidth), sumArray(rowFieldsAreaColumnWidth), 2);
        assert.ok(rowFieldsAreaColumnWidth[0] - rowAreaColumnWidth[0] > 100);
    });

    QUnit.test('pivot grid has correct height. rowsFields Area > column area', function(assert) {
        const pivotGrid = createPivotGrid($.extend(this.testOptions, {
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
        }));
        const tableElement = pivotGrid.$element().find('table').first();
        assert.ok(150 - getHeight(tableElement) <= 1, 'height');
    });

    QUnit.test('Hide field headers at runtime', function(assert) {
        const pivotGrid = createPivotGrid($.extend(true, this.testOptions, {
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
        }));
        const tableElement = pivotGrid.$element().find('table').first();

        pivotGrid.option({
            fieldPanel: {
                showDataFields: true,
                showColumnFields: false,
                showFilterFields: false,
                showRowFields: true
            }
        });

        assert.ok(250 - getOuterHeight(tableElement) <= 1 && 250 - getOuterHeight(tableElement) >= 0, 'height');
        assert.strictEqual(getWidth(tableElement), 1200, 'width');
        assert.ok(!pivotGrid.hasScroll('column'), 'stretch to all width');
        assert.ok(pivotGrid.hasScroll('row'));

        const rowFieldsAreaColumnWidth = pivotGrid._rowFields.getColumnsWidth();
        const rowAreaColumnWidth = pivotGrid._rowsArea.getColumnsWidth();
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

    QUnit.test('PivotGrid should have correct height if filter fields take several lines', function(assert) {
        const pivotGrid = createPivotGrid($.extend(true, this.testOptions, {
            fieldPanel: {
                showFilterFields: true,
                showRowFields: false,
                showColumnFields: false,
                showDataFields: false
            },
            fieldChooser: {
                enabled: true
            },
            'export': {
                enabled: true
            },
            showBorders: true,
            wordWrapEnabled: true,
            dataSource: {
                fields: [
                    { area: 'row', areaIndex: 0, caption: 'Row Field 1' },
                    { area: 'row', areaIndex: 1, caption: 'Row' },
                    { format: 'decimal', area: 'column', areaIndex: 0, caption: 'Column1' },
                    { area: 'filter', areaIndex: 0, caption: 'Filter 1' },
                    { area: 'filter', areaIndex: 1, caption: 'Filter 2' },
                    { area: 'filter', areaIndex: 2, caption: 'Filter 2' },
                    { area: 'filter', areaIndex: 3, caption: 'Filter 3' },
                    { area: 'filter', areaIndex: 4, caption: 'Filter 4' },
                    { format: { format: 'quarter', dateType: 'full' }, area: 'column', areaIndex: 1, caption: 'Column1' },
                    { caption: 'Sum1', format: 'currency', area: 'data', areaIndex: 0 },
                    { caption: 'Sum2', format: 'percent', area: 'data', areaIndex: 1 }
                ]
            },
            width: 400,
            height: 300
        }));
        const container = pivotGrid.$element().find('.dx-pivotgrid-container').first();

        assert.roughEqual(getHeight(container), 300, 1.01, 'height');
    });

    QUnit.test('PivotGrid should have correct height if filter fields take several lines and pivot has not vertical scroll', function(assert) {
        const pivotGrid = createPivotGrid($.extend(true, this.testOptions, {
            fieldPanel: {
                showFilterFields: true,
                showRowFields: false,
                showColumnFields: false,
                showDataFields: false
            },
            scrolling: {
                useNative: false
            },
            fieldChooser: {
                enabled: true
            },
            'export': {
                enabled: true
            },
            showBorders: true,
            wordWrapEnabled: true,
            dataSource: {
                fields: [
                    { area: 'row', areaIndex: 0, caption: 'Row Field 1' },
                    { area: 'row', areaIndex: 1, caption: 'Row' },
                    { format: 'decimal', area: 'column', areaIndex: 0, caption: 'Column1' },
                    { area: 'filter', areaIndex: 0, caption: 'Filter 1' },
                    { area: 'filter', areaIndex: 1, caption: 'Filter 2' },
                    { area: 'filter', areaIndex: 2, caption: 'Filter 2' },
                    { area: 'filter', areaIndex: 3, caption: 'Filter 3' },
                    { area: 'filter', areaIndex: 4, caption: 'Filter 4' },
                    { format: { format: 'quarter', dateType: 'full' }, area: 'column', areaIndex: 1, caption: 'Column1' },
                    { caption: 'Sum1', format: 'currency', area: 'data', areaIndex: 0 },
                    { caption: 'Sum2', format: 'percent', area: 'data', areaIndex: 1 }
                ]
            },
            width: 400,
            height: 600
        }));
        const container = pivotGrid.$element().find('.dx-pivotgrid-container').first();

        assert.ok(getHeight(container) < 600, 'height');
        assert.ok(!pivotGrid.hasScroll('row'), 'rows area has not scroll');
    });

    QUnit.test('PivotGrid should take into account horizontal scroll height if filter fields take several lines', function(assert) {
        const pivotGrid = createPivotGrid($.extend(true, this.testOptions, {
            fieldPanel: {
                showFilterFields: true,
                showRowFields: false,
                showColumnFields: false,
                showDataFields: false
            },
            scrolling: {
                useNative: false
            },
            fieldChooser: {
                enabled: true
            },
            'export': {
                enabled: true
            },
            showBorders: true,
            wordWrapEnabled: true,
            dataSource: {
                fields: [
                    { area: 'row', areaIndex: 0, caption: 'Row Field 1' },
                    { area: 'row', areaIndex: 1, caption: 'Row' },
                    { format: 'decimal', area: 'column', areaIndex: 0, caption: 'Column1' },
                    { area: 'filter', areaIndex: 0, caption: 'Filter 1' },
                    { area: 'filter', areaIndex: 1, caption: 'Filter 2' },
                    { area: 'filter', areaIndex: 2, caption: 'Filter 2' },
                    { area: 'filter', areaIndex: 3, caption: 'Filter 3' },
                    { area: 'filter', areaIndex: 4, caption: 'Filter 4' },
                    { format: { format: 'quarter', dateType: 'full' }, area: 'column', areaIndex: 1, caption: 'Column1' },
                    { caption: 'Sum1', format: 'currency', area: 'data', areaIndex: 0 },
                    { caption: 'Sum2', format: 'percent', area: 'data', areaIndex: 1 }
                ]
            },
            width: 400,
            height: 600
        }));

        const dataAreaHeight = getHeight(pivotGrid.$element().find('.dx-pivotgrid-area-data'));

        pivotGrid.option({
            scrolling: {
                useNative: true
            }
        });

        const newDataAreaHeight = getHeight(pivotGrid.$element().find('.dx-pivotgrid-area-data'));
        const newRowsAreaHeight = getHeight(
            pivotGrid.$element().find('.dx-pivotgrid-vertical-headers.dx-pivotgrid-area')
        );

        assert.roughEqual(newDataAreaHeight, dataAreaHeight + pivotGrid.__scrollBarWidth, 1);
        assert.roughEqual(newRowsAreaHeight, dataAreaHeight + pivotGrid.__scrollBarWidth, 1);
    });

    QUnit.test('Data and column headers not visible', function(assert) {
        const pivotGrid = createPivotGrid($.extend(true, this.testOptions, {
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
        }));

        assert.ok(pivotGrid.$element().find('.dx-filter-header').hasClass('dx-bottom-border'));
        assert.ok(!pivotGrid.$element().find('.dx-column-header').hasClass('dx-bottom-border'));
    });

    QUnit.test('show borders', function(assert) {
        const pivotGrid = createPivotGrid($.extend(this.testOptions, {
            width: 1200,
            height: 250,
            showBorders: true
        }));
        const tableElement = pivotGrid.$element().find('table').first();

        assert.ok(250 - getOuterHeight(tableElement) <= 1 && 250 - getOuterHeight(tableElement) >= 0, 'height');
        assert.strictEqual(getOuterWidth(tableElement), 1200, 'width');
        assert.ok(!pivotGrid.hasScroll('column'), 'stretch to all width');
        assert.ok(pivotGrid.hasScroll('row'));

        const rowFieldsAreaColumnWidth = pivotGrid._rowFields.getColumnsWidth();
        const rowAreaColumnWidth = pivotGrid._rowsArea.getColumnsWidth();
        assert.deepEqual(rowFieldsAreaColumnWidth, rowAreaColumnWidth, 'rowArea and rowsFields width are synchronized');
    });

    QUnit.test('Fields are draggable', function(assert) {
        const pivotGrid = createPivotGrid($.extend(true, this.testOptions, {
            fieldPanel: {
                allowFieldDragging: true
            }
        }));
        const field = pivotGrid.$element().find('.dx-area-field').first();

        pointerMock(field)
            .start()
            .down()
            .move(-10, -1)
            .move(-20, -1);

        assert.strictEqual($('.dx-drag').length, 1);
    });

    [true, false].forEach(showDataFields => {
        ['standard', 'virtual'].forEach(scrollingMode => {
            [true, false].forEach(useNative => {
                [true, false].forEach(fieldPanelVisible => {
                    QUnit.test(`Data area has correct height. FieldPanel.visible=${fieldPanelVisible}, showDataFields=${showDataFields}, scrollingMode=${scrollingMode},useNative=${useNative} (T933699)`, function(assert) {
                        const clock = sinon.useFakeTimers();
                        const pivotGrid = createPivotGrid({
                            fieldPanel: {
                                visible: fieldPanelVisible,
                                showDataFields: showDataFields
                            },
                            scrolling: {
                                mode: scrollingMode,
                                useNative: useNative
                            },
                            height: 200,
                            dataSource: {
                                fields: [
                                    { dataField: 'row', area: 'row' },
                                    { dataField: 'column', dataType: 'date', area: 'column' },
                                    { dataField: 'value', dataType: 'number', summaryType: 'sum', area: 'data' }
                                ],
                                store: [ { row: 'row', column: '2013/01/06', value: 1 } ]
                            }
                        });

                        clock.tick(10);
                        eventsEngine.trigger(pivotGrid.element(), 'dxresize');

                        const $dataAreaCell = pivotGrid.$element().find(`.${DATA_AREA_CELL_CLASS}`).first();
                        const expectedHeight = fieldPanelVisible ? 31 : 86;
                        assert.roughEqual(getHeight($dataAreaCell), expectedHeight, 1.1, 'data area has correct height');
                        clock.restore();
                    });
                });
            });
        });
    });
});

QUnit.module('Tests with real timer', {}, () => {

    QUnit.test('Do not re-render continuously when virtual scrolling enabled', function(assert) {
        function getRandomStore() {
            function getRandomElement(dim, n) {
                return dim + '_' + Math.floor((Math.random() * n) + 1);
            }

            function getRandomValue() {
                return Math.floor((Math.random() * 1000) + 1);
            }

            const store = [];

            for(let i = 0; i < 1000; i++) {
                store.push({
                    d1: getRandomElement('d1', 5000),
                    d2: getRandomElement('d2', 8),
                    d3: getRandomElement('d3', 8),

                    v1: getRandomValue()
                });
            }
            return store;
        }

        const done = assert.async();
        const pivotGrid = createPivotGrid({
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
        });

        pivotGrid.on('contentReady', function(e) {
            e.component.off('contentReady');
            pivotGrid._dataArea.scrollTo({ x: 600, y: 4000 });

            let contentReadyCount = 0;

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
});

QUnit.module('Tests with stubs', {
    beforeEach: function() {
        const that = this;
        const HorizontalHeadersArea = HeadersAreaModule.HorizontalHeadersArea;
        const VerticalHeadersArea = HeadersAreaModule.VerticalHeadersArea;
        const DataArea = DataAreaModule.DataArea;
        const DataController = DataControllerModule.DataController;

        that.horizontalArea = sinon.createStubInstance(HorizontalHeadersArea);
        that.horizontalArea.tableElement.returns($('<div>'));
        that.horizontalArea.groupElement.returns($('<div>'));
        that.horizontalArea.element.returns($('<div>'));
        that.horizontalArea.on.returns(that.horizontalArea);
        that.horizontalArea.off.returns(that.horizontalArea);

        sinon.stub(HeadersAreaModule, 'HorizontalHeadersArea').callsFake(function() {
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

        sinon.stub(HeadersAreaModule, 'VerticalHeadersArea').callsFake(function() {
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

        sinon.stub(DataAreaModule, 'DataArea').callsFake(function() {
            return that.dataArea;
        });

        const createMockDataSource = function(options) {
            $.each(options.fields || [], function(index, field) {
                field.index = index;
            });

            const stubDataSource = {
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

        sinon.stub(DataControllerModule, 'DataController').callsFake(function(options) {
            const dataController = that.dataController;
            const dataSource = createMockDataSource(options.dataSource);

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
        HeadersAreaModule.HorizontalHeadersArea.restore();
        HeadersAreaModule.VerticalHeadersArea.restore();
        DataAreaModule.DataArea.restore();
        DataControllerModule.DataController.restore();
    }
}, () => {

    QUnit.test('Rows height calculation', function(assert) {
        this.dataArea.getRowsHeight.returns([43, 23, 34, 22, 88, 10]);
        this.verticalArea.getRowsHeight.returns([30, 28, 70, 30]);

        this.dataController.getColumnsInfo.returns([{}, {}]);

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
        });

        assert.deepEqual(this.verticalArea.setRowsHeight.lastCall.args[0], [34, 28, 88, 30]);
        assert.deepEqual(this.dataArea.setRowsHeight.lastCall.args[0], [34, 28, 88, 30]);
    });

    QUnit.test('Rows height calculation when no data', function(assert) {
        this.dataArea.getRowsHeight.returns([43, 23]);
        this.verticalArea.getRowsHeight.returns([30, 28, 70, 30]);

        this.dataController.getColumnsInfo.returns([{}]);

        createPivotGrid(this.testOptions);

        assert.deepEqual(this.verticalArea.setRowsHeight.lastCall.args[0], [30, 28, 70, 30]);
        assert.deepEqual(this.dataArea.setRowsHeight.lastCall.args[0], [30, 28, 70, 30]);
    });

    QUnit.test('Rows height calculation when no data and many header rows', function(assert) {
        this.dataArea.getRowsHeight.returns([43, 23, 34]);
        this.verticalArea.getRowsHeight.returns([30, 28]);

        this.dataController.getColumnsInfo.returns([{}, {}, {}, {}, {}]);

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
        });

        assert.deepEqual(this.verticalArea.setRowsHeight.lastCall.args[0], [30, 28]);
        assert.deepEqual(this.dataArea.setRowsHeight.lastCall.args[0], [30, 28]);
    });

    QUnit.test('columns area row height calculation when description area is big', function(assert) {
        this.dataArea.getRowsHeight.returns([20, 8, 34, 22, 88, 10]);
        this.verticalArea.getRowsHeight.returns([30, 28, 70, 30]);

        this.dataController.getColumnsInfo.returns([{}, {}]);
        const pivot = createPivotGrid({
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
        });

        const tableElement = pivot.$element().find('table').first();
        const descriptionCell = tableElement.find('.dx-area-description-cell');

        setHeight(descriptionCell, 80);

        const delta = (getOuterHeight(descriptionCell[0], true) - 28) / 2;

        pivot.updateDimensions();

        assert.deepEqual(this.horizontalArea.setRowsHeight.lastCall.args[0], [20 + delta, 8 + delta]);

        assert.deepEqual(this.verticalArea.setRowsHeight.lastCall.args[0], [34, 28, 88, 30]);
        assert.deepEqual(this.dataArea.setRowsHeight.lastCall.args[0], [34, 28, 88, 30]);
    });

    QUnit.test('columns area row height calculation when description area is small', function(assert) {
        this.dataArea.getRowsHeight.returns([20, 8, 34, 22, 88, 10]);
        this.verticalArea.getRowsHeight.returns([30, 28, 70, 30]);

        this.dataController.getColumnsInfo.returns([{}, {}]);
        const pivot = createPivotGrid({
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
        });

        const tableElement = pivot.$element().find('table').first();
        setHeight(tableElement.find('.dx-area-description-cell'), 25);

        pivot.updateDimensions();

        assert.ok(!this.horizontalArea.setRowsHeight.called);
        assert.deepEqual(this.verticalArea.setRowsHeight.lastCall.args[0], [34, 28, 88, 30]);
        assert.deepEqual(this.dataArea.setRowsHeight.lastCall.args[0], [34, 28, 88, 30]);
    });

    QUnit.test('Virtual Scrolling', function(assert) {
        this.dataArea.getColumnsWidth.returns([20, 40, 60, 20]);
        this.dataArea.getRowsHeight.returns([43, 23, 34]);
        this.dataArea.getScrollableDirection.returns('both');
        this.verticalArea.getRowsHeight.returns([30, 28]);

        this.horizontalArea.groupElement().height(25);

        this.dataController.calculateVirtualContentParams.returns({
            width: 2000,
            height: 1000,
            contentLeft: 30,
            contentTop: 15
        });

        createPivotGrid({
            dataSource: this.testOptions.dataSource,
            height: 300,
            scrolling: {
                mode: 'virtual'
            }
        });

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

        assert.ok(this.dataArea.updateScrollableOptions.calledAfter(this.horizontalArea.setVirtualContentParams));
        assert.deepEqual(this.dataArea.updateScrollableOptions.lastCall.args[0], {
            direction: 'both',
            rtlEnabled: false,
        });
        assert.strictEqual(this.dataArea.setGroupHeight.lastCall.args[0], 71);
        assert.strictEqual(this.verticalArea.setGroupHeight.lastCall.args[0], 71);
        assert.ok(!this.dataController.subscribeToWindowScrollEvents.called);

    });

    QUnit.test('Virtual Scrolling. Widget height is not defined', function(assert) {
        this.dataArea.getColumnsWidth.returns([20, 40, 60, 20]);
        this.dataArea.getRowsHeight.returns([43, 23, 34]);
        this.dataArea.getScrollableDirection.returns('both');
        this.verticalArea.getRowsHeight.returns([30, 28]);

        this.horizontalArea.groupElement().height(25);

        this.dataController.calculateVirtualContentParams.returns({
            width: 2000,
            height: 1000,
            contentLeft: 30,
            contentTop: 15
        });

        createPivotGrid({
            dataSource: this.testOptions.dataSource,
            scrolling: {
                mode: 'virtual'
            }
        });

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
            viewportHeight: getOuterHeight($(window)),
            viewportWidth: 899,
            virtualColumnWidth: 100,
            virtualRowHeight: 50
        });

        assert.ok(this.dataArea.updateScrollableOptions.calledAfter(this.horizontalArea.setVirtualContentParams));
        assert.deepEqual(this.dataArea.updateScrollableOptions.lastCall.args[0], {
            direction: 'both',
            rtlEnabled: false,
        });

        assert.strictEqual(this.dataArea.setGroupHeight.lastCall.args[0], 'auto');
        assert.strictEqual(this.verticalArea.setGroupHeight.lastCall.args[0], 'auto');

        assert.ok(this.dataController.subscribeToWindowScrollEvents.called);
        assert.strictEqual(this.dataController.subscribeToWindowScrollEvents.lastCall.args[0], this.dataArea.groupElement());
    });

    QUnit.test('DataController creation', function(assert) {
        const texts = {
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
        });

        assert.ok(DataControllerModule.DataController.calledWithNew);
        assert.ok(DataControllerModule.DataController.calledOnce);

        const dataControllerOptions = DataControllerModule.DataController.lastCall.args[0];

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
        const texts = {
            collapseAll: 'CollapseAll',
            expandAll: 'ExpandAll',
            grandTotal: 'GrandTotal',
            noData: 'NoData',
            removeAllSorting: 'RemoveAllSorting',
            showFieldChooser: 'ShowFieldChooser',
            sortColumnBySummary: 'SortColumnBySummary',
            sortRowBySummary: 'SortRowBySummary',
            total: 'Total'
        };
        const widget = createPivotGrid({
            dataSource: this.testOptions.dataSource,
            showColumnGrandTotals: 'customShowColumnGrandTotals',
            showColumnTotals: 'customShowColumnTotals',
            showRowGrandTotals: 'customShowRowGrandTotals',
            showRowTotals: 'customShowRowGrandTotals',
            showTotalsPrior: 'customShowTotalOnTop',
            rowHeaderLayout: 'standard',
            texts: texts
        });

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

        assert.ok(DataControllerModule.DataController.calledWithNew);
        assert.ok(DataControllerModule.DataController.calledOnce);

        const dataController = DataControllerModule.DataController.lastCall.returnValue;
        const dataControllerOptions = dataController.updateViewOptions.lastCall.args[0];

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
    const component = getStubComponent(componentOptions);
    if(!isVertical) {
        return new HeadersAreaModule.HorizontalHeadersArea(component);
    } else {
        return new HeadersAreaModule.VerticalHeadersArea(component);
    }
}

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
}, () => {
    // B235127
    QUnit.test('getColumnWidths', function(assert) {
        const headersArea = createHeadersArea();
        const testElement = $('#pivotArea');

        headersArea.render(testElement, [
            [{ text: '1' }, { text: '12', rowspan: 2 }, { text: '123', colspan: 2 }],
            [{ text: '1234' }, { text: '12345' }, { text: '123456' }]
        ]);
        const table = testElement.find('table');
        const rows = table[0].rows;

        const columnWidths = headersArea.getColumnsWidth();

        assert.equal(columnWidths.length, 4);
        assert.equal(columnWidths[0], getRealElementWidth(rows[1].cells[0]));
        assert.equal(columnWidths[1], getRealElementWidth(rows[0].cells[1]));
        assert.equal(columnWidths[2], getRealElementWidth(rows[1].cells[1]));
        assert.equal(columnWidths[3], getRealElementWidth(rows[1].cells[2]));
    });

    QUnit.test('Headers area render', function(assert) {
        const headersArea = createHeadersArea();
        const testElement = $('#pivotArea');

        headersArea.render(testElement, this.headers);
        const table = testElement.find('table');
        const rows = table[0].rows;

        assert.equal(table.length, 1, 'tables count');
        assert.equal(rows.length, 2, 'rows count');
        assert.equal(rows[0].cells.length, 2, 'row1 cells count');
        assert.equal(rows[1].cells.length, 2, 'row2 cells count');

        assert.equal($(rows[0].cells[0]).text(), 'A', 'cell 1 - text');
        assert.equal($(rows[0].cells[0]).attr('colspan'), '2', 'cell 1 - colspan attribute');

        assert.equal($(rows[0].cells[1]).text(), 'Grand total', 'cell 2 - text');
        assert.equal($(rows[0].cells[1]).attr('rowspan'), '2', 'cell 2 - rowspan attribute');
        assert.ok($(rows[0].cells[1]).hasClass('dx-grandtotal'), 'cell 2 - grand total style');

        assert.equal($(rows[1].cells[0]).text(), '1', 'cell 3 - text');

        assert.equal($(rows[1].cells[1]).text(), '2', 'cell 3 - text');
    });

    QUnit.test('Headers area render. Wordwrapping in cell', function(assert) {
        const headersArea = createHeadersArea();
        const testElement = $('#pivotArea');

        headersArea.render(testElement, [
            [{ text: 'A', colspan: 2, expanded: true, type: 'D', path: ['A'] }, { text: 'Grand total', rowspan: 2, index: 2, type: 'GT', wordWrapEnabled: false }],
            [{ text: '1', index: 0, type: 'D', expanded: false, path: ['1'], wordWrapEnabled: true }, { text: '2', index: 1, type: 'D' }]
        ]);
        const table = testElement.find('table');
        const rows = table[0].rows;

        assert.equal($(rows[0].cells[1]).find('span').get(0).style.whiteSpace, 'nowrap', 'cell 2 (GrandTotal)');
        assert.equal($(rows[1].cells[0]).find('span').get(1).style.whiteSpace, 'normal', 'cell 3 (1)');
        assert.equal($(rows[1].cells[1]).find('span').get(0).style.whiteSpace, '', 'cell 4 (2)');
    });

    QUnit.test('apply cell width', function(assert) {
        const headersArea = createHeadersArea();
        const testElement = $('#pivotArea');

        this.headers[0][0].width = 700;

        headersArea.render(testElement, this.headers);
        const table = testElement.find('table');
        const rows = table[0].rows;

        assert.equal($(rows[0].cells[0]).css('min-width'), '700px', 'cell 1 - has correct width');
    });

    QUnit.test('Headers area rerender', function(assert) {
        const headersArea = createHeadersArea();
        const testElement = $('#pivotArea');
        let tableElement;

        headersArea.render(testElement, this.headers);
        tableElement = testElement.find('table');

        assert.equal(tableElement.length, 1, '1 render - headers element count');
        assert.equal(tableElement[0].rows.length, 2, '1 render - rows count');
        assert.equal(tableElement[0].rows[0].cells.length, 2, '1 render - row1 cells count');
        assert.equal(tableElement[0].rows[1].cells.length, 2, '1 render - row1 cells count');

        headersArea.render(testElement, this.headers);
        tableElement = testElement.find('table');

        assert.equal(tableElement.length, 1, '1 render - headers element count');
        assert.equal(tableElement[0].rows.length, 2, '1 render - rows count');
        assert.equal(tableElement[0].rows[0].cells.length, 2, '1 render - row1 cells count');
        assert.equal(tableElement[0].rows[1].cells.length, 2, '1 render - row1 cells count');
    });

    QUnit.test('Apply css classes by horizontal orientation', function(assert) {
        const headersArea = createHeadersArea();
        const testElement = $('#pivotArea');

        headersArea.render(testElement, this.headers);

        assert.equal(testElement.find('div.dx-pivotgrid-horizontal-headers').length, 1, 'horizontal headers');
    });

    // B232782
    QUnit.test('Apply borders right style for last cells', function(assert) {
        const headersArea = createHeadersArea();
        const testElement = $('#pivotGrid');

        function getLastCellText(row) {
            const childNodes = row.cells[row.cells.length - 1].childNodes;
            return $(childNodes[childNodes.length - 1]).text();
        }
        function getLastCellRightBorderWidth(row) {
            return row.cells[row.cells.length - 1].style.borderRightWidth;
        }

        headersArea.render(testElement, [
            [{ text: 'A', colspan: 2, expanded: true, type: 'D' }, { text: 'Grand total', rowspan: 2, type: 'GT' }],
            [{ text: '1', rowspan: 2, type: 'D', expanded: false }, { text: '2', colspan: 2, type: 'D', expanded: true }],
            [{ text: '21', type: 'D' }, { text: '22', type: 'D' }]
        ]);

        const rows = testElement.find('table')[0].rows;

        assert.equal(getLastCellText(rows[0]), 'Grand total', '1 row last cell - text');
        assert.equal(getLastCellRightBorderWidth(rows[0]), '0px', '1 row last cell - border right');

        assert.equal(getLastCellText(rows[1]), '2', '2 row last cell - text');
        assert.equal(getLastCellRightBorderWidth(rows[1]), '0px', '2 row last cell - border right');

        assert.equal(getLastCellText(rows[2]), '22', '3 row last cell - text');
        assert.equal(getLastCellRightBorderWidth(rows[2]), '0px', '3 row last cell - border right');
    });

    QUnit.test('Set border bottom width to zero for all cells in a last row', function(assert) {
        const headersArea = createHeadersArea();
        const testElement = $('#pivotArea');

        headersArea.render(testElement, [
            [{ text: 'A', colspan: 2, expanded: true, type: 'D' }, { text: 'Grand total', rowspan: 2, type: 'GT' }],
            [{ text: '1', rowspan: 2, type: 'D', expanded: false }, { text: '2', colspan: 2, type: 'D', expanded: true }],
            [{ text: '21', type: 'D' }, { text: '22', type: 'D' }]
        ]);
        const rows = testElement.find('tr');

        assert.equal($(rows[1].cells[0]).text(), '1', 'row 1 cell 0 text');
        assert.equal($(rows[1].cells[0]).css('borderBottomWidth'), '0px', 'row 1 cell 0 border-bottom-width style');
        assert.equal($(rows[2].cells[0]).text(), '21', 'row 2 cell 0 text');
        assert.equal($(rows[2].cells[0]).css('borderBottomWidth'), '0px', 'row 2 cell 0 border-bottom-width style');
        assert.equal($(rows[2].cells[1]).text(), '22', 'row 2 cell 1 text');
        assert.equal($(rows[2].cells[1]).css('borderBottomWidth'), '0px', 'row 2 cell 1 border-bottom-width style');
    });

    QUnit.test('Add the verticalScroll css style when pivot grid has a vertical scrollbar', function(assert) {
        const headersArea = createHeadersArea();
        const testElement = $('#pivotArea');

        headersArea.render(testElement, [
            [{ text: 'A', colspan: 2, expanded: true, type: 'D' }, { text: 'Grand total', rowspan: 2, type: 'GT' }],
            [{ text: '1', rowspan: 2, type: 'D', expanded: false }, { text: '2', colspan: 2, type: 'D', expanded: true }],
            [{ text: '21', type: 'D' }, { text: '22', type: 'D' }]
        ]);
        headersArea.renderScrollable();
        headersArea.processScrollBarSpacing(17);

        assert.ok(headersArea._groupElement.hasClass('dx-vertical-scroll'), 'style for vertical scrollbar');
        assert.strictEqual(headersArea.tableElement().siblings().length, 0);
    });

    QUnit.test('Remove the verticalScroll css style when pivot grid has no a vertical scrollbar more', function(assert) {
        const headersArea = createHeadersArea();
        const testElement = $('#pivotArea');

        headersArea.render(testElement, [
            [{ text: 'A', colspan: 2, expanded: true, type: 'D' }, { text: 'Grand total', rowspan: 2, type: 'GT' }],
            [{ text: '1', rowspan: 2, type: 'D', expanded: false }, { text: '2', colspan: 2, type: 'D', expanded: true }],
            [{ text: '21', type: 'D' }, { text: '22', type: 'D' }]
        ]);
        headersArea.renderScrollable();
        headersArea.processScrollBarSpacing(17);
        headersArea.processScrollBarSpacing(0);

        assert.ok(!headersArea._groupElement.hasClass('dx-vertical-scroll'), 'style for vertical scrollbar');
    });

    QUnit.test('Default float alignment of a group element with scroll spacing', function(assert) {
        const headersArea = createHeadersArea();
        const testElement = $('#pivotArea');

        headersArea.render(testElement, [
            [{ text: 'A', colspan: 2, expanded: true, type: 'D' }, { text: 'Grand total', rowspan: 2, type: 'GT' }],
            [{ text: '1', rowspan: 2, type: 'D', expanded: false }, { text: '2', colspan: 2, type: 'D', expanded: true }],
            [{ text: '21', type: 'D' }, { text: '22', type: 'D' }]
        ]);
        headersArea.renderScrollable();
        headersArea.processScrollBarSpacing(17);

        assert.equal(headersArea._groupElement.css('float'), 'left', 'Align by the left');
    });

    QUnit.test('Set correct float alignment of a group element when pivot grid render with RTL layout and scroll spacing', function(assert) {
        const headersArea = createHeadersArea(null, false, { rtlEnabled: true });
        const testElement = $('#pivotArea');

        headersArea.render(testElement, [
            [{ text: 'A', colspan: 2, expanded: true, type: 'D' }, { text: 'Grand total', rowspan: 2, type: 'GT' }],
            [{ text: '1', rowspan: 2, type: 'D', expanded: false }, { text: '2', colspan: 2, type: 'D', expanded: true }],
            [{ text: '21', type: 'D' }, { text: '22', type: 'D' }]
        ]);
        headersArea.renderScrollable();
        headersArea.processScrollBarSpacing(17);

        assert.equal(headersArea._groupElement.css('float'), 'right', 'Align by the right');
    });

    QUnit.test('EncodeHtml is enabled', function(assert) {
        const headersArea = createHeadersArea(null, false, {
            encodeHtml: true
        });
        const testElement = $('#pivotArea');

        headersArea.render(testElement, [
            [{ text: '<b>A</b>', colspan: 2, expanded: true, type: 'D' }, { text: 'Grand total', rowspan: 2, type: 'GT' }],
            [{ text: '1', rowspan: 2, type: 'D', expanded: false }, { text: '<h1>2</h1>', colspan: 2, type: 'D', expanded: true }],
            [{ text: '21', type: 'D' }, { text: '22', type: 'D' }]
        ]);

        const $cells = testElement.find('td');
        assert.equal(testElement.find('b').length, 0, 'bold tegs count');
        assert.equal($cells.eq(0).children().eq(1).text(), '<b>A</b>', 'cell 0 text');
        assert.equal(testElement.find('h1').length, 0, 'header 1 tegs count');
        assert.equal($cells.eq(3).children().eq(1).text(), '<h1>2</h1>', 'cell 3 text');
    });

    QUnit.test('EncodeHtml is disabled', function(assert) {
        const headersArea = createHeadersArea();
        const testElement = $('#pivotArea');

        headersArea.render(testElement, [
            [{ text: '<b>A</b>', colspan: 2, expanded: true, type: 'D' }, { text: 'Grand total', rowspan: 2, type: 'GT' }],
            [{ text: '1', rowspan: 2, type: 'D', expanded: false }, { text: '<h1>2</h1>', colspan: 2, type: 'D', expanded: true }],
            [{ text: '21', type: 'D' }, { text: '22', type: 'D' }]
        ]);

        assert.equal(testElement.find('b').length, 1, 'bold tegs count');
        assert.equal(testElement.find('b').text(), 'A', 'bold teg text');
        assert.equal(testElement.find('h1').length, 1, 'header 1 tegs count');
        assert.equal(testElement.find('h1').text(), '2', 'header teg text');
    });

    QUnit.test('Render when virtual scrolling is enabled', function(assert) {
        const area = createHeadersArea(undefined, undefined, {
            'scrolling.mode': 'virtual'
        });
        const testElement = $('#pivotArea');

        area.render(testElement, []);

        assert.strictEqual(area.tableElement().siblings().length, 1);
        const virtualContent = area.tableElement().next();
        assert.ok(!virtualContent.is(':visible'));
    });

    QUnit.test('get scroll path with virtual scrolling. Horizontal', function(assert) {
        const area = createHeadersArea(undefined, false, {
            'scrolling.mode': 'virtual'
        });
        const testElement = $('#pivotGrid').addClass('dx-pivotgrid').addClass('dx-virtual-mode');

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

        const columnWidths = area.getColumnsWidth();

        const path = area.getScrollPath(350 + columnWidths[0] + columnWidths[1] + 3);

        assert.deepEqual(path, ['Grand Total']);
    });

    QUnit.test('get scroll path with virtual scrolling. Vertical', function(assert) {
        const area = createHeadersArea(undefined, true, {
            'scrolling.mode': 'virtual'
        });
        const testElement = $('#pivotGrid').addClass('dx-pivotgrid').addClass('dx-virtual-mode');

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

        const columnHeights = area.getRowsHeight();

        const path = area.getScrollPath(500 + columnHeights[0] + columnHeights[1] + 3);

        assert.deepEqual(path, ['22']);
    });

    QUnit.test('setVirtualContentParams. Horizontal headers', function(assert) {
        const area = createHeadersArea(undefined, false, {
            'scrolling.mode': 'virtual'
        });
        const testElement = $('#pivotGrid').addClass('dx-pivotgrid').addClass('dx-virtual-mode');

        area.render(testElement, []);

        area.setVirtualContentParams({
            left: 10,
            top: 100,
            width: 500,
            height: 250
        });

        const virtualContent = area.tableElement().prev();

        assert.strictEqual(area.tableElement().css('position'), 'absolute');
        assert.strictEqual(area.tableElement().css('left'), '10px');
        assert.strictEqual(area.tableElement().css('top'), '0px');

        assert.strictEqual(virtualContent.css('display'), 'block');
        assert.strictEqual(virtualContent.css('width'), '500px');
        assert.strictEqual(virtualContent.css('height'), '250px');
    });

    QUnit.test('setVirtualContentParams. Horizontal headers. Disabled virtual mode', function(assert) {
        const area = createHeadersArea(undefined, false, {
            'scrolling.mode': 'virtual'
        });
        const testElement = $('#pivotGrid').addClass('dx-pivotgrid').addClass('dx-virtual-mode');

        area.render(testElement, []);
        area.setVirtualContentParams({
            left: 10,
            top: 100,
            width: 500,
            height: 250
        });

        area.disableVirtualMode();

        const virtualContent = area.tableElement().prev();

        assert.strictEqual(area.tableElement().css('position'), 'static');

        assert.strictEqual(virtualContent.css('display'), 'none');
        assert.strictEqual(virtualContent.css('width'), '500px');
        assert.strictEqual(virtualContent.css('height'), '250px');
    });

    QUnit.test('scrollTo with virtual scrolling', function(assert) {
        const testElement = $('#pivotGrid').addClass('dx-pivotgrid');
        const area = createHeadersArea(undefined, undefined, {
            'scrolling.mode': 'virtual'
        });

        area.render(testElement, this.headers);

        area.setVirtualContentParams({
            left: 1000,
            width: 3000,
            height: 300
        });

        area.renderScrollable();

        area.setColumnsWidth([100, 120, 300]);
        area.setGroupWidth(200);

        area._getScrollable().update();

        function assertFakeTable(scrollPos, expectedOffset, expectedVisibility) {
            area.scrollTo(scrollPos);
            const fakeTable = $('#pivotGrid').find('.dx-virtual-content > table').first();

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
}, () => {

    QUnit.test('Apply css class by vertical orientation', function(assert) {
        const headersArea = createHeadersArea(null, true);
        const testElement = $('#pivotArea');

        headersArea.render(testElement, this.data);

        assert.equal(testElement.find('div.dx-pivotgrid-vertical-headers').length, 1, 'vertical headers');
    });

    QUnit.test('Expand border when expanded items count is one', function(assert) {
        const headersArea = createHeadersArea(null, true);
        const testElement = $('#pivotArea');

        headersArea.render(testElement, [
            [{ text: 'A', colspan: 2, expanded: false, type: 'D', path: ['A'] }],
            [{ text: 'B', type: 'D', expanded: true }, { text: 'B1', type: 'D' }]
        ]);

        assert.equal(testElement.find('div.dx-pivotgrid-vertical-headers').length, 1, 'vertical headers');
        assert.ok(!testElement.find('tr').eq(0).hasClass('dx-expand-border'), 'not expanded row not has expand border class');
        assert.ok(testElement.find('tr').eq(1).hasClass('dx-expand-border'), 'expanded row has expand border class');
    });

    QUnit.test('Render sorted cell', function(assert) {
        const headersArea = createHeadersArea(null, true);
        const testElement = $('#pivotArea');

        headersArea.render(testElement, [
            [{ text: 'A', colspan: 2, expanded: false, type: 'D', path: ['A'], sorted: true }],
            [{ text: 'B', type: 'D', expanded: true }, { text: 'B1', type: 'D' }]
        ]);

        assert.ok(testElement.find('tr').eq(0).children(0).hasClass('dx-pivotgrid-sorted'));
        assert.strictEqual(testElement.find('tr').eq(0).children(0).find('.dx-icon-sorted').length, 1);
        assert.ok(!testElement.find('tr').eq(1).children(1).hasClass('dx-pivotgrid-sorted'));
    });

    QUnit.test('setVirtualContentParams. Vertical headers', function(assert) {
        const area = createHeadersArea(undefined, true, {
            'scrolling.mode': 'virtual'
        });
        const testElement = $('#pivotGrid').addClass('dx-pivotgrid').addClass('dx-virtual-mode');

        area.render(testElement, []);
        area.setVirtualContentParams({
            left: 10,
            top: 100,
            width: 500,
            height: 250
        });

        const virtualContent = area.tableElement().prev();

        assert.strictEqual(area.tableElement().css('position'), 'absolute');
        assert.strictEqual(area.tableElement().css('left'), '0px');
        assert.strictEqual(area.tableElement().css('top'), '100px');

        assert.strictEqual(virtualContent.css('display'), 'block');
        assert.strictEqual(virtualContent.css('width'), '500px');
        assert.strictEqual(virtualContent.css('height'), '250px');
    });

    QUnit.test('scrollTo with virtual scrolling', function(assert) {
        const testElement = $('#pivotGrid').addClass('dx-pivotgrid');
        const area = createHeadersArea(undefined, true, {
            'scrolling.mode': 'virtual'
        });

        area.render(testElement, this.data);

        area.setVirtualContentParams({
            top: 1000,
            width: 300,
            height: 3000
        });

        area.renderScrollable();

        area.setRowsHeight([100, 120, 300]);
        area.setGroupHeight(300);

        area._getScrollable().update();

        function assertFakeTable(scrollPos, expectedOffset, expectedVisibility) {
            area.scrollTo(scrollPos);
            const fakeTable = $('#pivotGrid').find('.dx-virtual-content > table').first();

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
        const testElement = $('#pivotGrid').addClass('dx-pivotgrid');
        const area = createHeadersArea(undefined, true, {

        });
        const scrollHandler = sinon.stub();

        area.render(testElement, this.data);

        area.renderScrollable();

        area.setGroupHeight(300);
        area.setRowsHeight([100, 120, 300]);

        area._getScrollable().update();

        area.on('scroll', scrollHandler);

        area.scrollTo({ top: 10 });

        assert.strictEqual(scrollHandler.callCount, 1);
        assert.strictEqual(scrollHandler.lastCall.args[0].scrollOffset.top, 10);
    });

    QUnit.test('unsubscribe to scroll events', function(assert) {
        const testElement = $('#pivotGrid').addClass('dx-pivotgrid');
        const area = createHeadersArea(undefined, true, {

        });
        const scrollHandler = sinon.stub();

        area.render(testElement, this.data);

        area.renderScrollable();

        area.setRowsHeight([100, 120, 300]);
        area.setGroupHeight(300);

        area._getScrollable().update();

        area.on('scroll', scrollHandler);
        area.off('scroll', scrollHandler);

        area.scrollTo({ top: 10 });

        assert.strictEqual(scrollHandler.callCount, 0);
    });

    QUnit.test('Set column width', function(assert) {
        const headersArea = createHeadersArea(null, true);

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
        const headersArea = createHeadersArea(null, true);

        $('#pivotArea').css({ 'transform': 'scale(0.5, 0.5)' });

        headersArea.render($('#pivotArea'), this.data);

        function setColumnWidth(widthArray) {
            headersArea.setColumnsWidth(widthArray);
            return headersArea.getColumnsWidth();
        }

        assert.deepEqual(setColumnWidth([40, 50, 30, 60]), [40, 50, 30, 60]);
    });

    QUnit.test('Set row height in container with transform', function(assert) {
        const headersArea = createHeadersArea(null, true);

        $('#pivotArea').css({ 'transform': 'scale(0.5, 0.5)' });

        headersArea.render($('#pivotArea'), this.data);

        function setRowsHeight(widthArray) {
            headersArea.setRowsHeight(widthArray);
            return headersArea.getRowsHeight();
        }

        assert.deepEqual(setRowsHeight([40, 50, 60, 70]), [40, 50, 60, 70]);
    });

    // T696415
    QUnit.skip('headers and data columns has same width', function(assert) {
        const fields = [
            { area: 'row', dataField: 'row1' },
            { area: 'column', dataField: 'col1' }
        ];
        for(let i = 0; i <= 500; i++) {
            fields.push({ area: 'data', width: 56.296 + (i / 100), summaryType: 'count', dataType: 'number' });
        }
        const grid = $('#pivotGrid').dxPivotGrid({
            showBorders: true,
            width: 500,
            scrolling: {
                useNative: true
            },
            dataSource: {
                fields: fields,
                store: [
                    { row1: 'r1', col1: 'c1' }
                ]
            }
        }).dxPivotGrid('instance');
        this.clock.tick(10);
        grid.$element().css('zoom', 1.35);
        grid.repaint();

        const columnsWidth = grid._columnsArea.getColumnsWidth();
        const dataWidth = grid._dataArea.getColumnsWidth();
        assert.deepEqual(columnsWidth, dataWidth);
    });

    function needRunZoomTest() {
        const isNoJquery = !config().useJQuery;
        const isNewJQuery = parseInt($.fn.jquery) >= 3;
        return isNoJquery || isNewJQuery;
    }

    if(needRunZoomTest()) {
        ['standard', 'virtual'].forEach(scrollingMode => {
            [true, false].forEach(useNative => {
                QUnit.test(`No extra scrollbar on zoom, useNative=${useNative}, scrollingMode=${scrollingMode} (T914454)`, function(assert) {
                    const grid = $('#pivotGrid').dxPivotGrid({
                        showBorders: true,
                        width: 500,
                        scrolling: {
                            mode: scrollingMode,
                            useNative: useNative
                        },
                        dataSource: {
                            fields: [
                                { area: 'row', dataField: 'row1' },
                                { area: 'column', dataField: 'col1' },
                                { area: 'data', width: 56.296, summaryType: 'count', dataType: 'number' },
                                { area: 'data', width: 56.296, summaryType: 'count', dataType: 'number' },
                            ],
                            store: [
                                { row1: 'r1', col1: 'c1' }
                            ]
                        }
                    }).dxPivotGrid('instance');
                    this.clock.tick(10);

                    grid.$element().css('zoom', 1.35);
                    grid.repaint();

                    const containerWidth = grid._dataArea.element().find('.dx-scrollable-container').get(0).getBoundingClientRect().width;
                    const contentWidth = grid._dataArea.element().find('.dx-scrollable-content').last().get(0).getBoundingClientRect().width;
                    assert.roughEqual(containerWidth, contentWidth, 0.03, `containerWidth = ${containerWidth}, contentWidth=${contentWidth}`);
                });
            });
        });
    }

    QUnit.test('Update colspans. when new columns count greater than headers area have', function(assert) {
        const headersArea = createHeadersArea(null, true);

        headersArea.render($('#pivotArea'), this.data);

        headersArea.updateColspans(10);

        const $lastCells = headersArea.tableElement().find('.dx-last-cell');

        assert.strictEqual($lastCells.length, 4);
        assert.strictEqual($lastCells.get(0).colSpan, 7);
        assert.strictEqual($lastCells.get(1).colSpan, 7);

        assert.strictEqual($lastCells.get(2).colSpan, 8);
        assert.strictEqual($lastCells.get(3).colSpan, 8);
    });

    QUnit.test('Update colspans. when new columns count less than headers area have', function(assert) {
        const headersArea = createHeadersArea(null, true);

        headersArea.render($('#pivotArea'), this.data);

        headersArea.updateColspans(4);

        const $lastCells = headersArea.tableElement().find('.dx-last-cell');

        assert.strictEqual($lastCells.length, 4);
        assert.strictEqual($lastCells.get(0).colSpan, 1);
        assert.strictEqual($lastCells.get(1).colSpan, 1);

        assert.strictEqual($lastCells.get(2).colSpan, 2);
        assert.strictEqual($lastCells.get(3).colSpan, 2);
    });

    [true, false].forEach(remoteOperations => {
        QUnit.test('dataSource.remoteOperations=${remoteOperations}, store.load = returns empty array as arguments list', function(assert) {
            const grid = $('#pivotGrid').dxPivotGrid({
                dataSource: {
                    remoteOperations: remoteOperations,
                    fields: [
                        { area: 'row' },
                        { area: 'column' },
                        { area: 'data' }
                    ],
                    load: function() {
                        const d = $.Deferred();
                        d.resolve([]);
                        return d.promise();
                    }
                }
            }).dxPivotGrid('instance');
            this.clock.tick(10);

            assert.deepEqual($(grid._dataArea.element()).text(), 'No data');
        });

        QUnit.test('dataSource.remoteOperations=${remoteOperations}, store.load = returns empty array as object', function(assert) {
            const grid = $('#pivotGrid').dxPivotGrid({
                dataSource: {
                    remoteOperations: remoteOperations,
                    fields: [
                        { area: 'row' },
                        { area: 'column' },
                        { area: 'data' }
                    ],
                    load: function() {
                        const d = $.Deferred();
                        d.resolve({ data: [] });
                        return d.promise();
                    }
                }
            }).dxPivotGrid('instance');
            this.clock.tick(10);

            assert.deepEqual($(grid._dataArea.element()).text(), 'No data');
        });
    });

    QUnit.test('dataSource.remoteOperations=true, store.load = returns returns empty array with summary as arguments list', function(assert) {
        const grid = $('#pivotGrid').dxPivotGrid({
            dataSource: {
                remoteOperations: true,
                fields: [
                    { area: 'row' },
                    { area: 'column' },
                    { area: 'data' }
                ],
                load: function() {
                    const d = $.Deferred();
                    d.resolve([], { summary: [10] });
                    return d.promise();
                }
            }
        }).dxPivotGrid('instance');
        this.clock.tick(10);

        assert.deepEqual($(grid._dataArea.element()).text(), '10');
    });

    QUnit.test('dataSource.remoteOperations=true, store.load = returns returns empty array with summary as object', function(assert) {
        const grid = $('#pivotGrid').dxPivotGrid({
            dataSource: {
                remoteOperations: true,
                fields: [
                    { area: 'row' },
                    { area: 'column' },
                    { area: 'data' }
                ],
                load: function() {
                    const d = $.Deferred();
                    d.resolve({ data: [], summary: [10] });
                    return d.promise();
                }
            }
        }).dxPivotGrid('instance');
        this.clock.tick(10);

        assert.deepEqual($(grid._dataArea.element()).text(), '10');
    });

    QUnit.module('T998406', () => {
        function checkFieldsTypes(grid, assert) {
            const fields = grid.getDataSource().fields();
            assert.equal(fields[0].dataType, 'string');
            assert.equal(fields[1].dataType, 'date');
            assert.equal(fields[2].dataType, 'number');
        }

        function checkPivotGridCellsText(grid, headers, assert) {
            const rowCells = $(grid._rowsArea.element()).find('.dx-last-cell');
            assert.equal($(rowCells.get(0)).text(), headers.row);
            assert.equal($(rowCells.get(1)).text(), 'Grand Total');

            const columnCells = $(grid._columnsArea.element()).find('.dx-pivotgrid-horizontal-headers td');
            assert.equal($(columnCells.get(0)).text(), headers.column);
            assert.equal($(columnCells.get(1)).text(), 'Grand Total');

            const dataCells = $(grid._dataArea.element()).find('td');
            assert.equal($(dataCells.get(0)).text(), '1');
            assert.equal($(dataCells.get(1)).text(), '1');
            assert.equal($(dataCells.get(2)).text(), '1');
            assert.equal($(dataCells.get(3)).text(), '1');
        }

        QUnit.test('PivotGrid. [col x row x data], remoteOperations = false. Resolve data as arguments list. JQuery promise', function(assert) {
            const done = assert.async();
            const grid = $('#pivotGrid').dxPivotGrid({
                onContentReady: function() {
                    checkFieldsTypes(grid, assert);
                    checkPivotGridCellsText(grid, { row: 'row', column: '2021' }, assert);
                    done();
                },
                dataSource: {
                    remoteOperations: false,
                    fields: [
                        { area: 'row', dataField: 'row' },
                        { area: 'column', dataField: 'date' },
                        { area: 'data', dataField: 'amount', summaryType: 'sum' }
                    ],
                    load: function() {
                        const d = $.Deferred();
                        d.resolve([{ row: 'row', date: new Date('2021-05-24T03:24:00'), amount: 1 }]);
                        return d.promise();
                    }
                }
            }).dxPivotGrid('instance');
            this.clock.tick(10);
        });

        QUnit.test('PivotGrid. [col x row x data], remoteOperations = false. Resolve data as object. JQuery promise', function(assert) {
            const done = assert.async();
            const grid = $('#pivotGrid').dxPivotGrid({
                onContentReady: function() {
                    checkFieldsTypes(grid, assert);
                    checkPivotGridCellsText(grid, { row: 'row', column: '2021' }, assert);
                    done();
                },
                dataSource: {
                    remoteOperations: false,
                    fields: [
                        { area: 'row', dataField: 'row' },
                        { area: 'column', dataField: 'date' },
                        { area: 'data', dataField: 'amount', summaryType: 'sum' }
                    ],
                    load: function() {
                        const d = $.Deferred();
                        d.resolve({ data: [{ row: 'row', date: new Date('2021-05-24T03:24:00'), amount: 1 }] });
                        return d.promise();
                    }
                }
            }).dxPivotGrid('instance');
            this.clock.tick(10);
        });

        QUnit.test('PivotGrid. [col x row x data], remoteOperations = false. Resolve data as object. Native promise. Retrieve fields as simple array', function(assert) {
            const done = assert.async();
            const grid = $('#pivotGrid').dxPivotGrid({
                onContentReady: function() {
                    checkFieldsTypes(grid, assert);
                    checkPivotGridCellsText(grid, { row: 'row', column: '2021' }, assert);
                    done();
                },
                dataSource: {
                    remoteOperations: false,
                    fields: [
                        { area: 'row', dataField: 'row' },
                        { area: 'column', dataField: 'date' },
                        { area: 'data', dataField: 'amount', summaryType: 'sum' }
                    ],
                    load: function() {
                        return new Promise((resolve) => {
                            resolve([{ row: 'row', date: new Date('2021-05-24T03:24:00'), amount: 1 }]);
                        });
                    }
                }
            }).dxPivotGrid('instance');
            this.clock.tick(10);
        });

        QUnit.test('PivotGrid. [col x row x data], remoteOperations = false. Resolve data as object. Native promise', function(assert) {
            const done = assert.async();
            const grid = $('#pivotGrid').dxPivotGrid({
                onContentReady: function() {
                    checkFieldsTypes(grid, assert);
                    checkPivotGridCellsText(grid, { row: 'row', column: '2021' }, assert);
                    done();
                },
                dataSource: {
                    remoteOperations: false,
                    fields: [
                        { area: 'row', dataField: 'row' },
                        { area: 'column', dataField: 'date' },
                        { area: 'data', dataField: 'amount', summaryType: 'sum' }
                    ],
                    load: function() {
                        return new Promise((resolve) => {
                            resolve({ data: [{ row: 'row', date: new Date('2021-05-24T03:24:00'), amount: 1 }] });
                        });
                    }
                }
            }).dxPivotGrid('instance');
            this.clock.tick(10);
        });

        QUnit.test('PivotGrid. [col x row x data]. remoteOperations = true. Resolve data as arguments list. JQuery promise', function(assert) {
            const done = assert.async();
            const grid = $('#pivotGrid').dxPivotGrid({
                onContentReady: function() {
                    checkFieldsTypes(grid, assert);
                    checkPivotGridCellsText(grid, { row: 'row', column: '2021' }, assert);
                    done();
                },
                dataSource: {
                    remoteOperations: true,
                    fields: [
                        { area: 'row', dataField: 'row' },
                        { area: 'column', dataField: 'date' },
                        { area: 'data', dataField: 'amount', summaryType: 'sum' }
                    ],
                    load: function(options) {
                        const d = $.Deferred();
                        const date = new Date('2021-05-24T03:24:00');
                        if(options.group === undefined) {
                            d.resolve([{ row: 'row', date, amount: 1 }]); // retrieve fields
                        } else if(options.group && options.group[0].selector === 'date') {
                            d.resolve([{ key: date.getFullYear(), summary: [1] }]);
                        } else if(options.group && options.group[0].selector === 'row') {
                            d.resolve([ { key: 'row', summary: [1], items: [ { key: date.getFullYear(), summary: [1] } ] }], { summary: [1] });
                        }
                        return d.promise();
                    }
                }
            }).dxPivotGrid('instance');
            this.clock.tick(10);
        });

        QUnit.test('PivotGrid. [col x row x data]. remoteOperations = true. Resolve data as object. JQuery promise', function(assert) {
            const done = assert.async();
            const grid = $('#pivotGrid').dxPivotGrid({
                onContentReady: function() {
                    checkFieldsTypes(grid, assert);
                    checkPivotGridCellsText(grid, { row: 'row', column: '2021' }, assert);
                    done();
                },
                dataSource: {
                    remoteOperations: true,
                    fields: [
                        { area: 'row', dataField: 'row' },
                        { area: 'column', dataField: 'date' },
                        { area: 'data', dataField: 'amount', summaryType: 'sum' }
                    ],
                    load: function(options) {
                        const d = $.Deferred();
                        const date = new Date('2021-05-24T03:24:00');
                        if(options.group === undefined) {
                            d.resolve({ data: [ { row: 'row', date, amount: 1 } ] }); // retrieve fields
                        } else if(options.group && options.group[0].selector === 'date') {
                            d.resolve({ data: [{ key: date.getFullYear(), summary: [1] }] });
                        } else if(options.group && options.group[0].selector === 'row') {
                            d.resolve({ data: [{ key: 'row', summary: [1], items: [ { key: date.getFullYear(), summary: [1] } ] }], summary: [1] });
                        }
                        return d.promise();
                    }
                }
            }).dxPivotGrid('instance');
            this.clock.tick(10);
        });

        QUnit.test('PivotGrid. [col x row x data]. remoteOperations = true. Resolve data as object. Native promise', function(assert) {
            const done = assert.async();
            const grid = $('#pivotGrid').dxPivotGrid({
                onContentReady: function() {
                    checkFieldsTypes(grid, assert);
                    checkPivotGridCellsText(grid, { row: 'row', column: '2021' }, assert);
                    done();
                },
                dataSource: {
                    remoteOperations: true,
                    fields: [
                        { area: 'row', dataField: 'row' },
                        { area: 'column', dataField: 'date' },
                        { area: 'data', dataField: 'amount', summaryType: 'sum' }
                    ],
                    load: function(options) {
                        return new Promise(resolve => {
                            const date = new Date('2021-05-24T03:24:00');
                            if(options.group === undefined) {
                                resolve({ data: [ { row: 'row', date, amount: 1 } ] }); // retrieve fields
                            } else if(options.group && options.group[0].selector === 'date') {
                                resolve({ data: [{ key: date.getFullYear(), summary: [1] }] });
                            } else if(options.group && options.group[0].selector === 'row') {
                                resolve({ data: [{ key: 'row', summary: [1], items: [ { key: date.getFullYear(), summary: [1] } ] }], summary: [1] });
                            }
                        });
                    }
                }
            }).dxPivotGrid('instance');
            this.clock.tick(10);
        });

        QUnit.test('PivotGrid. [col x row x data]. remoteOperations = true. Resolve data as object. Native promise. Retrieve fields as simple array', function(assert) {
            const done = assert.async();
            const grid = $('#pivotGrid').dxPivotGrid({
                onContentReady: function() {
                    checkFieldsTypes(grid, assert);
                    checkPivotGridCellsText(grid, { row: 'row', column: '2021' }, assert);
                    done();
                },
                dataSource: {
                    remoteOperations: true,
                    fields: [
                        { area: 'row', dataField: 'row' },
                        { area: 'column', dataField: 'date' },
                        { area: 'data', dataField: 'amount', summaryType: 'sum' }
                    ],
                    load: function(options) {
                        return new Promise(resolve => {
                            const date = new Date('2021-05-24T03:24:00');
                            if(options.group === undefined) {
                                resolve([ { row: 'row', date, amount: 1 } ]); // retrieve fields
                            } else if(options.group && options.group[0].selector === 'date') {
                                resolve({ data: [{ key: date.getFullYear(), summary: [1] }] });
                            } else if(options.group && options.group[0].selector === 'row') {
                                resolve({ data: [{ key: 'row', summary: [1], items: [ { key: date.getFullYear(), summary: [1] } ] }], summary: [1] });
                            }
                        });
                    }
                }
            }).dxPivotGrid('instance');
            this.clock.tick(10);
        });

        QUnit.test('PivotGrid. [col x row x data]. remoteOperations = true. displayText is specified. Resolve data as arguments list. JQuery promise', function(assert) {
            const done = assert.async();
            const grid = $('#pivotGrid').dxPivotGrid({
                onContentReady: function() {
                    checkFieldsTypes(grid, assert);
                    checkPivotGridCellsText(grid, { row: 'displayText in row', column: 'displayText in column' }, assert);
                    done();
                },
                dataSource: {
                    remoteOperations: true,
                    fields: [
                        { area: 'row', dataField: 'row' },
                        { area: 'column', dataField: 'date' },
                        { area: 'data', dataField: 'amount', summaryType: 'sum' }
                    ],
                    load: function(options) {
                        const d = $.Deferred();
                        const date = new Date('2021-05-24T03:24:00');
                        if(options.group === undefined) {
                            d.resolve([{ row: 'row', date, amount: 1 }]); // retrieve fields
                        } else if(options.group && options.group[0].selector === 'date') {
                            d.resolve([{ key: date.getFullYear(), summary: [1], displayText: 'displayText in column' }]);
                        } else if(options.group && options.group[0].selector === 'row') {
                            d.resolve([ { key: 'row', summary: [1], displayText: 'displayText in row', items: [ { key: date.getFullYear(), summary: [1] } ] }], { summary: [1] });
                        }
                        return d.promise();
                    }
                }
            }).dxPivotGrid('instance');
            this.clock.tick(10);
        });

        QUnit.test('PivotGrid. [col x row x data]. remoteOperations = true. displayText is specified. Resolve data as object. JQuery promise', function(assert) {
            const done = assert.async();
            const grid = $('#pivotGrid').dxPivotGrid({
                onContentReady: function() {
                    checkFieldsTypes(grid, assert);
                    checkPivotGridCellsText(grid, { row: 'displayText in row', column: 'displayText in column' }, assert);
                    done();
                },
                dataSource: {
                    remoteOperations: true,
                    fields: [
                        { area: 'row', dataField: 'row' },
                        { area: 'column', dataField: 'date' },
                        { area: 'data', dataField: 'amount', summaryType: 'sum' }
                    ],
                    load: function(options) {
                        const d = $.Deferred();
                        const date = new Date('2021-05-24T03:24:00');
                        if(options.group === undefined) {
                            d.resolve({ data: [ { row: 'row', date, amount: 1 } ] }); // retrieve fields
                        } else if(options.group && options.group[0].selector === 'date') {
                            d.resolve({ data: [{ key: date.getFullYear(), summary: [1], displayText: 'displayText in column' }] });
                        } else if(options.group && options.group[0].selector === 'row') {
                            d.resolve({ data: [{ key: 'row', summary: [1], displayText: 'displayText in row', items: [ { key: date.getFullYear(), summary: [1] } ] }], summary: [1] });
                        }
                        return d.promise();
                    }
                }
            }).dxPivotGrid('instance');
            this.clock.tick(10);
        });

        QUnit.test('PivotGrid. [col x row x data]. remoteOperations = true. displayText is specified. Resolve data as object. Native promise', function(assert) {
            const done = assert.async();
            const grid = $('#pivotGrid').dxPivotGrid({
                onContentReady: function() {
                    checkFieldsTypes(grid, assert);
                    checkPivotGridCellsText(grid, { row: 'displayText in row', column: 'displayText in column' }, assert);
                    done();
                },
                dataSource: {
                    remoteOperations: true,
                    fields: [
                        { area: 'row', dataField: 'row' },
                        { area: 'column', dataField: 'date' },
                        { area: 'data', dataField: 'amount', summaryType: 'sum' }
                    ],
                    load: function(options) {
                        return new Promise(resolve => {
                            const date = new Date('2021-05-24T03:24:00');
                            if(options.group === undefined) {
                                resolve({ data: [ { row: 'row', date, amount: 1 } ] }); // retrieve fields
                            } else if(options.group && options.group[0].selector === 'date') {
                                resolve({ data: [{ key: date.getFullYear(), summary: [1], displayText: 'displayText in column' }] });
                            } else if(options.group && options.group[0].selector === 'row') {
                                resolve({ data: [{ key: 'row', summary: [1], displayText: 'displayText in row', items: [ { key: date.getFullYear(), summary: [1] } ] }], summary: [1] });
                            }
                        });
                    }
                }
            }).dxPivotGrid('instance');
            this.clock.tick(10);
        });

        QUnit.test('PivotGrid. [col x row x data]. remoteOperations = true. displayText is specified. Resolve data as object. Native promise. Retrieve fields as simple array', function(assert) {
            const done = assert.async();
            const grid = $('#pivotGrid').dxPivotGrid({
                onContentReady: function() {
                    checkFieldsTypes(grid, assert);
                    checkPivotGridCellsText(grid, { row: 'displayText in row', column: 'displayText in column' }, assert);
                    done();
                },
                dataSource: {
                    remoteOperations: true,
                    fields: [
                        { area: 'row', dataField: 'row' },
                        { area: 'column', dataField: 'date' },
                        { area: 'data', dataField: 'amount', summaryType: 'sum' }
                    ],
                    load: function(options) {
                        return new Promise(resolve => {
                            const date = new Date('2021-05-24T03:24:00');
                            if(options.group === undefined) {
                                resolve([ { row: 'row', date, amount: 1 } ]); // retrieve fields
                            } else if(options.group && options.group[0].selector === 'date') {
                                resolve({ data: [{ key: date.getFullYear(), summary: [1], displayText: 'displayText in column' }] });
                            } else if(options.group && options.group[0].selector === 'row') {
                                resolve({ data: [{ key: 'row', summary: [1], displayText: 'displayText in row', items: [ { key: date.getFullYear(), summary: [1] } ] }], summary: [1] });
                            }
                        });
                    }
                }
            }).dxPivotGrid('instance');
            this.clock.tick(10);
        });
    });

    ['instantly', 'onDemand'].forEach(applyChangesMode => {
        ['row', 'column'].forEach(changedArea => {
            function createPivotGridAndExpandHeaderItem(fieldsChooserFieldsUpdater, clock) {
                fx.off = true;
                const grid = $('#pivotGrid').dxPivotGrid({
                    fieldChooser: {
                        applyChangesMode: applyChangesMode
                    },
                    dataSource: {
                        fields: [
                            { area: 'row', dataField: 'row1', dataType: 'string' },
                            { area: 'row', dataField: 'subRow', dataType: 'string' },
                            { area: undefined, dataField: 'row2', dataType: 'string' },
                            { area: 'column', dataField: 'col1', dataType: 'string' },
                            { area: 'column', dataField: 'subColumn', dataType: 'string' },
                            { area: undefined, dataField: 'col2', dataType: 'string' },
                            { area: 'data', summaryType: 'count', dataType: 'number' }
                        ],
                        store: [{
                            row1: 'row1', row2: 'row2', subRow: 'subRow',
                            col1: 'column1', col2: 'column2', subColumn: 'subColumn'
                        }]
                    }
                }).dxPivotGrid('instance');
                clock.tick(10);

                grid.getDataSource().expandHeaderItem(changedArea, [`${changedArea}1`]);
                clock.tick(10);

                grid.getFieldChooserPopup().show().done(() => {
                    const fieldChooser = grid.getFieldChooserPopup().$content().dxPivotGridFieldChooser('instance');

                    fieldsChooserFieldsUpdater(fieldChooser);
                });
                fx.off = false;
            }

            QUnit.test(`After expanding the ${changedArea}, expandedPath must be assigned (T928525)`, function(assert) {
                createPivotGridAndExpandHeaderItem(function(fieldChooser) {
                    const state = fieldChooser.getDataSource().state();

                    if(changedArea === 'row') {
                        assert.deepEqual(state.rowExpandedPaths, [['row1']]);
                        assert.deepEqual(state.columnExpandedPaths, []);
                    } else {
                        assert.deepEqual(state.rowExpandedPaths, []);
                        assert.deepEqual(state.columnExpandedPaths, [['column1']]);
                    }
                }, this.clock);
            });

            QUnit.test(`Remove first item from the ${changedArea} area must clear the expandedPath (T928525)`, function(assert) {
                createPivotGridAndExpandHeaderItem(function(fieldChooser) {
                    const state = fieldChooser.getDataSource().state();
                    if(changedArea === 'row') {
                        state.fields[0].area = undefined;
                    } else {
                        state.fields[3].area = undefined;
                    }

                    fieldChooser.getDataSource().state(state, true);
                    const newState = fieldChooser.getDataSource().state();

                    assert.deepEqual(newState.rowExpandedPaths, []);
                    assert.deepEqual(newState.columnExpandedPaths, []);
                }, this.clock);
            });

            QUnit.test(`Append new item to the start of the ${changedArea} area must clear the expandedPath (T928525)`, function(assert) {
                createPivotGridAndExpandHeaderItem(function(fieldChooser) {
                    const state = fieldChooser.getDataSource().state();
                    if(changedArea === 'row') {
                        state.fields[0].areaIndex = 1;
                        state.fields[2].areaIndex = 0;
                        state.fields[2].area = 'row';
                    } else {
                        state.fields[3].areaIndex = 1;
                        state.fields[5].areaIndex = 0;
                        state.fields[5].area = 'column';
                    }

                    fieldChooser.getDataSource().state(state, true);
                    const newState = fieldChooser.getDataSource().state();

                    assert.deepEqual(newState.rowExpandedPaths, []);
                    assert.deepEqual(newState.columnExpandedPaths, []);
                }, this.clock);
            });

            QUnit.test(`Append new item to the end of ${changedArea} area must keep the expandedPath (T928525)`, function(assert) {
                createPivotGridAndExpandHeaderItem(function(fieldChooser) {
                    const state = fieldChooser.getDataSource().state();
                    if(changedArea === 'row') {
                        state.fields[2].area = 'row';
                        state.fields[2].areaIndex = 1;
                    } else {
                        state.fields[5].area = 'column';
                        state.fields[5].areaIndex = 1;
                    }

                    fieldChooser.getDataSource().state(state, true);
                    const newState = fieldChooser.getDataSource().state();

                    if(changedArea === 'row') {
                        assert.deepEqual(newState.rowExpandedPaths, [['row1']]);
                        assert.deepEqual(newState.columnExpandedPaths, []);
                    } else {
                        assert.deepEqual(newState.rowExpandedPaths, []);
                        assert.deepEqual(newState.columnExpandedPaths, [['column1']]);
                    }
                }, this.clock);
            });

            QUnit.test(`Swapping items in the ${changedArea} area must clear the expandedPath (T928525)`, function(assert) {
                createPivotGridAndExpandHeaderItem(function(fieldChooser) {
                    const state = fieldChooser.getDataSource().state();
                    if(changedArea === 'row') {
                        state.fields[0].areaIndex = 1;
                        state.fields[1].areaIndex = 0;
                    } else {
                        state.fields[3].areaIndex = 1;
                        state.fields[4].areaIndex = 0;
                    }

                    fieldChooser.getDataSource().state(state, true);
                    const newState = fieldChooser.getDataSource().state();

                    assert.deepEqual(newState.rowExpandedPaths, []);
                    assert.deepEqual(newState.columnExpandedPaths, []);
                }, this.clock);
            });
        });

        function createGridAndTestFieldChooser(testAction, clock) {
            fx.off = true;
            const grid = $('#pivotGrid').dxPivotGrid({
                fieldChooser: {
                    applyChangesMode: applyChangesMode
                },
                dataSource: {
                    fields: [
                        { area: 'row', dataField: 'row1', dataType: 'string' },
                        { area: 'row', dataField: 'subRow', dataType: 'string' },
                        { area: 'column', dataField: 'col1', dataType: 'string' },
                        { area: 'column', dataField: 'subColumn', dataType: 'string' },
                        { area: 'data', summaryType: 'count', dataType: 'number' }
                    ],
                    store: [{
                        row1: 'row1', row2: 'row2', subRow: 'subRow',
                        col1: 'column1', col2: 'column2', subColumn: 'subColumn'
                    }]
                }
            }).dxPivotGrid('instance');
            clock.tick(10);

            grid.getFieldChooserPopup().show().done(() => {
                const fieldChooser = grid.getFieldChooserPopup().$content().dxPivotGridFieldChooser('instance');
                testAction(grid, fieldChooser, clock);
            });
            clock.restore();
            fx.off = false;
        }

        QUnit.test(`applyChangesMode=${applyChangesMode}. fieldChooser.option(state, newState). fieldChooser.applyChanges()`, function(assert) {
            createGridAndTestFieldChooser((grid, fieldChooser, clock) => {
                const fields = grid.getDataSource().state().fields;
                fieldChooser.option('state', { rowExpandedPaths: [['row1']], columnExpandedPaths: [['column1']], fields: fields });
                clock.tick(10);

                let dataSourceState = grid.getDataSource().state();
                assert.deepEqual(dataSourceState.rowExpandedPaths, applyChangesMode === 'instantly' ? [['row1']] : []);
                assert.deepEqual(dataSourceState.columnExpandedPaths, applyChangesMode === 'instantly' ? [['column1']] : []);

                fieldChooser.applyChanges();
                clock.tick(10);

                dataSourceState = grid.getDataSource().state();
                const optionState = fieldChooser.option('state');

                assert.deepEqual(dataSourceState.rowExpandedPaths, [['row1']]);
                assert.deepEqual(dataSourceState.columnExpandedPaths, [['column1']]);

                assert.deepEqual(optionState.rowExpandedPaths, [['row1']]);
                assert.deepEqual(optionState.columnExpandedPaths, [['column1']]);
            }, this.clock);
        });

        QUnit.test(`applyChangesMode=${applyChangesMode}. fieldChooser.option(state, newState). fieldChooser.cancelChanges()`, function(assert) {
            createGridAndTestFieldChooser((grid, fieldChooser, clock) => {
                const fields = grid.getDataSource().state().fields;
                fieldChooser.option('state', { rowExpandedPaths: [['row1']], columnExpandedPaths: [['column1']], fields: fields });
                clock.tick(10);

                let dataSourceState = grid.getDataSource().state();
                assert.deepEqual(dataSourceState.rowExpandedPaths, applyChangesMode === 'instantly' ? [['row1']] : []);
                assert.deepEqual(dataSourceState.columnExpandedPaths, applyChangesMode === 'instantly' ? [['column1']] : []);

                fieldChooser.cancelChanges();
                clock.tick(10);

                dataSourceState = grid.getDataSource().state();
                const optionState = fieldChooser.option('state');

                assert.deepEqual(dataSourceState.rowExpandedPaths, applyChangesMode === 'instantly' ? [['row1']] : []);
                assert.deepEqual(dataSourceState.columnExpandedPaths, applyChangesMode === 'instantly' ? [['column1']] : []);

                assert.deepEqual(optionState.rowExpandedPaths, applyChangesMode === 'instantly' ? [['row1']] : []);
                assert.deepEqual(optionState.columnExpandedPaths, applyChangesMode === 'instantly' ? [['column1']] : []);
            }, this.clock);
        });

        QUnit.test(`applyChangesMode=${applyChangesMode}. onOptionChanged must be fired if dataSource changed`, function(assert) {
            createGridAndTestFieldChooser((grid, fieldChooser, clock) => {
                let isEventTriggered = false;
                fieldChooser.option('onOptionChanged', (e) => {
                    if(e.name === 'state') {
                        isEventTriggered = true;
                    }
                });

                grid.getDataSource()._eventsStrategy.fireEvent('changed');
                clock.tick(10);

                assert.equal(isEventTriggered, true, 'event is triggered');
            }, this.clock);
        });

        QUnit.test(`applyChangesMode=${applyChangesMode}. pivotGrid.dataSource.state(newState) multiple times`, function(assert) {
            createGridAndTestFieldChooser((grid, fieldChooser, clock) => {
                let dataSourceEventsCount = 0;
                fieldChooser.getDataSource().on('changed', () => { dataSourceEventsCount++; });

                const state = fieldChooser.getDataSource().state();
                state.fields[1].area = undefined;

                fieldChooser.option('state', state);
                fieldChooser.option('state', state);
                fieldChooser.option('state', state);
                clock.tick(10);

                if(applyChangesMode === 'instantly') {
                    assert.equal(dataSourceEventsCount, 1, 'dataSource is reloaded only once');
                } else {
                    assert.equal(dataSourceEventsCount, 0, 'dataSource is not reloaded');
                }
            }, this.clock);
        });
    });

    ['allowExpandAll', 'allowSortingBySummary', 'allowFiltering'].forEach(option => {
        function getSourceData() {
            return {
                fields: [
                    { area: 'row', dataField: 'row1', dataType: 'string' },
                    { area: 'column', dataField: 'col1', dataType: 'string' },
                    { area: 'data', summaryType: 'count', dataType: 'number' }
                ],
                store: [{ row1: 'row1', col1: 'column1' }]
            };
        }

        [false, true].forEach(isEnabledInGrid => {
            ['simpleObject', 'pivotGridDataSource'].forEach(dataSourceType => {
                QUnit.test(`grid.${option}=${isEnabledInGrid} -> grid.${option}=${!isEnabledInGrid}. Changing option of pivotGrid affects the field option (T950953). dataSourceType: ${dataSourceType}`, function(assert) {
                    const getFields = (grid) => grid.getDataSource().fields();

                    const dataSource = getSourceData();
                    const gridOptions = {};
                    gridOptions[option] = isEnabledInGrid;
                    gridOptions.dataSource = dataSourceType === 'simpleObject'
                        ? dataSource
                        : new PivotGridDataSource(dataSource);

                    const grid = $('#pivotGrid').dxPivotGrid(gridOptions).dxPivotGrid('instance');
                    this.clock.tick(10);
                    getFields(grid).forEach(field => assert.strictEqual(field[option], isEnabledInGrid, 'option is initialized correctly'));

                    grid.option(option, !isEnabledInGrid);
                    this.clock.tick(10);
                    getFields(grid).forEach(field => assert.strictEqual(field[option], !isEnabledInGrid, 'option is changed'));
                });

                [false, true].forEach(isEnabledInField => {
                    QUnit.test(`grid.${option}=${isEnabledInGrid}, grid.allFields.${option}=${isEnabledInField} -> grid.${option}=${!isEnabledInGrid}. Changing option of pivotGrid doesn't affects the field option if it has value (T950953). dataSourceType: ${dataSourceType}`, function(assert) {
                        const getFields = (grid) => grid.getDataSource().fields();

                        const dataSource = getSourceData();
                        const gridOptions = {};
                        gridOptions[option] = isEnabledInGrid;
                        dataSource.fields.forEach(f => f[option] = isEnabledInField);
                        gridOptions.dataSource = dataSourceType === 'simpleObject'
                            ? dataSource
                            : new PivotGridDataSource(dataSource);

                        const grid = $('#pivotGrid').dxPivotGrid(gridOptions).dxPivotGrid('instance');
                        this.clock.tick(10);
                        getFields(grid).forEach(field => assert.strictEqual(field[option], isEnabledInField, 'option is initialized correctly'));

                        grid.option(option, !isEnabledInGrid);
                        this.clock.tick(10);
                        getFields(grid).forEach(field => assert.strictEqual(field[option], isEnabledInField, 'option is not changed'));
                    });
                });
            });
        });
    });
});

QUnit.module('Data area', () => {

    function createDataArea(componentOptions) {
        return new DataAreaModule.DataArea(getStubComponent(componentOptions));
    }

    QUnit.test('Render', function(assert) {
        function getText(cell) {
            return $(cell).text();
        }

        const dataArea = createDataArea();
        const testElement = $('#pivotArea');

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
        const table = testElement.find('table');
        const rows = table[0].rows;

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

    // Covers the CSP issue T1178847
    QUnit.test('Should remove data area table\'s styles during render', function(assert) {
        const dataArea = createDataArea();
        const $testElement = $('#pivotArea');

        dataArea.render($testElement, [
            [
                { columnType: 'D', rowType: 'D', text: '1' },
            ],
        ]);

        const $table = $testElement.find('table');
        $table.css({ 'box-shadow': '0 0 #ff0000' });

        dataArea.render($testElement, [
            [
                { columnType: 'D', rowType: 'D', text: '2' },
            ],
        ]);

        const expectedCss = $table.css('box-shadow');
        assert.equal(expectedCss, 'none', 'box-shadow style was reset');
    });

    QUnit.test('Render when data area is not empty', function(assert) {
        const dataArea = createDataArea();
        let rows;
        let table;
        const testElement = $('#pivotArea');
        const data = [
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

        dataArea.render(testElement, data);
        table = testElement.find('table');
        rows = table[0].rows;

        assert.equal(table.length, 1, 'data area table is rendered');
        assert.equal(rows.length, 2, 'rows count');

        dataArea.render(testElement, data);
        table = testElement.find('table');
        rows = table[0].rows;

        assert.equal(table.length, 1, 'data area table is rendered');
        assert.equal(rows.length, 2, 'rows count');
    });

    QUnit.test('EncodeHtml is enabled', function(assert) {
        const dataArea = createDataArea({
            encodeHtml: true
        });
        const testElement = $('#pivotArea');
        const data = [
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

        dataArea.render(testElement, data);

        const $cells = testElement.find('td');
        assert.equal(testElement.find('b').length, 0, 'bold tegs count');
        assert.equal($cells.eq(0).text(), '<b>1</b>', 'cell 0 text');
        assert.equal(testElement.find('h1').length, 0, 'header 1 tegs count');
        assert.equal($cells.eq(5).text(), '<h1>3</h1>', 'cell 3 text');
    });

    QUnit.test('EncodeHtml is disabled', function(assert) {
        const dataArea = createDataArea();
        const testElement = $('#pivotArea');
        const data = [
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

        dataArea.render(testElement, data);

        assert.equal(testElement.find('b').length, 1, 'bold tegs count');
        assert.equal(testElement.find('b').text(), '1', 'bold teg text');
        assert.equal(testElement.find('h1').length, 1, 'header 1 tegs count');
        assert.equal(testElement.find('h1').text(), '3', 'header teg text');
    });

    QUnit.test('setVirtualContentParams.', function(assert) {
        const area = createDataArea({
            'scrolling.mode': 'virtual',
        });
        const testElement = $('#pivotGrid').addClass('dx-pivotgrid').addClass('dx-virtual-mode');

        area.render(testElement, []);
        area.setVirtualContentParams({
            left: 10,
            top: 100,
            width: 500,
            height: 250
        });

        area.component.option = sinon.stub();
        area.component.option.withArgs('scrolling').returns({ useNative: false });
        area.renderScrollable();
        area.updateScrollableOptions({});

        const virtualContent = area.tableElement().prev();

        assert.strictEqual(area.tableElement().css('position'), 'absolute');
        assert.strictEqual(area.tableElement().css('left'), '10px');
        assert.strictEqual(area.tableElement().css('top'), '100px');

        assert.strictEqual(virtualContent.css('display'), 'block');
        assert.strictEqual(virtualContent.css('width'), '500px');
        assert.strictEqual(virtualContent.css('height'), '250px');
        assert.strictEqual($(area._getScrollable().content()).css('height'), '250px');
    });

    // T465337
    QUnit.test('Reset with virtual scrolling', function(assert) {
        const area = createDataArea({
            'scrolling.mode': 'virtual'
        });
        const testElement = $('#pivotGrid')
            .addClass('dx-pivotgrid')
            .addClass('dx-virtual-mode');

        area.render(testElement, []);
        area.setVirtualContentParams({
            left: 10,
            top: 100,
            width: 500,
            height: 250
        });

        area.component.option = sinon.stub();
        area.component.option.withArgs('scrolling').returns({ useNative: 'auto' });
        area.renderScrollable();

        area.reset();

        assert.strictEqual($(area._getScrollable().content()).get(0).style.height, 'auto');
    });

    QUnit.test('scrollTo with virtual scrolling. Horizontal scrolling', function(assert) {
        const clock = sinon.useFakeTimers();
        const testElement = $('#pivotGrid').addClass('dx-pivotgrid');
        const area = createDataArea({
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

        area.component.option = sinon.stub();
        area.component.option.withArgs('scrolling').returns({ useNative: 'auto' });
        area.renderScrollable();

        area.setGroupWidth(200);
        area.setGroupHeight(200);

        area.setColumnsWidth([100, 120, 300]);
        area.setRowsHeight([100, 120, 300]);

        area.updateScrollableOptions({});
        area._getScrollable().update();

        function assertFakeTable(scrollPos, expectedOffset, expectedVisibility) {
            area.scrollTo({ x: scrollPos, y: 0 });
            const fakeTable = $('#pivotGrid').find('.dx-virtual-content > table').first();

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
        const clock = sinon.useFakeTimers();
        const testElement = $('#pivotGrid').addClass('dx-pivotgrid');
        const area = createDataArea({
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

        area.component.option = sinon.stub();
        area.component.option.withArgs('scrolling').returns({ useNative: 'auto' });
        area.renderScrollable();

        area.setGroupWidth(200);
        area.setGroupHeight(200);

        area.setColumnsWidth([100, 120, 300]);
        area.setRowsHeight([100, 120, 300]);

        area.updateScrollableOptions({});
        area._getScrollable().update();

        function assertFakeTable(scrollPos, expectedOffset, expectedVisibility) {
            area.scrollTo({ x: scrollPos, y: 0 });
            const fakeTable = $('#pivotGrid').find('.dx-virtual-content > table').first();

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
        const clock = sinon.useFakeTimers();
        const testElement = $('#pivotGrid').addClass('dx-pivotgrid');
        const area = createDataArea({
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

        area.component.option = sinon.stub();
        area.component.option.withArgs('scrolling').returns({ useNative: 'auto' });
        area.renderScrollable();

        area.setGroupWidth(200);
        area.setGroupHeight(200);

        area.setColumnsWidth([100, 120, 300]);
        area.setRowsHeight([100, 120, 300]);

        area.updateScrollableOptions({});
        area._getScrollable().update();

        function assertFakeTable(scrollPos, expectedOffset, expectedVisibility) {
            area.scrollTo({ x: 0, y: scrollPos });
            const fakeTable = $('#pivotGrid').find('.dx-virtual-content > table').first();

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
        const clock = sinon.useFakeTimers();
        const testElement = $('#pivotGrid').addClass('dx-pivotgrid');
        const area = createDataArea({
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


        area.component.option = sinon.stub();
        area.component.option.withArgs('scrolling').returns({ useNative: 'auto' });
        area.renderScrollable();

        area.setGroupWidth(200);
        area.setGroupHeight(200);

        area.setColumnsWidth([100, 120, 300]);
        area.setRowsHeight([100, 120, 300]);

        area.updateScrollableOptions({ direction: 'vertical' });

        function assertFakeTable(scrollPos, expectedOffset, expectedVisibility) {
            area.scrollTo({ x: 0, y: scrollPos });
            const fakeTable = $('#pivotGrid').find('.dx-virtual-content > table').first();

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

    QUnit.module('T1003928', {
        beforeEach: function() {
            this.clock = sinon.useFakeTimers();
        },
        afterEach: function() {
            this.clock.restore();
        }
    }, () => {
        function getDataAreaVisibleText(pivotGrid) {
            return pivotGrid._dataArea
                .element()
                .children(':visible')
                .text()
                .trim();
        }

        QUnit.test('field.visible:false]', function(assert) {
            let dataAreaCellPreparedCallCount = 0;
            const pivot = $('#pivotGrid').dxPivotGrid({
                onCellPrepared: function(e) {
                    if(e.area === 'data') {
                        dataAreaCellPreparedCallCount++;
                    }
                },
                dataSource: {
                    fields: [
                        { area: 'row', dataField: 'row' },
                        { area: 'column', dataField: 'date' },
                        { area: 'data', dataField: 'amount', summaryType: 'sum', visible: false }
                    ],
                    store: [ { row1: 'r1', col1: 'c1', amount: 5 } ]
                }
            }).dxPivotGrid('instance');
            this.clock.tick(10);

            assert.equal(dataAreaCellPreparedCallCount, 0, 'cellPreparedCallback call count');
            assert.equal(getDataAreaVisibleText(pivot), 'No data', 'No data message is rendered');
            assert.equal(pivot.getDataSource().getAreaFields('data').length, 1, 'field still exists in dataArea fields');
            assert.equal(pivot.getDataSource().isEmpty(), true, 'data source is empty');
        });

        QUnit.test('field.visible:false -> field.visible:true]', function(assert) {
            let dataAreaCellPreparedCallCount = 0;
            const pivot = $('#pivotGrid').dxPivotGrid({
                onCellPrepared: function(e) {
                    if(e.area === 'data') {
                        dataAreaCellPreparedCallCount++;
                    }
                },
                dataSource: {
                    fields: [
                        { area: 'row', dataField: 'row' },
                        { area: 'column', dataField: 'date' },
                        { area: 'data', dataField: 'amount', summaryType: 'sum', visible: false }
                    ],
                    store: [ { row1: 'r1', col1: 'c1', amount: 5 } ]
                }
            }).dxPivotGrid('instance');
            this.clock.tick(10);

            pivot.getDataSource().field('amount', { visible: true });
            pivot.getDataSource().load();
            this.clock.tick(10);

            assert.equal(dataAreaCellPreparedCallCount, 4, 'cellPreparedCallback call count');
            assert.equal(getDataAreaVisibleText(pivot), '5555', 'Valid message is rendered');
            assert.equal(pivot.getDataSource().isEmpty(), false, 'data source is empty');
        });

        QUnit.test('field1.visible:false,field2.visible=true, field2 refers to data in field1]', function(assert) {
            let dataAreaCellPreparedCallCount = 0;
            const pivot = $('#pivotGrid').dxPivotGrid({
                onCellPrepared: function(e) {
                    if(e.area === 'data') {
                        dataAreaCellPreparedCallCount++;
                    }
                },
                dataSource: {
                    fields: [
                        { area: 'row', dataField: 'row' },
                        { area: 'column', dataField: 'date' },
                        { area: 'data', dataField: 'amount', summaryType: 'sum', visible: false },
                        { area: 'data', summaryType: 'sum', calculateSummaryValue: (e) => e.value('amount') }
                    ],
                    store: [ { row1: 'r1', col1: 'c1', amount: 5 } ]
                }
            }).dxPivotGrid('instance');
            this.clock.tick(10);

            assert.equal(dataAreaCellPreparedCallCount, 4, 'cellPreparedCallback call count');
            assert.equal(getDataAreaVisibleText(pivot), '5555', 'Valid message is rendered');
            assert.equal(pivot.getDataSource().getAreaFields('data').length, 2, 'field still exists in dataArea fields');
            assert.equal(pivot.getDataSource().isEmpty(), false, 'data source is empty');
        });
    });
});

