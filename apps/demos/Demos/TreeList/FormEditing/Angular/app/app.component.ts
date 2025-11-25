import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxTreeListModule, DxTreeListTypes } from 'devextreme-angular/ui/tree-list';
import { Employee, Service } from './app.service';

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
  providers: [Service],
  imports: [
    DxTreeListModule,
  ],
})
export class AppComponent {
  employees: Employee[];

  lookupData: { store: Employee[], sort: string };

  constructor(service: Service) {
    this.employees = service.getEmployees();
    this.lookupData = {
      store: this.employees,
      sort: 'Full_Name',
    };
  }

  editorPreparing(e: DxTreeListTypes.EditorPreparingEvent) {
    if (e.dataField === 'Head_ID' && e.row.data.ID === 1) {
      e.editorOptions.disabled = true;
      e.editorOptions.value = null;
    }
  }

  initNewRow(e: DxTreeListTypes.InitNewRowEvent) {
    e.data.Head_ID = 1;
  }

  allowDeleting = ({ row }) => row.data.ID !== 1;
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
