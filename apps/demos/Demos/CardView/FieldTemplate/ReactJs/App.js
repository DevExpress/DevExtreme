import React from 'react';
import CardView, { CardHeader, Column, Paging } from 'devextreme-react/card-view';
import { tasks } from './data.js';
import EmployeeComponent from './Employee.js';
import HeaderTemplate from './HeaderTemplate.js';
import PriorityComponent from './Priority.js';
import Progress from './Progress.js';

const headerRender = (model) => <HeaderTemplate text={model.card.data.Task_Subject} />;
const priorityFieldValueRender = (model) => <PriorityComponent priorityID={model.field.value} />;
const employeeFieldValueRender = (model) => <EmployeeComponent employeeID={model.field.value} />;
const completionFieldRender = (model) => <Progress value={model.field.value} />;
const App = () => (
  <CardView
    dataSource={tasks}
    cardsPerRow="auto"
    cardMinWidth={240}
  >
    <CardHeader
      visible={true}
      render={headerRender}
    />
    <Paging pageSize={12} />

    <Column
      dataField="Task_Priority"
      caption="Priority"
      fieldValueRender={priorityFieldValueRender}
    />
    <Column
      dataField="Task_Start_Date"
      caption="Start Date"
      dataType="date"
    />
    <Column
      dataField="Task_Due_Date"
      caption="End Date"
      dataType="date"
    />
    <Column
      dataField="Task_Assigned_Employee_ID"
      caption="Assigned to"
      fieldValueRender={employeeFieldValueRender}
    />
    <Column
      dataField="Task_Status"
      caption="Status"
    />
    <Column
      dataField="Task_Completion"
      caption="Completed"
      fieldRender={completionFieldRender}
    />
  </CardView>
);
export default App;
