import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxFunnelModule } from 'devextreme-angular';
import { itemInfo, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

declare var __moduleName: string;
@Component({
  moduleId: __moduleName,
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
})
export class AppComponent {
  data: itemInfo[];

  constructor(service: Service) {
    this.data = service.getData();
  }

  customizeText = ({ percentText, item: { argument } }) => `<span style='font-size: 28px'>${percentText}</span><br/>${argument}`;
}

@NgModule({
  imports: [
    BrowserModule,
    DxFunnelModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
