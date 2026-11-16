import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { DxMapModule } from 'devextreme-angular';
import { DxSelectBoxModule } from 'devextreme-angular/ui/select-box';
import type { DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import { Service } from './app.service';
import type { APIKey } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  preserveWhitespaces: true,
  imports: [
    DxMapModule,
    DxSelectBoxModule,
  ],
})

export class AppComponent {
  private readonly service = inject(Service);

  readonly routes = signal(this.service.getRoutes());

  readonly markers = this.service.getMarkers();

  readonly apiKey: APIKey = { azure: '6N8zuPkBsnfwniNAJkldM3cUgm3lXg3y9gkIKy59benICnnepK4DJQQJ99AIACYeBjFllM6LAAAgAZMPGFXE' };

  setMode(e: DxSelectBoxTypes.ValueChangedEvent) {
    this.routes.update((routes) => routes.map((item) => {
      item.mode = e.value;
      return item;
    }));
  }

  selectColor(e: DxSelectBoxTypes.ValueChangedEvent) {
    this.routes.update((routes) => routes.map((item) => {
      item.color = e.value;
      return item;
    }));
  }
}

bootstrapApplication(AppComponent);
