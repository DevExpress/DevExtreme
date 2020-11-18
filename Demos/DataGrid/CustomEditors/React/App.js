import React from 'react';
import DataGrid, {
  Paging,
  HeaderFilter,
  SearchPanel,
  Editing,
  Column,
  Lookup,
  RequiredRule } from 'devextreme-react/data-grid';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import { statuses } from './data.js';
import EmployeeDropDownBoxComponent from './EmployeeDropDownBoxComponent.js';
import EmployeeTagBoxComponent from './EmployeeTagBoxComponent.js';
import SelectBox from 'devextreme-react/select-box';

const url = 'https://js.devexpress.com/Demos/Mvc/api/CustomEditors';

const employees = createStore({
  key: 'ID',
  loadUrl: `${url}/Employees`,
  onBeforeSend: function(method, ajaxOptions) {
    ajaxOptions.xhrFields = { withCredentials: true };
  }
});

const tasks = createStore({
  key: 'ID',
  loadUrl: `${url}/Tasks`,
  updateUrl: `${url}/UpdateTask`,
  insertUrl: `${url}/InsertTask`,
  onBeforeSend: function(method, ajaxOptions) {
    ajaxOptions.xhrFields = { withCredentials: true };
  }
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.statusEditorRender = this.statusEditorRender.bind(this);
  }

  cellTemplate(container, options) {
    var noBreakSpace = '\u00A0',
      text = (options.value || []).map(element => {
        return options.column.lookup.calculateCellValue(element);
      }).join(', ');
    container.textContent = text || noBreakSpace;
    container.title = text;
  }

  calculateFilterExpression(filterValue, selectedFilterOperation, target) {
    if(target === 'search' && typeof (filterValue) === 'string') {
      return [this.dataField, 'contains', filterValue];
    }
    return function(data) {
      return (data.AssignedEmployee || []).indexOf(filterValue) !== -1;
    };
  }

  onValueChanged(cell, e) {
    cell.setValue(e.value);
  }

  statusEditorRender(cell) {
    let onValueChanged = this.onValueChanged.bind(this, cell);
    return <SelectBox
      defaultValue={cell.value}
      {...cell.column.lookup}
      onValueChanged={onValueChanged}
      itemRender={this.itemRender}
    />;
  }

  itemRender(data) {
    let imageSource = `images/icons/status-${ data.id }.svg`;
    if(data != null) {
      return <div>
        <img src={imageSource} className="status-icon middle"></img>
        <span className="middle">{data.name}</span>
      </div>;
    } else {
      return <span>(All)</span>;
    }
  }

  onRowInserted(e) {
    e.component.navigateToRow(e.key);
  }

  render() {
    return (
      <div>
        <DataGrid
          dataSource={tasks}
          showBorders={true}
          onRowInserted={this.onRowInserted}
        >
          <Paging enabled={true} defaultPageSize={15} />
          <HeaderFilter visible={true} />
          <SearchPanel visible={true} />
          <Editing
            mode="cell"
            allowUpdating={true}
            allowAdding={true}
          />
          <Column
            dataField="Owner"
            width={150}
            allowSorting={false}
            editCellComponent={EmployeeDropDownBoxComponent}
          >
            <Lookup
              dataSource={employees}
              displayExpr="FullName"
              valueExpr="ID"
            />
            <RequiredRule />
          </Column>
          <Column
            dataField="AssignedEmployee"
            caption="Assignees"
            width={200}
            allowSorting={false}
            editCellComponent={EmployeeTagBoxComponent}
            cellTemplate={this.cellTemplate}
            calculateFilterExpression={this.calculateFilterExpression}>
            <Lookup
              dataSource={employees}
              valueExpr="ID"
              displayExpr="FullName"
            />
            <RequiredRule />
          </Column>
          <Column dataField="Subject">
            <RequiredRule />
          </Column>
          <Column
            dataField="Status"
            width={200}
            editCellRender={this.statusEditorRender}
          >
            <Lookup
              dataSource={statuses}
              displayExpr="name"
              valueExpr="id"
            />
            <RequiredRule />
          </Column>
        </DataGrid>
      </div>
    );
  }
}

export default App;
