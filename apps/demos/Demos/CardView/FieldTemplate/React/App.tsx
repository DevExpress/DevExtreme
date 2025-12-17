import React from 'react';

import CardView, { CardHeader, Column, Paging } from 'devextreme-react/card-view';
import type { CardViewTypes } from 'devextreme-react/card-view';

import { tasks } from './data.ts';
import type { Task } from './data.ts';
import EmployeeComponent from './Employee.tsx';
import HeaderTemplate from './HeaderTemplate.tsx';
import PriorityComponent from './Priority.tsx';
import Progress from './Progress.tsx';

const App = () => (
  <CardView
    dataSource={tasks}
    cardsPerRow="auto"
    cardMinWidth={240}
  >
    <CardHeader
      visible={true}
      render={
        (model: CardViewTypes.CardTemplateData) => <HeaderTemplate text={((model.card.data) as Task).Task_Subject} />
      }
    />
    <Paging pageSize={12} />

    <Column
      dataField="Task_Priority"
      caption="Priority"
      fieldValueRender={
        (model: CardViewTypes.FieldTemplateData) => <PriorityComponent priorityID={model.field.value} />
      }
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
      fieldValueRender={
        (model: CardViewTypes.FieldTemplateData) => <EmployeeComponent employeeID={model.field.value} />
      }
    />
    <Column
      dataField="Task_Status"
      caption="Status"
    />
    <Column
      dataField="Task_Completion"
      caption="Completed"
      fieldRender={
        (model: CardViewTypes.FieldTemplateData) => <Progress value={model.field.value} />
      }
    />
  </CardView>
);

export default App;
