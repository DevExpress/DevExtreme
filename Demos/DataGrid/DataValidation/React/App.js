import React from 'react';

import DataGrid, {
  Column,
  Editing,
  Paging,
  RequiredRule,
  PatternRule,
  EmailRule,
  AsyncRule
} from 'devextreme-react/data-grid';

import { createStore } from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/Mvc/api/DataGridEmployeesValidation';
const dataSource = createStore({
  key: 'ID',
  loadUrl: url,
  insertUrl: url,
  updateUrl: url,
  deleteUrl: url,
  onBeforeSend: (method, ajaxOptions) => {
    ajaxOptions.xhrFields = { withCredentials: true };
  }
});

class App extends React.Component {

  render() {
    return (
      <React.Fragment>
        <DataGrid
          dataSource={dataSource}
          showBorders={true}
          columnAutoWidth={true}
          repaintChangesOnly={true}
        >
          <Paging enabled={false} />
          <Editing
            mode="batch"
            allowUpdating={true}
            allowAdding={true} />
          <Column dataField="FirstName">
            <RequiredRule />
          </Column>
          <Column dataField="LastName">
            <RequiredRule />
          </Column>
          <Column dataField="Position">
            <RequiredRule />
          </Column>
          <Column dataField="Phone">
            <RequiredRule />
            <PatternRule
              message={'Your phone must have "(555) 555-5555" format!'}
              pattern={/^\(\d{3}\) \d{3}-\d{4}$/i}
            />
          </Column>
          <Column dataField="Email">
            <RequiredRule />
            <EmailRule />
            <AsyncRule
              message="Email address is not unique"
              validationCallback={asyncValidation}
            />
          </Column>
        </DataGrid>
      </React.Fragment>
    );
  }
}

function asyncValidation(params) {
  return fetch('https://js.devexpress.com/Demos/Mvc/RemoteValidation/CheckUniqueEmailAddress', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;'
    },
    body: JSON.stringify({
      id: params.data.ID,
      email: params.value
    })
  }).then(response => response.json());
}

export default App;
