import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSelectBoxModule } from 'devextreme-angular';
import { DxLookupModule, DxLookupTypes } from 'devextreme-angular/ui/lookup';
import { Service, Employee } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

declare var __moduleName: string;
@Component({
  moduleId: __moduleName,
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  employees: Employee[];

  selectedEmployee: Employee;

  applyValueMode: DxLookupTypes.ApplyValueMode = 'instantly';

  applyValueModes: DxLookupTypes.ApplyValueMode[] = ['instantly', 'useButtons'];

  constructor(service: Service) {
    this.employees = service.getEmployees();
  }

  valueChanged({ value }: DxLookupTypes.ValueChangedEvent) {
    this.selectedEmployee = value;
  }

  getDisplayExpr = ({ FirstName, LastName }: Record<string, string> = {}) => (FirstName ? `${FirstName} ${LastName}` : undefined);
}

@NgModule({
  imports: [
    BrowserModule,
    DxLookupModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
