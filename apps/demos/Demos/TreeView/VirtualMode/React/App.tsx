import React from 'react';
import TreeView from 'devextreme-react/tree-view';

import AspNetData from 'devextreme-aspnet-data-nojquery';

const dataSource = AspNetData.createStore({
  loadUrl: 'https://js.devexpress.com/Demos/NetCore/api/TreeViewPlainData',
  key: 'ID',
});
const App = () => (
  <React.Fragment>
    <TreeView
      dataSource={dataSource}
      dataStructure="plain"
      keyExpr="ID"
      displayExpr="Text"
      parentIdExpr="CategoryId"
      hasItemsExpr="IsGroup"
      virtualModeEnabled={true}
      rootValue={null}
    />
  </React.Fragment>
);

export default App;
