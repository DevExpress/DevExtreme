import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import {
  DxSelectBoxModule,
  DxLoadIndicatorModule,
} from 'devextreme-angular';

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
    DxLoadIndicatorModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly simpleProducts = this.service.getSimpleProducts();

  readonly products = this.service.getProducts();

  readonly isLoaded = signal(true);

  readonly selectedItem = signal(this.products[0]);

  readonly deferredProducts = {
    loadMode: 'raw',
    load: () => {
      this.isLoaded.set(false);
      const promise = new Promise((resolve) => {
        setTimeout(() => {
          resolve(this.simpleProducts);
          this.isLoaded.set(true);
        }, 3000);
      });

      return promise;
    },
  };
}

bootstrapApplication(AppComponent);
