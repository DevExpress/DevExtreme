import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, signal } from '@angular/core';
import { DxNumberBoxModule } from 'devextreme-angular/ui/number-box';
import type { DxNumberBoxTypes } from 'devextreme-angular/ui/number-box';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  imports: [
    DxNumberBoxModule,
  ],
})
export class AppComponent {
  readonly maxSales = 30;

  readonly sales = signal(16);

  keyDown(e: DxNumberBoxTypes.KeyDownEvent) {
    const { event } = e;
    if (event && /^[.,e]$/.test(event.key)) {
      event.preventDefault();
    }
  }
}

bootstrapApplication(AppComponent);
