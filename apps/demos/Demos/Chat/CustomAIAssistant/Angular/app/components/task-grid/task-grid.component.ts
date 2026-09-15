import { Component, ViewChild } from '@angular/core';
import { DxDataGridModule, DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { colors, tasks } from '../../data/data';
import type { ColumnFilterExpression, Task } from '../../types/types';

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'app-task-grid',
  standalone: true,
  imports: [DxDataGridModule],
  templateUrl: `.${modulePrefix}/components/task-grid/task-grid.component.html`,
  styleUrls: [`.${modulePrefix}/components/task-grid/task-grid.component.css`],
})
export class TaskGridComponent {
  @ViewChild(DxDataGridComponent) private dxDataGrid!: DxDataGridComponent;

  readonly tasks = tasks;

  readonly colors = colors;

  readonly completionEditorOptions = {
    elementAttr: { 'aria-label': 'Completed' },
  };

  get instance(): DxDataGridComponent {
    return this.dxDataGrid;
  }

  calculateCompletionCellValue = (rowData: Task): boolean => rowData.Completion === 100;

  calculateCompletionFilterExpression = (
    filterValue: unknown,
    selectedFilterOperation: string | null,
  ): ColumnFilterExpression => {
    const wantsCompleted = selectedFilterOperation === '<>' ? !filterValue : !!filterValue;
    const rawCompletion = (rowData: Task): number => rowData.Completion;

    return wantsCompleted ? [rawCompletion, '=', 100] : [rawCompletion, '<', 100];
  };
}
