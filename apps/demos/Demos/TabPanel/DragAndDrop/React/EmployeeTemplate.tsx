import React from 'react';
import { List } from 'devextreme-react/list';
import { tasks } from './data.ts';
import type { Employee, Task } from './types.ts';

function itemRender(data: Task) {
  return <div>{data.Subject}</div>;
}

interface EmployeeTemplateProps {
  data: Employee;
}

function EmployeeTemplate({ data }: EmployeeTemplateProps) {
  const employeeTasks = tasks.filter((task: { EmployeeID: any; }) => task.EmployeeID === data.ID);
  const {
    FirstName,
    LastName,
    Picture,
    Position,
    Notes,
  } = data;
  const completedTasks = employeeTasks.filter((task: { Status: string; }) => task.Status === 'Completed');

  return (
    <>
      <div className="employeeInfo">
        <img alt={`${FirstName} ${LastName}`} className="employeePhoto" src={Picture} />
        <p className="employeeNotes">
          <b>{`Position: ${Position}`}</b>
          <br />
          {Notes}
        </p>
      </div>
      <div className="caption">{`${FirstName} ${LastName}'s Tasks:`}</div>
      <div className="task-list">
        <List
          dataSource={employeeTasks}
          showSelectionControls={true}
          selectedItems={completedTasks}
          disabled={true}
          selectionMode="multiple"
          itemRender={itemRender}
        ></List>
      </div>
    </>
  );
}

export default EmployeeTemplate;
