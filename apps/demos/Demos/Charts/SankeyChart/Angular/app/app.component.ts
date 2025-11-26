import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { DxSankeyModule, DxSankeyTypes } from 'devextreme-angular/ui/sankey';
import { Service, DataItem } from './app.service';

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
  providers: [Service],
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
  imports: [
    DxSankeyModule,
  ],
})
export class AppComponent {
  data: DataItem[];

  constructor(service: Service) {
    this.data = service.getData();
  }

  customizeLinkTooltip: DxSankeyTypes.Tooltip['customizeLinkTooltip'] = ({ source, target, weight }) => (
    {
      html: `<b>From:</b> ${source}<br/><b>To:</b> ${target}<br/><b>Weight:</b> ${weight}`,
    }
  );
}
bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true, runCoalescing: true }),
  ],
});
