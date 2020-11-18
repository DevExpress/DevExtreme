import React from 'react';

import TreeList, { Column, Lookup } from 'devextreme-react/tree-list';
import { NumberBox } from 'devextreme-react/number-box';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';

const url = 'https://js.devexpress.com/Demos/Mvc/api/TreeListTasks',
  dataSourceOptions = AspNetData.createStore({
    key: 'Task_ID',
    loadUrl: `${url }/Tasks`,
    onBeforeSend: function(_, ajaxOptions) {
      ajaxOptions.xhrFields = { withCredentials: true };
    }
  }),
  taskEmployees = AspNetData.createStore({
    key: 'ID',
    loadMode: 'raw',
    loadUrl: `${url }/TaskEmployees`
  });

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      taskSubject: '',
      taskAssigned: '',
      startDate: '',
      taskStatus: '',
      taskProgress: '',
      focusedRowKey: 4
    };

    this.onFocusedRowChanged = this.onFocusedRowChanged.bind(this);
    this.onTaskIdChanged = this.onTaskIdChanged.bind(this);
  }
  onTaskIdChanged(e) {
    if(e.event && e.value > 0) {
      this.setState({ focusedRowKey: e.value });
    }
  }
  onFocusedRowChanged(e) {
    var rowData = e.row && e.row.data,
      progress,
      cellValue,
      assigned;

    if(rowData) {
      progress = rowData.Task_Completion ? `${rowData.Task_Completion }%` : '';
      cellValue = e.component.cellValue(e.row.rowIndex, 'Assigned');
      taskEmployees.byKey(cellValue).done((item) => {
        assigned = item.Name;
      });

      this.setState({
        taskSubject: rowData.Task_Subject,
        taskAssigned: assigned,
        startDate: new Date(rowData.Task_Start_Date).toLocaleDateString(),
        taskStatus: e.row.data.Task_Status,
        taskProgress: progress,
        focusedRowKey: e.component.option('focusedRowKey')
      });
    }
  }
  render() {
    return (
      <div>
        <TreeList
          id="treeList"
          dataSource={dataSourceOptions}
          focusedRowEnabled={true}
          focusedRowKey={this.state.focusedRowKey}
          parentIdExpr="Task_Parent_ID"
          hasItemsExpr="Has_Items"
          wordWrapEnabled={true}
          showBorders={true}
          onFocusedRowChanged={this.onFocusedRowChanged}>
          <Column dataField="Task_ID" width={100} alignment="left" />
          <Column dataField="Task_Assigned_Employee_ID" caption="Assigned" minWidth={120}>
            <Lookup dataSource={taskEmployees} valueExpr="ID" displayExpr="Name" />
          </Column>
          <Column dataField="Task_Status" caption="Status" width={160} />
          <Column dataField="Task_Start_Date" caption="Start Data" dataType="date" width={160} />
          <Column dataField="Task_Due_Date" caption="Due Data" dataType="date" width={160} />
        </TreeList>
        <div className="task-info">
          <div className="info">
            <div className="task-subject">{this.state.taskSubject}</div>
            <span className="task-assigned">{this.state.taskAssigned}</span>
            <span className="start-date">{this.state.startDate}</span>
          </div>
          <div className="progress">
            <span className="task-status">{this.state.taskStatus}</span>
            <span className="task-progress">{this.state.taskProgress}</span>
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
              value={this.state.focusedRowKey}
              onValueChanged={this.onTaskIdChanged}>
            </NumberBox>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
