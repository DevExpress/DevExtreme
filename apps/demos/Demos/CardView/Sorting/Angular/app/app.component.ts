import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxCardViewModule } from 'devextreme-angular';
import { House, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  providers: [Service],
  imports: [
    DxCardViewModule,
  ],
})
export class AppComponent {
  houses: House[];

  imageExpr({ ID }: House): string {
    return `../../../../images/houses/${ID}.jpg`;
  }

  altExpr(): string {
    return 'Photo of the house';
  }

  constructor(service: Service) {
    this.houses = service.getHouses();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
