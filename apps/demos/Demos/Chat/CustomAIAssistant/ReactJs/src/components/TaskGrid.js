import React, { useCallback } from 'react';
import DataGrid, { Column, FilterRow, HeaderFilter } from 'devextreme-react/data-grid';
import { colors, tasks } from '../data/data.js';

const priorityClassNames = Object.fromEntries(Object.keys(colors).map((priority) => [priority, `priority-badge--${priority.toLowerCase()}`]));
function renderPriorityCell({ value }) {
  const priority = value;
  return <div className={`priority-badge ${priorityClassNames[priority]}`}>{value}</div>;
}
const calculateCompletion = (row) => row.Completion === 100;
const calculateFilterExpression = (filterValue, operation) => [
  ((rowData) => rowData.Completion),
  operation === '<>' || !filterValue ? '<' : '=',
  100,
];
export default function TaskGrid({ onInitialized }) {
  const onGridInitialized = useCallback((event) => {
    if (event.component) {
      onInitialized(event.component);
    }
  }, [onInitialized]);
  return (<div id="grid-container">
    <DataGrid dataSource={tasks} keyExpr="ID" height={360} showBorders={true} filterSyncEnabled={true} onInitialized={onGridInitialized}>
      <FilterRow visible={true}/>
      <HeaderFilter visible={true}/>
      <Column dataField="Subject" width={250}/>
      <Column dataField="StartDate" dataType="date"/>
      <Column dataField="DueDate" dataType="date"/>
      <Column dataField="Priority" caption="Priority" cellRender={renderPriorityCell}/>
      <Column dataField="Completion" caption="Completed" alignment="center" dataType="boolean" calculateCellValue={calculateCompletion} calculateFilterExpression={calculateFilterExpression}/>
    </DataGrid>
  </div>);
}
