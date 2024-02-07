import React from 'react';
import TreeView, { TreeViewTypes } from 'devextreme-react/tree-view';
import 'whatwg-fetch';

const createChildren = (parent: TreeViewTypes.Node) => {
  const parentId = parent ? parent.itemData.id : '';

  return fetch(`https://js.devexpress.com/Demos/Mvc/api/TreeViewData?parentId=${parentId}`)
    .then((response) => response.json())
    .catch(() => { throw new Error('Data Loading Error'); });
};

const App = () => (
  <React.Fragment>
    <TreeView
      id="simple-treeview"
      dataStructure="plain"
      rootValue=""
      height={500}
      expandNodesRecursive={false}
      createChildren={createChildren}
    />
  </React.Fragment>
);

export default App;
