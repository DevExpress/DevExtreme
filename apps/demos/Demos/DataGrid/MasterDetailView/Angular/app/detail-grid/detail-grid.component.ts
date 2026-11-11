import {
  Component, computed, inject, input,
} from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular';
import { DataSource, ArrayStore } from 'devextreme-angular/common/data';
import { Service } from '../app.service';

@Component({
  selector: 'detail-grid',
  templateUrl: './detail-grid.component.html',
  imports: [DxDataGridModule],
  providers: [Service],
})
export class DetailGridComponent {
  readonly key = input.required<number>();

  private readonly tasks = inject(Service).getTasks();

  readonly tasksDataSource = computed(() => new DataSource({
    store: new ArrayStore({
      data: this.tasks,
      key: 'ID',
    }),
    filter: ['EmployeeID', '=', this.key()],
  }));

  completedValue(rowData) {
    return rowData.Status === 'Completed';
  }
}
