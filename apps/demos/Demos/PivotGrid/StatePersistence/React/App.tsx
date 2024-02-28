import React from 'react';

import PivotGrid, {
  FieldChooser,
  FieldPanel,
  StateStoring,
} from 'devextreme-react/pivot-grid';
import Button from 'devextreme-react/button';

import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

import sales from './data.ts';

const onRefreshClick = () => {
  window.location.reload();
};

const onResetClick = () => {
  dataSource.state({});
};

const onContextMenuPreparing = (e) => {
  const sourceField = e.field;

  if (sourceField) {
    if (!sourceField.groupName || sourceField.groupIndex === 0) {
      e.items.push({
        text: 'Hide field',
        onItemClick() {
          let fieldIndex: number;

          if (sourceField.groupName) {
            const areaField: any = dataSource.getAreaFields(sourceField.area, true)[sourceField.areaIndex];

            fieldIndex = areaField.index;
          } else {
            fieldIndex = sourceField.index;
          }

          dataSource.field(fieldIndex, {
            area: null,
          });
          dataSource.load();
        },
      });
    }

    if (sourceField.dataType === 'number') {
      const menuItems = [];

      e.items.push({ text: 'Summary Type', items: menuItems });

      ['Sum', 'Avg', 'Min', 'Max'].forEach((summaryType) => {
        const summaryTypeValue = summaryType.toLowerCase();

        menuItems.push({
          text: summaryType,
          value: summaryType.toLowerCase(),
          onItemClick(args) {
            setSummaryType(args, sourceField);
          },
          selected: e.field.summaryType === summaryTypeValue,
        });
      });
    }
  }
};

const dataSource = new PivotGridDataSource({
  fields: [{
    caption: 'Region',
    width: 120,
    dataField: 'region',
    area: 'row',
    sortBySummaryField: 'sales',
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
    groupInterval: 'year',
  }, {
    groupName: 'date',
    groupInterval: 'quarter',
  }, {
    dataField: 'sales',
    dataType: 'number',
    summaryType: 'sum',
    format: 'currency',
    area: 'data',
  }],
  store: sales,
});

const setSummaryType = (args, sourceField) => {
  dataSource.field(sourceField.index, {
    summaryType: args.itemData.value,
  });

  dataSource.load();
};

const App = () => (
  <React.Fragment>
    <div id="pivotgrid-demo">
      <div className="desc-container">Expand, filter, sort and perform other operations
          on&nbsp;the PivotGrid&rsquo;s columns and
          rows. <a onClick={onRefreshClick}>Refresh</a> the web page and note that
          the PivotGrid&rsquo;s state is&nbsp;automatically persisted.
      </div>
      <Button
        text={"Reset the PivotGrid's State"}
        onClick={onResetClick}
      />
      <PivotGrid
        id="sales"
        dataSource={dataSource}
        allowSortingBySummary={true}
        allowSorting={true}
        allowFiltering={true}
        allowExpandAll={true}
        showBorders={true}
        height={570}
        onContextMenuPreparing={onContextMenuPreparing}
      >
        <StateStoring
          enabled={true}
          type="localStorage"
          storageKey="dx-widget-gallery-pivotgrid-storing"
        />
        <FieldPanel
          visible={true}
        />
        <FieldChooser enabled={true} />
      </PivotGrid>
    </div>
  </React.Fragment>
);

export default App;
