import React from 'react';
import Diagram, { Nodes, AutoLayout, ContextToolbox, Toolbox, Group } from 'devextreme-react/diagram';
import { createStore } from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/Mvc/api/DiagramEmployees';

const dataSource = createStore({
  key: 'ID',
  loadUrl: `${url}/Employees`,
  insertUrl: `${url}/InsertEmployee`,
  updateUrl: `${url}/UpdateEmployee`,
  deleteUrl: `${url}/DeleteEmployee`,
  onBeforeSend: function(method, ajaxOptions) {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
  onInserting: function(values) {
    values['ID'] = 0;
    values['Title'] = values['Title'] || 'New Position';
    values['Prefix'] = 'Mr';
    values['FullName'] = 'New Employee';
    values['City'] = 'LA';
    values['State'] = 'CA';
    values['HireDate'] = new Date();
  }
});

class App extends React.Component {
  render() {
    return (
      <Diagram id="diagram">
        <Nodes dataSource={dataSource} keyExpr="ID" textExpr="Title" parentKeyExpr="HeadID">
          <AutoLayout type="tree" />
        </Nodes>
        <ContextToolbox shapeIconsPerRow={2} width={100} shapes={['rectangle']}>
        </ContextToolbox>
        <Toolbox showSearch={false} shapeIconsPerRow={2}>
          <Group title="Items" shapes={['rectangle']} />
        </Toolbox>
      </Diagram>
    );
  }
}

export default App;
