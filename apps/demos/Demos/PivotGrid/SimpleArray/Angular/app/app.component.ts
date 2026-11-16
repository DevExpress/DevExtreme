import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxPivotGridModule } from 'devextreme-angular';
import type { Options as DataSourceConfig } from 'devextreme/ui/pivot_grid/data_source';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxPivotGridModule,
  ],
})
export class AppComponent {
  readonly dataSource: DataSourceConfig = {
    fields: [{
      caption: 'Region',
      width: 120,
      dataField: 'region',
      area: 'row',
    }, {
      caption: 'City',
      dataField: 'city',
      width: 150,
      area: 'row',
      selector: this.citySelector,
    }, {
      dataField: 'date',
      dataType: 'date',
      area: 'column',
    }, {
      caption: 'Sales',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      format: 'currency',
      area: 'data',
    }],
    store: inject(Service).getSales(),
  };

  private citySelector(data) {
    return `${data.city} (${data.country})`;
  }
}

bootstrapApplication(AppComponent);
