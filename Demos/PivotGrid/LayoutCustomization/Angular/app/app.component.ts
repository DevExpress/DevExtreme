import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxPivotGridModule, DxCheckBoxModule } from 'devextreme-angular';
import { Service } from './app.service';

import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';

if(!/localhost/.test(document.location.host)) {
    enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
  preserveWhitespaces: true
})
export class AppComponent {
    pivotGridDataSource: any;
    showTotalsPrior = false;
    rowsDataFieldArea = false;
    treeHeaderLayout = true;

  constructor(service: Service) {
    this.pivotGridDataSource = {
      fields: [{
        caption: "Region",
        dataField: "region",
        expanded: true,
        area: "row"
      }, {
        caption: "Country",
        dataField: "country",
        expanded: true,
        area: "row"
      }, {
        caption: "City",
        dataField: "city",
        area: "row"
      }, {
        dataField: "date",
        dataType: "date",
        area: "column"
      }, {
        caption: "Sales",
        dataField: "amount",
        dataType: "number",
        summaryType: "sum",
        format: "currency",
        area: "data"
      }, {
        caption: "Percent",
        dataField: "amount",
        dataType: "number",
        summaryType: "sum",
        summaryDisplayMode: "percentOfRowGrandTotal",
        area: "data"
      }],
      store: service.getSales()
    };
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxPivotGridModule,
    DxCheckBoxModule
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);