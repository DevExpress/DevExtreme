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
  readonly pivotGridDataSource: DataSourceConfig = {
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
      groupName: 'date',
      groupInterval: 'month',
      visible: false,
    }, {
      caption: 'Total',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      format: 'currency',
      area: 'data',
    }, {
      caption: 'Running Total',
      dataField: 'amount',
      dataType: 'number',
      summaryType: 'sum',
      format: 'currency',
      area: 'data',
      runningTotal: 'row',
      allowCrossGroupCalculation: true,
    }],
    store: inject(Service).getSales(),
  };
}

bootstrapApplication(AppComponent);
