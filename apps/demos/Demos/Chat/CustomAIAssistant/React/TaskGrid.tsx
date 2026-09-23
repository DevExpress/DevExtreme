import React, { useCallback } from 'react';
import DataGrid, {
  Column, FilterRow, HeaderFilter, LoadPanel,
} from 'devextreme-react/data-grid';
import type { DataGridRef, DataGridTypes } from 'devextreme-react/data-grid';
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
const calculateFilterExpression = (filterValue: boolean, operation: string | null): ColumnFilterExpression => {
  const wantsCompleted = operation === '<>' ? !filterValue : !!filterValue;
  const rawCompletion = (rowData: Task) => rowData.Completion;

  return [rawCompletion, wantsCompleted ? '=' : '<', 100];
};

export default function TaskGrid({ gridRef }: TaskGridProps) {
  const setGridRef = useCallback((instance: DataGridRef | null): void => {
    gridRef.current = instance;
  }, [gridRef]);

  return (
    <div id="grid-container">
      <DataGrid
        ref={setGridRef}
        dataSource={tasks}
        keyExpr="ID"
        height={360}
        showBorders={true}
        filterSyncEnabled={true}
      >
        <FilterRow visible={true} />
        <HeaderFilter visible={true} />
        <LoadPanel enabled={true} />
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
