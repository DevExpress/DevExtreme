import React from 'react';
import { DataGrid, Column } from 'devextreme-react/data-grid';
import ArrayStore from 'devextreme/data/array_store';
import DataSource from 'devextreme/data/data_source';
import { tasks } from './data.js';

const getTasks = (key) =>
  new DataSource({
    store: new ArrayStore({
      data: tasks,
      key: 'ID',
    }),
    filter: ['EmployeeID', '=', key],
  });
const completedValue = (rowData) => rowData.Status === 'Completed';
const DetailTemplate = (props) => {
  const { FirstName, LastName } = props.data.data;
  const dataSource = getTasks(props.data.key);
  return (
    <React.Fragment>
      <div className="master-detail-caption">{`${FirstName} ${LastName}'s Tasks:`}</div>
      <DataGrid
        dataSource={dataSource}
        showBorders={true}
        columnAutoWidth={true}
      >
        <Column dataField="Subject" />
        <Column
          dataField="StartDate"
          dataType="date"
        />
        <Column
          dataField="DueDate"
          dataType="date"
        />
        <Column dataField="Priority" />
        <Column
          caption="Completed"
          dataType="boolean"
          calculateCellValue={completedValue}
        />
      </DataGrid>
    </React.Fragment>
  );
};
export default DetailTemplate;
