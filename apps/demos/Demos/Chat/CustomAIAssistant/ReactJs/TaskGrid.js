import React from 'react';
import DataGrid, {
  Column, FilterRow, HeaderFilter, LoadPanel,
} from 'devextreme-react/data-grid';
import { colors, tasks } from './data.js';

const priorityClassNames = Object.fromEntries(
  Object.keys(colors).map((priority) => [priority, `priority-badge--${priority.toLowerCase()}`]),
);
function renderPriorityCell({ value }) {
  const priority = value;
  return <div className={`priority-badge ${priorityClassNames[priority]}`}>{value}</div>;
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
          calculateCellValue={calculateCompletion}
          calculateFilterExpression={calculateFilterExpression}
        />
      </DataGrid>
    </div>
  );
}
