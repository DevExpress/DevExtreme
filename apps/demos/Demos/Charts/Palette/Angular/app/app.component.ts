import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { getPalette } from 'devextreme/viz/palette';
import { DxPieChartModule, DxSelectBoxModule } from 'devextreme-angular';
import { Palette, PaletteExtensionMode } from 'devextreme-angular/common/charts';
import { DataItem, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: 'app/app.component.html',
  styleUrls: ['app/app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
})

export class AppComponent {
  data: DataItem[];

  paletteCollection: Palette[];

  paletteExtensionModes: PaletteExtensionMode[];

  palette: Palette;

  paletteExtensionMode: PaletteExtensionMode = 'blend';

  constructor(service: Service) {
    this.data = service.getData();
    this.paletteExtensionModes = service.getPaletteExtensionModes();
    this.paletteCollection = service.getPaletteCollection();
    this.palette = this.paletteCollection[0];
  }

  get baseColors() {
    return getPalette(this.palette as string).simpleSet;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    BrowserTransferStateModule,
    DxPieChartModule,
    DxSelectBoxModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
