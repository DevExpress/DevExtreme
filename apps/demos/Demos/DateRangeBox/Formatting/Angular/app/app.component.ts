import { Component, NgModule, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxDateRangeBoxModule } from 'devextreme-angular';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

const msInDay = 1000 * 60 * 60 * 24;
const now = new Date();

declare var __moduleName: string;
@Component({
  moduleId: __moduleName,
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  startDate: Date = new Date(now.getTime() - msInDay * 3);

  endDate: Date = new Date(now.getTime() + msInDay * 3);
}

@NgModule({
  imports: [
    BrowserModule,    DxDateRangeBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})

export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
