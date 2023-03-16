import { Component, NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import {
  DxPopupModule, DxButtonModule, DxScrollViewModule, DxTemplateModule,
} from 'devextreme-angular';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
})

export class AppComponent {
  popupVisible = false;

  popupScrollViewVisible = false;

  bookButtonOptions: any;

  showPopup() {
    this.popupVisible = true;
  }

  showPopupWithScrollView() {
    this.popupScrollViewVisible = true;
  }

  constructor() {
    this.bookButtonOptions = {
      width: 300,
      text: 'Book',
      type: 'default',
      onClick: () => {
        this.popupVisible = false;
        this.popupScrollViewVisible = false;
      },
    };
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxPopupModule,
    DxButtonModule,
    DxScrollViewModule,
    DxTemplateModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
