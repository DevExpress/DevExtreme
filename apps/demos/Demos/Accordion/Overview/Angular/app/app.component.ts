import {
  ChangeDetectionStrategy,
  Component,
  enableProdMode,
  provideZoneChangeDetection,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  DxAccordionModule, DxCheckBoxModule, DxSliderModule, DxTagBoxModule,
} from 'devextreme-angular';

import { Company, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxAccordionModule,
    DxCheckBoxModule,
    DxSliderModule,
    DxTagBoxModule,
  ],
})
export class AppComponent {
  companies: Company[];

  constructor(service: Service) {
    this.companies = service.getCompanies();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
