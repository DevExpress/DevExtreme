import React from 'react';
import DataGrid, { Column, FilterRow, Selection } from 'devextreme-react/data-grid';
import Button from 'devextreme-react/button';
import query from 'devextreme/data/query';
import 'devextreme/data/odata/store';

const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;
const dataSource = {
  store: {
    type: 'odata',
    url: 'https://js.devexpress.com/Demos/DevAV/odata/Tasks',
    key: 'Task_ID',
  },
  expand: 'ResponsibleEmployee',
  select: [
    'Task_ID',
    'Task_Subject',
    'Task_Start_Date',
    'Task_Due_Date',
    'Task_Status',
    'ResponsibleEmployee/Employee_Full_Name',
  ],
};
const selectionFilter = ['Task_Status', '=', 'Completed'];
let dataGrid;

const App = () => {
  const [taskCount, setTaskCount] = React.useState(0);
  const [peopleCount, setPeopleCount] = React.useState(0);
  const [avgDuration, setAvgDuration] = React.useState(0);

  const calculateStatistics = React.useCallback(() => {
    dataGrid.getSelectedRowsData().then((rowData) => {
      let commonDuration = 0;

      for (let i = 0; i < rowData.length; i += 1) {
        commonDuration += rowData[i].Task_Due_Date - rowData[i].Task_Start_Date;
      }
      commonDuration /= MILLISECONDS_IN_DAY;
      setTaskCount(rowData.length);
      setPeopleCount(
        query(rowData)
          .groupBy('ResponsibleEmployee.Employee_Full_Name')
          .toArray()
          .length,
      );
      setAvgDuration(Math.round(commonDuration / rowData.length) || 0);
    });
  }, []);

  const onInitialized = React.useCallback((e) => {
    dataGrid = e.component;
    calculateStatistics();
  }, [calculateStatistics]);

  return (
    <div>
      <DataGrid
        id="grid-container"
        dataSource={dataSource}
        showBorders={true}
        defaultSelectionFilter={selectionFilter}
        onInitialized={onInitialized}
      >
        <Selection mode="multiple" deferred={true} />
        <FilterRow visible={true} />
        <Column caption="Subject" dataField="Task_Subject" />
        <Column
          caption="Start Date"
          dataField="Task_Start_Date"
          width="auto"
          dataType="date"
        />
        <Column
          caption="Due Date"
          dataField="Task_Due_Date"
          width="auto"
          dataType="date"
        />
        <Column
          caption="Assigned To"
          dataField="ResponsibleEmployee.Employee_Full_Name"
          width="auto"
          allowSorting={false}
        />
        <Column caption="Status" width="auto" dataField="Task_Status" />
      </DataGrid>
      <div className="selection-summary center">
        <Button
          id="calculateButton"
          text="Get statistics on the selected tasks"
          type="default"
          onClick={calculateStatistics}
        />
        <div>
          <div className="column">
            <span className="text count">Task count:</span>
            &nbsp;
            <span className="value">{taskCount}</span>
          </div>
          &nbsp;
          <div className="column">
            <span className="text people-count">People assigned:</span>
            &nbsp;
            <span className="value">{peopleCount}</span>
          </div>
          &nbsp;
          <div className="column">
            <span className="text avg-duration">Average task duration (days):</span>
            &nbsp;
            <span className="value">{avgDuration}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
