import React from 'react';
import TreeView from 'devextreme-react/tree-view';
import type { TreeViewTypes } from 'devextreme-react/tree-view';
import 'whatwg-fetch';

const createChildren = (parent: TreeViewTypes.Node): Promise<Response> => {
  const parentId = parent ? parent.itemData.id : '';

  return fetch(`https://js.devexpress.com/Demos/NetCore/api/TreeViewData?parentId=${parentId}`)
    .then((response: Response): Promise<Response> => response.json())
    .catch((): never => { throw new Error('Data Loading Error'); });
};

const App = () => (
  <>
    <TreeView
      id="simple-treeview"
      dataStructure="plain"
      rootValue=""
      height={500}
      expandNodesRecursive={false}
      createChildren={createChildren}
    />
  </>
);

export default App;
