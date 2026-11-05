import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, computed, enableProdMode, inject, signal,
} from '@angular/core';
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

import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
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
  readonly languages: string[] = [
    'Arabic: Right-to-Left direction',
    'English: Left-to-Right direction',
  ];

  readonly rtlEnabled = signal(false);

  readonly displayExpr = computed(() => (this.rtlEnabled() ? 'nameAr' : 'nameEn'));

  readonly textValue = computed(() => (this.rtlEnabled() ? 'نص' : 'text'));

  readonly europeanUnion = inject(Service).getCountries();

  onLanguageChanged(data) {
    this.rtlEnabled.set(data.value === this.languages[0]);
  }
}

bootstrapApplication(AppComponent);
