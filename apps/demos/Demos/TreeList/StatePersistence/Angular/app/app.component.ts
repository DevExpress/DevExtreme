import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, ViewChild, provideZoneChangeDetection } from '@angular/core';
import { DxTreeListModule, DxTreeListComponent } from 'devextreme-angular';
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
  @ViewChild(DxTreeListComponent, { static: false }) treeList: DxTreeListComponent;

  employees: Employee[];

  constructor(private service: Service) {
    this.employees = service.getEmployees();
  }

  onStateResetClick() {
    this.treeList.instance.state(null);
  }

  onRefreshClick() {
    window.location.reload();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
