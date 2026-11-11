import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import {
  DxButtonModule, DxPopupModule, DxPopoverModule,
} from 'devextreme-angular';
import notify from 'devextreme/ui/notify';
import { Service, type House } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxButtonModule,
    DxPopupModule,
    DxPopoverModule,
    CurrencyPipe,
  ],
})
export class AppComponent {
  readonly houses = inject(Service).getHouses();

  readonly currentHouse = signal(this.houses[0]);

  readonly popupVisible = signal(false);

  readonly ADD_TO_FAVORITES = 'Add to Favorites';

  readonly REMOVE_FROM_FAVORITES = 'Remove from Favorites';

  showHouse(house: House) {
    this.currentHouse.set(house);
    this.popupVisible.set(true);
  }

  changeFavoriteState() {
    const currentHouse = this.currentHouse();
    const favoriteState = !currentHouse.Favorite;
    const message = `This item has been ${
      favoriteState ? 'added to' : 'removed from'
    } the Favorites list!`;
    currentHouse.Favorite = favoriteState;

    notify({
      message,
      width: 450,
    },
    favoriteState ? 'success' : 'error',
    2000);
  }
}

bootstrapApplication(AppComponent);
