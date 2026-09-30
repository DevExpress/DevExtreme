import React from 'react';
import DataGrid, {
  Column, FilterRow, HeaderFilter, LoadPanel,
} from 'devextreme-react/data-grid';
import { tasks } from './data.js';

const completionEditorOptions = {
  elementAttr: { 'aria-label': 'Completed' },
};
function renderPriorityCell({ value }) {
  return <div className={`priority-badge priority-badge--${value.toLowerCase()}`}>{value}</div>;
}
const calculateCompletion = (row) => row.Completion === 100;
const calculateFilterExpression = (filterValue, operation) => {
  const wantsCompleted = operation === '<>' ? !filterValue : !!filterValue;
  const rawCompletion = (rowData) => rowData.Completion;
  return [rawCompletion, wantsCompleted ? '=' : '<', 100];
};
export default function TaskGrid({ gridRef }) {
  return (
    <div id="grid-container">
      <DataGrid
        ref={gridRef}
        dataSource={tasks}
        keyExpr="ID"
        height={360}
        showBorders={true}
        filterSyncEnabled={true}
      >
        <FilterRow visible={true} />
        <HeaderFilter visible={true} />
        <LoadPanel enabled={true} />
        <Column
          dataField="Subject"
          width={250}
        />
        <Column
          dataField="StartDate"
          dataType="date"
        />
        <Column
          dataField="DueDate"
          dataType="date"
        />
        <Column
          dataField="Priority"
          caption="Priority"
          cellRender={renderPriorityCell}
        />
        <Column
          dataField="Completion"
          caption="Completed"
          alignment="center"
          dataType="boolean"
          editorOptions={completionEditorOptions}
          calculateCellValue={calculateCompletion}
          calculateFilterExpression={calculateFilterExpression}
        />
      </DataGrid>
    </div>
  );
}
