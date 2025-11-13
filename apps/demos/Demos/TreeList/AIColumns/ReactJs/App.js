import React, { useCallback } from 'react';
import TreeList, { Column, RemoteOperations } from 'devextreme-react/tree-list';
import { employees, aiIntegration } from './data.js';
import Name from './Name.js';
import Status from './Status.js';
import Email from './Email.js';

const treeConfig = {
  scrolling: {
    mode: 'standard',
  },
  paging: {
    enabled: true,
    pageSize: 10,
  },
  ai: {
    prompt:
      'Identify department for each employee. It should be one of the following department types:  "Management", "Human Resources", "IT", "Shipping", "Support", "Sales",  "Engineering". Use "Engineering" by default.',
    mode: 'auto',
    noDataText: 'No data',
  },
};
export default function App() {
  const onAIColumnRequestCreating = useCallback((e) => {
    e.data = e.data.map((item) => ({
      ID: item.ID,
      First_Name: item.First_Name,
      Last_Name: item.Last_Name,
      Title: item.Title,
    }));
  }, []);
  return (
    <TreeList
      id="employees"
      dataSource={employees}
      keyExpr="ID"
      parentIdExpr="Head_ID"
      autoExpandAll={true}
      aiIntegration={aiIntegration}
      scrolling={treeConfig.scrolling}
      paging={treeConfig.paging}
      onAIColumnRequestCreating={onAIColumnRequestCreating}
    >
      <RemoteOperations grouping={false} />
      <Column
        caption="Employee"
        width={260}
        cellRender={Name}
      />
      <Column
        dataField="Title"
        caption="Position"
        width={140}
      />
      <Column
        dataField="Status"
        minWidth={180}
        cellRender={Status}
      />
      <Column
        dataField="City"
        width={180}
      />
      <Column
        dataField="State"
        width={140}
      />
      <Column
        dataField="Email"
        minWidth={200}
        cellRender={Email}
      />
      <Column
        name="AI Column"
        caption="AI Column"
        type="drag"
        ai={treeConfig.ai}
        width={180}
        fixed={true}
        fixedPosition="right"
        cssClass="ai__cell"
      />
    </TreeList>
  );
}
