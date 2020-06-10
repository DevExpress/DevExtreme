import React from 'react';
import { DataGrid, Column } from 'devextreme-react/data-grid';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import service from './data.js';

const tasks = service.getTasks();

class DetailTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.dataSource = getTasks(props.data.key);
  }
  render() {
    let { FirstName, LastName } = this.props.data.data;
    return (
      <React.Fragment>
        <div className="master-detail-caption">
          {`${FirstName} ${LastName}'s Tasks`}
        </div>
        <DataGrid
          dataSource={this.dataSource}
          showBorders={true}
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

function getTasks(key) {
  return new DataSource({
    store: new ArrayStore({
      data: tasks,
      key: 'ID'
    }),
    filter: ['EmployeeID', '=', key]
  });
}

export default DetailTemplate;
