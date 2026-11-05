import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DxTileViewModule, DxSelectBoxModule } from 'devextreme-angular';
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
    DxTileViewModule,
    DxSelectBoxModule,
    CurrencyPipe,
  ],
})
export class AppComponent {
  readonly homes = inject(Service).getHomes();
}

bootstrapApplication(AppComponent);
