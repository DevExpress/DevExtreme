import React from 'react';
import { List } from 'devextreme-react/list';
import service from './data.js';

const tasks = service.getTasks();

function ItemTemplate(data) {
  return <div>{data.Subject}</div>;
}

class EmployeeTemplate extends React.Component {
  constructor(props) {
    super(props);

    this.tasks = tasks.filter(task => task.EmployeeID === props.data.ID);
  }
  render() {
    const { FirstName, LastName, Picture, Position, Notes } = this.props.data;

    return (
      <React.Fragment>
        <div className="employeeInfo">
          <img className="employeePhoto" src={Picture} />
          <p className="employeeNotes"><b>{`Position: ${Position}`}</b><br />{Notes}</p>
        </div>
        <div className="caption">
          {`${FirstName} ${LastName}'s Tasks:`}
        </div>
        <div className="task-list">
            <List
              dataSource={this.tasks}
              showSelectionControls={true}
              selectedItems={this.getCompletedTasks()}
              disabled={true}
              selectionMode="multiple"
              itemRender={ItemTemplate}>
            </List>
        </div>
      </React.Fragment>
    );
  }
  getCompletedTasks() {
    return this.tasks.filter(task => task.Status === 'Completed');
  }
}

export default EmployeeTemplate;
