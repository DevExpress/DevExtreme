import { bootstrapApplication } from '@angular/platform-browser';
import { Component, ViewChild, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxDataGridComponent, DxDataGridModule, DxSelectBoxModule } from 'devextreme-angular';
import { type DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';

import { Service, Task } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  preserveWhitespaces: true,
  providers: [Service],
  imports: [
    DxDataGridModule,
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

  statuses: string[];

  tasks: Task[];

  constructor(private service: Service) {
    this.statuses = this.service.getStatuses();
    this.tasks = this.service.getTasks();
  }

  selectStatus(e: DxSelectBoxTypes.ValueChangedEvent) {
    if (e.value === 'All') {
      this.dataGrid.instance.clearFilter();
    } else {
      this.dataGrid.instance.filter(['Task_Status', '=', e.value]);
    }
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
