import {
  ChangeDetectorRef,
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

  selectedItems: Company[];

  multiple = false;

  collapsible = false;

  animationDuration = 300;

  constructor(service: Service, private changeDetectorRef: ChangeDetectorRef) {
    this.companies = service.getCompanies();
    this.selectedItems = [this.companies[0]];
  }

  onSelectedItemsChange(items: Company[]) {
    this.selectedItems = items;
    this.changeDetectorRef.detectChanges();
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
