import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxLinearGaugeModule, DxLinearGaugeTypes } from 'devextreme-angular/ui/linear-gauge';

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
  customizeText: DxLinearGaugeTypes.ScaleLabel['customizeText'] = ({ valueText }) => `${valueText} %`;
}

@NgModule({
  imports: [
    BrowserModule,
    DxLinearGaugeModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
