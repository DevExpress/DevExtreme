import React from 'react';
import { TreeList, RemoteOperations, Column } from 'devextreme-react/tree-list';
import 'whatwg-fetch';

const dataSource = {
  load: function(loadOptions) {
    let parentIdsParam = loadOptions.parentIds;

    return fetch(`https://js.devexpress.com/Demos/Mvc/api/treeListData?parentIds=${parentIdsParam}`)
      .then(response => response.json())
      .catch(() => { throw 'Data Loading Error'; });
  }
};

class App extends React.Component {
  render() {
    return (
      <TreeList
        id="treelist"
        dataSource={dataSource}
        showBorders={true}
        keyExpr="id"
        parentIdExpr="parentId"
        hasItemsExpr="hasItems"
        rootValue=""
      >
        <RemoteOperations filtering={true} />
        <Column dataField="name" />
        <Column width={100} customizeText={this.customizeText} dataField="size" />
        <Column width={150} dataField="createdDate" dataType="date" />
        <Column width={150} dataField="modifiedDate" dataType="date" />
      </TreeList>
    );
  }

  customizeText(e) {
    if (e.value !== null) {
      return `${Math.ceil(e.value / 1024) } KB`;
    }
  }
}

export default App;
