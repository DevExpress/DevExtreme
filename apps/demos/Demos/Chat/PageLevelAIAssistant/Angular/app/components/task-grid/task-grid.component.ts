import { Component, ViewChild } from '@angular/core';
import { DxDataGridModule, DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import {
  colors, tasks, type ColumnFilterExpression, type Task,
} from '../../data';

@Component({
  selector: 'app-task-grid',
  imports: [DxDataGridModule],
  templateUrl: './task-grid.component.html',
  styleUrls: ['./task-grid.component.css'],
})
export class TaskGridComponent {
  @ViewChild(DxDataGridComponent) private dxDataGrid!: DxDataGridComponent;

  readonly tasks = tasks;

  readonly colors = colors;

  readonly completionEditorOptions = {
    elementAttr: { 'aria-label': 'Completed' },
  };

  get gridComponent(): DxDataGridComponent {
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
