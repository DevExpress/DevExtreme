import React from 'react';
import {
  DataGrid, HeaderFilter, Search, Column,
} from 'devextreme-react/data-grid';
import { employees } from './data.js';

const searchFields = ['City', 'State'];
const searchEditorOptions = { placeholder: 'Search city or state' };

class App extends React.Component {
  render() {
    return (
      <DataGrid
        id="employees"
        dataSource={employees}
        columnAutoWidth={true}
        showRowLines={true}
        showBorders={true}
        keyExpr="ID"
      >
        <HeaderFilter visible={true} />

        <Column dataField="FirstName" />
        <Column dataField="LastName" />
        <Column dataField="Position">
          <HeaderFilter allowSelectAll={false}>
            <Search enabled={true} />
          </HeaderFilter>
        </Column>
        <Column dataField="City">
          <HeaderFilter>
            <Search
              enabled={true}
              searchExpr={searchFields}
              editorOptions={searchEditorOptions} />
          </HeaderFilter>
        </Column>
        <Column dataField="HomePhone" />
        <Column dataField="HireDate" dataType="date" />
      </DataGrid>
    );
  }
}

export default App;
