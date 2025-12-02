import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, ViewChild, provideZoneChangeDetection } from '@angular/core';
import { DxCardViewComponent, DxCardViewModule, DxSelectBoxModule, DxCheckBoxModule } from 'devextreme-angular';
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
    DxCardViewModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
  ],
})
export class AppComponent {
  @ViewChild(DxCardViewComponent, { static: true }) cardView: DxCardViewComponent;

  employees: Employee[];

  selectionMode = 'multiple';

  allowSelectAll = true;

  showCheckBoxesMode = 'always';

  selectAllMode = 'allPages';

  constructor(service: Service) {
    this.employees = service.getEmployees();
  }

  altExpr({ FullName }: Employee): string {
    return `Photo of ${FullName}`;
  }

  imageExpr({ FullName }: Employee): string {
    return `../../../../images/employees/new/${FullName}.jpg`;
  }

  clearSelection() {
    this.cardView.instance.clearSelection();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
