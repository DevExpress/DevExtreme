import React from 'react';

import DataGrid, { Column, ColumnChooser } from 'devextreme-react/data-grid';
import { countries } from './data.js';

const gdpFormat = {
  type: 'percent',
  precision: 1
};

class App extends React.Component {

  render() {
    return (
      <DataGrid
        id="grid"
        dataSource={countries}
        keyExpr="ID"
        columnAutoWidth={true}
        allowColumnReordering={true}
        showBorders={true}
      >
        <ColumnChooser enabled={true} />
        <Column dataField="Country" />
        <Column dataField="Area" headerCellRender={this.renderAreaCellHeader} />
        <Column caption="Population">
          <Column
            dataField="Population_Total"
            caption="Total"
            format="fixedPoint"
          />
          <Column
            dataField="Population_Urban"
            caption="Urban"
            format="percent"
          />
        </Column>
        <Column caption="Nominal GDP">
          <Column
            dataField="GDP_Total"
            caption="Total, mln $"
            format="fixedPoint"
            sortOrder="desc"
          />
          <Column caption="By Sector">
            <Column
              dataField="GDP_Agriculture"
              caption="Agriculture"
              format={gdpFormat}
              width={95}
            />
            <Column
              dataField="GDP_Industry"
              caption="Industry"
              format={gdpFormat}
              width={80}
            />
            <Column
              dataField="GDP_Services"
              caption="Services"
              format={gdpFormat}
              width={85}
            />
          </Column>
        </Column>
      </DataGrid>
    );
  }

  renderAreaCellHeader() {
    return <div>Area, km<sup>2</sup></div>;
  }
}

export default App;
