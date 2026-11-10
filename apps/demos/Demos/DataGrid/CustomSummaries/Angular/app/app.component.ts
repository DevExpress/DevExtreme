import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxDataGridModule, DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
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
    DxDataGridModule,
  ],
})
export class AppComponent {
  readonly orders = inject(Service).getOrders();

  calculateSelectedRow(options: Parameters<DxDataGridTypes.Summary['calculateCustomSummary']>[0]) {
    if (options.name === 'SelectedRowsSummary') {
      if (options.summaryProcess === 'start') {
        options.totalValue = 0;
      }

      const isRowSelected = options.component.isRowSelected(options.value?.ID);

      if (options.summaryProcess === 'calculate' && isRowSelected) {
        options.totalValue += options.value.SaleAmount;
      }
    }
  }

  async onSelectionChanged(e: DxDataGridTypes.SelectionChangedEvent) {
    await e.component.refresh(true);
  }
}

bootstrapApplication(AppComponent);
