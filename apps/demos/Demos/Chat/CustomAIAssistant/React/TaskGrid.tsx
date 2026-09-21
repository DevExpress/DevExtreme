import React, { useCallback } from 'react';
import DataGrid, { Column, FilterRow, HeaderFilter } from 'devextreme-react/data-grid';
import type { DataGridTypes } from 'devextreme-react/data-grid';
import type { ColumnFilterExpression, Task, TaskGridProps } from './data.ts';
import { colors, tasks } from './data.ts';

const priorityClassNames = Object.fromEntries(
  Object.keys(colors).map((priority) => [priority, `priority-badge--${priority.toLowerCase()}`]),
) as Record<keyof typeof colors, string>;

function renderPriorityCell({ value }: DataGridTypes.ColumnCellTemplateData): React.JSX.Element {
  const priority = value as keyof typeof colors;

  return <div className={`priority-badge ${priorityClassNames[priority]}`}>{value}</div>;
}

const calculateCompletion = (row: Task): boolean => row.Completion === 100;
const calculateFilterExpression = (filterValue: boolean, operation: string | null): ColumnFilterExpression => [
  ((rowData: Task) => rowData.Completion),
  operation === '<>' || !filterValue ? '<' : '=',
  100,
];

export default function TaskGrid({ onInitialized }: TaskGridProps) {
  const onGridInitialized = useCallback((event: DataGridTypes.InitializedEvent): void => {
    if (event.component) {
      onInitialized(event.component);
    }
  }, [onInitialized]);

  return (
    <div id="grid-container">
      <DataGrid
        dataSource={tasks}
        keyExpr="ID"
        height={360}
        showBorders={true}
        filterSyncEnabled={true}
        onInitialized={onGridInitialized}
      >
        <FilterRow visible={true} />
        <HeaderFilter visible={true} />
        <Column dataField="Subject" width={250} />
        <Column dataField="StartDate" dataType="date" />
        <Column dataField="DueDate" dataType="date" />
        <Column dataField="Priority" caption="Priority" cellRender={renderPriorityCell} />
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
