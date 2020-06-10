import React from 'react';
import { DataGrid, Column } from 'devextreme-react/data-grid';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import service from './data.js';

const tasks = service.getTasks();

class EmployeeTemplate extends React.Component {
  constructor(props) {
    super(props);

    this.tasks = getTasks(props.data.ID);
  }
  render() {
    let { FirstName, LastName, Picture, Position, Notes } = this.props.data;

    return (
      <React.Fragment>
        <div className="employeeInfo">
          <img className="employeePhoto" src={Picture} />
          <p className="employeeNotes"><b>{`Position: ${Position}`}</b><br />{Notes}</p>
        </div>
        <div className="caption">
          {`${FirstName} ${LastName}'s Tasks:`}
        </div>
        <DataGrid
          dataSource={this.tasks}
          showBorders={false}
          showColumnLines={false}
          rowAlternationEnabled={true}
          columnAutoWidth={true}
        >
          <Column dataField="Subject" />
          <Column dataField="StartDate" dataType="date" />
          <Column dataField="DueDate" dataType="date" />
          <Column dataField="Priority" />
          <Column
            caption="Completed"
            dataType="boolean"
            calculateCellValue={this.completedValue}
          />
        </DataGrid>
      </React.Fragment>
    );
  }
  completedValue(rowData) {
    return rowData.Status === 'Completed';
  }
}

function getTasks(id) {
  return new DataSource({
    store: new ArrayStore({
      data: tasks,
      key: 'ID'
    }),
    filter: ['EmployeeID', '=', id]
  });
}

export default EmployeeTemplate;
