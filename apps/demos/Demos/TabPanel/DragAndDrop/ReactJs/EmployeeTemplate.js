import React from 'react';
import { List } from 'devextreme-react/list';
import { tasks } from './data.js';

function itemRender(data) {
  return <div>{data.Subject}</div>;
}
function EmployeeTemplate({ data }) {
  const employeeTasks = tasks.filter((task) => task.EmployeeID === data.ID);
  const {
    FirstName, LastName, Picture, Position, Notes,
  } = data;
  const completedTasks = employeeTasks.filter((task) => task.Status === 'Completed');
  return (
    <>
      <div className="employeeInfo">
        <img
          alt={`${FirstName} ${LastName}`}
          className="employeePhoto"
          src={Picture}
        />
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
