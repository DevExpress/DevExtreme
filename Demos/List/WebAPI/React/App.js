import React from 'react';

import List from 'devextreme-react/list';
import ProductInfo from './ProductInfo.js';

import DataSource from 'devextreme/data/data_source';
import { createStore } from 'devextreme-aspnet-data-nojquery';

const dataSource = new DataSource({
  store: createStore({
    loadUrl: 'https://js.devexpress.com/Demos/Mvc/api/ListData/Orders'
  }),
  sort: 'ProductName',
  group: 'Category.CategoryName',
  paginate: true,
  pageSize: 1,
  filter: ['UnitPrice', '>', 15]
});

class App extends React.Component {
  render() {
    return (
      <div className="list-container">
        <List
          dataSource={dataSource}
          height={600}
          grouped={true}
          collapsibleGroups={true}
          selectionMode="multiple"
          showSelectionControls={true}
          pageLoadMode="scrollBottom"
          itemRender={ProductInfo} />
      </div>
    );
  }
}

export default App;
