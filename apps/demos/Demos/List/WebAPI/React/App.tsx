import React from 'react';
import List from 'devextreme-react/list';
import DataSource from 'devextreme/data/data_source';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import ProductInfo from './ProductInfo.tsx';

const dataSource = new DataSource({
  store: createStore({
    key: 'ProductID',
    loadUrl: 'https://js.devexpress.com/Demos/Mvc/api/ListData/Orders',
  }),
  sort: 'ProductName',
  group: 'Category.CategoryName',
  paginate: true,
  pageSize: 1,
  filter: ['UnitPrice', '>', 15],
});

export default function App() {
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
        itemRender={ProductInfo}
      />
    </div>
  );
}
