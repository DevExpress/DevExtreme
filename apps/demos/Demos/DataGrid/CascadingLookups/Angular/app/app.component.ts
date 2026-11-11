import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { Service, Employee, City } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  providers: [Service],
  imports: [
    DxDataGridModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly dataSource = this.service.getEmployees();

  readonly states = this.service.getStates();

  private readonly cities = this.service.getCities();

  constructor() {
    this.getFilteredCities = this.getFilteredCities.bind(this);
  }

  getFilteredCities(options: { data: City }) {
    return {
      store: this.cities,
      filter: options.data ? ['StateID', '=', options.data.StateID] : null,
    };
  }

  onEditorPreparing(e: DxDataGridTypes.EditorPreparingEvent<Employee>) {
    if (e.parentType === 'dataRow' && e.dataField === 'CityID') {
      e.editorOptions.disabled = e.row.data.StateID === undefined;
    }
  }

  setStateValue(this: DxDataGridTypes.Column, newData: Employee, value: number, currentRowData: Employee) {
    newData.CityID = null;
    this.defaultSetCellValue?.(newData, value, currentRowData);
  }
}

bootstrapApplication(AppComponent);
