import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  DxPivotGridModule,
  DxPivotGridFieldChooserModule,
  DxRadioGroupModule,
  DxButtonModule,
  DxSelectBoxModule,
} from 'devextreme-angular';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import { Service, Layout, Sale } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
})
export class AppComponent {
  pivotGridDataSource: any;

  layouts: Layout[];

  layout = 0;

  applyChangesModes: any;

  applyChangesMode: any;

  state: any;

  constructor(service: Service) {
    this.pivotGridDataSource = new PivotGridDataSource({
      fields: [{
        caption: 'Region',
        width: 120,
        dataField: 'region',
        area: 'row',
        headerFilter: {
          search: {
            enabled: true,
          },
        },
      }, {
        caption: 'City',
        dataField: 'city',
        width: 150,
        area: 'row',
        headerFilter: {
          search: {
            enabled: true,
          },
        },
        selector(data: Sale) {
          return `${data.city} (${data.country})`;
        },
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
      store: service.getSales(),
    });

    this.state = this.pivotGridDataSource.state();

    this.layouts = service.getLayouts();

    this.applyChangesModes = ['instantly', 'onDemand'];
    this.applyChangesMode = this.applyChangesModes[0];
  }

  applyClick(data) {
    this.pivotGridDataSource.state(this.state);
  }

  cancelClick(data) {
    this.state = this.pivotGridDataSource.state();
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxPivotGridModule,
    DxRadioGroupModule,
    DxPivotGridFieldChooserModule,
    DxSelectBoxModule,
    DxButtonModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
