import React from 'react';
import DataGrid, { Column, FilterRow, Selection } from 'devextreme-react/data-grid';
import Button from 'devextreme-react/button';
import query from 'devextreme/data/query';
import 'devextreme/data/odata/store';

var dataGrid;
const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;
const dataSource = {
  store: {
    type: 'odata',
    url: 'https://js.devexpress.com/Demos/DevAV/odata/Tasks',
    key: 'Task_ID'
  },
  expand: 'ResponsibleEmployee',
  select: [
    'Task_ID',
    'Task_Subject',
    'Task_Start_Date',
    'Task_Due_Date',
    'Task_Status',
    'ResponsibleEmployee/Employee_Full_Name'
  ]
};
const selectionFilter = ['Task_Status', '=', 'Completed'];

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskCount: 0,
      peopleCount: 0,
      avgDuration: 0
    };
    this.onInitialized = this.onInitialized.bind(this);
    this.calculateStatistics = this.calculateStatistics.bind(this);
  }

  render() {
    return (
      <div>
        <DataGrid
          id="grid-container"
          dataSource={dataSource}
          showBorders={true}
          defaultSelectionFilter={selectionFilter}
          onInitialized={this.onInitialized}
        >
          <Selection mode="multiple" deferred={true} />
          <FilterRow visible={true} />
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
            dataField="ResponsibleEmployee.Employee_Full_Name"
            width="auto"
            allowSorting={false}
          />
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
            onClick={this.calculateStatistics}
          />
          <div>
            <div className="column">
              <span className="text count">Task count:</span>
              &nbsp;
              <span className="value">{this.state.taskCount}</span>
            </div>
            &nbsp;
            <div className="column">
              <span className="text people-count">People assigned:</span>
              &nbsp;
              <span className="value">{this.state.peopleCount}</span>
            </div>
            &nbsp;
            <div className="column">
              <span className="text avg-duration">Average task duration (days):</span>
              &nbsp;
              <span className="value">{this.state.avgDuration}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  onInitialized(e) {
    dataGrid = e.component;
    this.calculateStatistics();
  }

  calculateStatistics() {
    dataGrid.getSelectedRowsData().then(rowData => {
      var commonDuration = 0;

      for (var i = 0; i < rowData.length; i++) {
        commonDuration += rowData[i].Task_Due_Date - rowData[i].Task_Start_Date;
      }
      commonDuration = commonDuration / MILLISECONDS_IN_DAY;
      this.setState({
        taskCount: rowData.length,
        peopleCount: query(rowData)
          .groupBy('ResponsibleEmployee.Employee_Full_Name')
          .toArray()
          .length,
        avgDuration: Math.round(commonDuration / rowData.length) || 0
      });
    });
  }
}

export default App;
