import React from 'react';

import { DataGrid, Column } from 'devextreme-react/data-grid';
import type { DataGridTypes } from 'devextreme-react/data-grid';
import { ArrayStore, DataSource } from 'devextreme-react/common/data';

import { tasks } from './data.ts';
import type { Task } from './data.ts';

const getTasks = (key: number) => new DataSource({
  store: new ArrayStore({
    data: tasks,
    key: 'ID',
  }),
  filter: ['EmployeeID', '=', key],
});

const completedValue = (rowData: Task) => rowData.Status === 'Completed';

const DetailTemplate = (props: DataGridTypes.MasterDetailTemplateData) => {
  const { FirstName, LastName } = props.data.data;
  const dataSource = getTasks(props.data.key);

  return (
    <>
      <div className="master-detail-caption">
        {`${FirstName} ${LastName}'s Tasks:`}
      </div>
      <DataGrid
        dataSource={dataSource}
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
          calculateCellValue={completedValue}
        />
      </DataGrid>
    </>
  );
};

export default DetailTemplate;
