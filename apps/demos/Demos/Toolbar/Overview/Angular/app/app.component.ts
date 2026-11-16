import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxListModule, DxToolbarModule } from 'devextreme-angular';
import 'devextreme/ui/select_box';
import { DataSource } from 'devextreme-angular/common/data';
import notify from 'devextreme/ui/notify';
import type { DxButtonTypes } from 'devextreme-angular/ui/button';
import type { DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
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
    DxListModule,
    DxToolbarModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  private readonly productTypes = this.service.getProductTypes();

  readonly productsStore = new DataSource(this.service.getProducts());

  readonly selectBoxOptions: DxSelectBoxTypes.Properties = {
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

  readonly backButtonOptions: DxButtonTypes.Properties = {
    icon: 'back',
    onClick: () => {
      notify('Back button has been clicked!');
    },
  };

  readonly refreshButtonOptions: DxButtonTypes.Properties = {
    icon: 'refresh',
    onClick: () => {
      notify('Refresh button has been clicked!');
    },
  };

  readonly addButtonOptions: DxButtonTypes.Properties = {
    icon: 'plus',
    onClick: () => {
      notify('Add button has been clicked!');
    },
  };

  readonly saveButtonOptions: DxButtonTypes.Properties = {
    text: 'Save',
    onClick: () => {
      notify('Save option has been clicked!');
    },
  };

  readonly printButtonOptions: DxButtonTypes.Properties = {
    text: 'Print',
    onClick: () => {
      notify('Print option has been clicked!');
    },
  };

  readonly settingsButtonOptions: DxButtonTypes.Properties = {
    text: 'Settings',
    onClick: () => {
      notify('Settings option has been clicked!');
    },
  };
}

bootstrapApplication(AppComponent);
