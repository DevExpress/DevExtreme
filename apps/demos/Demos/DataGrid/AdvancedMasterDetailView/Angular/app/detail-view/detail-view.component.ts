import { Component, Input, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { DataSource } from 'devextreme-angular/common/data';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import { DxFormModule, DxDataGridModule, DxSelectBoxModule, DxTabPanelModule } from 'devextreme-angular';
import { DxFormTypes } from 'devextreme-angular/ui/form';
import { DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'detail-view',
  templateUrl: `.${modulePrefix}/detail-view/detail-view.component.html`,
  styleUrls: [`.${modulePrefix}/detail-view/detail-view.component.css`],
  imports: [
    DxDataGridModule,
    DxFormModule,
    DxSelectBoxModule,
    DxTabPanelModule,
  ],
})
export class DetailViewComponent implements AfterViewInit {
  @Input() key: number;

  @Input() rowData: object;

  url: string;

  productIdBySupplier: number;

  productsData: DataSource;

  orderHistoryData: DataSource;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    this.url = 'https://js.devexpress.com/Demos/NetCore/api/DataGridAdvancedMasterDetailView';
  }

  ngAfterViewInit() {
    this.productsData = new DataSource({
      store: AspNetData.createStore({
        key: 'ProductID',
        loadParams: { SupplierID: this.key },
        loadUrl: `${this.url}/GetProductsBySupplier`,
        onLoaded: (items) => this.setDefaultProduct(items),
      }),
    });

    this.changeDetectorRef.detectChanges();
  }

  setDefaultProduct(items) {
    const firstItem = items[0];

    if (firstItem && this.productIdBySupplier === undefined) {
      this.productIdBySupplier = firstItem.ProductID;
    }
    this.changeDetectorRef.detectChanges();
  }

  handleValueChange(e: DxSelectBoxTypes.ValueChangedEvent) {
    this.productIdBySupplier = e.value;
    this.orderHistoryData = new DataSource({
      store: AspNetData.createStore({
        key: 'OrderID',
        loadParams: { ProductID: e.value },
        loadUrl: `${this.url}/GetOrdersByProduct`,
      }),
    });
  }

  customizeItemTemplate(item: DxFormTypes.SimpleItem) {
    item.template = 'formItem';
  }
}
