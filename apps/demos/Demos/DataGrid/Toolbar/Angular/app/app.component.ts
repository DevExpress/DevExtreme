import { bootstrapApplication } from '@angular/platform-browser';
import { Component, ViewChild, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import {
  DxDataGridModule,
  DxDataGridComponent,
  DxButtonModule,
} from 'devextreme-angular';
import { DxButtonTypes } from 'devextreme-angular/ui/button';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { query } from 'devextreme-angular/common/data';
import { DxSelectBoxModule, DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import { Service, Order } from './app.service';

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
    DxSelectBoxModule,
    DxButtonModule,
  ],
})
export class AppComponent {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid: DxDataGridComponent;

  orders: Order[];

  totalCount: number;

  expandAll = true;

  groupingValues = [{
    value: 'CustomerStoreState',
    text: 'Grouping by State',
  }, {
    value: 'Employee',
    text: 'Grouping by Employee',
  }];

  refreshButtonOptions: DxButtonTypes.Properties = {
    icon: 'refresh',
    text: 'Refresh',
    onClick: () => {
      this.dataGrid.instance.refresh();
    },
  };

  toggleButtonOptions: DxButtonTypes.Properties = {
    text: this.expandAll ? 'Collapse All' : 'Expand All',
    width: 136,
    onClick: () => {
      this.toggleExpandAll();
      this.toggleButtonOptions = {
        ...this.toggleButtonOptions,
        text: this.expandAll ? 'Collapse All' : 'Expand All',
      };
    },
  };

  constructor(service: Service) {
    this.orders = service.getOrders();
    this.totalCount = this.getGroupCount('CustomerStoreState');
  }

  getGroupCount(groupField: string) {
    return query(this.orders)
      .groupBy(groupField)
      .toArray().length;
  }

  toggleGroupColumn(e: DxSelectBoxTypes.ValueChangedEvent) {
    this.dataGrid.instance.clearGrouping();
    this.dataGrid.instance.columnOption(e.value, 'groupIndex', 0);
    this.totalCount = this.getGroupCount(e.value);
  }

  toggleExpandAll() {
    this.expandAll = !this.expandAll;
  }

  onToolbarPreparing(e: DxDataGridTypes.ToolbarPreparingEvent) {
    e.toolbarOptions.allowKeyboardNavigation = false;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
