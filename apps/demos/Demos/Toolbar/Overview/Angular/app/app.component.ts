import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxListModule, DxToolbarModule, DxSelectBoxModule } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';
import { DxButtonTypes } from 'devextreme-angular/ui/button';
import { DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import { ProductType, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
})
export class AppComponent {
  items: ProductType[];

  productTypes: ProductType[];

  productsStore: DataSource;

  selectBoxOptions: DxSelectBoxTypes.Properties;

  backButtonOptions: DxButtonTypes.Properties = {
    icon: 'back',
    onClick: () => {
      notify('Back button has been clicked!');
    },
  };

  refreshButtonOptions: DxButtonTypes.Properties = {
    icon: 'refresh',
    onClick: () => {
      notify('Refresh button has been clicked!');
    },
  };

  addButtonOptions: DxButtonTypes.Properties = {
    icon: 'plus',
    onClick: () => {
      notify('Add button has been clicked!');
    },
  };

  saveButtonOptions: DxButtonTypes.Properties = {
    text: 'Save',
    onClick: () => {
      notify('Save option has been clicked!');
    },
  };

  printButtonOptions: DxButtonTypes.Properties = {
    text: 'Print',
    onClick: () => {
      notify('Print option has been clicked!');
    },
  };

  settingsButtonOptions: DxButtonTypes.Properties = {
    text: 'Settings',
    onClick: () => {
      notify('Settings option has been clicked!');
    },
  };

  constructor(service: Service) {
    this.productTypes = service.getProductTypes();
    this.productsStore = new DataSource(service.getProducts());

    this.selectBoxOptions = {
      width: 140,
      items: this.productTypes,
      valueExpr: 'id',
      displayExpr: 'text',
      value: this.productTypes[0].id,
      inputAttr: { 'aria-label': 'Categories' },
      onValueChanged: ({ value }) => {
        this.productsStore.filter(
          (value > 1)
            ? ['type', '=', value]
            : null,
        );

        this.productsStore.load();
      },
    };
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxListModule,
    DxToolbarModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
