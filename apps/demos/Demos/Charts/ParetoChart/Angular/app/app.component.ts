import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxChartModule } from 'devextreme-angular';
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
    DxChartModule,
  ],
})
export class AppComponent {
  readonly dataSource = inject(Service).getComplaintsData();

  readonly customizeTooltip = ({ points, argumentText }) => ({
    html: `<div><div class='tooltip-header'>${
      argumentText}</div>`
                + '<div class=\'tooltip-body\'><div class=\'series-name\'>'
                + `<span class='top-series-name'>${points[0].seriesName}</span>`
                + ': </div><div class=\'value-text\'>'
                + `<span class='top-series-value'>${points[0].valueText}</span>`
                + '</div><div class=\'series-name\'>'
                + `<span class='bottom-series-name'>${points[1].seriesName}</span>`
                + ': </div><div class=\'value-text\'>'
                + `<span class='bottom-series-value'>${points[1].valueText}</span>`
                + '% </div></div></div>',
  });

  readonly customizeLabelText = ({ valueText }) => `${valueText}%`;
}

bootstrapApplication(AppComponent);
