import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxNumberBoxModule, DxCheckBoxModule, DxSelectBoxModule } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import { DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import { Product, Service, SimpleProduct } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
})
export class AppComponent {
  products: Product[];

  simpleProducts: SimpleProduct[];

  productsDataSource: DataSource;

  product: number;

  searchModeOption = 'contains';

  searchExprOption = 'Name';

  searchTimeoutOption = 200;

  minSearchLengthOption = 0;

  showDataBeforeSearchOption = false;

  searchExprOptionItems = [{
    name: "'Name'",
    value: 'Name',
  }, {
    name: "['Name', 'Category']",
    value: ['Name', 'Category'],
  }];

  constructor(service: Service) {
    this.products = service.getProducts();
    this.simpleProducts = service.getSimpleProducts();
    this.product = this.simpleProducts[0].ID;
    this.productsDataSource = new DataSource({
      store: {
        data: this.simpleProducts,
        type: 'array',
        key: 'ID',
      },
    });
  }

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

@NgModule({
  imports: [
    BrowserModule,
    DxSelectBoxModule,
    DxNumberBoxModule,
    DxCheckBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
