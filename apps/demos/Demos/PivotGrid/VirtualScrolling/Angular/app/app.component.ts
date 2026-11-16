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
  providers: [Service],
  imports: [
    DxPivotGridModule,
  ],
})
export class AppComponent {
  readonly pivotGridDataSource: DataSourceConfig = {
    fields: [{
      caption: 'Region',
      width: 120,
      dataField: 'region',
      area: 'row',
      expanded: true,
    }, {
      caption: 'City',
      dataField: 'city',
      width: 150,
      area: 'row',
    }, {
      dataField: 'date',
      dataType: 'date',
      area: 'column',
    }, {
      groupName: 'date',
      groupInterval: 'year',
      expanded: true,
    }, {
      groupName: 'date',
      groupInterval: 'quarter',
      expanded: true,
    }, {
      caption: 'Total',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      format: 'currency',
      area: 'data',
    }],
    store: inject(Service).getSales(),
  };
}

bootstrapApplication(AppComponent);
