import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import {
  DxAccordionModule,
  DxSelectBoxModule,
  DxMenuModule,
  DxTreeViewModule,
} from 'devextreme-angular';

import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxAccordionModule,
    DxSelectBoxModule,
    DxMenuModule,
    DxTreeViewModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly continents = this.service.getContinents();

  readonly europeCountries = this.service.getEuropeCountries();

  readonly languages: string[] = [
    'Arabic: Right-to-Left direction',
    'English: Left-to-Right direction',
  ];

  readonly rtlEnabled = signal(false);

  selectLanguage(e) {
    this.rtlEnabled.set(e.value === this.languages[0]);
  }
}

bootstrapApplication(AppComponent);
