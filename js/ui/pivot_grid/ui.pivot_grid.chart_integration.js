import $ from '../../core/renderer';
import { extend } from '../../core/utils/extend';
import { foreachTree, formatValue, createPath } from './ui.pivot_grid.utils';
import { each } from '../../core/utils/iterator';

const FORMAT_DICTIONARY = {
    number: 'numeric',
    date: 'datetime'
};
const UNBIND_KEY = 'dxPivotGridUnbinding';

function getFormattedValue(path, fields) {
    const value = [];
    const lastFieldIndex = fields.length - 1;

    each(path, function(i, item) {
        value.push(item.text || formatValue(item.value, fields[lastFieldIndex - i]));
    });

    return value.reverse();
}

function getExpandedLevel(node) {
    let level = 0;
    foreachTree(node, function(members) {
        level = Math.max(level, members.length - 1);
    });
    return level;
}

function processDataCell(processCellArgs, processCell) {
    let chartDataItem = processCellArgs.chartDataItem;
    let processedCell = processCell && processCell(processCellArgs);

    if(processedCell) {
        chartDataItem = extend({}, chartDataItem, processedCell.chartDataItem);
        processedCell = extend({}, processCellArgs, processedCell, {
            chartDataItem: chartDataItem
        });

        return processedCell;
    }

    return processCellArgs;
}

function createChartDataSource(pivotGridDataSource, mapOptions, axisDictionary) {
    const data = pivotGridDataSource.getData();
    const dataSource = [];

    const dataFields = pivotGridDataSource.getAreaFields('data');
    const rowFields = pivotGridDataSource.getAreaFields('row');
    const columnFields = pivotGridDataSource.getAreaFields('column');

    const columnElements = [{ index: data.grandTotalColumnIndex, children: data.columns }];
    const rowElements = [{ index: data.grandTotalRowIndex, children: data.rows }];

    const rowLevel = getExpandedLevel(rowElements);
    const columnLevel = getExpandedLevel(columnElements);

    let measureIndex;
    let dataField;

    let rowMemberIndex;
    let rowVisibility;
    let rowPathFormatted;
    let rowPath;

    let columnMemberIndex;
    let columnVisibility;
    let columnPath;
    let columnPathFormatted;

    function createDataItem() {
        const dataCell = ((data.values[rowMemberIndex] || [])[columnMemberIndex] || []);
        const value = dataCell[measureIndex];
        let axis;
        let processCellArgs = {
            rowPath: rowPath,
            maxRowLevel: rowLevel,
            rowPathFormatted: rowPathFormatted,
            rowFields: rowFields,

            columnPathFormatted: columnPathFormatted,
            maxColumnLevel: columnLevel,
            columnPath: columnPath,
            columnFields: columnFields,

            dataFields: dataFields,
            dataIndex: measureIndex,
            dataValues: dataCell,

            visible: columnVisibility && rowVisibility
        };
        let seriesName = (mapOptions.inverted ? columnPathFormatted : rowPathFormatted).join(' - ');
        let argument = (mapOptions.inverted ? rowPathFormatted : columnPathFormatted).join('/');

        if(dataFields.length > 1) {
            if(mapOptions.putDataFieldsInto === 'args' || mapOptions.putDataFieldsInto === 'both') {
                argument += ' | ' + dataField.caption;

            }

            if(mapOptions.putDataFieldsInto !== 'args') {
                seriesName += ' | ' + dataField.caption;
                if(mapOptions.dataFieldsDisplayMode !== 'singleAxis') {
                    axis = dataField.caption;
                }
            }

        }

        processCellArgs.chartDataItem = {
            val: value === undefined ? null : value,
            series: seriesName,
            arg: argument
        };

        processCellArgs = processDataCell(processCellArgs, mapOptions.processCell);

        if(processCellArgs.visible) {

            axisDictionary[processCellArgs.chartDataItem.series] = axisDictionary[processCellArgs.chartDataItem.series] || axis;
            dataSource.push(processCellArgs.chartDataItem);
        }

    }

    function foreachRowColumn(callBack) {
        foreachTree(rowElements, function(rowMembers) {
            rowMemberIndex = rowMembers[0].index;

            rowMembers = rowMembers.slice(0, rowMembers.length - 1);

            rowVisibility = rowLevel === rowMembers.length;

            rowPath = createPath(rowMembers);
            rowPathFormatted = getFormattedValue(rowMembers, rowFields);

            if(rowPath.length === 0) {
                rowPathFormatted = [mapOptions.grandTotalText];
            }

            foreachTree(columnElements, function(columnMembers) {
                columnMemberIndex = columnMembers[0].index;

                columnMembers = columnMembers.slice(0, columnMembers.length - 1);
                columnVisibility = columnLevel === columnMembers.length;

                columnPath = createPath(columnMembers);
                columnPathFormatted = getFormattedValue(columnMembers, columnFields);

                if(columnPath.length === 0) {
                    columnPathFormatted = [mapOptions.grandTotalText];
                }

                callBack();
            });
        });
    }

    function foreachDataField(callback) {
        each(dataFields, function(index, field) {
            dataField = field;
            measureIndex = index;
            callback();
        });
    }

    if(mapOptions.alternateDataFields === false) {
        foreachDataField(function() {
            foreachRowColumn(createDataItem);
        });
    } else {
        foreachRowColumn(function() {
            foreachDataField(createDataItem);
        });
    }

    return dataSource;
}

