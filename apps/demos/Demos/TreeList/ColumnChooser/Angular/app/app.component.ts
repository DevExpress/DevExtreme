import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxSelectBoxModule, DxCheckBoxModule } from 'devextreme-angular';
import { DxTextBoxTypes } from 'devextreme-angular/ui/text-box';
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
  preserveWhitespaces: true,
  imports: [
    DxTreeListModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
  ],
})
export class AppComponent {
  employees: Employee[];

  searchEnabled = true;

  allowSelectAll = true;

  selectByClick = true;

  recursive = true;

  editorOptions: DxTextBoxTypes.Properties = { placeholder: 'Search column' };

  columnChooserModes: { key: DxTreeListTypes.ColumnChooser['mode'], name: string }[] = [{
    key: 'dragAndDrop',
    name: 'Drag and drop',
  }, {
    key: 'select',
    name: 'Select',
  }];

  constructor(service: Service) {
    this.employees = service.getEmployees();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
