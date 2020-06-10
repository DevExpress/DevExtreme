import React from 'react';
import TreeView from 'devextreme-react/tree-view';

import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';

const dataSource = new DataSource({
  store: new ODataStore({
    url: 'https://js.devexpress.com/Demos/WidgetsGallery/odata/HierarchicalItems'
  })
});
class App extends React.Component {
  render() {
    return (
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
  }
}

export default App;
