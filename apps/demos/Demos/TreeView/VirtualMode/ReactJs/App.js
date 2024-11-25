import React from 'react';
import TreeView from 'devextreme-react/tree-view';
import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';

const dataSource = new DataSource({
  store: new ODataStore({
    version: 2,
    url: 'https://js.devexpress.com/Demos/WidgetsGallery/odata/HierarchicalItems',
  }),
});
const App = () => (
  <React.Fragment>
    <TreeView
      dataSource={dataSource}
      dataStructure="plain"
      keyExpr="Id"
      displayExpr="Name"
      parentIdExpr="CategoryId"
      hasItemsExpr="IsGroup"
      virtualModeEnabled={true}
    />
  </React.Fragment>
);
export default App;
