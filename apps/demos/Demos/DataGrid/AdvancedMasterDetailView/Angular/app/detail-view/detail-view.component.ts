import {
  Component, computed, input, signal,
} from '@angular/core';
import { DataSource } from 'devextreme-angular/common/data';
import * as AspNetData from 'devextreme-aspnet-data-nojquery';
import { DxFormModule, DxDataGridModule, DxSelectBoxModule, DxTabPanelModule } from 'devextreme-angular';
import { DxFormTypes } from 'devextreme-angular/ui/form';
import { DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';

const url = 'https://js.devexpress.com/Demos/NetCore/api/DataGridAdvancedMasterDetailView';

@Component({
  selector: 'detail-view',
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.css'],
  imports: [
    DxDataGridModule,
    DxFormModule,
    DxSelectBoxModule,
    DxTabPanelModule,
  ],
})
export class DetailViewComponent {
  readonly key = input.required<number>();

  readonly rowData = input.required<object>();

  readonly productIdBySupplier = signal<number | undefined>(undefined);

  readonly productsData = computed(() => new DataSource({
    store: AspNetData.createStore({
      key: 'ProductID',
      loadParams: { SupplierID: this.key() },
      loadUrl: `${url}/GetProductsBySupplier`,
      onLoaded: (items) => this.setDefaultProduct(items),
    }),
  }));

  readonly orderHistoryData = computed(() => {
    const productId = this.productIdBySupplier();

    if (productId === undefined) {
      return null;
    }

    return new DataSource({
      store: AspNetData.createStore({
        key: 'OrderID',
        loadParams: { ProductID: productId },
        loadUrl: `${url}/GetOrdersByProduct`,
      }),
    });
  });

  setDefaultProduct(items) {
    const firstItem = items[0];

    if (firstItem && this.productIdBySupplier() === undefined) {
      this.productIdBySupplier.set(firstItem.ProductID);
    }
  }

  handleValueChange(e: DxSelectBoxTypes.ValueChangedEvent) {
    this.productIdBySupplier.set(e.value);
  }

  customizeItemTemplate(item: DxFormTypes.SimpleItem) {
    item.template = 'formItem';
  }
}
