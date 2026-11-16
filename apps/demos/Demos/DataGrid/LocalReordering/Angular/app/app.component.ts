import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxCheckBoxModule } from 'devextreme-angular';
import { DxDataGridModule, type DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxDataGridModule,
    DxCheckBoxModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly tasks = signal(this.service.getTasks());

  readonly employees = this.service.getEmployees();

  readonly showDragIcons = signal(true);

  readonly onReorder = (e: DxDataGridTypes.RowDraggingReorderEvent) => {
    const visibleRows = e.component.getVisibleRows();

    this.tasks.update((tasks) => {
      const toIndex = tasks.findIndex((item) => item.ID === visibleRows[e.toIndex].data.ID);
      const fromIndex = tasks.findIndex((item) => item.ID === e.itemData.ID);
      const result = tasks.filter((_, index) => index !== fromIndex);

      result.splice(toIndex, 0, e.itemData);

      return result;
    });
  };
}

bootstrapApplication(AppComponent);
