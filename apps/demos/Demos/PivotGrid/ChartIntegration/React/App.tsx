import React, { useEffect, useRef } from 'react';

import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

import Chart, {
  AdaptiveLayout,
  CommonSeriesSettings,
  Size,
  Tooltip,
} from 'devextreme-react/chart';

import PivotGrid, {
  FieldChooser,
} from 'devextreme-react/pivot-grid';

import sales from './data.ts';

const customizeTooltip = (args) => {
  const valueText = (args.seriesName.indexOf('Total') !== -1)
    ? new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'USD' }).format(args.originalValue)
    : args.originalValue;

  return {
    html: `${args.seriesName}<div class='currency'>${
      valueText}</div>`,
  };
};

const App = () => {
  const chartRef = useRef<Chart>(null);
  const pivotGridRef = useRef<PivotGrid>(null);

  useEffect(() => {
    pivotGridRef.current.instance.bindChart(chartRef.current.instance, {
      dataFieldsDisplayMode: 'splitPanes',
      alternateDataFields: false,
    });
  }, []);

  return (
    <React.Fragment>
      <Chart ref={chartRef}>
        <Size height={320} />
        <Tooltip enabled={true} customizeTooltip={customizeTooltip} />
        <CommonSeriesSettings type="bar" />
        <AdaptiveLayout width={450} />
      </Chart>

      <PivotGrid
        id="pivotgrid"
        dataSource={dataSource}
        allowSortingBySummary={true}
        allowFiltering={true}
        showBorders={true}
        showColumnTotals={false}
        showColumnGrandTotals={false}
        showRowTotals={false}
        showRowGrandTotals={false}
        ref={pivotGridRef}
      >
        <FieldChooser enabled={true} height={400} />
      </PivotGrid>
    </React.Fragment>
  );
};

const dataSource = new PivotGridDataSource({
  fields: [{
    caption: 'Region',
    width: 120,
    dataField: 'region',
    area: 'row',
    sortBySummaryField: 'Total',
  }, {
    caption: 'City',
    dataField: 'city',
    width: 150,
    area: 'row',
  }, {
    dataField: 'date',
    dataType: 'date',
    area: 'column',
  }, {
    groupName: 'date',
    groupInterval: 'month',
    visible: false,
  }, {
    caption: 'Total',
    dataField: 'amount',
    dataType: 'number',
    summaryType: 'sum',
    format: 'currency',
    area: 'data',
  }, {
    summaryType: 'count',
    area: 'data',
  }],
  store: sales,
});

export default App;
