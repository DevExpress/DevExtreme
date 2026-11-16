import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, computed, enableProdMode, inject, signal,
} from '@angular/core';
import {
  DxTabPanelModule,
  DxTreeViewModule,
} from 'devextreme-angular';

import { type Country, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxTabPanelModule,
    DxTreeViewModule,
  ],
})

export class AppComponent {
  readonly continents = inject(Service).getContinents();

  readonly countryData = signal<Country>(this.continents[0].items[0]);

  readonly citiesData = computed(() => this.countryData().cities);

  readonly tabPanelIndex = signal(0);

  changeSelection(e) {
    const countryData = e.itemData;
    if (countryData.cities) {
      this.countryData.set(e.itemData);
      this.tabPanelIndex.set(0);
    }
  }
}

bootstrapApplication(AppComponent);
