import { bootstrapApplication } from '@angular/platform-browser';
import { Component, ViewChild, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { formatMessage } from 'devextreme/localization';
import { DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { Service, type Vehicle } from './app.service';
import { Category } from './category/category.component';
import { DetailViewComponent } from './detail-view/detail-view.component';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxDataGridModule,
    DetailViewComponent,
    Category,
  ],
})
export class AppComponent {
  @ViewChild(DetailViewComponent) detailView?: DetailViewComponent;

  vehicles: Vehicle[];

  constructor(service: Service) {
    this.vehicles = service.getVehicles();
  }

  calculateModel(data: Vehicle) {
    return `${data.TrademarkName} ${data.Name}`;
  }

  onRowExpanding({ component }: DxDataGridTypes.RowExpandingEvent) {
    this.detailView?.abortRequest();
    component.collapseAll(-1);
  }

  onRowCollapsing() {
    this.detailView?.abortRequest();
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

  onCellPrepared({ rowType, column, cellElement, row }: DxDataGridTypes.CellPreparedEvent) {
    if (rowType === 'data' && column.type === 'detailExpand') {
      const ariaLabelCollapse = formatMessage('dxDataGrid-ariaCollapse');
      const ariaLabelExpand = formatMessage('dxDataGrid-ariaExpand');
      const ariaLabel = row.isExpanded ? ariaLabelCollapse : ariaLabelExpand;
      cellElement.setAttribute('aria-label', ariaLabel);
    }
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
