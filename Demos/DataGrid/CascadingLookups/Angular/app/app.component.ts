import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDataGridModule } from 'devextreme-angular';
import { Column } from 'devextreme/ui/data_grid';
import {
  Service, Employee, State, City,
} from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  providers: [Service],
})
export class AppComponent {
  dataSource: Employee[];

  states: State[];

  cities: City[];

  constructor(private service: Service) {
    this.dataSource = service.getEmployees();
    this.states = service.getStates();
    this.cities = service.getCities();

    this.getFilteredCities = this.getFilteredCities.bind(this);
  }

  getFilteredCities(options) {
    return {
      store: this.cities,
      filter: options.data ? ['StateID', '=', options.data.StateID] : null,
    };
  }

  onEditorPreparing(e) {
    if (e.parentType === 'dataRow' && e.dataField === 'CityID') {
      e.editorOptions.disabled = (typeof e.row.data.StateID !== 'number');
    }
  }

  setStateValue(this: Column, newData: Employee, value: number, currentRowData: Employee) {
    newData.CityID = null;
    this.defaultSetCellValue(newData, value, currentRowData);
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxDataGridModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
