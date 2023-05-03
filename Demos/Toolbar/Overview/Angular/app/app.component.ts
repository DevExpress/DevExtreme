import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import {
  DxListModule, DxToolbarModule, DxSelectBoxModule, DxTemplateModule,
} from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import notify from 'devextreme/ui/notify';

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
  items: any[];

  productTypes: ProductType[];

  productsStore: any;

  backButtonOptions: any;

  refreshButtonOptions: any;

  selectBoxOptions: any;

  addButtonOptions: any;

  saveButtonOptions: any;

  printButtonOptions: any;

  settingsButtonOptions: any;

  constructor(service: Service) {
    this.productTypes = service.getProductTypes();
    this.productsStore = new DataSource(service.getProducts());

    this.backButtonOptions = {
      icon: 'back',
      onClick: () => {
        notify('Back button has been clicked!');
      },
    };

    this.refreshButtonOptions = {
      icon: 'refresh',
      onClick: () => {
        notify('Refresh button has been clicked!');
      },
    };

    this.selectBoxOptions = {
      width: 140,
      items: this.productTypes,
      valueExpr: 'id',
      displayExpr: 'text',
      value: this.productTypes[0].id,
      onValueChanged: (args) => {
        if (args.value > 1) {
          this.productsStore.filter('type', '=', args.value);
        } else {
          this.productsStore.filter(null);
        }
        this.productsStore.load();
      },
    };

    this.addButtonOptions = {
      icon: 'plus',
      onClick: () => {
        notify('Add button has been clicked!');
      },
    };

    this.saveButtonOptions = {
      text: 'Save',
      onClick: () => {
        notify('Save option has been clicked!');
      },
    };

    this.printButtonOptions = {
      text: 'Print',
      onClick: () => {
        notify('Print option has been clicked!');
      },
    };

    this.settingsButtonOptions = {
      text: 'Settings',
      onClick: () => {
        notify('Settings option has been clicked!');
      },
    };
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxListModule,
    DxToolbarModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
