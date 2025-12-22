import React from 'react';
import 'whatwg-fetch';

import type { LoadOptions } from 'devextreme-react/common/data';
import { TreeList, RemoteOperations, Column } from 'devextreme-react/tree-list';
import type { TreeListTypes } from 'devextreme-react/tree-list';

const dataSource = {
  async load(loadOptions: LoadOptions) {
    const parentIdsParam = loadOptions.parentIds;
    const url = new URL('https://js.devexpress.com/Demos/NetCore/api/treeListData');
    if (parentIdsParam) {
      parentIdsParam.forEach((id: string) => {
        url.searchParams.append('parentIds', id);
      });
    }

    const result = await fetch(url.toString());

    if (result.status === 200) {
      return result.json();
    }

    throw new Error('Data Loading Error');
  },
};

const customizeText = (e: TreeListTypes.ColumnCustomizeTextArg) => {
  if (e.value !== null) {
    return `${Math.ceil(e.value / 1024)} KB`;
  }
  return '';
};

const App = () => (
  <TreeList
    id="treelist"
    dataSource={dataSource as any}
    showBorders={true}
    keyExpr="id"
    parentIdExpr="parentId"
    hasItemsExpr="hasItems"
    rootValue=""
  >
    <RemoteOperations filtering={true} />
    <Column dataField="name" />
    <Column width={100} customizeText={customizeText} dataField="size" />
    <Column width={150} dataField="createdDate" dataType="date" />
    <Column width={150} dataField="modifiedDate" dataType="date" />
  </TreeList>
);

export default App;
