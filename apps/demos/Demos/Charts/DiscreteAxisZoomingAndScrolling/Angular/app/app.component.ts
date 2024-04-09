import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { DxRangeSelectorModule } from 'devextreme-angular';
import { DxChartModule, DxChartTypes } from 'devextreme-angular/ui/chart';
import { Service, ChemicalComposition, SerieDescription } from './app.service';

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
  chemicalComposition: ChemicalComposition[];

  seriesSource: SerieDescription[];

  constructor(service: Service) {
    this.chemicalComposition = service.getChemicalComposition();
    this.seriesSource = service.getSeries();
  }

  customizeText: DxChartTypes.ValueAxisLabel['customizeText'] = ({ valueText }) => `${valueText}%`;
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxChartModule,
    DxRangeSelectorModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
