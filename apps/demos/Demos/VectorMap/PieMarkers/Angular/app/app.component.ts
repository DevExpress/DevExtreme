import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxVectorMapModule } from 'devextreme-angular';
import * as mapsData from 'devextreme-dist/js/vectormap-data/world.js';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  providers: [Service],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    DxVectorMapModule,
  ],
})

export class AppComponent {
  private readonly service = inject(Service);

  readonly worldMap = mapsData.world;

  readonly markers = this.service.getMarkers();

  private readonly names = this.service.getNames();

  readonly customizeText = ({ index }: { index: number }) => this.names[index];

  readonly customizeTooltip = ({ layer, attribute }: { layer: Record<string, string>, attribute: Function }) => ((layer.type === 'marker')
    ? { text: attribute('tooltip') }
    : undefined);
}

bootstrapApplication(AppComponent);
