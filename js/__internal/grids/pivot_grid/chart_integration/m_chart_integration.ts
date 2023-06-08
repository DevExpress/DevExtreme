import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';

import { createPath, foreachTree, formatValue } from '../m_widget_utils';

const FORMAT_DICTIONARY = {
  number: 'numeric',
  date: 'datetime',
};
const UNBIND_KEY = 'dxPivotGridUnbinding';

function getFormattedValue(path, fields) {
  const value: any = [];
  const lastFieldIndex = fields.length - 1;

  each(path, (i: number, item) => {
    value.push(item.text || formatValue(item.value, fields[lastFieldIndex - i]));
  });

  return value.reverse();
}

function getExpandedLevel(node) {
  let level = 0;
  foreachTree(node, (members) => {
    level = Math.max(level, members.length - 1);
  });
  return level;
}

function processDataCell(processCellArgs, processCell) {
  let { chartDataItem } = processCellArgs;
  let processedCell = processCell && processCell(processCellArgs);

  if (processedCell) {
    chartDataItem = extend({}, chartDataItem, processedCell.chartDataItem);
    processedCell = extend({}, processCellArgs, processedCell, {
      chartDataItem,
    });

    return processedCell;
  }

  return processCellArgs;
}

function createChartDataSource(pivotGridDataSource, mapOptions, axisDictionary) {
  const data = pivotGridDataSource.getData();
  const dataSource: any = [];

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
    const dataCell = (data.values[rowMemberIndex] || [])[columnMemberIndex] || [];
    const value = dataCell[measureIndex];
    let axis;
    let processCellArgs: any = {
      rowPath,
      maxRowLevel: rowLevel,
      rowPathFormatted,
      rowFields,

      columnPathFormatted,
      maxColumnLevel: columnLevel,
      columnPath,
      columnFields,

      dataFields,
      dataIndex: measureIndex,
      dataValues: dataCell,

      visible: columnVisibility && rowVisibility,
    };
    let seriesName = (mapOptions.inverted ? columnPathFormatted : rowPathFormatted).join(' - ');
    let argument = (mapOptions.inverted ? rowPathFormatted : columnPathFormatted).join('/');

    if (dataFields.length > 1) {
      if (mapOptions.putDataFieldsInto === 'args' || mapOptions.putDataFieldsInto === 'both') {
        argument += ` | ${dataField.caption}`;
      }

      if (mapOptions.putDataFieldsInto !== 'args') {
        seriesName += ` | ${dataField.caption}`;
        if (mapOptions.dataFieldsDisplayMode !== 'singleAxis') {
          axis = dataField.caption;
        }
      }
    }

    processCellArgs.chartDataItem = {
      val: value === undefined ? null : value,
      series: seriesName,
      arg: argument,
    };

    processCellArgs = processDataCell(processCellArgs, mapOptions.processCell);

    if (processCellArgs.visible) {
      axisDictionary[
        processCellArgs.chartDataItem.series
      ] = axisDictionary[processCellArgs.chartDataItem.series] || axis;
      dataSource.push(processCellArgs.chartDataItem);
    }
  }

  function foreachRowColumn(callBack) {
    foreachTree(rowElements, (rowMembers) => {
      rowMemberIndex = rowMembers[0].index;

      rowMembers = rowMembers.slice(0, rowMembers.length - 1);

      rowVisibility = rowLevel === rowMembers.length;

      rowPath = createPath(rowMembers);
      rowPathFormatted = getFormattedValue(rowMembers, rowFields);

      if (rowPath.length === 0) {
        rowPathFormatted = [mapOptions.grandTotalText];
      }

      foreachTree(columnElements, (columnMembers) => {
        columnMemberIndex = columnMembers[0].index;

        columnMembers = columnMembers.slice(0, columnMembers.length - 1);
        columnVisibility = columnLevel === columnMembers.length;

        columnPath = createPath(columnMembers);
        columnPathFormatted = getFormattedValue(columnMembers, columnFields);

        if (columnPath.length === 0) {
          columnPathFormatted = [mapOptions.grandTotalText];
        }

        callBack();
      });
    });
  }

  function foreachDataField(callback) {
    each(dataFields, (index, field) => {
      dataField = field;
      measureIndex = index;
      callback();
    });
  }

  if (mapOptions.alternateDataFields === false) {
    foreachDataField(() => {
      foreachRowColumn(createDataItem);
    });
  } else {
    foreachRowColumn(() => {
      foreachDataField(createDataItem);
    });
  }

  return dataSource;
}

