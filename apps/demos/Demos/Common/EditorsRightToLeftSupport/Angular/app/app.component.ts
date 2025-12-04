import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import {
  DxSelectBoxModule,
  DxCheckBoxModule,
  DxTextBoxModule,
  DxTextAreaModule,
  DxNumberBoxModule,
  DxTagBoxModule,
  DxSwitchModule,
  DxAutocompleteModule,
} from 'devextreme-angular';

import { Service, Country } from './app.service';

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
  providers: [Service],
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  imports: [
    DxSelectBoxModule,
    DxAutocompleteModule,
    DxCheckBoxModule,
    DxSwitchModule,
    DxTextAreaModule,
    DxTextBoxModule,
    DxNumberBoxModule,
    DxTagBoxModule,
  ],
})

export class AppComponent {
  languages: string[] = [
    'Arabic: Right-to-Left direction',
    'English: Left-to-Right direction',
  ];

  displayExpr = 'nameEn';

  rtlEnabled = false;

  textValue = 'text';

  europeanUnion: Country[];

  constructor(service: Service) {
    this.europeanUnion = service.getCountries();
  }

  onLanguageChanged(data) {
    const isRTL = data.value === this.languages[0];
    this.displayExpr = isRTL ? 'nameAr' : 'nameEn';
    this.rtlEnabled = isRTL;
    this.textValue = isRTL ? 'نص' : 'text';
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
