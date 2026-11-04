import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxSankeyModule, DxSankeyTypes } from 'devextreme-angular/ui/sankey';
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
    DxSankeyModule,
  ],
})
export class AppComponent {
  readonly data = inject(Service).getData();

  readonly customizeLinkTooltip: DxSankeyTypes.Tooltip['customizeLinkTooltip'] = ({ source, target, weight }) => (
    {
      html: `<b>From:</b> ${source}<br/><b>To:</b> ${target}<br/><b>Weight:</b> ${weight}`,
    }
  );
}
bootstrapApplication(AppComponent);
