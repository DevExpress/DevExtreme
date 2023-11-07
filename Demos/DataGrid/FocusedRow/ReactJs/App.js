import React from 'react';
import { DataGrid, Column, Paging } from 'devextreme-react/data-grid';
import { NumberBox } from 'devextreme-react/number-box';
import { CheckBox } from 'devextreme-react/check-box';
import 'devextreme/data/odata/store';

const focusedRowKeyLabel = { 'aria-label': 'Focused Row Key' };
const dataSourceOptions = {
  store: {
    type: 'odata',
    version: 2,
    key: 'Task_ID',
    url: 'https://js.devexpress.com/Demos/DevAV/odata/Tasks',
  },
  expand: 'ResponsibleEmployee',
  select: [
    'Task_ID',
    'Task_Subject',
    'Task_Start_Date',
    'Task_Status',
    'Task_Description',
    'Task_Completion',
    'ResponsibleEmployee/Employee_Full_Name',
  ],
};
const App = () => {
  const [taskSubject, setTaskSubject] = React.useState('');
  const [taskDetails, setTaskDetails] = React.useState('');
  const [taskStatus, setTaskStatus] = React.useState('');
  const [taskProgress, setTaskProgress] = React.useState('');
  const [focusedRowKey, setFocusedRowKey] = React.useState(117);
  const [autoNavigateToFocusedRow, setAutoNavigateToFocusedRow] = React.useState(true);
  const onTaskIdChanged = React.useCallback((e) => {
    if (e.event && e.value > 0) {
      setFocusedRowKey(e.value);
    }
  }, []);
  // eslint-disable-next-line @typescript-eslint/space-before-function-paren
  const onFocusedRowChanging = React.useCallback(async(e) => {
    const rowsCount = e.component.getVisibleRows().length;
    const pageCount = e.component.pageCount();
    const pageIndex = e.component.pageIndex();
    const event = e?.event;
    const key = event.key;
    if (key && e.prevRowIndex === e.newRowIndex) {
      if (e.newRowIndex === rowsCount - 1 && pageIndex < pageCount - 1) {
        await e.component.pageIndex(pageIndex + 1);
        e.component.option('focusedRowIndex', 0);
      } else if (e.newRowIndex === 0 && pageIndex > 0) {
        await e.component.pageIndex(pageIndex - 1);
        e.component.option('focusedRowIndex', rowsCount - 1);
      }
    }
  }, []);
  const onFocusedRowChanged = React.useCallback((e) => {
    const data = e.row.data;
    const progress = data.Task_Completion ? `${data.Task_Completion}%` : '';
    setTaskSubject(data.Task_Subject);
    setTaskDetails(data.Task_Description);
    setTaskStatus(data.Task_Status);
    setTaskProgress(progress);
    setFocusedRowKey(e.component.option('focusedRowKey'));
  }, []);
  const onAutoNavigateToFocusedRowChanged = React.useCallback((e) => {
    setAutoNavigateToFocusedRow(e.value);
  }, []);
  return (
    <div>
      <DataGrid
        id="gridContainer"
        dataSource={dataSourceOptions}
        focusedRowEnabled={true}
        focusedRowKey={focusedRowKey}
        autoNavigateToFocusedRow={autoNavigateToFocusedRow}
        onFocusedRowChanging={onFocusedRowChanging}
        onFocusedRowChanged={onFocusedRowChanged}
        showBorders={true}
      >
        <Paging defaultPageSize={10} />
        <Column
          dataField="Task_ID"
          width={80}
        />
        <Column
          caption="Start Date"
          dataField="Task_Start_Date"
          dataType="date"
        />
        <Column
          caption="Assigned To"
          dataField="ResponsibleEmployee.Employee_Full_Name"
          dataType="date"
          allowSorting={false}
        />
        <Column
          caption="Subject"
          dataField="Task_Subject"
          width={350}
        />
        <Column
          caption="Status"
          dataField="Task_Status"
        />
      </DataGrid>

      <div className="task-info">
        <div className="info">
          <div id="taskSubject">{taskSubject}</div>
          <p
            id="taskDetails"
            dangerouslySetInnerHTML={{ __html: taskDetails }}
          ></p>
        </div>
        <div className="progress">
          <span id="taskStatus">{taskStatus}</span>
          <span id="taskProgress">{taskProgress}</span>
        </div>
      </div>

      <div className="options">
        <div className="caption">Options</div>
        <div className="options-container">
          <div className="option">
            <span>Focused Row Key </span>
            <NumberBox
              id="taskId"
              min={1}
              max={183}
              step={0}
              value={focusedRowKey}
              inputAttr={focusedRowKeyLabel}
              onValueChanged={onTaskIdChanged}
            ></NumberBox>
          </div>
          <div className="option">
            <CheckBox
              text="Auto Navigate To Focused Row"
              value={autoNavigateToFocusedRow}
              onValueChanged={onAutoNavigateToFocusedRowChanged}
            ></CheckBox>
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;
