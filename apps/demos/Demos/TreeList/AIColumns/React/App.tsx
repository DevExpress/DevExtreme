import React from 'react';
import TreeList, { Column, Scrolling } from 'devextreme-react/tree-list';
import { employees, aiIntegration } from './data.ts';
import Employee from './Employee.tsx';
import Status from './Status.tsx';
import Email from './Email.tsx';

const treeConfig = {
  paging: {
    enabled: true,
    pageSize: 10,
  },
  ai: {
    prompt: 'Identify department for each employee. It should be one of the following department types:  "Management", "Human Resources", "IT", "Shipping", "Support", "Sales",  "Engineering". Use "Engineering" by default.',
    mode: 'auto' as const,
    noDataText: 'No data',
  },
};

const onAIColumnRequestCreating = (e) => {
  e.data = e.data.map((item) => ({
    ID: item.ID,
    First_Name: item.First_Name,
    Last_Name: item.Last_Name,
    Title: item.Title,
  }));
};

export default function App() {
  return (
    <TreeList
      id="employees"
      showBorders={true}
      dataSource={employees}
      keyExpr="ID"
      parentIdExpr="Head_ID"
      autoExpandAll={true}
      aiIntegration={aiIntegration}
      paging={treeConfig.paging}
      onAIColumnRequestCreating={onAIColumnRequestCreating}
    >
      <Scrolling mode="standard" />
      <Column
        caption="Employee"
        width={260}
        cellRender={Employee}
        cssClass="name_cell"
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
        type="ai"
        ai={treeConfig.ai}
        width={180}
        fixed={true}
        fixedPosition="right"
        cssClass="ai__cell"
      />
    </TreeList>
  );
}
