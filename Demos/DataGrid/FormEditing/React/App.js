import React from 'react';

import DataGrid, {
  Column,
  FormItem,
  Editing,
  Paging,
  Lookup
} from 'devextreme-react/data-grid';
import 'devextreme-react/text-area';

import { employees, states } from './data.js';

const notesEditorOptions = { height: 100 };

class App extends React.Component {
  render() {
    return (
      <div id="data-grid-demo">
        <DataGrid
          dataSource={employees}
          keyExpr="ID"
          showBorders={true}
        >
          <Paging enabled={false} />
          <Editing
            mode="form"
            allowUpdating={true}
            allowAdding={true}
            allowDeleting={true} />
          <Column dataField="Prefix" caption="Title" width={70} />
          <Column dataField="FirstName" />
          <Column dataField="LastName" />
          <Column dataField="Position" width={170} />
          <Column dataField="StateID" caption="State" width={125}>
            <Lookup dataSource={states} valueExpr="ID" displayExpr="Name" />
          </Column>
          <Column dataField="BirthDate" dataType="date" />
          <Column dataField="Notes" visible={false}>
            <FormItem colSpan={2} editorType="dxTextArea" editorOptions={notesEditorOptions} />
          </Column>
        </DataGrid>
      </div>
    );
  }
}

export default App;
