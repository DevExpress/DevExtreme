import React from 'react';

import PivotGrid, {
  FieldChooser,
  FieldPanel
} from 'devextreme-react/pivot-grid';
import CheckBox from 'devextreme-react/check-box';

import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

import sales from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showColumnFields: true,
      showDataFields: true,
      showFilterFields: true,
      showRowFields: true
    };
    this.onShowColumnFieldsChanged = this.onShowColumnFieldsChanged.bind(this);
    this.onShowDataFieldsChanged = this.onShowDataFieldsChanged.bind(this);
    this.onShowFilterFieldsChanged = this.onShowFilterFieldsChanged.bind(this);
    this.onShowRowFieldsChanged = this.onShowRowFieldsChanged.bind(this);
    this.onContextMenuPreparing = this.onContextMenuPreparing.bind(this);
  }

  render() {
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
          onContextMenuPreparing={this.onContextMenuPreparing}
        >
          <FieldPanel
            showColumnFields={this.state.showColumnFields}
            showDataFields={this.state.showDataFields}
            showFilterFields={this.state.showFilterFields}
            showRowFields={this.state.showRowFields}
            allowFieldDragging={true}
            visible={true}
          />
          <FieldChooser height={500} />
        </PivotGrid>
        <div className="options">
          <div className="caption">Options</div>
          <div className="option">
            <CheckBox id="show-data-fields"
              value={this.state.showColumnFields}
              onValueChanged={this.onShowColumnFieldsChanged}
              text="Show Data Fields" />
          </div>
          &nbsp;
          <div className="option">
            <CheckBox id="show-row-fields"
              value={this.state.showDataFields}
              onValueChanged={this.onShowDataFieldsChanged}
              text="Show Row Fields" />
          </div>
          &nbsp;
          <div className="option">
            <CheckBox id="show-column-fields"
              value={this.state.showFilterFields}
              onValueChanged={this.onShowFilterFieldsChanged}
              text="Show Column Fields" />
          </div>
          &nbsp;
          <div className="option">
            <CheckBox id="show-filter-fields"
              value={this.state.showRowFields}
              onValueChanged={this.onShowRowFieldsChanged}
              text="Show Filter Fields" />
          </div>
        </div>
      </React.Fragment>
    );
  }

  onShowColumnFieldsChanged(e) {
    this.setState({ showColumnFields: e.value });
  }

  onShowDataFieldsChanged(e) {
    this.setState({ showDataFields: e.value });
  }

  onShowFilterFieldsChanged(e) {
    this.setState({ showFilterFields: e.value });
  }

  onShowRowFieldsChanged(e) {
    this.setState({ showRowFields: e.value });
  }

  onContextMenuPreparing(e) {
    var sourceField = e.field;

    if (sourceField) {
      if(!sourceField.groupName || sourceField.groupIndex === 0) {
        e.items.push({
          text: 'Hide field',
          onItemClick: function() {
            var fieldIndex;
            if(sourceField.groupName) {
              fieldIndex = dataSource.getAreaFields(sourceField.area, true)[sourceField.areaIndex].index;
            } else {
              fieldIndex = sourceField.index;
            }

            dataSource.field(fieldIndex, {
              area: null
            });
            dataSource.load();
          }
        });
      }

      if (sourceField.dataType === 'number') {
        var menuItems = [];

        e.items.push({ text: 'Summary Type', items: menuItems });
        ['Sum', 'Avg', 'Min', 'Max'].forEach(summaryType => {
          var summaryTypeValue = summaryType.toLowerCase();

          menuItems.push({
            text: summaryType,
            value: summaryType.toLowerCase(),
            onItemClick: function(args) {
              setSummaryType(args, sourceField);
            },
            selected: e.field.summaryType === summaryTypeValue
          });
        });
      }
    }
  }
}

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
    area: 'row',
    selector: function(data) {
      return `${data.city} (${data.country})`;
    }
  }, {
    dataField: 'date',
    dataType: 'date',
    area: 'column'
  }, {
    dataField: 'sales',
    dataType: 'number',
    summaryType: 'sum',
    format: 'currency',
    area: 'data'
  }],
  store: sales
});

function setSummaryType(args, sourceField) {
  dataSource.field(sourceField.index, {
    summaryType: args.itemData.value
  });

  dataSource.load();
}

export default App;
