import { Component, NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxPopupModule, DxScrollViewModule, DxTemplateModule } from 'devextreme-angular';
import { DxButtonModule, DxButtonTypes } from 'devextreme-angular/ui/button';

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
})

export class AppComponent {
  popupVisible = false;

  popupWithScrollViewVisible = false;

  bookButtonOptions: DxButtonTypes.Properties = {
    width: 300,
    text: 'Book',
    type: 'default',
    stylingMode: 'contained',
    onClick: () => {
      this.popupVisible = false;
      this.popupWithScrollViewVisible = false;
    },
  };

  showPopup() {
    this.popupVisible = true;
  }

  showPopupWithScrollView() {
    this.popupWithScrollViewVisible = true;
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
