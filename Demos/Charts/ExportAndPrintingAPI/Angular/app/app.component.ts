import {
  NgModule, Component, ViewChild, enableProdMode,
} from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxChartModule, DxChartComponent, DxButtonModule } from 'devextreme-angular';

import { Service, Mountain } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  preserveWhitespaces: true,
})
export class AppComponent {
  @ViewChild(DxChartComponent, { static: false }) chart: DxChartComponent;

  mountains: Mountain[];

  constructor(service: Service) {
    this.mountains = service.getMountains();
  }

  customizeTooltip(arg: any) {
    return {
      text: `<span class='title'>${arg.argumentText}</span><br />&nbsp;<br />`
                + `System: ${arg.point.data.system}<br />` + `Height: ${
        arg.valueText} m`,
    };
  }

  customizeLabel(arg: any) {
    return `${arg.value} m`;
  }

  print() {
    this.chart.instance.print();
  }

  export() {
    this.chart.instance.exportTo('Example', 'png');
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxChartModule,
    DxButtonModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