function createValueAxisOptions(dataSource, options) {
    const dataFields = dataSource.getAreaFields('data');
    if(options.putDataFieldsInto !== 'args' && options.dataFieldsDisplayMode !== 'singleAxis' || dataFields.length === 1) {
        const valueAxisSettings = [];
        each(dataFields, function(_, dataField) {
            const valueAxisOptions = {
                name: dataField.caption,
                title: dataField.caption,
                valueType: FORMAT_DICTIONARY[dataField.dataType] || dataField.dataType,
                label: { format: dataField.format }
            };

            if(dataField.customizeText) {
                valueAxisOptions.label.customizeText = function(formatObject) {
                    return dataField.customizeText.call(dataField, formatObject);
                };
            }

            if(options.dataFieldsDisplayMode === 'splitPanes') {
                valueAxisOptions.pane = dataField.caption;
            }

            valueAxisSettings.push(valueAxisOptions);
        });

        return valueAxisSettings;
    }

    return [{}];
}

function createPanesOptions(dataSource, options) {
    const panes = [];
    const dataFields = dataSource.getAreaFields('data');

    if(dataFields.length > 1 && options.dataFieldsDisplayMode === 'splitPanes' && options.putDataFieldsInto !== 'args') {
        each(dataFields, function(_, dataField) {
            panes.push({
                name: dataField.caption
            });
        });
    }

    if(!panes.length) {
        panes.push({});
    }

    return panes;
}

function createChartOptions(dataSource, options) {
    const customizeSeries = options.customizeSeries;
    const customizeChart = options.customizeChart;
    let chartOptions = {
        valueAxis: createValueAxisOptions(dataSource, options),
        panes: createPanesOptions(dataSource, options)
    };
    const axisDictionary = {};

    if(customizeChart) {
        chartOptions = extend(true, {}, chartOptions, customizeChart(chartOptions));
    }

    chartOptions.dataSource = createChartDataSource(dataSource, options, axisDictionary);

    chartOptions.seriesTemplate = {
        nameField: 'series',
        customizeSeries: function(seriesName) {
            let seriesOptions = {};

            if(options.dataFieldsDisplayMode === 'splitPanes') {
                seriesOptions.pane = axisDictionary[seriesName];
            } else if(options.dataFieldsDisplayMode !== 'singleAxis') {
                seriesOptions.axis = axisDictionary[seriesName];
            }

            if(customizeSeries) {
                seriesOptions = extend(seriesOptions, customizeSeries(seriesName, seriesOptions));
            }

            return seriesOptions;
        }
    };

    return chartOptions;
}

function getChartInstance(chartElement) {
    if(!chartElement) {
        return false;
    }

    if(chartElement.NAME) {
        return chartElement.NAME === 'dxChart' && chartElement;
    }

    const element = $(chartElement);
    return element.data('dxChart') && element.dxChart('instance');
}

function removeBinding(chart) {
    const unbind = chart.$element().data(UNBIND_KEY);
    unbind && unbind();
}

module.exports = {
    /**
    * @name dxPivotGridMethods.bindChart
    * @publicName bindChart(chart, integrationOptions)
    * @param1 chart:string|jQuery|object
    * @param2 integrationOptions:object
    * @param2_field1 inverted:boolean
    * @param2_field2 dataFieldsDisplayMode:string
    * @param2_field3 putDataFieldsInto:string
    * @param2_field4 alternateDataFields:boolean
    * @param2_field5 processCell:function(cellData)
    * @param2_field6 customizeChart:function(chartOptions)
    * @param2_field7 customizeSeries:function(seriesName, seriesOptions)
    * @return function | null
    */
    bindChart: function(chart, integrationOptions) {
        integrationOptions = extend({}, integrationOptions);

        const that = this;
        const updateChart = function() {
            integrationOptions.grandTotalText = that.option('texts.grandTotal');
            const chartOptions = createChartOptions(that.getDataSource(), integrationOptions);
            chart.option(chartOptions);
        };
        let disposeBinding;

        chart = getChartInstance(chart);

        if(!chart) {
            return null;
        }

        removeBinding(chart);

        that.on('changed', updateChart);
        updateChart();

        disposeBinding = function() {
            chart.$element().removeData(UNBIND_KEY);
            that.off('changed', updateChart);
        };

        chart.on('disposing', disposeBinding);
        this.on('disposing', disposeBinding);

        chart.$element().data(UNBIND_KEY, disposeBinding);

        return disposeBinding;
    }
};
