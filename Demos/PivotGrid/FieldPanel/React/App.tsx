import React from 'react';

import PivotGrid, {
  FieldChooser,
  FieldPanel,
} from 'devextreme-react/pivot-grid';
import CheckBox from 'devextreme-react/check-box';

import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

import sales from './data.ts';

const setSummaryType = (args, sourceField) => {
  dataSource.field(sourceField.index, {
    summaryType: args.itemData.value,
  });

  dataSource.load();
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

const App = () => {
  const [showColumnFields, setShowColumnFields] = React.useState(true);
  const [showDataFields, setShowDataFields] = React.useState(true);
  const [showFilterFields, setShowFilterFields] = React.useState(true);
  const [showRowFields, setShowRowFields] = React.useState(true);

  return (
    <React.Fragment>
      <PivotGrid
        id="sales"
        dataSource={dataSource}
        allowSortingBySummary={true}
        allowSorting={true}
        allowFiltering={true}
        showBorders={true}
        height={490}
        onContextMenuPreparing={onContextMenuPreparing}
      >
        <FieldPanel
          showColumnFields={showColumnFields}
          showDataFields={showDataFields}
          showFilterFields={showFilterFields}
          showRowFields={showRowFields}
          allowFieldDragging={true}
          visible={true}
        />
        <FieldChooser height={500} />
      </PivotGrid>
      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <CheckBox id="show-data-fields"
            value={showColumnFields}
            onValueChange={setShowColumnFields}
            text="Show Data Fields" />
        </div>
        &nbsp;
        <div className="option">
          <CheckBox id="show-row-fields"
            value={showDataFields}
            onValueChange={setShowDataFields}
            text="Show Row Fields" />
        </div>
        &nbsp;
        <div className="option">
          <CheckBox id="show-column-fields"
            value={showFilterFields}
            onValueChange={setShowFilterFields}
            text="Show Column Fields" />
        </div>
        &nbsp;
        <div className="option">
          <CheckBox id="show-filter-fields"
            value={showRowFields}
            onValueChange={setShowRowFields}
            text="Show Filter Fields" />
        </div>
      </div>
    </React.Fragment>
  );
};

const dataSource = new PivotGridDataSource({
  fields: [{
    caption: 'Region',
    width: 120,
    dataField: 'region',
    area: 'row',
  }, {
    caption: 'City',
    dataField: 'city',
    width: 150,
    area: 'row',
    selector(data: { city: any; country: any; }) {
      return `${data.city} (${data.country})`;
    },
  }, {
    dataField: 'date',
    dataType: 'date',
    area: 'column',
  }, {
    dataField: 'sales',
    dataType: 'number',
    summaryType: 'sum',
    format: 'currency',
    area: 'data',
  }],
  store: sales,
});

export default App;
