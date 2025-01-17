import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
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
})
export class AppComponent {
  employees: Employee[];

  lookupData: {
    store: Employee[],
    sort: string,
  };

  constructor(service: Service) {
    this.employees = service.getEmployees();

    this.lookupData = {
      store: this.employees,
      sort: 'Full_Name',
    };
  }

  editorPreparing(e: DxTreeListTypes.EditorPreparingEvent) {
    if (e.dataField === 'Head_ID' && e.row.data.ID === 1) {
      e.cancel = true;
    }
  }

  initNewRow(e: DxTreeListTypes.InitNewRowEvent) {
    e.data.Head_ID = 1;
  }

  allowDeleting = ({ row }) => row.data.ID !== 1;
}

@NgModule({
  imports: [
    BrowserModule,
    DxTreeListModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
