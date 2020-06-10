import React from 'react';

import PivotGrid, {
  FieldChooser,
  FieldPanel
} from 'devextreme-react/pivot-grid';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

import sales from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.onContextMenuPreparing = this.onContextMenuPreparing.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <div className="desc-container">
          Right-click (or&nbsp;touch and hold) the &quot;Relative Sales&quot; field
          and select an&nbsp;item from the appeared context menu to&nbsp;change the
          <b> &quot;summaryDisplayMode&quot;</b> option.
        </div>
        <PivotGrid
          id="sales"
          dataSource={dataSource}
          allowSortingBySummary={true}
          allowSorting={true}
          allowExpandAll={true}
          showBorders={true}
          onContextMenuPreparing={this.onContextMenuPreparing}
        >
          <FieldPanel
            showFilterFields={false}
            allowFieldDragging={false}
            visible={true}
          />
          <FieldChooser enabled={false} />
        </PivotGrid>
      </React.Fragment>
    );
  }

  onContextMenuPreparing(e) {
    if(e.field && e.field.dataField === 'amount') {
      summaryDisplayModes.forEach(mode => {
        e.items.push({
          text: mode.text,
          selected: e.field.summaryDisplayMode === mode.value,
          onItemClick: () => {
            var format,
              caption = mode.value === 'none' ? 'Total Sales' : 'Relative Sales';
            if (mode.value === 'none'
              || mode.value === 'absoluteVariation') {
              format = 'currency';
            }
            dataSource.field(e.field.index, {
              summaryDisplayMode: mode.value,
              format: format,
              caption: caption
            });

            dataSource.load();
          }
        });
      });
    }
  }
}

const summaryDisplayModes = [
  { text: 'None', value: 'none' },
  { text: 'Absolute Variation', value: 'absoluteVariation' },
  { text: 'Percent Variation', value: 'percentVariation' },
  { text: 'Percent of Column Total', value: 'percentOfColumnTotal' },
  { text: 'Percent of Row Total', value: 'percentOfRowTotal' },
  { text: 'Percent of Column Grand Total', value: 'percentOfColumnGrandTotal' },
  { text: 'Percent of Row Grand Total', value: 'percentOfRowGrandTotal' },
  { text: 'Percent of Grand Total', value: 'percentOfGrandTotal' }
];

const dataSource = new PivotGridDataSource({
  fields: [{
    caption: 'Region',
    width: 120,
    dataField: 'region',
    area: 'row'
  }, {
    caption: 'City',
    dataField: 'city',
    width: 150,
    area: 'row'
  }, {
    dataField: 'date',
    dataType: 'date',
    area: 'column'
  }, {
    groupName: 'date',
    groupInterval: 'year',
    expanded: true
  }, {
    caption: 'Relative Sales',
    dataField: 'amount',
    dataType: 'number',
    summaryType: 'sum',
    area: 'data',
    summaryDisplayMode: 'percentOfColumnGrandTotal'
  }],
  store: sales
});

export default App;
