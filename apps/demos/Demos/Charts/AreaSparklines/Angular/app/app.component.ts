import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxSparklineModule } from 'devextreme-angular';
import { CostInfo, Service } from './app.service';

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
  copperCosts: CostInfo[];

  nickelCosts: CostInfo[];

  palladiumCosts: CostInfo[];

  years: Array<number>;

  constructor(service: Service) {
    this.copperCosts = service.getCopperCosts();
    this.nickelCosts = service.getNickelCosts();
    this.palladiumCosts = service.getPalladiumCosts();
    this.years = [2010, 2011, 2012];
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxSparklineModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
