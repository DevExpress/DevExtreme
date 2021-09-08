import React from 'react';
import Diagram, {
  Nodes, AutoLayout, ContextToolbox, Toolbox, Group,
} from 'devextreme-react/diagram';
import { createStore } from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/Mvc/api/DiagramEmployees';

const dataSource = createStore({
  key: 'ID',
  loadUrl: `${url}/Employees`,
  insertUrl: `${url}/InsertEmployee`,
  updateUrl: `${url}/UpdateEmployee`,
  deleteUrl: `${url}/DeleteEmployee`,
  onBeforeSend(method, ajaxOptions) {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
  onInserting(values) {
    values.ID = 0;
    values.Title = values.Title || 'New Position';
    values.Prefix = 'Mr';
    values.FullName = 'New Employee';
    values.City = 'LA';
    values.State = 'CA';
    values.HireDate = new Date();
  },
});

const shapes = ['rectangle'];

class App extends React.Component {
  render() {
    return (
      <Diagram id="diagram">
        <Nodes dataSource={dataSource} keyExpr="ID" textExpr="Title" parentKeyExpr="HeadID">
          <AutoLayout type="tree" />
        </Nodes>
        <ContextToolbox shapeIconsPerRow={2} width={100} shapes={shapes}>
        </ContextToolbox>
        <Toolbox showSearch={false} shapeIconsPerRow={2}>
          <Group title="Items" shapes={shapes} />
        </Toolbox>
      </Diagram>
    );
  }
}

export default App;
