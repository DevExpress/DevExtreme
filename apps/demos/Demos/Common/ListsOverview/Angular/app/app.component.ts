import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, enableProdMode, inject, signal,
} from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DxTileViewModule, DxButtonModule, DxListModule } from 'devextreme-angular';

import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  preserveWhitespaces: true,
  imports: [
    DxTileViewModule,
    DxButtonModule,
    DxListModule,
    CurrencyPipe,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly dataSource = this.service.getDataSource();

  readonly currentHotel = signal(this.service.getFirstHotel());

  listSelectionChanged(e) {
    this.currentHotel.set(e.addedItems[0]);
  }
}

bootstrapApplication(AppComponent);
