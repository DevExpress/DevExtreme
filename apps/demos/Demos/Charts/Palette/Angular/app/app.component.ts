import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { getPalette } from 'devextreme/viz/palette';
import { DxPieChartModule, DxSelectBoxModule } from 'devextreme-angular';
import { Palette, PaletteExtensionMode } from 'devextreme-angular/common/charts';
import { DataItem, Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config?.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxPieChartModule,
    DxSelectBoxModule,
  ],
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

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
