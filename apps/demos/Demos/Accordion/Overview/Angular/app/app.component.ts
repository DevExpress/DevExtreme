import {
  Component,
  enableProdMode,
  inject,
  signal,
} from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  DxAccordionModule, DxCheckBoxModule, DxSliderModule, DxTagBoxModule,
} from 'devextreme-angular';

import { type Company, Service } from './app.service';

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
    DxAccordionModule,
    DxCheckBoxModule,
    DxSliderModule,
    DxTagBoxModule,
  ],
})
export class AppComponent {
  readonly companies = inject(Service).getCompanies();

  readonly selectedItems = signal<Company[]>([this.companies[0]]);

  readonly multiple = signal(false);

  readonly collapsible = signal(false);

  readonly animationDuration = signal(300);

  onSelectedItemsChange(items: Company[]) {
    this.selectedItems.set(items);
  }
}

bootstrapApplication(AppComponent);
