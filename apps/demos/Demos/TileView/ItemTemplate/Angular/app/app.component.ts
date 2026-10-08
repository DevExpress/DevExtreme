import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DxTileViewModule, DxSelectBoxModule } from 'devextreme-angular';
import { Home, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxTileViewModule,
    DxSelectBoxModule,
    CurrencyPipe,
  ],
})
export class AppComponent {
  homes: Home[];

  constructor(service: Service) {
    this.homes = service.getHomes();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
