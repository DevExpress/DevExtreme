import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDataGridModule } from 'devextreme-angular';
import { DxRangeSelectorModule, DxRangeSelectorTypes } from 'devextreme-angular/ui/range-selector';
import { Service, Employee } from './app.service';

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
  providers: [Service],
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
})
export class AppComponent {
  employees: Employee[];

  selectedEmployees: Employee[];

  constructor(service: Service) {
    this.employees = service.getEmployees();
    this.selectedEmployees = this.employees;
  }

  onValueChanged(e: DxRangeSelectorTypes.ValueChangedEvent) {
    this.selectedEmployees = this.employees.map(
      (item, index) => (
        (item.BirthYear >= (e.value[0] as number) && item.BirthYear <= (e.value[1] as number))
          ? item
          : undefined
      ),
    ).filter(Boolean);
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxRangeSelectorModule,
    DxDataGridModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
