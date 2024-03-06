import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxChartModule } from 'devextreme-angular';
import { Service, RelativeMass } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
})
export class AppComponent {
  relativeMasses: RelativeMass[];

  constructor(service: Service) {
    this.relativeMasses = service.getRelativeMasses();
  }

  customizePoint = ({ data: { type } }) => (
    {
      Star: {
        color: 'red',
        hoverStyle: { border: { color: 'red' } },
      },
      Satellite: {
        color: 'gray',
        hoverStyle: { border: { color: 'gray' } },
      },
    }[type]);
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxChartModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
