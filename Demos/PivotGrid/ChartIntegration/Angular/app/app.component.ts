import { NgModule, Component, ViewChild, AfterViewInit, enableProdMode } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxPivotGridModule,
         DxPivotGridComponent,
         DxChartModule,
         DxChartComponent } from 'devextreme-angular';
import { Service } from './app.service';

import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service, CurrencyPipe]
})
export class AppComponent implements AfterViewInit {
  @ViewChild(DxPivotGridComponent, { static: false }) pivotGrid: DxPivotGridComponent;
  @ViewChild(DxChartComponent, { static: false }) chart: DxChartComponent;

  pivotGridDataSource: any;

  constructor(service: Service, private currencyPipe: CurrencyPipe) {
    this.customizeTooltip = this.customizeTooltip.bind(this);

    this.pivotGridDataSource = {
      fields: [{
        caption: "Region",
        width: 120,
        dataField: "region",
        area: "row",
        sortBySummaryField: "Total"
      }, {
        caption: "City",
        dataField: "city",
        width: 150,
        area: "row"
      }, {
        dataField: "date",
        dataType: "date",
        area: "column"
      }, {
        groupName: "date",
        groupInterval: "month",
        visible: false
      }, {
        caption: "Total",
        dataField: "amount",
        dataType: "number",
        summaryType: "sum",
        format: "currency",
        area: "data"
      }, {
        summaryType: "count",
        area: "data"
      }],
      store: service.getSales()
    }
  }

  ngAfterViewInit() {
    this.pivotGrid.instance.bindChart(this.chart.instance, {
      dataFieldsDisplayMode: "splitPanes",
      alternateDataFields: false
    });
  }

  customizeTooltip(args) {
    const valueText = (args.seriesName.indexOf("Total") != -1)
      ? new Intl.NumberFormat('en-EN', { style: 'currency', currency: 'USD' }).format(args.originalValue)
      : args.originalValue;

    return {
      html: args.seriesName + "<div class='currency'>" + valueText + "</div>"
    };
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxPivotGridModule,
    DxChartModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);