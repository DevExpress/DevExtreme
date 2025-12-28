import React from 'react';

import DataGrid, {
  Paging,
  HeaderFilter,
  SearchPanel,
  Editing,
  Column,
  Lookup,
  RequiredRule,
  Pager,
} from 'devextreme-react/data-grid';
import type { DataGridTypes } from 'devextreme-react/data-grid';
import { createStore } from 'devextreme-aspnet-data-nojquery';
import SelectBox, { type SelectBoxTypes } from 'devextreme-react/select-box';

import { statuses } from './data.ts';
import EmployeeDropDownBoxComponent from './EmployeeDropDownBoxComponent.tsx';
import EmployeeTagBoxComponent from './EmployeeTagBoxComponent.tsx';

const url = 'https://js.devexpress.com/Demos/NetCore/api/DataGridCustomEditors';
const statusLabel = { 'aria-label': 'Status' };

const employees = createStore({
  key: 'ID',
  loadUrl: `${url}/Employees`,
  onBeforeSend(_method, ajaxOptions) {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
});

const tasks = createStore({
  key: 'ID',
  loadUrl: `${url}/Tasks`,
  updateUrl: `${url}/UpdateTask`,
  insertUrl: `${url}/InsertTask`,
  onBeforeSend(_method, ajaxOptions) {
    ajaxOptions.xhrFields = { withCredentials: true };
  },
});

const cellTemplate = (
  container: { textContent: string; title: string; },
  options: DataGridTypes.ColumnCellTemplateData
) => {
  const noBreakSpace = '\u00A0';

  const assignees = (options.value || []).map(
    (assigneeId: number) => options.column.lookup?.calculateCellValue?.(assigneeId),
  );
  const text = assignees.join(', ');

  container.textContent = text || noBreakSpace;
  container.title = text;
};

interface RowDataWithAssignedEmployee {
  AssignedEmployee?: number[];
}

function calculateFilterExpression(
  this: DataGridTypes.Column,
  filterValue: number | string,
  selectedFilterOperation: DataGridTypes.SelectedFilterOperation,
  target: string
) {
  if (target === 'search' && typeof (filterValue) === 'string') {
    return [this.dataField, 'contains', filterValue];
  }

  return (rowData: RowDataWithAssignedEmployee) => (rowData.AssignedEmployee || []).indexOf(filterValue as number) !== -1;
}

const onRowInserted = (e: DataGridTypes.RowInsertedEvent) => e.component.navigateToRow(e.key);

const statusEditorRender = (cell: DataGridTypes.ColumnEditCellTemplateData) => {
  const onValueChanged = (e: SelectBoxTypes.ValueChangedEvent) => cell.setValue(e.value);

  const itemRender = (data: { id: number, name: string } | null) => {
    if (data) {
      const imageSource = `images/icons/status-${data.id}.svg`;

      return (
        <div>
          <img src={imageSource} className="status-icon middle"></img>
          <span className="middle">{data.name}</span>
        </div>
      );
    }

    return <span>(All)</span>;
  };

  const lookupDataSource = cell.column.lookup?.dataSource;
  const dataSource = typeof lookupDataSource === 'function'
    ? lookupDataSource({ data: cell.data, key: cell.row.key })
    : lookupDataSource;

  return (
    <SelectBox
      defaultValue={cell.value}
      dataSource={dataSource}
      onValueChanged={onValueChanged}
      inputAttr={statusLabel}
      itemRender={itemRender} />
  );
};

const App = () => (
  <div>
    <DataGrid
      dataSource={tasks}
      showBorders={true}
      onRowInserted={onRowInserted}
    >
      <Paging enabled={true} defaultPageSize={15} />
      <Pager visible={true} />
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
        cellTemplate={cellTemplate}
        calculateFilterExpression={calculateFilterExpression as any}>
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
        editCellRender={statusEditorRender}
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

export default App;
