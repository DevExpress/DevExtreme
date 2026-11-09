import { Component, viewChild } from '@angular/core';
import { DxDataGridModule, DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { tasks, type ColumnFilterExpression, type Task } from '../../data';

@Component({
  selector: 'app-task-grid',
  imports: [DxDataGridModule],
  templateUrl: './task-grid.component.html',
  styleUrls: ['./task-grid.component.css'],
})
export class TaskGridComponent {
  readonly gridComponent = viewChild.required(DxDataGridComponent);

  readonly tasks = tasks;

  readonly completionEditorOptions = {
    elementAttr: { 'aria-label': 'Completed' },
  };

  readonly calculateCompletionCellValue = (rowData: Task): boolean => rowData.Completion === 100;

  readonly calculateCompletionFilterExpression = (
    filterValue: unknown,
    selectedFilterOperation: string | null,
  ): ColumnFilterExpression => {
    const wantsCompleted = selectedFilterOperation === '<>' ? !filterValue : !!filterValue;
    const rawCompletion = (rowData: Task): number => rowData.Completion;

    return wantsCompleted ? [rawCompletion, '=', 100] : [rawCompletion, '<', 100];
  };
}
