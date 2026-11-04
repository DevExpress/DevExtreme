import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import notify from 'devextreme/ui/notify';
import { DxSelectBoxModule, DxTextBoxModule } from 'devextreme-angular';
import { ArrayStore } from 'devextreme-angular/common/data';
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
    DxSelectBoxModule,
    DxTextBoxModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly simpleProducts = this.service.getSimpleProducts();

  readonly products = this.service.getProducts();

  readonly data = new ArrayStore({
    data: this.products,
    key: 'ID',
  });

  onValueChanged({ value }: DxSelectBoxTypes.ValueChangedEvent) {
    notify(`The value is changed to: "${value}"`);
  }
}

bootstrapApplication(AppComponent);
