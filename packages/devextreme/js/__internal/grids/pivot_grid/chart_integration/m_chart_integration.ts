import $ from '@js/core/renderer';
import type { PivotGridDataType } from '@js/ui/pivot_grid/data_source';
import type dxChart from '@js/viz/chart';
import type {
  ChartsDataType, Panes as ChartPane, Properties as ChartOptions, ValueAxis as ChartValueAxis,
} from '@js/viz/chart';
import { extend } from '@ts/core/utils/extend';
import type { DataSourceHeaderItem } from '@ts/grids/pivot_grid/data_source/types';
import type { PivotGrid } from '@ts/grids/pivot_grid/m_widget';
import type { PivotGridField } from '@ts/grids/pivot_grid/types';

import type { PivotGridDataSource } from '../data_source/data_source';
import { createPath, foreachTree, formatValue } from '../widget_utils';
import type {
  ChartCell,
  ChartCellMembers,
  ChartDataItem,
  ChartIntegrationOptions,
  ChartProcessCellArgs,
  ChartSeriesOptions,
  ChartTarget,
} from './types';

const FORMAT_DICTIONARY: Record<PivotGridDataType, ChartsDataType> = {
  number: 'numeric',
  date: 'datetime',
  string: 'string',
};
const UNBIND_KEY = 'dxPivotGridUnbinding';

function getFormattedValue(path: DataSourceHeaderItem[], fields: PivotGridField[]): string[] {
  const value: string[] = [];
  const lastFieldIndex = fields.length - 1;

  path.forEach((item, i) => {
    value.push(item.text || formatValue(item.value, fields[lastFieldIndex - i]));
  });

  return value.reverse();
}

function getExpandedLevel(node: DataSourceHeaderItem[]): number {
  let level = 0;
  foreachTree(node, (members: DataSourceHeaderItem[]) => {
    level = Math.max(level, members.length - 1);
  });
  return level;
}

function processDataCell(
  processCellArgs: ChartProcessCellArgs,
  processCell: ChartIntegrationOptions['processCell'],
): ChartProcessCellArgs {
  let { chartDataItem } = processCellArgs;
  const processedCell = processCell && processCell(processCellArgs);

  if (processedCell) {
    chartDataItem = extend({}, chartDataItem, processedCell.chartDataItem);

    return extend({}, processCellArgs, processedCell, {
      chartDataItem,
    });
  }

  return processCellArgs;
}

function createChartDataSource(
  pivotGridDataSource: PivotGridDataSource,
  mapOptions: ChartIntegrationOptions,
  axisDictionary: Record<string, string | undefined>,
): ChartDataItem[] {
  const data = pivotGridDataSource.getData();
  const dataSource: ChartDataItem[] = [];

  const dataFields = pivotGridDataSource.getAreaFields('data');
  const rowFields = pivotGridDataSource.getAreaFields('row');
  const columnFields = pivotGridDataSource.getAreaFields('column');

  const columnElements: DataSourceHeaderItem[] = [
    { index: data.grandTotalColumnIndex, children: data.columns },
  ];
  const rowElements: DataSourceHeaderItem[] = [
    { index: data.grandTotalRowIndex, children: data.rows },
  ];

  const rowLevel = getExpandedLevel(rowElements);
  const columnLevel = getExpandedLevel(columnElements);

  const createDataItem = (cell: ChartCell): void => {
    const {
      dataField, measureIndex,
      rowMemberIndex, rowVisibility, rowPathFormatted, rowPath,
      columnMemberIndex, columnVisibility, columnPath, columnPathFormatted,
    } = cell;

    const rowValues = (rowMemberIndex !== undefined && data.values[rowMemberIndex]) || [];
    const dataCell = (columnMemberIndex !== undefined && rowValues[columnMemberIndex]) || [];
    const value = dataCell[measureIndex];
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in an if-chain
    let axis: string | undefined;
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

    let processCellArgs: ChartProcessCellArgs = {
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

      chartDataItem: {
        val: value === undefined ? null : value,
        series: seriesName,
        arg: argument,
      },
    };

    processCellArgs = processDataCell(processCellArgs, mapOptions.processCell);

    if (processCellArgs.visible) {
      axisDictionary[
        processCellArgs.chartDataItem.series
      ] = axisDictionary[processCellArgs.chartDataItem.series] || axis;
      dataSource.push(processCellArgs.chartDataItem);
    }
  };

  const foreachRowColumn = (callBack: (members: ChartCellMembers) => void): void => {
    foreachTree(rowElements, (rowMemberItems: DataSourceHeaderItem[]) => {
      const rowMemberIndex = rowMemberItems[0].index;

      const rowMembers = rowMemberItems.slice(0, rowMemberItems.length - 1);

      const rowVisibility = rowLevel === rowMembers.length;

      const rowPath = createPath(rowMembers);
      let rowPathFormatted: (string | undefined)[] = getFormattedValue(rowMembers, rowFields);

      if (rowPath.length === 0) {
        rowPathFormatted = [mapOptions.grandTotalText];
      }

      foreachTree(columnElements, (columnMemberItems: DataSourceHeaderItem[]) => {
        const columnMemberIndex = columnMemberItems[0].index;

        const columnMembers = columnMemberItems.slice(0, columnMemberItems.length - 1);
        const columnVisibility = columnLevel === columnMembers.length;

        const columnPath = createPath(columnMembers);
        let columnPathFormatted: (string | undefined)[] = getFormattedValue(
          columnMembers,
          columnFields,
        );

        if (columnPath.length === 0) {
          columnPathFormatted = [mapOptions.grandTotalText];
        }

        callBack({
          rowMemberIndex,
          rowVisibility,
          rowPath,
          rowPathFormatted,

          columnMemberIndex,
          columnVisibility,
          columnPath,
          columnPathFormatted,
        });
      });
    });
  };

  if (mapOptions.alternateDataFields === false) {
    dataFields.forEach((dataField, measureIndex) => {
      foreachRowColumn((members) => {
        createDataItem({ dataField, measureIndex, ...members });
      });
    });
  } else {
    foreachRowColumn((members) => {
      dataFields.forEach((dataField, measureIndex) => {
        createDataItem({ dataField, measureIndex, ...members });
      });
    });
  }

  return dataSource;
}

