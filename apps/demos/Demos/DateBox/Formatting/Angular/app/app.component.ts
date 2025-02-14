import { Component, NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDateBoxModule } from 'devextreme-angular';

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
  date: Date = new Date(2018, 9, 16, 15, 8, 12);
}

@NgModule({
  imports: [
    BrowserModule,
    DxDateBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
