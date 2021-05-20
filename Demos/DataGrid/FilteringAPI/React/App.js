import React from 'react';
import DataGrid, { Column } from 'devextreme-react/data-grid';
import SelectBox from 'devextreme-react/select-box';
import 'devextreme/data/odata/store';

const dataSourceOptions = {
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
    'Task_Status',
    'ResponsibleEmployee/Employee_Full_Name'
  ]
};

const statuses = ['All', 'Not Started', 'In Progress', 'Need Assistance', 'Deferred', 'Completed'];

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterStatus: statuses[0]
    };

    this.onValueChanged = this.onValueChanged.bind(this);
  }

  render() {
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
            value={this.state.filterStatus}
            onValueChanged={this.onValueChanged} />
        </div>

        <DataGrid
          id="gridContainer"
          ref={ref => this.dataGrid = ref}
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
  }

  onValueChanged({ value }) {
    const dataGrid = this.dataGrid.instance;

    if (value === 'All') {
      dataGrid.clearFilter();
    }
    else {
      dataGrid.filter(['Task_Status', '=', value]);
    }

    this.setState({
      filterStatus: value
    });
  }
}

export default App;