function createValueAxisOptions(
  dataSource: PivotGridDataSource,
  options: ChartIntegrationOptions,
): ChartValueAxis[] {
  const dataFields = dataSource.getAreaFields('data');
  if (
    (options.putDataFieldsInto !== 'args' && options.dataFieldsDisplayMode !== 'singleAxis')
    || dataFields.length === 1
  ) {
    const valueAxisSettings: ChartValueAxis[] = [];
    dataFields.forEach((dataField) => {
      const valueAxisOptions: ChartValueAxis = {
        name: dataField.caption,
        // @ts-expect-error ChartValueAxis.title is typed without the string form
        title: dataField.caption,
        valueType: (dataField.dataType && FORMAT_DICTIONARY[dataField.dataType]),
        label: { format: dataField.format },
      };

      if (valueAxisOptions.label && dataField.customizeText) {
        valueAxisOptions.label.customizeText = (formatObject): string => {
          // @ts-expect-error the field had customizeText when the axis was built
          const result = dataField.customizeText.call(dataField, formatObject);
          return result;
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

function createPanesOptions(
  dataSource: PivotGridDataSource,
  options: ChartIntegrationOptions,
): ChartPane[] {
  const panes: ChartPane[] = [];
  const dataFields = dataSource.getAreaFields('data');

  if (dataFields.length > 1 && options.dataFieldsDisplayMode === 'splitPanes' && options.putDataFieldsInto !== 'args') {
    dataFields.forEach((dataField) => {
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

function createChartOptions(
  dataSource: PivotGridDataSource,
  options: ChartIntegrationOptions,
): ChartOptions {
  const { customizeSeries } = options;
  const { customizeChart } = options;
  let chartOptions: ChartOptions = {
    valueAxis: createValueAxisOptions(dataSource, options),
    panes: createPanesOptions(dataSource, options),
  };
  const axisDictionary: Record<string, string | undefined> = {};

  if (customizeChart) {
    chartOptions = extend(true, {}, chartOptions, customizeChart(chartOptions));
  }

  chartOptions.dataSource = createChartDataSource(dataSource, options, axisDictionary);

  chartOptions.seriesTemplate = {
    nameField: 'series',
    customizeSeries(seriesName: string): ChartSeriesOptions {
      let seriesOptions: ChartSeriesOptions = {};

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

function getChartInstance(chartElement: ChartTarget): dxChart | false | undefined {
  if (!chartElement) {
    return false;
  }

  // @ts-expect-error NAME is defined only on a component instance
  const componentName: string | undefined = chartElement.NAME;

  if (componentName) {
    // @ts-expect-error chartElement is dxChart instance
    return componentName === 'dxChart' && chartElement;
  }

  // @ts-expect-error renderer() is typed without component instances
  const element = $(chartElement);
  const chart: dxChart | undefined = element.data('dxChart');
  return chart;
}

function removeBinding(chart: dxChart): void {
  const unbind: (() => void) | undefined = chart.$element().data(UNBIND_KEY);
  if (unbind) {
    unbind();
  }
}

const ChartIntegrationMixin = {
  bindChart(
    this: PivotGrid,
    chart: ChartTarget,
    integrationOptions: ChartIntegrationOptions | undefined,
  ): (() => void) | null {
    const options: ChartIntegrationOptions = extend({}, integrationOptions);

    const chartInstance = getChartInstance(chart);

    if (!chartInstance) {
      return null;
    }

    const updateChart = (): void => {
      // @ts-expect-error PivotGrid options aren't typed yet
      options.grandTotalText = this.option('texts.grandTotal');
      const chartOptions = createChartOptions(this.getDataSource(), options);
      chartInstance.option(chartOptions);
    };

    removeBinding(chartInstance);

    this.on('changed', updateChart);
    updateChart();

    const disposeBinding = (): void => {
      chartInstance.$element().removeData(UNBIND_KEY);
      this.off('changed', updateChart);
    };

    chartInstance.on('disposing', disposeBinding);
    this.on('disposing', disposeBinding);

    chartInstance.$element().data(UNBIND_KEY, disposeBinding);

    return disposeBinding;
  },
};

export default { ChartIntegrationMixin };
export { ChartIntegrationMixin };
