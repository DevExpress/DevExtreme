import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, type AfterViewInit, enableProdMode, inject, viewChild,
} from '@angular/core';
import {
  DxPivotGridModule,
  DxPivotGridComponent,
  DxChartModule,
  DxChartComponent,
} from 'devextreme-angular';
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
    DxChartModule,
  ],
})
export class AppComponent implements AfterViewInit {
  private readonly pivotGrid = viewChild.required(DxPivotGridComponent);

  private readonly chart = viewChild.required(DxChartComponent);

  readonly pivotGridDataSource: DataSourceConfig = {
    fields: [{
      caption: 'Region',
      width: 120,
      dataField: 'region',
      area: 'row',
      sortBySummaryField: 'Total',
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
      groupInterval: 'month',
      visible: false,
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

  ngAfterViewInit() {
    this.pivotGrid().instance.bindChart(this.chart().instance, {
      dataFieldsDisplayMode: 'splitPanes',
      alternateDataFields: false,
    });

    setTimeout(() => {
      const dataSource = this.pivotGrid().instance.getDataSource();
      dataSource.expandHeaderItem('row', ['North America']);
      dataSource.expandHeaderItem('column', [2023]);
    }, 0);
  }

  readonly customizeTooltip = (args) => ({
    html: `${args.seriesName} | Total<div class='currency'>${args.valueText}</div>`,
  });
}

bootstrapApplication(AppComponent);
