import { NgModule, Component, enableProdMode, ViewChild } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxCardViewComponent, DxCardViewModule, DxSelectBoxModule } from 'devextreme-angular';
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
})
export class AppComponent {
  @ViewChild(DxCardViewComponent, { static: false }) cardView: DxCardViewComponent;

  employees: Employee[];

  selectionMode = 'multiple';

  allowSelectAll = true;

  showCheckBoxesMode = 'always';

  selectAllMode = 'allPages';


  altExpr({ FullName }: Employee): string {
    return `Photo of ${FullName}`;
  }

  imageExpr({ FullName }: Employee): string {
    return `../../../../images/employees/new/${FullName}.jpg`;
  }

  clearSelection() {
    this.cardView.instance.clearSelection();
  }

  constructor(service: Service) {
    this.employees = service.getEmployees();
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxCardViewModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
