import { bootstrapApplication } from '@angular/platform-browser';
import { Component, enableProdMode, inject } from '@angular/core';
import { DxRangeSelectorModule } from 'devextreme-angular';
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
    DxRangeSelectorModule,
  ],
})
export class AppComponent {
  private readonly service = inject(Service);

  readonly chemicalComposition = this.service.getChemicalComposition();

  readonly seriesSource = this.service.getSeries();

  readonly customizeText: DxChartTypes.ValueAxisLabel['customizeText'] = ({ valueText }) => `${valueText}%`;
}

bootstrapApplication(AppComponent);
