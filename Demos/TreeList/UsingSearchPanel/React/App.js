import React from 'react';
import { TreeList, SearchPanel, Column, Lookup } from 'devextreme-react/tree-list';
import { tasks, employees } from './data.js';

const dataSource = [
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
        columnAutoWidth={true}
        wordWrapEnabled={true}
        showBorders={true}
        keyExpr="Task_ID"
        parentIdExpr="Task_Parent_ID"
      >
        <SearchPanel visible={true} />
        <Column minWidth={300} dataField="Task_Subject" />
        <Column minWidth={120} dataField="Task_Assigned_Employee_ID" caption="Assigned">
          <Lookup dataSource={employees} valueExpr="ID" displayExpr="Name" />
        </Column>
        <Column minWidth={120} dataField="Task_Status" caption="Status">
          <Lookup dataSource={dataSource} />
        </Column>
        <Column dataField="Task_Start_Date" caption="Start Date" dataType="date" />
        <Column dataField="Task_Due_Date" caption="Due Date" dataType="date" />
      </TreeList>
    );
  }
}

export default App;
