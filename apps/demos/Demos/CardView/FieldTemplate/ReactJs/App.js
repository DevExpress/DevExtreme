import React from 'react';
import CardView, { CardHeader, Column, Paging } from 'devextreme-react/card-view';
import { tasks } from './data.js';
import EmployeeComponent from './Employee.js';
import HeaderTemplate from './HeaderTemplate.js';
import PriorityComponent from './Priority.js';
import Progress from './Progress.js';

const App = () => (
  <CardView
    dataSource={tasks}
    cardsPerRow="auto"
    cardMinWidth={240}
  >
    <CardHeader
      visible={true}
      render={(model) => <HeaderTemplate text={model.card.data.Task_Subject} />}
    />
    <Paging pageSize={12} />

    <Column
      dataField="Task_Priority"
      caption="Priority"
      fieldValueRender={(model) => <PriorityComponent priorityID={model.field.value} />}
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
      fieldValueRender={(model) => <EmployeeComponent employeeID={model.field.value} />}
    />
    <Column
      dataField="Task_Status"
      caption="Status"
    />
    <Column
      dataField="Task_Completion"
      caption="Completed"
      fieldRender={(model) => <Progress value={model.field.value} />}
    />
  </CardView>
);
export default App;
