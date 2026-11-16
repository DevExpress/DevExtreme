import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { DxNumberBoxModule, DxCheckBoxModule, DxSelectBoxModule } from 'devextreme-angular';
import type { SimplifiedSearchMode } from 'devextreme-angular/common';
import { DataSource } from 'devextreme-angular/common/data';
import type { DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import { Service, type SimpleProduct } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxSelectBoxModule,
    DxNumberBoxModule,
    DxCheckBoxModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly products = this.service.getProducts();

  private readonly simpleProducts = this.service.getSimpleProducts();

  readonly productsDataSource = new DataSource({
    store: {
      data: this.simpleProducts,
      type: 'array',
      key: 'ID',
    },
  });

  product = this.simpleProducts[0].ID;

  readonly selectedProduct = signal<SimpleProduct | null>(this.simpleProducts[0]);

  readonly searchModeOption = signal<SimplifiedSearchMode>('contains');

  readonly searchExprOption = signal<string | string[]>('Name');

  readonly searchTimeoutOption = signal(200);

  readonly minSearchLengthOption = signal(0);

  readonly showDataBeforeSearchOption = signal(false);

  readonly searchExprOptionItems = [{
    name: "'Name'",
    value: 'Name',
  }, {
    name: "['Name', 'Category']",
    value: ['Name', 'Category'],
  }];

  addCustomItem(data: DxSelectBoxTypes.CustomItemCreatingEvent) {
    if (!data.text) {
      data.customItem = null;
      return;
    }

    const productIds = this.simpleProducts.map((item) => item.ID);
    const incrementedId = Math.max.apply(null, productIds) + 1;
    const newItem = {
      Name: data.text,
      ID: incrementedId,
    };

    data.customItem = this.productsDataSource.store().insert(newItem)
      .then(() => this.productsDataSource.load())
      .then(() => newItem)
      .catch((error) => {
        throw error;
      });
  }
}

bootstrapApplication(AppComponent);
