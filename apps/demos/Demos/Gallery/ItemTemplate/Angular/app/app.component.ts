import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DxGalleryModule } from 'devextreme-angular';
import { Service, House } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxGalleryModule,
    CurrencyPipe,
  ],
})
export class AppComponent {
  dataSource: House[];

  constructor(service: Service) {
    this.dataSource = service.getHouses();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
