import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxChartModule, DxChartTypes } from 'devextreme-angular/ui/chart';
import { Service, MedalsInfo } from './app.service';

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
  medalsInfo: MedalsInfo[];

  constructor(service: Service) {
    this.medalsInfo = service.getMedalsInfo();
  }

  pointClick({ target: point }: DxChartTypes.PointClickEvent) {
    if (point.isSelected()) {
      point.clearSelection();
    } else {
      point.select();
    }
  }
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
