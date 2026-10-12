import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { DxMultiViewModule, DxCheckBoxModule } from 'devextreme-angular';

import { Company, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxMultiViewModule,
    DxCheckBoxModule,
  ],
})
export class AppComponent {
  companies: Company[];

  itemCount: number;

  selectedIndex = 0;

  loop = false;

  animationEnabled = true;

  constructor(service: Service) {
    this.companies = service.getCompanies();
    this.itemCount = this.companies.length;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
