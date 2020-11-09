import React from 'react';

import {
  PivotGrid,
  FieldChooser
} from 'devextreme-react/pivot-grid';

import {
  PivotGridFieldChooser,
  Texts
} from 'devextreme-react/pivot-grid-field-chooser';

import {
  SelectBox
} from 'devextreme-react/select-box';

import {
  Button
} from 'devextreme-react/button';

import {
  RadioGroup
} from 'devextreme-react/radio-group';

import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

import service from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      applyChangesMode: 'instantly',
      layout: 0
    };

    this.changeMode = this.changeMode.bind(this);
    this.changeLayout = this.changeLayout.bind(this);
    this.applyClick = this.applyClick.bind(this);
    this.cancelClick = this.cancelClick.bind(this);

    this.fieldChooser = null;

    this.setFieldChooser = (ref) => {
      this.fieldChooser = ref.instance;
    };
  }

  render() {
    return (
      <React.Fragment>
        <PivotGrid
          dataSource={dataSource}
          allowSortingBySummary={true}
          allowFiltering={true}
          allowSorting={true}
          showBorders={true}
        >
          <FieldChooser enabled={false} />
        </PivotGrid>

        <div className="container">
          <PivotGridFieldChooser
            ref={this.setFieldChooser}
            dataSource={dataSource}
            width={400}
            height={400}
            layout={this.state.layout}
            applyChangesMode={this.state.applyChangesMode}
          >
            <Texts
              allFields="All"
              columnFields="Columns"
              dataFields="Data"
              rowFields="Rows"
              filterFields="Filter"
            ></Texts>
          </PivotGridFieldChooser>
          { this.state.applyChangesMode === 'onDemand' &&
                <div className="bottom-bar">
                  <Button
                    text="Apply"
                    type="default"
                    onClick={this.applyClick}
                  ></Button>
                  <Button
                    text="Cancel"
                    onClick={this.cancelClick}
                  ></Button>
                </div>
          }

          <div className="options">
            <div className="caption">Options</div>
            <div className="option">
              <span>Choose layout:</span>
              <RadioGroup
                items={layouts}
                value={this.state.layout}
                className="option-editor"
                layout="vertical"
                valueExpr="key"
                displayExpr="name"
                onValueChanged={this.changeLayout}>
              </RadioGroup>
            </div>
            <div className="option">
              <span>Apply Changes Mode:</span>
              <SelectBox
                className="option-editor"
                items={applyChangesModes}
                width={180}
                value={this.state.applyChangesMode}
                onValueChanged={this.changeMode}>
              </SelectBox>
            </div>
          </div>

        </div>

      </React.Fragment>
    );
  }

  changeMode(e) {
    this.setState({
      applyChangesMode: e.value
    });
  }

  changeLayout(e) {
    this.setState({
      layout: e.value
    });
  }

  applyClick() {
    this.fieldChooser.applyChanges();
  }

  cancelClick() {
    this.fieldChooser.cancelChanges();
  }
}

const dataSource = new PivotGridDataSource({
  fields: [{
    caption: 'Region',
    width: 120,
    dataField: 'region',
    area: 'row',
    headerFilter: {
      allowSearch: true
    }
  }, {
    caption: 'City',
    dataField: 'city',
    width: 150,
    area: 'row',
    headerFilter: {
      allowSearch: true
    },
    selector: function(data) {
      return `${data.city } (${ data.country })`;
    }
  }, {
    dataField: 'date',
    dataType: 'date',
    area: 'column'
  }, {
    caption: 'Sales',
    dataField: 'amount',
    dataType: 'number',
    summaryType: 'sum',
    format: 'currency',
    area: 'data'
  }],
  store: service.getSales()
});

const applyChangesModes = ['instantly', 'onDemand'];
const layouts = service.getLayouts();

export default App;
