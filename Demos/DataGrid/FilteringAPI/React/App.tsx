import React from 'react';
import DataGrid, { Column } from 'devextreme-react/data-grid';
import SelectBox from 'devextreme-react/select-box';
import 'devextreme/data/odata/store';

const dataSourceOptions = {
  store: {
    type: 'odata' as const,
    version: 2,
    url: 'https://js.devexpress.com/Demos/DevAV/odata/Tasks',
    key: 'Task_ID',
  },
  expand: 'ResponsibleEmployee',
  select: [
    'Task_ID',
    'Task_Subject',
    'Task_Start_Date',
    'Task_Status',
    'ResponsibleEmployee/Employee_Full_Name',
  ],
};

const statuses = ['All', 'Not Started', 'In Progress', 'Need Assistance', 'Deferred', 'Completed'];
const statusLabel = { 'aria-label': 'Status' };

const App = () => {
  const [filterStatus, setFilterStatus] = React.useState(statuses[0]);
  const dataGridRef = React.useRef<DataGrid>(null);

  const onValueChanged = React.useCallback(({ value }) => {
    const dataGrid = dataGridRef.current.instance;

    if (value === 'All') {
      dataGrid.clearFilter();
    } else {
      dataGrid.filter(['Task_Status', '=', value]);
    }

    setFilterStatus(value);
  }, []);

  return (
    <div>
      <div className="left-side">
        <div className="logo">
          <img src="../../../../images/logo-devav.png" />
          &nbsp;
          <img src="../../../../images/logo-tasks.png" />
        </div>
      </div>
      <div className="right-side">
        <SelectBox
          items={statuses}
          inputAttr={statusLabel}
          value={filterStatus}
          onValueChanged={onValueChanged} />
      </div>

      <DataGrid
        id="gridContainer"
        ref={dataGridRef}
        dataSource={dataSourceOptions}
        columnAutoWidth={true}
        showBorders={true}
      >
        <Column
          dataField="Task_ID"
          width={80} />
        <Column
          dataField="Task_Start_Date"
          caption="Start Date"
          dataType="date" />
        <Column
          allowSorting={false}
          dataField="ResponsibleEmployee.Employee_Full_Name"
          cssClass="employee"
          caption="Assigned To" />
        <Column
          dataField="Task_Subject"
          caption="Subject"
          width={350} />
        <Column
          dataField="Task_Status"
          caption="Status" />
      </DataGrid>
    </div>
  );
};

export default App;
