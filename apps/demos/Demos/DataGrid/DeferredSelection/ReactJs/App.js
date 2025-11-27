import React, { useCallback, useState } from 'react';
import DataGrid, {
  Column, FilterRow, Selection, Pager, Lookup,
} from 'devextreme-react/data-grid';
import Button from 'devextreme-react/button';
import { query } from 'devextreme-react/common/data';
import { createStore } from 'devextreme-aspnet-data-nojquery';

const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;
const url = 'https://js.devexpress.com/Demos/NetCore/api/TreeListTasks';
const tasksDataSource = createStore({
  key: 'Task_ID',
  loadUrl: `${url}/Tasks`,
  onBeforeSend(method, ajaxOptions) {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
});
const employeesDataSource = createStore({
  key: 'ID',
  loadUrl: `${url}/TaskEmployees`,
  onBeforeSend(method, ajaxOptions) {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
});
const selectionFilter = ['Task_Status', '=', 'Completed'];
let dataGrid;
const App = () => {
  const [taskCount, setTaskCount] = useState(0);
  const [peopleCount, setPeopleCount] = useState(0);
  const [avgDuration, setAvgDuration] = useState(0);
  const calculateStatistics = useCallback(async () => {
    const selectedItems = await dataGrid.getSelectedRowsData();
    const totalDuration = selectedItems.reduce((currentValue, item) => {
      const duration =
        new Date(item.Task_Due_Date).getTime() - new Date(item.Task_Start_Date).getTime();
      return currentValue + duration;
    }, 0);
    const averageDurationInDays = totalDuration / MILLISECONDS_IN_DAY / selectedItems.length;
    setTaskCount(selectedItems.length);
    setPeopleCount(query(selectedItems).groupBy('Task_Assigned_Employee_ID').toArray().length);
    setAvgDuration(Math.round(averageDurationInDays) || 0);
  }, []);
  const onInitialized = useCallback(
    (e) => {
      dataGrid = e.component;
      calculateStatistics();
    },
    [calculateStatistics],
  );
  return (
    <div>
      <DataGrid
        id="grid-container"
        dataSource={tasksDataSource}
        remoteOperations={true}
        showBorders={true}
        defaultSelectionFilter={selectionFilter}
        onInitialized={onInitialized}
      >
        <Selection
          mode="multiple"
          deferred={true}
        />
        <FilterRow visible={true} />
        <Pager visible={true} />
        <Column
          caption="Subject"
          dataField="Task_Subject"
        />
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
          dataField="Task_Assigned_Employee_ID"
          width="auto"
          allowSorting={false}
        >
          <Lookup
            dataSource={employeesDataSource}
            valueExpr="ID"
            displayExpr="Name"
          />
        </Column>
        <Column
          caption="Status"
          width="auto"
          dataField="Task_Status"
        />
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
