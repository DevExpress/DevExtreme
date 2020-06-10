import React from 'react';
import TreeView from 'devextreme-react/tree-view';
import 'whatwg-fetch';

class App extends React.Component {
  render() {

    return (
      <React.Fragment>
        <TreeView
          id="simple-treeview"
          dataStructure="plain"
          rootValue=""
          height={500}
          createChildren={this.createChildren}
        />
      </React.Fragment>
    );
  }
  createChildren(parent) {
    let parentId = parent ? parent.itemData.id : '';

    return fetch(`https://js.devexpress.com/Demos/Mvc/api/TreeViewData?parentId=${parentId}`)
      .then(response => response.json())
      .catch(() => { throw 'Data Loading Error'; });
  }
}

export default App;
