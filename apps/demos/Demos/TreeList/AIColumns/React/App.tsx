import React from 'react';

import TreeList, {
  Column,
  Scrolling,
  Paging,
  AI,
} from 'devextreme-react/tree-list';
import type { TreeListTypes } from 'devextreme-react/tree-list';

import { employees } from './data.ts';
import { aiIntegration } from './service.ts';
import type { Employee as EmployeeType } from './types.ts';
import Employee from './Employee.tsx';
import Status from './Status.tsx';

const onAIColumnRequestCreating = (
  e: TreeListTypes.AIColumnRequestCreatingEvent<Partial<EmployeeType>>
) => {
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
      onAIColumnRequestCreating={onAIColumnRequestCreating}
      className="ai__grid"
    >
      <Paging enabled={true} pageSize={10} />
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
      />
      <Column
        name="AI Column"
        caption="AI Column"
        type="ai"
        width={180}
        fixed={true}
        fixedPosition="right"
        cssClass="ai__cell"
      >
        <AI
          mode="auto"
          noDataText="No data"
          prompt="Identify the department where the employee works. Select from the following department list: 'Management', 'Human Resources', 'IT', 'Shipping', 'Support', 'Sales', 'Engineering'. Use 'Engineering' if you cannot find a better match."
        />
      </Column>
    </TreeList>
  );
}
