import { Component, Input, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular';
import { DataSource, ArrayStore } from 'devextreme-angular/common/data';
import { Service, Task } from '../app.service';

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'detail-grid',
  templateUrl: `.${modulePrefix}/detail-grid/detail-grid.component.html`,
  imports: [DxDataGridModule],
  providers: [Service],
})
export class DetailGridComponent implements AfterViewInit {
  @Input() key: number;

  tasksDataSource: DataSource;

  tasks: Task[];

  constructor(private service: Service, private changeDetectorRef: ChangeDetectorRef) {
    this.tasks = service.getTasks();
  }

  ngAfterViewInit() {
    this.tasksDataSource = new DataSource({
      store: new ArrayStore({
        data: this.tasks,
        key: 'ID',
      }),
      filter: ['EmployeeID', '=', this.key],
    });

    this.changeDetectorRef.detectChanges();
  }

  completedValue(rowData) {
    return rowData.Status === 'Completed';
  }
}
