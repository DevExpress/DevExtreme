import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import {
  DxButtonModule, DxPopupModule, DxPopoverModule,
} from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { Service, House } from './app.service';

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
  imports: [
    DxButtonModule,
    DxPopupModule,
    DxPopoverModule,
    CurrencyPipe,
  ],
})
export class AppComponent {
  houses: House[];

  currentHouse: House;

  popupVisible = false;

  ADD_TO_FAVORITES = 'Add to Favorites';

  REMOVE_FROM_FAVORITES = 'Remove from Favorites';

  constructor(service: Service) {
    this.houses = service.getHouses();
    this.currentHouse = this.houses[0];
  }

  showHouse(house: House) {
    this.currentHouse = house;
    this.popupVisible = true;
  }

  changeFavoriteState() {
    const favoriteState = !this.currentHouse.Favorite;
    const message = `This item has been ${
      favoriteState ? 'added to' : 'removed from'
    } the Favorites list!`;
    this.currentHouse.Favorite = favoriteState;

    notify({
      message,
      width: 450,
    },
    favoriteState ? 'success' : 'error',
    2000);
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
