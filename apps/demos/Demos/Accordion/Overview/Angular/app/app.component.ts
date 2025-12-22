import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  DxButtonModule, DxCheckBoxModule, DxSliderModule, DxTagBoxModule,
} from 'devextreme-angular';
import { DxAccordionModule, type DxAccordionTypes } from 'devextreme-angular/ui/accordion';

import { Company, Service } from './app.service';

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
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxAccordionModule,
    DxButtonModule,
    DxCheckBoxModule,
    DxSliderModule,
    DxTagBoxModule,
  ],
})
export class AppComponent {
  companies: Company[];

  height: DxAccordionTypes.Properties['height'] = 500;

  constructor(service: Service) {
    this.companies = service.getCompanies();
  }

  onResetClick() {
    this.height = undefined;
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
