import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import type { DxChartTypes } from 'devextreme-angular/ui/chart';
import { DxChartModule } from 'devextreme-angular';
import { Service } from './app.service';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [Service],
  imports: [
    DxChartModule,
  ],
})
export class AppComponent {
  readonly populationData = inject(Service).getPopulationData();

  readonly customizeTooltip = ({ valueText, percentText }: DxChartTypes.StackedPointInfo) => (
    {
      text: `${percentText} - ${valueText}`,
    }
  );
}

bootstrapApplication(AppComponent);
