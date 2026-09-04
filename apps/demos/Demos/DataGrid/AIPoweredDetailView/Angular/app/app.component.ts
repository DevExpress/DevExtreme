import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { Service, type Vehicle } from './app.service';
import { Category } from './category/category.component';
import { DetailViewComponent } from './detail-view/detail-view.component';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service],
  imports: [
    DxDataGridModule,
    DetailViewComponent,
    Category,
  ],
})
export class AppComponent {
  vehicles: Vehicle[];

  constructor(service: Service) {
    this.vehicles = service.getVehicles();
  }

  calculateModel(data: Vehicle) {
    return `${data.TrademarkName} ${data.Name}`;
  }

  onRowExpanding({ component }: DxDataGridTypes.RowExpandingEvent) {
    component.collapseAll(-1);
  }

  onCellClick({ column, row, component, key }: DxDataGridTypes.CellClickEvent) {
    if (column.type === 'detailExpand' && row.rowType === 'data') {
      if (row.isExpanded) {
        component.collapseRow(key);
      } else {
        component.expandRow(key);
      }
    }
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
