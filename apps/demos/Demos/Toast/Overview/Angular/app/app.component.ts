import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxCheckBoxModule, DxToastModule } from 'devextreme-angular';
import type { DxCheckBoxTypes } from 'devextreme-angular/ui/check-box';
import { Service } from './app.service';
import type { Product } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxCheckBoxModule,
    DxToastModule,
  ],
})
export class AppComponent {
  readonly products = inject(Service).getProducts();

  readonly isVisible = signal(false);

  readonly type = signal('info');

  readonly message = signal('');

  checkAvailable({ value }: DxCheckBoxTypes.ValueChangedEvent, product: Product) {
    this.type.set(value ? 'success' : 'error');
    this.message.set(product.Name + (value ? ' is available' : ' is not available'));
    this.isVisible.set(true);
  }
}

bootstrapApplication(AppComponent);
