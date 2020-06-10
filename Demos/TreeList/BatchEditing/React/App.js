import React from 'react';
import { TreeList, Editing, Column, RequiredRule, Lookup } from 'devextreme-react/tree-list';
import { tasks, employees } from './data.js';

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
      <div id="tree-list-demo">
        <TreeList
          id="tasks"
          dataSource={tasks}
          columnAutoWidth={true}
          wordWrapEnabled={true}
          showBorders={true}
          keyExpr="Task_ID"
          parentIdExpr="Task_Parent_ID"
          onInitNewRow={this.onInitNewRow}
        >
          <Editing
            allowAdding={true}
            allowUpdating={true}
            allowDeleting={true}
            mode="batch" />
          <Column
            minWidth={250}
            dataField="Task_Subject">
            <RequiredRule />
          </Column>
          <Column
            minWidth={120}
            dataField="Task_Assigned_Employee_ID"
            caption="Assigned">
            <Lookup
              dataSource={employees}
              valueExpr="ID"
              displayExpr="Name" />
            <RequiredRule />
          </Column>
          <Column
            minWidth={120}
            dataField="Task_Status"
            caption="Status">
            <Lookup
              dataSource={statuses} />
          </Column>
          <Column
            dataField="Task_Start_Date"
            caption="Start Date"
            dataType="date" />
          <Column
            dataField="Task_Due_Date"
            caption="Due Date"
            dataType="date" />
        </TreeList>
      </div>
    );
  }
  onInitNewRow(e) {
    e.data.Task_Status = 'Not Started';
    e.data.Task_Start_Date = new Date();
    e.data.Task_Due_Date = new Date();
  }
}

export default App;
