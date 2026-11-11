import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxMapModule, DxSelectBoxModule } from 'devextreme-angular';

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

  readonly mapTypes = this.service.getMapTypes();

  readonly mapProviders = this.service.getMapProviders();

  readonly apiKey: APIKey = {
    azure: '6N8zuPkBsnfwniNAJkldM3cUgm3lXg3y9gkIKy59benICnnepK4DJQQJ99AIACYeBjFllM6LAAAgAZMPGFXE',
    bing: 'Aq3LKP2BOmzWY47TZoT1YdieypN_rB6RY9FqBfx-MDCKjvvWBbT68R51xwbL-AqC',
    google: 'AIzaSyBIw1-l1otL9v1bY-OR4p9w21l1VLu9L2k',
  };
}

bootstrapApplication(AppComponent);
