import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, viewChild,
} from '@angular/core';
import { DxDataGridComponent, DxDataGridModule, DxSelectBoxModule } from 'devextreme-angular';
import { type DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';

import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  preserveWhitespaces: true,
  providers: [Service],
  imports: [
    DxDataGridModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  private readonly dataGrid = viewChild.required(DxDataGridComponent);

  private readonly service = inject(Service);

  readonly statuses = this.service.getStatuses();

  readonly tasks = this.service.getTasks();

  selectStatus(e: DxSelectBoxTypes.ValueChangedEvent) {
    const { instance } = this.dataGrid();

    if (e.value === 'All') {
      instance.clearFilter();
    } else {
      instance.filter(['Task_Status', '=', e.value]);
    }
  }
}

bootstrapApplication(AppComponent);
