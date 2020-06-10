import React from 'react';
import FilterBuilder from 'devextreme-react/filter-builder';
import Button from 'devextreme-react/button';
import DataGrid from 'devextreme-react/data-grid';
import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';
import { filter, fields } from './data.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.dataSource = new DataSource({
      store: new ODataStore({
        fieldTypes: {
          'Product_Cost': 'Decimal',
          'Product_Sale_Price': 'Decimal',
          'Product_Retail_Price': 'Decimal'
        },
        url: 'https://js.devexpress.com/Demos/DevAV/odata/Products',
      }),
      select: [
        'Product_ID',
        'Product_Name',
        'Product_Cost',
        'Product_Sale_Price',
        'Product_Retail_Price',
        'Product_Current_Inventory'
      ]
    });
    this.state = {
      value: filter,
      gridFilterValue: filter
    };
    this.onValueChanged = this.onValueChanged.bind(this);
    this.buttonClick = this.buttonClick.bind(this);
  }
  render() {
    const { value, gridFilterValue } = this.state;
    return (
      <div>
        <div className="filter-container">
          <FilterBuilder fields={fields}
            value={value}
            onValueChanged={this.onValueChanged} />
          <Button
            text="Apply Filter"
            type="default"
            onClick={this.buttonClick} />
          <div className="dx-clearfix"></div>
        </div>
        <DataGrid
          dataSource={this.dataSource}
          filterValue={gridFilterValue}
          showBorders={true}
          columns={fields}
          height={300} />
      </div>
    );
  }
  onValueChanged(e) {
    this.setState({
      value: e.value
    });
  }
  buttonClick() {
    this.setState({
      gridFilterValue: this.state.value
    });
  }
}

export default App;
