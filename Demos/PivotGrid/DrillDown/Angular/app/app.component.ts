import {
  NgModule, Component, enableProdMode, ViewChild,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {
  DxPivotGridModule,
  DxDataGridComponent,
  DxDataGridModule,
  DxPopupModule,
  DxTemplateModule,
} from 'devextreme-angular';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
})
export class AppComponent {
  @ViewChild('drillDownDataGrid') drillDownDataGrid: DxDataGridComponent;

  pivotGridDataSource: any;

  drillDownDataSource: any;

  salesPopupVisible = false;

  salesPopupTitle = '';

  constructor(service: Service) {
    this.pivotGridDataSource = new PivotGridDataSource({
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
        caption: 'Total',
        dataField: 'amount',
        dataType: 'number',
        summaryType: 'sum',
        format: 'currency',
        area: 'data',
      }],
      store: service.getSales(),
    });
  }

  onPivotCellClick(e) {
    if (e.area == 'data') {
      const rowPathLength = e.cell.rowPath.length;
      const rowPathName = e.cell.rowPath[rowPathLength - 1];

      this.drillDownDataSource = this.pivotGridDataSource.createDrillDownDataSource(e.cell);
      this.salesPopupTitle = `${rowPathName || 'Total'} Drill Down Data`;
      this.salesPopupVisible = true;
    }
  }

  onPopupShown() {
    this.drillDownDataGrid.instance.updateDimensions();
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxTemplateModule,
    DxPivotGridModule,
    DxPopupModule,
    DxDataGridModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
