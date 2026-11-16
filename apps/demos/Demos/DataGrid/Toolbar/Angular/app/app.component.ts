import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, computed, enableProdMode, inject, signal, viewChild,
} from '@angular/core';
import {
  DxDataGridModule,
  DxDataGridComponent,
} from 'devextreme-angular';
import { DxButtonTypes } from 'devextreme-angular/ui/button';
import { query } from 'devextreme-angular/common/data';
import { DxSelectBoxModule, DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
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
    DxSelectBoxModule,
  ],
})
export class AppComponent {
  private readonly dataGrid = viewChild.required(DxDataGridComponent);

  readonly orders = inject(Service).getOrders();

  readonly expandAll = signal(true);

  readonly groupField = signal('CustomerStoreState');

  readonly totalCount = computed(() => query(this.orders)
    .groupBy(this.groupField())
    .toArray().length);

  readonly groupingValues = [{
    value: 'CustomerStoreState',
    text: 'Grouping by State',
  }, {
    value: 'Employee',
    text: 'Grouping by Employee',
  }];

  readonly refreshButtonOptions: DxButtonTypes.Properties = {
    icon: 'refresh',
    text: 'Refresh',
    onClick: () => {
      this.dataGrid().instance.refresh();
    },
  };

  readonly toggleButtonOptions = computed<DxButtonTypes.Properties>(() => ({
    text: this.expandAll() ? 'Collapse All' : 'Expand All',
    width: 136,
    onClick: () => {
      this.expandAll.update((expandAll) => !expandAll);
    },
  }));

  toggleGroupColumn(e: DxSelectBoxTypes.ValueChangedEvent) {
    const { instance } = this.dataGrid();

    instance.clearGrouping();
    instance.columnOption(e.value, 'groupIndex', 0);
    this.groupField.set(e.value);
  }
}

bootstrapApplication(AppComponent);
