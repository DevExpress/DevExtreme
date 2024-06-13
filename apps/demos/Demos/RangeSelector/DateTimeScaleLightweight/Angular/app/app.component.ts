import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxRangeSelectorModule } from 'devextreme-angular';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

declare var __moduleName: string;
@Component({
  moduleId: __moduleName,
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  startValue: Date = new Date(2011, 1, 1);

  endValue: Date = new Date(2011, 6, 1);

  selectedStartValue: Date = new Date(2011, 1, 5);

  selectedEndValue: Date = new Date(2011, 2, 5);
}

@NgModule({
  imports: [
    BrowserModule,
    DxRangeSelectorModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
