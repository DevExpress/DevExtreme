import React, { useCallback, useState } from 'react';
import TreeList, { Column, Lookup } from 'devextreme-react/tree-list';
import { NumberBox } from 'devextreme-react/number-box';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/Mvc/api/TreeListTasks';
const dataSourceOptions = AspNetData.createStore({
  key: 'Task_ID',
  loadUrl: `${url}/Tasks`,
  onBeforeSend(_, ajaxOptions) {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
});
const taskEmployees = AspNetData.createStore({
  key: 'ID',
  loadMode: 'raw',
  loadUrl: `${url}/TaskEmployees`,
});
const focusedRowKeyLabel = { 'aria-label': 'Focused Row Key' };
const App = () => {
  const [taskSubject, setTaskSubject] = useState('');
  const [taskAssigned, setTaskAssigned] = useState('');
  const [startDate, setStartDate] = useState('');
  const [taskStatus, setTaskStatus] = useState('');
  const [taskProgress, setTaskProgress] = useState('');
  const [focusedRowKey, setFocusedRowKey] = useState(45);
  const onTaskIdChanged = useCallback((e) => {
    if (e.event && e.value > 0) {
      setFocusedRowKey(e.value);
    }
  }, []);
  // eslint-disable-next-line @typescript-eslint/space-before-function-paren
  const onFocusedRowChanged = useCallback(async(e) => {
    const rowData = e.row && e.row.data;
    if (rowData) {
      const progress = rowData.Task_Completion ? `${rowData.Task_Completion}%` : '';
      const cellValue = e.component.cellValue(e.row.rowIndex, 'Assigned');
      const item = await taskEmployees.byKey(cellValue);
      setTaskSubject(rowData.Task_Subject);
      setTaskAssigned(item.Name);
      setStartDate(new Date(rowData.Task_Start_Date).toLocaleDateString());
      setTaskStatus(e.row.data.Task_Status);
      setTaskProgress(progress);
      setFocusedRowKey(e.component.option('focusedRowKey'));
    }
  }, []);
  return (
    <div>
      <TreeList
        id="treeList"
        dataSource={dataSourceOptions}
        focusedRowEnabled={true}
        focusedRowKey={focusedRowKey}
        parentIdExpr="Task_Parent_ID"
        hasItemsExpr="Has_Items"
        wordWrapEnabled={true}
        showBorders={true}
        onFocusedRowChanged={onFocusedRowChanged}
      >
        <Column
          dataField="Task_ID"
          width={100}
          alignment="left"
        />
        <Column
          dataField="Task_Assigned_Employee_ID"
          caption="Assigned"
          minWidth={120}
        >
          <Lookup
            dataSource={taskEmployees}
            valueExpr="ID"
            displayExpr="Name"
          />
        </Column>
        <Column
          dataField="Task_Status"
          caption="Status"
          width={160}
        />
        <Column
          dataField="Task_Start_Date"
          caption="Start Date"
          dataType="date"
          width={160}
        />
        <Column
          dataField="Task_Due_Date"
          caption="Due Date"
          dataType="date"
          width={160}
        />
      </TreeList>
      <div className="task-info">
        <div className="info">
          <div className="task-subject">{taskSubject}</div>
          <span className="task-assigned">{taskAssigned}</span>
          <span className="start-date">{startDate}</span>
        </div>
        <div className="progress">
          <span className="task-status">{taskStatus}</span>
          <span className="task-progress">{taskProgress}</span>
        </div>
      </div>

      <div className="options">
        <div className="caption">Options</div>
        <div className="option">
          <span>Focused row key </span>
          <NumberBox
            id="taskId"
            min={1}
            max={182}
            step={0}
            value={focusedRowKey}
            inputAttr={focusedRowKeyLabel}
            onValueChanged={onTaskIdChanged}
          ></NumberBox>
        </div>
      </div>
    </div>
  );
};
export default App;
