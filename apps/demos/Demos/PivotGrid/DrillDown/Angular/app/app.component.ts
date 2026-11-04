import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal, viewChild,
} from '@angular/core';
import {
  DxDataGridComponent,
  DxDataGridModule,
  DxPopupModule,
} from 'devextreme-angular';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import { DataSource } from 'devextreme-angular/common/data';
import { DxPivotGridModule, DxPivotGridTypes } from 'devextreme-angular/ui/pivot-grid';
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
    DxPopupModule,
    DxDataGridModule,
  ],
})
export class AppComponent {
  private readonly drillDownDataGrid = viewChild.required<DxDataGridComponent>('drillDownDataGrid');

  readonly pivotGridDataSource = new PivotGridDataSource({
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
    store: inject(Service).getSales(),
  });

  readonly drillDownDataSource = signal<DataSource | undefined>(undefined);

  readonly salesPopupVisible = signal(false);

  readonly salesPopupTitle = signal('');

  onPivotCellClick(e: DxPivotGridTypes.CellClickEvent) {
    if (e.area === 'data') {
      const rowPathLength = e.cell.rowPath.length;
      const rowPathName = e.cell.rowPath[rowPathLength - 1];

      this.drillDownDataSource.set(this.pivotGridDataSource.createDrillDownDataSource(e.cell));
      this.salesPopupTitle.set(`${rowPathName || 'Total'} Drill Down Data`);
      this.salesPopupVisible.set(true);
    }
  }

  onPopupShown() {
    this.drillDownDataGrid().instance.updateDimensions();
  }
}

bootstrapApplication(AppComponent);
