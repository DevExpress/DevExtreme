import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxTreeListModule, DxTreeListTypes } from 'devextreme-angular/ui/tree-list';
import { DxSelectBoxModule, DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import { Employee, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
})
export class AppComponent {
  employees: Employee[];

  resizingModes: DxTreeListTypes.ColumnResizeMode[] = ['nextColumn', 'widget'];

  columnResizingMode = this.resizingModes[0];

  constructor(service: Service) {
    this.employees = service.getEmployees();
  }

  selectResizing({ value }: DxSelectBoxTypes.ValueChangedEvent) {
    this.columnResizingMode = value;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxTreeListModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
