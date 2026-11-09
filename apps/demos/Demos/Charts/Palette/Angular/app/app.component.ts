import { bootstrapApplication } from '@angular/platform-browser';
import {
  Component, computed, enableProdMode, inject, signal,
} from '@angular/core';
import { getPalette } from 'devextreme/viz/palette';
import { DxPieChartModule, DxSelectBoxModule } from 'devextreme-angular';
import { PaletteExtensionMode } from 'devextreme-angular/common/charts';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  preserveWhitespaces: true,
  imports: [
    DxPieChartModule,
    DxSelectBoxModule,
  ],
})

export class AppComponent {
  private readonly service = inject(Service);

  readonly data = this.service.getData();

  readonly paletteCollection = this.service.getPaletteCollection();

  readonly paletteExtensionModes = this.service.getPaletteExtensionModes();

  readonly palette = signal(this.paletteCollection[0]);

  readonly paletteExtensionMode = signal<PaletteExtensionMode>('blend');

  readonly baseColors = computed(() => getPalette(this.palette() as string).simpleSet);
}

bootstrapApplication(AppComponent);
