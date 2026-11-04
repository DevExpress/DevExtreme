import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxChartModule, DxChartTypes } from 'devextreme-angular/ui/chart';
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
  readonly title = 'Canadian Men’s National Ice Hockey Team\n at the World Championships';

  readonly iceHockeyStatistics = inject(Service).getIceHockeyStatistics();

  readonly customizePoint: DxChartTypes.Properties['customizePoint'] = ({ value }) => {
    const color = {
      1: 'gold',
      2: 'silver',
      3: 'bronse',
    }[value];

    if (color) {
      return { image: { url: `../../../../images/Charts/PointImage/icon-medal-${color}.png`, width: 20, height: 20 }, visible: true };
    }
    return null;
  };

  readonly customizeText: DxChartTypes.ValueAxisLabel['customizeText'] = ({ valueText }) => ({
    1: `${valueText}st place`,
    2: `${valueText}nd place`,
    3: `${valueText}rd place`,
  }[valueText] || `${valueText}th place`);
}

bootstrapApplication(AppComponent);
