import React from 'react';

import { Template } from 'devextreme-react/core/template';
import TreeList, { Column, ColumnChooser, HeaderFilter, SearchPanel, Selection, Lookup } from 'devextreme-react/tree-list';

import { employees, priorities, tasks } from './data.js';
import EmployeeCell from './EmployeeCell.js';

class App extends React.Component {
  render() {
    return (
      <TreeList
        dataSource={dataSourceOptions}
        showBorders={true}
        columnAutoWidth={true}
        wordWrapEnabled={true}
        defaultExpandedRowKeys={[1, 2]}
        defaultSelectedRowKeys={[1, 29, 42]}
        keyExpr="Task_ID"
        parentIdExpr="Task_Parent_ID"
        id="tasks"
      >
        <SearchPanel visible={true} width={250} />
        <HeaderFilter visible={true} />
        <Selection mode="multiple" />
        <ColumnChooser enabled={true} />

        <Column dataField="Task_Subject" width={300} />
        <Column
          dataField="Task_Assigned_Employee_ID"
          caption="Assigned"
          allowSorting={true}
          minWidth={200}
          cellTemplate="employeeTemplate"
        >
          <Lookup dataSource={employees} displayExpr="Name" valueExpr="ID" />
        </Column>
        <Column
          dataField="Task_Status"
          caption="Status"
          minWidth={100}
        >
          <Lookup dataSource={statuses} />
        </Column>
        <Column
          dataField="Task_Priority"
          caption="Priority"
          visible={false}
        >
          <Lookup dataSource={priorities} valueExpr="id" displayExpr="value" />
        </Column>
        <Column
          dataField="Task_Completion"
          caption="% Completed"
          minWidth={100}
          customizeText={customizeTaskCompletionText}
          visible={false}
        />
        <Column
          dataField="Task_Start_Date"
          caption="Start Date"
          dataType="date"
        />
        <Column
          dataField="Task_Due_Date"
          caption="Due Date"
          dataType="date"
        />

        <Template name="employeeTemplate" render={EmployeeCell} />
      </TreeList>
    );
  }
}

const dataSourceOptions = {
  store: tasks.map(function(task) {
    employees.forEach(function(employee) {
      if (task.Task_Assigned_Employee_ID === employee.ID) {
        task.Task_Assigned_Employee = employee;
      }
    });
    return task;
  })
};

function customizeTaskCompletionText(cellInfo) {
  return `${cellInfo.valueText}%`;
}

const statuses = [
  'Not Started',
  'Need Assistance',
  'In Progress',
  'Deferred',
  'Completed'
];

export default App;
