import {
  NgModule, Component, ViewChild, enableProdMode,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDataGridComponent, DxDataGridModule } from 'devextreme-angular';
import { DxCheckBoxModule, DxCheckBoxTypes } from 'devextreme-angular/ui/check-box';
import { Employee, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
})

export class AppComponent {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

  employees: Employee[];

  positionDisableSorting = false;

  constructor(service: Service) {
    this.employees = service.getEmployees();
  }

  onValueChange(e: DxCheckBoxTypes.ValueChangedEvent) {
    if (e.value) {
      this.dataGrid.instance.columnOption(5, 'sortOrder', undefined);
    }
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxDataGridModule,
    DxCheckBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
