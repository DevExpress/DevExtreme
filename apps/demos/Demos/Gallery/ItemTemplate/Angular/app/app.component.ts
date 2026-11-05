import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DxGalleryModule } from 'devextreme-angular';
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
    DxGalleryModule,
    CurrencyPipe,
  ],
})
export class AppComponent {
  readonly dataSource = inject(Service).getHouses();
}

bootstrapApplication(AppComponent);
