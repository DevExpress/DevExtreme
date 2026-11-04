import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxTagBoxModule, DxTagBoxTypes } from 'devextreme-angular/ui/tag-box';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxTagBoxModule,
  ],
})

export class AppComponent {
  readonly products = inject(Service).getProducts();

  readonly slicedProducts = this.products.slice(0, 5);

  onMultiTagPreparing(args: DxTagBoxTypes.MultiTagPreparingEvent) {
    const selectedItemsLength = args.selectedItems.length;
    const totalCount = 5;

    if (selectedItemsLength < totalCount) {
      args.cancel = true;
    } else {
      args.text = `All selected (${selectedItemsLength})`;
    }
  }
}

bootstrapApplication(AppComponent);
