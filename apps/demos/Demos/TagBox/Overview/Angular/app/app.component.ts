import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxTagBoxModule, DxPopoverModule } from 'devextreme-angular';
import { ArrayStore } from 'devextreme-angular/common/data';
import type { DxTagBoxTypes } from 'devextreme-angular/ui/tag-box';
import { Service, type Product } from './app.service';

if (!document.location.host.includes('localhost')) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxTagBoxModule,
    DxPopoverModule,
  ],
})

export class AppComponent {
  private readonly service = inject(Service);

  readonly dataSource = new ArrayStore({
    data: this.service.getProducts(),
    key: 'Id',
  });

  readonly simpleProducts = this.service.getSimpleProducts();

  readonly editableProducts = this.simpleProducts.slice();

  readonly value = [1, 2];

  readonly product = signal<Product>(null);

  readonly target = signal<EventTarget>(null);

  readonly visible = signal(false);

  onCustomItemCreating(args: DxTagBoxTypes.CustomItemCreatingEvent) {
    const newValue = args.text;
    const isItemInDataSource = this.editableProducts.some((item) => item === newValue);
    if (!isItemInDataSource) {
      this.editableProducts.unshift(newValue);
    }
    args.customItem = newValue;
  }

  onMouseEnter({ target }: MouseEvent, product: Product) {
    this.target.set(target);
    this.product.set(product);
    this.visible.set(true);
  }

  onMouseLeave() {
    this.target.set(null);
    this.visible.set(false);
  }

  isDisabled(product: Product) {
    return product.Name === 'SuperHD Video Player';
  }

  getAltText(text: String) {
    return `${text}. Picture`;
  }
}

bootstrapApplication(AppComponent);