function createValueAxisOptions(dataSource, options) {
  const dataFields = dataSource.getAreaFields('data');
  if (options.putDataFieldsInto !== 'args' && options.dataFieldsDisplayMode !== 'singleAxis' || dataFields.length === 1) {
    const valueAxisSettings: any = [];
    each(dataFields, (_, dataField) => {
      const valueAxisOptions: any = {
        name: dataField.caption,
        title: dataField.caption,
        valueType: FORMAT_DICTIONARY[dataField.dataType] || dataField.dataType,
        label: { format: dataField.format },
      };

      if (dataField.customizeText) {
        valueAxisOptions.label.customizeText = function (formatObject) {
          return dataField.customizeText.call(dataField, formatObject);
        };
      }

      if (options.dataFieldsDisplayMode === 'splitPanes') {
        valueAxisOptions.pane = dataField.caption;
      }

      valueAxisSettings.push(valueAxisOptions);
    });

    return valueAxisSettings;
  }

  return [{}];
}

function createPanesOptions(dataSource, options) {
  const panes: any = [];
  const dataFields = dataSource.getAreaFields('data');

  if (dataFields.length > 1 && options.dataFieldsDisplayMode === 'splitPanes' && options.putDataFieldsInto !== 'args') {
    each(dataFields, (_, dataField) => {
      panes.push({
        name: dataField.caption,
      });
    });
  }

  if (!panes.length) {
    panes.push({});
  }

  return panes;
}

function createChartOptions(dataSource, options) {
  const { customizeSeries } = options;
  const { customizeChart } = options;
  let chartOptions: any = {
    valueAxis: createValueAxisOptions(dataSource, options),
    panes: createPanesOptions(dataSource, options),
  };
  const axisDictionary = {};

  if (customizeChart) {
    chartOptions = extend(true, {}, chartOptions, customizeChart(chartOptions));
  }

  chartOptions.dataSource = createChartDataSource(dataSource, options, axisDictionary);

  chartOptions.seriesTemplate = {
    nameField: 'series',
    customizeSeries(seriesName) {
      let seriesOptions: any = {};

      if (options.dataFieldsDisplayMode === 'splitPanes') {
        seriesOptions.pane = axisDictionary[seriesName];
      } else if (options.dataFieldsDisplayMode !== 'singleAxis') {
        seriesOptions.axis = axisDictionary[seriesName];
      }

      if (customizeSeries) {
        seriesOptions = extend(seriesOptions, customizeSeries(seriesName, seriesOptions));
      }

      return seriesOptions;
    },
  };

  return chartOptions;
}

function getChartInstance(chartElement) {
  if (!chartElement) {
    return false;
  }

  if (chartElement.NAME) {
    return chartElement.NAME === 'dxChart' && chartElement;
  }

  const element: any = $(chartElement);
  return element.data('dxChart') && element.dxChart('instance');
}

function removeBinding(chart) {
  const unbind = chart.$element().data(UNBIND_KEY);
  unbind && unbind();
}

const ChartIntegrationMixin = {
  bindChart(chart, integrationOptions) {
    integrationOptions = extend({}, integrationOptions);

    const that: any = this;
    const updateChart = function () {
      integrationOptions.grandTotalText = that.option('texts.grandTotal');
      const chartOptions = createChartOptions(that.getDataSource(), integrationOptions);
      chart.option(chartOptions);
    };

    chart = getChartInstance(chart);

    if (!chart) {
      return null;
    }

    removeBinding(chart);

    that.on('changed', updateChart);
    updateChart();

    const disposeBinding = function () {
      chart.$element().removeData(UNBIND_KEY);
      that.off('changed', updateChart);
    };

    chart.on('disposing', disposeBinding);
    this.on('disposing', disposeBinding);

    chart.$element().data(UNBIND_KEY, disposeBinding);

    return disposeBinding;
  },
};

export default { ChartIntegrationMixin };
export { ChartIntegrationMixin };
