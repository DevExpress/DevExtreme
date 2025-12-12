import React from 'react';
import { List } from 'devextreme-react/list';
import service from './data.ts';
import type { Employee, Task } from './data.ts';

function itemRender(data: Task) {
  return <div>{data.Subject}</div>;
}

interface EmployeeTemplateProps {
  data: Employee;
}

function EmployeeTemplate(props: EmployeeTemplateProps) {
  const tasks = service
    .getTasks()
    .filter((task: { EmployeeID: any; }) => task.EmployeeID === props.data.ID);
  const {
    FirstName, LastName, Picture, Position, Notes,
  } = props.data;
  const completedTasks = tasks.filter((task: { Status: string; }) => task.Status === 'Completed');

  return (
    <React.Fragment>
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
          dataSource={tasks}
          showSelectionControls={true}
          selectedItems={completedTasks}
          disabled={true}
          selectionMode="multiple"
          itemRender={itemRender}
        ></List>
      </div>
    </React.Fragment>
  );
}

export default EmployeeTemplate;
