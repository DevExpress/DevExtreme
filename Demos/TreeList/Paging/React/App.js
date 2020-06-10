import React from 'react';
import { TreeList, Scrolling, Paging, Pager, Column, Lookup } from 'devextreme-react/tree-list';
import { tasks, employees } from './data.js';

const allowedPageSizes = [5, 10, 20];

const statuses = [
  'Not Started',
  'Need Assistance',
  'In Progress',
  'Deferred',
  'Completed'
];

class App extends React.Component {
  render() {
    return (
      <TreeList
        id="tasks"
        dataSource={tasks}
        autoExpandAll={true}
        columnAutoWidth={true}
        showBorders={true}
        keyExpr="Task_ID"
        parentIdExpr="Task_Parent_ID"
      >
        <Scrolling
          mode="standard" />
        <Paging
          enabled={true}
          defaultPageSize={10} />
        <Pager
          showPageSizeSelector={true}
          allowedPageSizes={allowedPageSizes}
          showInfo={true} />
        <Column
          width={390}
          dataField="Task_Subject" />
        <Column
          dataField="Task_Assigned_Employee_ID"
          caption="Assigned">
          <Lookup
            dataSource={employees}
            valueExpr="ID"
            displayExpr="Name" />
        </Column>
        <Column
          dataField="Task_Status"
          caption="Status">
          <Lookup
            dataSource={statuses} />
        </Column>
        <Column
          width={100}
          dataField="Task_Start_Date"
          caption="Start Date"
          dataType="date" />
        <Column
          width={100}
          dataField="Task_Due_Date"
          caption="Due Date"
          dataType="date" />
      </TreeList>
    );
  }
}

export default App;
